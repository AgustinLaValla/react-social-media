import React, { useState } from 'react'
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, makeStyles, TextField, Grid, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { getStyles } from '../../utils/styles';
import { Link } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import MyButton from '../layout/MyButton';
import { getUserImage } from '../../utils/utils';
import dayjs from 'dayjs';
import { LikeButton } from './LikeButton';
import ChatIcon from '@material-ui/icons/Chat';
import { Comments } from './Comments';

const useStyles = makeStyles(theme => getStyles(theme));

export const PostDialog = ({ open, handleClose, post, userData, socket }) => {

    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="" className={classes.dialog} fullWidth>

            <CloseIcon className={classes.closeIcon} onClick={handleClose} />

            <DialogTitle id=""></DialogTitle>
            <DialogContent className={classes.DialogContent}>
                <Grid container spacing="16">
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

                   
                    <Comments comments={post.comments} postId={post._id} userId={post.userId._id}/>
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
