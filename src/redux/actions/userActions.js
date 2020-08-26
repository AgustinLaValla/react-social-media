import axios from 'axios';
import { url } from '../../utils/utils';
import Cookie from 'js-cookie';
import * as fromTYPES from '../types';

export const login = (values, history) => async dispatch => {

    dispatch({ type: fromTYPES.LOADING_UI, payload: true });

    try {
        const { data } = await axios.post(`${url}/auth/login`, values)
        Cookie.set('token', JSON.stringify(data.token));
        dispatch({ type: fromTYPES.SET_USER, payload: data.user });
        dispatch({ type: fromTYPES.SET_AUTHENTICATED });
        history.push('/');
        dispatch({ type: fromTYPES.LOADING_UI, payload: false });

    } catch (error) {
        dispatch({ type: fromTYPES.LOADING_UI, payload: false });
        dispatch({ type: fromTYPES.LOGIN_USER_FAILED, payload: error.response.data.message });
        dispatch({ type: fromTYPES.OPEN_ERRORS_DIALOG, payload: true });
    }
}

export const signup = (values, history) => async dispatch => {

    dispatch({ type: fromTYPES.LOADING_UI, payload: true });

    try {
        const { data } = await axios.post(`${url}/auth/register`, values);
        Cookie.set('token', JSON.stringify(data.token));
        dispatch({ type: fromTYPES.SET_USER, payload: data.user });
        dispatch({ type: fromTYPES.SET_AUTHENTICATED });
        history.push('/');
        dispatch({ type: fromTYPES.LOADING_UI, payload: false });

    } catch (error) {
        dispatch({ type: fromTYPES.LOADING_UI, payload: false });
        dispatch({ type: fromTYPES.LOGIN_USER_FAILED, payload: error.response.data.message });
        dispatch({ type: fromTYPES.OPEN_ERRORS_DIALOG, payload: true });
    }
}