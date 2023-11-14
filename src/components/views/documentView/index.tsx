'use client';

import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import ThumbUp from '@mui/icons-material/ThumbUp';
import ThumbUpOffAlt from '@mui/icons-material/ThumbUpOffAlt';
import {
  useDocument,
  useSummarizeDocument,
  useUpdateDocumentAsGuest,
} from '../../../stores/hooks/document.hooks';
import DocumentHeader from '../../document/DocumentHeader';
import DocumentTags from '../../document/DocumentTags';
import { useTeam } from 'stores/hooks/team.hooks';
import { useRouter } from 'next/navigation';
import { useIsMobile } from 'utils/hooks/useIsMobile';
import { useTagsByTeam } from 'stores/hooks/tag.hooks';
import { decodeHTML } from 'entities';
import DocumentViewHeader from '../../document/DocumentViewHeader';
import DocumentCreator from '../../document/DocumentCreator';
import Beenhere from '@mui/icons-material/Beenhere';
import { useSession } from '../../../stores/hooks/user.hooks';
import TextEditor from 'components/forms/fields/TextEditor';
import { useEditor } from '../../forms/fields/TextEditor/hooks/useEditor';
import CircularLoading from '../../base/circularLoading';
import DocumentComments from '../../forms/document/documentComments';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import NoteForm from '../../forms/document/noteForm';
import { doesUserHaveTeamPrivilege } from '../../../utils/team';
import WebpageForm from '../../forms/document/webpageForm';

interface DocumentViewProps {
  teamId: string;
  documentId: string;
}

function DocumentView({ teamId, documentId }: DocumentViewProps) {
  const { data: team, isLoading: isTeamLoading } = useTeam(teamId);
  const isMobile = useIsMobile();
  const router = useRouter();
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { data: loggedInUser, isLoading: isLoggedInUserLoading } = useSession();
  const { data: viewedDocument, isLoading: isViewedDocumentLoading } =
    useDocument(documentId);
  const { data: tags, isLoading: isTagsLoading } = useTagsByTeam(teamId);
  const updateDocumentAsGuest = useUpdateDocumentAsGuest();
  const summarizeDocument = useSummarizeDocument();
  const viewedDocumentEditor = useEditor(
    {
      editable: false,
      content: viewedDocument?.content,
    },
    [viewedDocument?.content, isViewedDocumentLoading],
  );

  const isDocumentLiked = useMemo(() => {
    if (!viewedDocument?.likes || !loggedInUser) {
      return false;
    }
    return viewedDocument?.likes.some(
      (user) => user._id.toString() === loggedInUser?._id.toString(),
    );
  }, [viewedDocument?.likes, loggedInUser]);

  const userHasTeamPrivilege = doesUserHaveTeamPrivilege(
    loggedInUser?._id,
    team?.users,
  );
  const onClickBack = () => {
    router.back();
  };
  const onClickLike = (like: boolean) => {
    if (!viewedDocument?.team) {
      return;
    }
    updateDocumentAsGuest.mutate({
      documentId: documentId,
      updateDocumentAsGuestDto: {
        isLiked: like,
      },
    });
  };

  const handleShowUpdateForm = () => {
    setShowUpdateForm(true);
  };
  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false);
  };

  return (
    <Stack
      direction="column"
      flex={1}
      sx={{
        overflowX: 'hidden',
        overflowY: 'scroll',
        height: '100%',
      }}
      paddingX={2}
      paddingTop={isMobile ? 0 : 7}
    >
      {!showUpdateForm ? (
        <>
          {isMobile ? (
            <>
              <DocumentViewHeader onClickBack={onClickBack} />
              <Toolbar />
            </>
          ) : null}
          {isLoggedInUserLoading ||
          isViewedDocumentLoading ||
          isTeamLoading ||
          isTagsLoading ? (
            <CircularLoading />
          ) : !viewedDocument ? (
            <Stack justifyContent="center" alignItems="center" height="100%">
              <h1>Document not found</h1>
            </Stack>
          ) : (
            <Grid
              container
              width="100%"
              minHeight="100%"
              paddingX={{ xs: 1, md: 3, lg: 5 }}
              alignItems="start"
            >
              {!isMobile && (
                <Grid item xs={1} sm={1.5}>
                  <Button
                    variant="text"
                    startIcon={<KeyboardArrowLeft />}
                    onClick={onClickBack}
                    sx={{ color: 'black', textTransform: 'none' }}
                  >
                    Back
                  </Button>
                </Grid>
              )}
              <Grid item xs={10} sm={9}>
                <Stack maxWidth="md" width="100%" paddingBottom={2}>
                  <Stack alignItems="center" width="100%">
                    <Typography
                      variant="h1"
                      paddingBottom={3}
                      textAlign="center"
                    >
                      {decodeHTML(viewedDocument.title ?? '')}
                    </Typography>
                    {viewedDocument?.mainMedia?.src ? (
                      <Box
                        component="img"
                        src={viewedDocument.mainMedia.src}
                        width="100%"
                        sx={{
                          borderBottomRightRadius: '20px',
                          borderTopLeftRadius: '20px',
                          boxShadow: '2px 2px 3px rgba(0, 0, 0, 0.05)',
                        }}
                      />
                    ) : viewedDocument?.mainMedia?.html ? (
                      <Box
                        sx={{ maxWidth: '100px' }}
                        dangerouslySetInnerHTML={{
                          __html: viewedDocument.mainMedia.html,
                        }}
                      />
                    ) : null}
                    <Grid container width="100%" marginTop={2}>
                      <Grid item xs={12}>
                        <DocumentCreator
                          creator={viewedDocument.creator}
                          insight={viewedDocument.summary}
                        />
                      </Grid>
                    </Grid>
                    <Grid container width="100%" marginTop={1}>
                      <Grid item xs={12}>
                        <DocumentHeader
                          {...viewedDocument}
                          likesCount={viewedDocument.likes?.length ?? 0}
                          readersCount={viewedDocument.readers?.length ?? 0}
                          typographyProps={{
                            variant: 'body2',
                            textAlign: 'center',
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                  <DocumentTags
                    tags={tags.raw}
                    documentTagsIds={viewedDocument.tags.map((tag) =>
                      tag._id.toString(),
                    )}
                  />
                  <Stack
                    justifyContent="center"
                    direction="row"
                    width="100%"
                    paddingTop={2}
                    paddingBottom={3}
                  >
                    <IconButton
                      onClick={() => onClickLike(!isDocumentLiked)}
                      sx={{ padding: 0 }}
                    >
                      {isDocumentLiked ? <ThumbUp /> : <ThumbUpOffAlt />}
                    </IconButton>
                  </Stack>
                  {!summarizeDocument.isPending &&
                    (!viewedDocument.aiSummary ||
                      (Array.isArray(viewedDocument.aiSummary) &&
                        viewedDocument.aiSummary.length === 0)) && (
                      <Button
                        sx={{ marginBottom: 2 }}
                        onClick={async () => {
                          await summarizeDocument.mutateAsync({
                            documentId: viewedDocument._id,
                          });
                        }}
                        variant="outlined"
                      >
                        {'Summarize this document'}
                      </Button>
                    )}
                  {summarizeDocument.isPending && (
                    <Stack justifyContent="center" alignItems="center">
                      <CircularProgress />
                    </Stack>
                  )}
                  {viewedDocument.aiSummary &&
                    viewedDocument.aiSummary.length > 0 && (
                      <Box
                        sx={{
                          backgroundColor: 'rgb(255,251,191)',
                          padding: '20px 30px',
                          boxSizing: 'border-box',
                          marginBottom: '30px',
                          boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Beenhere
                            sx={{
                              width: '50px',
                              height: '50px',
                            }}
                          />
                        </Box>
                        <ul style={{ paddingLeft: '20px' }}>
                          {viewedDocument.aiSummary?.map((sentence, i) => (
                            <li key={i} style={{ marginBottom: '10px' }}>
                              <Typography
                                variant="body1"
                                whiteSpace="pre-line"
                                sx={{ fontStyle: 'italic' }}
                              >
                                {sentence}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </Box>
                    )}
                  <TextEditor editor={viewedDocumentEditor} />
                  <Typography variant="h2" marginTop={3}>
                    Comments
                  </Typography>
                  <DocumentComments
                    documentId={documentId}
                    isViewedDocumentLoading={isViewedDocumentLoading}
                    viewedDocument={viewedDocument}
                    team={team}
                  />
                </Stack>
              </Grid>
              <Grid item xs={1} sm={1.5}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleShowUpdateForm}
                >
                  Update
                </Button>
              </Grid>
              {!isMobile && <Grid item xs={1} sm={1.5} />}
            </Grid>
          )}
        </>
      ) : (
        <>
          {viewedDocument &&
            team &&
            (viewedDocument.type === 'note' ? (
              <NoteForm
                variant="update"
                onClose={handleCloseUpdateForm}
                userHasTeamPrivilege={userHasTeamPrivilege}
                isPersonalTeam={team.isPersonal}
                document={viewedDocument}
              />
            ) : (
              <WebpageForm
                variant="update"
                onClose={handleCloseUpdateForm}
                userHasTeamPrivilege={userHasTeamPrivilege}
                isPersonalTeam={team.isPersonal}
                document={viewedDocument}
              />
            ))}
        </>
      )}
    </Stack>
  );
}

export default DocumentView;
