import React from 'react';
import { CustomSearchBar } from './CustomSearchBar';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Slide,
  useScrollTrigger,
} from '@mui/material';
import { ArrowLeft, Menu } from '@mui/icons-material';
import { useIsSidebarOpen } from 'stores/data/layout.data';
import { useIsMobile } from 'utils/hooks/useIsMobile';
import { useSelectedTeamTags } from 'stores/hooks/tag.hooks';
import { DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID } from 'components/document/DocumentsView';
import { Tag } from 'stores/types/tag.types';

interface LoggedHeaderProps {
  addButtonToggled: boolean;
  setToggledAddButton: (toggled: boolean) => void;
}
const LoggedHeaderContent: React.FC<{
  addButtonToggled: boolean;
  isMobile: boolean;
  isSidebarOpen: boolean;
  setToggledAddButton: (toggled: boolean) => void;
  setIsSidebarOpen: (toggled: boolean) => void;
  tags: Tag[];
}> = ({
  addButtonToggled,
  isMobile,
  isSidebarOpen,
  tags,
  setIsSidebarOpen,
  setToggledAddButton,
}) => (
  <Grid
    container
    paddingY={1}
    paddingRight={2}
    spacing={1}
    paddingLeft={isMobile ? undefined : 2}
  >
    {addButtonToggled ? (
      <>
        <Grid item xs={2}>
          <IconButton onClick={() => setToggledAddButton(false)}>
            <ArrowLeft />
          </IconButton>
        </Grid>
        <Grid item xs={10} />
      </>
    ) : (
      <>
        {isMobile && !isSidebarOpen ? (
          <Grid item xs={2}>
            <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu />
            </IconButton>
          </Grid>
        ) : null}
        <Grid
          item
          xs={isMobile && !isSidebarOpen ? 7 : 9}
          display="flex"
          alignItems="center"
        >
          <CustomSearchBar tags={tags} />
        </Grid>
        <Grid item xs={3} display="flex" justifyContent="end">
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ textTransform: 'none' }}
            onClick={() => setToggledAddButton(true)}
          >
            Add a note
          </Button>
        </Grid>
      </>
    )}
  </Grid>
);
export const LoggedHeader: React.FC<LoggedHeaderProps> = (props) => {
  const {
    data: { raw: tags },
  } = useSelectedTeamTags();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useIsSidebarOpen();
  const trigger = useScrollTrigger({
    target:
      document.getElementById(DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID) ??
      undefined,
  });
  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <Box
          position="sticky"
          top={0}
          zIndex={2}
          sx={{ backgroundColor: 'additionalColors.background' }}
          flex={1}
        >
          <LoggedHeaderContent
            {...props}
            isSidebarOpen={isSidebarOpen}
            isMobile={isMobile}
            setIsSidebarOpen={setIsSidebarOpen}
            tags={tags}
          />
        </Box>
      </Slide>
    </>
  );
};
