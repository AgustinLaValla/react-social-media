import * as fromTYPES from '../types';

const initialState = {
    socket: null
}

export const socketReducer = (state = initialState, action) => {
    switch (action.type) {
        case fromTYPES.SET_SOCKET_GLOBAL_OBJECT:
            return {
                ...state,
                socket: action.payload
            }

        default:
            return state;
    }
}