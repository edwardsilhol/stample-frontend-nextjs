import { TagRich } from '../../../stores/types/tag.types';
import { Button, IconButton, Popover, TextField } from '@mui/material';
import { useCreateTag, useUpdateTag } from '../../../stores/hooks/tag.hooks';
import { useRouter } from 'next/navigation';
import { TreeItemProps } from '@mui/lab';
import { TreeItem as MuiTreeItem } from '@mui/x-tree-view/TreeItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TreeView } from '@mui/x-tree-view';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import ArrowRight from '@mui/icons-material/ArrowRight';
import Add from '@mui/icons-material/Add';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import {
  useState,
  MouseEvent,
  KeyboardEvent,
  ChangeEvent,
  useRef,
} from 'react';
import { TAG_ROUTE, TEAM_ROUTE } from '../../../constants/routes.constant';
import TagView from 'components/view/TagView';

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

interface TagsViewProps {
  teamId: string;
  tags: TagRich[];
  documentsCountPerTags: Record<string, number>;
  onSelectTag: () => void;
}
function TagsView({
  teamId,
  tags,
  documentsCountPerTags,
  onSelectTag,
}: TagsViewProps) {
  const router = useRouter();
  const anchorRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const [newTagName, setNewTagName] = useState<string>('');
  const [tagParentId, setTagParentId] = useState<string | null>(null);
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const [hoveredTagId, setHoveredTagId] = useState<string | null>(null);

  const handleClickAddTag = (event: MouseEvent<HTMLElement>, id: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget.parentElement);
    if (id && id !== 'root') {
      setTagParentId(id);
    }
  };

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
    setAnchorEl(null);
  };

  const handleCreateTag = () => {
    if (teamId === null) {
      return;
    }
    createTag
      .mutateAsync({
        name: newTagName,
        teamId,
      })
      .then((tag) => {
        if (tagParentId && tag?._id) {
          updateTag.mutate({
            tagId: tagParentId,
            payload: { add: { children: [tag._id] } },
          });
        }
      });

    setNewTagName('');
    setTagParentId(null);
    handleClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.key === 'Enter' && handleCreateTag();
  };

  return (
    <>
      <Typography fontSize="10px" fontWeight={500}>
        TAGS
      </Typography>
      <TreeView
        {...(!tags.length ? { ref: anchorRef } : {})}
        sx={{
          overflow: 'hidden',
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
              <IconButton
                sx={{
                  borderRadius: '10px',
                  width: '18px',
                  height: '16px',
                  padding: 0,
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  handleClickAddTag(event, 'root');
                }}
              >
                <Add sx={{ height: '12px' }} />
              </IconButton>
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
                paddingY={0.4}
                width="100%"
              >
                <HomeOutlined
                  sx={{ fontSize: '20px', marginRight: 1 }}
                  color="primary"
                />
                <Typography variant="body2" fontWeight={500}>
                  All
                </Typography>
              </Stack>
            }
            onClick={(event) => {
              handleClickSelectTag(event);
            }}
          />,
          ...(tags
            ? tags.map((tag) => (
                <TagView
                  key={tag._id}
                  tag={tag}
                  isOriginalParent={true}
                  setHoveredTagId={setHoveredTagId}
                  documentsCountPerTags={documentsCountPerTags}
                  hoveredTagId={hoveredTagId}
                  handleClickAddTag={handleClickAddTag}
                  handleClickSelectTag={handleClickSelectTag}
                  anchorRef={anchorRef}
                />
              ))
            : []),
        ]}
      </TreeView>
      <Popover
        sx={{
          '& .MuiPopover-paper': {
            boxShadow: '0 10px 30px rgb(0,0,0,0.13)',
            border: '1px solid rgba(0,0,0,0.13)',
            borderRadius: '4px',
            margin: '-20px 0 0 -20px',
            padding: 1,
          },
        }}
        open={open}
        anchorEl={anchorRef.current}
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
        <Typography variant="body2" fontWeight={500} paddingBottom={0.5}>
          Tag
        </Typography>
        <Stack direction="row" alignItems="center" spacing="5px">
          <TextField
            autoFocus
            variant="outlined"
            placeholder="Enter your tag"
            value={newTagName}
            inputProps={{ sx: { paddingY: 0.75 } }}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setNewTagName(event.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="contained"
            onClick={handleCreateTag}
            sx={{
              textTransform: 'none',
              fontSize: '12px',
            }}
          >
            Submit
          </Button>
        </Stack>
      </Popover>
    </>
  );
}
export default TagsView;
