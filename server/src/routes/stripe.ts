
import express from 'express';

const router = express.Router();

// Redirect stripe endpoints to Supabase edge function
router.use('/stripe/*', (req, res) => {
  const supabaseUrl = 'https://fgpmeulzlrdgnlmibjkm.supabase.co/functions/v1/stripe-api';
  const path = req.path.replace('/stripe', '');
  
  res.redirect(307, `${supabaseUrl}${path}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`);
});

export { router as stripeRoutes };
