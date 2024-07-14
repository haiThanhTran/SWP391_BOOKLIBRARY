import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./AggregatedOrdersTable.css"; // Create this CSS file for styling
import { UserContext } from "../../../ultils/userContext";
import Header from "../../nav-bar/Header";
import Footer from "../../footer/Footer";

const AggregatedOrdersTable = () => {
  const [aggregatedOrders, setAggregatedOrders] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      navigate("/"); // Redirect to homepage or login if not admin
      return;
    }

    const token = localStorage.getItem("token");

    const fetchAggregatedOrders = async () => {
      if (token) {
        try {
          const response = await fetch(
            "http://localhost:9191/api/orders/dashboardOrders",
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
          setAggregatedOrders(data);
        } catch (error) {
          console.error("Error fetching aggregated orders:", error);
        }
      } else {
        console.error("No token found in local storage");
      }
    };

    fetchAggregatedOrders();
  }, [user, navigate]);

  return (
    <>
      {/* <Header /> */}
      <div className="aggregated-orders-table">
        <h2>Số lượng mượn sách</h2>
        <table>
          <thead>
            <tr>
              <th>ID tìm kiếm</th>
              <th>Số lượng</th>
              <th>Tổng giá</th>
              <th>ID người dùng</th>
              <th>Ảnh đại diện</th>
            </tr>
          </thead>
          <tbody>
            {aggregatedOrders.map((order, index) => (
              <tr key={index}>
                <td>{order[0]}</td>
                <td>{order[1]}</td>
                <td>{order[2]}</td>
                <td>{order[3]}</td>
                <td>
                  <img
                    className="avatar"
                    src={`http://localhost:9191/api/users/user-image/${order[4]}`}
                    alt={user.avatar}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default AggregatedOrdersTable;
