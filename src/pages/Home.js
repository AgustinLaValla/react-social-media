import React, { useEffect } from 'react'
import { Grid } from '@material-ui/core';
import { Post } from '../components/post/Post';
import Cookie from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../redux/actions/postsActions';
import { Profile } from '../components/profile/Profile';
import { useHistory } from 'react-router-dom';
import { renovateToken } from '../utils/utils';
import { useGoogleLogout } from 'react-google-login';
import { clientId } from '../utils/utils';

export const Home = () => {

    const posts = useSelector(state => state.posts.posts);
    const { socket } = useSelector(state => state.socket);
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    const history = useHistory();

    const { signOut } = useGoogleLogout({ clientId });

    const getPostsList = () => {
        const token = Cookie.getJSON('token');
        dispatch(getPosts(token));
    }

    useEffect(() => {
        getPostsList();
        return () => null;
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('refresh_posts', () => getPostsList());
        }
        return () => socket
            ? socket.removeListener('refresh_posts', () => getPostsList())
            : null
    })

    useEffect(() => {
        if (userData && userData.google) {
            renovateToken(history, dispatch, signOut);
        } else {
            renovateToken(history, dispatch, null);
        }
        return () => null;
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid item md={8} xs={12} className="animated fadeIn">
                {posts && posts.length > 0
                    ? posts.map(post =>
                        <Post key={post._id} post={post} />
                    )
                    : null
                }
            </Grid>
            <Grid item md={4} xs={12} className="animated fadeIn">
                <Profile />
            </Grid>
        </Grid>

    )
}
