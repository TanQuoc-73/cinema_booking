'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  Modal,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import TheatersIcon from '@mui/icons-material/Theaters';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { supabase } from '../services/supabaseClient';

import LoginForm from './LoginForm';
import { useAuth } from '../contexts/AuthContext';

const RED = '#d32f2f';

const Header: React.FC = () => {
  const router = useRouter();

  const { userEmail, isLoaded } = useAuth();

  // Dropdown user menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Modal login form state
  const [loginOpen, setLoginOpen] = useState(false);

  // Handlers
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  // Khi đăng nhập thành công trong modal, đóng modal
  const onLoginSuccess = () => {
    handleLoginClose();
  };

  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : '';

  // Tránh render header khi chưa xác định trạng thái auth (giảm flicker)
  if (!isLoaded) {
    return null; // hoặc bạn có thể render loading skeleton ở đây
  }

  return (
    <>
      <AppBar
        position="static"
        elevation={4}
        sx={{
          bgcolor: '#121212',
          borderBottom: `3px solid ${RED}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ cursor: 'pointer' }}>
              <TheatersIcon sx={{ fontSize: 32, color: RED }} />
              <Typography
                variant="h6"
                component="span"
                sx={{ color: RED, fontWeight: 'bold', userSelect: 'none' }}
              >
                Movie Booking
              </Typography>
            </Box>
          </Link>

          {/* Menu navigation */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {[
              { href: '/home', title: 'Home', icon: <HomeIcon /> },
              { href: '/movies', title: 'Movies', icon: <TheatersIcon /> },
              { href: '/bookings', title: 'Bookings', icon: <EventSeatIcon /> },
              { href: '/profile', title: 'Profile', icon: <AccountCircleIcon /> },
            ].map(({ href, title, icon }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <Tooltip title={title} arrow>
                  <IconButton
                    size="large"
                    sx={{
                      color: RED,
                      '&:hover': {
                        backgroundColor: 'rgba(211,47,47,0.18)',
                      },
                    }}
                  >
                    {icon}
                  </IconButton>
                </Tooltip>
              </Link>
            ))}
          </Box>

          {/* User info or login button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {userEmail ? (
              <>
                <Tooltip title="Tài khoản" arrow>
                  <IconButton
                    onClick={handleUserMenuOpen}
                    size="large"
                    sx={{ color: 'white' }}
                    aria-controls={open ? 'user-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Avatar
                      sx={{
                        bgcolor: RED,
                        width: 32,
                        height: 32,
                        fontSize: 18,
                        color: 'white',
                        userSelect: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {firstLetter || <AccountCircleIcon />}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: { minWidth: 200, bgcolor: '#212121', color: 'white', boxShadow: 3 },
                  }}
                  MenuListProps={{ 'aria-labelledby': 'user-account-button' }}
                >
                  <Box px={2} py={1}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: RED, userSelect: 'text' }}>
                      {userEmail}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1, borderColor: RED }} />
                  <MenuItem
                    onClick={() => {
                      handleUserMenuClose();
                      router.push('/profile');
                    }}
                    sx={{
                      gap: 1,
                      '&:hover': { bgcolor: 'rgba(211,47,47,0.15)' },
                      color: 'white',
                    }}
                  >
                    <AccountCircleIcon sx={{ color: RED }} />
                    Hồ sơ cá nhân
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      gap: 1,
                      '&:hover': { bgcolor: 'rgba(211,47,47,0.15)' },
                      color: 'white',
                    }}
                  >
                    <LogoutIcon sx={{ color: RED }} />
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<LoginIcon />}
                onClick={handleLoginOpen}
                sx={{
                  borderColor: RED,
                  color: RED,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(211,47,47,0.12)',
                    borderColor: '#b71c1c',
                    color: '#b71c1c',
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Modal LoginForm */}
      <Modal open={loginOpen} onClose={handleLoginClose} aria-labelledby="login-modal">
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            outline: 'none',
          }}
        >
          <LoginForm onLoginSuccess={onLoginSuccess} />
        </Box>
      </Modal>
    </>
  );
};

export default Header;
