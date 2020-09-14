import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { userReducer } from './reducers/userReducer';
import { uiReducer } from './reducers/uiReducer';
import { postsReducer } from './reducers/postsReducer';
import { socketReducer } from './reducers/socketReducer';
import { messagesReducer } from './reducers/messagesReducer';
import { usersReducer } from './reducers/usersReducer';

const initialState = {};

const rootReducer = combineReducers({
    user: userReducer,
    users: usersReducer,
    ui: uiReducer,
    posts: postsReducer,
    socket: socketReducer,
    messages: messagesReducer
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(rootReducer, initialState, composeEnhancer(applyMiddleware(thunk)));

export default store;