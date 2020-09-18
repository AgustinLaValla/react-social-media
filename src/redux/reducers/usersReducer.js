import { SET_ONLINE_USERS, SET_USERS } from "../types"


const initialState = {
    users: [],
    totalUsers: 0,
    onlineUsers: [],
    error: null
}

export const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USERS:
            return {
                ...state,
                users: [...action.payload.users],
                totalUsers: action.payload.total
            }

        case SET_ONLINE_USERS:
            return {
                ...state,
                onlineUsers: [ ...action.payload ]
            }

        default:
            return state;
    }
}