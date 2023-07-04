'use client';

import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import Nav from './nav';
import Toast from './toast';
import { Suspense } from 'react';
import { SearchProvider } from '../lib/search-context';

// export const metadata = {
//   title: 'Next.js 13 + PlanetScale + NextAuth + Tailwind CSS',
//   description:
//     'A user admin dashboard configured with Next.js, PlanetScale, NextAuth, Tailwind CSS, TypeScript, ESLint, and Prettier.'
// };

interface RootLayoutProps {
  children?: React.ReactNode;
}
export default async function RootLayout(props: RootLayoutProps) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        <SearchProvider>
          <Suspense>
            <Nav />
          </Suspense>
          {props?.children}
          <Analytics />
          {/* <Toast /> */}
        </SearchProvider>
      </body>
    </html>
  );
}
