import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StaffOrderManagement.css";
import Header from "../../pages/nav-bar/Header";
import empty_state from "../../assets/empty_state.png";
import logo from "../../assets/logo.jpg";
import { FaSearch } from "react-icons/fa";
import { UserContext } from "../../ultils/userContext";
import Modal from "react-modal";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

function StaffOrderManagement() {
  const userStaffOrder = JSON.parse(localStorage.getItem("user")); // Parse the user string to an object
  const navigate = useNavigate();

  useEffect(() => {
    if (!userStaffOrder || !userStaffOrder.role || userStaffOrder.role !== "STAFF") {
      navigate("/signin");
    }
  }, [userStaffOrder, navigate]);
  const [orderID, setOrderID] = useState("");
  const [orders, setOrders] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const token = localStorage.getItem("token");
  const { user } = useContext(UserContext);

  const handleSearchOrder = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9191/api/orders/search/${orderID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data);
      toast.success("Orders found");
    } catch (error) {
      toast.error("Order not found");
      setOrders([]);
    }
  };

  const handleUpdateOrder = async (orderID, status, returnDate) => {
    try {
      const response = await axios.put(
        `http://localhost:9191/api/orders/${orderID}/return`,
        { status, returnDate: new Date(returnDate).toISOString() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Order updated successfully");

      const updatedOrders = orders.map((order) =>
        order.orderDetailID === orderID
          ? { ...order, status, returnDate }
          : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  const handleCompensateOrder = async (orderID, compensationType) => {
    const confirmMessage = `Bạn đã chắn chắn muôn thay đổi trạng thái thành đền ${
      compensationType === "money" ? "tiền" : "sách"
    } không?`;
    if (window.confirm(confirmMessage)) {
      try {
        const status =
          compensationType === "money"
            ? "Compensated by Money"
            : "Compensated by Book";
        const response = await axios.put(
          `http://localhost:9191/api/orders/${orderID}/return`,
          { status, returnDate: new Date().toISOString() },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(
          `Đổi trạng thái thành công thành đền ${
            compensationType === "money" ? "tiền" : "sách"
          }`
        );

        const updatedOrders = orders.map((order) =>
          order.orderDetailID === orderID ? { ...order, status } : order
        );
        setOrders(updatedOrders);

        generateReport(selectedOrder, compensationType);
      } catch (error) {
        toast.error("Failed to compensate order");
      }
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const generateReport = (order, compensationType) => {
    const reportContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .header { text-align: center; margin-bottom: 20px; }
            .header img { width: 10px; } /* Điều chỉnh kích thước logo */
            .content { margin: 20px; }
            .signature-table { width: 100%; margin-top: 50px; }
            .signature-cell { width: 50%; text-align: center; vertical-align: top; }
            .content p { line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>BIÊN BẢN ĐỀN BÙ</h2>
            <p>Ngày: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="content">
            <p><strong>Tên người mượn:</strong> ${order.userName}</p>
            <p><strong>Thời gian mượn:</strong> ${new Date(
              order.orderDate
            ).toLocaleString()}</p>
            <p><strong>Tên sách:</strong> ${order.bookName}</p>
            <p><strong>Giá sách:</strong> ${order.totalPrice}</p>
            <p><strong>Lý do:</strong>...................................</p>
            <p><strong>Phương án đền:</strong> ${
              compensationType === "money" ? "Đền tiền" : "Đền sách"
            }</p>
            <p><strong>Cam Kết:</strong> Bên đền bù đã đền bù tổn thất cho phía thư viện cũng như bên thư viện đã xác nhận phương thức đền bù bằng ${
              compensationType === "money" ? "Đền tiền" : "Đền sách"
            } của khách hàng.</p>
          </div>
          <table class="signature-table">
            <tr>
              <td class="signature-cell">
                <p>Người Đền Bù</p>
                <p>(Ký, họ tên)</p>
              </td>
              <td class="signature-cell">
                <p>Người Xử Lý Đơn</p>
                <p>(Ký, họ tên)</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([reportContent], { type: "application/msword" });
    saveAs(blob, `BienBan_${order.orderDetailID}_${compensationType}.doc`);
  };

  return (
    <>
      <Header />

      <div className="StaffOrderManagement container mt-12">
        <ToastContainer />
        <h1>Order Management</h1>
        <div className="search-section d-flex mb-3">
          <input
            type="text"
            className="form-control me-2"
            value={orderID}
            onChange={(e) => setOrderID(e.target.value)}
            placeholder="Enter Search ID"
          />
          <button
            className="btn btn-sm btn-primary"
            onClick={handleSearchOrder}
          >
            <FaSearch style={{ padding: "0 10px 0 0", fontSize: "170%" }} />
            Search
          </button>
        </div>

        {orders.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Book Image</th>
                <th>User Name</th>
                <th>Quantity</th>
                <th>Book Name</th>
                <th>Total Price</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Return Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderDetailID}>
                  <td>
                    <img
                      src={`http://localhost:9191/api/books/images/${order.bookImage}`}
                      alt={order.bookName}
                      className="img-fluid"
                      style={{ maxWidth: "100px" }}
                    />
                  </td>
                  <td>{order.userName}</td>
                  <td>{order.quantity}</td>
                  <td>{order.bookName}</td>
                  <td>{order.totalPrice}</td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                  <td>
                    <select
                      className="form-select"
                      value={order.status}
                      onChange={(e) => {
                        const updatedOrders = orders.map((o) =>
                          o.orderDetailID === order.orderDetailID
                            ? { ...o, status: e.target.value }
                            : o
                        );
                        setOrders(updatedOrders);
                      }}
                    >
                      <option value="Pending" disabled>
                        Pending
                      </option>
                      <option value="Borrowed">Borrowed</option>
                      <option value="Returned">Returned</option>
                      <option value="Overdue" disabled>
                        Overdue
                      </option>
                      <option value="Cancelled" disabled>
                        Cancelled
                      </option>
                      <option value="Compensated by Money" disabled>
                        Compensated by Money
                      </option>
                      <option value="Compensated by Book" disabled>
                        Compensated by Book
                      </option>
                    </select>
                    <button
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => openModal(order)}
                      disabled={[
                        "Compensated by Money",
                        "Compensated by Book",
                        "Overdue",
                        "Pending",
                        "Cancelled",
                      ].includes(order.status)}
                    >
                      Xử lý mất sách
                    </button>
                  </td>
                  <td>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={new Date(order.returnDate)
                        .toISOString()
                        .slice(0, 16)}
                      onChange={(e) => {
                        const updatedOrders = orders.map((o) =>
                          o.orderDetailID === order.orderDetailID
                            ? { ...o, returnDate: e.target.value }
                            : o
                        );
                        setOrders(updatedOrders);
                      }}
                      disabled={[
                        "Compensated by Money",
                        "Compensated by Book",
                        "Overdue",
                        "Pending",
                        "Cancelled",
                      ].includes(order.status)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleUpdateOrder(
                          order.orderDetailID,
                          order.status,
                          new Date(order.returnDate)
                        )
                      }
                      disabled={[
                        "Compensated by Money",
                        "Compensated by Book",
                        "Overdue",
                        "Pending",
                        "Cancelled",
                      ].includes(order.status)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center">
            <img
              src={empty_state}
              alt="No Orders Found"
              className="img-fluid"
            />
            <p>No Orders Found</p>
          </div>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Xử lý mất sách"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "50%", // Adjust the width to be 50% of the viewport width
            minWidth: "800px", // Set a maximum width
            height: "30%", // Adjust the height to be 30% of the viewport height
            minHeight: "400px", // Set a maximum height
          },
        }}
      >
        <h2>Xử lý mất sách</h2>
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-primary m-2"
            onClick={() =>
              handleCompensateOrder(selectedOrder.orderDetailID, "money")
            }
          >
            Phương án đền tiền
          </button>
          <button
            className="btn btn-secondary m-2"
            onClick={() =>
              handleCompensateOrder(selectedOrder.orderDetailID, "book")
            }
          >
            Phương án đền sách
          </button>
        </div>
        <div className="d-flex justify-content-center">
          <button className="btn btn-danger mt-3" onClick={closeModal}>
            Đóng
          </button>
        </div>
      </Modal>
    </>
  );
}

export default StaffOrderManagement;
