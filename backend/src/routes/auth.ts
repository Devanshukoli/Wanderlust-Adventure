import crypto from 'crypto';
import { Router, Request, Response } from 'express';
import { Session } from '@supabase/supabase-js';
import { supabaseAuth } from '../lib/supabase';

const router = Router();
const googleAuthorizeUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
const googleTokenUrl = 'https://oauth2.googleapis.com/token';
const maxStateAgeMs = 10 * 60 * 1000;

type AuthState = {
  redirect: string;
  createdAt: number;
};

type GoogleTokenResponse = {
  id_token?: string;
  error?: string;
  error_description?: string;
};

function getFrontendUrl() {
  return process.env.FRONTEND_URL || 'http://localhost:5173';
}

function getFrontendOrigin() {
  return new URL(getFrontendUrl()).origin;
}

function getBackendUrl(req: Request) {
  return process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
}

function getGoogleRedirectUri(req: Request) {
  return process.env.GOOGLE_REDIRECT_URI || `${getBackendUrl(req)}/api/auth/google/callback`;
}

function getStateSecret() {
  return process.env.GOOGLE_OAUTH_STATE_SECRET || process.env.GOOGLE_CLIENT_SECRET;
}

function requireGoogleConfig() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set. Check your backend .env file.');
  }

  if (!getStateSecret()) {
    throw new Error('GOOGLE_OAUTH_STATE_SECRET or GOOGLE_CLIENT_SECRET must be set. Check your backend .env file.');
  }
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sanitizeRedirect(value: unknown) {
  if (typeof value !== 'string' || value.length === 0) return '/checkout';

  if (value.startsWith('/')) return value;

  try {
    const url = new URL(value);
    if (url.origin === getFrontendOrigin()) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return '/checkout';
  }

  return '/checkout';
}

function signPayload(payload: string) {
  const secret = getStateSecret();
  if (!secret) throw new Error('OAuth state secret is not configured.');

  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function createState(redirect: string) {
  const payload = base64UrlEncode(JSON.stringify({ redirect, createdAt: Date.now() } satisfies AuthState));
  return `${payload}.${signPayload(payload)}`;
}

function readState(state: unknown) {
  if (typeof state !== 'string') throw new Error('Missing OAuth state.');

  const [payload, signature] = state.split('.');
  if (!payload || !signature || signature !== signPayload(payload)) {
    throw new Error('Invalid OAuth state.');
  }

  const parsed = JSON.parse(base64UrlDecode(payload)) as AuthState;
  if (!parsed.createdAt || Date.now() - parsed.createdAt > maxStateAgeMs) {
    throw new Error('OAuth state expired.');
  }

  return parsed;
}

function sessionResponse(session: Session | null) {
  if (!session) {
    throw new Error('Authentication succeeded, but no session was returned.');
  }

  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    expires_in: session.expires_in,
    token_type: session.token_type,
    user: {
      id: session.user.id,
      email: session.user.email,
    },
  };
}

function redirectWithError(res: Response, message: string) {
  const url = new URL('/sign-in', getFrontendUrl());
  url.searchParams.set('auth_error', message);
  return res.redirect(url.toString());
}

function redirectWithSession(res: Response, redirectPath: string, session: Session) {
  const url = new URL(redirectPath, getFrontendUrl());
  const hash = new URLSearchParams({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    token_type: session.token_type,
    expires_in: String(session.expires_in),
  });

  if (session.expires_at) {
    hash.set('expires_at', String(session.expires_at));
  }

  url.hash = hash.toString();
  return res.redirect(url.toString());
}

router.post('/sign-in', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.json(sessionResponse(data.session));
});

router.post('/sign-up', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const { data, error } = await supabaseAuth.auth.signUp({ email, password });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(sessionResponse(data.session));
});

router.get('/google', (req: Request, res: Response) => {
  requireGoogleConfig();

  const redirect = sanitizeRedirect(req.query.redirect);
  const url = new URL(googleAuthorizeUrl);

  url.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID as string);
  url.searchParams.set('redirect_uri', getGoogleRedirectUri(req));
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', createState(redirect));
  url.searchParams.set('prompt', 'select_account');

  res.redirect(url.toString());
});

router.get('/google/callback', async (req: Request, res: Response) => {
  try {
    requireGoogleConfig();

    if (typeof req.query.error === 'string') {
      return redirectWithError(res, req.query.error);
    }

    const code = typeof req.query.code === 'string' ? req.query.code : null;
    if (!code) {
      return redirectWithError(res, 'Google sign-in did not return an authorization code.');
    }

    const state = readState(req.query.state);
    const tokenResponse = await fetch(googleTokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: getGoogleRedirectUri(req),
        grant_type: 'authorization_code',
      }),
    });

    const tokenBody = (await tokenResponse.json()) as GoogleTokenResponse;
    if (!tokenResponse.ok || !tokenBody.id_token) {
      return redirectWithError(res, tokenBody.error_description || tokenBody.error || 'Google sign-in failed.');
    }

    const { data, error } = await supabaseAuth.auth.signInWithIdToken({
      provider: 'google',
      token: tokenBody.id_token,
    });

    if (error || !data.session) {
      return redirectWithError(res, error?.message || 'Could not create a Supabase session.');
    }

    return redirectWithSession(res, state.redirect, data.session);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Google sign-in failed.';
    return redirectWithError(res, message);
  }
});

export default router;
