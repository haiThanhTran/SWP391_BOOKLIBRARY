import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet";
import Signup from "./UIConfig/images/Signup.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "../../ultils/userContext";

function Signin() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { handleLoginSuccess } = useContext(UserContext);

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const forgotForm = () => {
    navigate("/forgotPass");
  };

  const validationSchema = yup.object({
    your_name: yup.string().required("Email Không Được Để Trống"),
    your_pass: yup.string().required("Mật Khẩu Không Được Để Trống"),
  });

  const formik = useFormik({
    initialValues: {
      your_name: "",
      your_pass: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setError("");
      try {
        const response = await axios.post(
          "http://localhost:9191/api/auth/login",
          {
            user_name: values.your_name,
            user_pass: values.your_pass,
          }
        );
        if (response.status === 200) {
          const user = response.data;
          await handleLoginSuccess(user);
          localStorage.setItem("token", user.token);
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/");
        } else {
          setError("Login failed, please try again.");
        }
      } catch (err) {
        console.error("Login error:", err);
        setError(err.response?.data || "Đăng nhập không thành công");
      }
    },
  });

  return (
    <div className="main">
      <Helmet>
        <script src="src/pages/authen/UIConfig/vendor/jquery/jquery.min.js"></script>
        <script src="src/pages/authen/UIConfig/js/main.js"></script>
        <link
          rel="stylesheet"
          href="src/pages/authen/UIConfig/fonts/material-icon/css/Material-design-iconic-font.min.css"
        />
        <link rel="stylesheet" href="src/pages/authen/UIConfig/css/Style.css" />
      </Helmet>
      <section className="sign-in">
        <div className="container">
          <div className="signin-content">
            <div className="signin-image">
              <figure>
                <img src={Signup} alt="sign up image" />
              </figure>
              <a
                onClick={handleSignUpClick}
                className="signup-image-link routeAuthen-around"
              >
                Tạo Tài Khoản Mới
              </a>
            </div>

            <div className="signin-form">
              <h2 className="form-title">Đăng Nhập</h2>
              <form
                method="POST"
                className="register-form"
                id="login-form"
                onSubmit={formik.handleSubmit}
              >
                <div className="form-group">
                  <label htmlFor="your_name">
                    <i className="zmdi zmdi-account material-icons-name"></i>
                  </label>
                  <input
                    type="email"
                    name="your_name"
                    id="your_name"
                    placeholder="Email"
                    {...formik.getFieldProps("your_name")}
                  />
                  {formik.touched.your_name && formik.errors.your_name ? (
                    <div className="text-danger">{formik.errors.your_name}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="your_pass">
                    <i className="zmdi zmdi-lock"></i>
                  </label>
                  <input
                    type="password"
                    name="your_pass"
                    id="your_pass"
                    placeholder="Mật Khẩu"
                    {...formik.getFieldProps("your_pass")}
                  />
                  {formik.touched.your_pass && formik.errors.your_pass ? (
                    <div className="text-danger">{formik.errors.your_pass}</div>
                  ) : null}
                </div>

                <div className="form-group">
                  <p className="forgot" onClick={forgotForm}>
                    Quên Mật Khẩu
                  </p>
                </div>

                <div className="form-group">
                  <input
                    type="checkbox"
                    name="remember-me"
                    id="remember-me"
                    className="agree-term"
                  />
                  <label htmlFor="remember-me" className="label-agree-term">
                    <span>
                      <span></span>
                    </span>
                    Ghi Nhớ Đăng Nhập
                  </label>
                </div>
                <div className="form-group form-button">
                  <input
                    type="submit"
                    name="signin"
                    id="signin"
                    className="form-submit"
                    value="Đăng Nhập"
                  />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
              </form>

              {/* <div className="social-login">
                <span className="social-label">Or login with</span>
                <ul className="socials">
                  <li>
                    <a href="#">
                      <i className="display-flex-center zmdi zmdi-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="display-flex-center zmdi zmdi-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="display-flex-center zmdi zmdi-google"></i>
                    </a>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Signin;
