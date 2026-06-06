'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '@/styles/theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = useCallback(() => {
        // No-op, dark mode only
    }, []);

    if (!mounted) {
        return (
            <StyledThemeProvider theme={darkTheme}>
                <div style={{ visibility: 'hidden' }}>{children}</div>
            </StyledThemeProvider>
        );
    }

    return (
        <ThemeContext.Provider value={{ isDark: true, toggleTheme }}>
            <StyledThemeProvider theme={darkTheme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        // Safe defaults for SSR prerender
        return { isDark: true, toggleTheme: () => { } };
    }
    return context;
}
