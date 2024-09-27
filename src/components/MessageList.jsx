// MessageList.jsx
import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
`;

const Message = styled.div`
    background-color: ${(props) => (props.user ? '#007bff' : '#f1f1f1')};
    color: ${(props) => (props.user ? 'white' : 'black')};
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    text-align: ${(props) => (props.user ? 'right' : 'left')};
`;

const Loading = styled.div`
    color: #888;
    font-style: italic;
    animation: dots 1s steps(5, end) infinite;
    ::after {
        content: '...';
        animation: dots 1s steps(5, end) infinite;
    }
`;

// const MessageList = ({ messages, loading }) => {
//     return (
//         <MessageContainer>
//             {messages.map((msg, index) => (
//                 <Message key={index} user={msg.user}>
//                     {typeof msg.text === 'string' ? msg.text : msg.text} 
//                     {/* Handles formatted JSX */}
//                 </Message>
//             ))}
//             {loading && <Loading>Chatbot is typing</Loading>}
//         </MessageContainer>
//     );
// };
const MessageList = ({ messages }) => {
    if (!messages || !Array.isArray(messages)) {
        return <div>No messages to display</div>;
    }

    return (
        <div>
            {messages.map((message, index) => (
                <div key={index} className={message.user ? 'user-message' : 'bot-message'}>
                    {message.text}
                </div>
            ))}
        </div>
    );
};

export default MessageList;
