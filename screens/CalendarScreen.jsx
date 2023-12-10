import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Calendar} from 'react-native-calendars';
import { ProgressChart } from 'react-native-chart-kit';
import { ThemeContext } from '../styling/ThemeContext';
import { lightThemeStyles, darkThemeStyles } from '../styling/styles';

export default function CalendarScreen() {
    const auth = getAuth();
    const { theme } = useContext(ThemeContext);
    const styles = theme === 'dark' ? darkThemeStyles : lightThemeStyles;
    const [habits, setHabits] = useState({});
    const [markedDates, setMarkedDates] = useState({});
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const db = getDatabase();
        const habitsRef = ref(db, 'habits/' + auth.currentUser.uid);
        onValue(habitsRef, (snapshot) => {
            const data = snapshot.val();
            setHabits(data || {});
        });
    }, [auth.currentUser.uid]);

    useEffect(() => {
        setItems(
          Object.keys(habits).map(habitKey => ({
            label: habits[habitKey].habit,
            value: habitKey
          }))
        );
      }, [habits]);

    useEffect(() => {
        const newMarkedDates = {};
        Object.keys(habits).forEach(habitKey => {
            const habit = habits[habitKey];
            if (habit && habit.startDate && habit.endDate) {
                const { startDate, endDate, completions } = habit;
                const start = new Date(startDate);
                const end = new Date(endDate);
                for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
                    const dateStr = date.toISOString().split('T')[0];
                    if (!newMarkedDates[dateStr]) {
                        newMarkedDates[dateStr] = { dots: [] };
                    }
                    newMarkedDates[dateStr].dots.push({ color: 'blue', key: habitKey });
                }

                if (completions) {
                    Object.values(completions).forEach(completion => {
                        const dateStr = completion.timestamp.split('T')[0];
                        newMarkedDates[dateStr] = {
                            ...newMarkedDates[dateStr],
                            periods: [{ startingDay: true, endingDay: true, color: 'green' }]
                        };
                    });
                }
            }
        });
        setMarkedDates(newMarkedDates);
    }, [habits]);
    
    const chartConfig = {
        backgroundGradientFrom: theme === 'dark' ? '#303030' : '#f4f4f4', 
        backgroundGradientTo: theme === 'dark' ? '#303030' : '#f4f4f4',  
        color: (opacity = 1) => `rgba(255, 102, 51, ${opacity})`,
    };

    
    const getCompletionPercentage = (habitKey) => {
        const habit = habits[habitKey];
        if (!habit || !habit.startDate || !habit.endDate || !habit.completions) {
            return 0;
        }
        
        const startDate = new Date(habit.startDate);
        const endDate = new Date(habit.endDate);
        const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
        let completedDays = 0;
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const dateStr = date.toISOString().split('T')[0];
            if (habit.completions[dateStr]) {
                completedDays += 1;
            }
        }
    
        const completionPercentage = (completedDays / totalDays) * 100;
        return Math.round(completionPercentage);
    };
    


    const data = {
        data: [getCompletionPercentage(selectedHabit) / 100], 
    };

   


    return (
        <View style={styles.screen_container}>
            <Calendar
                markedDates={markedDates}
                markingType={'multi-dot'}
                style={styles.calendarContainer}
            />
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                nestedScrollEnabled: true,
                }}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                onSelectItem={item => setSelectedHabit(item.value)}
            />
            {selectedHabit !== null && (
                <View style={styles.chartContainer}>
                <Text style={styles.completionText}>
                  Completion: {getCompletionPercentage(selectedHabit)}%
                </Text>
                <ProgressChart
                  data={data}
                  width={200} 
                  height={200} 
                  strokeWidth={16}
                  radius={32}
                  chartConfig={chartConfig}
                  hideLegend={true}
                />
              </View>
            )}
        </View>
    );
}

