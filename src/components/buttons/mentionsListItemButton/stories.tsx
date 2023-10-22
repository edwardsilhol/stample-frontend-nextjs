import { Meta } from '@storybook/react';
import { MentionTypeaheadOption } from '../../forms/fields/richTextEditor/utils/mentions';
import MentionsListItemButton from './index';

export default {
  title: 'Components/Buttons/MentionsListItemButton',
  component: MentionsListItemButton,
  args: {
    isSelected: false,
    onClick: () => {
      console.log('clicked');
    },
    onMouseEnter: () => {
      console.log('mouse entered');
    },
    option: new MentionTypeaheadOption('user 1'),
  },
} as Meta;

export const Default = {};

export const WithPicture = {
  args: {
    option: new MentionTypeaheadOption('user 1', 'https://picsum.photos/200'),
  },
};
