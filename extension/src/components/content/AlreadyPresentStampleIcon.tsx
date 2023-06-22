import { Avatar } from '@mui/material';
import { getImageUrl } from '@src/helpers/content.helpers';
import React from 'react';

export const AlreadyPresentStampleIcon: React.FC = () => (
  <Avatar
    sx={{
      visibility: 'visible',
      marginLeft: '20px',
      height: '28px',
      width: '28px',
    }}
    src={getImageUrl('/icons/icon128.png')}
  />
);
