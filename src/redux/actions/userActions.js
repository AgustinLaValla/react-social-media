import axios from 'axios';
import { url } from '../../utils/utils';
import Cookie from 'js-cookie';
import * as fromTYPES from '../types';
import { getHeaders, saveUserData } from '../../utils/utils';

export const login = (values, history) => dispatch => {

    dispatch({ type: fromTYPES.SET_LOADING_USER });
    let resp;
    axios.post(`${url}/auth/login`, values)
        .then(({ data }) => resp = data)
        .then(() => Cookie.set('token', JSON.stringify(resp.token)))
        .then(() => saveUserData(resp.user))
        .then(() => dispatch({ type: fromTYPES.SET_AUTHENTICATED, payload: resp.user }))
        .then(() => history.push('/'))
        .catch(error => {
            dispatch({ type: fromTYPES.SET_USER_ERRORS, payload: error.response.data.message });
            dispatch({ type: fromTYPES.OPEN_ERRORS_DIALOG, payload: true });
        });

}
export const googleLogin = (token, history) => async dispatch => {
    try {
        const { data } = await axios.post(`${url}/auth/google`, { token });
        Cookie.set('token', JSON.stringify(data.token));
        saveUserData(data.user);
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
        saveUserData(data.user);
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
        saveUserData(data.user)
        dispatch({ type: fromTYPES.SET_AUTHENTICATED, payload: data.user });
        dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });
    } catch (error) {
        dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });
    }
}

export const logout = (googleSignout) => async dispatch => {
    dispatch({ type: fromTYPES.SET_UNAUTHENTICATED });
    Cookie.remove('token');
    localStorage.clear();
    if (googleSignout) {
        setTimeout(() => googleSignout(), 3500);
    }
}

export const addOrChangeUserDetails = (id, userDetails, socket, refreshVisitedUserProfile = false) => async dispatch => {
    dispatch({ type: fromTYPES.ACTIVATE_LINEAR_PROGRESS });
    const token = Cookie.getJSON('token');
    try {
        const { data } = await axios.put(`${url}/user/add-user-details/${id}`, userDetails, getHeaders(token));
        saveUserData(data.user)
        socket.emit('refresh_userData', { currentUserId: id });
        if (refreshVisitedUserProfile) {
            socket.emit('refresh_visited_userData', { visitedUserId: id });
        };
        dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });
    } catch (error) {
        dispatch({ type: fromTYPES.SET_USER_ERRORS, payload: error?.response?.data?.message });
        dispatch({ type: fromTYPES.OPEN_ERRORS_DIALOG, payload: true });
    }
}

export const getUser = (userId, chatUser = false) => async dispatch => {
    dispatch({ type: fromTYPES.ACTIVATE_LINEAR_PROGRESS });
    const token = Cookie.getJSON('token');
    try {
        const { data } = await axios.get(`${url}/user/${userId}`, getHeaders(token));
        if (!chatUser) {
            dispatch({ type: fromTYPES.SET_VISITED_USER, payload: data.user });
        } else {
            dispatch({ type: fromTYPES.SET_CHAT_USER_DATA, payload: data.user });
        }
        dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });

    } catch (error) {
        dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });
        dispatch({ type: fromTYPES.SET_VISITED_USER_ERRORS, payload: error?.response?.data?.message })
    }
};


export const changeProfilePic = (userId, image, socket, refreshVisitedUserProfile = false) => async dispatch => {
    const token = Cookie.getJSON('token');
    dispatch({ type: fromTYPES.ACTIVATE_LINEAR_PROGRESS });
    try {
        await axios.put(`${url}/images/change-profile-image`, { image }, getHeaders(token));
        socket.emit('refresh_userData', { currentUserId: userId });
        if (refreshVisitedUserProfile) {
            socket.emit('refresh_visited_userData', { visitedUserId: userId });
        }

    } catch (error) {
    }
}
