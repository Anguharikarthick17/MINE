import StyledComponentsRegistry from '@/lib/registry';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import GlobalStyles from '@/styles/GlobalStyles';

export const metadata = {
    title: 'AHK — Creative Web Developer',
    description: 'Portfolio of AHK, a Creative Web Developer specializing in Next.js, React, and modern web technologies. Building exceptional digital experiences.',
    keywords: ['creative developer', 'web developer', 'next.js', 'react', 'portfolio', 'AHK'],
    authors: [{ name: 'AHK' }],
    icons: {
        icon: '/ahk-logo.png',
        shortcut: '/ahk-logo.png',
        apple: '/ahk-logo.png',
    },
    openGraph: {
        title: 'AHK — Creative Web Developer',
        description: 'Creative Web Developer specializing in Next.js & modern technologies.',
        type: 'website',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" dir="ltr">
            <head>
                {/* DNS prefetch for faster font domain resolution */}
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
                <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/*
                  Next.js App Router automatically optimizes Google Fonts at build time.
                  Using raw `<link rel="stylesheet">` allows Next.js to inline the CSS,
                  completely eliminating FCP/LCP network delays natively.
                */}
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
                />
            </head>
            <body>
                <StyledComponentsRegistry>
                    <ThemeProvider>
                        <LanguageProvider>
                            <GlobalStyles />
                            {children}
                        </LanguageProvider>
                    </ThemeProvider>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
