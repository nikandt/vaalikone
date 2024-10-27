'use client';

import Header from './components/header';
import Home from './components/home';
import Vaalikone from './components/vaalikone';
import Vieraat from './components/vieraat';
import theme from './theme';
import CloseIcon from '@mui/icons-material/ChevronLeft';
import PeopleIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import PollIcon from '@mui/icons-material/HowToVote';
import MenuIcon from '@mui/icons-material/Menu';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import { useState } from 'react';

export default function Page() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentPage, setCurrentPage] = useState<
    'home' | 'vaalikone' | 'vieraat'
  >('home');

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleNavigation = (page: 'home' | 'vaalikone' | 'vieraat') => {
    setCurrentPage(page);
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header initialUser={null} />
      <div style={{ display: 'flex' }}>
        {!isMobile && (
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
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              p={1}
            >
              <IconButton onClick={toggleDrawer}>
                {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
            <List>
              <ListItemButton onClick={() => handleNavigation('home')}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                {isDrawerOpen && <ListItemText primary="Etusivu" />}
              </ListItemButton>
              <ListItemButton onClick={() => handleNavigation('vaalikone')}>
                <ListItemIcon>
                  <PollIcon />
                </ListItemIcon>
                {isDrawerOpen && <ListItemText primary="Vaalikone" />}
              </ListItemButton>
              <ListItemButton onClick={() => handleNavigation('vieraat')}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                {isDrawerOpen && <ListItemText primary="Vieraat" />}
              </ListItemButton>
            </List>
          </Drawer>
        )}

        {isMobile && (
          <BottomNavigation
            value={currentPage}
            onChange={(event, newValue) => handleNavigation(newValue)}
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              width: '100%',
              boxShadow: '0 -1px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <BottomNavigationAction
              label="Etusivu"
              value="home"
              icon={<HomeIcon />}
            />
            <BottomNavigationAction
              label="Vaalikone"
              value="vaalikone"
              icon={<PollIcon />}
            />
            <BottomNavigationAction
              label="Vieraat"
              value="vieraat"
              icon={<PeopleIcon />}
            />
          </BottomNavigation>
        )}

        {/* {isMobile && !isDrawerOpen && (
          <IconButton onClick={toggleDrawer} aria-label="menu">
            <MenuIcon />
          </IconButton>
        )}*/}
        <div style={{ padding: '16px', width: '100%' }}>
          {currentPage === 'home' && (
            <Home navigateToVaalikone={() => handleNavigation('vaalikone')} />
          )}
          {currentPage === 'vaalikone' && <Vaalikone />}
          {currentPage === 'vieraat' && <Vieraat />}
        </div>
      </div>
    </ThemeProvider>
  );
}
