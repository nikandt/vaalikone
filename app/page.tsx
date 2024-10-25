'use client';

import { useState } from 'react';
import Home from './components/home';
import Vaalikone from './components/vaalikone';
import Vieraat from './components/vieraat';
import { Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

export default function Page() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'vaalikone':
        return <Vaalikone />;
      case 'vieraat':
          return <Vieraat />;
      default:
        return <Home />;
    }
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setIsDrawerOpen(false); // Close sidebar after selecting a page
  };

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <div>
      <IconButton onClick={toggleDrawer(true)} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <Drawer open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <List>
          <ListItem button onClick={() => handleNavigation('home')}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('vaalikone')}>
            <ListItemText primary="Vaalikone" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('vieraat')}>
            <ListItemText primary="Vieraat" />
          </ListItem>
        </List>
      </Drawer>
      <div>
        {renderPage()}
      </div>
    </div>
    </ThemeProvider>
  );
}
