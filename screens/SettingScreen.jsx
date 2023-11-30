import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Switch, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { getAuth, updateProfile, signOut } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleNotification, cancelAllNotifications } from '../services/notification';
import { useNavigation } from '@react-navigation/native';

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
        <View style={customStyles.container}>
            <View style={customStyles.nameContainer}>
                <Text style={customStyles.nameText}>{name}</Text>
                <TouchableOpacity onPress={() => setEditMode(!editMode)} style={customStyles.iconContainer}>
                    <Icon name="pencil" size={17} />
                </TouchableOpacity>
            </View>


            {editMode && (
                <View>
                    <Input
                        style={customStyles.input}
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
           
            <View style={customStyles.signOutContainer}>
                <Button 
                    title="Sign Out" 
                    onPress={handleSignOut}
                    buttonStyle={customStyles.buttonStyle}
                    containerStyle={customStyles.containerStyle}
                    titleStyle={customStyles.buttonText}
                />
            </View>
        </View>
    );
};

const OptionRow = ({ label, value, onToggle }) => (
    <View style={customStyles.optionContainer}>
        <Text style={customStyles.optionText}>{label}</Text>
        <Switch onValueChange={onToggle} value={value} />
    </View>
);

const customStyles = StyleSheet.create({
    buttonStyle: {
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 30,
        backgroundColor: '#C70039'
    },
    containerStyle: {
        width: 200,
        marginHorizontal: 50,
        marginVertical: 10,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white',
    },

    container: {
        flex: 1,
        padding: 10,
        paddingTop: 30, // Adjust as needed for the top spacing
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20, // Space below the name
    },
    input: {
        // Styles for your input if needed
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionText: {
        
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20, // Adjust as needed
    },
    iconContainer: {
        marginLeft: 5, // Adjust as needed
        marginBottom: 25
    },
    signOutContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 30, // Adjust as needed for bottom spacing
    },
});