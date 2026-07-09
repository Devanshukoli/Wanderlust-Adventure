import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('travel_packages')
    .select('id, slug, title, description, image_url, price_cents, currency, duration_days')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to fetch travel packages:', error);
    return res.status(500).json({ error: 'Could not load destinations.' });
  }
  res.json(data);
});

router.get('/:slug', async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('travel_packages')
    .select('*')
    .eq('slug', req.params.slug)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'Destination not found.' });
  }
  res.json(data);
});

export default router;