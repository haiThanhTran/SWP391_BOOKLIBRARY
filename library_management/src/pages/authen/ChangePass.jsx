import React, { useState, useEffect, useContext } from "react";
import "./UIConfig/css/ChangePass.css";
import { blue } from "@mui/material/colors";
import { UserContext } from "../../ultils/userContext";
import { useNavigate } from "react-router-dom";
import Header from "../../pages/nav-bar/Header";
/**
 * ChangePass component for handling password change form.
 * @returns {JSX.Element} - JSX element representing the password change form.
 */
function ChangePass() {
  const { user } = useContext(UserContext);
  // useState hooks for managing state of password, confirmPassword, passwordError, confirmPasswordError, and formIsValid.
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);

  const userPass = JSON.parse(localStorage.getItem("user")); // Parse the user string to an object
  const navigate = useNavigate();

  useEffect(() => {
    if (!userPass) {
      navigate("/signin");
    }
  }, [userPass, navigate]);

  // useEffect hook to validate password and confirmPassword on every change.
  useEffect(() => {
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        setConfirmPasswordError(
          "Confirm Password does not match with Password."
        );
        setFormIsValid(false);
      } else if (password.length < 8) {
        setConfirmPasswordError("Password must be at least 8 characters long.");
        setFormIsValid(false);
      } else {
        setConfirmPasswordError("");
        setFormIsValid(true);
      }
    }
  }, [password, confirmPassword]);

  // handleSubmit function to handle form submission.
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formIsValid) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:9191/api/auth/change-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              oldPassword: oldPassword,
              newPassword: password,
              token: token,
            }),
          }
        );

        if (response.ok) {
          const data = await response.text(); // Use response.text() instead of response.json()
          alert(data);
          window.location.href = "http://localhost:5173/";
        } else {
          const errorData = await response.text(); // Use response.text() instead of response.json()
          alert("Error: " + errorData);
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  // JSX return statement for rendering the password change form.
  return (
    <>
      <Header />
      <div className="mainDiv">
        <div className="cardStyle">
          <form onSubmit={handleSubmit} name="signupForm" id="signupForm">
            <img
              src="https://th.bing.com/th/id/OIP.NnDnfxfuDA8i1Nfl8M8RfgHaHa?w=3333&h=3333&rs=1&pid=ImgDetMain&fbclid=IwZXh0bgNhZW0CMTAAAR1OXUMon_0p53E1O13A-Bv8eWQT4VoJMTEHvXkhpy8o9zWNogktlBwKN5Q_aem_Acod6jbhDhrpUBXRJgKuU3uONuPi2VdRtWtUNMejqUEwwnFIJih9m-S1vrAl_WkTWuhqchOOsRD09dQAmOSBeLL2"
              alt="Signup Logo"
              id="signupLogo"
            />
            <h2 className="formTitle">Vui lòng nhập mật khẩu mới</h2>
            {/* //input old password */}
            <div className="inputDiv">
              <label className="inputLabel" htmlFor="oldPassword">
                Mật khẩu cũ
              </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              {oldPasswordError && (
                <p className="error-message">{oldPasswordError}</p>
              )}
            </div>
            {/* //input new password */}
            <div className="inputDiv">
              <label className="inputLabel" htmlFor="password">
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}
            </div>
            <div className="inputDiv">
              <label className="inputLabel" htmlFor="confirmPassword">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {confirmPasswordError && (
                <p className="error-message">{confirmPasswordError}</p>
              )}
            </div>
            <div className="buttonWrapper">
              <button
                type="submit"
                disabled={!formIsValid}
                style={{
                  backgroundColor: formIsValid ? "#0069B6" : "gray",
                  color: "#fff",
                }}
              >
                Xác nhận
              </button>
              <button
                type="button"
                style={{
                  backgroundColor: "red",
                  color: "#fff",
                }}
                onClick={() =>
                  (window.location.href = "http://localhost:5173/")
                }
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChangePass;
