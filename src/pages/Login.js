import React from 'react';
import Grid from '@material-ui/core/Grid';
import AppIcon from '../images/logo.png'
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import { ErrorMessageDialog } from '../components/layout/ErrorMessageDialog';
import { Link, useHistory } from 'react-router-dom';
import { login } from '../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import * as fromTYPES from '../redux/types';
import { makeStyles } from '@material-ui/core';
import { getStyles } from '../utils/styles';
import { GoogleButton } from '../components/layout/GoogleButton';


const useStyles = makeStyles(theme => getStyles(theme));

const initialValues = { email: '', password: '' };

const validate = (values) => {
    let errors = {};
    if (!values.email) {
        errors.email = 'Email is required';
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(values.email)) {
        errors.email = 'Invalid email format';
    }

    if (!values.password) {
        errors.password = 'Password is Required';
    } /*else if (!/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(values.password)) {
        errors.password = 'Password should have at least one Uppercase vowel, one lowercase vowel, one number, and one special character';
    }*/
    return errors;
}


const Login = () => {

    const classes = useStyles();

    const history = useHistory();

    const { userData, error, loading } = useSelector(state => state.user);
    const { openErrorsDialog } = useSelector(state => state.ui);
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues,
        validate,
        onSubmit: (values) => {
            dispatch(login(values, history));
        }
    })

    return (
        <div>
            <Grid container className={classes.form} justify="center">
                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <Card>
                        <CardContent>
                            <CardMedia image={AppIcon} className={classes.image} />
                            <Typography variant="h4" className={classes.pageTitle}>
                                Login
                            </Typography>
                            <form onSubmit={formik.handleSubmit}>
                                <TextField
                                    label="Email"
                                    id="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.errors.email}
                                    error={formik.errors.email}
                                    className={classes.textField}
                                />
                                <TextField
                                    name="password"
                                    label="Password"
                                    id="password"
                                    value={formik.values.password}
                                    type="password"
                                    helperText={formik.errors.password}
                                    error={formik.errors.password && formik.touched.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={classes.textField}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    disabled={
                                        Object.keys(formik.errors).length > 0
                                        || formik.values.email === ''
                                        || formik.values.password === ''
                                    }
                                >
                                    {loading ? 'Loading...' : 'Login'}
                                </Button>


                            </form>

                            <GoogleButton />

                            <Link to='/signup'>
                                <small className="login__bottomText">Do not have an account? Sign up here</small>
                            </Link>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <ErrorMessageDialog
                open={openErrorsDialog}
                message={error}
                onClose={() => dispatch({ type: fromTYPES.CLEAR_USER_ERRORS })}
                closeDialog={() => dispatch({ type: fromTYPES.OPEN_ERRORS_DIALOG, payload: false })}
            />

        </div>
    )
}

export default Login;