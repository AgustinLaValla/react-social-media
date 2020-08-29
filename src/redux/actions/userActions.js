import axios from 'axios';
import { url } from '../../utils/utils';
import Cookie from 'js-cookie';
import * as fromTYPES from '../types';
import { getHeaders } from '../../utils/utils';

export const login = (values, history) => async dispatch => {

    dispatch({ type: fromTYPES.SET_LOADING_USER });

    try {
        const { data } = await axios.post(`${url}/auth/login`, values)
        Cookie.set('token', JSON.stringify(data.token));
        Cookie.set('userData', JSON.stringify(data.user));
        dispatch({ type: fromTYPES.SET_AUTHENTICATED, payload: data.user });
        history.push('/');

    } catch (error) {
        dispatch({ type: fromTYPES.SET_USER_ERRORS, payload: error.response.data.message });
        dispatch({ type: fromTYPES.OPEN_ERRORS_DIALOG, payload: true });
    }
}

export const signup = (values, history) => async dispatch => {

    dispatch({ type: fromTYPES.SET_LOADING_USER });

    try {
        const { data } = await axios.post(`${url}/auth/register`, values);
        Cookie.set('token', JSON.stringify(data.token));
        Cookie.set('userData', JSON.stringify(data.user));
        dispatch({ type: fromTYPES.SET_AUTHENTICATED, payload: data.user });
        history.push('/');

    } catch (error) {
        dispatch({ type: fromTYPES.SET_USER_ERRORS, payload: error.response.data.message });
        dispatch({ type: fromTYPES.OPEN_ERRORS_DIALOG, payload: true });
    }
}

export const refreshUserData = (id) => async dispatch => {
    try {
        const token = Cookie.getJSON('token');
        const { data } = await axios.get(`${url}/user/${id}`, getHeaders(token));
        Cookie.set('userData', JSON.stringify(data.user));
        dispatch({ type: fromTYPES.SET_AUTHENTICATED, payload: data.user });
        dispatch({type:fromTYPES.DEACTIVATE_LINEAR_PROGRESS});
    } catch (error) {
        console.log(error);
        dispatch({type:fromTYPES.DEACTIVATE_LINEAR_PROGRESS});
    }
}

export const logout = () => async dispatch => {
    dispatch({ type: fromTYPES.SET_UNAUTHENTICATED });
    Cookie.remove('token');
}

export const addOrChangeUserDetails = (id, userDetails, socket) => async dispatch => {
    dispatch({type: fromTYPES.ACTIVATE_LINEAR_PROGRESS});
    const token = Cookie.getJSON('token');
    try {
        const { data } = await axios.put(`${url}/user/add-user-details/${id}`, userDetails, getHeaders(token));
        Cookie.set('userData', JSON.stringify(data.user));
        socket.emit('refresh_userData');
        dispatch({type:fromTYPES.SET_AUTHENTICATED, payload: data.user});
        dispatch({type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS});
    } catch (error) {
        dispatch({ type: fromTYPES.SET_USER_ERRORS, payload: error.response.data.message });
        dispatch({ type: fromTYPES.OPEN_ERRORS_DIALOG, payload: true });
    }
}