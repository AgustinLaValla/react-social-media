import * as fromTYPES from '../types';

const initialState = {
    posts: [],
    visitedUserPosts: [],
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

        case fromTYPES.SET_VISITED_USER_POSTS:
            return {
                ...state,
                visitedUserPosts: [ ...action.payload ]
            }

        case fromTYPES.REFRESH_VISITED_USER_POST:
            return {
                ...state,
                visitedUserPosts: [...state.visitedUserPosts.map(post => post._id === action.payload._id ? { ...action.payload } : post )]
            }

        default:
            return state;
    }
}