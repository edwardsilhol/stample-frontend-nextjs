'use client';

import CustomSearchBar from '../../bars/customSearchBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Add from '@mui/icons-material/Add';
import { useIsMobile } from 'utils/hooks/useIsMobile';
import { DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID } from 'components/document/DocumentsView';
import CreateNoteForm from '../../forms/document/createNoteForm';
import { MouseEvent, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import StickyNote2 from '@mui/icons-material/StickyNote2';
import LinkIcon from '@mui/icons-material/Link';
import CreateWebpageForm from '../../forms/document/createWebpageForm';

interface LoggedHeaderProps {
  setHideDocuments: (toggled: boolean) => void;
}
function LoggedHeader({ setHideDocuments }: LoggedHeaderProps) {
  const isMobile = useIsMobile();
  const trigger = useScrollTrigger({
    target:
      document.getElementById(DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID) ??
      undefined,
  });
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [noteFormOpen, setNoteFormOpen] = useState<boolean>(false);
  const [webpageFormOpen, setWebpageFormOpen] = useState<boolean>(false);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(null);
  };

  const handleLinkFormClick = () => {
    setWebpageFormOpen(true);
    setHideDocuments(true);
  };

  const handleLinkFormClose = () => {
    setWebpageFormOpen(false);
    setHideDocuments(false);
  };

  const handleNoteFormClick = () => {
    setNoteFormOpen(true);
    setHideDocuments(true);
  };

  const handleNoteFormClose = () => {
    setNoteFormOpen(false);
    setHideDocuments(false);
  };

  const documentOptions = [
    {
      text: 'Web Page',
      Icon: LinkIcon,
      onClick: handleLinkFormClick,
    },
    {
      text: 'Note',
      Icon: StickyNote2,
      onClick: handleNoteFormClick,
    },
  ];
  const renderDocumentOptions = () => (
    <>
      <Button
        variant="contained"
        color="primary"
        size="small"
        sx={{
          textTransform: 'none',
          borderRadius: '40px',
          width: '40px',
          height: '40px',
          minWidth: 0,
        }}
        onClick={handleMenuClick}
      >
        <Add />
      </Button>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {documentOptions.map(({ text, Icon, onClick }, index) => (
          <MenuItem
            key={index}
            onClick={(e) => {
              onClick();
              handleMenuClose(e);
            }}
          >
            <ListItemIcon>
              <Icon
                sx={{
                  height: '30px',
                }}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">{text}</Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  return !noteFormOpen && !webpageFormOpen ? (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <Box
          position="sticky"
          top={0}
          zIndex={2}
          sx={{ backgroundColor: 'additionalColors.background' }}
        >
          <Grid
            container
            paddingY={1}
            paddingRight={2}
            spacing={1}
            paddingLeft={isMobile ? undefined : 2}
          >
            {isMobile ? <Grid item xs={2}></Grid> : null}
            <Grid item xs={isMobile ? 7 : 9} display="flex" alignItems="center">
              <CustomSearchBar />
            </Grid>
            <Grid item xs={3} display="flex" justifyContent="end">
              {renderDocumentOptions()}
            </Grid>
          </Grid>
        </Box>
      </Slide>
    </>
  ) : (
    <>
      {noteFormOpen && <CreateNoteForm onClose={handleNoteFormClose} />}
      {webpageFormOpen && <CreateWebpageForm onClose={handleLinkFormClose} />}
    </>
  );
}
export default LoggedHeader;
