import React, { useState, useContext } from 'react';
import { View, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword, updateEmail } from 'firebase/auth';
import { ThemeContext } from '../styling/ThemeContext';
import { lightThemeStyles, darkThemeStyles } from '../styling/styles';

export default function EditAccountPage({ navigation }) {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const auth = getAuth();

    const { theme } = useContext(ThemeContext);
    const styles = theme === 'dark' ? darkThemeStyles : lightThemeStyles;

    const handleUpdateAccount = () => {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(email, oldPassword);

        reauthenticateWithCredential(user, credential).then(() => {
            updateEmail(user, email).then(() => {
                updatePassword(user, newPassword).then(() => {
                    Alert.alert("Success", "Your account details have been updated.");
                    navigation.goBack();
                }).catch(error => Alert.alert("Error", error.message));
            }).catch(error => Alert.alert("Error", error.message));
        }).catch(error => Alert.alert("Error", error.message));
    };

    return (
        <View style={styles.container}>
            <Input
                placeholder='Current Email'
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
                leftIcon={{ 
                    type: 'material', 
                    name: 'email',
                    color: theme === 'dark' ? 'white' : 'black'
                }}
            />
            <Input
                placeholder='Old Password'
                value={oldPassword}
                onChangeText={setOldPassword}
                autoCapitalize='none'
                secureTextEntry={true}
                inputStyle={{
                    color: theme === 'dark' ? 'white' : 'black'
                }}
                leftIcon={{ 
                    type: 'material', 
                    name: 'lock',
                    color: theme === 'dark' ? 'white' : 'black'
                }}
            />
            <Input
                placeholder='New Password'
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize='none'
                secureTextEntry={true}
                inputStyle={{
                    color: theme === 'dark' ? 'white' : 'black'
                }}
                leftIcon={{ 
                    type: 'material', 
                    name: 'lock',
                    color: theme === 'dark' ? 'white' : 'black'
                }}
            />
            <Button 
                title="Update Account" 
                onPress={handleUpdateAccount}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.containerStyle}
                titleStyle={styles.buttonText}
                
            />
        </View>
    );
}
