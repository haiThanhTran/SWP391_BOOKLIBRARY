import React from "react";
import "react-owl-carousel2/lib/styles.css";
import "react-owl-carousel2/src/owl.carousel.css";
import "./Footer.css"; // Updated path

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="row footer-container" style={{ padding: "0px" }}>
          <div className="col-sm-12 col-lg-3 f-sec1 text-center text-lg-left">
            <h4 className="high-lighted-heading">Thông tin thư viện</h4>
            <p>
            Sứ mệnh của chúng tôi là cung cấp quyền truy cập dễ dàng vào các tài nguyên giáo dục cho cộng đồng toàn cầu của chúng tôi.
            </p>
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
                  </a>
                </li>
                <li>
                  <a href="#" className="instagram-bg-hvr">
                    <i className="fab fa-instagram" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-sm-12 col-lg-3 f-sec1 text-center text-lg-left">
            <h4 className="high-lighted-heading">Library Information</h4>
            <p>
              Our mission is to provide easy access to educational resources for
              our global community.
            </p>
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
                  </a>
                </li>
                <li>
                  <a href="#" className="instagram-bg-hvr">
                    <i className="fab fa-instagram" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-sm-12 col-lg-3 f-sec3 text-center text-lg-left">
            <h4>Contact Us</h4>
            <p>Email: library@school.edu</p>
            <p>Phone: (123) 456-7890</p>
            <h4>Our Location</h4>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.084164429015!2d105.52478061488374!3d21.014110201639785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abc60e7d3f19%3A0x2be980c9e83b9786!2zRlBUIFVuaXZlcnNpdHkgSGEgTm9pIChDYW1wdXMgSG9hIExhYyk!5e0!3m2!1sen!2s!4v1624081840203!5m2!1sen!2s"
              width="300"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
