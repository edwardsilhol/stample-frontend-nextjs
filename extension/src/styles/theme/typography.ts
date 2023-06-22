declare module '@mui/material/Typography' {
  export interface TypographyPropsVariantOverrides {
    additionalVariant: true;
  }
}

const FONT_PRIMARY = 'Roboto, sans-serif';

const extendedTypography = {
  additionalVariant: {
    fontWeight: 700,
    fontSize: 16,
  },
};

export const typography = {
  fontFamily: FONT_PRIMARY,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 700,
    fontSize: 32,
  },
  h2: {
    fontWeight: 700,
    fontSize: 20,
  },
  h3: {
    fontWeight: 700,
    fontSize: 24,
  },
  h4: {
    fontWeight: 700,
    fontSize: 20,
  },
  h5: {
    fontWeight: 700,
    fontSize: 18,
  },
  h6: {
    fontWeight: 700,
    fontSize: 17,
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: 16,
  },
  subtitle2: {
    fontWeight: 600,
    fontSize: 14,
  },
  body1: {
    fontSize: 16,
  },
  body2: {
    fontSize: 14,
  },
  caption: {
    fontSize: 12,
  },
  overline: {
    fontWeight: 700,
    fontSize: 12,
  },
  button: {
    fontWeight: 700,
    fontSize: 14,
  },
  ...extendedTypography,
};

export default typography;
