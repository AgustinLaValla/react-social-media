import React, { Fragment, useState } from 'react'
import { Button, Dialog, DialogTitle, DialogActions, makeStyles } from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { useSelector, useDispatch } from 'react-redux';
import MyButton from './MyButton';
import { getStyles } from '../utils/styles';
import axios from 'axios';
import { url, getHeaders } from '../utils/utils';
import Cookie from 'js-cookie';
import * as fromTYPES from '../redux/types';

const useStyles = makeStyles((theme) => getStyles(theme));

export const DeletePost = ({ postId }) => {

    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const { socket } = useSelector(state => state.socket);

    const dispatch = useDispatch();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const deletePost = async () => {
        dispatch({ type: fromTYPES.ACTIVATE_LINEAR_PROGRESS });
        try {
            const token = Cookie.getJSON('token');
            await axios.delete(`${url}/posts/delete-post/${postId}`, getHeaders(token));
            dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });
            socket.emit('refresh_posts')
        } catch (error) {
            console.log(error);
            // dispatch({ type: fromTYPES.GET_POSTS_FAILED, payload: error.response.data.message });
            dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });
        }
    }

    return (
        <Fragment>
            <MyButton
                tipTitle="Delete Post"
                onClick={handleOpen}
                btnClassName={classes.deleteButton}
                tipClassName={classes.tooltip}
            >
                <DeleteOutlineIcon color="secondary"/>
            </MyButton>

            <Dialog open={open} onClose={handleClose} aria-labelledby="" fullWidth maxWidth="sm">
                <DialogTitle>Are you sure you want to delete the scream ?</DialogTitle>

                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={deletePost} variant="contained" color="primary">Delete</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}
