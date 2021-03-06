import React, { Fragment, useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import MyButton from './MyButton';
import Notifications from './Notifications';
import ChatNotifications from './ChatNotifications';
import AddPost from '../post/AddPost';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getStyles } from '../../utils/styles';
import { url, getHeaders } from '../../utils/utils';
import axios from 'axios';
import Cookie from 'js-cookie';
import './Navbar.css';

const useStyles = makeStyles(theme => getStyles(theme));

const Navbar = () => {

    const [openAddPostDialog, setOpenAddPostDialog] = useState(false);

    const classes = useStyles();

    const { activateLinearProgress } = useSelector(state => state.ui);
    const { authenticated, userData, chatUserData } = useSelector(state => state.user);
    const { socket } = useSelector(state => state.socket);

    const [chatNotifications, setChatNotifications] = useState([]);

    const markMessages = (senderId, receiverId) => {
        const token = Cookie.getJSON('token');
        axios.put(
            `${url}/messages/mark-messages/${senderId}/${receiverId}`,
            {},
            getHeaders(token)
        ).then();
        if (socket) {
            socket.emit('refresh_userData', { currentUserId: senderId });
        };
    }

    const markOwnMessages = (senderId, receiverId) => {
        const token = Cookie.getJSON('token');
        axios.put(
            `${url}/messages/mark-own-messages/${senderId}/${receiverId}`,
            {},
            getHeaders(token)
        ).then();
        if (socket) {
            socket.emit('refresh_userData', { currentUserId: senderId });
        };
    };

    useEffect(() => {

        let notifications = [];

        if (userData) {
            const messagesReceived = userData.chatList.reverse()
            messagesReceived.map(item => {
                const senderName = item.msgId.messages[item.msgId.messages.length - 1].sendername;
                const senderId = item.msgId.messages[item.msgId.messages.length - 1].senderId;
                let unreadMessages = 0;
                item.msgId.messages.map(message => {
                    if (
                        chatUserData &&
                        chatUserData._id !== userData._id
                        && chatUserData._id === message.senderId
                        && !message.isRead
                    ) {
                        markMessages(userData._id, chatUserData._id);
                    } else if (
                        chatUserData &&
                        chatUserData._id === userData._id
                        && chatUserData._id === message.senderId
                        && !message.isRead
                    ) {
                        markOwnMessages(userData._id, chatUserData._id)
                    } else if (message.receiverId === userData._id && !message.isRead) {
                        unreadMessages++;
                    }
                });
                if (unreadMessages > 0) {
                    let notification = { text: `${senderName} has sent you ${unreadMessages} messages`, userId: senderId }
                    notifications.push(notification);
                }
            });
        }

        setChatNotifications(notifications);


        return () => { }
    }, [userData]);

    return (
        <AppBar position="sticky" className={classes.appbar}>
            <Toolbar className="nav-container">
                {authenticated
                    ?
                    <Fragment>

                        <MyButton
                            tipTitle="Share a post"
                            tipClassName={classes.tooltip}
                            onClick={() => setOpenAddPostDialog(true)}
                        >
                            <AddIcon color="primary" />
                        </MyButton>



                        <Tooltip title="Home" classes={{ tooltip: classes.tooltip }}>
                            <IconButton component={Link} to='/'>
                                <HomeIcon color="primary" />
                            </IconButton>
                        </Tooltip>


                        <Notifications userId={userData._id} />

                        <ChatNotifications chatNotifications={chatNotifications} markMessages={markMessages} markOwnMessages={markOwnMessages} />

                        <Tooltip title="User searcher" classes={{ tooltip: classes.tooltip }}>
                            <IconButton component={Link} to='/users'>
                                <PeopleIcon color="primary" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Profile" classes={{tooltip: classes.tooltip}}>
                            <IconButton component={Link} to={`/user/${userData._id}`}>
                                <AccountBoxIcon color="primary"></AccountBoxIcon>
                            </IconButton>
                        </Tooltip>

                    </Fragment>
                    :
                    <Fragment>
                        <Button component={Link} to='/login' color="inherit">Login</Button>
                        <Button component={Link} to='/' color="inherit">Home</Button>
                        <Button component={Link} to='/signup' color="inherit">Signup</Button>
                    </Fragment>

                }
            </Toolbar>
            {activateLinearProgress && <LinearProgress color="secondary" className={classes.linearProgress} />}
            <AddPost open={openAddPostDialog} handleClose={() => setOpenAddPostDialog(false)} />
        </AppBar>
    )
}


export default Navbar;