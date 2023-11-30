import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Switch, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { getAuth, updateProfile, signOut } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleNotification, cancelAllNotifications } from '../services/notification';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styling/styles';

export default function SettingScreen() {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigation = useNavigation();
    const [name, setName] = useState(user?.displayName || 'No Name');
    const [editMode, setEditMode] = useState(false);
    const [editedName, setEditedName] = useState(user?.displayName || 'No Name'); 
    const [isDarkMode, setIsDarkMode] = useState(false); 
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        const getNotificationSetting = async () => {
            const enabled = await AsyncStorage.getItem('hasNotificationPermission');
            setNotificationsEnabled(enabled === 'true');
        };
    
        getNotificationSetting();
    }, []);

    const handleNotificationSwitch = async (newValue) => {
        setNotificationsEnabled(newValue);
        await AsyncStorage.setItem('hasNotificationPermission', newValue ? 'true' : 'false');

        if (newValue) {
            await scheduleNotification();
            Alert.alert("Notifications Enabled", "You will now receive notifications.");
        } else {
            await cancelAllNotifications();
            Alert.alert("Notifications Disabled", "You will no longer receive notifications.");
        }
    };

    const handleNameChange = () => {
        if (!user) {
            Alert.alert("Error", "User not found");
            return;
        }

        if (!editedName.trim() || editedName === user.displayName) {
            Alert.alert("Info", "No changes to save");
            return;
        }

        const db = getDatabase();
        updateProfile(user, { displayName: editedName.trim() }).then(() => {
            set(ref(db, 'users/' + user.uid), {
                displayName: editedName.trim(),
            });
            Alert.alert("Success", "Name updated successfully!");
            setName(editedName.trim());
            setEditMode(false);
        }).catch((error) => {
            Alert.alert("Error", error.message);
        });
    };

    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigation.navigate('LoginPage');
        }).catch((error) => {
            Alert.alert("Error", error.message);
        });
    };

    const toggleDarkMode = () => setIsDarkMode(previousState => !previousState);

    return (
        <View style={styles.setting_container}>
            <View style={styles.nameContainer}>
                <Text style={styles.setting_nameText}>{name}</Text>
                <TouchableOpacity onPress={() => setEditMode(!editMode)} style={styles.iconContainer}>
                    <Icon name="pencil" size={17} />
                </TouchableOpacity>
            </View>


            {editMode && (
                <View>
                    <Input
                        style={styles.input}
                        onChangeText={text => setEditedName(text)}
                        value={editedName}
                        placeholder="Enter new name"
                        autoFocus={true}
                    />
                    <Button title="Save" onPress={handleNameChange} />
                </View>
            )}

            <OptionRow label="Dark Mode" value={isDarkMode} onToggle={toggleDarkMode} />
            <OptionRow label="Notification" value={notificationsEnabled} onToggle={handleNotificationSwitch} />
           
            <View style={styles.signOutContainer}>
                <Button 
                    title="Sign Out" 
                    onPress={handleSignOut}
                    buttonStyle={styles.setting_buttonStyle}
                    containerStyle={styles.containerStyle}
                    titleStyle={styles.buttonText}
                />
            </View>
        </View>
    );
};

const OptionRow = ({ label, value, onToggle }) => (
    <View style={styles.optionContainer}>
        <Text style={styles.optionText}>{label}</Text>
        <Switch onValueChange={onToggle} value={value} />
    </View>
);

