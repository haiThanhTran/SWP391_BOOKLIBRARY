import React from "react";
import Header from "../../pages/nav-bar/Header";
function Feedback() {
  const handleFeedbackSubmit = () => {
    window.location.href =
      "https://docs.google.com/forms/d/e/1FAIpQLSe8k9So7BrP4EI3Pvy0zdPghxHzkr9WMbOMDZFl-kLe73AoNg/viewform?usp=sf_link";
  };

  return (
    <>
      <Header />
      <div
        className="Feedback"
        style={{
          padding: "40px 0 20px 0",
          backgroundColor: "#E1DCC5",
          height: "100%",
        }}
      >
        <div className="container mt-4 text-center">
          <h1 style={{ marginTop: "20px", paddingTop: "60px" }}>
            Cảm ơn bạn đã đặt lịch!
          </h1>
          <p>Tôi muốn nghe 1 số cảm nghĩ của bạn về trải nghiệm người dùng.</p>
          <button
            className="btn btn-outline-primary"
            onClick={handleFeedbackSubmit}
          >
            Khảo sát ngay
          </button>
        </div>
      </div>
    </>
  );
}

export default Feedback;
