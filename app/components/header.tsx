// 'use client';
import {
  onAuthStateChanged,
  signInWithGoogle,
  signOut,
} from '../lib/firebase/auth';
import { firebaseConfig } from '../lib/firebase/config';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { MouseEvent, useEffect, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

interface User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

function useUserSession(initialUser: User | null) {
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const serializedConfig = encodeURIComponent(
        JSON.stringify(firebaseConfig),
      );
      const swUrl = `/auth-service-worker.js?firebaseConfig=${serializedConfig}`;
      navigator.serviceWorker.register(swUrl).then((registration) => {
        console.log(
          'Service Worker registered with scope:',
          registration.scope,
        );
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser: User | null) => {
      setUser(
        authUser
          ? {
              displayName: authUser.displayName,
              email: authUser.email,
              photoURL: authUser.photoURL,
            }
          : null,
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    onAuthStateChanged((authUser: User | null) => {
      if (user === undefined) return;
      if (user?.email !== authUser?.email) router.refresh();
    });
  }, [user]);

  return user;
}

const Header: React.FC<{ initialUser: User | null }> = ({ initialUser }) => {
  const user = useUserSession(initialUser);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSignOut = (event: React.MouseEvent) => {
    event.preventDefault();
    signOut();
  };

  const handleSignIn = (event: React.MouseEvent) => {
    event.preventDefault();
    signInWithGoogle();
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#385574' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
        />

        {user ? (
          <>
            <IconButton onClick={handleMenuOpen} color="inherit">
              <Avatar
                src={user.photoURL || '/profile.svg'}
                alt={user.email || 'User'}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleMenuClose}>{user.displayName}</MenuItem>
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            color="inherit"
            onClick={handleSignIn}
            startIcon={<FontAwesomeIcon icon={faSignInAlt} />}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
