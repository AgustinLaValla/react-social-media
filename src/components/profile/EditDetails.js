import React, { useState, Fragment } from 'react';
import { makeStyles, Dialog, DialogTitle, DialogContent, DialogActions, Button, EditButton, TextField, Tooltip } from '@material-ui/core';
import { getStyles } from '../../utils/styles';
import { useDispatch } from 'react-redux';
import { addOrChangeUserDetails } from '../../redux/actions/userActions';


const useStyles = makeStyles(theme => getStyles(theme));

export const EditDetails = ({ open, handleClose, bio, location, website, userId, close, socket, fromVisitedUser }) => {

    const classes = useStyles();

    const initialState = { bio, location, website }
    const [userDetails, setUserDetails] = useState(initialState);

    const dispatch = useDispatch();

    const handleInputChange = (ev) => {
        const { name, value } = ev.target;
        setUserDetails({ ...userDetails, [name]: value });
    }

    const handleSubmit = () => {
        if (userDetails.biography !== bio || userDetails.userLocation !== location || userDetails.userWebsite !== website) {
            dispatch(addOrChangeUserDetails(userId, userDetails, socket, fromVisitedUser));
        }
        close();
    }

    return (

        <Dialog open={open} onClose={handleClose} aria-labelledby="edit_details_title" maxWidth="sm">
            <DialogTitle id="edit_details_title">Edit your details</DialogTitle>
            <DialogContent>
                <form>
                    <TextField
                        id="bio"
                        label="biography"
                        name="bio"
                        value={userDetails.bio}
                        onChange={handleInputChange}
                        className={classes.textField}
                        multiline
                        rows="3"
                        placeholder="Write a sort bio about your self"
                        fullWidth

                    />
                    <TextField
                        id="location"
                        label="Location"
                        name="location"
                        value={userDetails.location}
                        onChange={handleInputChange}
                        className={classes.textField}
                        placeholder="Where you live?"
                        fullWidth

                    />
                    <TextField
                        id="website"
                        label="website"
                        name="website"
                        value={userDetails.website}
                        onChange={handleInputChange}
                        className={classes.textField}
                        placeholder="Personal or professional website"
                        fullWidth

                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} color="primary" variant="contained">Save changes</Button>
                <Button onClick={close} color="default" color="primary" variant="contained">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>


    )
}
