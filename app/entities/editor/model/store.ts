import { create } from 'zustand';

import type EditorStore from './types';

const useEditorStore = create<EditorStore>((set) => ({
  editor: null,
  initialize: (editor) => set({ editor }),
}));

export default useEditorStore;
