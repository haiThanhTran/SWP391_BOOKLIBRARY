import React, { useState, useEffect, useContext } from "react";
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import styles from "./Dashboard.module.css";
import ManageCustomer from "../authen/ManageCustomer";
import ManageStaff from "../authen/ManageStaff";
import ManageBook from "../authen/ManageBook";
import ManageCategory from "../category/ManageCategory";
import ManagePublisher from "../publisher/ManagePublisher";
import ViewProfile from "../profile/ViewProfile";
import { UserContext } from "../../ultils/userContext";
import { WishlistContext } from "../../pages/wishlist/WishlistContext";

const Dashboard = () => {
  const { user, handleLogout } = useContext(UserContext);
  const { wishlist } = useContext(WishlistContext);
  const [activeLink, setActiveLink] = useState("/dashboard/managecustomer");
  const [breadcrumb, setBreadcrumb] = useState("Dashboard / Manage Customer");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/dashboard/*") {
      handleLinkClick("/dashboard/managecustomer");
    }
  }, [location, user]);

  useEffect(() => {
    if (user) {
      console.log("User updated:", user);
    }
  }, [user]);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    navigate(path);
    updateBreadcrumb(path);
  };

  const updateBreadcrumb = (path) => {
    const parts = path.split("/");
    const capitalizedParts = parts.map(
      (part) => part.charAt(0).toUpperCase() + part.slice(1)
    );
    const breadcrumbPath = capitalizedParts.join(" / ");
    setBreadcrumb(
      `Dashboard / ${breadcrumbPath.split("/").slice(2).join(" / ")}`
    );
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <img
            src="https://th.bing.com/th/id/OIP.NnDnfxfuDA8i1Nfl8M8RfgHaHa?w=3333&h=3333&rs=1&pid=ImgDetMain&fbclid=IwZXh0bgNhZW0CMTAAAR1OXUMon_0p53E1O13A-Bv8eWQT4VoJMTEHvXkhpy8o9zWNogktlBwKN5Q_aem_Acod6jbhDhrpUBXRJgKuU3uONuPi2VdRtWtUNMejqUEwwnFIJih9m-S1vrAl_WkTWuhqchOOsRD09dQAmOSBeLL2"
            alt="Library Logo"
          />
          <h2>Dashboard</h2>
          <Link to="/" className={styles.goHome} title="Go Home">
            <i className="fas fa-book"></i>
          </Link>
        </div>
        <nav className={styles.nav}>
          <h4>Thống Kê</h4>
          <ul>
            <li>
              <Link
                to="/dashboard/managecustomer"
                className={
                  activeLink === "/dashboard/managecustomer"
                    ? styles.active
                    : ""
                }
                onClick={() => handleLinkClick("/dashboard/managecustomer")}
              >
                <i className="fas fa-user"></i>
                Cái thống kê của anh Thành
              </Link>
            </li>
          </ul>
          <h4>Quản Lý Tài Khoản</h4>
          <ul>
            <li>
              <Link
                to="/dashboard/managecustomer"
                className={
                  activeLink === "/dashboard/managecustomer"
                    ? styles.active
                    : ""
                }
                onClick={() => handleLinkClick("/dashboard/managecustomer")}
              >
                <i className="fas fa-user"></i>
                Tài Khoản Khách Hàng
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/managestaff"
                className={
                  activeLink === "/dashboard/managestaff" ? styles.active : ""
                }
                onClick={() => handleLinkClick("/dashboard/managestaff")}
              >
                <i className="fas fa-users"></i>
                Tài Khoản Quản Trị
              </Link>
            </li>
          </ul>
          <h4>Quản Lý Tài Nguyên</h4>
          <ul>
            <li>
              <Link
                to="/dashboard/managebook"
                className={
                  activeLink === "/dashboard/managebook" ? styles.active : ""
                }
                onClick={() => handleLinkClick("/dashboard/managebook")}
              >
                <i className="fas fa-book"></i>
                Quản Lý Kho
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/managecategory"
                className={
                  activeLink === "/dashboard/managecategory"
                    ? styles.active
                    : ""
                }
                onClick={() => handleLinkClick("/dashboard/managecategory")}
              >
                <i className="fas fa-list"></i>
                Quản Lý Danh Mục Sách
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/managepublisher"
                className={
                  activeLink === "/dashboard/managepublisher"
                    ? styles.active
                    : ""
                }
                onClick={() => handleLinkClick("/dashboard/managepublisher")}
              >
                <i className="fas fa-print"></i>
                Quản Lý Nhà Xuất Bản
              </Link>
            </li>
          </ul>
          <h4>User</h4>
          <ul>
            <li>
              <Link
                to="/dashboard/viewprofile"
                className={
                  activeLink === "/dashboard/viewprofile" ? styles.active : ""
                }
                onClick={() => handleLinkClick("/dashboard/viewprofile")}
              >
                <i className="fas fa-user-circle"></i>
                Your Profile
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className={styles.main}>
        <header className={styles.navbar}>
          <div className={styles.breadcrumb}>
            <span
              onClick={() => handleLinkClick("/")}
              style={{ cursor: "pointer" }}
            >
              Home
            </span>{" "}
            / {breadcrumb}
          </div>
          <div className={styles.user}>
            {user ? (
              <>
                <div className={styles.userInfo} onClick={toggleDropdown}>
                  <img
                    src={`http://localhost:9191/api/users/user-image/${user.avatar}`}
                    alt="User Avatar"
                    className={styles.userAvatar}
                  />
                  <i className={`fas fa-chevron-down ${styles.dropdownIcon}`}></i>
                </div>
                {dropdownOpen && (
                  <div className={styles.dropdown}>
                    <button
                      className={styles.logoutButton}
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt"></i> Log Out
                    </button>
                  </div>
                )}
                <span className={styles.userName}>{user.name}</span>
              </>
            ) : (
              <span>Loading...</span>
            )}
          </div>
        </header>
        <main className={styles.content}>
          <Routes>
            <Route path="managecustomer" element={<ManageCustomer />} />
            <Route path="managestaff" element={<ManageStaff />} />
            <Route path="managebook" element={<ManageBook />} />
            <Route path="managecategory" element={<ManageCategory />} />
            <Route path="managepublisher" element={<ManagePublisher />} />
            <Route path="viewprofile" element={<ViewProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
