import React, { FC } from 'react';
import { TreeItem, TreeView } from '@mui/lab';
import { Add, ArrowDropDown, ArrowRight, Check } from '@mui/icons-material';
import { TagRich } from '../../../stores/types/tag.types';
import Stack from '../../muiOverrides/Stack';
import Typography from '../../muiOverrides/Typography';
import { IconButton, InputBase, Popover } from '@mui/material';
import { useCreateTag, useUpdateTag } from '../../../stores/hooks/tag.hooks';
import { useRouter } from 'next/navigation';

const useStyles = () => ({
  treeView: {
    maxHeight: '80vh',
    flexGrow: 1,
    overflowY: 'auto',
  },
  tagsContainer: {
    '&:hover $tagAddButton': {
      display: 'inline-flex',
    },
  },
  tagAddButton: {
    display: 'none',
    borderRadius: '4px',
    width: '20px',
    height: '18px',
    padding: 0,
  },
  tagsLabel: {
    width: 'calc(100% - 20px)',
    color: 'black',
    opacity: 0.6,
    fontSize: '13px',
    fontWeight: 600,
  },
  popover: {
    '& .MuiPopover-paper': {
      boxShadow: '0 10px 30px rgb(0,0,0,0.13)',
      // boxShadow: 'none',
      border: '1px solid rgba(0,0,0,0.13)',
      borderRadius: '4px',
      padding: '0px',
      margin: '-20px 0 0 -20px',
    },
  },
  popoverInput: {
    backgroundColor: '#f6f5f4',
    width: '100px',
    height: '24px',
    margin: '0',
    padding: '0',
    borderRadius: '4px',
    border: '1px solid rgba(0,0,0,0)',
    '& .MuiInputBase-input': {
      padding: '0',
      margin: '0 4px',
      height: '24px',
      fontSize: '13px',
      fontWeight: 600,
      color: 'black',
      opacity: 0.6,
    },
  },
});

interface TagsViewProps {
  tags: TagRich[];
}
export const TagsView: FC<TagsViewProps> = ({ tags }) => {
  const styles = useStyles();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const [newTagName, setNewTagName] = React.useState<string>('');
  const [parentTagId, setParentTagId] = React.useState<string>('');
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();

  const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget.parentElement);
    setParentTagId(id);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCreateTag = () => {
    createTag.mutateAsync({ name: newTagName }).then((tag) => {
      tag &&
        updateTag.mutate({
          tagId: parentTagId,
          payload: { add: { children: [tag._id] } },
        });
    });
    setNewTagName('');
    handleClose();
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.key === 'Enter' && handleCreateTag();
  };

  const renderTags = ({ _id, name, children }: TagRich) => {
    return (
      <TreeItem
        key={_id}
        nodeId={_id}
        label={
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            sx={styles.tagsContainer}
            onClick={() => router.push(`/my/tag/${_id}`)}
          >
            <Typography sx={styles.tagsLabel}>{name}</Typography>
            <IconButton
              aria-describedby={_id}
              sx={styles.tagAddButton}
              onClick={(event) => {
                handleClick(event, _id);
              }}
            >
              <Add sx={{ height: '12px' }} />
            </IconButton>
          </Stack>
        }
      >
        {children &&
          children.length > 0 &&
          children.map((child: TagRich) => renderTags(child))}
      </TreeItem>
    );
  };

  return (
    <>
      <TreeView
        sx={styles.treeView}
        defaultCollapseIcon={
          <ArrowDropDown sx={{ height: '16px', color: '#4d4d4d' }} />
        }
        defaultExpandIcon={
          <ArrowRight sx={{ height: '16px', color: '#4d4d4d' }} />
        }
      >
        {tags && tags.map((tag) => renderTags(tag))}
      </TreeView>
      <Popover
        sx={styles.popover}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Stack
          direction={'row'}
          alignItems={'center'}
          spacing={'5px'}
          margin={'5px'}
        >
          <InputBase
            size={'small'}
            sx={styles.popoverInput}
            placeholder={'Name'}
            value={newTagName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewTagName(event.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
          <IconButton
            onClick={handleCreateTag}
            sx={{
              height: '24px',
              width: '24px',
              padding: '0',
              borderRadius: '4px',
            }}
          >
            <Check sx={{ height: '20px' }} />
          </IconButton>
        </Stack>
      </Popover>
    </>
  );
};
