import * as fromTYPES from '../types';

const initialState = {
    authenticated: false,
    userData: null,
    visitedUserData: null,
    loading: false,
    error: null
}

export function userReducer(state = initialState, action) {
    switch (action.type) {

        case fromTYPES.SET_LOADING_USER:
            return {
                ...state,
                loading: true
            }

        case fromTYPES.SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true,
                userData: { ...action.payload },
                loading: false
            }

        case fromTYPES.SET_UNAUTHENTICATED:
            return {
                ...state,
                authenticated: false,
                userData: null,
                loading: false
            }


        case fromTYPES.SET_USER_ERRORS:
            return {
                ...state,
                error: action.payload,
                loading: false
            }

        case fromTYPES.CLEAR_USER_ERRORS:
            return {
                ...state,
                error: null
            }

        case fromTYPES.SET_VISITED_USER:
            return {
                ...state,
                visitedUserData: { ...action.payload }
            }

        case fromTYPES.MARK_NOTIFICATION_AS_READ:

            return {
                ...state,
                userData: {
                    ...state.userData,
                    notifications: state.userData.notifications.postNotifications.map(notification =>
                        notification._id === action.payload ? { ...notification, read: true } : notification
                    )
                }
            }

        default: return state;

    }
}