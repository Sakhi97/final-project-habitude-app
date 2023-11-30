import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { styles } from '../styling/styles'
import { Button, Input } from 'react-native-elements';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

export default function RegisterPage({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const auth = getAuth();

    const handleRegister = () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        
        createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
    // Successfully registered
    const user = userCredential.user;
    console.log('User registered:', user);

    // Update the displayName to "No name"
    updateProfile(user, {
        displayName: "No name"
    }).then(() => {
        // Update successful
        // You may also want to set the "No name" displayName in your database
        const db = getDatabase();
        set(ref(db, 'users/' + user.uid), {
            email: email,
            displayName: "No name" // Set the default name here
        });
    }).catch((error) => {
        // An error occurred
        console.log('Error updating profile:', error);
    });

    navigation.navigate('LoginPage');
})
.catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log('Error:', errorCode, errorMessage);
    Alert.alert('Error', errorMessage);
});
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
            <Input
                placeholder='Confirm Password'
                leftIcon={{ type: 'material', name: 'lock-outline' }}
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <Button 
                title="Register" 
                onPress={handleRegister} 
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.containerStyle}
                titleStyle={styles.buttonText}
            />
        </View>
    );
}


