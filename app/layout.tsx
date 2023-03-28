import './globals.css'
import '@tremor/react/dist/esm/tremor.css'

import Nav from './nav'
import AnalyticsWrapper from './analytics'
import Toast from './toast'
import { Suspense } from 'react'
import ErrorBoundary from './error-boundary'

export const metadata = {
    title: 'Buyer Persona Generator',
    description:
        'A user admin dashboard configured with Next.js, PlanetScale, NextAuth, Tailwind CSS, TypeScript, ESLint, and Prettier.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className="h-full bg-gray-50"
        >
            <body className="h-full">
                <Suspense fallback="...">
                    {/* @ts-expect-error Server Component */}
                    <Nav />
                </Suspense>
                <ErrorBoundary>{children}</ErrorBoundary>
                <AnalyticsWrapper />
                <Toast />
            </body>
        </html>
    )
}
