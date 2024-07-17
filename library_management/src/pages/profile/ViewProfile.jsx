import React, { useState, useEffect, useContext } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./profilestyle.css";
import axios from "axios";
import { UserContext } from "../../ultils/userContext";
import Header from "../../pages/nav-bar/Header";
import logo from "../../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
const App = () => {
  const userStaffCategory = JSON.parse(localStorage.getItem("user")); // Parse the user string to an object
  const navigate = useNavigate();

  useEffect(() => {
    if (!userStaffCategory) {
      navigate("/signin");
    }
  }, [userStaffCategory, navigate]);
  const navigateToHome = () => {
    window.location.href = "/";
  };

  const initialFormData = {
    id: "",
    userName: "",
    userAddress: "",
    userPhone: "",
    bio: "",
    avatar: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [selectedBookImage, setSelectedBookImage] = useState(null);
  const { handleLoginSuccess } = useContext(UserContext);

  useEffect(() => {
    // Load user data from localStorage
    const savedData = localStorage.getItem("user");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData); // Set formData directly with parsedData
    }
  }, []);

  const handleChange = (e, field) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const [editableFields, setEditableFields] = useState({
    userName: true,
    userAddress: true,
    userPhone: true,
    bio: true,
    avatar: true,
  });

  const handleBookPictureChange = (e) => {
    const file = e.target.files[0];
    setSelectedBookImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prevState) => ({
        ...prevState,
        avatar: reader.result,
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if a new image is selected
    if (!selectedBookImage) {
      setErrors({ selectedImage: "Please select a new image to update." });
      return;
    }

    try {
      // Create FormData object
      const formDataToSend = new FormData();
      const userData = {
        id: formData.id,
        userName: formData.userName,
        userAddress: formData.userAddress,
        userPhone: formData.userPhone,
        bio: formData.bio,
      };
      formDataToSend.append("user", JSON.stringify(userData));
      formDataToSend.append("image", selectedBookImage);

      // Send a PUT request to the server with the updated profile data
      const response = await axios.put(
        `http://localhost:9191/api/users/profile/${formData.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const user = response.data;
        await handleLoginSuccess(user);
        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));
        alert("Profile updated successfully!");
        navigateToHome();
      } else {
        const errorData = await response.json();
        alert(
          `Failed to update profile. Error: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <Container fluid className="profile-container viewprofile">
        <Row>
          <Col md={4}>
            <Card className="text-center col-left">
              <Card.Body>
                <h5 className="mt-3">{formData.userName || "User Name"}</h5>

                <div className="image-preview-container">
                  {selectedBookImage ? (
                    <img
                      src={URL.createObjectURL(selectedBookImage)}
                      alt="Profile"
                      className="rounded-circle profile-avatar"
                    />
                  ) : (
                    formData.avatar && (
                      <img
                        src={`http://localhost:9191/api/users/user-image/${formData.avatar}`}
                        alt="Profile"
                        className="rounded-circle profile-avatar"
                      />
                    )
                  )}
                </div>
                <p className="text-muted mb-1">
                  Email: {formData.userMail || "..."}
                </p>
                <p className="text-muted mb-3">
                  Location: {formData.userAddress || "..."}
                </p>
                <img
                  src={logo}
                  alt="No Orders Found"
                  className="img-fluid"
                  style={{ maxWidth: "60%" }}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card>
              <Card.Header className="profile-heading viewprofile-right">

                Hồ Sơ Của Bạn
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="formUserName">
                        <Form.Label className="viewprofile-form-label">
                          Họ & Tên
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="userName"
                          value={formData.userName}
                          onChange={(e) => handleChange(e, "userName")}
                          readOnly={!editableFields.userName}
                          className="viewprofile-form-control"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="formUserAddress">
                        <Form.Label className="viewprofile-form-label">
                          Địa Chỉ
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="userAddress"
                          value={formData.userAddress}
                          onChange={(e) => handleChange(e, "userAddress")}
                          readOnly={!editableFields.userAddress}
                          className="viewprofile-form-control"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="formUserPhone">
                        <Form.Label className="viewprofile-form-label">
                          SĐT
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="userPhone"
                          value={formData.userPhone}
                          onChange={(e) => handleChange(e, "userPhone")}
                          readOnly={!editableFields.userPhone}
                          className="viewprofile-form-control"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="formBio">
                        <Form.Label className="viewprofile-form-label">
                          Tiểu Sử
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          name="bio"
                          value={formData.bio}
                          onChange={(e) => handleChange(e, "bio")}
                          readOnly={!editableFields.bio}
                          className="viewprofile-form-control"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="formBookPicture">
                        <Form.Label className="viewprofile-form-label">
                          Thay Đổi Ảnh Đại Diện
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="avatar"
                          onChange={handleBookPictureChange}
                          accept="image/*"
                          readOnly={!editableFields.avatar}
                          className="viewprofile-form-control"
                        />
                        {errors.selectedImage && (
                          <p className="error-text">{errors.selectedImage}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col>
                      <Button variant="success" type="submit">
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        className="ms-2"
                        onClick={navigateToHome}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
