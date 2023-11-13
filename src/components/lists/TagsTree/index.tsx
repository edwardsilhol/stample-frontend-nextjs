'use client';

import { TagRich } from '../../../stores/types/tag.types';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { TreeItemProps } from '@mui/lab';
import { TreeItem as MuiTreeItem } from '@mui/x-tree-view/TreeItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TreeView } from '@mui/x-tree-view';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import ArrowRight from '@mui/icons-material/ArrowRight';
import Add from '@mui/icons-material/Add';
import { useState, MouseEvent } from 'react';
import { TAG_ROUTE, TEAM_ROUTE } from '../../../constants/routes.constant';
import TagsTreeItem from 'components/lists/TagsTreeItem';
import CreateOrUpdateTagForm from '../../forms/tag/createOrUpdateTagForm';
import PublicIcon from '@mui/icons-material/Public';
import LabelOffIcon from '@mui/icons-material/LabelOff';
import { UNSORTED_TAGS_ID } from '../../../constants/tag.constants';
function TreeItem({
  sx,
  ...props
}: TreeItemProps & {
  isOriginalParent?: boolean;
}) {
  return (
    <MuiTreeItem
      sx={{
        '.MuiTreeItem-content': {
          paddingY: 0.3,
          flexDirection: 'row-reverse',
          marginX: 1,
          paddingX: 0,
          ':hover': {
            backgroundColor: 'additionalColors.sidebarBackground',
            borderRadius: '7px',
          },
        },
        ...[
          '.Mui-selected',
          '.Mui-focused',
          '.Mui-selected.Mui-focused',
          '.MuiTreeItem-content.Mui-selected',
          '.MuiTreeItem-content.Mui-focused',
          '.MuiTreeItem-content.Mui-selected.Mui-focused',
          '.Mui-selected.Mui-focused',
          '.MuiTreeItem-group',
          '.MuiTreeItem-label.MuiTypography-root',
        ].reduce((accumulator, selector) => {
          return {
            ...accumulator,
            [selector]: {
              backgroundColor: 'additionalColors.sidebarBackground',
              borderRadius: '7px',
            },
          };
        }, {}),
        '.MuiTreeItem-group': {
          marginLeft: '25px',
        },
        '.MuiTreeItem-label.MuiTypography-root': {
          fontWeight: 500,
        },
        ...sx,
      }}
      {...props}
    />
  );
}

interface TagsTreeProps {
  teamId: string;
  tags: TagRich[];
  documentsCountPerTags: Record<string, number>;
  onSelectTag: () => void;
  userHasTeamPrivilege?: boolean;
}
function TagsTree({
  teamId,
  tags,
  documentsCountPerTags,
  onSelectTag,
  userHasTeamPrivilege = false,
}: TagsTreeProps) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);
  const open = Boolean(anchorEl);

  const [hoveredTagId, setHoveredTagId] = useState<string | null>(null);

  const handleClickSelectTag = (
    event: MouseEvent<HTMLElement>,
    tagId?: string,
  ) => {
    event.stopPropagation();
    onSelectTag();
    router.push(
      `${TEAM_ROUTE}/${teamId}${tagId ? `/${TAG_ROUTE}/${tagId}` : ''}`,
    );
  };
  const handleClose = () => {
    setAnchorEl(undefined);
  };

  return (
    <>
      <Typography fontSize="10px" fontWeight={500}>
        TAGS
      </Typography>
      <TreeView
        sx={{
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 268px)',
          marginBottom: 0,
        }}
        defaultCollapseIcon={
          <ArrowDropDown sx={{ height: '16px', color: 'red' }} />
        }
        defaultExpandIcon={
          <ArrowRight sx={{ height: '16px', color: 'primary.main' }} />
        }
      >
        {[
          <TreeItem
            key="root"
            nodeId="root"
            endIcon={
              <>
                {userHasTeamPrivilege && (
                  <IconButton
                    sx={{
                      borderRadius: '10px',
                      width: '18px',
                      height: '16px',
                      padding: 0,
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      setAnchorEl(
                        event.currentTarget.parentElement || undefined,
                      );
                    }}
                  >
                    <Add sx={{ height: '12px' }} />
                  </IconButton>
                )}
              </>
            }
            ContentProps={{
              style: {
                marginLeft: 0,
              },
            }}
            sx={{
              '.MuiTreeItem-content .MuiTreeItem-label': {
                paddingLeft: 0,
              },
              '.MuiTreeItem-content .MuiTreeItem-iconContainer': {
                marginRight: 0,
              },
              '.MuiTreeItem-content:hover': {
                backgroundColor: 'transparent',
                '& .MuiTypography-root:hover': {
                  color: 'primary.main',
                },
              },
            }}
            label={
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="start"
                width="100%"
                spacing={1.5}
              >
                <PublicIcon sx={{ fontSize: '20px' }} color="primary" />
                <Typography variant="body2" fontWeight={500}>
                  All
                </Typography>
              </Stack>
            }
            onClick={(event) => {
              handleClickSelectTag(event);
            }}
          />,
          ...(documentsCountPerTags[UNSORTED_TAGS_ID] > 0
            ? [
                <TagsTreeItem
                  key="toSort"
                  tag={{
                    _id: UNSORTED_TAGS_ID,
                    name: 'Unsorted',
                    children: [],
                  }}
                  setHoveredTagId={setHoveredTagId}
                  documentsCountPerTags={documentsCountPerTags}
                  hoveredTagId={hoveredTagId}
                  handleClickSelectTag={handleClickSelectTag}
                  userHasTeamPrivilege={false}
                  Icon={LabelOffIcon}
                />,
              ]
            : []),
          ...(tags && tags.length > 0
            ? tags.map((tag) => (
                <TagsTreeItem
                  key={tag._id}
                  tag={tag}
                  userHasTeamPrivilege={userHasTeamPrivilege}
                  setHoveredTagId={setHoveredTagId}
                  documentsCountPerTags={documentsCountPerTags}
                  hoveredTagId={hoveredTagId}
                  handleClickSelectTag={handleClickSelectTag}
                />
              ))
            : []),
        ]}
      </TreeView>
      <CreateOrUpdateTagForm
        variant="create"
        teamId={teamId}
        handleClose={handleClose}
        open={open}
        anchorEl={anchorEl}
      />
    </>
  );
}
export default TagsTree;
