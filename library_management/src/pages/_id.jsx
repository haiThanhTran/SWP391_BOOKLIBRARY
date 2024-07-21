import React, { useState, useEffect, useContext } from "react";
import "react-owl-carousel2/lib/styles.css";
import "react-owl-carousel2/src/owl.carousel.css";
import SlideShow from "./SlideShow";
import Footer from "../pages/footer/Footer";
import Header from "../pages/nav-bar/Header"; // Correct import
import axios from "axios";

function Main_page() {
  const [books, setBooks] = useState([]);
  //
  const [topBorrow, setTopBorrow] = useState([]);

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
    const fetchTopBorrow = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9191/api/orders/top-5-borrowed-books"
        );
        setTopBorrow(response.data);
        console.log("top borrow api: ", response.data);
      } catch (error) {
        console.error("Fetch top borrow failed:", error);
      }
    };
    fetchTopBorrow();
  }, []);

  const categoryMap = {
    "Khoa học": 1,
    "Kinh doanh": 2,
    "Khám phá": 3,
    "Lịch sử": 4,
    "Phát triển bản thân": 5,
    "Sức khỏe": 6,
    "Tiểu thuyết": 7,
    "Truyện tranh": 8,
  };

  const scienceBooks = books.filter(
    (book) =>
      book.category.categoryID === categoryMap["Khoa học"] &&
      book.status.statusID === 2
  );
  const businessBooks = books.filter(
    (book) =>
      book.category.categoryID === categoryMap["Kinh doanh"] &&
      book.status.statusID === 2
  );
  const discoveryBooks = books.filter(
    (book) =>
      book.category.categoryID === categoryMap["Khám phá"] &&
      book.status.statusID === 2
  );
  const historyBooks = books.filter(
    (book) =>
      book.category.categoryID === categoryMap["Lịch sử"] &&
      book.status.statusID === 2
  );
  const growYourSelftBooks = books.filter(
    (book) =>
      book.category.categoryID === categoryMap["Phát triển bản thân"] &&
      book.status.statusID === 2
  );
  const healthBooks = books.filter(
    (book) =>
      book.category.categoryID === categoryMap["Sức khỏe"] &&
      book.status.statusID === 2
  );
  const novelBooks = books.filter(
    (book) =>
      book.category.categoryID === categoryMap["Tiểu thuyết"] &&
      book.status.statusID === 2
  );
  const comicBooks = books.filter(
    (book) =>
      book.category.categoryID === categoryMap["Truyện tranh"] &&
      book.status.statusID === 2
  );

  const incomingBoook = books.filter((book) => book.status.statusID === 1);
  console.log("incomingBoook: ", incomingBoook);

  return (
    <>
      <div>
        {/* Nav bar */}
        <Header />

        {/* ảnh to */}
        <div className="homer-banner">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center text-center text-lg-left">
                <div className="banner-description">
                  <span className="small-heading animated fadeInRight delay-1s">
                    CHÀO MỪNG BẠN ĐẾN VỚI
                  </span>
                  <h1 className="w-sm-100 w-md-100 w-lg-25 animated fadeInLeft delay-1s">
                    Thư Viện <span>Đặt Sách</span>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* //Body */}
        {/* ---------------------------------------------------------------------------------- */}

        <div className="body-page">
          <div className="book-content">
            <div className="our-services">
              <h5 className="header-title">Thư Viện Giáo Dục</h5>
              <div className="container">
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-3">
                    <div className="service">
                      <div className="media">
                        <div className="service-card">
                          <i className="fas fa-bolt fa-solid mr-3"></i>
                          <div className="media-body">
                            <h5 className="mt-0">Mượn Sách Nhanh Chóng</h5>
                            <span>Dưới 2 phút</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-3">
                    <div className="service">
                      <div className="media">
                        <div className="service-card">
                          <i className="fas fa-undo mr-3"></i>
                          <div className="media-body">
                            <h5 className="mt-0">Thủ Tục Đơn Giản</h5>
                            <span>Khách Hàng Tiết Kiệm Thời Gian</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-3">
                    <div className="service">
                      <div className="media">
                        <div className="service-card">
                          <i className="fas fa-piggy-bank mr-3"></i>
                          <div className="media-body">
                            <h5 className="mt-0">Tài Nguyên Sách Dồi Dào</h5>
                            <span>Cung Cấp Nhiều Danh Mục Sách</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-3">
                    <div className="service">
                      <div className="media">
                        <div className="service-card">
                          <i className="fas fa-hands-helping mr-3"></i>
                          <div className="media-body">
                            <h5 className="mt-0">Trợ Giúp và Phản Hồi</h5>
                            <span>Tel: 0969494571</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="App">
              {books.length > 0 ? (
                <SlideShow books={incomingBoook} categoryID={null} />
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="App">
              {topBorrow.length > 0 ? (
                <SlideShow
                  books={topBorrow}
                  categoryID={null}
                  isTopBorrow={true}
                />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>
            <div className="App">
              {books.length > 0 ? (
                <SlideShow
                  books={scienceBooks}
                  categoryID={categoryMap["Khoa học"]}
                />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>

            <div className="App">
              {books.length > 0 ? (
                <SlideShow
                  books={businessBooks}
                  categoryID={categoryMap["Kinh doanh"]}
                />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>

            <div className="App">
              {books.length > 0 ? (
                <SlideShow
                  books={discoveryBooks}
                  categoryID={categoryMap["Khám phá"]}
                />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>
            <div className="App">
              {books.length > 0 ? (
                <SlideShow
                  books={historyBooks}
                  categoryID={categoryMap["Lịch sử"]}
                />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>
            <div className="App">
              {books.length > 0 ? (
                <SlideShow
                  books={growYourSelftBooks}
                  categoryID={categoryMap["Phát triển bản thân"]}
                />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>
            <div className="App">
              {books.length > 0 ? (
                <SlideShow
                  books={healthBooks}
                  categoryID={categoryMap["Sức khỏe"]}
                />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>
            <div className="App">
              {books.length > 0 ? (
                <SlideShow
                  books={novelBooks}
                  categoryID={categoryMap["Tiểu thuyết"]}
                />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>
            <div className="App">
              {books.length > 0 ? (
                <SlideShow
                  books={comicBooks}
                  categoryID={categoryMap["Truyện tranh"]}
                />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------------------------- */}

        <Footer />
      </div>
    </>
  );
}

export default Main_page;
