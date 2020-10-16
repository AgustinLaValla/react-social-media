import React, { Fragment, useEffect, useRef, useState } from 'react'
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import makeStyles from '@material-ui/core/styles/makeStyles'
import MuiLink from '@material-ui/core/Link';
import LocationOn from '@material-ui/icons/LocationOn';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LinkIcon from '@material-ui/icons/Link';
import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';
import EditDetails from '../../components/profile/EditDetails';
import ErrorMessageDialog from '../../components/layout/ErrorMessageDialog';
import { useSelector, useDispatch } from 'react-redux';
import { getUserImage } from '../../utils/utils';
import { getStyles } from '../../utils/styles';
import * as fromTYPES from '../../redux/types';
import { getUser, changeProfilePic, logout } from '../../redux/actions/userActions';
import * as dayjs from 'dayjs';
import { useGoogleLogout } from 'react-google-login';
import { clientId } from '../../utils/utils';


const useStyles = makeStyles(theme => getStyles(theme));

const UserProfile = ({ user, totalPosts }) => {

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
        reader.onloadend = () => dispatch(changeProfilePic(userData._id, reader.result, socket, isUserOwnProfile));
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
                <Box className="profile-details">

                    <Box style={{ marginBottom: 15 }}>
                        <MuiLink
                            color="primary"
                            variant="h5"
                        >
                            {user.username}
                        </MuiLink>
                    </Box>

                    <Box style={{ marginBottom: 15 }}>
                        {user.bio &&
                            <Typography align="left" variant="body2">{user.bio}</Typography>
                        }
                    </Box>

                    {user.location &&
                        <Box style={{ marginBottom: 15 }}>
                            <LocationOn color="primary" /> <span>{user.location}</span>
                        </Box>
                    }

                    {user.website &&
                        <Box style={{ marginBottom: 15 }}>
                            <LinkIcon color="primary" />
                            <a
                                href={user.website}
                                target="__blank"
                                rel="noopener noreferrer"
                            >
                                {' '}{user.website}
                            </a>
                            <hr />
                        </Box>
                    }


                    <Box style={{ marginBottom: 15 }}>
                        <CalendarTodayIcon color="primary" />{' '}
                        <span>Joined from {dayjs(user.createdAt).format('MMM-YYYY')}</span>
                    </Box>

                    <Box style={{ marginBottom: 15 }}>
                        <ShareIcon color="primary"></ShareIcon> {' '}
                        <span>{totalPosts} posts shared</span>
                    </Box>


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
                </Box>
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

export default UserProfile;