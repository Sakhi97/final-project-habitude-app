import React, { useState, useEffect, useContext} from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Button, Card, Icon, Input } from 'react-native-elements';
import { getDatabase, ref, push, onValue, update, get } from 'firebase/database';
import { ThemeContext } from '../styling/ThemeContext';
import { lightThemeStyles, darkThemeStyles } from '../styling/styles';

export default function ForumScreen() {
    const { theme } = useContext(ThemeContext);
    const styles = theme === 'dark' ? darkThemeStyles : lightThemeStyles;
    const [stories, setStories] = useState([]);
    const [filteredStories, setFilteredStories] = useState([]);
    const [expandedStoryId, setExpandedStoryId] = useState(null); 
    const [newStory, setNewStory] = useState('');
    const [newHeadline, setNewHeadline] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddPost, setShowAddPost] = useState(false);
    const [refreshStoriesTrigger, setRefreshStoriesTrigger] = useState(false);
    const [userLikes, setUserLikes] = useState({}); // This should ideally be fetched from the database



    useEffect(() => {
        fetchStories();
    }, [refreshStoriesTrigger]);
    

    useEffect(() => {
        const filtered = Object.values(stories).filter(story => 
            (story.headline && story.headline.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (story.text && story.text.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredStories(filtered);
    }, [searchQuery, stories]);

    

    const fetchStories = () => {
        const db = getDatabase();
        const storiesRef = ref(db, 'stories');
        onValue(storiesRef, (snapshot) => {
            const data = snapshot.val() || {};
            const formattedData = Object.entries(data)
                .map(([key, value]) => ({ key, ...value }))
                .sort((a, b) => b.likes - a.likes); // Sort stories by likes in descending order
            setStories(formattedData);
        });
    };
    

    const handleExpandStory = (storyKey) => {
        setExpandedStoryId(expandedStoryId === storyKey ? null : storyKey);
    };

    const renderStoryText = (item) => {
        const isExpanded = expandedStoryId === item.key;
        const text = item.text || '';
        const shouldTruncate = text.length > 50 && !isExpanded;

        return (
            <Text>
                {shouldTruncate ? text.substring(0, 50) + '...' : text}
            </Text>
        );
    };

    const handlePostStory = () => {
        const db = getDatabase();
        const storiesRef = ref(db, 'stories');
        push(storiesRef, {
            headline: newHeadline,
            text: newStory,
            likes: 0,
            dislikes: 0,
            comments: []
        });
        setNewHeadline('');
        setNewStory('');
        setShowAddPost(false);
    };

    const handleLike = (storyKey) => {
        const db = getDatabase();
        const likesRef = ref(db, `stories/${storyKey}/likes`);
        get(likesRef).then((snapshot) => {
            let currentLikes = snapshot.val() || 0;
            let updatedUserLikes = { ...userLikes };
    
            if (updatedUserLikes[storyKey]) {
                // User has already liked this story, so unlike it
                currentLikes = currentLikes > 0 ? currentLikes - 1 : 0;
                updatedUserLikes[storyKey] = false;
            } else {
                // User has not liked this story, so add a like
                currentLikes = currentLikes + 1;
                updatedUserLikes[storyKey] = true;
            }
    
            // Update the likes in Firebase
            update(ref(db, `stories/${storyKey}`), { likes: currentLikes });
    
            // Update the local state
            setUserLikes(updatedUserLikes);
        });
    };
    
    
    
    
    const toggleAddPost = () => {
        setShowAddPost(!showAddPost);
    };

    return (
        <View style={styles.screen_container}>
            <Input
                placeholder="Search stories..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.screen_input}
            />

            <View style={styles.centeredButtonContainer}>
                <Button
                    title={showAddPost ? "Hide Post Form" : "Add a Post"}
                    onPress={toggleAddPost}
                    buttonStyle={styles.buttonStyle}
                    containerStyle={styles.containerStyle}
                    titleStyle={styles.buttonText}
                />
            </View>

            {showAddPost && (
                <View>
                    <Input
                        placeholder="Headline"
                        value={newHeadline}
                        onChangeText={setNewHeadline}
                        style={styles.forum_input}
                    />
                    <Input
                        placeholder="Share your story..."
                        value={newStory}
                        onChangeText={setNewStory}
                        style={styles.forum_input}
                        multiline
                    />
                    <View style={styles.centeredButtonContainer}>
                        <Button
                            title="Post"
                            onPress={handlePostStory}
                            buttonStyle={styles.buttonStyle}
                            containerStyle={styles.containerStyle}
                            titleStyle={styles.buttonText}
                        />
                    </View>
                </View>
            )}

            <FlatList
                data={Object.values(filteredStories)} // Convert stories object to an array for rendering
                keyExtractor={(item, index) => 'story-' + index}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleExpandStory(item.key)}>
                        <Card containerStyle={{
                            backgroundColor: '#e0e0eb',
                            borderRadius: 20,
                            borderColor: 'grey',
                            width: '95%', 
                            alignSelf: 'center', 
                        }}>
                            <Card.Title>{item.headline}</Card.Title>
                            <Card.Divider color='black'/>
                            {renderStoryText(item)}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    
                                    <Icon
                                        name='thumbs-up'
                                        type='entypo'
                                        onPress={() => handleLike(item.key)} // Make sure 'item.key' is the correct reference to the story's key in Firebase
                                    />
                                    <Text style={{ marginLeft: 5}}>{item.likes || 0}</Text>
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

