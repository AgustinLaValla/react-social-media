import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { userReducer } from './reducers/userReducer';
import { uiReducer } from './reducers/uiReducer';
import { postsReducer } from './reducers/postsReducer';
import { socketReducer } from './reducers/socketReducer';

const initialState = {};

const rootReducer = combineReducers({
    user: userReducer,
    ui: uiReducer,
    posts: postsReducer,
    socket: socketReducer
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(rootReducer, initialState, composeEnhancer(applyMiddleware(thunk)));

export default store;