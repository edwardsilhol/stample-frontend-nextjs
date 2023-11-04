'use client';

import CustomSearchBar from './CustomSearchBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Add from '@mui/icons-material/Add';
import ArrowLeft from '@mui/icons-material/ArrowLeft';
import { useIsMobile } from 'utils/hooks/useIsMobile';
import { useTagsByTeam } from 'stores/hooks/tag.hooks';
import { DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID } from 'components/document/DocumentsView';
import { Tag } from 'stores/types/tag.types';
import { useParams } from 'next/navigation';
import { RouteParams } from '../../../stores/types/global.types';

interface LoggedHeaderContentProps {
  addButtonToggled: boolean;
  isMobile: boolean;
  setToggledAddButton: (toggled: boolean) => void;
  tags: Tag[];
}

function LoggedHeaderContent({
  addButtonToggled,
  isMobile,
  setToggledAddButton,
}: LoggedHeaderContentProps) {
  return (
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
          {isMobile ? <Grid item xs={2}></Grid> : null}
          <Grid item xs={isMobile ? 7 : 9} display="flex" alignItems="center">
            <CustomSearchBar />
          </Grid>
          <Grid item xs={3} display="flex" justifyContent="end">
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
              onClick={() => setToggledAddButton(true)}
            >
              <Add />
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
}

interface LoggedHeaderProps {
  addButtonToggled: boolean;
  setToggledAddButton: (toggled: boolean) => void;
}
function LoggedHeader(props: LoggedHeaderProps) {
  const { teamId } = useParams<RouteParams>();
  const {
    data: { raw: tags },
  } = useTagsByTeam(teamId);
  const isMobile = useIsMobile();
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
        >
          <LoggedHeaderContent {...props} isMobile={isMobile} tags={tags} />
        </Box>
      </Slide>
    </>
  );
}
export default LoggedHeader;
