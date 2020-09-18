import React, { useEffect } from 'react';
import './index.css';
//router
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
//components
import { Home } from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Navbar } from './components/layout/Navbar';
import { User } from './pages/User';
import Users from './pages/Users';
//protected route component
import AuthRoute from './utils/AuthRoute';
//material-ui
import { createMuiTheme } from '@material-ui/core';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { appTheme, getUserData } from './utils/utils';
//cookie
import Cookie from 'js-cookie';
//jwt-decode
import jwtDecode from 'jwt-decode';
//redux
import store from './redux/store';
import { useSelector, useDispatch } from 'react-redux';
//actions
import { SET_AUTHENTICATED, SET_UNAUTHENTICATED, SET_SOCKET_GLOBAL_OBJECT, SET_ONLINE_USERS, SET_POSTS_LIMIT } from './redux/types';
//socket
import socketIOClient from "socket.io-client";
import { refreshSinglePost, refreshVisitedUserPost, getPosts } from './redux/actions/postsActions';
import { refreshUserData } from './redux/actions/userActions';


const theme = createMuiTheme(appTheme);

function App() {

  const { authenticated, userData } = useSelector(state => state.user);
  const { socket } = useSelector(state => state.socket);
  const { postsLimit } = useSelector(state => state.posts);

  const dispatch = useDispatch();

  const serverUrl = process.env.REACT_APP_SERVER_URI;

  const postsHandler = async () => {
    await dispatch(getPosts(postsLimit + 1));
    await dispatch({ type: SET_POSTS_LIMIT, payload: postsLimit + 1 });
  }

  useEffect(() => {
    const token = Cookie.get('token');

    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 100 < Date.now()) {
        const userData = getUserData();
        store.dispatch({ type: SET_AUTHENTICATED, payload: userData });
      } else {
        store.dispatch({ type: SET_UNAUTHENTICATED });
      }
    }
    return () => { };
  }, [])


  useEffect(() => {
    if (authenticated) {
      const newSocket = socketIOClient(`${serverUrl}`);
      // const newSocket = socketIOClient('http://localhost:4000');
      dispatch({ type: SET_SOCKET_GLOBAL_OBJECT, payload: newSocket });
      newSocket.emit('online', { username: userData.username, userId: userData._id });
      newSocket.emit('set_private_room', { userId: userData._id });
      newSocket.emit('refresh_userData', { currentUserId: userData._id });
    }

    if (!authenticated && (socket !== null && socket !== undefined)) {
      socket.emit('logout');
      socket.off();
    }

    return () => {
      if (socket) {
        socket.emit('disconnect');
        socket.off();
      }
    };
  }, [authenticated]);

  useEffect(() => {
    if (socket) {
      socket.on('refresh_userData', () => dispatch(refreshUserData(userData._id)));
      socket.on('refresh_single_post', ({ postId }) => dispatch(refreshSinglePost(postId)));
      socket.on('refresh_userVisited_post', ({ postId }) => dispatch(refreshVisitedUserPost(postId)));
      socket.on('refresh_posts', () => postsHandler());
      socket.on('usersOnline', ({ onlineUsers }) => dispatch({ type: SET_ONLINE_USERS, payload: onlineUsers }));
    }
    return () => {
      if (socket) {
        socket.removeListener('refresh_userData', () => dispatch(refreshUserData(userData._id)));
        socket.removeListener('refresh_single_post', ({ postId }) => dispatch(refreshSinglePost(postId)));
        socket.removeListener('refresh_userVisited_post', ({ postId }) => dispatch(refreshVisitedUserPost(postId)));
        socket.removeListener('refresh_posts', () => postsHandler());
        socket.removeListener('usersOnline', ({ onlineUsers }) => dispatch({ type: SET_ONLINE_USERS, payload: onlineUsers }))
      }
    }
  }, [socket]);


  return (
    <div className="App">
      <Router>
        <ThemeProvider theme={theme}>
          <Navbar />
          <Switch>
            <div className="container">
              <Route exact path='/' component={Home} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/signup' component={Signup} />
              <Route exact path="/users" component={Users} />
              <AuthRoute exact path="/user/:id" component={User} authenticated={authenticated} />
              <AuthRoute exact path="/user/:id/post/:postId" component={User} authenticated={authenticated} />
              <Redirect to="/" />
            </div>
          </Switch>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
