import { RichTextPlugin as LexicalRichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

interface RichTextPluginProps {
  editable?: boolean;
  placeholder?: string;
}
function RichTextPlugin({ editable = true, placeholder }: RichTextPluginProps) {
  function Placeholder() {
    return (
      <div
        style={{
          color: '#999',
          overflow: 'hidden',
          position: 'absolute',
          textOverflow: 'ellipsis',
          top: '15px',
          left: '10px',
          fontSize: '15px',
          userSelect: 'none',
          display: 'inline-block',
          pointerEvents: 'none',
        }}
      >
        {placeholder}
      </div>
    );
  }
  return (
    <LexicalRichTextPlugin
      contentEditable={
        <ContentEditable
          style={{
            height: editable ? '136px' : 'auto',
            resize: 'none',
            fontSize: '15px',
            caretColor: 'rgb(5, 5, 5)',
            position: 'relative',
            tabSize: 1,
            outline: '0',
            padding: '0px 10px',
            backgroundColor: 'transparent',
          }}
        />
      }
      placeholder={<Placeholder />}
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
}

export default RichTextPlugin;
