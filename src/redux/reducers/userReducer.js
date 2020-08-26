import * as fromTYPES from '../types';

const initialState = {
    authenticated: false,
    userData: null,
    error: null
}

export function userReducer(state = initialState, action) {
    switch (action.type) {

        case fromTYPES.SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            }

        case fromTYPES.SET_UNAUTHENTICATED:
            return {
                ...state,
                authenticated: false
            }

        case fromTYPES.SET_USER:
            return {
                ...state,
                userData: { ...action.payload }
            }

        case fromTYPES.LOGIN_USER_FAILED:
            return {
                ...state,
                error: action.payload
            }

        case fromTYPES.CLEAR_AUTH_ERRORS:
            return {
                ...state,
                error: null
            }

        default: return state;

    }
}