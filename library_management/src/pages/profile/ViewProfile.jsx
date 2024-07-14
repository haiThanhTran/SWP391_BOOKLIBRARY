import React, { useState, useEffect, useContext } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./profilestyle.css";
import axios from "axios";
import { UserContext } from "../../ultils/userContext";

const App = () => {
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

  const handleEdit = () => {
    setEditableFields((prevState) => ({
      userName: !prevState.userName,
      userAddress: !prevState.userAddress,
      userPhone: !prevState.userPhone,
      bio: !prevState.bio,
      avatar: !prevState.avatar,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Kiểm tra xem ảnh mới đã được chọn hay chưa
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
    <Container fluid className="profile-container viewprofile mt-5">
      <h1 className="profile-heading viewprofile">Chỉnh sửa trang cá nhân</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUserName">
          <Form.Label>Tên người dùng</Form.Label>
          <Col xs={12} md={6} className="mx-auto">
            <Form.Control
              type="text"
              name="userName"
              value={formData.userName}
              onChange={(e) => handleChange(e, "userName")}
              readOnly={!editableFields.userName}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="formUserAddress">
          <Form.Label>Địa chỉ</Form.Label>
          <Col xs={12} md={6} className="mx-auto">
            <Form.Control
              type="text"
              name="userAddress"
              value={formData.userAddress}
              onChange={(e) => handleChange(e, "userAddress")}
              readOnly={!editableFields.userAddress}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="formUserPhone">
          <Form.Label>Số điện thoại</Form.Label>
          <Col xs={12} md={6} className="mx-auto">
            <Form.Control
              type="tel"
              name="userPhone"
              value={formData.userPhone}
              onChange={(e) => handleChange(e, "userPhone")}
              readOnly={!editableFields.userPhone}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="formBio">
          <Form.Label>Tiểu sử</Form.Label>
          <Col xs={12} md={6} className="mx-auto">
            <Form.Control
              as="textarea"
              name="bio"
              value={formData.bio}
              onChange={(e) => handleChange(e, "bio")}
              readOnly={!editableFields.bio}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="formBookPicture">
          <Form.Label>Tải ảnh</Form.Label>
          <Col xs={12} md={6} className="mx-auto">
            <Form.Control
              type="file"
              name="avatar"
              onChange={handleBookPictureChange}
              accept="image/*"
              readOnly={!editableFields.avatar}
            />
            {errors.selectedImage && (
              <p className="error-text">{errors.selectedImage}</p>
            )}
            <div className="image-preview-container">
              {selectedBookImage ? (
                <img
                  src={URL.createObjectURL(selectedBookImage)}
                  alt="Selected book"
                  className="preview-img"
                />
              ) : (
                formData.avatar && (
                  <img
                    src={`http://localhost:9191/api/users/user-image/${formData.avatar}`}
                    alt={formData.avatar}
                    className="preview-img"
                  />
                )
              )}
            </div>
          </Col>
        </Form.Group>

        <Row className="mt-3 justify-content-md-center">
          {/* <Col md="auto">
            <Button variant="secondary" onClick={handleEdit}>
              Edit
            </Button>
          </Col> */}
          <Col md="auto">
            <Button variant="primary" type="submit">
              Lưu
            </Button>
          </Col>
          <Col md="auto">
            <Button variant="primary" onClick={navigateToHome}>
              Hủy
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default App;
