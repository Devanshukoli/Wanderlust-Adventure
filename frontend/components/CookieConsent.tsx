'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 transition-transform duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{' '}
              <a href="/privacy-policy" className="text-primary underline hover:text-primary/90" target='_blank'>
                Learn more
              </a>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={acceptCookies} variant="default" size="sm">
              Accept
            </Button>
            <button onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}