import React, { useEffect, useState } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getImageUrl } from '../utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import { getSinglePost } from '../redux/actions/postsActions';
import { url, getHeaders } from '../utils/utils';
import Cookie from 'js-cookie';
import axios from 'axios';
import MyButton from '../components/MyButton';
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { DeletePost } from './DeletePost';
import { getStyles } from '../utils/styles';

const useStyles = makeStyles(theme => getStyles(theme));

export const Post = ({ post }) => {

    const classes = useStyles();
    const { socket } = useSelector(state => state.socket);
    const { userData, authenticated } = useSelector(state => state.user);
    const [postLiked, setPostLiked] = useState(false);

    const dispatch = useDispatch();

    dayjs.extend(relativeTime);
    console.log(post);

    const addLike = async () => {
        try {
            const token = Cookie.getJSON('token');
            await axios.put(`${url}/posts/add-like/${post._id}/${post.userId._id}`, {}, getHeaders(token));
            socket.emit('refresh_single_post');
        } catch (error) {
            console.log(error);
        }
    }

    const unLike = async () => {
        try {
            const token = Cookie.getJSON('token');
            await axios.put(`${url}/posts/unlike/${post._id}/${post.userId._id}`, {}, getHeaders(token));
            socket.emit('refresh_single_post');
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        if (socket) {
            socket.on('refresh_single_post', () => dispatch(getSinglePost(post._id)));
        }
    }, [socket]);

    useEffect(() => {
        if (authenticated) {
            setPostLiked(post.likes.find(like => like.userId._id === userData._id));
        }
    }, [post]);



    return (
        <Card className={classes.card}>
            <CardMedia
                className={classes.cardImage}
                image={getImageUrl(post.userId.picVersion, post.userId.picId)}
                title="Profile image"
            />
            <CardContent className={classes.content}>
                <Typography variant="h5" color="primary">{post.userId.username}</Typography>
                <Typography variant="body2" color="textSecondary">{dayjs(post.createdAt).fromNow()}</Typography>
                <Typography variant="body1">{post.body}</Typography>

                {/* Delete button */}
                {authenticated && userData._id === post.userId._id
                    && <DeletePost postId={post._id} />
                }

                {/* Like button */}
                {!authenticated
                    ? <MyButton tipTitle="Like">
                        <Link to="/login">
                            <FavoriteBorderIcon color="primary" />
                        </Link>
                    </MyButton>

                    : postLiked
                        ?
                        <MyButton tipTitle="Undo like" tipClassName={classes.tooltip}>
                            <FavoriteIcon color="primary" onClick={unLike} />
                        </MyButton>
                        :
                        <MyButton tipTitle="Like" tipClassName={classes.tooltip}>
                            <FavoriteBorderIcon color="primary" onClick={addLike} />
                        </MyButton>
                }
                <span>{post.likeCount}</span>

                <MyButton tipTitle="comments" tipClassName={classes.tooltip}>
                    <ChatIcon color="primary" />
                </MyButton>
                <span>{post.commentCount}</span>
            </CardContent>
        </Card>
    )
}
