import React, { useState } from "react";
import { useLocation } from "react-router-dom";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!validatePassword(e.target.value)) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:9191/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ token, newPassword: password }),
        }
      );
      const message = await response.text();
  
      if (response.ok) {
        alert("Reset password success");
        window.location.href = "/signin";
      } else {
        setMessage("Error: " + message);
      }
    } catch (error) {
      setMessage("An error occurred while resetting the password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Only show the alert if the password has not been reset
    if (!isPasswordReset) {
      alert("Reset password cancelled. Redirecting to login page.");
    }
    // alert("Reset password successfully. Redirecting to login page");
    // window.location.href = "/signin";
  };

  return (
    <div className="mainDiv">
      <div className="cardStyle">
        <form onSubmit={handleSubmit} name="resetPassForm" id="resetPassForm">
          <img
            src="https://th.bing.com/th/id/OIP.NnDnfxfuDA8i1Nfl8M8RfgHaHa?w=3333&h=3333&rs=1&pid=ImgDetMain&fbclid=IwZXh0bgNhZW0CMTAAAR1OXUMon_0p53E1O13A-Bv8eWQT4VoJMTEHvXkhpy8o9zWNogktlBwKN5Q_aem_Acod6jbhDhrpUBXRJgKuU3uONuPi2VdRtWtUNMejqUEwwnFIJih9m-S1vrAl_WkTWuhqchOOsRD09dQAmOSBeLL2"
            alt="Forgot Password Logo"
            id="forgotPassLogo"
          />
          <h2 className="formTitle">Please enter your new password</h2>
          <div className="inputDiv">
            <label className="inputLabel" htmlFor="password">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
          </div>
          <div className="buttonWrapper">
            <button
              type="submit"
              style={{
                backgroundColor: validatePassword(password)
                  ? "#0069B6"
                  : "gray",
                color: "#fff",
              }}
              disabled={!validatePassword(password)}
            >
              Đặt lại mật khẩu
            </button>
            <button
              type="button"
              style={{
                backgroundColor: "red",
                color: "#fff",
              }}
              onClick={handleCancel}
            >
              {/* Change the button text based on the state */}
              Hủy
            </button>
          </div>
        </form>
        {isLoading ? <p>Chờ chút...</p> : message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default ResetPasswordForm;
