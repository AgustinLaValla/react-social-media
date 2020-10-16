import React, { useRef } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import MuiLink from '@material-ui/core/Link';
import LinkIcon from '@material-ui/icons/Link';
import LocationOn from '@material-ui/icons/LocationOn';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import EditIcon from '@material-ui/icons/Edit';
import EditDetails from './EditDetails';
import ErrorMessageDialog from '../layout/ErrorMessageDialog';
import { useSelector, useDispatch } from 'react-redux';
import * as fromTYPES from '../../redux/types';
import { logout } from '../../redux/actions/userActions';
import { Link } from 'react-router-dom';
import { url, getHeaders, getUserImage } from '../../utils/utils';
import { getStyles } from '../../utils/styles';
import { clientId } from '../../utils/utils';
import * as dayjs from 'dayjs';
import axios from 'axios';
import Cookie from 'js-cookie';
import { useGoogleLogout } from 'react-google-login';

const useStyles = makeStyles(theme => getStyles(theme));

const Profile = () => {

    const classes = useStyles();
    const { userData, authenticated, error } = useSelector(state => state.user);
    const { openEditUserDetailsDialog, openErrorsDialog } = useSelector(state => state.ui);
    const { socket } = useSelector(state => state.socket);
    const dispatch = useDispatch();
    const inputFile = useRef();

    const { signOut } = useGoogleLogout({ clientId });

    const uploadImage = async (image) => {
        const token = Cookie.getJSON('token');
        dispatch({ type: fromTYPES.ACTIVATE_LINEAR_PROGRESS });
        try {
            await axios.put(`${url}/images/change-profile-image`, { image }, getHeaders(token));
            socket.emit('refresh_userData', { currentUserId: userData._id });

        } catch (error) {
            console.log(error);
        }
    }

    const handleInputFileChange = (imageFile) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = () => uploadImage(reader.result);
    };

    const handleLogout = async () => {
        await socket.emit('leave_private_room', { userId: userData._id });
        await userData.google ? dispatch(logout(signOut)) : dispatch(logout())
    };

    return (
        <div>
            {authenticated &&
                <Paper className={classes.paper}>
                    <div className={classes.profile}>
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
                        <hr />
                        <div className="profile-details">

                            <Box style={{ marginBottom: 15 }}>
                                <MuiLink
                                    component={Link}
                                    to={`/user/${userData._id}`}
                                    color="primary"
                                    variant="h5"
                                >
                                    @{userData.username}
                                </MuiLink>
                            </Box>

                            {userData.bio &&
                                <Box style={{ marginBottom: 15 }}>
                                    <Typography align="left" variant="body2">{userData.bio}</Typography>
                                </Box>
                            }

                            {userData.location &&
                                <Box style={{ marginBottom: 15 }}>
                                    <LocationOn color="primary" /> <span>{userData.location}</span>
                                </Box>
                            }

                            {userData.website &&
                                <Box style={{ marginBottom: 15 }}>
                                    <LinkIcon color="primary" />
                                    <a
                                        href={userData.website}
                                        target="__blank"
                                        rel="noopener noreferrer"
                                    >
                                        {' '}{userData.website}
                                    </a>
                                    <hr />
                                </Box>

                            }

                            <Box style={{ marginBottom: 15 }}>
                                <CalendarTodayIcon color="primary" />{' '}
                                <span>Joined from {dayjs(userData.createdAt).format('MMM-YYYY')}</span>
                            </Box>

                            <Box style={{ marginBottom: 15 }}>
                                <Tooltip title="Edit details" classes={{ tooltip: classes.tooltip }}>
                                    <IconButton onClick={() => dispatch({ type: fromTYPES.OPEN_USER_DETAILS_DIALOG, payload: true })}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                                <span
                                    onClick={() => dispatch({ type: fromTYPES.OPEN_USER_DETAILS_DIALOG, payload: true })}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Edit my details</span>
                            </Box>

                            <Box style={{ marginBottom: 15 }}>
                                <Tooltip title="Logout" classes={{ tooltip: classes.tooltip }}>
                                    <IconButton onClick={handleLogout}>
                                        <ExitToAppIcon fontSize="large" color="primary" />
                                    </IconButton>
                                </Tooltip>
                                <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
                            </Box>
                        </div>
                    </div>
                </Paper>
            }
            {!authenticated &&
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
            {authenticated &&
                <EditDetails
                    open={openEditUserDetailsDialog || false}
                    handleClose={() => dispatch({ type: fromTYPES.CLEAR_USER_ERRORS })}
                    bio={userData.bio ? userData.bio : null}
                    location={userData.location ? userData.location : null}
                    website={userData.website ? userData.website : null}
                    userId={userData._id ? userData._id : null}
                    close={() => dispatch({ type: fromTYPES.OPEN_USER_DETAILS_DIALOG, payload: false })}
                    socket={socket}
                />}
            <ErrorMessageDialog
                open={openErrorsDialog || false}
                message={error}
                onClose={() => dispatch({ type: fromTYPES.CLEAR_USER_ERRORS })}
                closeDialog={() => dispatch({ type: fromTYPES.OPEN_ERRORS_DIALOG, payload: false })}
            />
        </div>
    )
}


export default Profile;