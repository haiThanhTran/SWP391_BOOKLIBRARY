import React, { useState } from 'react';
import { Badge, IconButton, Popover, Typography, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';


const NotificationBell = () => {
  const [notifications, setNotifications] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
   
    setNotifications(0);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };


  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;


  return (
    <div>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box p={2}>
          <Typography variant="h6">Thông báo</Typography>
          <Typography>Không có thông báo mới</Typography>
        </Box>
      </Popover>
    </div>
  );
};


export default NotificationBell;