import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Countdown from "react-countdown";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { UserContext } from "../../ultils/userContext";
import Header from "../../pages/nav-bar/Header";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal"; // Import thư viện react-modal

function ViewOrder() {
  const userOrder = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    if (!userOrder) {
      navigate("/signin");
    }
  }, [userOrder, navigate]);

  const [orders, setOrders] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
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
      const response = await axios.get(
        "http://localhost:9191/api/orders/user",
        {
        params: { userID: user.id },
        headers: { Authorization: `Bearer ${token}` },
        }
      );
      const sortedOrders = response.data.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );
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

  const cancelOrder = async (orderID) => {
    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn hủy đơn hàng này?"
    );
    if (!confirmCancel) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      await axios.put(
        `http://localhost:9191/api/orders/${orderID}/cancel`,
        null,
        {
        headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const openImageModal = (imagePath) => {
    setSelectedImage(imagePath);
    setModalIsOpen(true);
  };

  const renderOrders = (status) => {
    const filteredOrders = orders.filter((order) => {
      if (status === "Compensated") {
        return (
          order.status === "Compensated by Book" ||
          order.status === "Compensated by Money"
        );
      }
      return order.status === status;
    });

    const groupedOrders = filteredOrders.reduce((acc, order) => {
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
            {order.status !== "Cancelled" &&
            order.status !== "Returned" &&
            order.status !== "Overdue" ? (
              <td>
                {order.status === "Compensated by Book" ||
                order.status === "Compensated by Money" ? (
                  <img
                    src={`http://localhost:9191/api/orders/evidence/${order.evidenceImagePath}`}
                    alt="Evidence"
                    className="img-fluid"
                    style={{
                      maxWidth: "100px",
                      transition: "transform 0.3s ease, border 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => openImageModal(order.evidenceImagePath)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onMouseOver={(e) =>
                      (e.currentTarget.style.border = "2px solid blue")
                    }
                    onMouseOut={(e) => (e.currentTarget.style.border = "none")}
                  />
                ) : (
                  <Countdown
                    date={getCountdownDate(order)}
                    renderer={renderer}
                  />
                )}
              {order.status === "Pending" && (
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => cancelOrder(order.orderDetailID)}
                >
                  Hủy đặt sách
                </button>
              )}
            </td>
            ) : null}
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
          <li className="nav-item">
            <a
              className="nav-link"
              id="compensated-tab"
              data-toggle="tab"
              href="#compensated"
              role="tab"
              aria-controls="compensated"
              aria-selected="false"
            >
              Đền bù
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
                  <th>Deadline nhận sách</th>
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
                  <th>Mã đơn</th>
                  <th>Ảnh sách</th>
                  <th>Tên sách</th>
                  <th>Số lượng</th>
                  <th>Giá sách</th>
                  <th>Ngày đặt đơn</th>
                  <th>Trạng thái</th>
                  <th>Ngày trả đơn</th>
                  <th>Deadline nhận sách</th>
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
                  <th>Mã đơn</th>
                  <th>Ảnh sách</th>
                  <th>Tên sách</th>
                  <th>Số lượng</th>
                  <th>Giá sách</th>
                  <th>Ngày đặt đơn</th>
                  <th>Trạng thái</th>
                  <th>Ngày trả đơn</th>
                  <th>Ngày phải trả sách</th>
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
                  <th>Mã đơn</th>
                  <th>Ảnh sách</th>
                  <th>Tên sách</th>
                  <th>Số lượng</th>
                  <th>Giá sách</th>
                  <th>Ngày đặt đơn</th>
                  <th>Trạng thái</th>
                  <th>Ngày đã trả đơn</th>
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
                  <th>Mã đơn</th>
                  <th>Ảnh sách</th>
                  <th>Tên sách</th>
                  <th>Số lượng</th>
                  <th>Giá sách</th>
                  <th>Ngày đặt đơn</th>
                  <th>Trạng thái</th>
                  <th>Ngày đã trả đơn</th>
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
                  <th>Mã đơn</th>
                  <th>Ảnh sách</th>
                  <th>Tên sách</th>
                  <th>Số lượng </th>
                  <th>Giá sách</th>
                  <th>Ngày đặt đơn</th>
                  <th>Trạng thái</th>
                  <th>Ngày phải trả sách</th>
                </tr>
              </thead>
              {renderOrders("Overdue")}
            </table>
          </div>
          <div
            className="tab-pane fade"
            id="compensated"
            role="tabpanel"
            aria-labelledby="compensated-tab"
          >
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ảnh sách</th>
                  <th>Tên sách</th>
                  <th>Số lượng</th>
                  <th>Giá sách</th>
                  <th>Ngày đặt đơn</th>
                  <th>Trạng thái</th>
                  <th>Ngày đền bù</th>
                  <th>Hình ảnh đền bù</th>
                </tr>
              </thead>
              {renderOrders("Compensated")}
            </table>
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Preview Image"
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: "60%",
              height: "auto",
            },
          }}
        >
          <img
            src={`http://localhost:9191/api/orders/evidence/${selectedImage}`}
            alt="Preview"
            style={{ width: "100%", height: "100%" }}
          />
        </Modal>
      </div>
    </>
  );
}

export default ViewOrder;
