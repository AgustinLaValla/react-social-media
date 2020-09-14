import Cookie from 'js-cookie';
import axios from 'axios';
import { url, getHeaders } from '../../utils/utils';
import * as fromMESSAGES from '../types';

export const getMessages = (senderId, receiverId) => dispatch => {

    const token = Cookie.getJSON('token');

    axios.get(`${url}/messages/get-messages/${senderId}/${receiverId}`, getHeaders(token))
        .then(({ data }) => {
            if (data && data.messages[0]) {
                dispatch({ type: fromMESSAGES.SET_MESSAGES, payload: data.messages[0].messages });
            }
        })
        .catch(console.log);

}