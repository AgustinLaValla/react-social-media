import React, { useState } from 'react'
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, makeStyles, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { getStyles } from '../../utils/styles';
import Cookie from 'js-cookie';
import { addPost } from '../../redux/actions/postsActions';


const useStyles = makeStyles(theme => getStyles(theme));

export const AddPost = ({ open, handleClose }) => {

    const classes = useStyles();

    const initialValues = { body: '' }
    const [postData, setPostData] = useState(initialValues);

    const { socket } = useSelector(state => state.socket);

    const dispatch = useDispatch();

    const handleInputChange = (ev) => {
        const { name, value } = ev.target;
        setPostData({ ...postData, [name]: value });
    };

    const addNewPost = (ev) => {
        ev.preventDefault();
        const token = Cookie.getJSON('token');
        if (postData.body !== '') {
            dispatch(addPost(postData, token, socket));
        }
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <form onSubmit={addNewPost}>
                <DialogTitle>Post a new Content</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Post"
                        name="body"
                        value={postData.body}
                        onChange={handleInputChange}
                        rows="3"
                        multiline
                        placeholder="Write your post"
                        className={classes.textField}
                    />
                </DialogContent>
                <DialogActions disableSpacing>
                    <Button type="submit" className={classes.addPostBtn} variant="contained" color="primary">
                        Add Post
                   </Button>

                </DialogActions>
            </form>
        </Dialog>
    )
}
