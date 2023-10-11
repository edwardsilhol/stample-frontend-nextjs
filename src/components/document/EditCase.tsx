import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Folder from '@mui/icons-material/Folder';
import { Tag } from '../../stores/types/tag.types';
import { Document } from '../../stores/types/document.types';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface EditCaseProps {
  document?: Document;
  tags?: Tag[];
  showDocument: boolean;
}
function EditCase({ document, showDocument, tags }: EditCaseProps) {
  const gridWidth = showDocument
    ? { xs: 12, sm: 12, md: 12, lg: 12 }
    : { xs: 12, sm: 6, md: 4, lg: 3 };

  const tagString = document?.tags
    ?.map((tag) => tags?.find((t) => t._id === tag)?.name)
    ?.map((tag) => `#${tag}`)
    ?.join(' ');

  return (
    <Stack direction="column" spacing={4}>
      <Stack direction="row" spacing={2}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            boxShadow: '0 0 5px rgba(200, 200, 200, 0.5)',
            borderRadius: '4px',
            overflow: 'hidden',
            width: '100px',
            padding: 2,
          }}
        >
          <Box
            padding={2}
            sx={{
              maxHeight: 'calc(8vh - 4px)',
              flexGrow: 1,
              overflowY: 'auto',
            }}
          >
            {document?.content && (
              <Grid item {...gridWidth}>
                <Typography fontSize={'3px'} variant="h1">
                  {document.title}
                </Typography>
                <Typography
                  fontSize={'3px'}
                  fontWeight={400}
                  color={'rgba(0, 0, 255, 0.8)'}
                >
                  {document.tags
                    .map((tag) => tags?.find((t) => t._id === tag)?.name)
                    .map((tag) => `#${tag}`)
                    .join(' ')}
                </Typography>
                <Typography
                  variant="h5"
                  fontSize={'1px'}
                  color="text.secondary"
                >
                  <div dangerouslySetInnerHTML={{ __html: document.content }} />
                </Typography>
              </Grid>
            )}
          </Box>
        </Box>

        <Stack direction="column" alignItems="flex-start">
          <Typography fontSize={8} variant="h4">
            {document?.title}
          </Typography>
          <TextField
            variant="standard"
            size="medium"
            placeholder="Entez une description"
            fullWidth
            sx={{ width: '100%' }}
          />
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Typography
          fontSize={'11px'}
          fontWeight={400}
          sx={{ opacity: 0.8 }}
          variant="h5"
          style={{ marginRight: 8 }}
        >
          Collection
        </Typography>
        <Button
          variant="outlined"
          sx={{
            color: 'grey',
            borderColor: 'grey',
          }}
          startIcon={<Folder />}
          endIcon={<ArrowDropDownIcon />}
          onClick={() => {
            // handle adding the document here
          }}
        >
          Add to Folder
        </Button>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Typography
          variant="h5"
          fontSize={'11px'}
          fontWeight={400}
          sx={{ opacity: 0.8 }}
          style={{ marginRight: 8 }}
        >
          Tags
        </Typography>
        <TextField
          fullWidth
          size="medium"
          value={tagString}
          placeholder="Ajoutez des tags..."
          sx={{ width: '100%', backgroundColor: '#f6f5f4', border: 'none' }}
          InputProps={{
            disableUnderline: true,
          }}
        />
      </Stack>
      <Stack direction="row" alignItems="center">
        <Checkbox
          onChange={() => {
            // handle toggling favorite here
          }}
          color="primary"
        />
        <Typography
          variant="h5"
          fontSize={'11px'}
          fontWeight={400}
          style={{ marginRight: 1 }}
        >
          Favoris
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="flex-end">
        <Typography
          variant="h5"
          sx={{
            cursor: 'pointer',
            color: 'red',
            marginRight: 0,
          }}
          onClick={() => {
            // handle delete document here
          }}
        >
          Supprimer
        </Typography>
      </Stack>
    </Stack>
  );
}

export default EditCase;
