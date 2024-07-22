import React from "react";

function Feedback() {
  const handleFeedbackSubmit = () => {
    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSe8k9So7BrP4EI3Pvy0zdPghxHzkr9WMbOMDZFl-kLe73AoNg/viewform?usp=sf_link";
  };

  return (
    <div className="Feedback" style={{ padding: "40px 0 20px 0", backgroundColor: "#E1DCC5", height: "100%" }}>
      <div className="container mt-4 text-center">
        <h1 style={{ marginTop: "20px", paddingTop: "60px" }}>Thank you for your order!</h1>
        <p>We would love to hear your feedback.</p>
        <button className="btn btn-outline-primary" onClick={handleFeedbackSubmit}>
          Give Feedback
        </button>
      </div>
    </div>
  );
}

export default Feedback;
