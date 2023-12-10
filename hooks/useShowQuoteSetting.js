import { useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../styling/ThemeContext';

export const useShowQuoteSetting = () => {
    const { setShowQuote } = useContext(ThemeContext);

    useEffect(() => {
        const getShowQuoteSetting = async () => {
            const savedShowQuote = await AsyncStorage.getItem('showQuote');
            if (savedShowQuote !== null) {
                setShowQuote(JSON.parse(savedShowQuote));
            }
        };
    
        getShowQuoteSetting();
    }, [setShowQuote]);
};
