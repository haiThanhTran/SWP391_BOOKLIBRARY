import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Popover, Typography, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';

const NotificationBell = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const userId = 2; // Specify the user ID for filtering

  useEffect(() => {
    // Fetch order details from API
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:9191/api/orderdetails?userId=${userId}`);
        setOrderDetails(response.data);
        setUnreadCount(response.data.length); // Adjust this based on your unread count logic
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setUnreadCount(0); // Reset unread count when the bell is clicked
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  const renderOrderDetails = () => {
    if (orderDetails.length === 0) {
      return <Typography>Bạn không có thông báo nào.</Typography>;
    }

    return orderDetails.map((orderDetail, userId) => (
      <Typography key={userId==2}>
        Bạn đã đặt lịch mượn sách thành công, mã của bạn là {orderDetail.searchID}. Vui lòng đến nhận sách trong giờ từ bây giờ đến {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString()} trước khi đơn hàng của bạn bị hủy.
      </Typography>
    ));
  };

  return (
    <div>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="secondary">
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
          {renderOrderDetails()}
        </Box>
      </Popover>
    </div>
  );
};

export default NotificationBell;
