import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "nativewind";

type ThemeContextType = {
    isDark: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    toggleTheme: () => { },
});

const STORAGE_KEY = "@et_pulse_theme";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isDark, setIsDark] = useState(false);
    const { setColorScheme } = useColorScheme();

    // Load saved preference on mount
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((value) => {
            const isDarkMode = value === "dark";
            setIsDark(isDarkMode);
            setColorScheme(isDarkMode ? "dark" : "light");
        });
    }, []);

    const toggleTheme = () => {
        setIsDark((prev) => {
            const next = !prev;
            AsyncStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
            setColorScheme(next ? "dark" : "light");
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
