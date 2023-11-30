import React, { useState } from 'react';
import { View, Text, Switch, addHabitStylesheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Button, Input } from 'react-native-elements';
import { addHabitStyles } from '../styling/styles';
import { styles } from '../styling/styles';

export default function AddHabitScreen({ navigation }) {
    const [habit, setHabit] = useState('');
    const [description, setDescription] = useState('');
    const [timePeriod, setTimePeriod] = useState('daily');
    const [duration, setDuration] = useState('');
    const [useDates, setUseDates] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' }
    ]);

    const auth = getAuth();

    const handleAddHabit = () => {
        let computedStartDate = new Date(startDate);
        let computedEndDate = new Date(endDate);

        if (!useDates) {
            computedStartDate = new Date();
            computedEndDate = new Date();

            let incrementValue = parseInt(duration, 10);
            if (isNaN(incrementValue) || incrementValue <= 0) {
                console.error("Invalid duration");
                return;
            }

            switch (timePeriod) {
                case 'daily':
                    computedEndDate.setDate(computedEndDate.getDate() + incrementValue - 1);
                    break;
                case 'weekly':
                    computedEndDate.setDate(computedEndDate.getDate() + (incrementValue * 7) - 1);
                    break;
                case 'monthly':
                    computedEndDate.setMonth(computedEndDate.getMonth() + incrementValue);
                    computedEndDate.setDate(computedEndDate.getDate() - 1);
                    break;
                default:
                    console.error("Invalid time period");
                    return;
            }
        }

        const db = getDatabase();
        const habitRef = ref(db, 'habits/' + auth.currentUser.uid + '/' + habit);
        set(habitRef, {
            habit,
            description,
            startDate: computedStartDate.toISOString().split('T')[0],
            endDate: computedEndDate.toISOString().split('T')[0],
        }).then(() => {
            navigation.goBack();
        }).catch((error) => {
            console.error("Error adding habit: ", error);
        });
    };

    return (
        <View style={addHabitStyles.container}>
            <Input
                placeholder="Habit"
                value={habit}
                onChangeText={setHabit}
                style={addHabitStyles.input}
            />
            <Input
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={addHabitStyles.input}
            />
            <View style={addHabitStyles.switchRow}>
                <Switch
                    value={useDates}
                    onValueChange={setUseDates}
                />
                <Text style={addHabitStyles.switchText}>Use Start and End Dates</Text>
            </View>

            {useDates ? (
            <View style={addHabitStyles.datePickerRow}>
                <Text style={addHabitStyles.datePickerLabel}>Start</Text>
                <DateTimePicker
                    value={startDate}
                    mode='date'
                    display='default'
                    onChange={(event, date) => setStartDate(date)}
                    style={addHabitStyles.datePicker}
                />
                <Text style={addHabitStyles.datePickerLabel}>End</Text>
                <DateTimePicker
                    value={endDate}
                    mode='date'
                    display='default'
                    onChange={(event, date) => setEndDate(date)}
                    style={addHabitStyles.datePicker}
                />
            </View>
            ) : (
                <>
                    <DropDownPicker
                        open={open}
                        value={timePeriod}
                        items={items}
                        setOpen={setOpen}
                        setValue={setTimePeriod}
                        setItems={setItems}
                        listMode="SCROLLVIEW"
                        style={addHabitStyles.dropdown}
                        dropDownContainerStyle={addHabitStyles.dropdownContainer}
                    />

                    <Input
                        placeholder={timePeriod === 'daily' ? 'Days' : timePeriod === 'weekly' ? 'Weeks' : 'Months'}
                        value={duration}
                        onChangeText={setDuration}
                        keyboardType="numeric"
                        style={addHabitStyles.input}
                    />
                </>
            )}

                <View style={styles.centeredButtonContainer}>
                    <Button
                        title="Add Habit"
                        onPress={handleAddHabit}
                        buttonStyle={styles.buttonStyle}
                        titleStyle={styles.buttonText}
                    />
                </View>


        </View>
    );
}

