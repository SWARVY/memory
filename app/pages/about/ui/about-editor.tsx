import { SignedIn } from '@clerk/clerk-react';
import { Save, SquarePen } from 'lucide-react';
import { toast } from 'sonner';
import { Editor, useEditorStore } from '~/features/editor';
import { Button } from '~/shared/ui/button';

import type { AboutEditorProps } from '../model/props';
import useCreateAbout from '../model/use-create-about';
import useEditAbout from '../model/use-edit-about';

export default function AboutEditor({
  defaultValue,
  editable,
  onEdit,
  onSave,
}: AboutEditorProps) {
  const editor = useEditorStore((state) => state.editor);
  const isEditMode = !!defaultValue;
  const blocks = JSON.parse(defaultValue?.content || '');

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
    <div className="flex w-full flex-col justify-center gap-y-8 py-6 pl-9">
      <SignedIn>
        <div className="flex w-full items-center justify-end">
          {editable ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleSave}
            >
              <Save />
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onEdit}
            >
              <SquarePen />
            </Button>
          )}
        </div>
      </SignedIn>
      <Editor initialContent={blocks} editable={editable} />
    </div>
  );
}
