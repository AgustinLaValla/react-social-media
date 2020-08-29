import React, { useState } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { getStyles } from '../../utils/styles';
import { addComment } from '../../redux/actions/postsActions';
import { useSelector, useDispatch } from 'react-redux';

const useStyles = makeStyles(theme => getStyles(theme));

export const CommentForm = ({postId, userId}) => {

    const classes = useStyles();

    const [comment, setComment] = useState();

    const { authenticated } = useSelector(state => state.user);
    const { socket } = useSelector(state => state.socket);

    const dispatch = useDispatch();

    const submitHandler = (ev) => {
        ev.preventDefault();
        dispatch(addComment(postId, userId, comment, socket));
    }

    return authenticated && (
        <Grid item sm={12} style={{ textAlign: 'center' }} className={classes.postCommentFormContainer}>
            <form onSubmit={submitHandler}>
                <TextField
                    label="Comment"
                    placeholder="Add a commet"
                    value={comment}
                    onChange={ev => setComment(ev.target.value)}
                    fullWidth
                    className={classes.textfield}
                />
                <Button className={classes.commentBtn} type="submit" variant="contained" color="primary">Submit</Button>
            </form>
            <br/>
        </Grid>
    )
}
