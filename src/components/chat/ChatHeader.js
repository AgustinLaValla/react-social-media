import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useHistory } from 'react-router-dom';

import ChatMenu from './ChatMenu';

const ChatHeader = ({ username, userImage, userId, toggleChatScreen, paperClassName, handleCloseChat }) => {

    const [anchorEl, setAnchorEl] = useState();

    const history = useHistory();

    const handleOpenMenu = ({ currentTarget }) => setAnchorEl(currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    const goToUserProfile = () => history.push(`/user/${userId}`);


    return (
        <div className="chatHeader">
            <div className="chatHeader__leftData">
                <Avatar src={userImage} onClick={goToUserProfile} />
                <span className="chatHeader__username" onClick={goToUserProfile}>{username}</span>
            </div>
            <MoreVertIcon style={{ color: 'white', cursor: 'pointer' }} aria-haspopup="true" onClick={handleOpenMenu} />

            <ChatMenu
                anchorEl={anchorEl}
                handleCloseMenu={handleCloseMenu}
                toggleChatScreen={toggleChatScreen}
                paperClassName={paperClassName}
                handleCloseChat={handleCloseChat}
            />

        </div>
    )
}

export default ChatHeader
