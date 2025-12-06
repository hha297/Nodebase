import type { Metadata } from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';
import { TRPCReactProvider } from '@/trpc/client';
import { Toaster } from '@/components/ui/sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Provider as JotaiProvider } from 'jotai';
const primaryFont = Space_Grotesk({
        variable: '--font-primary',
        subsets: ['latin'],
});

const secondaryFont = Space_Mono({
        variable: '--font-secondary',
        weight: ['400', '700'],
        subsets: ['latin'],
});

export const metadata: Metadata = {
        title: 'Nodebase',
        description: 'Nodebase is a platform for creating and managing your workflows',
};

export default function RootLayout({
        children,
}: Readonly<{
        children: React.ReactNode;
}>) {
        return (
                <html lang="en">
                        <body className={`${primaryFont.variable} ${secondaryFont.variable} antialiased`}>
                                <TRPCReactProvider>
                                        <Toaster />
                                        <NuqsAdapter>
                                                <JotaiProvider>{children}</JotaiProvider>
                                        </NuqsAdapter>
                                </TRPCReactProvider>
                        </body>
                </html>
        );
}
