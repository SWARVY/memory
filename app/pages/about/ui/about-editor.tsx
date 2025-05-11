import { Save } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { toast } from 'sonner';
import { useEditorStore } from '~/features/editor';
import { Button } from '~/shared/ui/button';

import type { AboutEditorProps } from '../model/props';
import useCreateAbout from '../model/use-create-about';
import useEditAbout from '../model/use-edit-about';

const Editor = lazy(() =>
  import('~/features/editor').then((m) => ({ default: m.Editor })),
);

// 수정
export default function AboutEditor({
  defaultValue,
  onSave,
}: AboutEditorProps) {
  const editor = useEditorStore((state) => state.editor);
  const isEditMode = !!defaultValue;

  const { mutateAsync: createAbout } = useCreateAbout();
  const { mutateAsync: editAbout } = useEditAbout();

  const handleSave = async () => {
    const content = JSON.stringify(editor?.document);

    if (!content) {
      toast.error('소개글 저장에 실패했어요 😢 잠시 후 다시 시도해주세요');
      return;
    }

    if (isEditMode) {
      editAbout({
        input: {
          content,
          _id: defaultValue._id,
          _creationTime: defaultValue._creationTime,
        },
      });
    } else {
      createAbout({ input: { content } });
    }

    onSave();
  };

  return (
    <div className="flex w-full flex-col justify-center gap-y-8">
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleSave}
        >
          <Save />
        </Button>
      </div>
      <Suspense>
        <Editor />
      </Suspense>
    </div>
  );
}
