import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../pages/footer/Footer";
import Header from "../pages/nav-bar/Header";
import { IoInformationCircle } from "react-icons/io5";
import ReactPaginate from "react-paginate";

const SearchResults = () => {
  const NextIcon = () => (
    <svg
      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="ArrowForwardIosIcon"
      style={{ padding: 0 }}
    >
      <path d="M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z"></path>
    </svg>
  );

  const PrevIcon = () => (
    <svg
      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="ArrowBackIosIcon"
      style={{ padding: 0 }}
    >
      <path d="M11.67 3.87 9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"></path>
    </svg>
  );

  const location = useLocation();
  const navigate = useNavigate();
  const { category, searchTerm, searchOption, books: initialBooks } = location.state || {};

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(3);
  const [bookList, setBookList] = useState(initialBooks || []);
  const offset = currentPage * itemsPerPage;
  const currentPageData = Array.isArray(bookList) ? bookList.slice(offset, offset + itemsPerPage) : [];
  const pageCount = Math.ceil(bookList.length / itemsPerPage);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let response;
        if (category) {
          response = await fetch(`http://localhost:9191/api/books/search-by-category?categoryID=${category.categoryID}`);
        } else if (searchOption === "Book name") {
          response = await fetch(`http://localhost:9191/api/books/search-by-bookname?book_name=${searchTerm}`);
        } else if (searchOption === "Author") {
          response = await fetch(`http://localhost:9191/api/books/search-by-author?book_author=${searchTerm}`);
        } else {
          response = await fetch("http://localhost:9191/api/books");
        }

        if (response.ok) {
          const data = await response.json();
          setBookList(data);
        } else {
          setBookList([]);
          console.error("Error fetching books:", response.statusText);
        }
      } catch (error) {
        setBookList([]);
        console.error("Error fetching search results:", error);
      }
    };

    fetchBooks();
  }, [category, searchTerm, searchOption]);

  useEffect(() => {
    if (!searchTerm && !searchOption && !category) {
      navigate("/");
    }
  }, [searchTerm, searchOption, category, navigate]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  if (!searchTerm && !searchOption && !category) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="search-results-page">
        <div className="results-header">
          <p>
            {bookList.length}{" "}
            {category
              ? `sách trong hạng mục "${category.categoryName}"`
              : searchOption === "All"
              ? `sách tìm được`
              : `sách với từ khóa "${searchTerm}"`}
          </p>
        </div>
        <ul className="book-list">
          {currentPageData.length > 0 ? (
            currentPageData.map((book) => (
              <li key={book.bookID} className="book-item">
                <div className="book-info">
                  <img
                    src={`http://localhost:9191/api/books/images/${book.bookImage}`}
                    alt={book.bookName}
                    className="book-cover"
                    onClick={() => navigate(`/BookDetail/${book.bookID}`)}
                    style={{ cursor: "pointer" }}
                  />
                  <div className="book-details">
                    <div className="detail book-description">
                      <p className="detail book-name">{book.bookName}</p>
                      <p className="detail book-author">by {book.bookAuthor}</p>
                      <p className="detail book-published">
                        First published in {book.publishedYear}
                      </p>
                      <p
                        className={`detail book-quantity ${
                          book.bookQuantity > 0 ? "available" : "unavailable"
                        }`}
                      >
                        {book.bookQuantity > 0
                          ? `${book.bookQuantity}`
                          : "Unavailable"}
                      </p>
                      <p className="detail book-category">
                        Category: {book.category.categoryName}
                      </p>
                    </div>
                  </div>
                  <div className="book-actions">
                    <div className="book-actions-detail">
                      <button
                        className="btn-detail"
                        onClick={() => navigate(`/BookDetail/${book.bookID}`)}
                      >
                        See Detail <IoInformationCircle />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p>No results found</p>
          )}
        </ul>
        {bookList.length > itemsPerPage && (
          <ReactPaginate
            previousLabel={<PrevIcon />}
            nextLabel={<NextIcon />}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
            previousClassName={"prev"}
            previousLinkClassName={"prev "}
            nextClassName={"next"}
            nextLinkClassName={"next "}
            disabledClassName={"disabled"}
          />
        )}
        <Footer />
      </div>
    </>
  );
};

export default SearchResults;
