import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
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
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { useTagsByTeam } from '../../stores/hooks/tag.hooks';
import { SelectTags } from './SelectTags';
import { Button } from '@mui/material';
import { useCreateDocument } from '../../stores/hooks/document.hooks';
import { useCreateComment } from '../../stores/hooks/comment.hooks';
import { getClippedPage } from '@src/helpers/clipper.helpers';
import { useSearchDocuments } from '../../stores/hooks/document.hooks';
import { useCurrentPageUrl } from '@src/stores/hooks/clipper.hooks';
interface Props {
  //
}

export const WebClipperContent: React.FC<Props> = () => {
  const { data: teams } = useAllTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const { data: selectedTeam } = useTeam(selectedTeamId);
  const [editedComment, setEditedComment] = useState<EditorState>(
    EditorState.createEmpty(),
  );
  const [summary, setSummary] = useState<string>('');
  const [isDocumentCreated, setIsDocumentCreated] = useState<boolean>(false);
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

  const { data: alreadyPresentDocument, isLoading: isSearchDocumentsLoading } =
    useSearchDocuments({
      url: [window.location.href],
    });
  const isCreateDocumentAndCommentLoading = useMemo(
    () => isCreateDocumentLoading || isCreateCommentLoading,
    [isCreateDocumentLoading, isCreateCommentLoading],
  );
  const isSuccess = useMemo(
    () => isCreateDocumentSuccess && isCreateCommentSuccess,
    [isCreateDocumentSuccess, isCreateCommentSuccess],
  );
  const isAlreadyPresent = useMemo(
    () => alreadyPresentDocument?.length > 0 && !isSuccess,
    [alreadyPresentDocument, isSuccess],
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
      team: selectedTeamId,
      tags: selectedTagsIds,
      summary: summary,
      type: 'webpage',
      ...clippedPage,
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

    setIsDocumentCreated(true);
  };

  if (isCreateDocumentAndCommentLoading || isSearchDocumentsLoading) {
    return <CircularProgress />;
  }
  if (isAlreadyPresent) {
    return (
      <Typography>This page is already saved in your knowledge base</Typography>
    );
  } else if (isDocumentCreated) {
    return (
      <Typography>Your page has been saved in your knowledge base</Typography>
    );
  }
  return (
    <Box>
      <Typography variant="h6">What do you want to highlight ?</Typography>
      <Typography variant="body2" paddingBottom={2}>
        Share this article with your team and add comments to illustrate what
        you share.
      </Typography>
      <TextField
        label="Add a key insight"
        variant="standard"
        placeholder="Key insights"
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        sx={{
          paddingBottom: 2,
        }}
      />
      <TextField
        select
        value={selectedTeamId}
        onChange={(e) => setSelectedTeamId(e.target.value as string)}
        variant="standard"
        fullWidth
        label="Select a team"
        InputLabelProps={{
          shrink: true,
        }}
        sx={{
          paddingBottom: 2,
        }}
      >
        {teams?.map((team) => (
          <MenuItem value={team._id} key={team._id}>
            {getTeamDisplayedName(team)}
          </MenuItem>
        ))}
      </TextField>
      <SelectTags
        tags={tags.raw}
        selectedTags={selectedTagsIds}
        onChange={setSelectedTagsIds}
      />
      <Box paddingBottom={2} />
      <Typography variant="body1">Add a comment</Typography>
      <Editor
        editorState={editedComment}
        onEditorStateChange={(value) => setEditedComment(value)}
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
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          padding: '8px',
          fontWeight: 200,
        }}
        toolbarHidden
      />
      <Stack direction="row" justifyContent="end" paddingTop={3}>
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
          }}
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export const WebClipper: React.FC<Props> = () => {
  const { data: teams } = useAllTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const { data: selectedTeam } = useTeam(selectedTeamId);
  const [editedComment, setEditedComment] = useState<EditorState>(
    EditorState.createEmpty(),
  );
  const [summary, setSummary] = useState<string>('');
  const [isDocumentCreated, setIsDocumentCreated] = useState<boolean>(false);
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
  const { data: alreadyPresentDocument, isLoading: isSearchDocumentsLoading } =
    useSearchDocuments({
      url: [currentPageUrl],
    });
  const isCreateDocumentAndCommentLoading = useMemo(
    () => isCreateDocumentLoading || isCreateCommentLoading,
    [isCreateDocumentLoading, isCreateCommentLoading],
  );
  const isSuccess = useMemo(
    () => isCreateDocumentSuccess && isCreateCommentSuccess,
    [isCreateDocumentSuccess, isCreateCommentSuccess],
  );
  const isAlreadyPresent = useMemo(
    () => alreadyPresentDocument?.length > 0 && !isSuccess,
    [alreadyPresentDocument, isSuccess],
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
      team: selectedTeamId,
      tags: selectedTagsIds,
      summary: summary,
      type: 'webpage',
      ...clippedPage,
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

    setIsDocumentCreated(true);
  };

  if (isCreateDocumentAndCommentLoading || isSearchDocumentsLoading) {
    return <CircularProgress />;
  }
  if (isAlreadyPresent) {
    return (
      <Typography>This page is already saved in your knowledge base</Typography>
    );
  } else if (isDocumentCreated) {
    return (
      <Typography>Your page has been saved in your knowledge base</Typography>
    );
  }
  return (
    <Box>
      <Typography variant="h6">What do you want to highlight ?</Typography>
      <Typography variant="body2" paddingBottom={2}>
        Share this article with your team and add comments to illustrate what
        you share.
      </Typography>
      <TextField
        label="Add a key insight"
        variant="standard"
        placeholder="Key insights"
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        sx={{
          paddingBottom: 2,
        }}
      />
      <TextField
        select
        value={selectedTeamId}
        onChange={(e) => setSelectedTeamId(e.target.value as string)}
        variant="standard"
        fullWidth
        label="Select a team"
        InputLabelProps={{
          shrink: true,
        }}
        sx={{
          paddingBottom: 2,
        }}
      >
        {teams?.map((team) => (
          <MenuItem value={team._id} key={team._id}>
            {getTeamDisplayedName(team)}
          </MenuItem>
        ))}
      </TextField>
      <SelectTags
        tags={tags.raw}
        selectedTags={selectedTagsIds}
        onChange={setSelectedTagsIds}
      />
      <Box paddingBottom={2} />
      <Typography variant="body1">Add a comment</Typography>
      <Editor
        editorState={editedComment}
        onEditorStateChange={(value) => setEditedComment(value)}
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
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          padding: '8px',
          fontWeight: 200,
          minHeight: '100px',
          cursor: 'text',
        }}
        toolbarHidden
      />
      <Stack direction="row" justifyContent="end" paddingTop={3}>
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
          }}
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
};
