import { Components } from '@mui/material';

const cardTheme: Components['MuiCard'] = {
  styleOverrides: {
    root: {},
  },
  variants: [
    {
      props: { variant: 'outlined' },
      style: {
        border: '1px solid #e0e0e0',
        borderRadius: 0,
        boxShadow: 'none',
      },
    },
    {
      props: { variant: 'elevation' },
      style: {
        borderRadius: '10px',
        boxShadow: 'none',
      },
    },
  ],
};

export default cardTheme;
