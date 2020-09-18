import React from 'react';
import { getUserImage } from '../../utils/utils';
import { getStyles } from '../../utils/styles';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import makeStyles from '@material-ui/core/styles/makeStyles';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useState } from 'react';
import UserMenu from './UserMenu';
import { getUser } from '../../redux/actions/userActions';
import { OPEN_CHAT_MODAL } from '../../redux/types';
import './User.css';

const useStyles = makeStyles(theme => getStyles(theme));

const User = ({ user, onlineUsers }) => {

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    const { authenticated } = useSelector(state => state.user);

    const history = useHistory();

    const dispatch = useDispatch();

    const goToUserProfile = (userId) => history.push(`/user/${userId}`);

    const getUserBiography = (userBio) => {
        if (!authenticated) return;
        if (userBio) {
            if (userBio.length >= 100) {
                return userBio.slice(0, 100) + '...';
            } else {
                return userBio;
            }
        } else {
            return 'There is no biography to show';
        }
    };

    const getUserStatus = () => {
        const isOnline = onlineUsers.find(onlineUser => onlineUser === user._id);
        return isOnline ? 'connected' : 'disconnected';
    }

    const openChat = (userId) => {
        if (authenticated) {
            dispatch(getUser(userId, true));
            dispatch({ type: OPEN_CHAT_MODAL, payload: true });
        } else {
            history.push('/login');
        }
    };


    return (
        <Grid item lg={3} md={4} sm={6} xs={12}>
            <Card className={classes.usersCard}>
                <div className={getUserStatus()}></div>
                <CardHeader
                    avatar={
                        <Avatar src={getUserImage(user)} />
                    }
                    action={
                        <IconButton aria-haspopup="true" onClick={ev => setAnchorEl(ev.currentTarget)} id={`${user._id}`}>
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={user.username}
                    subheader={user.location ? user.location : null}
                    classes={{ title: classes.userCardTitle }}
                >
                </CardHeader>

                <CardMedia
                    image={getUserImage(user)}
                    title="Paella dish"
                    className={classes.usersCardPicture}
                />

                <CardContent className={classes.cardUsersContent}>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {getUserBiography(user.bio)}
                    </Typography>
                </CardContent>

                <CardActions disableSpacing>
                    <Tooltip classes={{ tooltip: classes.tooltip }} title={`Chat with ${user.username}!`}>
                        <IconButton aria-label="Chat with user" onClick={() => openChat(user._id)}>
                            <QuestionAnswerIcon color="primary" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip classes={{ tooltip: classes.tooltip }} title={`Go to ${user.username} profile`}>
                        <IconButton aria-label="go to profile" onClick={() => goToUserProfile(user._id)}>
                            <AccountCircleIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                </CardActions>

                <UserMenu
                    anchorEl={anchorEl}
                    userId={user._id}
                    username={user.username}
                    handleClose={() => setAnchorEl(null)}
                    goToUserProfile={goToUserProfile}
                    openChat={openChat}
                />

            </Card>
        </Grid>
    )
}

export default User
