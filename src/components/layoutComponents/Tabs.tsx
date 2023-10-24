import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Card } from '@mui/material';
import { Document } from '../../stores/types/document.types';
import { Dispatch, ReactNode, SyntheticEvent, useState } from 'react';
import { SetStateAction } from 'jotai';

interface TabPanelProps {
  children?: ReactNode;
  dir?: string;
  index: number;
  value: number;
  selectedDocument: Document | null;
  setShowDocument: Dispatch<SetStateAction<boolean>>;
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
          <Card>{children}</Card>
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
  setShowDocument: Dispatch<SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
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
        >
          web
        </TabPanel>
        <TabPanel
          value={value}
          index={2}
          dir={theme.direction}
          selectedDocument={selectedDocument}
          setShowDocument={setShowDocument}
        >
          apercu
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
