import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { TiTick } from "react-icons/ti";
import Header from "../nav-bar/Header";
import Footer from "../footer/Footer";

const ManageCustomer = () => {
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
      // Filter out users who are not customers
       const customers = response.data.filter(
        (user) => user.role && user.role.role === "CUSTOMER"
      );

      // const customers = response.data.filter(
      //   (user) => user.role.role === "CUSTOMER"
      // );

      setUsers(customers);
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

  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      console.error("No token found");
    }
  }, [token]);

  const handleInputChange = (id, key, value) => {
    setUpdatedUsers((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [key]: value,
      },
    }));
  };

  const handleSubmit = (id) => {
    const user = users.find((user) => user.id === id);
    const updatedUser = { ...user, ...updatedUsers[id] };
    updateUser(id, updatedUser);
  };

  return (
    <>
      <Header />
      <div className="container mt-12">
        <h1>Manage Customer</h1>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.userName}</td>
                <td>{user.userMail}</td>
                <td>{user.userPhone}</td>
                <td>
                  <select
                    className="form-select"
                    defaultValue={user.enabled ? "Enabled" : "Disabled"}
                    onChange={(e) =>
                      handleInputChange(
                        user.id,
                        "enabled",
                        e.target.value === "Enabled"
                      )
                    }
                  >
                    <option value="Enabled">Enabled</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => handleSubmit(user.id)}
                  >
                    <TiTick />

                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageCustomer;