import React from 'react';
import { getStyles } from '../../utils/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SendIcon from '@material-ui/icons/Send';
import MyButton from '../../components/layout/MyButton';
import { useState } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { url, getHeaders } from '../../utils/utils';


const useStyles = makeStyles(theme => getStyles(theme));

const ChatFooter = ({ senderId, receiverId, receivername, socket, startTyping }) => {
    const classes = useStyles();

    const [messageBody, setMessageBody] = useState('');

    const sendMessage = (ev) => {
        ev.preventDefault();
        const token = Cookie.getJSON('token');
        axios.post(
            `${url}/messages/send-message/${senderId}/${receiverId}`,
            { message: messageBody, receivername },
            getHeaders(token)
        ).then(() => {
            setMessageBody('');
            socket.emit('stop_typing', { sender: senderId, receiver: receiverId });
            socket.emit('refresh_chat', { senderId, receiverId });
            socket.emit('refresh_userData', { visitedUserId: receiverId });
        });
    }

    return (
        <form className="chatFooter" onSubmit={sendMessage}>
            <input
                type="text"
                value={messageBody}
                onChange={ev => setMessageBody(ev.target.value)}
                onKeyDown={ev => ev.key === 'Enter' ? sendMessage(ev) : null}
                onKeyPress={() => startTyping()}
            />
            <MyButton tipClassName={classes.tooltip} tipTitle="Send Message">
                <SendIcon color="primary" />
            </MyButton>
        </form>
    )
}

export default ChatFooter
