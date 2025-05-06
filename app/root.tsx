import { ClerkProvider } from '@clerk/react-router';
import { rootAuthLoader } from '@clerk/react-router/ssr.server';
import { ConvexQueryClient } from '@convex-dev/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { useState } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  matchPath,
  useLocation,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';
import { MainLayout } from './shared/ui/main-layout';
import { Toaster } from './shared/ui/sonner';
import { Aside } from './widgets/aside';

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

const HIDE_ASIDE_PATHS = ['/new-post', '/archive/:postId'] as const;

export async function loader(args: Route.LoaderArgs) {
  return rootAuthLoader(args);
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [convexClient] = useState(
    () => new ConvexReactClient(import.meta.env.VITE_CONVEX_URL!),
  );
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

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-dvh w-full overflow-y-scroll">
        <QueryClientProvider client={queryClient}>
          <ConvexProvider client={convexClient}>{children}</ConvexProvider>
          <ScrollRestoration />
          <Scripts />
          <Toaster />
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </QueryClientProvider>
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const shouldShowAside = !(
    location.pathname === '/new-post' ||
    (matchPath({ path: '/archive/:postId', end: true }, location.pathname) &&
      location.pathname !== '/archive/list')
  );

  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      loaderData={loaderData}
    >
      <MainLayout aside={<Aside />} showAside={shouldShowAside}>
        <Outlet />
      </MainLayout>
    </ClerkProvider>
  );
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
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
