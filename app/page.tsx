'use client';

import { useState } from 'react';
import Home from './components/home';
import Vaalikone from './components/vaalikone';
import Vieraat from './components/vieraat';
import Header from './components/header';
import { Drawer, List, ListItemButton, ListItemText, ListItemIcon, IconButton, useMediaQuery, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PollIcon from '@mui/icons-material/HowToVote';
import PeopleIcon from '@mui/icons-material/Group';
import CloseIcon from '@mui/icons-material/ChevronLeft';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

export default function Page() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentPage, setCurrentPage] = useState<'home' | 'vaalikone' | 'vieraat'>('home');


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

        {/*!isMobile &&*/ (
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
            <Box display="flex" alignItems="center" justifyContent="flex-end" p={1}>
              <IconButton onClick={toggleDrawer}>
                {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
            <List>
              <ListItemButton onClick={() => handleNavigation('home')}>
                <ListItemIcon><HomeIcon /></ListItemIcon>
                {isDrawerOpen && <ListItemText primary="Etusivu" />}
              </ListItemButton>
              <ListItemButton onClick={() => handleNavigation('vaalikone')}>
                <ListItemIcon><PollIcon /></ListItemIcon>
                {isDrawerOpen && <ListItemText primary="Vaalikone" />}
              </ListItemButton>
              <ListItemButton onClick={() => handleNavigation('vieraat')}>
                <ListItemIcon><PeopleIcon /></ListItemIcon>
                {isDrawerOpen && <ListItemText primary="Vieraat" />}
              </ListItemButton>
            </List>
          </Drawer>
        )}
       {/* {isMobile && !isDrawerOpen && (
          <IconButton onClick={toggleDrawer} aria-label="menu">
            <MenuIcon />
          </IconButton>
        )}*/}
        <div style={{ padding: '16px', width: '100%' }}>
          {currentPage === 'home' && <Home navigateToVaalikone={() => handleNavigation('vaalikone')} />}
          {currentPage === 'vaalikone' && <Vaalikone />}
          {currentPage === 'vieraat' && <Vieraat />}
        </div>
      </div>
    </ThemeProvider>
  );
}
