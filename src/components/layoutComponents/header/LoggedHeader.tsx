import React from 'react';
import Stack from '../../muiOverrides/Stack';
import { CustomSearchBar } from './CustomSearchBar';
import { Tag } from '../../../stores/types/tag.types';
import { createUseStyles } from 'react-jss';

const tags: Tag[] = [
  {
    _id: '1',
    name: 'tag 1',
    children: ['3', '4'],
  },
  {
    _id: '2',
    name: 'tag 2',
    children: ['5', '6'],
  },
  {
    _id: '3',
    name: 'tag 3',
    children: [],
  },
  {
    _id: '4',
    name: 'tag 4',
    children: ['7'],
  },
  {
    _id: '5',
    name: 'tag 5',
    children: [],
  },
  {
    _id: '6',
    name: 'tag 6',
    children: [],
  },
  {
    _id: '7',
    name: 'tag 7',
    children: [],
  },
];

const useStyles = createUseStyles({
  container: {
    borderBottom: '1px solid #d3d4d5',
  },
});

export const LoggedHeader: React.FC = () => {
  const classes = useStyles();

  return (
    <Stack direction={'column'} className={classes.container}>
      <Stack direction={'row'}>
        <CustomSearchBar tags={tags} documents={[]} />
      </Stack>
    </Stack>
  );
};
