import React from 'react';
import Stack from '../../muiOverrides/Stack';
import { CircularProgress, Divider, IconButton } from '@mui/material';
import { Close, OpenInNew } from '@mui/icons-material';
import { Document } from '../../../stores/types/document.types';
import Typography from '../../muiOverrides/Typography';
import { Tag } from '../../../stores/types/tag.types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useDocument } from '../../../stores/hooks/document.hooks';
import EditCase from './EditCase';
interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
  selectedDocument: Document | null;
  setShowDocument: React.Dispatch<React.SetStateAction<boolean>>;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Stack>{children}</Stack>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs({
  selectedDocument,
  setShowDocument,
}: {
  selectedDocument: Document | null;
  setShowDocument: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <Box sx={{ width: 500 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="inherit"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label="edit" {...a11yProps(0)} />
        <Tab label="web" {...a11yProps(1)} />
        <Tab label="apercu" {...a11yProps(2)} />
      </Tabs>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel
          value={value}
          index={0}
          dir={theme.direction}
          selectedDocument={selectedDocument}
          setShowDocument={setShowDocument}
        >
          Edit
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
          dir={theme.direction}
          selectedDocument={selectedDocument}
          setShowDocument={setShowDocument}
        ></TabPanel>
        <TabPanel
          value={value}
          index={2}
          dir={theme.direction}
          selectedDocument={selectedDocument}
          setShowDocument={setShowDocument}
        ></TabPanel>
      </SwipeableViews>
    </Box>
  );
}

interface DocumentViewProps {
  documentId: string;
  setDocumentId: (id: string) => void;
  tags?: Tag[];
}

export const DocumentView: React.FC<DocumentViewProps> = ({
  documentId,
  setDocumentId,
  tags,
}) => {
  const { data: document, isLoading } = useDocument(documentId);
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChangeTabIndex = (
    event: React.SyntheticEvent,
    newIndex: number,
  ) => {
    setTabIndex(newIndex);
  };
  const getDocumentView = () => {
    const tagsString = document?.tags
      ?.map((tag) => tags?.find((t) => t._id === tag)?.name)
      ?.map((tag) => `#${tag}`)
      ?.join(' ');

    switch (tabIndex) {
      case 0:
        return (
          <EditCase
            document={document ?? undefined}
            tags={tags}
            showDocument={true}
          />
        );
      case 1:
        return document?.url ? (
          <Stack
            direction="column"
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            <iframe
              src={document.url}
              style={{
                height: 'calc(100vh - 42px)',
                width: '100%',
                border: 'none',
              }}
            />
          </Stack>
        ) : null;
      case 2:
        return document?.content ? (
          <>
            <Typography variant="h1">{document.title}</Typography>
            <Typography
              fontSize={'11px'}
              fontWeight={400}
              color={'rgba(0, 0, 255, 0.8)'}
            >
              {tagsString}
            </Typography>
            <Divider sx={{ margin: '10px 0' }} />
            <div dangerouslySetInnerHTML={{ __html: document.content }} />
          </>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Stack
      direction={'column'}
      width={'100%'}
      sx={{
        borderLeft: '1px solid #d3d4d5',
      }}
    >
      <Stack
        direction={'row'}
        padding={'8px 16px'}
        justifyContent={'space-between'}
      >
        <IconButton
          onClick={() => setDocumentId('')}
          sx={{ padding: '0 2px', borderRadius: '4px' }}
        >
          <Close />
        </IconButton>
        {document?.url && (
          <a href={document.url} target="_blank" rel="noreferrer">
            <IconButton sx={{ padding: '0 2px', borderRadius: '4px' }}>
              <OpenInNew />
            </IconButton>
          </a>
        )}
      </Stack>
      {!document && !isLoading ? (
        <Stack justifyContent={'center'} alignItems={'center'} height={'100%'}>
          <h1>Document not found</h1>
        </Stack>
      ) : isLoading ? (
        <Stack justifyContent={'center'} alignItems={'center'} height={'100%'}>
          <CircularProgress />
        </Stack>
      ) : (
        <Stack
          direction={'column'}
          width={'100%'}
          padding={'10px 30px'}
          sx={{
            maxHeight: 'calc(100vh - 42px)',
            flexGrow: 1,
            overflowY: 'auto',
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={handleChangeTabIndex}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="edit" {...a11yProps(0)} />
            <Tab label="web" {...a11yProps(1)} />
            <Tab label="apercu" {...a11yProps(2)} />
          </Tabs>
          {getDocumentView()}
        </Stack>
      )}
    </Stack>
  );
};
