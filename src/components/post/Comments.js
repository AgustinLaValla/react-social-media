import React from 'react'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { getStyles } from '../../utils/styles';
import { getUserImage } from '../../utils/utils';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { CommentForm } from './CommentForm';

const useStyles = makeStyles(theme => getStyles(theme));

export const Comments = ({ comments, postId, userId }) => {

    const classes = useStyles();

    return (
        <Grid container className={classes.commentsContainer}>
            <CommentForm {...{ postId, userId }} />
            {comments.map((comment, index) => (
                <Grid key={comment._id} container spacing={4}>
                    <Grid item sm={2}>
                        <img src={getUserImage(comment.userId)} className={classes.commentImage} />
                    </Grid>
                    <Grid item sm={9}>
                        <div className={classes.commentData}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography
                                    variant="h5"
                                    component={Link}
                                    to={`users/${comment.userId._id}`}
                                    color="primary"
                                >{comment.userId.username}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {dayjs(comment.userId.createdAt).format('hh:mm a DD/MM/YYYY')}
                                </Typography>
                            </div>
                            <hr className={classes.invisibleSeparator} />
                            <Typography variant="body1">{comment.comment}</Typography>
                        </div>
                        {index !== comments.length - 1 &&
                            <hr className={classes.visibleSeparator} />
                        }
                    </Grid>
                </Grid>
            ))}
        </Grid>
    )
}
