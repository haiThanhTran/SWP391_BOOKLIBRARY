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

const ManagementPublisher = () => {
  const userStaffCategory = JSON.parse(localStorage.getItem("user")); // Parse the user string to an object
  const navigate = useNavigate();

  useEffect(() => {
    if (!userStaffCategory || userStaffCategory.role !== "ADMIN") {
      navigate("/signin");
    }
  }, [userStaffCategory, navigate]);
  const [publishers, setPublishers] = useState([]);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [newPublisher, setNewPublisher] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    try {
      const response = await axios.get("http://localhost:9191/api/publishers");
      setPublishers(response.data);
    } catch (error) {
      console.error("Lỗi khi tải nhà xuất bản:", error);
    }
  };

  const isPublisherNameValid = (name) => {
    const regex = /^[a-zA-Z0-9\s\-\.,]*$/;
    return name.trim() !== "" && regex.test(name);
  };

  const isPublisherNameUnique = (name, id = null) => {
    return publishers.every(
      (publisher) =>
        publisher.publisherID === id ||
        publisher.publisherName.toLowerCase() !== name.toLowerCase()
    );
  };
  const createPublisher = async () => {
    // if (!isPublisherNameValid(newPublisher)) {
    //   toast.error(
    //     "Tên nhà xuất bản không hợp lệ. Chỉ cho phép chữ cái, số và khoảng trắng."
    //   );
    //   return;
    // }
    if (!isPublisherNameUnique(newPublisher)) {
      toast.error("Tên nhà xuất bản đã tồn tại. Vui lòng chọn tên khác.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:9191/api/publishers",
        { publisherName: newPublisher },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPublishers([...publishers, response.data]);
      setNewPublisher("");
      setOpenAdd(false);
      toast.success("Thêm nhà xuất bản thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm nhà xuất bản:", error);
      toast.error("Thêm nhà xuất bản thất bại.");
    }
  };

  const updatePublisher = async (id, updatedName) => {
    // if (!isPublisherNameValid(updatedName)) {
    //   toast.error(
    //     "Tên nhà xuất bản không hợp lệ. Chỉ cho phép chữ cái, số và khoảng trắng."
    //   );
    //   return;
    // }
    if (!isPublisherNameUnique(updatedName, id)) {
      toast.error("Tên nhà xuất bản đã tồn tại. Vui lòng chọn tên khác.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:9191/api/publishers/${id}`,
        { publisherName: updatedName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPublishers(
        publishers.map((pub) => (pub.publisherID === id ? response.data : pub))
      );
      setSelectedPublisher(null);
      setOpenEdit(false);
      toast.success("Cập nhật nhà xuất bản thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật nhà xuất bản:", error);
      toast.error("Cập nhật nhà xuất bản thất bại.");
    }
  };

  const deletePublisher = async (id) => {
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

    // Check if there are any books with the publisher ID to be deleted
    const booksInPublisher = books.some(
      (book) => book.publisher.publisherID === id
    );

    if (booksInPublisher) {
      toast.error(
        "Không thể xóa nhà xuất bản này vì có sách liên quan đến nhà xuất bản này !"
      );
      return;
    }

    const confirmDelete = window.confirm(
      "Bạn có chắc chắn xóa không? Nếu xóa nhà xuất bản này sẽ xóa các sách liên quan đến nhà xuất bản này"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:9191/api/publishers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPublishers(publishers.filter((pub) => pub.publisherID !== id));
      setSelectedPublisher(null);
      toast.success("Xóa nhà xuất bản thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa nhà xuất bản:", error);
      toast.error("Xóa nhà xuất bản thất bại.");
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Đã sao chép vào clipboard!");
  };

  const filteredPublishers = publishers.filter((publisher) =>
    publisher.publisherName.toLowerCase().includes(searchQuery.toLowerCase())
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
      <h1>Quản lý nhà xuất bản</h1>
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
          label="Tìm kiếm nhà xuất bản"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginLeft: "20px", flex: 1 }}
        />
      </div>
      <List style={{ backgroundColor: "#fff", borderRadius: "5px" }}>
        {filteredPublishers.map((publisher) => (
          <ListItem
            key={publisher.publisherID}
            style={{ borderBottom: "1px solid #ccc" }}
          >
            <ListItemText primary={publisher.publisherName} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => {
                  setSelectedPublisher(publisher);
                  setOpenEdit(true);
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deletePublisher(publisher.publisherID)}
              >
                <Delete />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="copy"
                onClick={() => handleCopyToClipboard(publisher.publisherName)}
              >
                <FileCopy />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Thêm nhà xuất bản mới</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tên nhà xuất bản"
            value={newPublisher}
            onChange={(e) => setNewPublisher(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={createPublisher} color="primary">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
      {selectedPublisher && (
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
          <DialogTitle>Chỉnh sửa nhà xuất bản</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Tên nhà xuất bản"
              value={selectedPublisher.publisherName}
              onChange={(e) =>
                setSelectedPublisher({
                  ...selectedPublisher,
                  publisherName: e.target.value,
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
                updatePublisher(
                  selectedPublisher.publisherID,
                  selectedPublisher.publisherName
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

export default ManagementPublisher;
