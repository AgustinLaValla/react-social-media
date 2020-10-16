import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';


const ErrorMessageDialog = ({ open, message, onClose, closeDialog }) => {

    return (

        <Dialog open={open} onClose={onClose}>
            <DialogTitle id="login-error">It's seems there is an error</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} color="primary" variant="contained">
                    Ok
        </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ErrorMessageDialog;