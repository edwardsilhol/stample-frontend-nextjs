import React from 'react';
import { CustomSearchBar } from './CustomSearchBar';
import { Box, Button, Grid, IconButton } from '@mui/material';
import { ArrowLeft, Menu } from '@mui/icons-material';
import { useIsSidebarOpen } from 'stores/data/layout.data';
import { useIsMobile } from 'utils/hooks/useIsMobile';
import { useSelectedTeamTags } from 'stores/hooks/tag.hooks';

interface LoggedHeaderProps {
  searchValue: string;
  addButtonToggled: boolean;
  setSearchValue: (value: string) => void;
  setToggledAddButton: (toggled: boolean) => void;
}

export const LoggedHeader: React.FC<LoggedHeaderProps> = ({
  searchValue,
  addButtonToggled,
  setSearchValue,
  setToggledAddButton,
}) => {
  const {
    data: { raw: tags },
  } = useSelectedTeamTags();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useIsSidebarOpen();
  return (
    <Box sx={{ borderBottom: '1px solid #d3d4d5' }}>
      <Grid container spacing={1} paddingY={1} paddingX={1}>
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
            <Grid item xs={isMobile && !isSidebarOpen ? 7 : 9}>
              <CustomSearchBar
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                tags={tags}
              />
            </Grid>
            <Grid item xs={3} display="flex" justifyContent="end">
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => setToggledAddButton(true)}
              >
                Add
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};
