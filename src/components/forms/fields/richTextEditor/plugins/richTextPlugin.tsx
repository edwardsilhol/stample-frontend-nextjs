import { RichTextPlugin as LexicalRichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

function RichTextPlugin() {
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
        The content of your note
      </div>
    );
  }
  return (
    <LexicalRichTextPlugin
      contentEditable={
        <ContentEditable
          style={{
            height: '150px',
            resize: 'none',
            fontSize: '15px',
            caretColor: 'rgb(5, 5, 5)',
            position: 'relative',
            tabSize: 1,
            outline: '0',
            padding: '0px 10px',
          }}
        />
      }
      placeholder={<Placeholder />}
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
}

export default RichTextPlugin;
