import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// Styled-components for container and UI styling
const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 80%;
    max-width: 900px;
    height: 80vh;
    background-color: #f9f9f9;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin: 2rem auto;
`;

const MessageContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
`;

const MessageWrapper = styled.div`
    display: flex;
    justify-content: ${(props) => (props.user ? 'flex-end' : 'flex-start')};
    margin-bottom: 0.5rem;
`;

const Message = styled.div`
    margin: 0.5rem;
    padding: 1rem;
    background-color: ${(props) => (props.user ? '#cce5ff' : '#f1f1f1')};
    border-radius: 10px;
    max-width: 60%;
    text-align: left;
    align-self: ${(props) => (props.user ? 'flex-end' : 'flex-start')};
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
    display: flex;
    padding: 1rem;
    background-color: #ffffff;
    border-top: 1px solid #dddddd;
`;

const Input = styled.input`
    flex: 1;
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid #dddddd;
    margin-right: 1rem;
`;

const Button = styled.button`
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const LoadingIndicator = styled.div`
    text-align: center;
    margin: 1rem 0;
    color: #007bff;
`;

const ChatContainer = () => {
    const [messages, setMessages] = useState([]); // Initialize messages as an empty array
    const [inputValue, setInputValue] = useState(''); // Store input value
    const [loading, setLoading] = useState(false); // Show loading indicator

    // Function to filter out unwanted parts of the response
    const filterResponse = (response) => {
        const disallowedPhrases = [
            'However, I am an AI and cannot provide medical advice.',
            'I cannot diagnose your symptoms or tell you if you have COVID-19.',
            'Please seek professional medical advice for accurate diagnosis and treatment.',
            'Contact your doctor or a medical professional.'
        ];

        // Remove any disallowed phrases from the response text
        disallowedPhrases.forEach((phrase) => {
            response = response.replace(phrase, '');
        });

        return response;
    };

    // Function to send user message and fetch chatbot response
    const addMessage = async (userMessage) => {
        if (!userMessage.trim()) return; // Prevent empty messages

        // Add user message to the chat immediately
        const newMessage = { user: true, text: userMessage };
        setMessages((prevMessages) => [...prevMessages, newMessage]); 

        setInputValue(''); // Clear input after sending the message
        setLoading(true); // Set loading while waiting for response

        try {
            // Await backend response
            const res = await axios.post('http://localhost:5000/chat', { message: userMessage });

            // Check for valid response from the server
            let chatbotResponse = res.data?.response || 'No response from the server';

            // Filter out unwanted parts of the response
            chatbotResponse = filterResponse(chatbotResponse);

            // Add bot response to the messages
            setMessages((prevMessages) => [...prevMessages, { user: false, text: chatbotResponse }]);
        } catch (err) {
            setMessages((prevMessages) => [...prevMessages, { user: false, text: 'Error: Unable to fetch response' }]);
        } finally {
            setLoading(false); // Stop loading after response/error
        }
    };

    // Function to handle the form submit (pressing enter or clicking send)
    const handleSendMessage = (e) => {
        e.preventDefault(); // Prevent default form submission
        if (inputValue.trim() !== '') {
            addMessage(inputValue); // Send the current input value
        }
    };

    useEffect(() => {
        const messageContainer = document.getElementById('message-container');
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }, [messages]); // Automatically scroll down when new messages are added

    return (
        <Container>
            <MessageContainer id="message-container">
                {messages.length === 0 && <div>No messages yet. Start the conversation!</div>}
                {messages.map((message, index) => (
                    <MessageWrapper key={index} user={message.user}>
                        <Message user={message.user}>
                            {message.user ? (
                                message.text
                            ) : (
                                <ReactMarkdown>{message.text}</ReactMarkdown>
                            )}
                        </Message>
                    </MessageWrapper>
                ))}
                {loading && <LoadingIndicator>Loading...</LoadingIndicator>}
            </MessageContainer>
            <InputContainer>
                <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)} // Send message on Enter
                />
                <Button onClick={handleSendMessage}>Send</Button>
            </InputContainer>
        </Container>
    );
};

export default ChatContainer;
