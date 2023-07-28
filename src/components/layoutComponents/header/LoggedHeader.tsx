import React from 'react';
import { CustomSearchBar } from './CustomSearchBar';
import {
  AppBar,
  Button,
  Grid,
  IconButton,
  Slide,
  Toolbar,
  useScrollTrigger,
} from '@mui/material';
import { ArrowLeft, Menu } from '@mui/icons-material';
import { useIsSidebarOpen } from 'stores/data/layout.data';
import { useIsMobile } from 'utils/hooks/useIsMobile';
import { useSelectedTeamTags } from 'stores/hooks/tag.hooks';
import { DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID } from 'components/document/DocumentsView';

interface LoggedHeaderProps {
  addButtonToggled: boolean;
  setToggledAddButton: (toggled: boolean) => void;
}

export const LoggedHeader: React.FC<LoggedHeaderProps> = ({
  addButtonToggled,
  setToggledAddButton,
}) => {
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
        <AppBar
          sx={{
            backgroundColor: 'additionalColors.background',
            width: isMobile ? undefined : 'calc(100% - 270px)',
          }}
          elevation={0}
        >
          <Toolbar disableGutters>
            <Grid container spacing={1} paddingY={1} paddingX={2}>
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
                      <IconButton
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      >
                        <Menu />
                      </IconButton>
                    </Grid>
                  ) : null}
                  <Grid item xs={isMobile && !isSidebarOpen ? 7 : 9}>
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
          </Toolbar>
        </AppBar>
      </Slide>
    </>
  );
};
