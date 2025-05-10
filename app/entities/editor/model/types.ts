import type { BlockNoteEditor } from '@blocknote/core';

export default interface EditorStore {
  editor: BlockNoteEditor | null;
  initialize: (editor: BlockNoteEditor) => void;
}
