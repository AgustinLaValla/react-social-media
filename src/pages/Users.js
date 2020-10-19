import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, searchUsers } from '../redux/actions/usersActions';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import User from '../components/users/User';
import ChatModal from '../components/chat/ChatModal';
import { Link } from 'react-router-dom';
import { CLEAR_MESSAGES, OPEN_CHAT_MODAL, CLEAR_CHAT_USER_DATA } from '../redux/types';
import './Users.css';

const Users = () => {

    const { users, totalUsers, onlineUsers } = useSelector(state => state.users);
    const { openChatModal } = useSelector(state => state.ui);
    const { chatUserData, userData, authenticated } = useSelector(state => state.user);
    const { socket } = useSelector(state => state.socket);

    const [searchText, setSearchText] = useState('');
    const [usersLimit, setUsersLimit] = useState(20);

    const dispatch = useDispatch();

    const onCloseChatModal = () => {
        dispatch({ type: OPEN_CHAT_MODAL, payload: false });
        dispatch({ type: CLEAR_MESSAGES });
        dispatch({ type: CLEAR_CHAT_USER_DATA });
    };


    const searchHandler = () => {
        if (searchText) {
            dispatch(searchUsers(searchText));
        } else {
            dispatch(getUsers(usersLimit));
        }
    }


    const onScroll = (ev) => {
        const scrollingEl = ev.target.scrollingElement;
        if (scrollingEl.clientHeight + scrollingEl.scrollTop >= scrollingEl.scrollHeight - 1) {
            setUsersLimit(prev => {
                if (totalUsers > prev) {
                    dispatch(getUsers(prev + 20));
                    return prev + 20;
                };
                return prev;
            });
        }
    }

    useEffect(() => {
        dispatch(getUsers(usersLimit));
        return () => setUsersLimit(20);
    }, []);


    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        dispatch(getUsers(usersLimit));
    }, [onlineUsers]);

    return (
        <div id="users_container" >
            <div className="searchContainer">
                <div className="users__searcher">
                    <input
                        type="text"
                        value={searchText}
                        onChange={(ev) => setSearchText(ev.target.value)}
                        onKeyUp={searchHandler}
                    />
                    <Link to="users">
                        <SearchIcon className="users__inputButton" onClick={searchHandler} />
                    </Link>
                </div>
            </div>

            <Grid container >
                {users.map(user => <User user={user} onlineUsers={onlineUsers} />)}
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
        </div>
    )
}

export default Users
