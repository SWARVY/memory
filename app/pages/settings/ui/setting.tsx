import { useForm } from '@tanstack/react-form';
import { api } from 'convex/_generated/api';
import { useMutation } from 'convex/react';
import { type Settings, SettingsSchema } from 'convex/schema';
import { Camera, Save } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '~/shared/ui/avatar';
import { Button } from '~/shared/ui/button';
import { Input } from '~/shared/ui/input';
import { Textarea } from '~/shared/ui/textarea';

import type { SettingsProps } from '../model/props';
import useCreateSettings from '../model/use-create-settings';
import useEditSettings from '../model/use-edit-settings';

const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;

export default function Setting({ defaultValues }: SettingsProps) {
  const [profileImage, setProfileImage] = useState<File>();
  const [profileImageURL, setProfileImageURL] = useState<string>();

  const { mutateAsync: createSettings } = useCreateSettings();
  const { mutateAsync: updateSettings } = useEditSettings();

  const generateUploadUrl = useMutation(
    api.settings.generateProfileImageUploadUrl,
  );

  const form = useForm({
    defaultValues: defaultValues ?? {
      name: '',
      description: '',
    },
    validators: {
      onChange: SettingsSchema,
    },
    onSubmit: async ({ value }: { value: Settings }) => {
      onSubmit(value);
    },
    onSubmitInvalid: ({ value }) => {
      console.log(value);
    },
  });

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(file);
          setProfileImageURL(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File) => {
    const postURL = await generateUploadUrl();
    const result = await fetch(postURL, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    const { storageId } = await result.json();
    const searchParams = new URLSearchParams({ storageId });

    // await saveImage({ storageId, settingsId: defaultValues?._id });

    return `${convexSiteUrl}/getImage?${searchParams.toString()}`;
  };

  const onSubmit = async (data: Settings) => {
    const profileImageURL = profileImage
      ? await uploadImage(profileImage)
      : data.profileImage;

    if (defaultValues) {
      updateSettings({
        input: {
          _id: defaultValues._id,
          _creationTime: defaultValues._creationTime,
          name: data.name,
          description: data.description,
          profileImage: profileImageURL,
        },
      });
    } else {
      createSettings({
        input: {
          name: data.name,
          description: data.description,
          profileImage: profileImageURL,
        },
      });
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-y-4"
    >
      <div className="flex flex-col gap-y-12">
        <form.Field
          name="profileImage"
          children={(field) => (
            <div className="group flex items-center justify-center gap-x-2">
              <label htmlFor="profileImage">
                <Avatar className="relative size-24 cursor-pointer">
                  <AvatarImage
                    className="object-cover"
                    src={
                      field.state.value ||
                      profileImageURL ||
                      'https://github.com/shadcn.png'
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="size-6 text-white" />
                  </div>
                </Avatar>
              </label>
              <input
                className="hidden"
                type="file"
                id="profileImage"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleProfileImageChange}
              />
            </div>
          )}
        />
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-semibold">이름</label>
            <form.Field
              name="name"
              children={(field) => (
                <Input
                  value={field.state.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  placeholder="이름을 입력해주세요"
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-semibold">소개글</label>
            <form.Field
              name="description"
              children={(field) => (
                <Textarea
                  className="min-h-60 xl:min-h-80"
                  value={field.state.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  placeholder="소개글을 입력해주세요"
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-end">
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
    </form>
  );
}
