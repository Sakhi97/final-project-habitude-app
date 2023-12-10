import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';

const HabitItem = ({ habit, onHabitPress, onToggleDone, onDelete, isSelected }) => {
    return (
        <TouchableOpacity onPress={onHabitPress}> 
            <Card
                containerStyle={{
                    backgroundColor: habit.done ? 'green' : '#e0e0eb',
                    borderRadius: 20,
                    borderColor: 'grey',
                    width: '95%', 
                    alignSelf: 'center', 
                }}
            >
                <Card.Title style={{ color: habit.done ? 'white' : 'black' }}>
                    Habit: {habit.habit}
                </Card.Title>
                {isSelected && ( 
                    <>
                        <Card.Divider color='black'/>
                                    <Text style={{color: habit.done ? 'white' : 'black', fontWeight: 'bold' }}>Description: {habit.description}</Text>
                                    <Text style={{color: habit.done ? 'white' : 'black', fontWeight: 'bold' }}>Streak: {habit.streak || 0} days</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <Button
                                buttonStyle ={{ backgroundColor: '#339900' }}
                                icon={<Icon name={habit.done ? "close" : "check"} color={habit.done ? 'red' : 'blue'} />}
                                onPress={onToggleDone} 
                                title={habit.done ? "Mark Undone" : "Mark Done"}
                            />
                            <Button 
                                buttonStyle ={{ backgroundColor: '#909090' }}
                                icon={<Icon name="delete" color='#980000'/>}
                                onPress={onDelete}
                                title="Delete"
                            />
                        </View>
                    </>
                )}
            </Card>
        </TouchableOpacity>
    );
};

export default HabitItem;
