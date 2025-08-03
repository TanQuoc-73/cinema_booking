'use client';

import React, { useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';

import { useUserSession } from '@/hooks/useUserSession';

export default function LoginForm() {
  const { userSession, loading: sessionLoading, error: sessionError } = useUserSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }
    // success: supabase auth state changes will update userSession via hook
    setLoading(false);
    setEmail('');
    setPassword('');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Loading session
  if (sessionLoading) {
    return <Typography textAlign="center">Loading...</Typography>;
  }

  // If logged in, show user info and logout button
  if (userSession) {
    return (
      <Box sx={{ p: 3, maxWidth: 320, margin: '0 auto' }}>
        <Typography variant="h6" mb={2}>
          Xin chào, {userSession.email}
        </Typography>
        <Typography variant="body2" mb={2}>
          Role: {userSession.role || 'user'}
        </Typography>
        <Button variant="contained" color="error" fullWidth onClick={handleLogout}>
          Đăng xuất
        </Button>
      </Box>
    );
  }

  // Nếu chưa đăng nhập, show form login
  return (
    <Box component="form" onSubmit={handleLogin} sx={{ p: 3, maxWidth: 320, margin: '0 auto' }}>
      <Typography variant="h6" mb={2} textAlign="center">Đăng nhập</Typography>

      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

      {sessionError && <Alert severity="error" sx={{ mb: 2 }}>{sessionError}</Alert>}

      <TextField
        label="Email"
        type="email"
        value={email}
        required
        fullWidth
        margin="normal"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Mật khẩu"
        type="password"
        value={password}
        required
        fullWidth
        margin="normal"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>
    </Box>
  );
}
