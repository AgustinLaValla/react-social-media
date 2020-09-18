import axios from 'axios';
import * as fromTYPES from '../types';
import { url, getHeaders } from '../../utils/utils';
import Cookie from 'js-cookie';

export const getPosts = (limit) => async dispatch => {
    dispatch({ type: fromTYPES.LOADING_UI, payload: true });
    try {
        const { data } = await axios.get(`${url}/posts?limit=${limit}`);
        dispatch({ type: fromTYPES.SET_POSTS, payload: data.posts });
        dispatch({ type: fromTYPES.LOADING_UI, payload: false });
        dispatch({type: fromTYPES.SET_TOTAL_POSTS, payload: data.total});
    } catch (error) {
        dispatch({ type: fromTYPES.GET_POSTS_FAILED, payload: error.response?.data.message })
        dispatch({ type: fromTYPES.LOADING_UI, payload: false });
    }
}


export const refreshSinglePost = (postId) => async dispatch => {
    try {
        const token = Cookie.getJSON('token');
        const { data } = await axios.get(`${url}/posts/${postId}`, getHeaders(token));
        dispatch({ type: fromTYPES.REFRESH_SINGLE_POST, payload: data.post });
    } catch (error) {
        dispatch({ type: fromTYPES.GET_POSTS_FAILED, payload: error.response.data.message });
    }
};

export const refreshVisitedUserPost = postId => async dispatch => {
    try {
        const token = Cookie.getJSON('token');
        const { data } = await axios.get(`${url}/posts/${postId}`, getHeaders(token));
        dispatch({ type: fromTYPES.REFRESH_VISITED_USER_POST, payload: data.post });
    } catch (error) {
    }
}

export const addPost = (post, token, socket) => async dispatch => {
    dispatch({ type: fromTYPES.ACTIVATE_LINEAR_PROGRESS });
    try {
        await axios.post(`${url}/posts/add-post`, post, getHeaders(token));
        socket.emit('refresh_posts');
        dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });
    } catch (error) {
        dispatch({ type: fromTYPES.GET_POSTS_FAILED, payload: error.response.data.message });
        dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });
    }
};

export const addComment = (postId, userId, comment, socket, fromVisitedUser, userProfileRoom) => async dispatch => {
    dispatch({ type: fromTYPES.ACTIVATE_LINEAR_PROGRESS });
    try {
        const token = Cookie.getJSON('token');
        await axios.put(`${url}/posts/add-comment/${postId}/${userId}`, { comment }, getHeaders(token));
        await socket.emit('refresh_single_post', { postId });
        socket.emit('refresh_userData', { visitedUserId: userId });
        if (fromVisitedUser) {
            socket.emit('refresh_userVisited_post', { postId, userProfileRoom });
        }
        dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });
    } catch (error) {
        dispatch({ type: fromTYPES.GET_POSTS_FAILED, payload: error.response.data.message });
        dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });
    }
}

export const getUserPost = userId => async dispatch => {
    const token = Cookie.getJSON('token');
    axios.get(`${url}/posts/get_user_posts/${userId}`, getHeaders(token))
        .then(({ data }) => dispatch({ type: fromTYPES.SET_VISITED_USER_POSTS, payload: data.posts }))
}