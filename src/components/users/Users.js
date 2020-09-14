import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../redux/actions/usersActions';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import User from './User';
import ChatModal from '../chat/ChatModal';
import { Link } from 'react-router-dom';
import { CLEAR_MESSAGES, OPEN_CHAT_MODAL, CLEAR_CHAT_USER_DATA } from '../../redux/types';
import './Users.css';

const Users = () => {

    const { users } = useSelector(state => state.users);
    const { openChatModal } = useSelector(state => state.ui);
    const { chatUserData, userData, authenticated } = useSelector(state => state.user);
    const { socket } = useSelector(state => state.socket);

    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch();

    const onCloseChatModal = () => {
        dispatch({ type: OPEN_CHAT_MODAL, payload: false });
        dispatch({ type: CLEAR_MESSAGES });
        dispatch({ type: CLEAR_CHAT_USER_DATA });
    };

    useEffect(() => {
        dispatch(getUsers());
        return () => null;
    }, []);


    return (
        <Fragment>
            <div className="searchContainer">
                <div className="users__searcher">
                    <input type="text" value={searchText} onChange={(ev) => setSearchText(ev.target.value)} />
                    <Link to="users">
                        <SearchIcon className="users__inputButton" />
                    </Link>
                </div>
            </div>

            <Grid container>
                {
                    users.map(user => <User user={user} />)
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
        </Fragment>
    )
}

export default Users
