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
        root: {
          boxShadow: 'none !important',
          outline: 'none !important',
          '&:hover, &:active, &.Mui-focusVisible, &:focus': {
            boxShadow: 'none !important',
            outline: 'none !important',
          },
        },
        track: {
          display: 'none', 
          boxShadow: 'none !important',
          outline: 'none !important',
        },
        rail: {
          backgroundColor: '#ccc', 
          opacity: 1,
          boxShadow: 'none !important',
          outline: 'none !important',
        },
        thumb: {
          backgroundColor: '#3cbdb2',
          boxShadow: 'none',
          border: 'none', 
          '&:hover, &:active, &.Mui-focusVisible': {
            boxShadow: 'none !important',
          },
        },
        mark: {
          width: '2em',
          height: '2em',
          borderRadius: '50%',
          backgroundColor: '#ccc',
          opacity: 1,
          transform: 'translateX(-50%) translateY(-50%)',
          boxShadow: 'none !important',
          outline: 'none !important',
        },
        markActive: {
          backgroundColor: '#ccc',
          boxShadow: 'none !important',
          outline: 'none !important',
        },
        markLabel: {
          whiteSpace: 'pre-line', 
          textAlign: 'center', 
          fontSize: '0.875rem',
          outline: 'none !important',
          marginTop: '8px',
          boxShadow: 'none !important',
        },
      },
    },
  },
});

export default theme;
