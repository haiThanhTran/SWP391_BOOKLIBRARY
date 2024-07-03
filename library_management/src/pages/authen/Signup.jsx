import { Helmet } from "react-helmet";
import React from "react";
import Signin from "./UIConfig/images/Signin.jpg";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import axios from "axios";
import { API_ROOT } from "../../ultils/constants";

function Login() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const API_ROOT = "http://localhost:9191/register";
  const [error, setError] = useState("");

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
  console.log();
  const onSub = async (values) => {
    // Map role string to role ID
    const roleID = roleMapping[values.role];
    const payload = { ...values, role: roleID };

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
    isAdmin: false,
    isManager: false,
    active: false,
  };

  const vScheme = {
    userName: yup.string().required(),
    userMail: yup.string().required().email("invalid Email"),
    userPass: yup
      .string()
      .required("required")
      .matches(/[a-zA-Z0-9]{8,}$/, "invalid Password"),
    confPassword: yup.string().required("required"),
    userPhone: yup
      .number()
      .typeError("That doesn't look like a userPhone number")
      .positive("A userPhone number can't start with a minus")
      .integer("A userPhone number can't include a decimal point")
      .min(8)
      .required("A userPhone number is required"),
  };

  const LoginForm = useFormik({
    initialValues: initialvalues,
    onSubmit: onSub, // Định nghĩa hàm xử lý khi form được submit
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
              <h2 className="form-title">Sign up</h2>
              {/* Form post */}
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
                    name="name"
                    id="name"
                    placeholder="Your Name"
                    {...LoginForm.getFieldProps("userName")}
                  />
                  {LoginForm.touched.userName && LoginForm.errors.userName && (
                    <div className="text-danger">
                      {LoginForm.errors.userName}
                    </div>
                  )}
                </div>
                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="zmdi zmdi-email"></i>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Your Email"
                    {...LoginForm.getFieldProps("userMail")}
                  />
                  {LoginForm.touched.email && LoginForm.errors.email && (
                    <div className="text-danger">{LoginForm.errors.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="userPhone">
                    <i className="zmdi zmdi-phone"></i>
                  </label>
                  <input
                    type="phone"
                    name="userPhone"
                    id="userPhone"
                    placeholder="Your Phone"
                    {...LoginForm.getFieldProps("userPhone")}
                  />
                  {LoginForm.touched.userPhone &&
                    LoginForm.errors.userPhone && (
                      <div className="text-danger">
                        {LoginForm.errors.userPhone}
                      </div>
                    )}
                </div>
                <div className="form-group">
                  <label htmlFor="pass">
                    <i className="zmdi zmdi-lock"></i>
                  </label>
                  <input
                    type="password"
                    name="pass"
                    id="pass"
                    placeholder="Password"
                    onKeyUp={setPassword}
                    {...LoginForm.getFieldProps("userPass")}
                  />
                  {LoginForm.touched.userPass && LoginForm.errors.userPass && (
                    <div className="text-danger">
                      {LoginForm.errors.userPass}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="re-pass">
                    <i className="zmdi zmdi-lock-outline"></i>
                  </label>
                  <input
                    type="password"
                    name="re_pass"
                    id="re_pass"
                    placeholder="Repeat your userPass"
                    onKeyUp={checkConfirm}
                    {...LoginForm.getFieldProps("confPassword")}
                  />
                  {LoginForm.touched.confPassword && confirmFlag === false && (
                    <div className="text-danger">Passwords do not match</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="checkbox"
                    name="agree-term"
                    id="agree-term"
                    className="agree-term"
                  />
                  <label htmlFor="agree-term" className="label-agree-term">
                    <span>
                      <span></span>
                    </span>
                    I agree all statements in{" "}
                    <a href="#" className="term-service">
                      Terms of service
                    </a>
                  </label>
                </div>
                <div className="form-group form-button">
                  <input
                    type="submit"
                    name="signup"
                    id="signup"
                    className="form-submit"
                    value="Register"
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
                I am already member
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
