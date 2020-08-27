import * as fromTYPES from '../types';

const initialState = {
    posts: [],
    errors: null
}

export const postsReducer = (state = initialState, action) => {
    switch (action.type) {
        case fromTYPES.SET_POSTS:
            return {
                ...state,
                posts: [...action.payload]
            }
        case fromTYPES.GET_POSTS_FAILED:
            return {
                ...state,
                error: action.payload
            }

        case fromTYPES.REFRESH_SINGLE_POST:
            return {
                ...state,
                posts: [...state.posts.map(post => post._id === action.payload._id ? { ...action.payload } : post)]
            }

        default:
            return state;
    }
}