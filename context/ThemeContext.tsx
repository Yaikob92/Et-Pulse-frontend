import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

    // Load saved preference on mount
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((value) => {
            if (value === "dark") setIsDark(true);
        });
    }, []);

    const toggleTheme = () => {
        setIsDark((prev) => {
            const next = !prev;
            AsyncStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
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
