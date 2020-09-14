import React from 'react'
import ChatBubble from './ChatBubble';
import TypingMessage from './TypingMessage';

const ChatContent = ({ messages, currentUser, username, typing }) =>

    (
        <div className="chatContent">
            {messages.map(message => (
                <ChatBubble key={message._id} message={message} currentUser={currentUser} />
            ))}
            {
                typing &&
                <TypingMessage username={username} />
            }
        </div>
    );


export default ChatContent
