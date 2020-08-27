export const url = 'http://localhost:4000/api'

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

export const getImageUrl = (picVersion, picId) => `https://res.cloudinary.com/dnfm4fq8d/image/upload/v${picVersion}/${picId}`