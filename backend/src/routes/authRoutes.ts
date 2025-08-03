import { Router } from 'express';
import { supabase } from '../config/supabaseClient';

const router = Router();

router.post("/login/google", async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    // Xác thực token với Supabase
    const { data, error } = await supabase.auth.getUser(access_token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid access token" });
    }

    // Ở đây bạn có thể tạo session hoặc token riêng cho app của mình
    return res.json({ user: data.user });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
