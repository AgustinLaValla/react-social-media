import React, { Fragment, useState } from 'react';
import EmailIcon from '@material-ui/icons/Email';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import TextsmsIcon from '@material-ui/icons/Textsms';
import { getStyles } from '../../utils/styles';
import { useDispatch, useSelector } from 'react-redux';
import { OPEN_CHAT_MODAL } from '../../redux/types';
import { getUser } from '../../redux/actions/userActions';


const useStyles = makeStyles(theme => getStyles(theme));

const ChatNotifications = ({ chatNotifications, markMessages, markOwnMessages }) => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);

    const { userData, authenticated } = useSelector(state => state.user);


    const dispatch = useDispatch();

    const handleOpen = ({ currentTarget }) => setAnchorEl(currentTarget);

    const markNotificationAndOpenChat = (userId) => {
        dispatch(getUser(userId, true));
        dispatch({ type: OPEN_CHAT_MODAL, payload: true });
        setAnchorEl(null);
        if (userData._id !== userId) {
            markMessages(userData._id, userId);
        } else {
            markOwnMessages(userData._id, userId);
        }
    };

    return (
        <Fragment>

            <Tooltip placement="top" title="Chat Notifications" classes={{tooltip:classes.tooltip}}>
                <IconButton aria-haspopup="true" aria-controls="noitification-menu" onClick={handleOpen}>
                    {chatNotifications.length > 0
                        ?
                        <IconButton>
                            <Badge badgeContent={chatNotifications.length} color="secondary">
                                <EmailIcon />
                            </Badge>
                        </IconButton>
                        :
                        <IconButton>
                            <EmailIcon />
                        </IconButton>
                    }
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}

            >
                {
                    authenticated && chatNotifications.length > 0
                        ?
                        chatNotifications.map((notification, index) =>
                            <MenuItem key={index} onClick={() => markNotificationAndOpenChat(notification.userId)}>
                                <TextsmsIcon color="primary" style={{ marginRight: '10px' }} />
                                <Typography >{notification.text}</Typography>
                            </MenuItem>
                        )
                        :
                        <MenuItem>
                            <Typography variant="body1">You have no chat messages</Typography>
                        </MenuItem>
                }
            </Menu>

        </Fragment>
    )
}

export default ChatNotifications
