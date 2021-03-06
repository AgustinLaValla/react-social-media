import React from 'react'
import { Route, Redirect } from 'react-router-dom';

export default ({ component: Component, authenticated, ...rest }) => (
    <Route
        {...rest}
        render={() => !authenticated ? <Redirect to='/login' /> : <Component {...rest} />}
    />
)
