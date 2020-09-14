import React, { Fragment } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import CloseIcon from '@material-ui/icons/Close';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

const ChatMenu = ({ anchorEl, handleCloseMenu, toggleChatScreen, paperClassName, handleCloseChat }) => {

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}

            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <MenuItem onClick={() => { handleCloseMenu(); toggleChatScreen() }}>
                {
                    paperClassName.indexOf('FullScreen') < 0 
                        ?
                        <Fragment>
                            <FullscreenIcon color="primary" />
                            <Typography variant="body1">Full Screen</Typography>
                        </Fragment>

                        :
                        <Fragment>
                            <FullscreenExitIcon color="primary" />
                            <Typography variant="body1">Close Full Screen</Typography>
                        </Fragment>


                }
            </MenuItem>
            <MenuItem onClick={handleCloseChat}>
                <CloseIcon color="primary" />
                <Typography variant="body1">Close Chat</Typography>
            </MenuItem>
        </Menu>
    )
}

export default ChatMenu
