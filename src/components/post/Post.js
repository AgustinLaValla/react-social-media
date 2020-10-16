import React, { useEffect, useState } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import  makeStyles from '@material-ui/core/styles/makeStyles';
import ChatIcon from '@material-ui/icons/Chat';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import MyButton from '../layout/MyButton';
import  PostDialog  from './PostDialog';
import LikeButton from './LikeButton';
import DeletePost from './DeletePost';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getUserImage } from '../../utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import { getStyles } from '../../utils/styles';
import { Link, useHistory } from 'react-router-dom';
import { getUser } from '../../redux/actions/userActions';
import { OPEN_CHAT_MODAL } from '../../redux/types';

const useStyles = makeStyles(theme => getStyles(theme));

const Post = ({ post, openDialog, fromVisitedUser, userProfileRoom }) => {

    const classes = useStyles();
    const { socket } = useSelector(state => state.socket);
    const { userData, authenticated } = useSelector(state => state.user);

    const history = useHistory();

    const [openPostDialog, setOpenPostDialog] = useState(false);

    const dispatch = useDispatch();

    const handleOpenPostDialog = () => {
        if (authenticated) {
            setOpenPostDialog(true);
        } else {
            history.push('/login');
        }
    }

    const openChat = (userId) => {
        if (authenticated) {
            dispatch(getUser(userId, true));
            dispatch({ type: OPEN_CHAT_MODAL, payload: true });
        } else {
            history.push('/login');
        }
    };


    dayjs.extend(relativeTime);


    useEffect(() => {
        if (openDialog) {
            setOpenPostDialog(true)
        }
        return () => null;
    }, [openDialog])

    return (
        <Card className={classes.card}>
            <CardMedia
                className={classes.cardImage}
                image={getUserImage(post.userId)}
                title="Profile image"
            />
            <CardContent className={classes.content}>
                <Typography variant="h5" color="primary" component={Link} to={`/user/${post.userId._id}`}>{post.userId.username}</Typography>
                <Typography variant="body2" color="textSecondary">{dayjs(post.createdAt).fromNow()}</Typography>
                <Typography variant="body1">{post.body}</Typography>

                {/* Delete button */}
                {authenticated && userData._id === post.userId._id
                    && <DeletePost postId={post._id} />
                }

                {/* Like button */}
                <LikeButton {...{ authenticated, classes, post, userData, fromVisitedUser, userProfileRoom }} socket={socket} />

                <MyButton tipTitle="comments" tipClassName={classes.tooltip} onClick={handleOpenPostDialog}>
                    <ChatIcon color="primary" />
                </MyButton>
                <span>{post.commentCount}</span>

                <MyButton
                    onClick={handleOpenPostDialog}
                    tipTitle="Expand post"
                    btnClassName={classes.expandButton}
                    tipClassName={classes.tooltip}
                >
                    <UnfoldMore color="primary" />
                </MyButton>

                <MyButton
                    onClick={() => openChat(post.userId._id)}
                    tipTitle={`Chat with ${post.userId.username}`}
                    btnClassName={classes.openChatButton}
                    tipClassName={classes.tooltip}
                >
                    <QuestionAnswerIcon color="primary" />
                </MyButton>

                <PostDialog
                    open={openPostDialog}
                    handleClose={() => setOpenPostDialog(false)}
                    post={post}
                    userData={userData}
                    socket={socket}
                    fromVisitedUser={fromVisitedUser}
                    userProfileRoom={userProfileRoom}
                />

            </CardContent>
        </Card>
    )
}


export default Post;