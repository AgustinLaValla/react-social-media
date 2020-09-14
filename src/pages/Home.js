import React, { useEffect, useState } from 'react'
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
import ChatModal from '../components/chat/ChatModal';
import { OPEN_CHAT_MODAL, CLEAR_MESSAGES, CLEAR_CHAT_USER_DATA } from '../redux/types';

export const Home = () => {

    const posts = useSelector(state => state.posts.posts);
    const { socket } = useSelector(state => state.socket);
    const dispatch = useDispatch();
    const { userData, authenticated, chatUserData } = useSelector(state => state.user);
    const { openChatModal } = useSelector(state => state.ui);
    const [connectedUsers, setConnectedUsers] = useState([]); 

    const history = useHistory();

    const { signOut } = useGoogleLogout({ clientId });

    const getPostsList = () => {
        const token = Cookie.getJSON('token');
        dispatch(getPosts(token));
    }

    const onCloseChatModal = () => {
        dispatch({type: OPEN_CHAT_MODAL, payload:false});
        dispatch({ type: CLEAR_MESSAGES });
        dispatch({ type: CLEAR_CHAT_USER_DATA });
    };

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

    useEffect(() => {
        if(authenticated && socket) {
          socket.on('usersOnline', ({onlineUsers}) => setConnectedUsers(onlineUsers));
        }
        return () => socket
            ? socket.removeListener('usersOnline', ({onlineUsers}) => setConnectedUsers(onlineUsers))
            : null
      }, [authenticated, socket]);


    return (
        <Grid container spacing={2}>
            <Grid item md={8} xs={12} className="animated fadeIn">
                {posts && posts.length > 0
                    ? posts.map(post =>
                        <Post key={post._id} post={post} />
                    )
                    : null
                }
                {
                    authenticated && chatUserData &&
                    <ChatModal
                        open={openChatModal}
                        handleClose={onCloseChatModal}
                        user={chatUserData}
                        currentUser={userData}
                        socket={socket}
                    />
                }
            </Grid>
            <Grid item md={4} xs={12} className="animated fadeIn">
                <Profile />
            </Grid>
        </Grid>

    )
}
