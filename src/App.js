import React from 'react';
import ChatContainer from './components/ChatContainer';
import './Chatbot.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>COVID-19 Expert System Chatbot</h1>
            </header>
            <ChatContainer />
        </div>
    );
}

export default App;
