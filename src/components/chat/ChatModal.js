import React, { useEffect, useState } from 'react';
import Modal from '@material-ui/core/Modal';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { getStyles } from '../../utils/styles';
import { getUserImage } from '../../utils/utils';
import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';
import ChatFooter from './ChatFooter';
import store from '../../redux/store';
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

    const { messages } = useSelector(state => state.messages);
    const [receiverIsTyping, setReceiverIsTyping] = useState();
    const [chatPaperClassName, setChatPaperClassName] = useState(classes.chatPaper);
    const [messagesLimit, setMessagesLimit] = useState(0);

    let [typing, setTyping] = useState(null);

    const dispatch = useDispatch();

    const get_messages = (action) => {

        if (action === 'onload') {
            setMessagesLimit(prev => {
                messagesApiCall(30);
                return 30;
            });
        };

        if (action === 'onScroll') {
            setMessagesLimit(prev => {
                const totalMessages = getTotalMessages();

                if (totalMessages > prev) {
                    messagesApiCall(prev + 30);
                    return prev + 30;
                }
                return prev;
            });
        };
        if (action === 'newMessage') {
            setMessagesLimit(prev => {
                const messagesLengt = getMessagesLength() + 1;
                messagesApiCall(messagesLengt);
                return messagesLengt > prev + 1 ? messagesLengt : prev;
            });
        };

    };

    const messagesApiCall = (limit) => {
        dispatch(getMessages(currentUser._id, user._id, limit));
        setTimeout(() => {
            const messagesContainer = document.querySelector('.chatContent');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 900);
    }

    const startTyping = () => {
        socket.emit('start_typing', { sender: currentUser._id, receiver: user._id });

        setTyping((prev) => {
            if (prev) {
                clearTimeout(prev);
            }
            return setTimeout(() => {
                socket.emit('stop_typing', { sender: currentUser._id, receiver: user._id });
            }, 3000);
        });

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


    const getTotalMessages = () => store.getState().messages.totalMessages;

    const getMessagesLength = () => store.getState().messages.length;

    const onChatRefresh = ({ senderId }) => senderId === user._id || senderId === currentUser._id
        ? get_messages('newMessage')
        : null;

    useEffect(() => {
        get_messages('onload');
        return () => { };
    }, [user]);

    useEffect(() => {
        socket.on('refresh_chat', onChatRefresh);
        socket.on('is_typing', typingListener);
        return () => {
            socket.removeListener('refresh_chat', onChatRefresh);
            socket.removeListener('is_typing', typingListener);
            dispatch({ type: CLEAR_CHAT_USER_DATA });
            dispatch({ type: CLEAR_MESSAGES });
            setMessagesLimit(0);
            localStorage.removeItem('totalMessages');
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
                    onScroll={() => get_messages('onScroll')}
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
