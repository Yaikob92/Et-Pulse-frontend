import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "nativewind";

type ThemeContextType = {
    isDark: boolean;
    isThemeLoaded: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    isThemeLoaded: false,
    toggleTheme: () => { },
});

const STORAGE_KEY = "@et_pulse_theme";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [isDark, setIsDark] = useState(false);
    const [isThemeLoaded, setIsThemeLoaded] = useState(false);

    // Load saved preference on mount
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((value) => {
            const isDarkMode = value === "dark";
            setIsDark(isDarkMode);
            setColorScheme(isDarkMode ? "dark" : "light");
            setIsThemeLoaded(true);
        });
    }, [setColorScheme]);

    // Keep isDark state synchronized with NativeWind's colorScheme updates (e.g. system changes)
    useEffect(() => {
        if (colorScheme) {
            setIsDark(colorScheme === "dark");
        }
    }, [colorScheme]);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        setColorScheme(next ? "dark" : "light");
        
        // Defer AsyncStorage writing to keep the UI interaction completely unblocked
        setTimeout(() => {
            AsyncStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
        }, 0);
    };

    return (
        <ThemeContext.Provider value={{ isDark, isThemeLoaded, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

