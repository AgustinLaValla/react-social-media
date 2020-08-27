import * as fromTYPES from '../types';

const initialState = {
    authenticated: false,
    userData: null,
    loading:false,
    error: null
}

export function userReducer(state = initialState, action) {
    switch (action.type) {

        case fromTYPES.SET_LOADING_USER:
            return {
                ...state,
                loading:true
            }

        case fromTYPES.SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true,
                userData: { ...action.payload },
                loading:false
            }

        case fromTYPES.SET_UNAUTHENTICATED:
            return {
                ...state,
                authenticated: false,
                userData: null,
                loading:false
            }


        case fromTYPES.SET_USER_ERRORS:
            return {
                ...state,
                error: action.payload,
                loading:false
            }

        case fromTYPES.CLEAR_USER_ERRORS:
            return {
                ...state,
                error: null
            }

        default: return state;

    }
}