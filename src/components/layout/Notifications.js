import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
//material-ui
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';
import NotificationsIcon from '@material-ui/icons/Notifications';
//styles
import { getStyles } from '../../utils/styles';
import './Navbar.css'
//dayjs
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
//redux
import { useSelector } from 'react-redux';
//react-router
import { Link } from 'react-router-dom';
//Cookie
import Cookie from 'js-cookie';
//axios
import axios from 'axios';
//utils
import { url, getHeaders } from '../../utils/utils';

const useStyles = makeStyles(theme => getStyles(theme));

export const Notifications = ({userId}) => {

    const classes = useStyles();

    const { notifications: { postNotifications }, _id } = useSelector(state => state.user.userData);
    const { socket } = useSelector(state => state.socket);

    const [notificationIcon, setNotificationIcon] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpen = ({ currentTarget }) => setAnchorEl(currentTarget);

    const handleClose = () => setAnchorEl(null);

    const markNotification = (notificationId) => {
        const token = Cookie.getJSON('token');
        axios.put(`${url}/user/mark-notification-as-read/${notificationId}`, {}, getHeaders(token))
            .then(() => socket ? socket.emit('refresh_userData', { currentUserId: userId }) : null)
            .catch(console.log)
    };

    const getNotificationsMarkup = () => {
        if (postNotifications && postNotifications.length > 0) {
            return postNotifications.map(notification => {
                const verb = notification.type === 'like' ? 'Liked' : 'Commented on';
                const time = dayjs(notification.createdAt).fromNow();
                const iconColor = notification.read ? 'primary' : 'secondary';

                return (
                    <MenuItem key={notification._id} onClick={() => markNotification(notification._id)}>
                        {notification.type === 'like'
                            ? <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
                            : <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
                        }
                        <Typography
                            component={Link}
                            to={`/user/${_id}/post/${notification.postId}`}
                            variant="body1"
                            className={classes.notifications_menuItem}
                        >
                            {notification.username} {verb} your screen {time}
                        </Typography>
                    </MenuItem>
                )

            });
        } else {
            return <MenuItem onClick={handleClose}>You have no notifications</MenuItem>
        }
    };

    dayjs.extend(relativeTime);

    useEffect(() => {
        if (postNotifications && postNotifications.length > 0) {
            const thereAreUnreadNotifications = postNotifications.some(not => !not.read);
            if (thereAreUnreadNotifications) {
                const badgeContent = postNotifications.filter(not => !not.read).length;
                setNotificationIcon(
                    <Badge badgeContent={badgeContent} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                )
            } else {
                setNotificationIcon(<NotificationsIcon />);
            }
        } else {
            setNotificationIcon(<NotificationsIcon />);
        }
        return () => null;
    }, [postNotifications])

    return (
        <Fragment>
            <Tooltip placement="top" title="Notifications" className={classes.tooltip}>
                <IconButton aria-haspopup="true" aria-controls="noitification-menu" onClick={handleOpen}>
                    {notificationIcon}
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                classes={classes.notificationsMenu}
            >
                {getNotificationsMarkup()}
            </Menu>

        </Fragment>
    )
}
