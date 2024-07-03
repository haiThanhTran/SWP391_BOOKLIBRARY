import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconButton, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';


function App() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchCategories();
    }, []);


    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:9191/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };


    const createCategory = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.post(
            'http://localhost:9191/api/categories',
            { categoryName: newCategory },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCategories([...categories, response.data]);
          setNewCategory('');
        } catch (error) {
          console.error('Error creating category:', error);
        }
      };
      
      const updateCategory = async (id, updatedName) => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.put(
            `http://localhost:9191/api/categories/${id}`,
            { categoryName: updatedName },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCategories(categories.map(cat => (cat.categoryID === id ? response.data : cat)));
          setSelectedCategory(null);
        } catch (error) {
          console.error('Error updating category:', error);
        }
      };
      
      const deleteCategory = async (id) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn xóa không? Nếu xóa thư mục này sẽ xóa các sách liên quan đến thư mục này');
        if (!confirmDelete) return;
      
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:9191/api/categories/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCategories(categories.filter(cat => cat.categoryID !== id));
          setSelectedCategory(null);
        } catch (error) {
          console.error('Error deleting category:', error);
        }
      };
      


    const filteredCategories = categories.filter(category =>
        category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
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


                .categories {
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


            <h1>Categories</h1>
            <div className="container">
                <div className="categories">
                    <TextField
                        fullWidth
                        label="Search Categories"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <List>
                        {filteredCategories.map(category => (
                            <ListItem key={category.categoryID} button onClick={() => setSelectedCategory(category)}>
                                <ListItemText primary={category.categoryName} />
                                <ListItemSecondaryAction className="actions">
                                    <IconButton edge="end" aria-label="edit" onClick={() => setSelectedCategory(category)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => deleteCategory(category.categoryID)}>
                                        <Delete />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                    <div className="actions">
                        <TextField
                            fullWidth
                            label="New Category"
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                        />
                        <IconButton color="primary" className="iconButton" onClick={createCategory}>
                            <Add />
                        </IconButton>
                    </div>
                </div>
                <div className="details">
                    {selectedCategory && (
                        <>
                            <h2>{selectedCategory.categoryName}</h2>
                            <TextField
                                fullWidth
                                value={selectedCategory.categoryName}
                                onChange={e => setSelectedCategory({ ...selectedCategory, categoryName: e.target.value })}
                            />
                            <Button color="primary" variant="contained" onClick={() => updateCategory(selectedCategory.categoryID, selectedCategory.categoryName)}>
                                Update
                            </Button>
                            <Button color="secondary" variant="contained" onClick={() => deleteCategory(selectedCategory.categoryID)} style={{ marginLeft: '10px' }}>
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
