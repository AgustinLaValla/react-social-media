import React, { Fragment, useEffect, useState } from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { url, getHeaders } from '../../utils/utils';
import Cookie from 'js-cookie';
import axios from 'axios';
import MyButton from '../layout/MyButton';
import { connect } from 'react-redux';

export const LikeButton = ({ authenticated, classes, post, userData, socket, fromVisitedUser }) => {

    const [postLiked, setPostLiked] = useState(false);

    const addLike = async () => {
        try {
            const token = Cookie.getJSON('token');
            await axios.put(`${url}/posts/add-like/${post._id}/${post.userId._id}`, {}, getHeaders(token));
            socket.emit('refresh_single_post');
            socket.emit('refresh_userData');
            if (fromVisitedUser) {
                socket.emit('refresh_userVisited_post');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const unLike = async () => {
        try {
            const token = Cookie.getJSON('token');
            await axios.put(`${url}/posts/unlike/${post._id}/${post.userId._id}`, {}, getHeaders(token));
            socket.emit('refresh_single_post');
            if (fromVisitedUser) {
                socket.emit('refresh_userVisited_post');
            }
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        if (authenticated) {
            setPostLiked(post.likes.find(like => like.userId._id === userData._id));
        }
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
                    <MyButton tipTitle="Undo like" tipClassName={classes.tooltip}>
                        <FavoriteIcon color="primary" onClick={unLike} />
                    </MyButton>
                    :
                    <MyButton tipTitle="Like" tipClassName={classes.tooltip}>
                        <FavoriteBorderIcon color="primary" onClick={addLike} />
                    </MyButton>
            }
            <span>{post.likeCount}</span>
        </Fragment>
    )
}
