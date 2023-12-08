import React from 'react';
import { TouchableWithoutFeedback, Card } from 'react-native-elements';

const HabitCard = ({ habit, onPress, isSelected, handleMarkDone, handleDeleteHabit }) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Card
                containerStyle={{
                    backgroundColor: habit.done ? 'green' : 'white',
                    borderRadius: 20,
                    width: '95%',
                    alignSelf: 'center',
                }}>
                <Card.Title style={{ color: habit.done ? 'white' : 'black' }}>
                    Habit: {habit.habit}
                </Card.Title>
                {isSelected && <HabitDetails habit={habit} handleMarkDone={handleMarkDone} handleDeleteHabit={handleDeleteHabit} />}
            </Card>
        </TouchableWithoutFeedback>
    );
};

export default HabitCard;
