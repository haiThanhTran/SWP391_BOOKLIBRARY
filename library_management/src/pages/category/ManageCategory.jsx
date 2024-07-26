import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Add, Edit, Delete, FileCopy } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ManagementCategory = () => {
  const userStaffCategory = JSON.parse(localStorage.getItem("user")); // Parse the user string to an object
  const navigate = useNavigate();

  useEffect(() => {
    if (!userStaffCategory || userStaffCategory.role !== "ADMIN") {
      navigate("/signin");
    }
  }, [userStaffCategory, navigate]);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:9191/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  const isCategoryNameValid = (name) => {
    const regex = /^[a-zA-Z0-9\s]*$/;
    return name.trim() !== "" && regex.test(name);
  };

  const createCategory = async () => {
    if (!isCategoryNameValid(newCategory)) {
      toast.error("Tên danh mục không hợp lệ. Chỉ cho phép chữ cái, số và khoảng trắng.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9191/api/categories",
        { categoryName: newCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories([...categories, response.data]);
      setNewCategory("");
      setOpenAdd(false);
      toast.success("Đã thêm danh mục thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      toast.error("Thêm danh mục thất bại.");
    }
  };

  const updateCategory = async (id, updatedName) => {
    // if (!isCategoryNameValid(updatedName)) {
    //   toast.error("Tên danh mục không hợp lệ. Chỉ cho phép chữ cái, số và khoảng trắng.");
    //   return;
    // }

    try {
      const response = await axios.put(
        `http://localhost:9191/api/categories/${id}`,
        { categoryName: updatedName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories(
        categories.map((cat) => (cat.categoryID === id ? response.data : cat))
      );
      setSelectedCategory(null);
      setOpenEdit(false);
      toast.success("Cập nhật danh mục thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      toast.error("Cập nhật danh mục thất bại.");
    }
  };

  const deleteCategory = async (id) => {
    // Fetch all books
    let books;
    try {
      const response = await axios.get("http://localhost:9191/api/books");
      books = response.data;
    } catch (error) {
      console.error("Lỗi khi tải sách:", error);
      toast.error("Tải sách thất bại.");
      return;
    }

    // Check if there are any books with the category ID to be deleted
    const booksInCategory = books.some(
      (book) => book.category.categoryID === id
    );

    if (booksInCategory) {
      toast.error("Không thể xóa danh mục này vì vẫn còn sách trong danh mục.");
      return;
    }

    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa không? Việc xóa danh mục này sẽ xóa tất cả sách liên quan."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:9191/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(categories.filter((cat) => cat.categoryID !== id));
      setSelectedCategory(null);
      toast.success("Xóa danh mục thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      toast.error("Xóa danh mục thất bại.");
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Đã sao chép vào clipboard!");
  };

  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "5px",
      }}
    >
      <ToastContainer />
      <h1>Quản lý danh mục</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAdd(true)}
          startIcon={<Add />}
        >
          Thêm mới
        </Button>
        <TextField
          label="Tìm kiếm danh mục"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginLeft: "20px", flex: 1 }}
        />
      </div>
      <List style={{ backgroundColor: "#fff", borderRadius: "5px" }}>
        {filteredCategories.map((category) => (
          <ListItem
            key={category.categoryID}
            style={{ borderBottom: "1px solid #ccc" }}
          >
            <ListItemText primary={category.categoryName} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => {
                  setSelectedCategory(category);
                  setOpenEdit(true);
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteCategory(category.categoryID)}
              >
                <Delete />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="copy"
                onClick={() => handleCopyToClipboard(category.categoryName)}
              >
                <FileCopy />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Thêm danh mục mới</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tên danh mục"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={createCategory} color="primary">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
      {selectedCategory && (
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
          <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Tên danh mục"
              value={selectedCategory.categoryName}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  categoryName: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)} color="primary">
              Hủy
            </Button>
            <Button
              onClick={() =>
                updateCategory(
                  selectedCategory.categoryID,
                  selectedCategory.categoryName
                )
              }
              color="primary"
            >
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ManagementCategory;
