import React, { Fragment, useState } from 'react';
import { AppBar, Toolbar, Button, LinearProgress, makeStyles, Tooltip, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { getStyles } from '../../utils/styles';
import { useSelector } from 'react-redux';
import MyButton from './MyButton';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { AddPost } from '../post/AddPost';
import { Notifications } from './Notifications';

const useStyles = makeStyles(theme => getStyles(theme));

export const Navbar = () => {

    const [openAddPostDialog, setOpenAddPostDialog] = useState()

    const classes = useStyles();

    const { activateLinearProgress } = useSelector(state => state.ui);
    const { authenticated } = useSelector(state => state.user);

    return (
        <AppBar position="sticky" className={classes.appbar}>
            <Toolbar className="nav-container">
                {authenticated
                    ?
                    <Fragment>

                        <MyButton
                            tipTitle="Share a post"
                            tipClassName={classes.tooltip}
                            onClick={() => setOpenAddPostDialog(true)}
                        >
                            <AddIcon color="primary" />
                        </MyButton>

                        <Link>

                            <Tooltip title="Home" className={classes.tooltip}>
                                <IconButton  component={Link} to='/'>
                                    <HomeIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                        </Link>

                        <Notifications/>

                    </Fragment>
                    :
                    <Fragment>
                        <Button component={Link} to='/login' color="inherit">Login</Button>
                        <Button component={Link} to='/' color="inherit">Home</Button>
                        <Button component={Link} to='/signup' color="inherit">Signup</Button>
                    </Fragment>

                }
            </Toolbar>
            {activateLinearProgress && <LinearProgress color="secondary" className={classes.linearProgress} />}
            <AddPost open={openAddPostDialog} handleClose={() => setOpenAddPostDialog(false)} />
        </AppBar>
    )
}
