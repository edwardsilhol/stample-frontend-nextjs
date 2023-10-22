import { EditorState } from 'lexical';
import { INITIAL_EDITOR_STATE } from '../index';

function isEditorEmpty(editorState: EditorState) {
  return (
    editorState.isEmpty() ||
    JSON.stringify(editorState.toJSON()) === INITIAL_EDITOR_STATE
  );
}
export default isEditorEmpty;
