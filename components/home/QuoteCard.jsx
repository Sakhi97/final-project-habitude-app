import React, {useEffect, useState} from 'react';
import { Text, Card } from 'react-native-elements';



const QuoteCard = () => {
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');

useEffect(() => {
    fetchQuote();
}, []);

const fetchQuote = async () => {
    try {
        const response = await fetch('https://api.quotable.io/quotes/random');
        const data = await response.json();
        
        if (data && data.length > 0) {
            setQuote(data[0].content);
            setAuthor(data[0].author);
        } else {
            console.log('No quotes found in the response');
        }
    } catch (error) {
        console.error('Error fetching quote:', error);
    }
};
    return (
        <Card containerStyle={{
            backgroundColor: '#e0e0eb',
            borderRadius: 20,
            borderColor: 'grey',
            width: '95%', 
            alignSelf: 'center', 
        }}>
            <Card.Title style={{ 
                color: 'black', 
            }} 
            >Quote Of The Day</Card.Title>
            <Card.Divider color='black'/>
            <Text>{quote}</Text>
            <Text style={{ 
                alignSelf: 'flex-end', 
                marginTop: 10, 
                fontStyle: 'italic', 
                }}>
                - {author}
            </Text>
        </Card>
    );
};

export default QuoteCard;
