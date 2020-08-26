import React from 'react';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';


export const Navbar = () => {

    return (
        <AppBar position="sticky">
            <Toolbar className="nav-container">
                <Button component={Link} to='/login' color="inherit">Login</Button>
                <Button component={Link} to='/' color="inherit">Home</Button>
                <Button component={Link} to='/signup' color="inherit">Signup</Button>
            </Toolbar>

        </AppBar>
    )
}
