import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../redux/actions/usersActions';

const Users = () => {

    const { users } = useSelector(state => state.users);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUsers());
        return () => null;
    }, []);

    return (
        <div>
        </div>
    )
}

export default Users
