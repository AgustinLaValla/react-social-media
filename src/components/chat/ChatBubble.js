import React, { useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar';
import { getUserImage } from '../../utils/utils';
import { getStyles } from '../../utils/styles';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import './Chat.css';

dayjs.extend(relativeTime);

const useStyles = makeStyles(theme => getStyles(theme));

const ChatBubble = ({ message, currentUser }) => {

    const classes = useStyles();


    const getPaperClassName = () =>
        message.senderId._id === currentUser._id
            ? classes.senderChatBubblePaper
            : classes.receiverChatBubblePaper

    const getBubbleClass = () =>
        message.senderId._id === currentUser._id
            ? 'chatBubble senderBubble'
            : 'chatBubble receiverbubble';

    const getAvatarClassName = () =>
        message.senderId._id === currentUser._id
            ? 'senderAvatar'
            : 'receiverAvatar';

    const getTypographyColor = () =>
        message.senderId._id === currentUser._id
            ? 'textSecondary'
            : 'secondary';

    return (
        <div className={getBubbleClass()}>
            <Avatar src={getUserImage(message.senderId)} className={getAvatarClassName()} />
            <Paper className={getPaperClassName()}>
                <p className="chatText">{message.body}</p>
                <Typography variant="body2" color={getTypographyColor()}>{dayjs(message.createdAt).fromNow()}</Typography>
            </Paper>
        </div>
    )
}

export default ChatBubble
