import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/actions/userActions';
import { getUserPost } from '../redux/actions/postsActions';
import Grid from '@material-ui/core/Grid';
import { Post } from '../components/post/Post';
import { UserProfile } from '../components/profile/UserProfile';


export const User = () => {

    const { id, postId } = useParams();

    const { visitedUserData } = useSelector(state => state.user);
    const { visitedUserPosts } = useSelector(state => state.posts);

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(getUser(id));
        dispatch(getUserPost(id));
    }, [id]);


    return (
        <Grid container>
        <Grid item sm={8} xs={12}>
            {visitedUserPosts && visitedUserPosts.length > 0 && visitedUserPosts.map(post =>
                <Post key={post._id} post={post} openDialog={postId && postId === post._id ? true : false} fromVisitedUser={true}/> )
            }
        </Grid>
        <Grid item sm={4} xs={12}>
            <UserProfile user={visitedUserData} />
        </Grid>
    </Grid>
    )
}
