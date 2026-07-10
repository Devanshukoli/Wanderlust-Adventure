'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';

function SignInInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, isLoading, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(searchParams.get('auth_error'));

  const redirectPath = useMemo(() => {
    const requested = searchParams.get('redirect') || '/checkout';
    return requested.startsWith('/') ? requested : '/checkout';
  }, [searchParams]);

  useEffect(() => {
    if (!isLoading && session) router.replace(redirectPath);
  }, [isLoading, redirectPath, router, session]);

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isCreatingAccount) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      router.replace(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign you in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle(redirectPath);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4">
      <div className="mx-auto max-w-md rounded-lg border bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Sign in to continue</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please sign in before checking out. We will send you straight back to your checkout page afterward.
        </p>

        <Button type="button" variant="outline" className="mt-6 w-full" onClick={handleGoogleSignIn}>
          Continue with Google
        </Button>

        <div className="my-6 flex items-center gap-3 text-xs uppercase text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>

        <form className="space-y-4" onSubmit={handleEmailAuth}>
          <Input type="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Please wait...' : isCreatingAccount ? 'Create account' : 'Sign in'}
          </Button>
        </form>

        <button
          type="button"
          className="mt-4 w-full text-sm text-primary underline-offset-4 hover:underline"
          onClick={() => setIsCreatingAccount((current) => !current)}
        >
          {isCreatingAccount ? 'Already have an account? Sign in' : 'Need an account? Create one'}
        </button>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center">Loading...</div>}>
      <SignInInner />
    </Suspense>
  );
}
