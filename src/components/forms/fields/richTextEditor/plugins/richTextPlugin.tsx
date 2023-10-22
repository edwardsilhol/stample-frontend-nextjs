import { RichTextPlugin as LexicalRichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

function RichTextPlugin() {
  function Placeholder() {
    return (
      <div
        style={{
          minHeight: '150px',
          resize: 'none',
          fontSize: '15px',
          caretColor: 'rgb(5, 5, 5)',
          position: 'absolute',
          tabSize: 1,
          outline: '0',
          padding: '15px 10px',
          color: '#999',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          top: '15px',
          left: '10px',
          userSelect: 'none',
          display: 'inline-block',
          pointerEvents: 'none',
        }}
      >
        Enter some rich text...
      </div>
    );
  }
  return (
    <LexicalRichTextPlugin
      contentEditable={
        <ContentEditable
          style={{
            minHeight: '150px',
            resize: 'none',
            fontSize: '15px',
            caretColor: 'rgb(5, 5, 5)',
            position: 'relative',
            tabSize: 1,
            outline: '0',
            padding: '15px 10px',
          }}
        />
      }
      placeholder={<Placeholder />}
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
}

export default RichTextPlugin;
