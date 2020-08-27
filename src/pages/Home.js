import React, { useEffect, useState } from 'react'
import { Button, Grid } from '@material-ui/core';
import axios from 'axios';
import { Post } from '../components/Post';
import Cookie from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../redux/actions/postsActions';
import { Profile } from '../components/Profile';


export const Home = () => {

    const posts = useSelector(state => state.posts.posts);
    const { socket } = useSelector(state => state.socket);
    const dispatch = useDispatch();

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
            <Grid item md={8} xs={12}>
                {posts
                    ? posts.map(post =>
                        <Post key={post._id} post={post} />
                    )
                    : <p>Loading...</p>
                }
            </Grid>
            <Grid item md={4} xs={12}>
                <Profile />
            </Grid>
        </Grid>

    )
}
