import * as Notifications from 'expo-notifications';

export const scheduleNotification = async () => {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: "Check your habits!",
      body: "Don't forget to review your daily habits.",
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },

    
    
  });
};

export const cancelAllNotifications = async () => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log('All notifications cancelled.');
    } catch (error) {
        console.error('Error cancelling notifications:', error);
    }
};
