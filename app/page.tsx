'use client';

import { useState, useEffect } from 'react';
import Home from './components/home';
import Vaalikone from './components/vaalikone';
import Vieraat from './components/vieraat';
import Header from './components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Drawer, List, Typography, Button, ListItemButton, ListItemText, ListItemIcon, IconButton, useMediaQuery, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PollIcon from '@mui/icons-material/HowToVote';
import PeopleIcon from '@mui/icons-material/Group';
import CloseIcon from '@mui/icons-material/ChevronLeft';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { auth } from './lib/firebase/clientApp';

import {
  onAuthStateChanged,
} from 'firebase/auth';

import {  signInWithGoogle} from './lib/firebase/auth';

import theme from './theme';

export default function Page() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentPage, setCurrentPage] = useState<'home' | 'vaalikone' | 'vieraat' >('home');

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSignIn = () => {
    signInWithGoogle();
  };

  const handleNavigation = (page: 'home' | 'vaalikone' | 'vieraat' ) => {
    setCurrentPage(page);
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header initialUser={null} />
      {isAuthenticated ? (
        <div style={{ display: 'flex' }}>
          {/* Drawer for navigation */}
          <Drawer
            variant="permanent"
            open={isDrawerOpen}
            sx={{
              width: isDrawerOpen ? 240 : 60,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: isDrawerOpen ? 240 : 60,
                overflow: 'hidden',
                transition: 'width 0.3s',
                backgroundImage: 'linear-gradient(135deg, #3b8d99, #6b00b6)',
                color: 'white',
              },
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="flex-end" p={1}>
              <IconButton onClick={toggleDrawer}>
                {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
            <List>
              <ListItemButton onClick={() => handleNavigation('home')}>
                <ListItemIcon><HomeIcon /></ListItemIcon>
                {isDrawerOpen && <ListItemText primary="Etusivu" sx={{ typography: 'h6', color: 'white' }}/>}
              </ListItemButton>
              <ListItemButton onClick={() => handleNavigation('vaalikone')}>
                <ListItemIcon><PollIcon /></ListItemIcon>
                {isDrawerOpen && <ListItemText primary="Vaalikone" sx={{ typography: 'h6', color: 'white' }}/>}
              </ListItemButton>
              <ListItemButton onClick={() => handleNavigation('vieraat')}>
                <ListItemIcon><PeopleIcon /></ListItemIcon>
                {isDrawerOpen && <ListItemText primary="Vieraat" sx={{ typography: 'h6', color: 'white' }}/>}
              </ListItemButton>
            </List>
          </Drawer>

          {/* Main content area */}
          <div style={{ padding: '16px', width: '100%' }}>
            {currentPage === 'home' && <Home navigateToVaalikone={() => handleNavigation('vaalikone')} />}
            {currentPage === 'vaalikone' && <Vaalikone />}
            {currentPage === 'vieraat' && <Vieraat />}
          </div>
        </div>
      ) : (
        // Display login page if not authenticated
          <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          textAlign="center"
          gap={2}
        >
          <Typography variant="h4">Tervetuloa!</Typography>
          <Button
            onClick={handleSignIn}
            variant="contained"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              padding: '8px 16px',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#357AE8',
              },
            }}
          >
      <FontAwesomeIcon icon={faGoogle} style={{ fontSize: '20px' }} />
      <Typography>Sign in with Google</Typography>
    </Button>
        </Box>
      )}
    </ThemeProvider>
  );
}
