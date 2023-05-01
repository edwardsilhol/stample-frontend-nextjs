import { Box, TextField } from '@mui/material';
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
import { uniq, uniqBy } from 'lodash';
import { EditorState, convertToRaw } from 'draft-js';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { useTagsByTeam } from '../../stores/hooks/tag.hooks';
import { SelectTags } from './SelectTags';
import { Button } from '@mui/material';
import { useCreateDocument } from '../../stores/hooks/document.hooks';
import { useCreateComment } from '../../stores/hooks/comment.hooks';
import { Readability, isProbablyReaderable } from '@mozilla/readability';
import { CreateDocumentDTO } from '@src/stores/types/document.types';
import { getClippedPage } from '@src/helpers/clipper.helpers';
interface Props {
  //
}

export const WebClipper: React.FC<Props> = () => {
  const { data: teams } = useAllTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const { data: selectedTeam } = useTeam(selectedTeamId);
  const [editedComment, setEditedComment] = useState<EditorState>(
    EditorState.createEmpty(),
  );
  const [summary, setSummary] = useState<string>('');
  const { data: tags } = useTagsByTeam(selectedTeamId);

  const [selectedTagsIds, setSelectedTagsIds] = useState<string[]>([]);
  const { mutateAsync: createDocument } = useCreateDocument();
  const { mutateAsync: createComment } = useCreateComment();
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
    createDocument({
      team: selectedTeamId,
      tags: selectedTagsIds,
      summary: summary,
      type: 'webpage',
      ...clippedPage,
    }).then((document) => {
      if (comment?.content) {
        createComment({
          documentId: document._id,
          createCommentDTO: {
            content: comment.content,
            mentions: comment.mentions,
          },
        });
      }
    });
  };

  return (
    <Box>
      <TextField
        label="Key insights"
        variant="outlined"
        fullWidth
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <Select
        value={selectedTeamId}
        onChange={(e) => setSelectedTeamId(e.target.value as string)}
      >
        {teams?.map((team) => (
          <MenuItem value={team._id} key={team._id}>
            {getTeamDisplayedName(team)}
          </MenuItem>
        ))}
      </Select>
      <SelectTags
        tags={tags.raw}
        selectedTags={selectedTagsIds}
        onChange={setSelectedTagsIds}
      />
      <Editor
        editorState={editedComment}
        onEditorStateChange={(value) => setEditedComment(value)}
        mention={{
          separator: ' ',
          trigger: '@',
          suggestions: userMentions,
        }}
        placeholder="Add a comment"
        wrapperStyle={{
          width: '100%',
          overflowY: 'visible',
        }}
        editorStyle={{
          overflowY: 'visible',
          overflow: 'unset',
        }}
        toolbarHidden
      />
      <Button
        onClick={onSubmit}
        variant="contained"
        color="primary"
        disabled={!selectedTeamId}
      >
        Submit
      </Button>
    </Box>
  );
};
