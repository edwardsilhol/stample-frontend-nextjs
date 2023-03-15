import { Components } from '@mui/material';

const cardTheme: Components['MuiCard'] = {
  styleOverrides: {
    root: {
      borderRadius: 0,
      boxShadow: 'none',
      border: '1px solid #e0e0e0',
    },
  },
};

export default cardTheme;
