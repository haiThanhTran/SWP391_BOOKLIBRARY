import React, { useState, useEffect } from "react";
import StarRatingComponent from "react-star-rating-component";
import "./Pages.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link, useNavigate } from "react-router-dom";
import star from "../assets/star.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoInformationCircle } from "react-icons/io5";
import axios from "axios";
import { MdAssignmentTurnedIn } from "react-icons/md";
import { color } from "chart.js/helpers";
import { orange } from "@mui/material/colors";

const SlideShow = ({ books, categoryID, isTopBorrow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState({});
  const [votes, setVotes] = useState({});
  const [voteSuccessMessage, setVoteSuccessMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loginMessage, setLoginMessage] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9191/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []);

  useEffect(() => {
    if (books.length > 0 && !isTopBorrow) {
      setCategoryName(books[0].category.categoryName);
    }
  }, [books, isTopBorrow]);

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
      const votedBooksFromStorage =
        JSON.parse(localStorage.getItem(`votedBooks_${user.id}`)) || {};
      setVotes(votedBooksFromStorage);
    }
  }, [user]);

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
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((response) => {
        if (response.ok) {
          const newVotes = {
            ...votes,
            [bookID]: true,
          };
          setVotes(newVotes);

          localStorage.setItem(
            `votedBooks_${user.id}`,
            JSON.stringify(newVotes)
          );

          toast.success(`Vote cho sách ${bookID} thành công`);

          setTimeout(() => {
            setVoteSuccessMessage("");
          }, 3000);
        } else {
          console.error("Vote thất bại");
        }
      });
    } else {
      setLoginMessage("Bạn cần đăng nhập để thực hiện vote sách.");

      setTimeout(() => {
        setLoginMessage("");
      }, 3000);
    }
  };

  const handleCategoryClick = (e) => {
    e.preventDefault();
    const category = categories.find((cat) => cat.categoryID === categoryID);
    if (category) {
      navigate("/search-results", { state: { category } });
    }
  };

  const isAllBooksIncoming = isTopBorrow
    ? false
    : books.every((book) => book.status.statusID === 1);

  console.log("currentIndex", currentIndex);
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
        {isTopBorrow ? (
          <div className="header">
            <a style={{ color: "red" }} href="#">
              Xếp Hạng Sách Mượn Nhiều Nhất
            </a>
          </div>
        ) : (
          <div className="header">
            <a href="#" onClick={handleCategoryClick}>
              {isAllBooksIncoming ? "Sách Chuẩn Bị Nhập" : categoryName}
            </a>
          </div>
        )}

        <div className="slider">
          <button
            className={`prev ${currentIndex === 0 ? "disabled" : ""}`}
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ArrowBackIosIcon />
          </button>
          <div className="book-display">
            {books.slice(currentIndex, currentIndex + 5).map((book, index) => (
              <div className="book" key={index}>
                <Link
                  to={
                    isTopBorrow
                      ? `/BookDetail/${book[0]}`
                      : `/BookDetail/${book.bookID}`
                  }
                >
                  {isTopBorrow ? (
                    <>
                      <div className="detail-book-quantity">
                        <div className="image-container">
                          <img
                            src={`http://localhost:9191/api/books/images/${book[2]}`}
                            alt={book.book_name}
                          />
                        </div>
                        <div className="quantity">
                          <span>{book[3]}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="detail-book-quantity">
                      <div className="image-container">
                        <img
                          src={`http://localhost:9191/api/books/images/${book.bookImage}`}
                          alt={book.bookName}
                        />
                      </div>
                      <div className="quantity">
                        <span>{book.bookQuantity}</span>
                      </div>
                    </div>
                  )}
                  <div>
                    {isAllBooksIncoming ? null : isTopBorrow ? (
                      <>
                        <button
                          style={{
                            backgroundColor: "#28A745",
                            textDecoration: "none",
                          }}
                        >
                          {book[4]} Đã Mượn <MdAssignmentTurnedIn />
                        </button>
                      </>
                    ) : (
                      <button>
                        Chi Tiết <IoInformationCircle />
                      </button>
                    )}
                  </div>
                </Link>
                {!isTopBorrow && book.status.statusID === 1 && (
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
                          Đánh giá
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
