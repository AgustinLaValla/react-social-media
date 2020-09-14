import * as fromTYPES from '../types';

const initialState = {
    messages: [],
    error: null
};

export const messagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case fromTYPES.SET_MESSAGES:
            return {
                ...state,
                messages: [...action.payload]
            }

        case fromTYPES.CLEAR_MESSAGES:
            return {
                ...state,
                messages: []
            }

        default:
            return state;
    }
}