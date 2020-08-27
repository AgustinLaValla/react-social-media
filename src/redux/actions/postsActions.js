import axios from 'axios';
import * as fromTYPES from '../types';
import { url, getHeaders } from '../../utils/utils';
import Cookie from 'js-cookie';

export const getPosts = (token) => async dispatch => {
    dispatch({ type: fromTYPES.LOADING_UI, payload: true });
    try {
        const { data } = await axios.get(`${url}/posts`, getHeaders(token));
        dispatch({ type: fromTYPES.SET_POSTS, payload: data.posts });
        dispatch({ type: fromTYPES.LOADING_UI, payload: false });
    } catch (error) {
        dispatch({ type: fromTYPES.GET_POSTS_FAILED, payload: error.response.data.message })
        dispatch({ type: fromTYPES.LOADING_UI, payload: false });
    }
}


export const getSinglePost = (postId) => async dispatch => {
    dispatch({type: fromTYPES.ACTIVATE_LINEAR_PROGRESS});
    try {
        const token = Cookie.getJSON('token');
        const { data } = await axios.get(`${url}/posts/${postId}`, getHeaders(token));
        dispatch({ type: fromTYPES.REFRESH_SINGLE_POST, payload: data.post });
        dispatch({type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS});
    } catch (error) {
        dispatch({ type: fromTYPES.GET_POSTS_FAILED, payload: error.response.data.message });
        dispatch({type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS});
    }
};

