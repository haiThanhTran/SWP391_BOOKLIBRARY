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

const ManagementPublisher = () => {
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
      console.error("Error fetching publishers:", error);
    }
  };

  const isPublisherNameValid = (name) => {
    const regex = /^[a-zA-Z0-9\s]*$/;
    return name.trim() !== "" && regex.test(name);
  };

  const createPublisher = async () => {
    if (!isPublisherNameValid(newPublisher)) {
      toast.error(
        "Invalid publisher name. Only letters, numbers, and spaces are allowed."
      );
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
      toast.success("Publisher added successfully!");
    } catch (error) {
      console.error("Error creating publisher:", error);
      toast.error("Failed to add publisher.");
    }
  };

  const updatePublisher = async (id, updatedName) => {
    if (!isPublisherNameValid(updatedName)) {
      toast.error(
        "Invalid publisher name. Only letters, numbers, and spaces are allowed."
      );
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
      toast.success("Publisher updated successfully!");
    } catch (error) {
      console.error("Error updating publisher:", error);
      toast.error("Failed to update publisher.");
    }
  };

  const deletePublisher = async (id) => {
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
      toast.success("Publisher deleted successfully!");
    } catch (error) {
      console.error("Error deleting publisher:", error);
      toast.error("Failed to delete publisher.");
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard!");
  };

  const filteredPublishers = publishers.filter((publisher) =>
    publisher.publisherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
      <ToastContainer />
      <h1>Publishers</h1>
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
          label="Search Publishers"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginLeft: "20px", flex: 1 }}
        />
      </div>
      <List style={{ backgroundColor: "#fff", borderRadius: "5px" }}>
        {filteredPublishers.map((publisher) => (
          <ListItem key={publisher.publisherID} style={{ borderBottom: "1px solid #ccc" }}>
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
        <DialogTitle>Add New Publisher</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Publisher Name"
            value={newPublisher}
            onChange={(e) => setNewPublisher(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={createPublisher} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {selectedPublisher && (
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
          <DialogTitle>Edit Publisher</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Publisher Name"
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
              Cancel
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
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ManagementPublisher;
