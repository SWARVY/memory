import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { convexQuery } from '@convex-dev/react-query';
import { SuspenseQuery } from '@suspensive/react-query';
import { api } from 'convex/_generated/api';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/shared/ui/button';

import type { EmptyAboutProps } from '../model/props';
import AboutEditor from './about-editor';

export default function About() {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="size-full">
      <SuspenseQuery {...convexQuery(api.about.getAbout, {})}>
        {({ data }) => {
          if (!data) {
            return <EmptyAbout handleButtonClick={() => setIsEditMode(true)} />;
          }

          return (
            <div className="flex w-full flex-col items-center justify-center gap-y-8">
              <AboutEditor
                defaultValue={data}
                onEdit={() => setIsEditMode(true)}
                onSave={() => setIsEditMode(false)}
                editable={isEditMode}
              />
            </div>
          );
        }}
      </SuspenseQuery>
    </div>
  );
}

function EmptyAbout({ handleButtonClick }: EmptyAboutProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 py-32 text-center text-stone-500 dark:text-stone-300">
      <SignedIn>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-12"
          onClick={handleButtonClick}
        >
          <Plus />
        </Button>
        <div>
          <p>아직 등록된 자기소개가 없어요 😢</p>
          <p>+ 버튼을 눌러 새로운 자기소개를 작성해보세요!</p>
        </div>
      </SignedIn>
      <SignedOut>
        <div>
          <p>아직 등록된 자기소개가 없어요 😢</p>
          <p>로그인 후 자기소개를 작성해보세요!</p>
        </div>
      </SignedOut>
    </div>
  );
}
