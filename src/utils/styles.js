export const getStyles = (theme) => ({

    linearProgress: {
        width: '100%'
    },
    paper: {
        padding: 20
    },
    notificationsMenu: {
        [theme.breakpoints.down('sm')]: {
            maxWidth: '80%'
        }
    },
    notifications_menuItem: {
        fontSize: '12px',
        hyphens: 'auto'
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
        position: 'relative',
        [theme.breakpoints.down('sm')]: {
            display: 'block'
        }
    },
    cardImage: {
        minWidth: '200px',
        height: 'auto',
        objectFit: 'cover',
        [theme.breakpoints.down('sm')]: {
            width: 'auto',
            minHeight: '200px',
            objectFit: 'cover'
        }
    },
    content: {
        padding: '25px',
    },
    deleteButton: {
        [theme.breakpoints.up('md')]: {
            position: 'absolute',
            left: '90%',
            top: '8%',
        }
    },
    expandButton: {
        position: 'absolute',
        left: '90%',
        bottom: '12%',
        [theme.breakpoints.down('sm')]: {
            position: 'absolute',
            bottom: '7%',
            left: '80%',
        }
    },
    openChatButton: {
        position: 'absolute',
        left: '85%',
        bottom: '12%',
        [theme.breakpoints.down('sm')]: {
            position: 'absolute',
            bottom: '7%',
            left: '70%',
        }
    },
    addPostBtn: {
        margin: '0px 10px 10px 0px'
    },
    DialogContent: {
        padding: '20px'
    },
    closeIcon: {
        position: 'absolute',
        right: 0,
        margin: '10px 10px 0px 0px',
        cursor: 'pointer'
    },
    invisibleSeparator: {
        border: 'none',
        margin: 4
    },
    visibleSeparator: {
        width: '100%',
        margin: 4
    },
    profileImage: {
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        objectFit: 'cover'
    },
    commentsContainer: {
        marginTop: '15px'
    },

    commentImage: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        objectFit: 'cover'
    },
    commentBtn: {
        margin: '10px 0px'
    },
    postCommentFormContainer: {
        marginTop: '25px'
    },
    chatPaper: {
        position: 'absolute',
        width: '400px',
        height: '550px',
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        outline: 'none',
        boxShadow: theme.shadows[5],
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            height: '100vh'
        }
    },
    chatPaperFullScreen: {
        position: 'absolute',
        width: '100%',
        height: '100vh',
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        outline: 'none',
        boxShadow: theme.shadows[5],
    },
    chatContent: {
        overflowY: 'auto'
    },
    chatFooter: {
        bottom: '0'
    },
    chatText: {
        display: 'flex'
    },
    senderChatBubblePaper: {
        padding: '10px',
        color: 'white',
        backgroundColor: '#486b00',
        maxWidth: '280px'
    },
    receiverChatBubblePaper: {
        padding: '10px',
        maxWidth: '280px'
    },

    usersCard: {
        margin: '0px 10px 15px 10px',
        height:'450px',
    },
    userCardTitle: {
        'cursor': 'pointer'
    },
    usersCardPicture: {
        paddingTop: '15px',
        minHeight: '200px',
        maxHeight: '200px',
        width: 'auto',
        objectFit: 'cover',
        margin: '0px 10px'
    },
    cardUsersContent: {
        height: '80px'
    }
})