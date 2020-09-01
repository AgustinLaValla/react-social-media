import React, { useEffect, useState } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getImageUrl } from '../../utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import { refreshSinglePost, refreshVisitedUserPost } from '../../redux/actions/postsActions';
import MyButton from '../layout/MyButton';
import ChatIcon from '@material-ui/icons/Chat';
import { DeletePost } from './DeletePost';
import { getStyles } from '../../utils/styles';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import { PostDialog } from './PostDialog';
import { LikeButton } from './LikeButton';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => getStyles(theme));

export const Post = ({ post, openDialog, fromVisitedUser }) => {

    const classes = useStyles();
    const { socket } = useSelector(state => state.socket);
    const { userData, authenticated } = useSelector(state => state.user);

    const [openPostDialog, setOpenPostDialog] = useState(false);

    const dispatch = useDispatch();

    dayjs.extend(relativeTime);

    useEffect(() => {
        if (socket) {
            socket.on('refresh_single_post', () => dispatch(refreshSinglePost(post._id)));
        }
        return () => socket
            ? socket.removeListener('refresh_single_post', () => dispatch(refreshSinglePost(post._id)))
            : null;
    }, [socket]);

    useEffect(() => {
        if (socket && fromVisitedUser) {
            socket.on('refresh_userVisited_post', () => dispatch(refreshVisitedUserPost(post._id)))
        }
        return () => socket
            ? socket.removeListener('refresh_userVisited_post', () => dispatch(refreshVisitedUserPost(post._id)))
            : null
    }, [socket, fromVisitedUser])

    useEffect(() => {
        if (openDialog) {
            setOpenPostDialog(true)
        }
    }, [openDialog])

    return (
        <Card className={classes.card}>
            <CardMedia
                className={classes.cardImage}
                image={getImageUrl(post.userId.picVersion, post.userId.picId)}
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
                <LikeButton {...{ authenticated, classes, post, userData, fromVisitedUser }} socket={socket} />

                <MyButton tipTitle="comments" tipClassName={classes.tooltip}>
                    <ChatIcon color="primary" />
                </MyButton>
                <span>{post.commentCount}</span>

                <MyButton
                    onClick={() => setOpenPostDialog(true)}
                    tipTitle="Expand post"
                    btnClassName={classes.expandButton}
                    tipClassName={classes.tooltip}
                >
                    <UnfoldMore color="primary" />
                </MyButton>

                <PostDialog
                    open={openPostDialog}
                    handleClose={() => setOpenPostDialog(false)}
                    post={post}
                    userData={userData}
                    socket={socket}
                />
            </CardContent>
        </Card>
    )
}
