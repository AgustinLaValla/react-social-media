import React, { Fragment, useEffect, useRef, useState } from 'react'
import { makeStyles, Paper, Typography, Tooltip, IconButton } from '@material-ui/core';
import MuiLink from '@material-ui/core/Link';
import { useSelector, useDispatch } from 'react-redux';
import { getUserImage } from '../../utils/utils';
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import * as dayjs from 'dayjs';
import * as fromTYPES from '../../redux/types';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { getStyles } from '../../utils/styles';
import { EditDetails } from './EditDetails';
import EditIcon from '@material-ui/icons/Edit';
import { ErrorMessageDialog } from '../layout/ErrorMessageDialog';
import { getUser, changeProfilePic, logout } from '../../redux/actions/userActions';
import { useGoogleLogout } from 'react-google-login';
import { clientId } from '../../utils/utils';

const useStyles = makeStyles(theme => getStyles(theme));

export const UserProfile = ({ user }) => {

    const classes = useStyles();

    const { userData, error } = useSelector(state => state.user);
    const { socket } = useSelector(state => state.socket);
    const { openEditUserDetailsDialog, openErrorsDialog } = useSelector(state => state.ui);

    const dispatch = useDispatch();

    const [isUserOwnProfile, setIsUserOwnProfile] = useState(false);
    const inputFile = useRef();

    const { signOut } = useGoogleLogout({ clientId });

    const handleLogout = () => userData.google ? dispatch(logout(signOut)) : dispatch(logout());

    const handleInputFileChange = (imageFile) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = () => dispatch(changeProfilePic(reader.result, socket, isUserOwnProfile));
    };


    useEffect(() => {
        if (user && userData && user._id === userData._id) {
            setIsUserOwnProfile(true);
        } else {
            setIsUserOwnProfile(false);
        }
        return () => null;
    }, [userData, user]);


    useEffect(() => {
        if (socket && isUserOwnProfile) {
            socket.on('refresh_visited_userData', () => dispatch(getUser(user._id)));
        }
        return () => socket ?
            socket.removeListener('refresh_visited_userData', () => dispatch(getUser(user._id)))
            : null;

    }, [socket, isUserOwnProfile, user]);


    return user && (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <Fragment>
                    {isUserOwnProfile
                        ?
                        <Tooltip title="Change profile pic" classes={{ tooltip: classes.tooltip }}>
                            <div className="image-wrapper">
                                <img
                                    className="profile-image"
                                    src={getUserImage(userData)}
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
                        :
                        <Tooltip title="Change profile pic" classes={{ tooltip: classes.tooltip }}>
                            <div className="image-wrapper">
                                <img
                                    className="profile-image"
                                    src={getUserImage(user)}
                                />
                            </div>

                        </Tooltip>
                    }
                </Fragment>
                <hr />
                <div className="profile-details">
                    <MuiLink
                        color="primary"
                        variant="h5"
                    >
                        {user.username}
                    </MuiLink>
                    {user.bio &&
                        <Typography align="left" variant="body2">{user.bio}</Typography>
                    }
                    <br />
                    {user.location &&
                        <Fragment>
                            <LocationOn color="primary" /> <span>{user.location}</span>
                        </Fragment>
                    }
                    <br />
                    {user.website &&
                        <Fragment>
                            <LinkIcon color="primary" />
                            <a
                                href={user.website}
                                target="__blank"
                                rel="noopener noreferrer"
                            >
                                {' '}{user.website}
                            </a>
                            <hr />
                        </Fragment>
                    }
                    <CalendarTodayIcon color="primary" />{' '}
                    <span>Joined from {dayjs(user.createdAt).format('MMM-YYYY')}</span>
                    <br />
                    {isUserOwnProfile &&
                        <Tooltip title="Edit details" classes={{ tooltip: classes.tooltip }}>
                            <IconButton onClick={() => dispatch({ type: fromTYPES.OPEN_USER_DETAILS_DIALOG, payload: true })}>
                                <EditIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    }
                    {isUserOwnProfile &&
                        <span
                            onClick={() => dispatch({ type: fromTYPES.OPEN_USER_DETAILS_DIALOG, payload: true })}
                            style={{ cursor: 'pointer' }}
                        >
                            Edit my details</span>
                    }
                    <br />
                    {isUserOwnProfile &&
                        <Fragment>
                            <Tooltip title="Logout" classes={{ tooltip: classes.tooltip }}>
                                <IconButton onClick={handleLogout} color="primary">
                                    <ExitToAppIcon fontSize="large" />
                                </IconButton>
                            </Tooltip>
                            <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
                        </Fragment>
                    }
                </div>
            </div>
            {isUserOwnProfile &&
                <Fragment>
                    <EditDetails
                        open={openEditUserDetailsDialog || false}
                        handleClose={() => dispatch({ type: fromTYPES.CLEAR_USER_ERRORS })}
                        bio={userData.bio ? userData.bio : null}
                        location={userData.location ? userData.location : null}
                        website={userData.website ? userData.website : null}
                        userId={userData._id ? userData._id : null}
                        close={() => dispatch({ type: fromTYPES.OPEN_USER_DETAILS_DIALOG, payload: false })}
                        socket={socket}
                        fromVisitedUser={true}
                    />
                    <ErrorMessageDialog
                        open={openErrorsDialog || false}
                        message={error}
                        onClose={() => dispatch({ type: fromTYPES.CLEAR_USER_ERRORS })}
                        closeDialog={() => dispatch({ type: fromTYPES.OPEN_ERRORS_DIALOG, payload: false })}
                    />
                </Fragment>
            }
        </Paper>
    )
}
