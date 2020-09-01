import React, { useEffect } from 'react';
import './index.css';
//router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//components
import { Home } from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Navbar } from './components/layout/Navbar';
import { User } from './pages/User';
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
import { SET_AUTHENTICATED, SET_UNAUTHENTICATED, SET_SOCKET_GLOBAL_OBJECT } from './redux/types';
//socket
import socketIOClient from "socket.io-client";

const theme = createMuiTheme(appTheme);

const token = Cookie.get('token');

if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 100 < Date.now()) {
    const userData = getUserData(); 
    store.dispatch({ type: SET_AUTHENTICATED, payload: userData })
  } else {
    store.dispatch({ type: SET_UNAUTHENTICATED });
  }
}

function App() {
  
  const { authenticated } = useSelector(state => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (authenticated) {
      const socket = socketIOClient('http://127.0.0.1:4000');
      dispatch({ type: SET_SOCKET_GLOBAL_OBJECT, payload: socket });
    }
  }, [authenticated]);

  return (
    <div className="App">
      <Router>
        <ThemeProvider theme={theme}>
          <Navbar />
          <Switch>
            <div className="container">
              <Route exact path='/' component={Home} />
              <Route exact path='/login' component={Login}  />
              <Route exact path='/signup' component={Signup}  />
              <AuthRoute exact path="/user/:id" component={User} authenticated={authenticated}/>
              <AuthRoute exact path="/user/:id/post/:postId" component={User} authenticated={authenticated}/>
            </div>
          </Switch>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
