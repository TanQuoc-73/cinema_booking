'use client';

import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface LoginFormProps {
  onLoginSuccess?: () => void; // Callback khi đăng nhập thành công
}

const RED = '#d32f2f';

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        router.push('/');
      }
    }

    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
    // Sau đăng nhập Google thành công Supabase tự redirect
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        p: 4,
        width: 360,
        bgcolor: '#121212', // nền đen đậm
        borderRadius: 3,
        boxShadow: `0 0 16px ${RED}`,
        color: 'white',
        userSelect: 'none',
      }}
      noValidate
      autoComplete="off"
    >
      <Typography
        variant="h5"
        mb={3}
        textAlign="center"
        sx={{ color: RED, fontWeight: 'bold', letterSpacing: 2 }}
      >
        Đăng nhập
      </Typography>

      {errorMsg && (
        <Alert
          severity="error"
          sx={{ mb: 2, bgcolor: 'rgba(211,47,47,0.2)', color: RED }}
          variant="filled"
        >
          {errorMsg}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        margin="dense"
        autoFocus
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon sx={{ color: RED }} />
            </InputAdornment>
          ),
          sx: {
            bgcolor: '#1e1e1e',
            borderRadius: 1,
            input: { color: 'white' },
            '& .MuiInputLabel-root': { color: RED },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: RED,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ff6659',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: RED,
            },
          },
        }}
      />

      <TextField
        label="Mật khẩu"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        margin="dense"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: RED }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onClick={toggleShowPassword}
                edge="end"
                sx={{ color: RED }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            bgcolor: '#1e1e1e',
            borderRadius: 1,
            input: { color: 'white' },
            '& .MuiInputLabel-root': { color: RED },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: RED,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ff6659',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: RED,
            },
          },
        }}
      />

      <Button
        type="submit"
        disabled={loading}
        variant="contained"
        fullWidth
        sx={{
          mt: 3,
          bgcolor: RED,
          '&:hover': { bgcolor: '#b71c1c' },
          fontWeight: 'bold',
          letterSpacing: 1.2,
        }}
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>

      <Button
        variant="outlined"
        fullWidth
        onClick={signInWithGoogle}
        disabled={loading}
        sx={{
          mt: 2,
          borderColor: RED,
          color: RED,
          fontWeight: 'bold',
          letterSpacing: 1.2,
          '&:hover': {
            backgroundColor: 'rgba(211,47,47,0.15)',
            borderColor: '#b71c1c',
            color: '#b71c1c',
          },
        }}
      >
        Đăng nhập bằng Google
      </Button>
    </Box>
  );
};

export default LoginForm;
