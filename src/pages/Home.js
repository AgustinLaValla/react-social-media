import React, { useEffect, useState } from 'react'
import { Button, Grid } from '@material-ui/core';
import axios from 'axios';
import { Post } from '../components/Post';


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNvZsOtYSBQZXJleiIsImVtYWlsIjoic29maV9wZXJlekBnbWFpbC5jb20iLCJfaWQiOiI1ZjQyYjJmZmI2ZGIxNjEwNTQ4NzBhZjYiLCJpYXQiOjE1OTgyOTc1MTIsImV4cCI6MTU5ODMxMTkxMn0.9nhPDznHSw8aohgx1pwSBFVJuyFGH-1k_KCCH6X714E';
const url = 'http://localhost:4000/api'

export const Home = () => {

    const [posts, setPosts] = useState(null);

    useEffect(() => {
        axios.get(`${url}/posts`, { headers: { Authorization: `Bearer ${token}` } })
            .then(resp => setPosts([...resp.data.posts]))
            .catch(error => console.log(error));
    }, [])

    return (
        <Grid container spacing={2}>
            <Grid item sm={8} xs={12}>
                {posts
                    ? posts.map(post =>
                        <Post key={post._id} post={post} />
                    )
                    : <p>Loading...</p>
                }
            </Grid>
            <Grid item sm={4} xs={12}>
                <p>Profile...</p>
            </Grid>
        </Grid>

    )
}
