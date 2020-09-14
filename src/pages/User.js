import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/actions/userActions';
import { getUserPost } from '../redux/actions/postsActions';
import Grid from '@material-ui/core/Grid';
import { Post } from '../components/post/Post';
import { UserProfile } from '../components/profile/UserProfile';
import { useGoogleLogout } from 'react-google-login';
import { clientId } from '../utils/utils';
import { renovateToken } from '../utils/utils';
import { useHistory } from 'react-router-dom';
import ChatModal from '../components/chat/ChatModal';
import { OPEN_CHAT_MODAL, CLEAR_CHAT_USER_DATA, CLEAR_MESSAGES, CLEAR_VISITED_USER_DATA } from '../redux/types';


export const User = () => {

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
        <Grid container className="animated fadeIn">
            <Grid item sm={8} xs={12}>
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
            <Grid item sm={4} xs={12}>
                <UserProfile user={visitedUserData} />
            </Grid>
        </Grid>
    )
}
