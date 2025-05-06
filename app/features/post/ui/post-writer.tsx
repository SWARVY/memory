import { ClientOnly } from '@suspensive/react';
import { useForm } from '@tanstack/react-form';
import { type Category, PostSchema } from 'convex/schema';
import { Cog, Lightbulb, PencilLine, Save, Trash } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { useEditorStore } from '~/entities/editor';
import { cn } from '~/shared/lib/utils';
import { Button } from '~/shared/ui/button';
import { Input } from '~/shared/ui/input';
import { Tabs, TabsList, TabsTrigger } from '~/shared/ui/tabs';

import useCreatePost from '../hooks/use-create-post';

const PostEditor = lazy(() => import('~/features/post/ui/post-editor'));

export default function PostWriter() {
  const { mutateAsync: createPost } = useCreatePost();
  const editor = useEditorStore((state) => state.editor);
  const form = useForm({
    defaultValues: {
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

      console.log({ ...value, contents, briefContents });

      await createPost({ input: { ...value, contents, briefContents } });
    },
    onSubmitInvalid: ({ value }) => {
      console.log(value);
    },
  });

  return (
    <form
      className="relative flex size-full flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-col gap-y-4">
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
      <div className="flex size-full flex-col gap-y-4 rounded-xl bg-white shadow-md">
        <div className="pt-[3.375rem]">
          <form.Field
            name="title"
            children={(field) => (
              <Input
                value={field.state.value}
                onChange={(e) => {
                  field.setValue(e.target.value);
                }}
                className={cn(
                  'h-full rounded-none border-0 px-[3.375rem] shadow-none',
                  'text-2xl font-bold focus-visible:ring-0 md:text-2xl',
                )}
                placeholder="제목을 입력해주세요"
              />
            )}
          />
        </div>
        <Suspense>
          <ClientOnly>
            <div className="size-full min-h-96 pb-[3.375rem]">
              <PostEditor />
            </div>
          </ClientOnly>
        </Suspense>
      </div>
      <div className="fixed right-8 bottom-8 flex items-center gap-x-2">
        {/* 초기화 */}
        <Button
          type="button"
          variant="destructive"
          className="size-10 rounded-lg p-2"
        >
          <Trash />
        </Button>
        {/* 글 작성 */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              className="size-10 rounded-lg p-2"
              disabled={!canSubmit}
            >
              <Save />
            </Button>
          )}
        />
      </div>
    </form>
  );
}
