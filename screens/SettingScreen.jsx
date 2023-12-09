import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, Switch } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, updateProfile, signOut } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleNotification, cancelAllNotifications } from '../services/notification';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../styling/ThemeContext';
import { lightThemeStyles, darkThemeStyles } from '../styling/styles';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { storage } from '../configs/firebaseConfig';



export default function SettingScreen() {
    const auth = getAuth();
    const storage = getStorage();
    const user = auth.currentUser;
    const { theme } = useContext(ThemeContext);
    const { showQuote } = useContext(ThemeContext);
    const { setShowQuote} =useContext(ThemeContext);
    const styles = theme === 'dark' ? darkThemeStyles : lightThemeStyles;
    const { toggleTheme } = useContext(ThemeContext);
    const navigation = useNavigation();
    const [name, setName] = useState(user?.displayName || 'No Name');
    const [editMode, setEditMode] = useState(false);
    const [editedName, setEditedName] = useState(user?.displayName || 'No Name'); 
    const [isDarkMode, setIsDarkMode] = useState(false); 
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    // Upload file to Firebase Storage
    const [image, setImage] = useState(null)
    const [currentAvatarRef, setCurrentAvatarRef] = useState(user?.photoURL || '');



    useEffect(() => {
        const getNotificationSetting = async () => {
            const enabled = await AsyncStorage.getItem('hasNotificationPermission');
            setNotificationsEnabled(enabled === 'true');
        };
    
        getNotificationSetting();
    }, []);
    
    const handleQuoteSwitch = async (newValue) => {
        setShowQuote(newValue);
        await AsyncStorage.setItem('showQuote', JSON.stringify(newValue));
    };

  
    // Launch the image picker
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
            const uploadURL = await uploadImageAsync(result.assets[0].uri);
        
            if (user) {
                updateProfile(user, { photoURL: uploadURL })
                    .then(() => {
                        setImage(uploadURL); // Update the image state to rerender the avatar
                        Alert.alert("Avatar Updated", "Your profile picture has been updated.");
                    })
                    .catch(error => {
                        console.error("Error updating user's profile picture", error);
                        Alert.alert("Error", "Failed to update profile picture.");
                    });
            }
        }
    };
      async function uploadImageAsync(uri) {
        // Resize the image and convert it to PNG
        const manipulatedImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 100, height: 100 } }], // Resize to avatar size
            { format: ImageManipulator.SaveFormat.PNG } // Convert to PNG format
        );
    
        // Convert the manipulated image to blob
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", manipulatedImage.uri, true);
            xhr.send(null);
        });
    
        const storageRef1 = storageRef(storage, `Images/avatar-${Date.now()}.png`); // Save as PNG
        const result = await uploadBytes(storageRef1, blob);
    
        // We're done with the blob, close and release it
        blob.close();
    
        return await getDownloadURL(storageRef1);
    }
    
        
    
    
    
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

    const navigateToEditAccount = () => {
        navigation.navigate('Edit Account Page'); 
    };

    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigation.navigate('Login Page');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login Page' }],
            });
        }).catch((error) => {
            Alert.alert("Error", error.message);
        });
    };
    const OptionRow = ({ label, onPress, hasSwitch = true, value, onToggle }) => (
        <TouchableOpacity 
            style={styles.optionContainer} 
            onPress={hasSwitch ? () => onToggle(!value) : onPress} // Use onToggle if hasSwitch is true, otherwise use onPress
        >
            <Text style={{ fontWeight: 'bold', color: theme === 'dark' ? 'white' : 'black', flex: 1 }}>
                {label}
            </Text>
            {hasSwitch && (
                <Switch onValueChange={onToggle} value={value} />
            )}
        </TouchableOpacity>
    );
    const toggleDarkMode = () => {
        setIsDarkMode(previousState => !previousState)
        toggleTheme(); 
    };

    return (
        <View style={styles.setting_container}>
            <TouchableOpacity onPress={pickImage}>
            <View style={{ alignItems: 'left', justifyContent: 'left' }}>
            <Image
                source={user?.photoURL ? { uri: user.photoURL } : require('../assets/avatar.png')}
                style={{ width: 100, height: 100, borderRadius: 40 }} 
                resizeMode="contain" 
            />
            </View>
            </TouchableOpacity>
            <View style={styles.nameContainer}>
                <Text style={styles.setting_nameText}>{name}</Text>
                <TouchableOpacity onPress={() => setEditMode(!editMode)} style={styles.iconContainer}>
                    <Icon 
                        name="pencil" 
                        size={17} 
                        color={theme === 'dark' ? 'white' : 'black'}
                    />
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
                    <View style={styles.centeredButtonContainer}>
                    <Button 
                        title="Save" 
                        onPress={handleNameChange}
                        buttonStyle={styles.buttonStyle}
                        titleStyle={styles.buttonText} 
                    />
                    </View>
                </View>
            )}

            <OptionRow 
                label="Dark Mode" 
                value={isDarkMode} 
                onToggle={toggleDarkMode } 
            />
            <OptionRow 
                label="Notification" 
                value={notificationsEnabled} 
                onToggle={handleNotificationSwitch} 
            />
            <OptionRow 
                label="Daily Motivational Quote" 
                value={showQuote} 
                onToggle={handleQuoteSwitch} 
            />
            <OptionRow 
                label="Edit Account Details" 
                onPress={navigateToEditAccount}
                hasSwitch={false} // No switch for this option
            />
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



