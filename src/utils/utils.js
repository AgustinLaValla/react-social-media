import jwtDecode from 'jwt-decode';
import Cookie from 'js-cookie';
import { logout } from '../redux/actions/userActions';
import axios from 'axios';

const serverUri = 'https://react-social-app-server.herokuapp.com';

export const url = `${serverUri}/api`;

export const clientId = '337218875190-1fch0gemblkajnmbmtfg89u764mjrleh.apps.googleusercontent.com';

export const appTheme = {
    palette: {
        primary: {
            light: '#779936',
            main: '#486b00',
            dark: '#1e4000',
            contrastText: '#fff'
        },
        secondary: {
            light: '#af7050',
            main: '#7d4427',
            dark: '#4d1b00',
            contrastText: '#fff'
        }
    }
}


export const getHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const getImageUrl = (picVersion, picId) => `https://res.cloudinary.com/dnfm4fq8d/image/upload/v${picVersion}/${picId}`;
export const getUserImage = (userData) => {

    if (!userData) {
        return;
    }

    if (userData.img && userData.google) {
        if (userData.picVersion && userData.picId && userData.picVersion !== '1591573111' && userData.picId !== 'avatar_tmoqrv.png') {
            return getImageUrl(userData.picVersion, userData.picId);
        }
        return userData.img
    }
    return getImageUrl(userData.picVersion, userData.picId)
};

export const saveUserData = (userData) => localStorage.setItem('userData', JSON.stringify(userData));
export const getUserData = () => JSON.parse(localStorage.getItem('userData'));


export const renovateToken = (history, dispatch, signOut) => {
    const token = Cookie.getJSON('token');
    if (token) {
        const decodedToken = jwtDecode(token);
        if (expired(decodedToken.exp)) {
            history.push('/login');
            dispatch(logout(signOut));
        } else {
            axios.get(`${url}/auth/renovate-token`, getHeaders(token))
                .then(({ data }) => Cookie.set('token', data.token))
                .catch(console.log)
        }
    }
}

const expired = (expDate) => {
    const currentDate = new Date().getTime() / 1000;
    console.log({ tokenExp: expDate, currentDate: currentDate });
    return expDate < currentDate;
}