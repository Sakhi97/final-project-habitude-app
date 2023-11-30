import React, { useEffect, useState } from 'react';
import { View, Text, TouchableWithoutFeedback  } from 'react-native';
import { Icon, Button, Card } from 'react-native-elements';
import { getDatabase, ref, onValue, remove,update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import CalendarStrip from 'react-native-calendar-strip';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuoteCard from '../components/home/QuoteCard';
import { styles } from '../styling/styles';


export default function HomeScreen() {
    const auth = getAuth();
    const todayStr = new Date().toISOString().split('T')[0];
    const [habits, setHabits] = useState([]);
    const [selectedHabitIndex, setSelectedHabitIndex] = useState(null);
    const [selectedDate, setSelectedDate] = useState(todayStr);

    const handleDayPress = (date) => {
        const newDateStr = date.format('YYYY-MM-DD');
        console.log('selected day', newDateStr);
        setSelectedDate(newDateStr);
    };
    
    

    useEffect(() => {
        const requestNotificationsPermission = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            await AsyncStorage.setItem('hasNotificationPermission', status === 'granted' ? 'true' : 'false');
        };
    
        requestNotificationsPermission();

        const db = getDatabase();
        const habitsRef = ref(db, `habits/${auth.currentUser.uid}`);
        onValue(habitsRef, (snapshot) => {
            const data = snapshot.val() || {};
            const loadedHabits = Object.keys(data).map((key) => {
                const habit = data[key];
                const startDate = new Date(habit.startDate);
                const endDate = new Date(habit.endDate);
                const selectedDateObj = new Date(selectedDate);

            // Check if the selected date falls within the habit's date range
                if (selectedDateObj >= startDate && selectedDateObj <= endDate) {
                    return {
                        key,
                        ...habit,
                        done: habit.completions?.[selectedDate] ? true : false
                    };
                }
                return null;
         }).filter(habit => habit !== null);

        setHabits(loadedHabits);
    });
}, [selectedDate]);

    

    const formatDateForDisplay = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    };

    const handleHabitPress = (index) => {
        setSelectedHabitIndex(index);
    };


    const handleDeleteHabit = (habitKey) => {
        const db = getDatabase();
        const habitRef = ref(db, 'habits/' + auth.currentUser.uid + '/' + habitKey);
        remove(habitRef).then(() => {
            console.log('Habit removed from the database.');
            setHabits(prevHabits => prevHabits.filter(habit => habit.key !== habitKey));  
        }).catch((error) => {
            console.error('Error removing habit: ', error);
        });
    };
    


    const handleMarkDone = (index) => {
        const habitToUpdate = habits[index];
        const updates = {};
        const newDoneStatus = !habitToUpdate.done;
        
        // Increment or decrement the streak based on the new done status
        const newStreak = newDoneStatus ? (habitToUpdate.streak || 0) + 1 : habitToUpdate.streak - 1;
        updates['/habits/' + auth.currentUser.uid + '/' + habitToUpdate.key + '/done'] = newDoneStatus;
        updates['/habits/' + auth.currentUser.uid + '/' + habitToUpdate.key + '/streak'] = newStreak;
    
        // Get the current date string
        const todayStr = new Date().toISOString().split('T')[0];
    
        // Use selectedDate instead of today's date
        const completionsPath = `/habits/${auth.currentUser.uid}/${habitToUpdate.key}/completions/${selectedDate}`;
    
        if (newDoneStatus) {
            // If marking as done, add a new completion
            updates[completionsPath] = { timestamp: new Date().toISOString() };
        } else {
            // If marking as undone, remove the completion
            updates[completionsPath] = null;
        }
    
        const db = getDatabase();
        update(ref(db), updates)
        .then(() => {
            console.log('Habit updated successfully.');
            // Update local state if necessary
            setHabits(prevHabits => {
                const updatedHabits = [...prevHabits];
                updatedHabits[index].done = newDoneStatus;
                updatedHabits[index].streak = newStreak;
                return updatedHabits;
            });
        })
        .catch(error => {
            console.error('Error updating habit: ', error);
        });
    };
    
 

    return (
        <TouchableWithoutFeedback onPress={() => setSelectedHabitIndex(null)}>
            <View style={styles.screen_container}> 
                <CalendarStrip
                    onDateSelected={handleDayPress}
                    scrollable
                    style={{ 
                        height: 100, 
                        paddingTop: 20, 
                        paddingBottom: 10,
                        backgroundColor: '#f4f4f4' 
                    }}
                    calendarColor={'white'}
                    calendarHeaderStyle={{ color: 'black' }}
                    dateNumberStyle={{ color: 'black' }}
                    dateNameStyle={{ color: 'black' }}
                    highlightDateNumberStyle={{ color: '#808080' }}
                    highlightDateNameStyle={{ color: '#808080' }}
                    disabledDateNameStyle={{ color: 'grey' }}
                    disabledDateNumberStyle={{ color: 'grey' }}
                    iconContainer={{ flex: 0.1 }}
                />
                <QuoteCard />
                <Text style={{ padding: 10, fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>
                    Habits for {formatDateForDisplay(selectedDate)}
                </Text>
                {habits.map((habit, index) => (
                    <TouchableWithoutFeedback key={habit.key} onPress={() => handleHabitPress(index)}>
                        <Card
                            containerStyle={{
                                backgroundColor: habit.done ? 'green' : 'white',
                                borderRadius: 20, 
                                width: '95%', 
                                alignSelf: 'center', 
                            }}
                                >
                            <Card.Title style={{ 
                                    color: habit.done ? 'white' : 'black', 
                                }}
                            >Habit: {habit.habit}</Card.Title>
                            {index === selectedHabitIndex && (
                                <>
                                    <Card.Divider />
                                    <Text style={{color: habit.done ? 'white' : 'black', fontWeight: 'bold' }}>Description: {habit.description}</Text>
                                    <Text style={{color: habit.done ? 'white' : 'black', fontWeight: 'bold' }}>Streak: {habit.streak || 0} days</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <Button 
                                            icon={<Icon name={habit.done ? "close" : "check"} color={habit.done ? 'red' : 'blue'} />}
                                            onPress={() => handleMarkDone(index)}
                                            title={habit.done ? "Mark Undone" : "Mark Done"}
                                        />
                                        <Button 
                                            icon={<Icon name="delete" />}
                                            onPress={() => handleDeleteHabit(habit.key)}
                                            title="Delete"
                                        />
                                    </View>
                                </>
                            )}
                        </Card>
                    </TouchableWithoutFeedback>
                ))}
            </View>
        </TouchableWithoutFeedback>
    );
    
}