import {
  Box,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  getDefaultSelectedTeamId,
  getTeamDisplayedName,
} from '../../helpers/team.helper';
import { useEffect, useMemo, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { useAllTeams, useTeam } from '../../stores/hooks/team.hooks';
import { CommentMention } from '../../stores/types/comment.types';
import { UserForOtherClient } from '../../stores/types/user.types';
import {
  CommentMentionType,
  CreateCommentDTO,
} from '../../stores/types/comment.types';
import { uniqBy } from 'lodash';
import { EditorState, convertToRaw } from 'draft-js';
import { MenuItem } from '@mui/material';
import { useTagsByTeam } from '../../stores/hooks/tag.hooks';
import { SelectTags } from './SelectTags';
import { Button } from '@mui/material';
import {
  useCreateDocument,
  useGetSummarizedText,
  useSearchDocumentsByUrl,
} from '../../stores/hooks/document.hooks';
import { useCreateComment } from '../../stores/hooks/comment.hooks';
import { getClippedPage } from '@src/helpers/clipper.helpers';
import { useCurrentPageUrl } from '@src/stores/hooks/clipper.hooks';
import { getDocumentUrlOnStampleWebsite } from '@src/helpers/document.helpers';
import { Document } from '@src/stores/types/document.types';
import { CheckCircle } from '@mui/icons-material';
export const WebClipper: React.FC = () => {
  const { data: teams } = useAllTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const { data: selectedTeam } = useTeam(selectedTeamId);
  const [editedComment, setEditedComment] = useState<EditorState>(
    EditorState.createEmpty(),
  );
  const [insight, setInsight] = useState<string>('');
  const [createdDocument, setCreatedDocument] = useState<Document | null>(null);
  const [isSummaryDisplayed, setIsSummaryDisplayed] = useState<boolean>(true);
  const { data: tags } = useTagsByTeam(selectedTeamId);

  const [selectedTagsIds, setSelectedTagsIds] = useState<string[]>([]);
  const {
    mutateAsync: createDocument,
    isLoading: isCreateDocumentLoading,
    isSuccess: isCreateDocumentSuccess,
  } = useCreateDocument();
  const {
    mutateAsync: createComment,
    isLoading: isCreateCommentLoading,
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
    if (
      selectedTeamId &&
      !(
        alreadyPresentDocuments.some((document) => {
          return document.team === selectedTeamId;
        }) ||
        (createdDocument && createdDocument.team === selectedTeamId)
      )
    ) {
      return false;
    }
    return true;
  }, [isAlreadyPresent, selectedTeamId, createdDocument]);
  const {
    data: summarizedPageContent,
    isLoading: isSummarizedPageContentLoading,
    error: isSummarizedPageContentError,
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

  if (
    isCreateDocumentAndCommentLoading ||
    isSearchDocumentsLoading ||
    (isSummarizedPageContentLoading &&
      isSummaryDisplayed &&
      !isSummarizedPageContentError)
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
        <Box
          sx={{
            backgroundColor: 'rgba(237,237,237,0.4)',
            padding: '20px 30px',
            borderBottomLeftRadius: '20px',
            borderTopRightRadius: '20px',
            boxSizing: 'border-box',
            marginBottom: '30px',
            boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: 'primary.main', marginBottom: '10px' }}
          >
            {'Summary'}
          </Typography>
          <Typography
            variant="body1"
            whiteSpace="pre-line"
            sx={{ fontStyle: 'italic' }}
          >
            {(
              alreadyPresentDocuments?.[0]?.aiSummary || summarizedPageContent
            )?.toString()}
          </Typography>
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
          {'Save in Stample'}
        </Button>
      </Stack>
    );
  }
  return (
    <Stack>
      {!shouldDisplayIsAlreadyPresent ? (
        <>
          <Typography variant="h6">What do you want to highlight ?</Typography>
          <Typography variant="body2" paddingBottom={2} color="primary">
            Share this article with your team and add comments to illustrate
            what you share.
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
      {shouldDisplayIsAlreadyPresent ? (
        <>
          {isSummaryDisplayed ? (
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
                alignSelf: 'flex-start',
              }}
            >
              See summary
            </Button>
          ) : null}
          <Button
            sx={{
              alignSelf: 'flex-end',
              marginTop: 2,
            }}
            variant="contained"
            onClick={() => {
              const url = getDocumentUrlOnStampleWebsite(
                isAlreadyPresent
                  ? alreadyPresentDocuments?.[0]?._id
                  : !!createdDocument
                  ? createdDocument._id
                  : '',
              );
              window.open(url, '_blank');
            }}
          >
            See in Stample
          </Button>
        </>
      ) : null}
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
            justifyContent={isSummaryDisplayed ? 'space-between' : 'flex-end'}
            paddingTop={3}
          >
            {isSummaryDisplayed ? (
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
              >
                See summary
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
};
