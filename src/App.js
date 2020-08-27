import React, { useEffect } from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Home } from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Navbar } from './components/Navbar';
import { createMuiTheme } from '@material-ui/core';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { appTheme } from './utils/utils';
import Cookie from 'js-cookie';
import jwtDecode from 'jwt-decode';
import AuthRoute from './utils/AuthRoute';
import store from './redux/store';
import { SET_AUTHENTICATED, SET_UNAUTHENTICATED, SET_SOCKET_GLOBAL_OBJECT } from './redux/types';
import { useSelector, useDispatch } from 'react-redux';
import socketIOClient from "socket.io-client";

const theme = createMuiTheme(appTheme);

const token = Cookie.get('token');
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 100 < Date.now()) {
    const userData = Cookie.getJSON('userData');
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
              <AuthRoute exact path='/login' component={Login} authenticated={authenticated} />
              <AuthRoute exact path='/signup' component={Signup} authenticated={authenticated} />
            </div>
          </Switch>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
