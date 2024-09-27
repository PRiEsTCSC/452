// InputBar.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #f9f9f9;
`;

const Input = styled.input`
    flex: 1;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    margin-right: 10px;
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const InputBar = ({ onSendMessage }) => {
    const [input, setInput] = useState('');

    const handleSendMessage = () => {
        if (input.trim() === '') return;

        onSendMessage(input);
        setInput(''); // Clear input after sending
    };

    return (
        <InputContainer>
            <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} // Send message on 'Enter' key
            />
            <Button onClick={handleSendMessage}>Send</Button>
        </InputContainer>
    );
};

export default InputBar;





// import React, { useState } from 'react';
// import styled from 'styled-components';

// const InputContainer = styled.div`
//     display: flex;
//     padding: 20px;
//     border-top: 1px solid #ddd;
// `;

// const InputField = styled.input`
//     flex-grow: 1;
//     padding: 10px;
//     font-size: 16px;
//     border: 1px solid #ddd;
//     border-radius: 5px;
//     margin-right: 10px;
// `;

// const SendButton = styled.button`
//     background-color: #007bff;
//     color: white;
//     border: none;
//     padding: 10px 20px;
//     font-size: 16px;
//     border-radius: 5px;
//     cursor: pointer;

//     &:hover {
//     background-color: #0056b3;
//     }
// `;

// const InputBar = ({ onSendMessage }) => {
//     const [input, setInput] = useState('');

//     const handleSend = () => {
//         if (input.trim()) {
//             onSendMessage(input);
//             setInput('');  // Clear input after sending message
//         }
//     };

//     const handleKeyPress = (event) => {
//         if (event.key === 'Enter') {
//             handleSend();
//         }
//     };

//     return (
//         <InputContainer>
//             <InputField
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Type a message..."
//             />
//             <SendButton onClick={handleSend}>Send</SendButton>
//         </InputContainer>
//     );
// };

// export default InputBar;
