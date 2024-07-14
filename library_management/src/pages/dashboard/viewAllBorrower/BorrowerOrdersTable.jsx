import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./BorrowerOrdersTable.css"; // Create this CSS file for styling
import { UserContext } from "../../../ultils/userContext";
import Header from "../../nav-bar/Header";
import Footer from "../../footer/Footer";

const BorrowerOrdersTable = () => {
  const [borrowerOrders, setBorrowerOrders] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      navigate("/"); // Redirect to homepage or login if not admin
      return;
    }

    const token = localStorage.getItem("token");

    const fetchBorrowerOrders = async () => {
      if (token) {
        try {
          const response = await fetch(
            "http://localhost:9191/api/orders/usersWithSearchCount",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          setBorrowerOrders(data);
        } catch (error) {
          console.error("Error fetching borrower orders:", error);
        }
      } else {
        console.error("No token found in local storage");
      }
    };

    fetchBorrowerOrders();
  }, [user, navigate]);

  return (
    <>
      {/* <Header /> */}
      <div className="borrower-orders-table">
        <h2>NHỮNG NGƯỜI DÙNG MƯỢN SÁCH NHIỀU NHẤT</h2>
        <table>
          <thead>
            <tr>
              <th>ID người dùng</th>
              <th>Ảnh đại diện</th>
              <th>Tổng đơn</th>
            </tr>
          </thead>
          <tbody>
            {borrowerOrders.map((borrower, index) => (
              <tr key={index}>
                <td>{borrower.userId}</td>
                <td>
                  <img
                    className="avatar"
                    src={`http://localhost:9191/api/users/user-image/${borrower.avatar}`}
                    alt={`User ${borrower.userId}`}
                  />
                </td>
                <td>{borrower.searchCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default BorrowerOrdersTable;
