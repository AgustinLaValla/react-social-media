import * as fromTYPES from '../types';

const initialState = {
    messages: [],
    totalMessages: 0,
    error: null
};

export const messagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case fromTYPES.SET_MESSAGES:
            return {
                ...state,
                messages: [...action.payload.messages],
                totalMessages: action.payload.totalMessages
            }

        case fromTYPES.CLEAR_MESSAGES:
            return {
                ...state,
                messages: [],
                totalMessages: 0
            }

        default:
            return state;
    }
}