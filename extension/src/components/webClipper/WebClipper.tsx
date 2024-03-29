import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  getDefaultSelectedTeamId,
  getTeamDisplayedName,
} from '@src/helpers/team.helper';
import { useEffect, useMemo, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import {
  useAllTeams,
  useTeam,
} from '@src/stores/hooks/tanstackQuery/team.hooks';
import {
  CommentMention,
  CommentMentionType,
  CreateCommentDTO,
} from '@src/stores/types/comment.types';
import { UserForOtherClient } from '@src/stores/types/user.types';
import { uniqBy } from 'lodash';
import { convertToRaw, EditorState } from 'draft-js';
import { useTagsByTeam } from '@src/stores/hooks/tanstackQuery/tag.hooks';
import SelectTags from './SelectTags';
import {
  useCreateDocument,
  useGetSummarizedText,
  useSearchDocumentsByUrl,
} from '@src/stores/hooks/tanstackQuery/document.hooks';
import { useCreateComment } from '@src/stores/hooks/tanstackQuery/comment.hooks';
import { getClippedPage } from '@src/helpers/clipper.helpers';
import { useCurrentPageUrl } from '@src/stores/hooks/tanstackQuery/clipper.hooks';
import { Document } from '@src/stores/types/document.types';
import { CheckCircle } from '@mui/icons-material';

function WebClipper() {
  const { data: teams } = useAllTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const { data: selectedTeam } = useTeam(selectedTeamId);
  const [editedComment, setEditedComment] = useState<EditorState>(
    EditorState.createEmpty(),
  );
  const [insight, setInsight] = useState<string>('');
  const [createdDocument, setCreatedDocument] = useState<Document | null>(null);
  const [isSummaryDisplayed, setIsSummaryDisplayed] = useState<boolean>(false);
  const { data: tags } = useTagsByTeam(selectedTeamId);

  const [selectedTagsIds, setSelectedTagsIds] = useState<string[]>([]);
  const {
    mutateAsync: createDocument,
    isPending: isCreateDocumentLoading,
    isSuccess: isCreateDocumentSuccess,
  } = useCreateDocument();
  const {
    mutateAsync: createComment,
    isPending: isCreateCommentLoading,
    isSuccess: isCreateCommentSuccess,
  } = useCreateComment();
  const { data: currentPageUrl } = useCurrentPageUrl();
  const { data: alreadyPresentDocuments, isLoading: isSearchDocumentsLoading } =
    useSearchDocumentsByUrl(currentPageUrl || '');
  const isCreateDocumentAndCommentLoading = useMemo(
    () => isCreateDocumentLoading || isCreateCommentLoading,
    [isCreateDocumentLoading, isCreateCommentLoading],
  );
  const isSuccess = useMemo(
    () => isCreateDocumentSuccess && isCreateCommentSuccess,
    [isCreateDocumentSuccess, isCreateCommentSuccess],
  );
  const isAlreadyPresent = useMemo(
    () => alreadyPresentDocuments?.length > 0 && !isSuccess,
    [alreadyPresentDocuments, isSuccess],
  );
  const shouldDisplayIsAlreadyPresent = useMemo(() => {
    if (!isAlreadyPresent && !createdDocument) {
      return false;
    }
    return !(
      selectedTeamId &&
      !(
        alreadyPresentDocuments.some((document) => {
          return document.team === selectedTeamId;
        }) ||
        (createdDocument && createdDocument.team === selectedTeamId)
      )
    );
  }, [isAlreadyPresent, selectedTeamId, createdDocument]);
  const {
    data: summarizedPageContent,
    isLoading: isSummarizedPageContentLoading,
  } = useGetSummarizedText(
    currentPageUrl,
    true,
    // TODO voir si la condition çi-dessous est plus pratique si on ne veut pas lancer la requête du résumé alors qu'on l'a déjà
    // !shouldDisplayIsAlreadyPresent &&
    //   !createdDocument &&
    //   !(isCreateDocumentAndCommentLoading || isSearchDocumentsLoading),
  );
  useEffect(() => {
    if (!teams) {
      return;
    }
    const defaultSelectedTeamId = getDefaultSelectedTeamId(teams);
    if (defaultSelectedTeamId) {
      setSelectedTeamId(defaultSelectedTeamId);
    }
  }, [teams]);

  const userMentions = useMemo(
    () => [
      {
        text: 'Everyone',
        value: 'Everyone',
        url: CommentMentionType.EVERYONE,
      },
      ...uniqBy(
        [...(selectedTeam?.users.map((user) => user.user) || [])],
        (user) => user?._id,
      )
        .filter((user): user is UserForOtherClient => !!user)
        .map((user) => ({
          text: `${user.firstName} ${user.lastName}`,
          value: `${user.firstName} ${user.lastName}`,
          url: user._id,
        })),
    ],
    [selectedTeam?.users],
  );

  const convertEditorStateToComment = (
    editorState: EditorState,
  ): CreateCommentDTO | null => {
    let plainText = editorState.getCurrentContent().getPlainText();
    const text = convertToRaw(editorState.getCurrentContent());
    const entityMap = text.entityMap;

    let latestMentionStartIndex = 0;
    const mentions: CommentMention[] = Object.values(entityMap).map(
      (entity: any) => {
        const mentionStartIndex = plainText.indexOf(
          entity.data.text,
          latestMentionStartIndex,
        );
        latestMentionStartIndex = mentionStartIndex;
        plainText = plainText.replace(entity.data.text, '');
        return {
          type:
            entity.data.url === CommentMentionType.EVERYONE
              ? CommentMentionType.EVERYONE
              : CommentMentionType.USER,
          user:
            entity.data.url === CommentMentionType.USER
              ? entity.data.url
              : undefined,
          start: mentionStartIndex,
        };
      },
    );
    return {
      content: plainText,

      mentions,
    };
  };
  const onSubmit = async () => {
    const comment = convertEditorStateToComment(editedComment);
    const clippedPage = await getClippedPage();
    if (!clippedPage || !selectedTeamId) {
      return;
    }
    const document = await createDocument({
      teamId: selectedTeamId,
      createDocumentDTO: {
        tags: selectedTagsIds,
        keyInsight: insight,
        type: 'webpage',
        ...(summarizedPageContent && summarizedPageContent.length > 0
          ? { aiSummary: summarizedPageContent }
          : {}),
        ...clippedPage,
      },
    });
    if (comment?.content) {
      await createComment({
        documentId: document._id,
        createCommentDTO: {
          content: comment.content,
          mentions: comment.mentions,
        },
      });
    }

    setCreatedDocument(document);
  };

  const formattedSummary = () => {
    const summary =
      alreadyPresentDocuments?.[0]?.aiSummary || summarizedPageContent;
    return (
      <ul style={{ paddingInlineStart: '15px' }}>
        {summary.map((sentence, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <Typography
              variant="body2"
              whiteSpace="pre-line"
              sx={{ fontStyle: 'italic' }}
            >
              {sentence}
            </Typography>
          </li>
        ))}
      </ul>
    );
  };

  if (
    isCreateDocumentAndCommentLoading ||
    isSearchDocumentsLoading ||
    (isSummarizedPageContentLoading && isSummaryDisplayed)
  ) {
    return <CircularProgress />;
  }
  if (
    isSummaryDisplayed &&
    (!!summarizedPageContent ||
      (alreadyPresentDocuments?.length > 0 &&
        !!alreadyPresentDocuments[0]?.aiSummary))
  ) {
    return (
      <Stack>
        <Box>
          <Typography
            variant="h5"
            sx={{ color: 'primary.main', marginBottom: '10px' }}
          >
            {'Summary'}
          </Typography>
          {formattedSummary()}
        </Box>
        <Button
          onClick={() => setIsSummaryDisplayed(false)}
          variant="contained"
          color="primary"
          sx={{
            elevation: 0,
            boxShadow: 'none',
            ':hover': {
              boxShadow: 'none',
            },
            textTransform: 'none',
            alignSelf: 'flex-end',
          }}
        >
          Back
        </Button>
      </Stack>
    );
  }
  return (
    <Stack>
      {!shouldDisplayIsAlreadyPresent ? (
        <>
          <Typography variant="h6">Save this article to Stample</Typography>
          <Typography variant="body2" paddingBottom={2} color="primary">
            You can review our summary and add your insights before saving.
          </Typography>
        </>
      ) : (
        <>
          <Stack direction="row" alignItems="center">
            {!!createdDocument ? <CheckCircle /> : null}
            <Typography variant="h6" fontWeight={500}>
              {isAlreadyPresent
                ? 'This page is already saved in your knowledge base'
                : 'Your page has been saved in your knowledge base'}
            </Typography>
          </Stack>
          <Typography
            variant="h6"
            fontWeight={400}
            paddingTop={2}
            paddingBottom={1}
          >
            Select another team to save this page
          </Typography>
        </>
      )}
      <Typography variant="body2" fontWeight={500}>
        Select a team
      </Typography>
      <TextField
        select
        value={selectedTeamId}
        onChange={(e) => setSelectedTeamId(e.target.value as string)}
        variant="standard"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        sx={{
          paddingBottom: 2,
          '.MuiInputBase-root': {
            fontSize: '14px',
          },
        }}
      >
        {teams?.map((team) => (
          <MenuItem value={team._id} key={team._id}>
            {getTeamDisplayedName(team)}
          </MenuItem>
        ))}
      </TextField>
      {/*{shouldDisplayIsAlreadyPresent ? (*/}
      {/*  <>*/}
      {/*    <Button*/}
      {/*      sx={{*/}
      {/*        alignSelf: 'flex-end',*/}
      {/*        marginTop: 2,*/}
      {/*      }}*/}
      {/*      variant="contained"*/}
      {/*      onClick={() => {*/}
      {/*        const url = getDocumentUrlOnStampleWebsite(*/}
      {/*          isAlreadyPresent*/}
      {/*            ? alreadyPresentDocuments?.[0]?._id*/}
      {/*            : !!createdDocument*/}
      {/*            ? createdDocument._id*/}
      {/*            : '',*/}
      {/*        );*/}
      {/*        window.open(url, '_blank');*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      See in Stample*/}
      {/*    </Button>*/}
      {/*  </>*/}
      {/*) : null}*/}
      {!shouldDisplayIsAlreadyPresent ? (
        <>
          <Typography
            variant="body2"
            fontWeight={500}
            paddingTop={2}
            paddingBottom={1}
          >
            Add a key insight
          </Typography>
          <TextField
            variant="standard"
            placeholder="Key insights"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            value={insight}
            onChange={(e) => setInsight(e.target.value)}
            sx={{
              paddingBottom: 2,
              '.MuiInputBase-root': {
                fontSize: '14px',
              },
            }}
          />
          <Typography
            variant="body2"
            fontWeight={500}
            paddingTop={2}
            paddingBottom={1}
          >
            Add a tag
          </Typography>
          <SelectTags
            tags={tags.raw}
            selectedTags={selectedTagsIds}
            onChange={setSelectedTagsIds}
          />
          <Typography
            variant="body2"
            fontWeight={500}
            paddingTop={3}
            paddingBottom={1}
          >
            Add comments and mentions
          </Typography>
          <Editor
            editorState={editedComment}
            onEditorStateChange={(value) => setEditedComment(value)}
            placeholder="Write a comment..."
            mention={{
              separator: ' ',
              trigger: '@',
              suggestions: userMentions,
            }}
            wrapperStyle={{
              width: '100%',
              overflowY: 'visible',
            }}
            editorStyle={{
              overflowY: 'visible',
              overflow: 'unset',
              fontSize: '14px',
              borderBottom: '1px solid #e0e0e0',
              fontWeight: 200,
              cursor: 'text',
            }}
            toolbarHidden
          />
          <Stack
            direction="row"
            justifyContent={!isSummaryDisplayed ? 'space-between' : 'flex-end'}
            paddingTop={3}
          >
            {!isSummaryDisplayed ? (
              <Button
                onClick={() => setIsSummaryDisplayed(true)}
                variant="contained"
                color="primary"
                sx={{
                  elevation: 0,
                  boxShadow: 'none',
                  ':hover': {
                    boxShadow: 'none',
                  },
                  textTransform: 'none',
                  alignSelf: 'flex-end',
                }}
                disabled={!summarizedPageContent}
              >
                {isSummarizedPageContentLoading
                  ? 'Index summary...'
                  : 'See summary'}
              </Button>
            ) : null}
            <Button
              onClick={onSubmit}
              variant="contained"
              color="primary"
              disabled={!selectedTeamId}
              sx={{
                elevation: 0,
                boxShadow: 'none',
                ':hover': {
                  boxShadow: 'none',
                },
                textTransform: 'none',
              }}
            >
              Save this article
            </Button>
          </Stack>
        </>
      ) : null}
    </Stack>
  );
}

export default WebClipper;
