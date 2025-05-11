import type { Block } from '@blocknote/core';
import { useEffect, useState } from 'react';
import { useEditorStore } from '~/features/editor';

export default function useBlocksFromHTML(html: string) {
  const editor = useEditorStore((state) => state.editor);
  const [blocks, setBlocks] = useState<Block[]>();

  useEffect(() => {
    if (!html || !editor) return;

    const initializeBlock = async () => {
      const blocks = await editor.tryParseHTMLToBlocks(html);
      setBlocks(blocks);
    };

    initializeBlock();
  }, [html, editor]);

  return blocks;
}
