import Cookie from 'js-cookie';
import { url, getHeaders } from '../../utils/utils';
import axios from 'axios';
import { SET_USERS } from '../types';

export const getUsers = () => dispatch => {
    const token = Cookie.getJSON('token');
    axios.get(`${url}/user`, getHeaders(token))
        .then(({ data }) => dispatch({ type: SET_USERS, payload: data.users }))
        .catch(console.log);
};