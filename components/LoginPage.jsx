import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styling/styles'
import { Button, Input } from 'react-native-elements';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, signInWithEmailAndPassword } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import firebaseConfig from '../configs/firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

export default function LoginPage() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                var user = userCredential.user;
                console.log('User signed in:', user);
                navigation.navigate('MainPage');

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainPage' }],
                });
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('Error:', errorCode, errorMessage);
            });
    };
    

    const handleRegisterNavigation = () => {
        navigation.navigate('RegisterPage');
    };

    const handleForgotPasswordNavigation = () => {
        navigation.navigate('ForgotPasswordPage');
    };

    return (
        <View style={styles.container}>
            <Input
                placeholder='Email'
                leftIcon={{ type: 'material', name: 'email' }}
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none' 
            />
            <Input
                placeholder='Password'
                leftIcon={{ type: 'material', name: 'lock' }}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <View style={styles.centeredButtonContainer}>
                <Button 
                    title="Login" 
                    onPress={handleLogin} 
                    buttonStyle={styles.buttonStyle}
                    titleStyle={styles.buttonText}
                />
            </View>
            <View style={styles.linkContainer}>
                <TouchableOpacity onPress={handleForgotPasswordNavigation}>
                    <Text style={styles.forgotPasswordText}>Forgot Password</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleRegisterNavigation}>
                    <Text style={styles.registerText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

