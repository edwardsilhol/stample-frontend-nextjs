'use client';

import { TagRich } from '../../../stores/types/tag.types';
import { IconButton, Tooltip } from '@mui/material';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Add from '@mui/icons-material/Add';
import { TreeItem } from '@mui/x-tree-view';
import { MouseEvent, Ref, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Delete from '@mui/icons-material/Delete';
import { useDeleteTag } from '../../../stores/hooks/tag.hooks';
import { RouteParams } from '../../../stores/types/global.types';
import { useParams } from 'next/navigation';

const TAG_NAME_MAX_LENGTH = 30;

interface TagViewProps {
  tag: TagRich;
  isOriginalParent: boolean;
  setHoveredTagId: (tagId: string | null) => void;
  documentsCountPerTags: Record<string, number>;
  hoveredTagId: string | null;
  handleClickAddTag: (event: MouseEvent<HTMLElement>, tagId: string) => void;
  handleClickSelectTag: (
    event: MouseEvent<HTMLElement>,
    tagId?: string,
  ) => void;
  anchorRef: Ref<HTMLLIElement> | undefined;
}

function TagView({
  tag: { _id, name, children },
  isOriginalParent,
  hoveredTagId,
  setHoveredTagId,
  documentsCountPerTags,
  handleClickAddTag,
  handleClickSelectTag,
  anchorRef,
}: TagViewProps) {
  const { teamId } = useParams<RouteParams>();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const deleteTag = useDeleteTag();

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(null);
  };

  const handleDeleteTag = async (
    event: MouseEvent<HTMLElement>,
    tagId: string,
  ) => {
    event.stopPropagation();
    await deleteTag.mutateAsync({
      tagId,
      teamId,
    });
  };

  const tagOptions = [
    {
      text: 'Add',
      Icon: Add,
      onClick: handleClickAddTag,
    },
    {
      text: 'Delete',
      Icon: Delete,
      onClick: handleDeleteTag,
      // TODO: add confirmation dialog
    },
  ];
  const renderTagOptionsButton = () => (
    <>
      <IconButton
        aria-describedby={_id}
        sx={{
          display: hoveredTagId === _id ? 'inline-flex' : 'none',
          borderRadius: '4px',
          width: '14px',
          height: '14px',
          padding: 0,
        }}
        onClick={handleMenuClick}
      >
        <MoreHorizIcon
          sx={{
            height: '14px',
          }}
        />
      </IconButton>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {tagOptions.map(({ text, Icon, onClick }, index) => (
          <MenuItem
            key={index}
            onClick={(e) => {
              onClick(e, _id);
              handleMenuClose(e);
            }}
          >
            <ListItemIcon>
              <Icon
                sx={{
                  height: '14px',
                }}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">{text}</Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  return (
    <TreeItem
      ref={anchorRef}
      sx={{
        marginY: '5px',
        '.MuiTreeItem-label': { paddingLeft: 0 },
        '.MuiTreeItem-content.Mui-selected': {
          backgroundColor: 'transparent',
        },
        '.MuiTreeItem-content.Mui-focused': {
          backgroundColor: 'transparent',
        },
        '.MuiTreeItem-content:hover': {
          backgroundColor: 'transparent',
          '& .MuiTypography-root:hover': {
            color: 'primary.main',
          },
        },
        '.MuiTreeItem-content.Mui-selected .MuiTypography-root': {
          fontWeight: 'bold',
        },
        '.MuiTreeItem-iconContainer': {
          marginRight: 0,
        },
      }}
      key={_id}
      nodeId={_id}
      collapseIcon={<KeyboardArrowUp style={{ fontSize: '16px' }} />}
      expandIcon={<KeyboardArrowDown style={{ fontSize: '16px' }} />}
      ContentProps={{
        style: {
          marginLeft: 0,
        },
      }}
      label={
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          onMouseEnter={() => setHoveredTagId(_id)}
          onMouseLeave={() => setHoveredTagId(null)}
          sx={{
            '&:hover $tagAddButton': {
              display: 'inline-flex',
            },
          }}
          paddingY={0.4}
        >
          <Stack direction="row" alignItems="center" maxWidth="100%">
            <LocalOfferOutlined
              sx={{ fontSize: '18px', marginRight: 1 }}
              color="primary"
            />

            <Tooltip
              title={
                name && name.length && name.length > TAG_NAME_MAX_LENGTH
                  ? name.toLowerCase()
                  : ''
              }
            >
              <Typography
                variant="body2"
                fontWeight={isOriginalParent ? 500 : 400}
                paddingRight={1}
              >
                {name && name.length
                  ? name.length > TAG_NAME_MAX_LENGTH
                    ? `${name.toLowerCase().slice(0, TAG_NAME_MAX_LENGTH)}...`
                    : name.toLowerCase()
                  : ''}
              </Typography>
            </Tooltip>
            <Typography variant="body2" sx={{ opacity: 0.5 }}>
              {documentsCountPerTags[_id] || ''}
            </Typography>
          </Stack>
          {renderTagOptionsButton()}
        </Stack>
      }
      onClick={(event) => {
        handleClickSelectTag(event, _id);
      }}
    >
      {children &&
        children.length > 0 &&
        children.map((child: TagRich) => (
          <TagView
            key={child._id}
            tag={child}
            isOriginalParent={false}
            setHoveredTagId={setHoveredTagId}
            documentsCountPerTags={documentsCountPerTags}
            hoveredTagId={hoveredTagId}
            handleClickAddTag={handleClickAddTag}
            handleClickSelectTag={handleClickSelectTag}
            anchorRef={anchorRef}
          />
        ))}
    </TreeItem>
  );
}
export default TagView;
