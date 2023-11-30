import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';
import MainPage from '../components/MainPage';
import ForgotPasswordPage from '../components/ForgotPasswordPage';

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
