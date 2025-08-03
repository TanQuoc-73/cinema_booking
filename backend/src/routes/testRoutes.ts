// src/routes/testRoutes.ts
import { Router } from 'express';
import { supabase } from '../config/supabaseClient';

const router = Router();

router.get('/supabase-status', async (req, res) => {
  try {

    // const { data, error } = await supabase.from('movies').select('*').limit(10);
    
    // if (error) {
    //   return res.status(500).json({ message: 'Supabase connected but query error', error: error.message });
    // }
    
    // return res.json({ message: 'Supabase connected successfully', data });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error connecting to Supabase', error: error.message });
  }
});

export default router;
