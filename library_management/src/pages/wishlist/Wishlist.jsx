import React, { useContext, useState } from "react";
import { WishlistContext } from "./WishlistContext";
import { UserContext } from "../../ultils/userContext";
import Header from "../../pages/nav-bar/Header";
import "./Wishlist.module.css";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "../../../node_modules/react-toastify/dist/ReactToastify.css";
import empty_state from "../../assets/empty_state.png"; // Đảm bảo đường dẫn đúng tới hình ảnh của bạn
import axios from "axios";
import { useNotification } from "../notification/NotificationContext";

function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } =
    useContext(WishlistContext);
  const [orderID, setOrderID] = useState("");
  const [quantities, setQuantities] = useState({});
  const token = localStorage.getItem("token");

  const { user } = useContext(UserContext);
  const { incrementNotificationCount, setNotificationCount } =
    useNotification();

  const handleRemoveFromWishlist = (bookID) => {
    removeFromWishlist(bookID);
    toast.success("Book removed from wishlist");
  };

  const handleQuantityChange = (bookID, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [bookID]: quantity,
    }));
  };

  const handleBorrowBooks = async () => {
    if (!user) {
      toast.error("Bạn phải đăng nhập để mượn sách");
      return;
    }

    try {
      const getLocalTime = () => {
        const date = new Date();
        const localTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
        return localTime;
      };

      const orders = wishlist.map((book) => {
        const localTime = getLocalTime();
        return {
          userID: user.id,
          book: {
            bookID: book.bookID,
            bookName: book.bookName,
            bookAuthor: book.bookAuthor,
            bookPrice: book.bookPrice,
            bookImage: book.bookImage,
            categoryName: book.categoryName,
            publisherName: book.publisherName,
          },
          quantity: quantities[book.bookID] || 1, // Default to 1 if quantity is not set
          totalPrice: (book.bookPrice || 0) * (quantities[book.bookID] || 1),
          orderDate: localTime.toISOString(),
          returnDate: new Date(
            localTime.getTime() + 14 * 24 * 60 * 60 * 1000
          ).toISOString(),
          status: "Pending",
        };
      });

      console.log("Orders to be sent:", orders);

      const response = await axios.post(
        "http://localhost:9191/api/orders",
        orders,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Chúc mừng bạn đã đặt sách thành công");

      const orderNumber = response.data.searchID;
      toast.success(
        `Yêu cầu mượn sách thành công! Mã đơn hàng của bạn là: ${orderNumber}`
      );
      clearWishlist();
      setOrderID(orderNumber);

      // Increment notification count
      incrementNotificationCount();
    } catch (error) {
      toast.error(`Yêu cầu mượn sách thất bại: ${error.message}`);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div
        className="Wishlist"
        style={{
          padding: "40px 0 20px 0",
          backgroundColor: "#E1DCC5",
          height: "100%",
        }}
      >
        <div className="container mt-4">
          <h1 style={{ margin: "20px", paddingTop: "60px" }}>
            Giỏ Hàng 
          </h1>
          {wishlist.length > 0 ? (
            <>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Ảnh</th>
                    <th scope="col">Tên sách</th>
                    <th scope="col">Tác giả</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlist.map((book) => (
                    <tr key={book.bookID}>
                      <td>
                        <img
                          src={`http://localhost:9191/api/books/images/${book.bookImage}`}
                          alt={book.bookName}
                          className="img-fluid"
                          style={{ maxWidth: "100px" }}
                        />
                      </td>
                      <td>{book.bookName}</td>
                      <td>{book.bookAuthor}</td>
                      <td>
                        <select
                          className="form-select"
                          value={quantities[book.bookID] || 1}
                          onChange={(e) =>
                            handleQuantityChange(book.bookID, e.target.value)
                          }
                        >
                          <option value="1">1</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleRemoveFromWishlist(book.bookID)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className="btn btn-outline-primary"
                onClick={handleBorrowBooks}
              >
                Borrow Books
              </button>
            </>
          ) : (
            <div className="text-center" style={{ paddingTop: "100px" }}>
              <img
                src={empty_state}
                alt="No Orders Found"
                className="img-fluid"
              />
              <p>Not Found Book</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Wishlist;
