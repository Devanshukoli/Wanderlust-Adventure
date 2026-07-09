'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/checkout/success` },
    });

    if (error) setMessage(error.message ?? 'Something went wrong.');
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <AddressElement options={{ mode: 'billing', fields: { phone: 'never' } }} />
      <PaymentElement />
      {message && <p className="text-sm text-red-600">{message}</p>}
      <Button type="submit" disabled={!stripe || isProcessing} className="w-full">
        {isProcessing ? 'Processing...' : 'Pay now'}
      </Button>
    </form>
  );
}

function CheckoutInner() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get('client_secret');

  if (!clientSecret) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <p>No booking found. Please start from a destination page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">Checkout</h1>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center">Loading...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}