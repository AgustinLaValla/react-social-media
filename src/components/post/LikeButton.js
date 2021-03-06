import React, { Fragment, useEffect, useState } from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MyButton from '../layout/MyButton';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as fromTYPES from '../../redux/types';
import { url, getHeaders } from '../../utils/utils';
import axios from 'axios';
import Cookie from 'js-cookie';

const LikeButton = ({ authenticated, classes, post, userData, socket, fromVisitedUser, userProfileRoom }) => {

    const [postLiked, setPostLiked] = useState(false);
    const dispatch = useDispatch();


    const addLike = async () => {
        dispatch({ type: fromTYPES.ACTIVATE_LINEAR_PROGRESS });
        try {
            const token = Cookie.getJSON('token');
            await axios.put(`${url}/posts/add-like/${post._id}/${post.userId._id}`, {}, getHeaders(token));
            socket.emit('refresh_single_post', { postId:post._id });
            socket.emit('refresh_userData', { visitedUserId: post.userId._id });
            if (fromVisitedUser) {
                socket.emit('refresh_userVisited_post', { postId:post._id, userProfileRoom });
            }
            dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });
        } catch (error) {
            dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });
        }
    }

    const unLike = async () => {
        dispatch({ type: fromTYPES.ACTIVATE_LINEAR_PROGRESS });
        try {
            const token = Cookie.getJSON('token');
            await axios.put(`${url}/posts/unlike/${post._id}/${post.userId._id}`, {}, getHeaders(token));
            socket.emit('refresh_single_post', { postId: post._id });
            if (fromVisitedUser) {
                socket.emit('refresh_userVisited_post', { postId: post._id, userProfileRoom });
            }
            dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });
        } catch (error) {
            dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });
        }

    }

    useEffect(() => {
        if (authenticated) {
            setPostLiked(post.likes.find(like => like.userId._id === userData._id));
        }
        return () => null;
    }, [post]);

    return (
        <Fragment>
            {!authenticated
                ? <MyButton tipTitle="Like" tipClassName={classes.tooltip}>
                    <Link to="/login">
                        <FavoriteBorderIcon color="primary" />
                    </Link>
                </MyButton>

                : postLiked
                    ?
                    <MyButton tipTitle="Undo like" tipClassName={classes.tooltip} onClick={unLike}>
                        <FavoriteIcon color="primary" />
                    </MyButton>
                    :
                    <MyButton tipTitle="Like" tipClassName={classes.tooltip} onClick={addLike} >
                        <FavoriteBorderIcon color="primary"/>
                    </MyButton>
            }
            <span>{post.likeCount}</span>
        </Fragment>
    )
}


export default LikeButton;