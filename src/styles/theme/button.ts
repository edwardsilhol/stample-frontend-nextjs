import { Components } from '@mui/material';

const buttonTheme: Components['MuiButton'] = {
  styleOverrides: {
    root: {},
  },
  variants: [
    {
      props: { variant: 'contained' },
      style: {
        boxShadow: 'none',
      },
    },
  ],
};
export default buttonTheme;
