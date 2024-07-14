import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./MoneyDashboard.css"; // Ensure this CSS file exists for styling
import { UserContext } from "../../../ultils/userContext";
import Header from "../../nav-bar/Header";
import Footer from "../../footer/Footer";

const MoneyDashboard = () => {
  const [importBooks, setImportBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      navigate("/"); // Redirect to homepage or login if not admin
      return;
    }

    const token = localStorage.getItem("token");

    const fetchImportBooks = async () => {
      if (token) {
        try {
          const response = await fetch(
            "http://localhost:9191/api/importBooks/importBooksInfo",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setImportBooks(data);
        } catch (error) {
          console.error("Error fetching import books:", error);
        }
      } else {
        console.error("No token found in local storage");
      }
    };

    fetchImportBooks();
  }, [user, navigate]);

  useEffect(() => {
    const filterBooksByMonth = () => {
      const filtered = importBooks.filter((book) => {
        const bookDate = new Date(book.import_date);
        return bookDate.getMonth() + 1 === selectedMonth;
      });
      setFilteredBooks(filtered);
    };

    filterBooksByMonth();
  }, [importBooks, selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10));
  };

  const calculateTotalImportMoney = () => {
    const total = filteredBooks.reduce((total, book) => total + book.import_money, 0);
    return new Intl.NumberFormat().format(total); // Format the number with commas
  };

  return (
    <>
      <Header />
      <div className="money-dashboard">
        <div className="dashboard-header">
          <h2>Sách đã nhập</h2>
          <div className="filter">
            <label htmlFor="month-select">Lọc theo tháng trong năm:</label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {[...Array(12).keys()].map((month) => (
                <option key={month + 1} value={month + 1}>
                  {new Date(0, month).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="total-import-money">
          Tổng tiền đã nhập trong tháng {new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })}: {calculateTotalImportMoney()} VND
        </div>
        <div className="dashboard-summary">
          <div className="summary-item">
            <h3>Imported Books</h3>
            <table>
              <thead>
                <tr>
                  <th>ID đơn nhập</th>
                  <th>Ngày nhập</th>
                  <th>Lượng sách nhập vào</th>
                  <th>ID sách</th>
                  <th>Tên sách</th>
                  <th>Ảnh sách</th>
                  <th>Tiền nhập sách</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book, index) => (
                  <tr key={index}>
                    <td>{book.import_id}</td>
                    <td>{new Date(book.import_date).toLocaleDateString()}</td>
                    <td>{book.import_quantity}</td>
                    <td>{book.book_id}</td>
                    <td>{book.book_name}</td>
                    <td>
                      <img
                        className="book-image"
                        src={`http://localhost:9191/api/books/images/${book.book_image}`}
                        alt={book.book_name}
                      />
                    </td>
                    <td>{new Intl.NumberFormat().format(book.import_money)} VND</td> {/* Format import money */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MoneyDashboard;
