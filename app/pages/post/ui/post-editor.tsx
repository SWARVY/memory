import { ClientOnly } from '@suspensive/react';
import { useForm } from '@tanstack/react-form';
import { type Category, PostSchema } from 'convex/schema';
import { Cog, Lightbulb, PencilLine, Save, Trash } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { toast } from 'sonner';
import { useEditorStore } from '~/features/editor';
import { cn } from '~/shared/lib/utils';
import { Button } from '~/shared/ui/button';
import { Input } from '~/shared/ui/input';
import { Tabs, TabsList, TabsTrigger } from '~/shared/ui/tabs';

import type { PostWriterProps } from '../model/props';
import useCreatePost from '../model/use-create-post';
import useDeletePost from '../model/use-delete-post';
import useEditPost from '../model/use-edit-post';

const Editor = lazy(() =>
  import('~/features/editor').then((m) => ({ default: m.Editor })),
);

export default function PostWriter({ defaultValues }: PostWriterProps) {
  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: editPost } = useEditPost();
  const { mutateAsync: deletePost } = useDeletePost();

  const isEditMode = !!defaultValues;
  const editor = useEditorStore((state) => state.editor);
  const form = useForm({
    defaultValues: defaultValues ?? {
      title: '',
      category: 'TECH',
    },
    validators: {
      onChange: PostSchema,
    },
    onSubmit: async ({
      value,
    }: {
      value: { title: string; category: Category };
    }) => {
      const contents = await editor?.blocksToFullHTML(editor?.document);
      const briefContents = editor?._tiptapEditor.getText();

      // FOR DEBUG
      // console.log({ ...value, contents, briefContents });

      if (!contents || !briefContents) {
        toast.error('포스트 저장에 실패했어요 😢 잠시 후 다시 시도해주세요');
        return;
      }

      if (!isEditMode) {
        await createPost({ input: { ...value, contents, briefContents } });
      } else {
        await editPost({
          input: {
            ...value,
            contents,
            briefContents,
            _id: defaultValues._id,
            _creationTime: defaultValues._creationTime,
          },
        });
      }
    },
    onSubmitInvalid: ({ value }) => {
      console.log(value);
    },
  });

  const handleDeletePost = () => {
    if (!defaultValues || !defaultValues._id) {
      return;
    }

    deletePost({ id: defaultValues._id });
  };

  return (
    <form
      className="relative flex size-full flex-col items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="w-full max-w-3xl space-y-14">
        <div className="mt-20 flex w-full flex-col items-center justify-center gap-y-4">
          <form.Field
            name="title"
            children={(field) => (
              <Input
                value={field.state.value}
                onChange={(e) => {
                  field.setValue(e.target.value);
                }}
                className={cn(
                  'h-full rounded-none border-0 px-[3.375rem] text-center shadow-none',
                  'text-3xl font-bold focus-visible:ring-0 md:text-4xl',
                )}
                placeholder="제목을 입력해주세요"
              />
            )}
          />
          <form.Field
            name="category"
            children={(field) => (
              <Tabs
                defaultValue={field.state.value}
                onValueChange={(value) => field.setValue(value as Category)}
              >
                <TabsList>
                  <TabsTrigger value="TECH">
                    <PencilLine />
                    TECH
                  </TabsTrigger>
                  <TabsTrigger value="THINKING">
                    <Lightbulb />
                    THINKING
                  </TabsTrigger>
                  <TabsTrigger value="ETC">
                    <Cog />
                    ETC
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          />
        </div>
        <hr className="w-full" />
        <Suspense>
          <ClientOnly>
            <div className="size-full min-h-96 pb-[3.375rem]">
              <Editor />
            </div>
          </ClientOnly>
        </Suspense>
        <div className="fixed right-8 bottom-8 flex items-center gap-x-2">
          {/* 삭제 (수정 모드일 때만 가능) */}
          {isEditMode && (
            <Button
              type="button"
              variant="destructive"
              className="size-10 rounded-lg p-2"
              onClick={handleDeletePost}
            >
              <Trash />
            </Button>
          )}
          {/* 글 작성 */}
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="size-10 rounded-lg p-2"
                disabled={!canSubmit || isSubmitting}
              >
                <Save />
              </Button>
            )}
          />
        </div>
      </div>
    </form>
  );
}
