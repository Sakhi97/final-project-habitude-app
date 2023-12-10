import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, Switch } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile, signOut } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import OptionRow from '../components/settings/OptionRow';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleNotification, cancelAllNotifications } from '../services/notification';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../styling/ThemeContext';
import { lightThemeStyles, darkThemeStyles } from '../styling/styles';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { storage, db, auth} from '../configs/firebaseConfig';



export default function SettingScreen() {
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
                        setImage(uploadURL);
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
        const manipulatedImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 100, height: 100 } }],
            { format: ImageManipulator.SaveFormat.PNG } 
        );
    
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
    const toggleDarkMode = () => {
        setIsDarkMode(previousState => !previousState);
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
                onToggle={toggleDarkMode}
                hasSwitch={true}
                theme={theme}
                styles={styles}
            />
            <OptionRow 
                label="Notification"
                value={notificationsEnabled}
                onToggle={handleNotificationSwitch}
                hasSwitch={true}
                theme={theme}
                styles={styles}
            />
            <OptionRow 
                label="Daily Motivational Quote"
                value={showQuote}
                onToggle={handleQuoteSwitch}
                hasSwitch={true}
                theme={theme}
                styles={styles}
            />
            <OptionRow 
                label="Edit Account Details"
                onPress={navigateToEditAccount}
                hasSwitch={false}
                theme={theme}
                styles={styles}
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


