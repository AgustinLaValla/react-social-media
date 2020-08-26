import React from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
        marginBottom: '20px',
    },
    image: {
        minWidth: '200px',
        height: 'auto',
        objectFit: 'cover'
    },
    content: {
        padding: '25px',
    }
}))

export const Post = ({ post }) => {
    const classes = useStyles();
    dayjs.extend(relativeTime)
    return (
        <Card className={classes.card}>
            <CardMedia
                className={classes.image}
                image={`https://res.cloudinary.com/dnfm4fq8d/image/upload/v${post.userId.picVersion}/${post.userId.picId}`}
                title="Profile image"
            />
            <CardContent className={classes.content}>
                <Typography variant="h5" color="primary">{post.userId.username}</Typography>
                <Typography variant="body2" color="textSecondary">{dayjs(post.createdAt).fromNow()}</Typography>
                <Typography variant="body1">{post.body}</Typography>
            </CardContent>
        </Card>
    )
}
