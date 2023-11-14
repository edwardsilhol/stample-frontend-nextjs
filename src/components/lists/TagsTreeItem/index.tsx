'use client';

import { TagRich } from '../../../stores/types/tag.types';
import { IconButton, SvgIconTypeMap, Tooltip } from '@mui/material';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Add from '@mui/icons-material/Add';
import { TreeItem } from '@mui/x-tree-view';
import { MouseEvent, useRef, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Delete from '@mui/icons-material/Delete';
import { useDeleteTag } from '../../../stores/hooks/tag.hooks';
import { RouteParams } from '../../../stores/types/global.types';
import { useParams } from 'next/navigation';
import ConfirmDialog from '../../modals/confirmDialog';
import CreateOrUpdateTagForm from '../../forms/tag/createOrUpdateTagForm';
import Edit from '@mui/icons-material/Edit';
import { OverridableComponent } from '@mui/types';

const TAG_NAME_MAX_LENGTH = 30;

interface TagsTreeItemProps {
  tag: TagRich;
  setHoveredTagId: (tagId: string | null) => void;
  documentsCountPerTags: Record<string, number>;
  hoveredTagId: string | null;
  handleClickSelectTag: (
    event: MouseEvent<HTMLElement>,
    tagId?: string,
  ) => void;
  userHasTeamPrivilege: boolean;
  parentId?: string;
  Icon?: OverridableComponent<SvgIconTypeMap> & { muiName: string };
}

function TagsTreeItem({
  tag: { _id, name, children },
  parentId,
  hoveredTagId,
  setHoveredTagId,
  documentsCountPerTags,
  handleClickSelectTag,
  userHasTeamPrivilege,
  Icon,
}: TagsTreeItemProps) {
  const { teamId } = useParams<RouteParams>();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const tagFormAnchorRef = useRef(null);
  const [tagFormAnchorEl, setTagFormAnchorEl] = useState<
    HTMLElement | undefined
  >(undefined);
  const [addTagFormOpen, setAddTagFormOpen] = useState(false);
  const [updateTagFormOpen, setUpdateTagFormOpen] = useState(false);
  const [deleteTagConfirmationDialogOpen, setDeleteTagConfirmationDialogOpen] =
    useState(false);

  const deleteTag = useDeleteTag();

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(null);
  };

  const handleDeleteTagOptionClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setDeleteTagConfirmationDialogOpen(true);
  };

  const handleDeleteTag = async (tagId: string) => {
    await deleteTag.mutateAsync({
      tagId,
      teamId,
    });
  };

  const handleAddTagOptionClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAddTagFormOpen(true);
    setTagFormAnchorEl(event.currentTarget || undefined);
  };

  const handleUpdateTagOptionClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setUpdateTagFormOpen(true);
    setTagFormAnchorEl(event.currentTarget || undefined);
  };

  const deleteTagConfirmationDialog = () => (
    <ConfirmDialog
      key={`delete-tag-${_id}`}
      open={deleteTagConfirmationDialogOpen}
      title="Delete Tag"
      content="Deleting this tag will delete all its children tags and documents."
      onConfirm={async (e) => {
        e.stopPropagation();
        await handleDeleteTag(_id);
        setDeleteTagConfirmationDialogOpen(false);
      }}
      onCancel={() => setDeleteTagConfirmationDialogOpen(false)}
    />
  );

  const tagOptions = [
    {
      text: 'Add',
      Icon: Add,
      onClick: handleAddTagOptionClick,
    },

    {
      text: 'Update',
      Icon: Edit,
      onClick: handleUpdateTagOptionClick,
    },
    {
      text: 'Delete',
      Icon: Delete,
      onClick: handleDeleteTagOptionClick,
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
              onClick(e);
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
    <>
      <TreeItem
        key={_id}
        ref={tagFormAnchorRef}
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
              {Icon ? (
                <Icon
                  sx={{ fontSize: '18px', marginRight: 1 }}
                  color="primary"
                />
              ) : (
                <LocalOfferOutlined
                  sx={{ fontSize: '18px', marginRight: 1 }}
                  color="primary"
                />
              )}

              <Tooltip
                title={
                  name && name.length && name.length > TAG_NAME_MAX_LENGTH
                    ? name.toLowerCase()
                    : ''
                }
              >
                <Typography
                  variant="body2"
                  fontWeight={parentId ? 500 : 400}
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
            {userHasTeamPrivilege && renderTagOptionsButton()}
          </Stack>
        }
        onClick={(event) => {
          handleClickSelectTag(event, _id);
        }}
      >
        {children &&
          children.length > 0 &&
          children
            .filter((tag) => !tag) // TODO: remove this filter when db is fixed
            .map((child: TagRich) => (
              <TagsTreeItem
                key={child._id}
                tag={child}
                parentId={_id}
                userHasTeamPrivilege={userHasTeamPrivilege}
                setHoveredTagId={setHoveredTagId}
                documentsCountPerTags={documentsCountPerTags}
                hoveredTagId={hoveredTagId}
                handleClickSelectTag={handleClickSelectTag}
              />
            ))}
      </TreeItem>
      {deleteTagConfirmationDialog()}
      <CreateOrUpdateTagForm
        key={`create-tag-${_id}`}
        variant="create"
        teamId={teamId}
        handleClose={() => {
          setAddTagFormOpen(false);
          setTagFormAnchorEl(undefined);
        }}
        open={addTagFormOpen}
        tagId={_id}
        anchorEl={tagFormAnchorRef?.current || tagFormAnchorEl}
      />
      <CreateOrUpdateTagForm
        key={`update-tag-${_id}`}
        variant="update"
        teamId={teamId}
        handleClose={() => {
          setUpdateTagFormOpen(false);
          setTagFormAnchorEl(undefined);
        }}
        open={updateTagFormOpen}
        tagId={_id}
        anchorEl={tagFormAnchorRef?.current || tagFormAnchorEl}
      />
    </>
  );
}
export default TagsTreeItem;
