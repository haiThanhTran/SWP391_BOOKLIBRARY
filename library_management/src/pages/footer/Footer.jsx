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
              Sứ mệnh của chúng tôi là cung cấp quyền truy cập dễ dàng vào các
              tài nguyên giáo dục cho cộng đồng toàn cầu của chúng tôi.
            </p>
            <h4>Mạng xã hội</h4>
            <div className="s-icons">
              <ul className="social-icons-simple">
                <li>
                  <a
                    href="https://www.facebook.com/thuvienfu"
                    className="facebook-bg-hvr"
                  >
                    <i className="fab fa-facebook-f" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@fptuhanoilibrary8612"
                    className="youtube-bg-hvr"
                  >
                    <i className="fab fa-youtube" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@fptuhanoilibrary8612"
                    className="instagram-bg-hvr"
                  >
                    <i className="fab fa-instagram" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-sm-12 col-lg-3 f-sec1 text-center text-lg-left">
            <h4 className="high-lighted-heading">Danh ngôn</h4>
            <p>
              “Sách là phép màu độc nhất và diệu kỳ trong đời thực” – Stephen
              King
            </p>
            <img
              src="https://cafefcdn.com/203337114487263232/2023/7/20/298906574101590302134476847005733038478640968n-16898915637541351616271-1689866422690-16898664227691326815476.jpg"
              alt=""
              style={{minWidth:"300px",minHeight:"200px"}}
            />
          </div>
          <div className="col-sm-12 col-lg-3 f-sec3 text-center text-lg-left">
            <h4>Liên hệ</h4>
            <p>Email: libraryfpt@fpt.edu</p>
            <p>SĐT: 0969494570</p>
            <h4>Địa điểm</h4>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.084164429015!2d105.52478061488374!3d21.014110201639785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abc60e7d3f19%3A0x2be980c9e83b9786!2zRlBUIFVuaXZlcnNpdHkgSGEgTm9pIChDYW1wdXMgSG9hIExhYyk!5e0!3m2!1sen!2s!4v1624081840203!5m2!1sen!2s"
              width="300"
              height="200"
              style={{ border: 0,minWidth:"300px",minHeight:"200px" }}
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
