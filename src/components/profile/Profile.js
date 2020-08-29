import React, { Fragment, useEffect, useRef } from 'react'
import { makeStyles, Button, Paper, Typography, Tooltip, IconButton } from '@material-ui/core';
import MuiLink from '@material-ui/core/Link';
import { useSelector, useDispatch } from 'react-redux';
import { getImageUrl } from '../../utils/utils';
import { Link } from 'react-router-dom';
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import * as dayjs from 'dayjs';
import axios from 'axios';
import { url, getHeaders } from '../../utils/utils';
import Cookie from 'js-cookie';
import * as fromTYPES from '../../redux/types';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { logout } from '../../redux/actions/userActions';
import { refreshUserData } from '../../redux/actions/userActions';
import { getStyles } from '../../utils/styles';
import { EditDetails } from './EditDetails';
import EditIcon from '@material-ui/icons/Edit';
import { ErrorMessageDialog } from '../layout/ErrorMessageDialog';

const useStyles = makeStyles(theme => getStyles(theme));

export const Profile = () => {
    const classes = useStyles();
    const { userData, error } = useSelector(state => state.user);
    const { loading, openEditUserDetailsDialog, openErrorsDialog } = useSelector(state => state.ui);
    const { socket } = useSelector(state => state.socket);
    const dispatch = useDispatch();
    const inputFile = useRef();


    const uploadImage = async (image) => {
        const token = Cookie.getJSON('token');
        dispatch({ type: fromTYPES.ACTIVATE_LINEAR_PROGRESS });
        try {
            await axios.put(`${url}/images/change-profile-image`, { image }, getHeaders(token));
            socket.emit('refresh_userData');

        } catch (error) {
            console.log(error);
        }
    }

    const handleInputFileChange = (imageFile) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = () => uploadImage(reader.result);
    };

    useEffect(() => {
        if (socket) {
            socket.on('refresh_userData', () => dispatch(refreshUserData(userData._id)));
        }
    }, [socket]);


    return (
        <div>
            {loading && <p>Loading...</p>}
            {userData &&
                <Paper className={classes.paper}>
                    <div className={classes.profile}>
                        <Tooltip title="Change profile pic" classes={{ tooltip: classes.tooltip }}>
                            <div className="image-wrapper">
                                <img
                                    className="profile-image"
                                    src={getImageUrl(userData.picVersion, userData.picId)}
                                    onClick={() => inputFile.current.click()}
                                />
                                <input
                                    type="file"
                                    id="imageUploader"
                                    onChange={ev => handleInputFileChange(ev.target.files[0])}
                                    hidden
                                    ref={inputFile}
                                />
                            </div>

                        </Tooltip>
                        <hr />
                        <div className="profile-details">
                            <MuiLink
                                component={Link}
                                to={`/users/${userData._id}`}
                                color="primary"
                                variant="h5"
                            >
                                @{userData.username}
                            </MuiLink>
                            {userData.bio &&
                                <Typography align="left" variant="body2">{userData.bio}</Typography>
                            }
                            <br />
                            {userData.location &&
                                <Fragment>
                                    <LocationOn color="primary" /> <span>{userData.location}</span>
                                </Fragment>
                            }
                            <br/>
                            {userData.website &&
                                <Fragment>
                                    <LinkIcon color="primary" />
                                    <a
                                        href={userData.website}
                                        target="__blank"
                                        rel="noopener noreferrer"
                                    >
                                        {' '}{userData.website}
                                    </a>
                                    <hr />
                                </Fragment>
                            }
                            <CalendarTodayIcon color="primary" />{' '}
                            <span>Joined from {dayjs(userData.createdAt).format('MMM-YYYY')}</span>
                            <br />
                            <Tooltip title="Logout" classes={{ tooltip: classes.tooltip }}>
                                <IconButton >
                                    <EditIcon
                                        onClick={() => dispatch({ type: fromTYPES.OPEN_USER_DETAILS_DIALOG, payload: true })}
                                        color="primary"
                                    />
                                </IconButton>
                            </Tooltip>
                            <span
                                onClick={() => dispatch({ type: fromTYPES.OPEN_USER_DETAILS_DIALOG, payload: true })}
                                style={{ cursor: 'pointer' }}
                            >
                                Edit my details</span>
                            <br />
                            <Tooltip title="Logout" classes={{ tooltip: classes.tooltip }}>
                                <IconButton >
                                    <ExitToAppIcon fontSize="large" onClick={() => dispatch(logout())} color="primary" />
                                </IconButton>
                            </Tooltip>
                            <span onClick={() => dispatch(logout())} style={{ cursor: 'pointer' }}>Logout</span>
                        </div>
                    </div>
                </Paper>
            }
            {!userData &&
                <Paper className={classes.paper}>
                    <Typography variant="body2" align="center">
                        No profile found, please login again.
                    </Typography>
                    <div className={classes.buttons}>
                        <Button variant="contained" color="primary" component={Link} to='/login'>Login</Button>
                        <Button variant="contained" color="primary" component={Link} to='/signup'>Signup</Button>
                    </div>
                </Paper>
            }
            {userData &&
                <EditDetails
                    open={openEditUserDetailsDialog}
                    handleClose={() => dispatch({ type: fromTYPES.CLEAR_USER_ERRORS })}
                    bio={userData.bio ? userData.bio : null}
                    location={userData.location ? userData.location : null}
                    website={userData.website ? userData.website : null}
                    userId={userData._id ? userData._id : null}
                    close={() => dispatch({ type: fromTYPES.OPEN_USER_DETAILS_DIALOG, payload: false })}
                    return
                />}
            <ErrorMessageDialog
                open={openErrorsDialog}
                message={error}
                onClose={() => dispatch({ type: fromTYPES.CLEAR_USER_ERRORS })}
                closeDialog={() => dispatch({ type: fromTYPES.OPEN_ERRORS_DIALOG, payload: false })}
            />
        </div>
    )
}
