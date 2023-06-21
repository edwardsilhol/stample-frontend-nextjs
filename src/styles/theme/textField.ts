import { Components } from '@mui/material';

const textFieldTheme: Components['MuiTextField'] = {
  styleOverrides: {
    root: {},
  },
  variants: [
    {
      props: { variant: 'outlined' },
      style: {
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'white',
        },
      },
    },
  ],
};
export default textFieldTheme;
