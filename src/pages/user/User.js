import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Post from '../../components/post/Post';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../redux/actions/userActions';
import { getUserPost } from '../../redux/actions/postsActions';
import  UserProfile  from './UserProfile';
import { useGoogleLogout } from 'react-google-login';
import { clientId } from '../../utils/utils';
import { renovateToken } from '../../utils/utils';
import { useHistory } from 'react-router-dom';
import ChatModal from '../../components/chat/ChatModal';
import { OPEN_CHAT_MODAL, CLEAR_CHAT_USER_DATA, CLEAR_MESSAGES, CLEAR_VISITED_USER_DATA } from '../../redux/types';


const User = () => {

    const { id, postId } = useParams();

    const { visitedUserData, chatUserData } = useSelector(state => state.user);
    const { visitedUserPosts } = useSelector(state => state.posts);
    const { userData } = useSelector(state => state.user);
    const { openChatModal } = useSelector(state => state.ui);
    const { socket } = useSelector(state => state.socket);

    const [userProfileRoom, setUserProfileRoom] = useState(null);

    const dispatch = useDispatch();

    const history = useHistory();

    const { signOut } = useGoogleLogout({ clientId });

    const onCloseChatModal = () => {
        dispatch({ type: OPEN_CHAT_MODAL, payload: false });
        dispatch({ type: CLEAR_MESSAGES });
        dispatch({ type: CLEAR_CHAT_USER_DATA });
    };


    useEffect(() => {
        dispatch(getUser(id));
        dispatch(getUserPost(id));
    }, [id]);


    useEffect(() => {
        if (userData && userData.google) {
            renovateToken(history, dispatch, signOut)
        } else {
            renovateToken(history, dispatch, null);
        }
        return () => null;
    }, []);

    useEffect(() => {
        if (socket && visitedUserData) {
            socket.emit('userProfileRoom', { userProfileRoom: `profile${visitedUserData._id}` });
            setUserProfileRoom(`profile${visitedUserData._id}`);
        }
        return () => { };
    }, [visitedUserData, socket]);

    useEffect(() => {
        let user;
        return () => {
            dispatch({ type: CLEAR_VISITED_USER_DATA });
            if (socket) {
                socket.emit('leaveProfileRoom', { userProfileRoom });
            };
            setTimeout(() => setUserProfileRoom(null), 500);
        };
    }, []);

    return (
        <Grid container className="animated fadeIn" spacing={2}>
            <Grid item xs={12}>
                <Box display={{ sm: 'block', md: 'none' }}>
                    <UserProfile user={visitedUserData} totalPosts={visitedUserPosts.length} />
                </Box>
            </Grid>
            <Grid item md={8} sm={12}>
                {visitedUserPosts && visitedUserPosts.length > 0
                    ? visitedUserPosts.map(post =>
                        <Post
                            key={post._id}
                            post={post}
                            openDialog={postId && postId === post._id ? true : false}
                            fromVisitedUser={true}
                            userProfileRoom={userProfileRoom}
                        />)
                    : null
                }

                {
                    chatUserData &&
                    <ChatModal
                        open={openChatModal}
                        handleClose={onCloseChatModal}
                        user={chatUserData}
                        currentUser={userData}
                        socket={socket}
                    />
                }

            </Grid>
            <Grid item md={4}>
                <Box display={{ sm: 'none', md: 'block' }}>
                    <UserProfile user={visitedUserData} totalPosts={visitedUserPosts.length} />
                </Box>
            </Grid>
        </Grid>
    )
}


export default User;