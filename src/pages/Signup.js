import React from 'react'
import * as Yup from 'yup';
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
import { signup } from '../redux/actions/userActions';
import { useSelector, useDispatch } from 'react-redux';
import * as fromTYPES from '../redux/types';
import { getStyles } from '../utils/styles';
import { makeStyles } from '@material-ui/core';
import { GoogleButton } from '../components/layout/GoogleButton';

const useStyles = makeStyles(theme => getStyles(theme));

const initialValues = { username: '', email: '', password: '', confirmPassword: '' };

const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().required('Email is required').email('Should be an email'),
    password: Yup.string().required().matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password should have at least one Uppercase vowel, one lowercase vowel, one number, and one special character'
    }),
    confirmPassword: Yup.string().required().when('password', {
        is: val => (val && val.length > 0) ? true : false,
        then: Yup.string().oneOf([Yup.ref("password")], 'Passwords do not match')
    })
})

const Signup = () => {

    const classes = useStyles();

    const { error } = useSelector(state => state.user);
    const { loading, openErrorsDialog } = useSelector(state => state.ui);
    const dispatch = useDispatch();

    const history = useHistory();

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => dispatch(signup(values, history))
    });

    return (
        <div>
            <Grid container className={classes.form} justify="center">
                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <Card>
                        <CardContent>
                            <CardMedia image={AppIcon} className={classes.image} />
                            <Typography variant="h4" className={classes.pageTitle}>
                                Singup
                            </Typography>
                            <form onSubmit={formik.handleSubmit}>
                                <TextField
                                    id="username"
                                    label="Username"
                                    name="username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.errors.username}
                                    error={formik.errors.username && formik.touched.username}
                                    className={classes.textField}
                                />
                                <TextField
                                    label="Email"
                                    id="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText={formik.errors.email}
                                    error={formik.errors.email && formik.touched.email}
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
                                <TextField
                                    name="confirmPassword"
                                    label="confirmPassword"
                                    id="confirmPassword"
                                    value={formik.values.confirmPassword}
                                    type="password"
                                    helperText={formik.errors.confirmPassword}
                                    error={formik.errors.confirmPassword && formik.touched.confirmPassword}
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
                                        || formik.values.username === ''
                                        || formik.values.email === ''
                                        || formik.values.password === ''
                                        || formik.values.confirmPassword === ''
                                    }
                                >
                                    {!loading ? 'Singup' : 'Loading...'}
                                </Button>

                                <GoogleButton />

                                <Link to='/login'>
                                    <small className="login__bottomText">Already have an account? Sign up here</small>
                                </Link>
                            </form>
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


export default Signup;