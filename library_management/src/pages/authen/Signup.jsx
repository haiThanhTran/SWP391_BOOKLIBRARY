import { Helmet } from "react-helmet";
import React from "react";
import Signin from "./UIConfig/images/Signin.jpg";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import axios from "axios";
import { API_ROOT } from "../../ultils/constants";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const API_ROOT = "http://localhost:9191/register";
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);

  // Role mapping
  const roleMapping = {
    CUSTOMER: 1,
    STAFF: 2,
    ADMIN: 3,
  };

  // API Columns
  const createNewAccountApi = async (newAccountData) => {
    setMessage("");
    setIsLoading(true);
    try {
      const response = await axios.post(API_ROOT, newAccountData);
      return response.data;
      setError("");
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const [sub, setSub] = useState(false);
  const onSub = async (values) => {
    // Map role string to role ID
    const roleID = roleMapping[values.role];
    const payload = { ...values, role: roleID, captchaToken, flag: initialvalues.flag }; // Thêm flag vào payload

    if (!captchaToken) {
      setError("Please complete the reCAPTCHA");
      return;
    }

    try {
      const response = await createNewAccountApi(payload);
      setError("");
      setMessage("Please verify your email");
      setSub(true);
      console.log("Register success:", response);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError(error.response.data);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  const initialvalues = {
    userName: "",
    userMail: "",
    userPhone: "",
    userPass: "",
    confPassword: "",
    role: "CUSTOMER",
    agreeTerm: false,
    flag: 1, // Giá trị mặc định cho flag
  };

  const vScheme = {
    userName: yup.string().required("Họ và tên không được để trống"),
    userMail: yup.string().required().email("Email không được để trống"),
    userPass: yup
      .string()
      .required("Mật khẩu không thể trống")
      .matches(/[a-zA-Z0-9]{8,}$/, "Vui lòng đặt đúng định dạng mật khẩu"),
    confPassword: yup.string().required("required"),
    userPhone: yup
      .number()
      .typeError("That doesn't look like a userPhone number")
      .positive("A userPhone number can't start with a minus")
      .integer("A userPhone number can't include a decimal point")
      .min(8)
      .required("SĐT không được để trống"),
  };

  const LoginForm = useFormik({
    initialValues: initialvalues,
    onSubmit: onSub,
    validationSchema: yup.object(vScheme),
  });

  const [confirmFlag, setconfirmFlag] = useState(false);
  const [pass, setPass] = useState();

  const checkConfirm = (event) => {
    if (event.target.value === pass) {
      setconfirmFlag(true);
    } else {
      setconfirmFlag(false);
    }
  };

  const setPassword = (event) => {
    setPass(event.target.value);
  };

  return (
    <div className="main">
      <Helmet>
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
        <script src="src/pages/authen/UIConfig/vendor/jquery/jquery.min.js"></script>
        <script src="src/pages/authen/UIConfig/js/main.js"></script>
        <link
          rel="stylesheet"
          href="src/pages/authen/UIConfig/fonts/material-icon/css/Material-design-iconic-font.min.css"
        />
        <link rel="stylesheet" href="src/pages/authen/UIConfig/css/Style.css" />
      </Helmet>
      <section className="signup">
        <div className="container">
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title">Đăng ký</h2>
              <form
                method="POST"
                className="register-form"
                id="register-form"
                onSubmit={LoginForm.handleSubmit}
              >
                <div className="form-group">
                  <label htmlFor="name">
                    <i className="zmdi zmdi-account material-icons-name"></i>
                  </label>
                  <input
                    type="text"
                    name="userName"
                    id="name"
                    placeholder="Họ & Tên"
                    {...LoginForm.getFieldProps("userName")}
                  />
                  {LoginForm.touched.userName && LoginForm.errors.userName && (
                    <div className="text-danger">{LoginForm.errors.userName}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="zmdi zmdi-email"></i>
                  </label>
                  <input
                    type="email"
                    name="userMail"
                    id="email"
                    placeholder="Email"
                    {...LoginForm.getFieldProps("userMail")}
                  />
                  {LoginForm.touched.userMail && LoginForm.errors.userMail && (
                    <div className="text-danger">{LoginForm.errors.userMail}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="userPhone">
                    <i className="zmdi zmdi-phone"></i>
                  </label>
                  <input
                    type="text"
                    name="userPhone"
                    id="userPhone"
                    placeholder="Điện Thoại"
                    {...LoginForm.getFieldProps("userPhone")}
                  />
                  {LoginForm.touched.userPhone && LoginForm.errors.userPhone && (
                    <div className="text-danger">{LoginForm.errors.userPhone}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="pass">
                    <i className="zmdi zmdi-lock"></i>
                  </label>
                  <input
                    type="password"
                    name="userPass"
                    id="pass"
                    placeholder="Mật Khẩu"
                    onKeyUp={setPassword}
                    {...LoginForm.getFieldProps("userPass")}
                  />
                  {LoginForm.touched.userPass && LoginForm.errors.userPass && (
                    <div className="text-danger">{LoginForm.errors.userPass}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="re-pass">
                    <i className="zmdi zmdi-lock-outline"></i>
                  </label>
                  <input
                    type="password"
                    name="confPassword"
                    id="re_pass"
                    placeholder="Nhập Lại Mật Khẩu"
                    onKeyUp={checkConfirm}
                    {...LoginForm.getFieldProps("confPassword")}
                  />
                  {LoginForm.touched.confPassword && confirmFlag === false && (
                    <div className="text-danger">
                      Mật khẩu nhập lại không đúng
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="checkbox"
                    name="agreeTerm"
                    id="agree-term"
                    className="agree-term"
                    {...LoginForm.getFieldProps("agreeTerm")}
                  />
                  <label htmlFor="agree-term" className="label-agree-term">
                    <span>
                      <span></span>
                    </span>
                    Tôi đồng ý với tất cả{" "}
                    <a href="#" className="term-service">
                      Điều Khoản
                    </a>
                  </label>
                  {LoginForm.touched.agreeTerm && LoginForm.errors.agreeTerm && (
                    <div className="text-danger">{LoginForm.errors.agreeTerm}</div>
                  )}
                </div>
                <div className="form-group">
                  <ReCAPTCHA
                    sitekey="6LdjERUqAAAAAA3VukqzruuImsBySPPHcQb4Onu9"
                    onChange={(token) => setCaptchaToken(token)}
                  />
                </div>
                <div className="form-group form-button">
                  <input
                    type="submit"
                    name="signup"
                    id="signup"
                    className="form-submit"
                    value="Đăng Ký"
                  />
                </div>
              </form>
              {isLoading ? <p>Waiting...</p> : message && <p>{message}</p>}
              {error && <div className="text-failed">{error}</div>}
              {sub && <div className="text-success">Success Register</div>}
            </div>
            <div className="signup-image">
              <figure>
                <img src={Signin} alt="sign up image" />
              </figure>
              <a href="/signin" className="signup-image-link">
                Đã có tài khoản? Đăng nhập ngay
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
