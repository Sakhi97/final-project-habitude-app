import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); 

  useEffect(() => {
    const loadTheme = async () => {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
    };

        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        await AsyncStorage.setItem('theme', newTheme);
    };

    const [showQuote, setShowQuote] = useState(true);

    useEffect(() => {
        const getShowQuoteSetting = async () => {
            const savedShowQuote = await AsyncStorage.getItem('showQuote');
            if (savedShowQuote !== null) {
                setShowQuote(JSON.parse(savedShowQuote));
            }
        };
        getShowQuoteSetting();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, showQuote, setShowQuote }}>
        {children}
        </ThemeContext.Provider>
    );
};
