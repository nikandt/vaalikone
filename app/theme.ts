import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3cbdb2',
      contrastText: '#fff', 
    },
    secondary: {
      main: '#888',
      contrastText: '#fff', 
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#333', 
      secondary: '#888',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', 
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        track: {
          display: 'none', 
        },
        rail: {
          backgroundColor: '#ccc', 
          opacity: 1,
        },
        thumb: {
          backgroundColor: '#3cbdb2',
        },
        mark: {
          width: '2em',
          height: '2em',
          borderRadius: '50%',
          backgroundColor: '#ccc',
          opacity: 1,
          transform: 'translateX(-50%) translateY(-50%)',
        },
        markActive: {
          backgroundColor: '#ccc',
        },
        markLabel: {
          whiteSpace: 'pre-line', 
          textAlign: 'center', 
          fontSize: '0.875rem',
          marginTop: '8px',
        },
      },
    },
  },
});

export default theme;
