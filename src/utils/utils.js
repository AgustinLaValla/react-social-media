

const serverUri = process.env.REACT_APP_SERVER_URI;

export const url = `${serverUri}/api`;

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

    if(!userData) {
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