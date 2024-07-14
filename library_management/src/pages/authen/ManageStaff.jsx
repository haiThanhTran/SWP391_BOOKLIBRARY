import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../nav-bar/Header";
import Footer from "../footer/Footer";
import "./UIConfig/ManageStaff.css";
import { TiTick } from "react-icons/ti";

const ManageStaff = () => {
  const [users, setUsers] = useState([]);
  const [updatedUsers, setUpdatedUsers] = useState({});
  const [newUser, setNewUser] = useState({
    userName: "",
    userMail: "",
    userPhone: "",
    userPass: "",
    confPassword: "",
    userAddress: "",
    role: { roleID: 2, role: "STAFF" }, // Default role for STAFF
    enabled: true,
  });
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:9191/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const staffUsers = response.data.filter(
        (user) => user.role && (user.role.role === "ADMIN" || user.role.role === "STAFF")
      );
      setUsers(staffUsers);
    } catch (error) {
      console.error("Fetch users failed:", error);
    }
  };

  const addUser = async () => {
    try {
      await axios.post("http://localhost:9191/register", {
        userName: newUser.userName,
        userMail: newUser.userMail,
        userPhone: newUser.userPhone,
        userPass: newUser.userPass,
        confPassword: newUser.confPassword,
        userAddress: newUser.userAddress,
        role: newUser.role.roleID,
        enabled: newUser.enabled,
      });
      fetchUsers();
      setShowModal(false);
      setNewUser({
        userName: "",
        userMail: "",
        userPhone: "",
        userPass: "",
        confPassword: "",
        userAddress: "",
        role: { roleID: 2, role: "STAFF" }, // Reset to default STAFF role
        enabled: true,
      });
    } catch (error) {
      console.error("Add user failed:", error.message);
      alert(`Add user failed: ${error.message}`);
    }
  };

  const updateUser = async (id, updatedUser) => {
    try {
      await axios.put(`http://localhost:9191/api/users/${id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
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

  const handleNewUserChange = (key, value) => {
    setNewUser((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSubmit = (id) => {
    const user = users.find((user) => user.id === id);
    const updatedUser = { ...user, ...updatedUsers[id] };

    // Map role name to roleID
    if (updatedUser.role === "ADMIN") {
      updatedUser.role = { roleID: 3, role: "ADMIN" };
    } else if (updatedUser.role === "STAFF") {
      updatedUser.role = { roleID: 2, role: "STAFF" };
    }

    updateUser(id, updatedUser);
  };

  return (
    <>
      {/* <Header /> */}
      <div className="container mt-12">
        <h1>Quản Lý Nhân Viên</h1>
        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowModal(true)}
        >
          Tạo Tài Khoản Nhân Viên
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Địa Chỉ</th>
              <th>Chức vụ</th>
              <th>Trạng Thái</th>
              <th>Xác Nhận</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.userName}</td>
                <td>{user.userMail}</td>
                <td>{user.userPhone}</td>
                <td>{user.userAddress}</td>
                <td>
                <select
                  className="form-select"
                  defaultValue={user.role.role}
                  onChange={(e) =>
                    handleInputChange(user.id, "role", e.target.value)
                  }
                  disabled={
                    user.firstLogin && user.role.role === "STAFF" // Disable if firstLogin and STAFF
                  }
                >
                  <option value="ADMIN">Admin</option>
                  <option value="STAFF">Staff</option>
                </select>
              </td>
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
                  disabled={
                    user.firstLogin && user.role.role === "STAFF" // Disable if firstLogin and STAFF
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
                    Xác Nhận
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          className={`modal ${showModal ? "d-block" : "d-none"}`}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm nhân viên</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUser.userName}
                    onChange={(e) =>
                      handleNewUserChange("userName", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newUser.userMail}
                    onChange={(e) =>
                      handleNewUserChange("userMail", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>SĐT</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUser.userPhone}
                    onChange={(e) =>
                      handleNewUserChange("userPhone", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Địa Chỉ</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUser.userAddress}
                    onChange={(e) =>
                      handleNewUserChange("userAddress", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Mật Khẩu</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newUser.userPass}
                    onChange={(e) =>
                      handleNewUserChange("userPass", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addUser}
                >
                  Thêm
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default ManageStaff;
