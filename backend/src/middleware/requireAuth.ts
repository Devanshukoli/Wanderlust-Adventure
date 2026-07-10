import { NextFunction, Request, Response } from 'express';
import { User } from '@supabase/supabase-js';
import { supabaseAuth } from '../lib/supabase';

declare global {
  namespace Express {
    interface Request {
      authUser?: User;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;

  if (!token) {
    return res.status(401).json({ error: 'Please sign in before continuing to checkout.' });
  }

  const { data, error } = await supabaseAuth.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: 'Your sign-in session is invalid or expired. Please sign in again.' });
  }

  req.authUser = data.user;
  next();
}
