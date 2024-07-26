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
      console.error("Error fetching categories:", error);
    }
  };

  const isCategoryNameValid = (name) => {
    const regex = /^[a-zA-Z0-9\s]*$/;
    return name.trim() !== "" && regex.test(name);
  };

  const createCategory = async () => {
    if (!isCategoryNameValid(newCategory)) {
      toast.error(
        "Invalid category name. Only letters, numbers, and spaces are allowed."
      );
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
      toast.success("Category added successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to add category.");
    }
  };

  const updateCategory = async (id, updatedName) => {
    if (!isCategoryNameValid(updatedName)) {
      toast.error(
        "Invalid category name. Only letters, numbers, and spaces are allowed."
      );
      return;
    }

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
      toast.success("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category.");
    }
  };

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn xóa không? Nếu xóa thư mục này sẽ xóa các sách liên quan đến thư mục này"
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
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category.");
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard!");
  };

  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
      <ToastContainer />
      <h1>Categories</h1>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAdd(true)}
          startIcon={<Add />}
        >
          Add new
        </Button>
        <TextField
          label="Search Categories"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginLeft: "20px", flex: 1 }}
        />
      </div>
      <List style={{ backgroundColor: "#fff", borderRadius: "5px" }}>
        {filteredCategories.map((category) => (
          <ListItem key={category.categoryID} style={{ borderBottom: "1px solid #ccc" }}>
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
        <DialogTitle>Thêm hạng mục</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={createCategory} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {selectedCategory && (
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Category Name"
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
              Cancel
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
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ManagementCategory;
