import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';
import { Navigator } from './widgets/navigator';
import { Aside } from './widgets/aside';
import { useState } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexQueryClient } from '@convex-dev/react-query';
import { Toaster } from './shared/ui/sonner';
import { MainLayout } from './shared/ui/main-layout';
import { Footer } from './widgets/footer';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

const HIDE_ASIDE_PATHS = ['/new-post'] as const;

export async function loader() {
  const CONVEX_URL = process.env['CONVEX_URL']!;
  return { ENV: { CONVEX_URL } };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { ENV } = useLoaderData<typeof loader>();
  const [convexClient] = useState(() => new ConvexReactClient(ENV.CONVEX_URL));
  const [convexQueryClient] = useState(
    () => new ConvexQueryClient(convexClient),
  );
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            queryKeyHashFn: convexQueryClient.hashFn(),
            queryFn: convexQueryClient.queryFn(),
            staleTime: 1000 * 60 * 60,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const location = useLocation();
  const shouldShowAside = !HIDE_ASIDE_PATHS.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ConvexProvider client={convexClient}>
            <MainLayout
              navigator={<Navigator />}
              aside={<Aside />}
              footer={<Footer />}
              showAside={shouldShowAside}
            >
              {children}
            </MainLayout>
            <ScrollRestoration />
            <Scripts />
            <Toaster />
          </ConvexProvider>
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </QueryClientProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
