import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const ManageAccounts = () => {
  const [users, setUsers] = useState([]);
  const [updatedUsers, setUpdatedUsers] = useState({});
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:9191/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Fetch users failed:", error);
    }
  };

  const updateUser = async (id, updatedUser) => {
    try {
      await axios.put(`http://localhost:9191/api/users/${id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers(); // Refresh user list after update
    } catch (error) {
      console.error("Update user failed:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:9191/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers(); // Refresh user list after delete
    } catch (error) {
      console.error("Delete user failed:", error);
    }
  };
  

  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      console.error("No token found");
    }
  }, [token]);

  const handleInputChange = (id, key, value) => {
    setUpdatedUsers(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [key]: value,
      },
    }));
  };

  const handleSubmit = (id) => {
    const user = users.find(user => user.id === id);
    const updatedUser = { ...user, ...updatedUsers[id] };
    updateUser(id, updatedUser);
  };

  return (
    <div className="container mt-5">
      <h1>Manage Accounts</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.userName}</td>
              <td>{user.userMail}</td>
              <td>
                <select
                  className="form-select"
                  defaultValue={user.role}
                  onChange={(e) => handleInputChange(user.id, 'role', e.target.value)}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="CUSTOMER">Customer</option>
                </select>
              </td>
              <td>
                <select
                  className="form-select"
                  defaultValue={user.enabled ? "Enabled" : "Disabled"}
                  onChange={(e) => handleInputChange(user.id, 'enabled', e.target.value === "Enabled")}
                >
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </td>
              <td>
                <button className="btn btn-success me-2" onClick={() => handleSubmit(user.id)}>
                  Submit
                </button>
                <button className="btn btn-danger" onClick={() => deleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAccounts;
