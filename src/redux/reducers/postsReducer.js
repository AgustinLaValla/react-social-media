import * as fromTYPES from '../types';

const initialState = {
    posts: [],
    postsLimit: 0,
    totalPosts: 0,
    visitedUserPosts: [],
    totalVisitedPosts: 0,
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
                visitedUserPosts: [...action.payload]
            }

        case fromTYPES.REFRESH_VISITED_USER_POST:
            return {
                ...state,
                visitedUserPosts: [...state.visitedUserPosts.map(post => post._id === action.payload._id ? { ...action.payload } : post)]
            }

        case fromTYPES.SET_POSTS_LIMIT:
            return {
                ...state,
                postsLimit: action.payload
            }

        case fromTYPES.SET_TOTAL_POSTS:
            return {
                ...state,
                totalPosts: action.payload
            }

        case fromTYPES.SET_TOTAL_VISITED_USER_POSTS:
            return {
                ...state,
                totalVisitedPosts: action.payload
            }

        case fromTYPES.CLEAR_VISITED_USER_DATA:
            return {
                ...state,
                visitedUserPosts: [],
               totalVisitedPosts: 0
            }

        default:
            return state;
    }
}