import React, {useContext} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import SettingScreen from '../screens/SettingScreen';
import ForumScreen from '../screens/ForumScreen';
import { ThemeContext } from '../styling/ThemeContext';
import { lightThemeStyles, darkThemeStyles } from '../styling/styles';


const Tab = createBottomTabNavigator();


const Nav = () => {
    const { theme } = useContext(ThemeContext);
    const styles = theme === 'dark' ? darkThemeStyles : lightThemeStyles;
    return (
        <Tab.Navigator 
        sceneContainerStyle={styles.containerTab}
        screenOptions={{
            tabBarActiveTintColor: theme === 'dark' ? '#FF6633' : 'black',
            tabBarInactiveTintColor: theme === 'dark' ? '#F0F0F0' : 'gray',
            tabBarStyle: {
                backgroundColor: theme === 'dark' ? '#000' : '#fff',
                borderTopColor: 'transparent', 
                tabBarLabel: theme === 'dark' ? '#FF6633' : 'black'
            },
            headerShown: false,
        }}
  
    >
             <Tab.Screen name="Home" options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <Icon name="home" color={color} size={size} />
                ),
            }}>
                {() => <HomeScreen />}
            </Tab.Screen>
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarLabel: 'Calendar',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="today" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen
                name="Forum"
                component={ForumScreen}
                options={{
                    tabBarLabel: 'Forum',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="forum" color={color} size={size} />
                    ),
                }}  
            />
            <Tab.Screen 
                name="AddHabit" 
                component={AddHabitScreen} 
                options={{
                    tabBarLabel: 'Add Habit',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="add" color={color} size={size} />
                    ),
            }}/>
            <Tab.Screen 
                name="Seting" 
                component={SettingScreen} 
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="settings" color={color} size={size} />
                    ),
            }}/>
        </Tab.Navigator>
    );
};

export default Nav;
