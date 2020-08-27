import React, { Fragment } from 'react';
import { AppBar, Toolbar, Button, LinearProgress, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { getStyles } from '../utils/styles';
import { useSelector } from 'react-redux';
import MyButton from './MyButton';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';

const useStyles = makeStyles(theme => getStyles(theme));

export const Navbar = () => {

    const classes = useStyles();

    const { activateLinearProgress } = useSelector(state => state.ui);
    const { authenticated } = useSelector(state => state.user);

    return (
        <AppBar position="sticky">
            <Toolbar className="nav-container">
                {authenticated
                    ?
                    <Fragment>

                        <MyButton
                            tipTitle="Share a post"
                            tipClassName={classes.tooltip}
                        >
                            <AddIcon color="primary" />
                        </MyButton>

                        <Link>
                            <MyButton
                                tipTitle="Home"
                                tipClassName={classes.tooltip}
                            >
                                <HomeIcon color="primary" />
                            </MyButton>
                        </Link>

                        <MyButton
                            tipTitle="Notifications"
                            tipClassName={classes.tooltip}
                        >
                            <NotificationsIcon color="primary" />
                        </MyButton>

                    </Fragment>
                    :
                    <Fragment>
                        <Button component={Link} to='/login' color="inherit">Login</Button>
                        <Button component={Link} to='/' color="inherit">Home</Button>
                        <Button component={Link} to='/signup' color="inherit">Signup</Button>
                    </Fragment>

                }
                {activateLinearProgress && <LinearProgress className={classes.linearProgress} />}
            </Toolbar>
        </AppBar>
    )
}
