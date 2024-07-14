import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import "react-owl-carousel2/lib/styles.css";
import "react-owl-carousel2/src/owl.carousel.css";
import SlideShow from "./SlideShow";
import { UserContext } from "../../src/ultils/userContext";
import Footer from "../pages/footer/Footer";
import Header from "../pages/nav-bar/Header"; // Correct import
import axios from "axios";

function Main_page() {
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

  const scienceBooks = books.filter(
    (book) => book.category.categoryName === "Khoa học" && book.status.statusID === 5
  );
  const businessBooks = books.filter(
    (book) => book.category.categoryName === "Kinh doanh" && book.status.statusID === 5
  );
  const discoveryBooks = books.filter(
    (book) => book.category.categoryName === "Khám phá" && book.status.statusID === 5
  );
  const historyBooks = books.filter(
    (book) => book.category.categoryName === "Lịch sử" && book.status.statusID === 5
  );
  const growYourSelftBooks = books.filter(
    (book) =>
      book.category.categoryName === "Phát triển bản thân" &&
      book.status.statusID === 5
  );
  const healthBooks = books.filter(
    (book) => book.category.categoryName === "Sức khỏe" && book.status.statusID === 5
  );
  const novelBooks = books.filter(
    (book) =>
      book.category.categoryName === "Tiểu thuyết" && book.status.statusID === 5
  );
  const comicBooks = books.filter(
    (book) =>
      book.category.categoryName === "Truyện tranh" && book.status.statusID === 5
  );
  const incomingBoook = books.filter(book => book.status.statusID === 4);
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
                    WELCOME
                  </span>
                  <h1 className="w-sm-100 w-md-100 w-lg-25 animated fadeInLeft delay-1s">
                    BOOKS <span>LIBRARY</span>
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
                            <h5 className="mt-0">Gợi Ý Sách</h5>
                            <span>BLABLA</span>
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
                <SlideShow books={incomingBoook} />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>
            <div className="App">
              {books.length > 0 ? (
                <SlideShow books={scienceBooks} />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>

            <div className="App">
              {books.length > 0 ? (
                <SlideShow books={businessBooks} />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>

            <div className="App">
              {books.length > 0 ? (
                <SlideShow books={discoveryBooks} />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>
            <div className="App">
              {books.length > 0 ? (
                <SlideShow books={historyBooks} />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>
            <div className="App">
              {books.length > 0 ? (
                <SlideShow books={growYourSelftBooks} />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>
            <div className="App">
              {books.length > 0 ? (
                <SlideShow books={healthBooks} />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>
            <div className="App">
              {books.length > 0 ? (
                <SlideShow books={novelBooks} />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>
            <div className="App">
              {books.length > 0 ? (
                <SlideShow books={comicBooks} />
              ) : (
                <p>Chờ chút...</p>
              )}
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------------------------- */}

        <Footer />

        {/* <!--START Cart Box--> */}
        <div className="cart-box-overlay">
          <a>
            <i className="fas fa-times cross-sign" id="close-window1"></i>
          </a>

          <div className="container">
            <div className="row">
              <div className="search-listing row">
                <div className="col-12 mb-4">
                  <h4 className="">Shop Cart</h4>
                </div>
                <div className="col-12">
                  <div className="listing-search-scroll">
                    <div className="media row">
                      <div className="img-holder ml-1 mr-2 col-4">
                        <a href="#">
                          <img
                            src="book-shop\img\book-1.jpg"
                            className="align-self-center"
                            alt="cartitem"
                          />
                        </a>
                      </div>
                      <div className="media-body mt-auto mb-auto col-8">
                        <h5 className="name">
                          <a href="#">So Sad Today</a>
                        </h5>
                        <p className="category">light wear Lastest</p>
                        <a
                          className="btn black-sm-btn"
                          href="book-shop\shop-cart.html"
                        >
                          <i className="fas fa-shopping-bag"></i>
                        </a>
                        <a className="btn black-sm-btn">
                          <i className="fas fa-eye"></i>
                        </a>
                      </div>
                    </div>
                    <div className="media row">
                      <div className="img-holder ml-1 mr-2 col-4">
                        <a href="#">
                          <img
                            src="book-shop\img\book-2.jpg"
                            className="align-self-center"
                            alt="cartitem"
                          />
                        </a>
                      </div>
                      <div className="media-body mt-auto mb-auto col-8">
                        <h5 className="name">
                          <a href="#">As I Lay Dying</a>
                        </h5>
                        <p className="category">light wear Lastest</p>
                        <a
                          className="btn black-sm-btn"
                          href="book-shop\shop-cart.html"
                        >
                          <i className="fas fa-shopping-bag"></i>
                        </a>
                        <a className="btn black-sm-btn" href="#">
                          <i className="fas fa-eye"></i>
                        </a>
                      </div>
                    </div>
                    <div className="media row">
                      <div className="img-holder ml-1 mr-2 col-4">
                        <a href="#">
                          <img
                            src="book-shop\img\book-3.jpg"
                            className="align-self-center"
                            alt="cartitem"
                          />
                        </a>
                      </div>
                      <div className="media-body mt-auto mb-auto col-8">
                        <h5 className="name">
                          <a href="#">Love Does</a>
                        </h5>
                        <p className="category">light wear Lastest</p>
                        <a
                          className="btn black-sm-btn"
                          href="book-shop\shop-cart.html"
                        >
                          <i className="fas fa-shopping-bag"></i>
                        </a>
                        <a className="btn black-sm-btn" href="#">
                          <i className="fas fa-eye"></i>
                        </a>
                      </div>
                    </div>
                    <div className="media row">
                      <div className="img-holder ml-1 mr-2 col-4">
                        <a href="#">
                          <img
                            src="book-shop\img\book-2-1.jpg"
                            className="align-self-center"
                            alt="cartitem"
                          />
                        </a>
                      </div>
                      <div className="media-body mt-auto mb-auto col-8">
                        <h5 className="name">
                          <a href="#">The Last Stand</a>
                        </h5>
                        <p className="category">light wear Lastest</p>
                        <a
                          className="btn black-sm-btn"
                          href="book-shop\shop-cart.html"
                        >
                          <i className="fas fa-shopping-bag"></i>
                        </a>
                        <a className="btn black-sm-btn" href="#">
                          <i className="fas fa-eye"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bag-btn">
              <h4 className="total">
                <span>Total: </span>100$
              </h4>
              <a href="#" className="btn green-color-yellow-gradient-btn">
                View Bag{" "}
              </a>
              <a href="#" className="btn yellow-color-green-gradient-btn">
                Checkout{" "}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main_page;
