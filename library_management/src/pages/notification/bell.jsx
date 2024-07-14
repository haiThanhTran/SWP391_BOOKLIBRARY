import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Badge,
  IconButton,
  Popover,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import { useNotification } from "./NotificationContext";
import { UserContext } from "../../ultils/userContext";
const Bell = () => {
  const { user } = useContext(UserContext);
  const [orderDetails, setOrderDetails] = useState([]);
  const [userId, setUserId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const { notificationCount, setNotificationCount } = useNotification();
  useEffect(() => {
    if (user) {
      setUserId(user.id);
      console.log("User updated:", userId);
    }
  }, [user]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9191/api/orders/bell?userId=${userId}`
      );
      const uniqueOrders = mergeDuplicateOrders(response.data);
      setOrderDetails(
        uniqueOrders.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        )
      );
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setNotificationCount(0); // Reset unread count when the bell is clicked
    fetchOrderDetails(); // Fetch the latest notifications when the bell is clicked
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowAll(false);
  };

  const handleSeeAll = () => {
    setShowAll(true);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const mergeDuplicateOrders = (orders) => {
    const mergedOrders = [];
    const orderMap = new Map();

    orders.forEach((order) => {
      if (orderMap.has(order.searchID)) {
        const existingOrder = orderMap.get(order.searchID);
        existingOrder.quantity += 1; // Assuming you want to keep a count of duplicates
      } else {
        orderMap.set(order.searchID, { ...order, quantity: 1 });
        mergedOrders.push(orderMap.get(order.searchID));
      }
    });

    return mergedOrders;
  };

  const renderOrderDetails = () => {
    if (orderDetails.length === 0) {
      return <Typography>Bạn không có thông báo nào.</Typography>;
    }

    const displayOrders = showAll ? orderDetails : orderDetails.slice(0, 2);

    return (
      <List>
        {displayOrders.map((orderDetail) => (
          <ListItem key={orderDetail.searchID} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar src="https://th.bing.com/th/id/OIP.NnDnfxfuDA8i1Nfl8M8RfgHaHa?w=3333&h=3333&rs=1&pid=ImgDetMain&fbclid=IwZXh0bgNhZW0CMTAAAR1OXUMon_0p53E1O13A-Bv8eWQT4VoJMTEHvXkhpy8o9zWNogktlBwKN5Q_aem_Acod6jbhDhrpUBXRJgKuU3uONuPi2VdRtWtUNMejqUEwwnFIJih9m-S1vrAl_WkTWuhqchOOsRD09dQAmOSBeLL2" />
            </ListItemAvatar>
            <ListItemText
              primary="Thông báo đặt sách"
              secondary={
                <span>
                  Bạn đã đặt lịch mượn sách thành công, mã của bạn là{" "}
                  <strong>{orderDetail.searchID}</strong>. Vui lòng đến nhận
                  sách trong giờ từ bây giờ đến{" "}
                  <strong>
                    {new Date(
                      new Date(orderDetail.orderDate).getTime() +
                        24 * 60 * 60 * 1000
                    ).toLocaleString()}
                  </strong>{" "}
                  trước khi đơn hàng của bạn bị hủy.
                </span>
              }
            />
          </ListItem>
        ))}
        {!showAll && orderDetails.length > 2 && (
          <Box textAlign="center" mt={2}>
            <Button onClick={handleSeeAll}>See All</Button>
          </Box>
        )}
      </List>
    );
  };

  return (
    <div>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notificationCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          style: {
            width: "300px", // Adjust width as needed
            maxHeight: "600px", // Limit max height for scrolling
            overflowY: "auto",
            marginTop: "6px",
          },
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

export default Bell;
