import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { Button, Input, Image} from 'react-native-elements';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../styling/ThemeContext';
import { lightThemeStyles, darkThemeStyles } from '../styling/styles';
import { auth } from '../configs/firebaseConfig';


export default function LoginPage() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { theme } = useContext(ThemeContext);
    const styles = theme === 'dark' ? darkThemeStyles : lightThemeStyles;

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                var user = userCredential.user;
                console.log('User signed in:', user);
                navigation.navigate('Main Page');

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main Page' }],
                });
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('Error:', errorCode, errorMessage);
                Alert.alert(
                    "Login Failed",
                    "Email or password is invalid",
                    
                );
            });
    };
    

    const handleRegisterNavigation = () => {
        navigation.navigate('Register Page');
    };

    const handleForgotPasswordNavigation = () => {
        navigation.navigate('Forgot Password Page');
    };

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image
                source={theme === 'dark' ? require('../assets/logo_dark.png') : require('../assets/logo_light.png')}
                style={{ width: 250, height: 250 }} 
                resizeMode="contain" 
            />
            </View>
            <Input
                placeholder='Email'
                leftIcon={{ 
                    type: 'material', 
                    name: 'email',
                    color: theme === 'dark' ? 'white' : 'black'
                }}
                inputStyle={{
                    color: theme === 'dark' ? 'white' : 'black'
                }}
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
            />
            <Input
                placeholder='Password'
                leftIcon={{ 
                    type: 'material', 
                    name: 'lock',
                    color: theme === 'dark' ? 'white' : 'black'
                 }}
                inputStyle={{
                    color: theme === 'dark' ? 'white' : 'black'
                }}
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
                    <Text style={styles.linkText}>Forgot Password</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleRegisterNavigation}>
                    <Text style={styles.linkText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

