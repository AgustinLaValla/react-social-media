export const getStyles = (theme) => ({
    linearProgress: {
        width: '100%'
    },
    paper: {
        padding: 20
    },
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
            '& button': {
                position: 'absolute',
                top: '80%',
                left: '70%'
            }
        },
        '& .profile-image': {
            width: 200,
            height: 200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%',
            cursor: 'pointer'
        },

        '& .profile-details': {
            textAlign: 'center',
            '& span, svg': {
                verticalAlign: 'middle',
            },
            '& a': {
                color: theme.palette.primary.main
            }
        },
        '& hr': {
            border: 'none',
            margin: '0 0 10px 0'
        },
        '& svg.button': {
            '&:hover': {
                cursor: 'pointer'
            }
        }
    },
    buttons: {
        textAlign: 'center',
        '& a': {
            margin: '20px 10px'
        }
    },
    tooltip: {
        fontSize: '16px'
    },
    form: {
        textAlign: 'center'
    },
    pageTitle: {
        margin: '10px auto 10px auto'
    },
    image: {
        margin: '20px auto 20px auto',
        width: '50px',
        height: '50px'
    },
    textField: {
        width: '100%',
        margin: '20px 0px',
        fontSize: '18px'
    },
    button: {
        width: '100%',
        marginTop: '20px'
    },
    card: {
        display: 'flex',
        marginBottom: '20px',
        position:'relative'
    },
    cardImage: {
        minWidth: '200px',
        height: 'auto',
        objectFit: 'cover'
    },
    content: {
        padding: '25px',
    },
    deleteButton: {
        position: 'absolute',
        left: '90%',
        bottom: '13%'
    },
})