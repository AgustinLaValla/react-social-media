import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

const UserMenu = ({ anchorEl,userId, username, handleClose, goToUserProfile, openChat }) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl?.id === `${userId}`)}
            onClose={handleClose}

        >
            <MenuItem onClick={() => { handleClose(); goToUserProfile(userId) }}>
                <Typography>{`Go to ${username} Profile`}</Typography>
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); openChat(userId) }}>
                <Typography>{`Chat with ${username}`}</Typography>
            </MenuItem>
        </Menu>
    )
}

export default UserMenu;
