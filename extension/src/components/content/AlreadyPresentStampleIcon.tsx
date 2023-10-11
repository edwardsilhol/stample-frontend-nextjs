import { Avatar } from '@mui/material';
import { getImageUrl } from '@src/helpers/content.helpers';

function AlreadyPresentStampleIcon() {
  return (
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
}
export default AlreadyPresentStampleIcon;
