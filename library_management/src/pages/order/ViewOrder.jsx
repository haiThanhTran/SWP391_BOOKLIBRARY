import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Countdown from "react-countdown";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { UserContext } from "../../ultils/userContext";
import Header from "../../pages/nav-bar/Header";
import { useNavigate, useParams } from "react-router-dom";

function ViewOrder() {
  const userOrder = JSON.parse(localStorage.getItem("user")); // Parse the user string to an object
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    if (!userOrder) {
      navigate("/signin");
    }
  }, [userOrder, navigate]);

  const [orders, setOrders] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.get("http://localhost:9191/api/orders/user", {
        params: { userID: user.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Order Expired</span>;
    } else {
      return (
        <span>
          {days}d {hours}h {minutes}m {seconds}s
        </span>
      );
    }
  };

  const getCountdownDate = (order) => {
    if (order.status === "Pending") {
      return new Date(order.orderDate).getTime() + 24 * 60 * 60 * 1000;
    } else if (order.status === "Borrowed") {
      return new Date(order.returnDate).getTime();
    }
    return null;
  };

  const renderOrders = (status) => {
    const groupedOrders = orders
      .filter((order) => order.status === status)
      .reduce((acc, order) => {
        if (!acc[order.searchID]) {
          acc[order.searchID] = [];
        }
        acc[order.searchID].push(order);
        return acc;
      }, {});

    return Object.keys(groupedOrders).map((searchID) => (
      <tbody
        key={searchID}
        style={{ border: "5px solid #cccccc", marginBottom: "20px" }}
      >
        {groupedOrders[searchID].map((order, index) => (
          <tr key={order.orderDetailID}>
            {index === 0 && (
              <td rowSpan={groupedOrders[searchID].length}>{order.searchID}</td>
            )}
            <td>
              <img
                src={`http://localhost:9191/api/books/images/${order.bookImage}`}
                alt={order.bookName}
                className="img-fluid"
                style={{ maxWidth: "100px" }}
              />
            </td>
            <td>{order.bookName}</td>
            <td>{order.quantity}</td>
            <td>{order.totalPrice}</td>
            <td>{new Date(order.orderDate).toLocaleString()}</td>
            <td>{order.status}</td>
            <td>{new Date(order.returnDate).toLocaleString()}</td>
            <td>
              <Countdown date={getCountdownDate(order)} renderer={renderer} />
            </td>
          </tr>
        ))}
      </tbody>
    ));
  };

  return (
    <>
      <Header />
      <div
        className="container mt-12"
        style={{
          marginTop: "175px",
          backgroundColor: "#E1DCC5",
          height: "100%",
        }}
      >
        <h2>Trạng thái mượn sách</h2>
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item">
            <a
              className="nav-link active"
              id="pending-tab"
              data-toggle="tab"
              href="#pending"
              role="tab"
              aria-controls="pending"
              aria-selected="false"
            >
              Đang chờ
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="picked-tab"
              data-toggle="tab"
              href="#picked"
              role="tab"
              aria-controls="picked"
              aria-selected="false"
            >
              Đang mượn
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="cancelled-tab"
              data-toggle="tab"
              href="#cancelled"
              role="tab"
              aria-controls="cancelled"
              aria-selected="false"
            >
              Bị hủy
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="returned-tab"
              data-toggle="tab"
              href="#returned"
              role="tab"
              aria-controls="returned"
              aria-selected="false"
            >
              Đã mượn
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="overdue-tab"
              data-toggle="tab"
              href="#overdue"
              role="tab"
              aria-controls="overdue"
              aria-selected="false"
            >
              Quá hạn
            </a>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="all"
            role="tabpanel"
            aria-labelledby="all-tab"
          >
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Book Image</th>
                  <th>Book Name</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Return Date</th>
                  <th>Time to Pickup</th>
                </tr>
              </thead>
              {renderOrders("Pending")}
            </table>
          </div>
          <div
            className="tab-pane fade"
            id="pending"
            role="tabpanel"
            aria-labelledby="pending-tab"
          >
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Book Image</th>
                  <th>Book Name</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Return Date</th>
                  <th>Time to Pickup</th>
                </tr>
              </thead>
              {renderOrders("Pending")}
            </table>
          </div>
          <div
            className="tab-pane fade"
            id="picked"
            role="tabpanel"
            aria-labelledby="picked-tab"
          >
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Book Image</th>
                  <th>Book Name</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Return Date</th>
                  <th>Time to Return</th>
                </tr>
              </thead>
              {renderOrders("Borrowed")}
            </table>
          </div>
          <div
            className="tab-pane fade"
            id="cancelled"
            role="tabpanel"
            aria-labelledby="cancelled-tab"
          >
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Book Image</th>
                  <th>Book Name</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Return Date</th>
                  <th>Time to Pickup</th>
                </tr>
              </thead>
              {renderOrders("Cancelled")}
            </table>
          </div>
          <div
            className="tab-pane fade"
            id="returned"
            role="tabpanel"
            aria-labelledby="returned-tab"
          >
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Book Image</th>
                  <th>Book Name</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Return Date</th>
                  <th>Time to Pickup</th>
                </tr>
              </thead>
              {renderOrders("Returned")}
            </table>
          </div>
          <div
            className="tab-pane fade"
            id="overdue"
            role="tabpanel"
            aria-labelledby="overdue-tab"
          >
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Book Image</th>
                  <th>Book Name</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Return Date</th>
                  <th>Time to Pickup</th>
                </tr>
              </thead>
              {renderOrders("Overdue")}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewOrder;
