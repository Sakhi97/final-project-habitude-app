import React, {useContext} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import MainPage from '../pages/MainPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import EditAccountPage from '../pages/EditAccountPage';
import { ThemeContext } from '../styling/ThemeContext';
import { lightThemeStyles, darkThemeStyles } from '../styling/styles';




const Stack = createStackNavigator();

export default function AppNavigator() {
    const { theme } = useContext(ThemeContext);
    const styles = theme === 'dark' ? darkThemeStyles : lightThemeStyles;
    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName="Login"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme === 'dark' ? '#303030' : '#f4f4f4',
                    },
                    headerTintColor: theme === 'dark' ? '#FF6633' : 'black', 
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
                >
                <Stack.Screen 
                    name="Login Page" 
                    component={LoginPage} 
                />
                <Stack.Screen 
                    name="Register Page" 
                    component={RegisterPage} 
                /> 
                <Stack.Screen 
                    name="Main Page" 
                    component={MainPage}
                    options={{
                        headerTintColor: theme === 'dark' ? '#303030' : '#f4f4f4',
                    }}
                />
                <Stack.Screen 
                    name="Forgot Password Page" 
                    component={ForgotPasswordPage} 
                />
                <Stack.Screen 
                    name="Edit Account Page" 
                    component={EditAccountPage} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
