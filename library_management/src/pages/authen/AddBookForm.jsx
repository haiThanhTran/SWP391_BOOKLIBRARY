import React, { useState, useEffect } from "react";
import "./UIConfig/css/AddBookForm.css";

const AddBookForm = ({ onClose }) => {
  const [bookStatus, setBookStatus] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [status, setStatus] = useState([]);
  const [formData, setFormData] = useState({
    bookPrice: "",
    bookName: "",
    bookQuantity: "",
    bookAuthor: "",
    page: "",
    language: "",
    description: "",
    category: {
      categoryID: "",
    },
    publisher: {
      publisherID: "",
    },
    status: {
      statusID: "",
    },
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, publishersResponse, statusResponse] = await Promise.all([
          fetch("http://localhost:9191/api/categories"),
          fetch("http://localhost:9191/api/publishers"),
          fetch("http://localhost:9191/api/status"),
        ]);
        const categoriesData = await categoriesResponse.json();
        const publishersData = await publishersResponse.json();
        const statusData = await statusResponse.json();

        setCategories(categoriesData);
        setPublishers(publishersData);
        setStatus(statusData);

        setFormData((prevData) => ({
          ...prevData,
          category: {
            categoryID: categoriesData.length > 0 ? categoriesData[0].categoryID : "",
          },
          publisher: {
            publisherID: publishersData.length > 0 ? publishersData[0].publisherID : "",
          },
          status: {
            statusID: statusData.length > 0 ? statusData[0].statusID : "",
          },
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //handle status change


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const keys = name.split(".");
      if (keys.length > 1) {
        return {
          ...prevData,
          [keys[0]]: {
            ...prevData[keys[0]],
            [keys[1]]: value,
          },
        };
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bookPrice) newErrors.bookPrice = "Book price is required";
    if (!formData.bookName) newErrors.bookName = "Book name is required";
    if (!formData.bookQuantity) newErrors.bookQuantity = "Book quantity is required";
    if (!formData.bookAuthor) newErrors.bookAuthor = "Book author is required";
    if (!formData.page) newErrors.page = "Book page is required";
    if (!formData.language) newErrors.language = "Book language is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.category.categoryID) newErrors.categoryID = "Category is required";
    if (!formData.publisher.publisherID) newErrors.publisherID = "Publisher is required";
    if (!formData.status.statusID) newErrors.statusID = "Status is required";
    if (!selectedImage) newErrors.selectedImage = "Book image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all fields");
      return;
    }

    const token = localStorage.getItem("token");
    const formToSubmit = new FormData();
    
    const bookData = {
      bookPrice: formData.bookPrice,
      bookName: formData.bookName,
      bookQuantity: formData.bookQuantity,
      bookAuthor: formData.bookAuthor,
      page: formData.page,
      language: formData.language,
      status: bookStatus,
      description: formData.description,
      category: {
        categoryID: formData.category.categoryID,
      },
      publisher: {
        publisherID: formData.publisher.publisherID,
      },
      status: {
        statusID: formData.status.statusID,
      },
    };

    formToSubmit.append("book", JSON.stringify(bookData));
    formToSubmit.append("image", selectedImage);

    try {
      const response = await fetch("http://localhost:9191/api/books", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formToSubmit,
      });

      if (response.ok) {
        alert("Book added successfully!");
        navigateToHome();
      } else {
        const errorData = await response.json();
        alert(`Failed to add book. Error: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the book.");
    }
  };

  const handleClear = () => {
    setFormData({
      bookPrice: "",
      bookName: "",
      bookQuantity: "",
      bookAuthor: "",
      page: "",
      language: "",
      description: "",
      category: {
        categoryID: categories.length > 0 ? categories[0].categoryID : "",
      },
      publisher: {
        publisherID: publishers.length > 0 ? publishers[0].publisherID : "",
      },
      status: {
        statusID: statusData.length > 0 ? statusData[0].statusID : "",
      },
    });
    setSelectedImage(null);
    setBookStatus(true);
    setErrors({});
  };

  const navigateToHome = () => {
    window.location.href = "/managebook";
  };

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        <span className="close" onClick={navigateToHome}>
          &times;
        </span>
        <form className="add_book_form" onSubmit={handleSubmit}>
          <h2 className="add_book_form_title">Add book form</h2>

          <div className="formbold-input-flex">
            <div className="property-input">
              <label htmlFor="bookPrice" className="formbold-form-label">
                Giá sách
              </label>
              <input
                type="number"
                name="bookPrice"
                id="bookPrice"
                className="formbold-form-input"
                value={formData.bookPrice}
                onChange={handleChange}
              />
              {errors.bookPrice && <p className="error-text">{errors.bookPrice}</p>}
            </div>

            <div className="property-input">
              <label htmlFor="bookName" className="formbold-form-label">
                Tên sách
              </label>
              <input
                type="text"
                name="bookName"
                id="bookName"
                className="formbold-form-input"
                value={formData.bookName}
                onChange={handleChange}
              />
              {errors.bookName && <p className="error-text">{errors.bookName}</p>}
            </div>

            <div className="property-input">
              <label htmlFor="bookQuantity" className="formbold-form-label">
                Số lượng sách
              </label>
              <input
                type="number"
                name="bookQuantity"
                id="bookQuantity"
                className="formbold-form-input"
                value={formData.bookQuantity}
                onChange={handleChange}
              />
              {errors.bookQuantity && <p className="error-text">{errors.bookQuantity}</p>}
            </div>
          </div>

          <div className="formbold-input-flex">
            <div className="property-input">
              <label htmlFor="bookAuthor" className="formbold-form-label">
                Tác giả
              </label>
              <input
                type="text"
                name="bookAuthor"
                id="bookAuthor"
                className="formbold-form-input"
                value={formData.bookAuthor}
                onChange={handleChange}
              />
              {errors.bookAuthor && <p className="error-text">{errors.bookAuthor}</p>}
            </div>
            <div className="property-input">
              <label htmlFor="page" className="formbold-form-label">
                Số trang
              </label>
              <input
                type="number"
                name="page"
                id="page"
                className="formbold-form-input"
                value={formData.page}
                onChange={handleChange}
              />
              {errors.page && <p className="error-text">{errors.page}</p>}
            </div>

            <div className="property-input">
              <label htmlFor="language" className="formbold-form-label">
                ngôn ngữ
              </label>
              <input
                type="text"
                name="language"
                id="language"
                className="formbold-form-input"
                value={formData.language}
                onChange={handleChange}
              />
              {errors.language && <p className="error-text">{errors.language}</p>}
            </div>
          </div>

          <div className="formbold-input-flex">
            <div className="property-input">
              <label htmlFor="category.categoryID" className="formbold-form-label">
                Hạng mục sách
              </label>
              <select
                name="category.categoryID"
                id="category.categoryID"
                className="formbold-form-input"
                value={formData.category.categoryID}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.categoryID} value={category.categoryID}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {errors.categoryID && <p className="error-text">{errors.categoryID}</p>}
            </div>

            <div className="property-input">
              <label htmlFor="publisher.publisherID" className="formbold-form-label">
                Nhà xuất bản
              </label>
              <select
                name="publisher.publisherID"
                id="publisher.publisherID"
                className="formbold-form-input"
                value={formData.publisher.publisherID}
                onChange={handleChange}
              >
                <option value="">Select Publisher</option>
                {publishers.map((publisher) => (
                  <option key={publisher.publisherID} value={publisher.publisherID}>
                    {publisher.publisherName}
                  </option>
                ))}
              </select>
              {errors.publisherID && <p className="error-text">{errors.publisherID}</p>}
            </div>

            <div className="property-input">
              <label htmlFor="status.statusID" className="formbold-form-label">
                Trạng thái
              </label>
              <select
                name="status.statusID"
                id="status.statusID"
                className="formbold-form-input"
                value={formData.status.statusID}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                {status.map((status) => (
                  <option key={status.statusID} value={status.statusID}>
                    {status.statusName}
                  </option>
                ))}
              </select>
              {errors.statusID && <p className="error-text">{errors.statusID}</p>}
            </div>
          </div>

          <div className="formbold-form-file-flex">
            <div className="upload-container">
              <label htmlFor="upload" className="formbold-form-label">
                Tải ảnh sách lên
              </label>
              <input
                type="file"
                name="upload"
                id="upload"
                accept="image/*"
                className="formbold-form-file"
                onChange={handleImageChange}
              />
              {errors.selectedImage && <p className="error-text">{errors.selectedImage}</p>}
              <div className="formbold-mb-3">
                <label htmlFor="description" className="description">
                  Miêu tả sách
                </label>
                <textarea
                  rows="6"
                  name="description"
                  id="description"
                  className="formbold-form-input description_book"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
                {errors.description && <p className="error-text">{errors.description}</p>}
              </div>
            </div>
            {selectedImage && (
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected book"
                  className="preview-img"
                />
              </div>
            )}
          </div>

          <div className="button-group">
            <button className="formbold-btn add" type="submit">
              Thêm
            </button>
            <button className="formbold-btn cancel" type="button" onClick={navigateToHome}>
              Hủy
            </button>
            <button className="formbold-btn clear" type="button" onClick={handleClear}>
              Xóa ô nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookForm;
