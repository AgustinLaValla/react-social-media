import React, { useEffect } from 'react'
import ChatBubble from './ChatBubble';
import TypingMessage from './TypingMessage';

const ChatContent = ({ messages, currentUser, username, typing, onScroll }) => {

    useEffect(() => {
        const chatContainer = document.querySelector('.chatContent');
        chatContainer.addEventListener('scroll', (ev) => {
            const top = ev.target.scrollTop;
            if (top === 0) {
                onScroll();
            }

        });
        return () => { };
    }, []);


    return (
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
}

export default ChatContent
