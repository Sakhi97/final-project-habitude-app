import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import MainPage from '../pages/MainPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="LoginPage" component={LoginPage} />
                <Stack.Screen name="RegisterPage" component={RegisterPage} /> 
                <Stack.Screen name="MainPage" component={MainPage} />
                <Stack.Screen name="ForgotPasswordPage" component={ForgotPasswordPage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
