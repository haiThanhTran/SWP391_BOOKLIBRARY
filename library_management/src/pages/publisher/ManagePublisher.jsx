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
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

function App() {
  const [publishers, setPublishers] = useState([]);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [newPublisher, setNewPublisher] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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
    const regex = /^[a-zA-Z0-9\s]*$/; // Only allows letters, numbers, and spaces
    return name.trim() !== '' && regex.test(name);
  };

  const createPublisher = async () => {
    if (!isPublisherNameValid(newPublisher)) {
      alert('Invalid publisher name. Only letters, numbers, and spaces are allowed.');
      return;
    }

    try {
      const token = localStorage.getItem("token");
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
    } catch (error) {
      console.error("Error creating publisher:", error);
    }
  };

  const updatePublisher = async (id, updatedName) => {
    try {
      const token = localStorage.getItem("token");
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
    } catch (error) {
      console.error("Error updating publisher:", error);
    }
  };

  const deletePublisher = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn xóa không? Nếu xóa nhà xuất bản này sẽ xóa các sách liên quan đến nhà xuất bản này"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:9191/api/publishers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPublishers(publishers.filter((pub) => pub.publisherID !== id));
      setSelectedPublisher(null);
    } catch (error) {
      console.error("Error deleting publisher:", error);
    }
  };

  const filteredPublishers = publishers.filter((publisher) =>
    publisher.publisherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <style>{`
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          display: flex;
          justify-content: space-between;
          max-width: 1200px;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .publishers {
          width: 30%;
        }
        .details {
          width: 65%;
        }
        h1 {
          text-align: center;
          color: #333;
          margin-top: 20px;
        }
        .actions {
          display: flex;
          align-items: center;
        }
        .iconButton {
          margin-left: 5px;
        }
      `}</style>

      <h1>Publishers</h1>
      <div className="container">
        <div className="publishers">
          <TextField
            fullWidth
            label="Search Publishers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <List>
            {filteredPublishers.map((publisher) => (
              <ListItem
                key={publisher.publisherID}
                button
                onClick={() => setSelectedPublisher(publisher)}
              >
                <ListItemText primary={publisher.publisherName} />
                <ListItemSecondaryAction className="actions">
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => setSelectedPublisher(publisher)}
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
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <div className="actions">
            <TextField
              fullWidth
              label="New Publisher"
              value={newPublisher}
              onChange={(e) => setNewPublisher(e.target.value)}
            />
            <IconButton
              color="primary"
              className="iconButton"
              onClick={createPublisher}
              disabled={!isPublisherNameValid(newPublisher)}
            >
              <Add />
            </IconButton>
          </div>
        </div>
        <div className="details">
          {selectedPublisher && (
            <>
              <h2>{selectedPublisher.publisherName}</h2>
              <TextField
                fullWidth
                value={selectedPublisher.publisherName}
                onChange={(e) =>
                  setSelectedPublisher({
                    ...selectedPublisher,
                    publisherName: e.target.value,
                  })
                }
              />
              <Button
                color="primary"
                variant="contained"
                onClick={() =>
                  updatePublisher(
                    selectedPublisher.publisherID,
                    selectedPublisher.publisherName
                  )
                }
              >
                Update
              </Button>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => deletePublisher(selectedPublisher.publisherID)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
