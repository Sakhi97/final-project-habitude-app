import React, { useState, useEffect, useContext} from 'react';
import { View, FlatList, Text} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { getDatabase, ref, push, onValue, update, get } from 'firebase/database';
import { ThemeContext } from '../styling/ThemeContext';
import { lightThemeStyles, darkThemeStyles } from '../styling/styles';
import StoryItem from '../components/forum/StoryItem';

export default function ForumScreen() {
    const db = getDatabase();
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
    const [userLikes, setUserLikes] = useState({}); 

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
        const storiesRef = ref(db, 'stories');
        onValue(storiesRef, (snapshot) => {
            const data = snapshot.val() || {};
            const formattedData = Object.entries(data)
                .map(([key, value]) => ({ key, ...value }))
                .sort((a, b) => b.likes - a.likes);
            setStories(formattedData);
        });
    };
    

    const handleExpandStory = (storyKey) => {
        setExpandedStoryId(expandedStoryId === storyKey ? null : storyKey);
    };


    const handlePostStory = () => {
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
        const likesRef = ref(db, `stories/${storyKey}/likes`);
        get(likesRef).then((snapshot) => {
            let currentLikes = snapshot.val() || 0;
            let updatedUserLikes = { ...userLikes };
    
            if (updatedUserLikes[storyKey]) {
                currentLikes = currentLikes > 0 ? currentLikes - 1 : 0;
                updatedUserLikes[storyKey] = false;
            } else {
                currentLikes = currentLikes + 1;
                updatedUserLikes[storyKey] = true;
            }
    
            update(ref(db, `stories/${storyKey}`), { likes: currentLikes });
    
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
                data={Object.values(filteredStories)} 
                keyExtractor={(item, index) => 'story-' + index}
                renderItem={({ item }) => (
                    <StoryItem 
                        item={item} 
                        onExpand={() => handleExpandStory(item.key)}
                        onLike={() => handleLike(item.key)}
                        isExpanded={item.key === expandedStoryId}
                    />          
                )}
            />
        </View>
    );
}

