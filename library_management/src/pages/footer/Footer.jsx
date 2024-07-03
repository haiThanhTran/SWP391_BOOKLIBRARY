import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "react-owl-carousel2/lib/styles.css";
import "react-owl-carousel2/src/owl.carousel.css";
import SlideShow from "../SlideShow";
import { UserContext } from "../../ultils/userContext";

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="row footer-container">
          <div className="col-sm-12 col-lg-4 f-sec1 text-center text-lg-left">
            <h4 className="high-lighted-heading">About Us</h4>
            <p>
              We take our mission of increasing our global access to quality
              education seriously.{" "}
            </p>
            <a href="#">Read more</a>
            <h4>Social Network</h4>
            <div className="s-icons">
              <ul className="social-icons-simple">
                <li>
                  <a href="#" className="facebook-bg-hvr">
                    <i className="fab fa-facebook-f" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="twitter-bg-hvr">
                    <i className="fab fa-twitter" aria-hidden="true"></i>
                  </a>{" "}
                </li>
                <li>
                  <a href="#" className="instagram-bg-hvr">
                    <i className="fab fa-instagram" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-sm-12 col-lg-5 f-sec2">
            <div className="row">
              <div className="col-12 col-md-6">
                <h4 className="text-center text-md-left">Information</h4>
                <ul className="text-center text-md-left">
                  <li>
                    <a href="#">About Us</a>
                  </li>
                  <li>
                    <a href="#">Delivery Information</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#">Terms & Condition</a>
                  </li>
                  <li>
                    <a href="#">FAQ</a>
                  </li>
                  <li>
                    <a href="book-shop\contact.html">Contact Us</a>
                  </li>
                  <li>
                    <a href="book-shop\product-listing.html">Products</a>
                  </li>
                </ul>
              </div>
              <div className="col-12 col-md-6">
                <h4 className="text-center text-md-left">Account Info</h4>
                <ul className="text-center text-md-left">
                  <li>
                    <a href="#">Login & Register</a>
                  </li>
                  <li>
                    <a href="book-shop\shop-cart.html">Order History</a>
                  </li>
                  <li>
                    <a href="#">Shipping Info</a>
                  </li>
                  <li>
                    <a href="#">Refund Policy</a>
                  </li>
                  <li>
                    <a href="#">Responsive Website</a>
                  </li>
                  <li>
                    <a href="#">Subscription</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-lg-3 f-sec3 text-center text-lg-left">
            <h4>Our Portfolio</h4>
            <div className="foot-tag-list">
              <span>Classic</span>
              <span>Journal</span>
              <span>History</span>
              <span>Poetry</span>
              <span>Dictionary</span>
              <span>Shopping</span>
              <span>Fantasy</span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 footer_notes">
            <p className="whitecolor text-center w-100 wow fadeInDown">
              &copy; 2020 MegaOne. Made With Love by{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
