import React, { Fragment, useState } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import  DialogTitle from '@material-ui/core/DialogTitle';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { useSelector, useDispatch } from 'react-redux';
import * as fromTYPES from '../../redux/types';
import { getStyles } from '../../utils/styles';
import { url, getHeaders } from '../../utils/utils';
import axios from 'axios';
import Cookie from 'js-cookie';

const useStyles = makeStyles((theme) => getStyles(theme));

const DeletePost = ({ postId }) => {

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
            dispatch({ type: fromTYPES.DEACTIVATE_LINEAR_PROGRESS });
        }
    }

    return (
        <Fragment>

            <Tooltip title="Delete Post" className={classes.tooltip}>
                <IconButton onClick={handleOpen} className={classes.deleteButton}>
                    <DeleteOutlineIcon color="secondary" />
                </IconButton>
            </Tooltip>

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


export default DeletePost;