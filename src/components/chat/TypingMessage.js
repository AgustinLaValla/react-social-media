import React from 'react'
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { getStyles } from '../../utils/styles';
import './Chat.css';

const useStyles = makeStyles(theme => getStyles(theme));

const TypingMessage = ({username}) => {

    const classes = useStyles();

    return (
        <div className="chatBubble receiverbubble">
            <Paper className={classes.receiverChatBubblePaper}>
                <Typography variant="body1" color="secondary">{`${username} is typing...`}</Typography>
            </Paper>
        </div>
    )
}

export default TypingMessage;
