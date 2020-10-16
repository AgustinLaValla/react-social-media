import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Profile from '../components/profile/Profile';
import Post from '../components/post/Post';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../redux/actions/postsActions';
import { useHistory } from 'react-router-dom';
import { renovateToken } from '../utils/utils';
import { useGoogleLogout } from 'react-google-login';
import { clientId } from '../utils/utils';
import ChatModal from '../components/chat/ChatModal';
import { OPEN_CHAT_MODAL, CLEAR_MESSAGES, CLEAR_CHAT_USER_DATA, SET_POSTS_LIMIT } from '../redux/types';
import InfiniteScroll from 'react-infinite-scroll-component';

const Home = () => {

    const { posts, postsLimit, totalPosts } = useSelector(state => state.posts);
    const { socket } = useSelector(state => state.socket);
    const dispatch = useDispatch();
    const { userData, authenticated, chatUserData } = useSelector(state => state.user);
    const { openChatModal } = useSelector(state => state.ui);

    const history = useHistory();

    const { signOut } = useGoogleLogout({ clientId });

    const onCloseChatModal = () => {
        dispatch({ type: OPEN_CHAT_MODAL, payload: false });
        dispatch({ type: CLEAR_MESSAGES });
        dispatch({ type: CLEAR_CHAT_USER_DATA });
    };

    const getPostsAfterScroll = () => {
        dispatch(getPosts(postsLimit + 15));
        dispatch({ type: SET_POSTS_LIMIT, payload: postsLimit + 15 });
    }

    useEffect(() => {
        dispatch({ type: SET_POSTS_LIMIT, payload: 15 });
        setTimeout(() => dispatch(getPosts(15)), 500);
        return () => dispatch({ type: SET_POSTS_LIMIT, payload: 0 });
    }, []);

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
                <InfiniteScroll dataLength={totalPosts} next={getPostsAfterScroll} hasMore={true}>
                    {posts && posts.length > 0
                        ? posts.map(post =>
                            <Post key={post._id} post={post} />
                        )
                        : null
                    }
                </InfiniteScroll>
            </Grid>
            <Grid item md={4} xs={12} className="animated fadeIn">
                <Box display={{ xs: 'none', sm: 'block' }}>
                    <Profile />
                </Box>
            </Grid>

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

    )
}


export default Home;