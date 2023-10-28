import { MinimalDocument } from '../../../stores/types/document.types';
import { Tag } from '../../../stores/types/tag.types';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { decodeHTML } from 'entities';
import DocumentHeader from '../../document/DocumentHeader';
import Beenhere from '@mui/icons-material/Beenhere';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState, MouseEvent } from 'react';
import {
  useDeleteDocument,
  useUpdateDocument,
} from '../../../stores/hooks/document.hooks';

interface DocumentGridItemProps {
  userHasPrivilege: boolean;
  currentUserId: string;
  document: MinimalDocument;
  flatTags?: Tag[];
  onClick?: () => void;
}

function DocumentGridItem({
  userHasPrivilege,
  document,
  onClick,
  currentUserId,
}: DocumentGridItemProps) {
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument(document.team);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = () => {
    deleteDocument.mutate(document._id);
    setAnchorEl(null);
  };
  const handleToggleNewsletterSelection = () => {
    updateDocument.mutate({
      documentId: document._id,
      updateDocumentDto: {
        selectedForNewsletter: !document.selectedForNewsletter,
      },
    });
    handleMenuClose();
  };
  const renderSettingsButton = () => (
    <>
      <IconButton
        sx={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          color: 'primary.main',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
        onClick={handleMenuClick}
      >
        <MoreVertIcon fontSize="medium" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleToggleNewsletterSelection}>
          {`${
            document.selectedForNewsletter ? 'Remove from' : 'Add to'
          } newsletter`}
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>TODO</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        filter: 'drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.05));',
        position: 'relative',
      }}
      variant="elevation"
    >
      {(userHasPrivilege || currentUserId === document.creator) &&
        renderSettingsButton()}
      {document.mainMedia?.src ? (
        <CardMedia
          sx={{
            height: '150px',
            backgroundPosition: '50% 20%',
          }}
          image={document.mainMedia?.src}
        />
      ) : null}
      <CardContent
        sx={{
          overflow: 'hidden',
          height: '100%',
          padding: 0,
          '&:last-child': {
            paddingBottom: 0,
          },
          flex: 3,
        }}
      >
        <Box
          sx={{
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ padding: 2, cursor: 'pointer' }} onClick={onClick}>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                marginBottom: '5px',
              }}
            >
              {decodeHTML(document.title ?? '')}
            </Typography>
            <DocumentHeader
              {...document}
              likesCount={document.likes?.length ?? 0}
              readersCount={document.readers?.length ?? 0}
              typographyProps={{
                sx: {
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                },
              }}
            />
            {/*<Avatar*/}
            {/*  sizes="large"*/}
            {/*  src={creator.profilePictureUrl}*/}
            {/*  sx={{*/}
            {/*    width: '50px',*/}
            {/*    height: '50px',*/}
            {/*    marginTop: '10px',*/}
            {/*    marginBottom: '10px',*/}
            {/*    border: '5px solid',*/}
            {/*    borderColor: 'primary.main',*/}
            {/*  }}*/}
            {/*>*/}
            {/*  {creator.profilePictureUrl*/}
            {/*    ? null*/}
            {/*    : `${creator.firstName[0]}${creator.lastName[0]}`}*/}
            {/*</Avatar>*/}
            {/*<Typography variant="h5" fontWeight={700} marginLeft={0}>*/}
            {/*  {creator.firstName} {creator.lastName}*/}
            {/*</Typography>*/}
            {document.summary && (
              <Box
                sx={{
                  position: 'relative',
                  background: '#f1f4fc',
                  textAlign: 'center',
                  width: '80%',
                  height: 'auto',
                  marginTop: '20px',
                  marginBottom: '10px',
                  marginLeft: '10%',
                  borderRadius: '10px',
                  padding: '10px',
                  boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    display: 'block',
                    width: 0,
                    zIndex: 1,
                    borderStyle: 'solid',
                    borderColor: '#f1f4fc transparent',
                    borderWidth: '0 15px 15px',
                    top: '-15px',
                    left: '50%',
                    marginLeft: '-15px',
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: 'primary.main', fontStyle: 'italic' }}
                >
                  {decodeHTML(document.summary)}
                </Typography>
              </Box>
            )}
          </Box>
          {document.aiSummary && document.aiSummary.length > 0 && (
            <Box sx={{ padding: 2, backgroundColor: '#f9f9f9' }}>
              <Box
                sx={{
                  textAlign: 'center',
                }}
              >
                <Box sx={{ marginTop: 0 }}>
                  <Beenhere
                    sx={{
                      width: '22px',
                      height: '22px',
                      color: 'primary.main',
                    }}
                  />
                </Box>
                <ul
                  style={{
                    paddingLeft: '14px',
                    marginBlockStart: 0,
                    marginBlockEnd: 0,
                    textAlign: 'left',
                  }}
                >
                  {document.aiSummary?.map((sentence, i) => (
                    <Typography
                      key={i}
                      variant="caption"
                      whiteSpace="pre-line"
                      sx={{
                        fontStyle: 'italic',
                        lineHeight: '18px',
                      }}
                    >
                      <li key={i} style={{ marginBottom: '5px' }}>
                        {sentence}
                      </li>
                    </Typography>
                  ))}
                </ul>
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default DocumentGridItem;
