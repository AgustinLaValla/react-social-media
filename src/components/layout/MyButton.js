import React from 'react';
import { Tooltip, IconButton } from "@material-ui/core";

export default ({ children, onClick, tipTitle, btnClassName, tipClassName }) => (
    <Tooltip title={tipTitle}  classes={{ tooltip: tipClassName }}>
        <IconButton onClick={onClick} className={btnClassName}>
            {children}
        </IconButton>
    </Tooltip>
);

 