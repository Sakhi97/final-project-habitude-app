import React, {useContext} from 'react';
import AppNavigator from './navigation/AppNavigator';
import { ThemeProvider } from './styling/ThemeContext';


export default function App() {
    return (
        <ThemeProvider>
            <AppNavigator />
        </ThemeProvider>
    );
}
