import React, { useState, useContext } from 'react';
import { View, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { ThemeContext } from '../styling/ThemeContext';
import { lightThemeStyles, darkThemeStyles } from '../styling/styles';

export default function ForgotPasswordPage({ navigation }) {
    const [email, setEmail] = useState('');
    const auth = getAuth();

    const { theme } = useContext(ThemeContext);
    const styles = theme === 'dark' ? darkThemeStyles : lightThemeStyles;

    const handleSendResetEmail = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert("Check your email", "A password reset link has been sent to your email.", [
                    { text: "OK", onPress: () => navigation.navigate('LoginPage') }
                ]);
            })
            .catch((error) => {
                Alert.alert("Error", error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Input
                placeholder='Email'
                leftIcon={{ type: 'material', name: 'email' }}
                value={email}
                onChangeText={setEmail}
            />

            <Button 
                title="Send Reset Link" 
                onPress={handleSendResetEmail}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.containerStyle}
                titleStyle={styles.buttonText}
            />
        </View>
    );
}
