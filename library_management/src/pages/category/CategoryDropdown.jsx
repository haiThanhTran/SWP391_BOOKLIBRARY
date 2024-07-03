import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryDropdown = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9191/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []);

  const handleCategoryClick = (category) => {
    navigate("/search-results", { state: { category } });
  };

  return (
    <li className="nav-item dropdown position-relative">
      <a
        className="nav-link dropdown-toggle"
        href="#"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        BOOK CATEGORIES
      </a>
      <div className="dropdown-menu">
        <ul>
          {categories.map((category) => (
            <li
              key={category.categoryID}
              onClick={() => handleCategoryClick(category)}
              style={{ cursor: "pointer" }}
            >
              <i className="lni-angle-double-right right-arrow"></i>
              <a className="dropdown-item">{category.categoryName}</a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default CategoryDropdown;
