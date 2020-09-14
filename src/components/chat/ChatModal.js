import React, { useEffect, useState } from 'react';
import Modal from '@material-ui/core/Modal';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { getStyles } from '../../utils/styles';
import { getUserImage } from '../../utils/utils';
import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';
import ChatFooter from './ChatFooter';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages } from '../../redux/actions/messagesActions';
import { CLEAR_MESSAGES, CLEAR_CHAT_USER_DATA } from '../../redux/types';

const useStyles = makeStyles(theme => getStyles(theme));

const modalCenteredStyle = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
};

const ChatModal = ({ open, handleClose, user, currentUser, socket }) => {

    const classes = useStyles();

    const { visitedUserData } = useSelector(state => state.user);
    const { messages } = useSelector(state => state.messages);
    const [receiverIsTyping, setReceiverIsTyping] = useState();
    const [chatPaperClassName, setChatPaperClassName] = useState(classes.chatPaper);

    let typing;

    const dispatch = useDispatch();

    const get_messages = () => {
        dispatch(getMessages(currentUser._id, user._id));
        setTimeout(() => {
            const messagesContainer = document.querySelector('.chatContent');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 900);
    };

    const startTyping = () => {
        socket.emit('start_typing', { sender: currentUser._id, receiver: user._id });

        if (typing) {
            clearTimeout(typing);
        }

        typing = setTimeout(() => {
            socket.emit('stop_typing', { sender: currentUser._id, receiver: user._id });
        }, 3000);
    }

    const typingListener = (data) => {
        if (data.sender === user._id) {
            setReceiverIsTyping(data.typing);
        }
    }

    const toggleChatScreen = () => {
        if (chatPaperClassName === classes.chatPaper) {
            setChatPaperClassName(classes.chatPaperFullScreen);
        } else {
            setChatPaperClassName(classes.chatPaper);
        }
    }


    useEffect(() => {
        get_messages();
    }, [visitedUserData, user]);

    useEffect(() => {
        socket.on('refresh_chat', get_messages);
        socket.on('is_typing', typingListener)
        return () => {
            socket.removeListener('refresh_chat', get_messages);
            socket.removeListener('is_typing', typingListener)
            dispatch({ type: CLEAR_CHAT_USER_DATA });
            dispatch({ type: CLEAR_MESSAGES });
        };
    }, []);


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div className={chatPaperClassName} style={modalCenteredStyle}>
                <ChatHeader
                    username={user.username}
                    userImage={getUserImage(user)}
                    userId={user._id}
                    toggleChatScreen={toggleChatScreen}
                    paperClassName={chatPaperClassName}
                    handleCloseChat={handleClose}
                />
                <ChatContent
                    messages={messages}
                    currentUser={currentUser}
                    socket={socket}
                    typing={receiverIsTyping}
                    username={user.username}
                />
                <ChatFooter
                    senderId={currentUser._id}
                    receiverId={user._id}
                    receivername={user.username}
                    socket={socket}
                    startTyping={startTyping}
                />
            </div>
        </Modal>
    )
}

export default ChatModal
