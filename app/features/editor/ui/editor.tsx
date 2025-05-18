import type { PartialBlock } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { ClientOnly } from '@suspensive/react';
import { api } from 'convex/_generated/api';
import { useMutation } from 'convex/react';
import { Suspense, useEffect } from 'react';
import { toast } from 'sonner';
import { useEditorStore } from '~/features/editor';
import useDarkMode from '~/shared/lib/use-dark-mode';
import { cn } from '~/shared/lib/utils';

import './editor.css';

interface EditorProps {
  className?: string;
  initialContent?: PartialBlock[];
  editable?: boolean;
  isDarkMode?: boolean;
}

const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;

const DEFAULT_CONTENT: PartialBlock[] = [
  {
    type: 'heading',
    props: {
      level: 3,
    },
    content: '✨ 자유롭게 글을 작성해보세요!',
  },
  {
    type: 'bulletListItem',
    content:
      '📝 글쓰기 도구를 사용하려면 텍스트를 입력하시거나 + 버튼을 클릭하세요',
  },
  {
    type: 'bulletListItem',
    content: '🖼️ 이미지도 + 버튼을 통해 쉽게 추가할 수 있어요',
  },
  {
    type: 'paragraph',
  },
];

function EditorLoader({ ...props }: EditorProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <Suspense>
      <ClientOnly>
        <EditorContent {...props} isDarkMode={isDarkMode} />
      </ClientOnly>
    </Suspense>
  );
}

function EditorContent({
  className,
  initialContent,
  editable = true,
  isDarkMode,
}: EditorProps) {
  const { initialize } = useEditorStore();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const sendImage = useMutation(api.files.sendImage);
  const editor = useCreateBlockNote({
    initialContent: initialContent ?? DEFAULT_CONTENT,
    uploadFile,
  });

  async function uploadFile(file: File) {
    try {
      const postURL = await generateUploadUrl();
      const result = await fetch(postURL, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      const { storageId } = await result.json();
      const searchParams = new URLSearchParams({ storageId });

      await sendImage({ storageId });

      return `${convexSiteUrl}/getImage?${searchParams.toString()}`;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`이미지 업로드에 실패했어요 😢`);
        toast.error(error.message);
      } else {
        toast.error('알 수 없는 오류가 발생했어요 😢');
      }

      return '';
    }
  }

  useEffect(() => {
    initialize(editor);
  }, []);

  return (
    <BlockNoteView
      id="bn-editor"
      className={cn(className, !editable && 'size-full [&_.bn-editor]:!px-0')}
      editor={editor}
      editable={editable}
      theme={isDarkMode ? 'dark' : 'light'}
      data-font-pretendard
    />
  );
}

export { EditorLoader as Editor };
