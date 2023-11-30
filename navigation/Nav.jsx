import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import SettingScreen from '../screens/SettingScreen';
import ForumScreen from '../screens/ForumScreen';


const Tab = createBottomTabNavigator();

const Nav = () => {
    return (
        <Tab.Navigator>
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
                    ),
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
                name="Setting" 
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
