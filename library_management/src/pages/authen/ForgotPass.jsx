import React, { useState } from "react";
// import "./UIConfig/css/ForgotPass.css";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!validateEmail(e.target.value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:9191/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email }),
      });

      if (response.ok) {
        setMessage("Password reset email sent");
      } else {
        const errorMessage = await response.text();
        setMessage(errorMessage);
      }
    } catch (error) {
      setMessage("An error occurred while sending the reset password email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mainDiv">
      <div className="cardStyle">
        <form onSubmit={handleSubmit} name="forgotPassForm" id="forgotPassForm">
          <img
            src="https://th.bing.com/th/id/OIP.NnDnfxfuDA8i1Nfl8M8RfgHaHa?w=3333&h=3333&rs=1&pid=ImgDetMain&fbclid=IwZXh0bgNhZW0CMTAAAR1OXUMon_0p53E1O13A-Bv8eWQT4VoJMTEHvXkhpy8o9zWNogktlBwKN5Q_aem_Acod6jbhDhrpUBXRJgKuU3uONuPi2VdRtWtUNMejqUEwwnFIJih9m-S1vrAl_WkTWuhqchOOsRD09dQAmOSBeLL2"
            alt="Forgot Password Logo"
            id="forgotPassLogo"
          />
          <h2 className="formTitle">Please enter your email</h2>
          <div className="inputDiv">
            <label className="inputLabel" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && <p style={{ color: "red" }}>{emailError}</p>}
          </div>
          <div className="buttonWrapper">
          <button
              type="submit"
              style={{
                backgroundColor: validateEmail(email) ? "#0069B6" : "gray",
                color: "#fff",
              }}
              disabled={!validateEmail(email)}
            >
              Gửi link reset mật khẩu
            </button>
            <button
              type="button"
              style={{
                backgroundColor: "red",
                color: "#fff",
              }}
              onClick={() => (window.location.href = "/signin")}
            >
              Hủy
            </button>
          </div>
        </form>
        {isLoading ? <p>Loading...</p> : message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPasswordForm;