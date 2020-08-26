import React from 'react';
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

const theme = createMuiTheme(appTheme);

const token = Cookie.get('token');
let authenticated;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 100 < Date.now()) {
    authenticated = true;
  } else {
    authenticated = false;
  }
}

function App() {
  return (
    <div className="App">
      <Router>
        <ThemeProvider theme={theme}>
          <Navbar />
          <Switch>
            <div className="container">
              <Route exact path='/' component={Home} />
              <AuthRoute exact path='/login' component={Login}  authenticated={false}/>
              <AuthRoute exact path='/signup' component={Signup}  authenticated={false}/>
            </div>
          </Switch>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
