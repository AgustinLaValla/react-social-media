import Cookie from 'js-cookie';
import { url, getHeaders } from '../../utils/utils';
import axios from 'axios';
import { ACTIVATE_LINEAR_PROGRESS, DEACTIVATE_LINEAR_PROGRESS, SET_USERS } from '../types';

export const getUsers = (limit) => dispatch => {
    const token = Cookie.getJSON('token');
    dispatch({ type: ACTIVATE_LINEAR_PROGRESS });
    axios.get(`${url}/user?limit=${limit}`, getHeaders(token))
        .then(({ data }) => dispatch({ type: SET_USERS, payload: data }))
        .then(() => dispatch({ type: DEACTIVATE_LINEAR_PROGRESS }))
        .catch(console.log);
};

export const searchUsers = (search) => dispatch => {
    const token = Cookie.getJSON('token');
    dispatch({ type: ACTIVATE_LINEAR_PROGRESS });
    axios.get(`${url}/user/search/${search}`, getHeaders(token))
        .then(({ data }) => dispatch({ type: SET_USERS, payload: data }))
        .then(() => dispatch({ type: DEACTIVATE_LINEAR_PROGRESS }))
        .catch(console.log)
}