import { Protect } from '@clerk/react-router';
import { convexQuery } from '@convex-dev/react-query';
import { SuspenseQuery } from '@suspensive/react-query';
import { api } from 'convex/_generated/api';
import { Suspense } from 'react';
import { Navigate } from 'react-router';
import { Setting } from '~/pages/settings/ui';

export default function SettingsPage() {
  return (
    <Protect fallback={<Navigate to="/" />}>
      <Suspense>
        <SuspenseQuery {...convexQuery(api.settings.getSettings, {})}>
          {({ data }) => {
            return <Setting defaultValues={data} />;
          }}
        </SuspenseQuery>
      </Suspense>
    </Protect>
  );
}
