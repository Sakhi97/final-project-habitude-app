import React, { useEffect, useState, useContext} from 'react'; 
import { View, Text, TouchableWithoutFeedback  } from 'react-native';
import { ref, onValue, remove,update } from 'firebase/database';
import CalendarStrip from 'react-native-calendar-strip';
import QuoteCard from '../components/home/QuoteCard';
import HabitItem from '../components/home/HabitItem';
import { useNotificationPermission } from '../hooks/useNotificationPermission'
import { useShowQuoteSetting } from '../hooks/useShowQuoteSetting'
import { ThemeContext } from '../styling/ThemeContext';
import { lightThemeStyles, darkThemeStyles } from '../styling/styles';
import { db, auth} from '../configs/firebaseConfig';

export default function HomeScreen() {
    const { theme } = useContext(ThemeContext);
    const styles = theme === 'dark' ? darkThemeStyles : lightThemeStyles;
    const todayStr = new Date().toISOString().split('T')[0];
    const [habits, setHabits] = useState([]);
    const [selectedHabitIndex, setSelectedHabitIndex] = useState(null);
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const { showQuote } = useContext(ThemeContext);
    const { setShowQuote } = useContext(ThemeContext);

    useNotificationPermission();
    useShowQuoteSetting();

    const handleDayPress = (date) => {
        const newDateStr = date.format('YYYY-MM-DD');
        console.log('selected day', newDateStr);
        setSelectedDate(newDateStr);
    };
    
    useEffect(() => {
        const habitsRef = ref(db, `habits/${auth.currentUser.uid}`);
        onValue(habitsRef, (snapshot) => {
            const data = snapshot.val() || {};
            const loadedHabits = Object.keys(data).map((key) => {
                const habit = data[key];
                const startDate = new Date(habit.startDate);
                const endDate = new Date(habit.endDate);
                const selectedDateObj = new Date(selectedDate);

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
        setSelectedHabitIndex(selectedHabitIndex === index ? null : index);
    };

    
    const handleDeleteHabit = (habitKey) => {
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
        
        const newStreak = newDoneStatus ? (habitToUpdate.streak || 0) + 1 : habitToUpdate.streak - 1;
        updates['/habits/' + auth.currentUser.uid + '/' + habitToUpdate.key + '/done'] = newDoneStatus;
        updates['/habits/' + auth.currentUser.uid + '/' + habitToUpdate.key + '/streak'] = newStreak;
    
        const todayStr = new Date().toISOString().split('T')[0];

        const completionsPath = `/habits/${auth.currentUser.uid}/${habitToUpdate.key}/completions/${selectedDate}`;
    
        if (newDoneStatus) {
            updates[completionsPath] = { timestamp: new Date().toISOString() };
        } else {
            updates[completionsPath] = null;
        }

        update(ref(db), updates)
        .then(() => {
            console.log('Habit updated successfully.');
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
                    style={styles.stripeCalendarStyle}
                    iconLeftStyle= {{tintColor: theme === 'dark' ? 'white' : 'black'}}
                    iconRightStyle={{tintColor: theme === 'dark' ? 'white' : 'black'}}
                    calendarColor={'white'}
                    calendarHeaderStyle={{color: theme === 'dark' ? 'white' : 'black'}}
                    dateNumberStyle={{color: theme === 'dark' ? 'white' : 'black'}}
                    dateNameStyle={{color: theme === 'dark' ? 'white' : 'black'}}
                    highlightDateNumberStyle={{ color: '#808080' }}
                    highlightDateNameStyle={{ color: '#808080' }}
                    disabledDateNameStyle={{ color: 'grey' }}
                    disabledDateNumberStyle={{ color: 'grey' }}
                    iconContainer={{ flex: 0.1 }}
                />
                {showQuote && <QuoteCard />}
                <Text style={styles.dateText}>
                    Habits for {formatDateForDisplay(selectedDate)}
                </Text>
                {habits.map((habit, index) => (
                    <HabitItem 
                    key={habit.key}
                    habit={habit}
                    onHabitPress={() => handleHabitPress(index)}
                    onToggleDone={() => handleMarkDone(index)}
                    onDelete={() => handleDeleteHabit(habit.key)}
                    isSelected={index === selectedHabitIndex}
                />
            ))}
            </View>
        </TouchableWithoutFeedback>
    );
    
}