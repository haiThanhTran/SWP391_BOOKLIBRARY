import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StaffOrderManagement.css";
import Header from "../../pages/nav-bar/Header";
import empty_state from "../../assets/empty_state.png"; // Đảm bảo đường dẫn đúng tới hình ảnh của bạn
import { FaSearch } from "react-icons/fa";


function StaffOrderManagement() {
  const [orderID, setOrderID] = useState("");
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");


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
        { status, returnDate },
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
                      <option value="Pending">Pending</option>
                      <option value="Borrowed">Borrowed</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={order.returnDate}
                      onChange={(e) => {
                        const updatedOrders = orders.map((o) =>
                          o.orderDetailID === order.orderDetailID
                            ? { ...o, returnDate: e.target.value }
                            : o
                        );
                        setOrders(updatedOrders);
                      }}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleUpdateOrder(
                          order.orderDetailID,
                          order.status,
                          order.returnDate
                        )
                      }
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Hiển thị hình ảnh nếu không có đơn hàng
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
    </>
  );
}


export default StaffOrderManagement;