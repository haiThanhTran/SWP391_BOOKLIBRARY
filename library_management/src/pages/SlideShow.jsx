import React, { useState, useEffect } from "react";
import StarRatingComponent from "react-star-rating-component";
import "./Pages.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";
import star from "../assets/star.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiStar } from "react-icons/ci";
import { IoInformationCircle } from "react-icons/io5";


const SlideShow = ({ books }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState({}); // Để lưu trữ đánh giá cho mỗi cuốn sách
  const [votes, setVotes] = useState({}); // Để lưu trữ trạng thái đã vote cho mỗi cuốn sách
  const [voteSuccessMessage, setVoteSuccessMessage] = useState(""); // Trạng thái để điều khiển thông báo thành công
  const [user, setUser] = useState(null);
  const [loginMessage, setLoginMessage] = useState(""); // Trạng thái để điều khiển thông báo đăng nhập
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (books.length > 0) {
      setCategoryName(books[0].category.categoryName);
    }
  }, [books]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      console.error("Không tìm thấy dữ liệu người dùng trong local storage");
    }
  }, []);

  useEffect(() => {
    if (user && user.id) {
      // Load sách đã được vote từ localStorage cho người dùng cụ thể
      const votedBooksFromStorage =
        JSON.parse(localStorage.getItem(`votedBooks_${user.id}`)) || {};
      setVotes(votedBooksFromStorage);
    }
  }, [user]); // Chỉ chạy khi user được cập nhật

  const nextSlide = () => {
    if (currentIndex < books.length - 5) {
      setCurrentIndex(currentIndex + 5);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 5);
    }
  };

  const onStarClick = (nextValue, prevValue, name) => {
    setRatings({
      ...ratings,
      [name]: nextValue,
    });
  };

  const handleVoteClick = (bookID) => {
    const stars = ratings[bookID];
    const token = localStorage.getItem("token");

    if (user && user.id) {
      fetch(
        `http://localhost:9191/api/books/vote?bookID=${bookID}&userID=${user.id}&stars=${stars}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      ).then((response) => {
        if (response.ok) {
          const newVotes = {
            ...votes,
            [bookID]: true,
          };
          setVotes(newVotes);

          // Lưu thông tin vote vào Local Storage cho người dùng cụ thể
          localStorage.setItem(
            `votedBooks_${user.id}`,
            JSON.stringify(newVotes)
          );

          // Thiết lập thông báo thành công
          toast.success(`Vote cho sách ${bookID} thành công`);

          // Xóa thông báo thành công sau một thời gian (ví dụ: 3 giây)
          setTimeout(() => {
            setVoteSuccessMessage("");
          }, 3000);
        } else {
          // Xử lý lỗi
          console.error("Vote thất bại");
        }
      });
    } else {
      // Hiển thị thông báo yêu cầu đăng nhập
      setLoginMessage("Bạn cần đăng nhập để thực hiện vote sách.");

      // Xóa thông báo đăng nhập sau một thời gian (ví dụ: 3 giây)
      setTimeout(() => {
        setLoginMessage("");
      }, 3000);
    }
  };

  const allBooksIncoming = books.every((book) => book.status.statusID === 4);

  return (
    <>
      <ToastContainer position="bottom-left" />
      <div className="slideshow-container">
        {loginMessage && (
          <div
            className="login-message"
            style={{ color: "red", textAlign: "center", margin: "10px 0" }}
          >
            <p>{loginMessage}</p>
          </div>
        )}
        {voteSuccessMessage && (
          <div className="vote-success-message">
            <p>{voteSuccessMessage}</p>
          </div>
        )}
        <div className="header">
          <a href="#">{allBooksIncoming ? "Incoming Book" : categoryName}</a>
        </div>
        <div className="slider">
          <button
            className={`prev ${currentIndex === 0 ? "disabled" : ""}`}
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ArrowBackIosIcon />
          </button>
          <div className="book-display">
            {books.slice(currentIndex, currentIndex + 5).map((book) => (
              <div className="book" key={book.bookID}>
                <Link to={`/BookDetail/${book.bookID}`}>
                  <img
                    src={`http://localhost:9191/api/books/images/${book.bookImage}`}
                    alt={book.bookName}
                  />
                  <div className="detail-book-quantity">{book.bookQuantity}</div>
                <button>Borrow <IoInformationCircle /></button>

                </Link>
                {book.status.statusID === 4 && (
                  <div className="book-star">
                    <div className="star-rating">
                      <span>{book.bookStar}</span>
                      <img
                        src={star}
                        alt="Star"
                        style={{ fontSize: "10px", boxShadow: "none" }}
                      />
                    </div>
                    {!votes[book.bookID] && (
                      <>
                        <StarRatingComponent
                          name={book.bookID.toString()}
                          starCount={5}
                          value={ratings[book.bookID] || 0}
                          onStarClick={(nextValue, prevValue) =>
                            onStarClick(
                              nextValue,
                              prevValue,
                              book.bookID.toString()
                            )
                          }
                        />
                        <button
                          className="vote-button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleVoteClick(book.bookID);
                          }}
                          disabled={votes[book.bookID]}
                        >
                          Vote
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            className={`next ${
              currentIndex >= books.length - 5 ? "disabled" : ""
            }`}
            onClick={nextSlide}
            disabled={currentIndex >= books.length - 5}
          >
            <ArrowForwardIosIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default SlideShow;
