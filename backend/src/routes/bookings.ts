import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { supabase } from '../lib/supabase';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set. Check your .env file.');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-06-24.dahlia',
});

router.post('/', requireAuth, async (req: Request, res: Response) => {
  const { packageId, travelerName, travelerEmail, numTravelers, travelDate } = req.body;

  if (!packageId || !travelerName || !travelerEmail || !numTravelers || !travelDate) {
    return res.status(400).json({ error: 'Missing required booking fields.' });
  }

  const { data: pkg, error: pkgError } = await supabase
    .from('travel_packages')
    .select('id, title, price_cents, currency, is_active')
    .eq('id', packageId)
    .single();

  if (pkgError || !pkg || !pkg.is_active) {
    return res.status(404).json({ error: 'Package not found or unavailable.' });
  }

  const amountCents = pkg.price_cents * Number(numTravelers);

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      package_id: pkg.id,
      traveler_name: travelerName,
      traveler_email: travelerEmail,
      num_travelers: numTravelers,
      travel_date: travelDate,
      amount_cents: amountCents,
      currency: pkg.currency,
      status: 'pending',
    })
    .select()
    .single();

  if (bookingError || !booking) {
    console.error('Failed to create booking:', bookingError);
    return res.status(500).json({ error: 'Could not create booking.' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountCents,
        currency: pkg.currency,
        automatic_payment_methods: { enabled: true },
        description: `${pkg.title} - ${numTravelers} traveler(s)`,
        metadata: { booking_id: booking.id },
      },
      { idempotencyKey: req.headers['idempotency-key'] as string | undefined }
    );

    await supabase
      .from('bookings')
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq('id', booking.id);

    res.json({ bookingId: booking.id, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe PaymentIntent creation failed:', err);
    await supabase.from('bookings').update({ status: 'failed' }).eq('id', booking.id);
    res.status(500).json({ error: 'Could not initialize payment.' });
  }
});

export default router;
