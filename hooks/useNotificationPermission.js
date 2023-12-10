import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useNotificationPermission = () => {
    useEffect(() => {
        const requestNotificationsPermission = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            await AsyncStorage.setItem('hasNotificationPermission', status === 'granted' ? 'true' : 'false');
        };
        requestNotificationsPermission();
    }, []);
};
