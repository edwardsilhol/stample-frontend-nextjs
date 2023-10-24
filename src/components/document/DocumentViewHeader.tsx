import useScrollTrigger from '@mui/material/useScrollTrigger';
import { DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID } from './DocumentsView';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import DocumentViewHeaderContent from './DocumentViewHeaderContent';

interface DocumentViewHeaderProps {
  onClickBack: () => void;
}

function DocumentViewHeader({ onClickBack }: DocumentViewHeaderProps) {
  const trigger = useScrollTrigger({
    target:
      document.getElementById(DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID) ??
      undefined,
  });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar
        sx={{
          backgroundColor: 'background.paper',
          marginTop: 7,
          paddingX: 2,
        }}
        elevation={0}
      >
        <Toolbar>
          <DocumentViewHeaderContent onClickBack={onClickBack} />
        </Toolbar>
      </AppBar>
    </Slide>
  );
}
export default DocumentViewHeader;
