import Cookie from 'js-cookie';
import axios from 'axios';
import { url, getHeaders } from '../../utils/utils';
import * as fromTYPES from '../types';

export const getMessages = (senderId, receiverId, limit) => async dispatch => {

    const token = Cookie.getJSON('token');

    try {

        const { data } = await axios.get(`${url}/messages/get-messages/${senderId}/${receiverId}?limit=${limit}`, getHeaders(token))
        if (data && data.messages[0]) {
            await localStorage.setItem('totalMessages', JSON.stringify(data.messages[0].totalMessages));
            await localStorage.setItem('messagesLength', JSON.stringify(data.messages[0].messages.length));
            await dispatch({ type: fromTYPES.SET_MESSAGES, payload: data.messages[0] });
        }
    } catch (error) {

    }



}