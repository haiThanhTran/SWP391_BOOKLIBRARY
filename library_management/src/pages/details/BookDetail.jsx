// BookDetail.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { WishlistContext } from "../wishlist/WishlistContext";
import Header from "../../pages/nav-bar/Header";
import "./BookDetail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Comment from "./Comment";

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { addToWishlist, wishlist } = useContext(WishlistContext);

  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:9191/api/books");
        setBooks(response.data);
        console.log("book api: ", response.data);
      } catch (error) {
        console.error("Fetch books failed:", error);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (books.length > 0) {
      const foundBook = books.find((book) => book.bookID === parseInt(id));
      setBook(foundBook);
    }
    console.log("book", book);
  }, [books, id]);

  // Hàm xử lý việc mượn sách
  const handleBorrow = () => {
    const token = localStorage.getItem("token"); // Lấy token từ local storage
    if (book.status.statusID == "1" || book.bookQuantity == "0") {
      toast.error("Bạn không thể mượn sách này");
    } else if (!token) {
      // Nếu không có token, hiển thị thông báo yêu cầu đăng nhập
      toast.error("Vui lòng đăng nhập trước khi mượn sách");
    } else {
      addToWishlist(book);
    }
  };

  console.log("wishlist", wishlist);

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="BookDetail">
        <div className="container mt-4">
          <div className="row detail-home">
            <div className="col-md-3">
              <div className="left-detail border border-light p-3">
                {book && (
                  <>
                    <img
                      src={`http://localhost:9191/api/books/images/${book.bookImage}`}
                      alt={book.bookName}
                      className="img-fluid mb-3"
                    />
                    <div className="rating">
                      <span>Luợt đánh giá:</span>
                      <span className="stars">{book.bookStar}★</span>
                    </div>
                    <div className="rating">
                      <span>Số sách còn lại:</span>
                      <span className="stars">{book.bookQuantity}📖</span>
                    </div>
                    <button
                      className="btn btn-outline-secondary mt-2 w-100"
                      onClick={handleBorrow}
                    >
                      Mượn sách
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="col-md-9">
              <div className="right-detail border border-light p-3">
                {book ? (
                  <>
                    <h1>{book.bookName}</h1>
                    <p>
                      Tác giả: {book.bookAuthor ? book.bookAuthor : "Unknown"}
                    </p>
                    <p className="detailBook">{book.description}</p>
                    <div className="book-info-buttons">
                      <button className="btn btn-outline-secondary m-1">
                        Phân loại:
                        <br />
                        {book.category.categoryName || "None"}
                      </button>
                      <button className="btn btn-outline-secondary m-1">
                        Nhà xuất bản:
                        <br />
                        {book.publisher.publisherName || "None"}
                      </button>
                      <button className="btn btn-outline-secondary m-1">
                        Ngôn ngữ:
                        <br />
                        {book.language}
                      </button>
                      <button className="btn btn-outline-secondary m-1">
                        Số trang:
                        <br />
                        {book.page}
                      </button>
                    </div>
                    <Comment bookId={id} book={book} /> {/* Thêm dòng này */}
                  </>
                ) : (
                  <h1>Đợi chút...</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookDetail;
