import React, { useEffect, useState } from 'react'
import { Button, Grid } from '@material-ui/core';
import axios from 'axios';
import { Post } from '../components/post/Post';
import Cookie from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../redux/actions/postsActions';
import { Profile } from '../components/profile/Profile';


export const Home = () => {

    const posts = useSelector(state => state.posts.posts);
    const { socket } = useSelector(state => state.socket);
    const dispatch = useDispatch();

    console.log(posts);

    const getPostsList = () => {
        const token = Cookie.getJSON('token');
        dispatch(getPosts(token));
    }

    useEffect(() => getPostsList(), []);

    useEffect(() => {
        if (socket) {
            socket.on('refresh_posts', () => getPostsList());
        }
    })

    return (
        <Grid container spacing={2}>
            <Grid item md={8} xs={12} className="animated fadeIn">
                {posts && posts.length > 0 
                    ? posts.map(post =>
                        <Post key={post._id} post={post} />
                    )
                    :null
                }
            </Grid>
            <Grid item md={4} xs={12} className="animated fadeIn">
                <Profile />
            </Grid>
        </Grid>

    )
}
