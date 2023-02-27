import React, { FC } from 'react';
import { TreeItem, TreeView } from '@mui/lab';
import { Add, ArrowDropDown, ArrowRight } from '@mui/icons-material';
import { TagRich } from '../../../stores/types/tag.types';
import Stack from '../../muiOverrides/Stack';
import Typography from '../../muiOverrides/Typography';
import { IconButton } from '@mui/material';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
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
    color: 'black',
    opacity: 0.6,
    fontSize: '13px',
    fontWeight: 600,
  },
});

interface TagsViewProps {
  tags: TagRich[];
}
export const TagsView: FC<TagsViewProps> = ({ tags }) => {
  const classes = useStyles();
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
            className={classes.tagsContainer}
          >
            <Typography className={classes.tagsLabel}>{`#${name}`}</Typography>
            <IconButton
              className={classes.tagAddButton}
              onClick={(event) => {
                event.stopPropagation();
                console.log('add tag');
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
    <TreeView
      defaultCollapseIcon={
        <ArrowDropDown sx={{ height: '16px', color: '#4d4d4d' }} />
      }
      defaultExpandIcon={
        <ArrowRight sx={{ height: '16px', color: '#4d4d4d' }} />
      }
    >
      {tags && tags.map((tag) => renderTags(tag))}
    </TreeView>
  );
};
