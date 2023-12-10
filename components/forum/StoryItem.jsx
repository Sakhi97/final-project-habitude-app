import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Card, Icon } from 'react-native-elements';

const StoryItem = ({ item, onExpand, onLike, isExpanded }) => {
    const text = item.text || '';
    const shouldTruncate = text.length > 50 && !isExpanded;

    return (
        <TouchableOpacity onPress={onExpand}>
            <Card containerStyle={{
                backgroundColor: '#e0e0eb',
                borderRadius: 20,
                borderColor: 'grey',
                width: '95%', 
                alignSelf: 'center', 
            }}>
                <Card.Title>{item.headline}</Card.Title>
                <Card.Divider color='black'/>
                <Text>
                    {shouldTruncate ? text.substring(0, 50) + '...' : text}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            name='thumbs-up'
                            type='entypo'
                            onPress={onLike} 
                        />
                        <Text style={{ marginLeft: 5}}>{item.likes || 0}</Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
};

export default StoryItem;
