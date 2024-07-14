import React, { useState, useEffect } from "react";
import { BiSolidCategory } from "react-icons/bi";
import { FaBookmark, FaRegEdit } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Header from "../nav-bar/Header";
import Footer from "../footer/Footer";
import "./UIConfig/css/ManageBook.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageBook = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("All");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getAllBooks = async () => {
    try {
      const response = await fetch(`http://localhost:9191/api/books`);
      const books = await response.json();
      setBooks(books);
      setFilteredBooks(books); // Initially show all books
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await fetch(`http://localhost:9191/api/categories`);
      const categories = await response.json();
      setCategories([
        { categoryID: null, categoryName: "Tất cả" },
        ...categories,
      ]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getAllBooks();
    getAllCategories();
  }, []);

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleEditClick = () => {
    if (selectedBook) {
      navigate(`/updatebookform/${selectedBook.bookID}`, {
        state: { book: selectedBook },
      });
    } else {
      console.log("No book selected");
    }
  };

  const handleDeleteClick = async () => {
    if (selectedBook) {
      if (
        !window.confirm(
          `Are you sure you want to delete ${selectedBook.bookName}?`
        )
      ) {
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:9191/api/books/${selectedBook.bookID}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setBooks(books.filter((book) => book.bookID !== selectedBook.bookID));
          setFilteredBooks(filteredBooks.filter((book) => book.bookID !== selectedBook.bookID));
          setSelectedBook(null);

          toast.success(`Book ${selectedBook.bookName} deleted successfully!`, {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          toast.error("Failed to delete book. Please try again.", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } catch (error) {
        console.error("Error deleting book:", error);
        toast.error("An error occurred while deleting the book.", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } else {
      console.log("No book selected");
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category.categoryID === null) {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter(book => book.category.categoryID === category.categoryID));
    }
  };

  const handleSearch = async () => {
    try {
      let response;
      if (searchOption === "Book name") {
        response = await fetch(
          `http://localhost:9191/api/books/search-by-bookname?book_name=${searchTerm}`
        );
      } else if (searchOption === "ID") {
        response = await fetch(`http://localhost:9191/api/books/${searchTerm}`);
      } else {
        response = await fetch(`http://localhost:9191/api/books`);
      }

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Book not found."); 
        } else {
          throw new Error(`HTTP Error: ${response.status}`);
        }
      }

      const books = await response.json();

      if (searchOption === "ID" && !Array.isArray(books)) {
        setFilteredBooks([books]);
      } else {
        setFilteredBooks(Array.isArray(books) ? books : []); 
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error(`Error: ${error.message}`, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      {/* <Header /> */}
      <div className="manage-book-page-managebook">
        <div className="sidebar-managebook">
          <div className="search-bar-managebook">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={searchOption}
              onChange={(e) => setSearchOption(e.target.value)}
            >
              <option value="All">All</option>
              <option value="ID">ID</option>
              <option value="Book name">Book name</option>
            </select>
            <button onClick={handleSearch}>Search</button>
          </div>
          <h2>Actions</h2>
          <div className="book-actions-managebook">
            <div className="book-actions-top-managebook">
              <button
                className="btn-add-managebook"
                onClick={() => navigate("/addbookform")}
              >
                Add <FaBookmark />
              </button>
              <button
                className="btn-detail-managebook"
                onClick={() => navigate(`/bookdetail/${selectedBook?.bookID}`)}
                disabled={!selectedBook}
              >
                Detail <IoInformationCircle />
              </button>
            </div>
            <div className="book-actions-bottom-managebook">
              <button
                className="btn-edit-managebook"
                onClick={handleEditClick}
                disabled={!selectedBook}
              >
                Edit <FaRegEdit />
              </button>
              <button
                className="btn-delete-managebook"
                onClick={handleDeleteClick}
                disabled={!selectedBook}
              >
                Delete <MdDelete />
              </button>
            </div>
          </div>
          <h2>Categories</h2>
          {categories.map((category) => (
            <div
              className={`category-managebook ${
                selectedCategory === category ? "selected" : ""
              }`}
              key={category.categoryID}
              onClick={() => handleCategoryClick(category)}
              style={{ cursor: "pointer" }}
            >
              <BiSolidCategory className="icon-managebook" />
              <span className="category-managebook-categoryName">
                {category.categoryName}
              </span>
            </div>
          ))}
        </div>
        <div className="book-grid-managebook">
          {filteredBooks.map((book) => (
            <div
              className={`book-item-managebook ${
                selectedBook === book ? "selected" : ""
              }`} // Apply selected class only to the book item
              key={book.bookID}
              onClick={() => handleBookClick(book)}
            >
              <img
                src={`http://localhost:9191/api/books/images/${book.bookImage}`}
                alt={book.bookName}
              />
              <p className="book-name-managebook">{book.bookName}</p>
              <p className="book-star-managebook">Voted {book.bookStar}</p>
              <p
                className={`book-quantity-managebook ${
                  book.bookQuantity > 0 ? "available" : "unavailable"
                }`}
              >
                {book.bookQuantity > 0 ? `${book.bookQuantity}` : "Unavailable"}
              </p>
              <p className="book-category-managebook">
                Category: {book.category.categoryName}
              </p>
              {selectedBook === book && (
                <div className="book-item-actions">
                  <button
                    className="btn-detail-managebook"
                    onClick={() => navigate(`/bookdetail/${selectedBook?.bookID}`)}
                    disabled={!selectedBook}
                  >
                    Detail <IoInformationCircle />
                  </button>
                  <button
                    className="btn-edit-managebook"
                    onClick={handleEditClick}
                    disabled={!selectedBook}
                  >
                    Edit <FaRegEdit />
                  </button>
                  <button
                    className="btn-delete-managebook"
                    onClick={handleDeleteClick}
                    disabled={!selectedBook}
                  >
                    Delete <MdDelete />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default ManageBook;
