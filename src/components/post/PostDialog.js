import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from '@material-ui/icons/Chat';
import LikeButton from './LikeButton';
import  Comments  from './Comments';
import MyButton from '../layout/MyButton';
import { Link } from 'react-router-dom';
import { getStyles } from '../../utils/styles';
import { getUserImage } from '../../utils/utils';
import dayjs from 'dayjs';

const useStyles = makeStyles(theme => getStyles(theme));

const PostDialog = ({ open, handleClose, post, userData, socket, fromVisitedUser, userProfileRoom }) => {

    const classes = useStyles();

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="" className={classes.dialog} fullWidth>

            <CloseIcon className={classes.closeIcon} onClick={handleClose} />

            <DialogTitle id=""></DialogTitle>
            <DialogContent className={classes.DialogContent}>
                <Grid container>
                    <Grid item sm={5}>
                        <img
                            src={getUserImage(post.userId)}
                            className={classes.profileImage}
                            alt=""
                        />
                    </Grid>
                    <Grid item sm={5}>
                        <Typography
                            component={Link}
                            to={`users/${post.userId._id}`}
                            color="primary"
                            variant="h5"
                        >
                            @{post.userId.username}
                        </Typography>

                        <hr className={classes.invisibleSeparator} />

                        <Typography variant="body2" color="textSecondary">
                            {dayjs(post.createdAt).format('h:mm a,  DD-MM-YYYY')}
                        </Typography>

                        <hr className={classes.invisibleSeparator} />

                        <Typography variant="body1">{post.body}</Typography>

                        <LikeButton {...{ post, classes, userData, socket }} authenticated={true} />

                        <MyButton tipTitle="comments" tipClassName={classes.tooltip}>
                            <ChatIcon color="primary" />
                        </MyButton>
                        <span>{post.commentCount}</span>
                    </Grid>


                    <Comments
                        comments={post.comments}
                        postId={post._id}
                        userId={post.userId._id}
                        fromVisitedUser={fromVisitedUser}
                        userProfileRoom={userProfileRoom}
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
            </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PostDialog;