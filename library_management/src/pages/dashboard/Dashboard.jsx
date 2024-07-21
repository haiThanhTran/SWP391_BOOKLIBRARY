import React, { useEffect, useState, useContext } from "react";
import "./Dashboard.css";
import { useNavigate, Routes, Route } from "react-router-dom";
import AggregatedOrdersTable from "./viewAllOrder/AggregatedOrdersTable";
import BorrowerOrdersTable from "./viewAllBorrower/BorrowerOrdersTable";
import MoneyDashboard from "./viewAllImport/MoneyDashboard";
import borrow from "../../assets/borrow.png";
import customer from "../../assets/customer.png";
import moneyBook from "../../assets/moneyBook.png";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { UserContext } from "../../ultils/userContext";
import OrderChart from "./orderChart/OrderChart";
import UserChart from "./userChart/UserChart"; // Ensure you have created and imported UserChart

const Dashboard = () => {
  const userStaffCategory = JSON.parse(localStorage.getItem("user")); // Parse the user string to an object
  const navigate = useNavigate();

  useEffect(() => {
    if (!userStaffCategory || userStaffCategory.role !== "ADMIN") {
      navigate("/signin");
    }
  }, [userStaffCategory, navigate]);
  const [orderCount, setOrderCount] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [isPositiveChange, setIsPositiveChange] = useState(true);
  const [uniqueBorrowersCount, setUniqueBorrowersCount] = useState(0);
  const [uniqueBorrowersChange, setUniqueBorrowersChange] = useState(0);
  const [isUniqueBorrowersChangePositive, setIsUniqueBorrowersChangePositive] =useState(true);
  const [currentMonthYear, setCurrentMonthYear] = useState("");
  const [importedMoney, setImportedMoney] = useState(0);
  const [importExpenseChange, setImportExpenseChange] = useState(0);
  const [monthlyBorrowings, setMonthlyBorrowings] = useState([]);
  const [monthlyUniqueBorrowers, setMonthlyUniqueBorrowers] = useState([]); // New state for unique borrowers
  const { user, handleLogout } = useContext(UserContext);
  const [topBooks, setTopBooks] = useState([]);

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      navigate("/"); // Redirect non-admin users
    }

    const token = localStorage.getItem("token");

    const fetchData = async () => {
      if (token) {
        try {
          let response = await fetch(
            "http://localhost:9191/api/orders/currentMonthOrderCount",
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
          let data = await response.json();
          setOrderCount(data);

          response = await fetch(
            "http://localhost:9191/api/orders/currentMonthPercentageChange",
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
          data = await response.json();
          setPercentageChange(data.percentageChange);
          setIsPositiveChange(data.percentageChange >= 0);

          response = await fetch(
            "http://localhost:9191/api/orders/uniqueBorrowersCount",
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
          data = await response.json();
          setUniqueBorrowersCount(data);

          response = await fetch(
            "http://localhost:9191/api/orders/uniqueBorrowersPercentageChange",
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
          data = await response.json();
          setUniqueBorrowersChange(data.percentageChange);
          setIsUniqueBorrowersChangePositive(data.percentageChange >= 0);

          response = await fetch(
            "http://localhost:9191/api/importBooks/monthlyExpense",
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
          data = await response.json();
          setImportedMoney(data);

          response = await fetch(
            "http://localhost:9191/api/importBooks/percentageChange",
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
          data = await response.json();
          setImportExpenseChange(data.percentageChange);

          response = await fetch(
            "http://localhost:9191/api/orders/top-5-borrowed-books",
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
          data = await response.json();
          setTopBooks(data);

          // Fetch monthly borrowings
          response = await fetch(
            "http://localhost:9191/api/orders/monthlyBorrowings",
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
          data = await response.json();
          setMonthlyBorrowings(data);

          // Fetch monthly unique borrowers
          response = await fetch(
            "http://localhost:9191/api/orders/monthlyUniqueBorrowers",
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
          data = await response.json();
          setMonthlyUniqueBorrowers(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }

        const now = new Date();
        const month = now.toLocaleString("default", { month: "long" });
        const year = now.getFullYear();
        setCurrentMonthYear(`${month} ${year}`);
      } else {
        console.error("No token found in local storage");
      }
    };

    fetchData();
  }, [user, navigate]);

  return (
    <div className="dashboard">
      <Routes>
        <Route
          path="dashboardorder"
          element={<AggregatedOrdersTable />}
        />
        <Route
          path="dashboardborrower"
          element={<BorrowerOrdersTable />}
        />
        <Route
          path="moneydashboard"
          element={<MoneyDashboard />}
        />
        <Route
          path="/"
          element={
            <>
              <div className="top-metrics">
                <div className="metric">
                  <img src={borrow} alt="borrow icon" className="metric-icon" />
                  <div className="metric-info">
                    <div className="metric-title">
                      Số lượng sách được mượn {currentMonthYear}
                    </div>
                    <div className="metric-value">{orderCount} lượt mượn</div>
                    <div
                      className={`metric-change ${
                        isPositiveChange ? "positive-change" : "negative-change"
                      }`}
                    >
                      {isPositiveChange ? <FiTrendingUp /> : <FiTrendingDown />}{" "}
                      {percentageChange.toFixed(2)}% với tháng trước
                    </div>
                  </div>
                  <div className="metric-view">
                    <button
                      className="view-btn"
                      onClick={() => navigate("dashboardorder")}
                    >
                      Xem
                    </button>
                  </div>
                </div>
                <div className="metric">
                  <img src={customer} alt="customer icon" className="metric-icon" />
                  <div className="metric-info">
                    <div className="metric-title">
                      Số người mượn trong tháng {currentMonthYear}
                    </div>
                    <div className="metric-value">{uniqueBorrowersCount} người</div>
                    <div
                      className={`metric-change ${
                        isUniqueBorrowersChangePositive
                          ? "positive-change"
                          : "negative-change"
                      }`}
                    >
                      {isUniqueBorrowersChangePositive ? (
                        <FiTrendingUp />
                      ) : (
                        <FiTrendingDown />
                      )}{" "}
                      {uniqueBorrowersChange.toFixed(2)}% với tháng trước
                    </div>
                  </div>
                  <div className="metric-view">
                    <button
                      className="view-btn"
                      onClick={() => navigate("dashboardborrower")}
                    >
                      Xem
                    </button>
                  </div>
                </div>
                <div className="metric">
                  <img src={moneyBook} alt="import icon" className="metric-icon" />
                  <div className="metric-info">
                    <div className="metric-title">Giá sách nhập vào</div>
                    <div className="metric-value">
                      {Intl.NumberFormat().format(importedMoney.toFixed(0))} VND
                    </div>
                    <div
                      className={`metric-change ${
                        importExpenseChange >= 0
                          ? "positive-change"
                          : "negative-change"
                      }`}
                    >
                      {importExpenseChange >= 0 ? (
                        <FiTrendingUp />
                      ) : (
                        <FiTrendingDown />
                      )}{" "}
                      {importExpenseChange.toFixed(2)}% với tháng trước
                    </div>
                  </div>
                  <div className="metric-view">
                    <button
                      className="view-btn"
                      onClick={() => navigate("moneydashboard")}
                    >
                      Xem
                    </button>
                  </div>
                </div>
              </div>
              <div className="products-and-customers">
                <div style={{ display: 'flex', flexDirection: 'column', flex: 2, gap: '20px' }}>
                  <div className="chart-container">
                    <OrderChart className="chart" data={monthlyBorrowings} />
                  </div>
                  <div className="new-chart-container">
                    <UserChart className="chart" data={monthlyUniqueBorrowers} />
                  </div>
                </div>
                <div className="top-selling-products">
                  <h3>Sách được mượn nhiều nhất</h3>
                  <table className="top-products-table">
                    <thead>
                      <tr>
                        <th>ID sách</th>
                        <th>Tên sách</th>
                        <th>Ảnh sách</th>
                        <th>Lượt mượn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topBooks.map((book, index) => (
                        <tr key={index}>
                          <td>{book[0]}</td>
                          <td>{book[1]}</td>
                          <td>
                            <img
                              className="book-top5-image"
                              src={`http://localhost:9191/api/books/images/${book[2]}`}
                              alt={book.book_name}
                            />
                          </td>
                          <td>{book[4]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default Dashboard;
