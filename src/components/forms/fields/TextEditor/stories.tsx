import { Meta } from '@storybook/react';
import TextEditor from './index';
import { useEditor } from './hooks/useEditor';

function renderTextEditor(args: any) {
  const editor = useEditor(args);
  return <TextEditor editor={editor} />;
}
export default {
  title: 'Components/Forms/Fields/TextEditor',
  render: renderTextEditor,
} as Meta;

export const Default = {};
export const WithContent = {
  args: {
    content: `<p>Editable content! 👋</p>`,
  },
};
export const WithPlaceholder = {
  args: {
    placeholder: 'Placeholder',
  },
};

export const ReadOnly = {
  args: {
    editable: false,
    content: `<p>Read only !</p>`,
  },
};

export const WithCustomStyles = {
  args: {
    content: `<p>With custom styles!</p>`,
    editorStyle: {
      height: '136px',
      border: '1px solid',
      borderColor: 'rgba(0, 0, 0, 0.23)',
      borderRadius: '8px',
      padding: '0px 10px',
    },
  },
};
