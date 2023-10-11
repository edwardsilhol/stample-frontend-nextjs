import { TagRich } from '../../../stores/types/tag.types';
import { Button, IconButton, Popover, TextField, Tooltip } from '@mui/material';
import { useCreateTag, useUpdateTag } from '../../../stores/hooks/tag.hooks';
import { useSelectedTagId } from 'stores/data/tag.data';
import { useSelectedTeamId } from 'stores/data/team.data';
import { usePathname, useRouter } from 'next/navigation';
import { useCurrentlyViewedDocumentId } from 'stores/data/document.data';
import { TreeItemProps } from '@mui/lab';
import { TreeItem as MuiTreeItem } from '@mui/x-tree-view/TreeItem';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TreeView } from '@mui/x-tree-view';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import ArrowRight from '@mui/icons-material/ArrowRight';
import Add from '@mui/icons-material/Add';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import { useState, MouseEvent } from 'react';

const TAG_NAME_MAX_LENGTH = 30;
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
  tags: TagRich[];
  documentsCountPerTags: Record<string, number>;
  onSelectTag: () => void;
}
function TagsView({ tags, documentsCountPerTags, onSelectTag }: TagsViewProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedTeamId] = useSelectedTeamId();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const [newTagName, setNewTagName] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSelectedTagId] = useSelectedTagId();
  const [currentlyViewedDocumentId, setCurrentlyViewedDocumentId] =
    useCurrentlyViewedDocumentId();
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
    event: React.MouseEvent<HTMLElement>,
    id: string,
  ) => {
    event.stopPropagation();
    setSelectedTagId(id);
    onSelectTag();
    if (pathname !== '/me') {
      router.push('/me');
    } else if (!!currentlyViewedDocumentId) {
      setCurrentlyViewedDocumentId(null);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateTag = () => {
    if (selectedTeamId === null) {
      return;
    }
    createTag
      .mutateAsync({
        tagCreationDTO: { name: newTagName },
        teamId: selectedTeamId,
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.key === 'Enter' && handleCreateTag();
  };

  const renderTag = ({
    _id,
    name,
    children,
    isOriginalParent,
  }: TagRich & { isOriginalParent: boolean }) => {
    if (_id === undefined) {
      return null; // TODO: why do we have to do this ?
    }
    return (
      <TreeItem
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
            <IconButton
              aria-describedby={_id}
              sx={{
                display: hoveredTagId === _id ? 'inline-flex' : 'none',
                borderRadius: '4px',
                width: '14px',
                height: '14px',
                padding: 0,
              }}
              onClick={(event) => {
                handleClickAddTag(event, _id);
              }}
            >
              <Add sx={{ height: '14px' }} />
            </IconButton>
          </Stack>
        }
        onClick={(event) => {
          handleClickSelectTag(event, _id);
        }}
      >
        {children &&
          children.length > 0 &&
          children.map((child: TagRich) =>
            renderTag({ ...child, isOriginalParent: false }),
          )}
      </TreeItem>
    );
  };

  return (
    <>
      <Typography fontSize="10px" fontWeight={500} paddingBottom={1}>
        TAGS
      </Typography>
      <TreeView
        sx={{
          overflowY: 'scroll',
          overflowX: 'hidden',
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
              handleClickSelectTag(event, '');
            }}
          />,
          ...(tags
            ? tags.map((tag) =>
                renderTag({
                  ...tag,
                  isOriginalParent: true,
                }),
              )
            : []),
        ]}
      </TreeView>
      <Popover
        sx={{
          '& .MuiPopover-paper': {
            boxShadow: '0 10px 30px rgb(0,0,0,0.13)',
            // boxShadow: 'none',
            border: '1px solid rgba(0,0,0,0.13)',
            borderRadius: '4px',
            margin: '-20px 0 0 -20px',
            padding: 1,
          },
        }}
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
