import React, { useContext, useState } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import ManageCustomer from "../authen/ManageCustomer";
import ManageStaff from "../authen/ManageStaff";
import ManageBook from "../authen/ManageBook";
import ManageCategory from "../category/ManageCategory";
import ManagePublisher from "../publisher/ManagePublisher";
import ViewProfile from "../profile/ViewProfile";
import { UserContext } from "../../ultils/userContext";

const Dashboard = () => {
  const [activeLink, setActiveLink] = useState("/dashboard/managecustomer");
  const navigate = useNavigate();
  const handleLinkClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };
  // const { user, handleLogout } = useContext(UserContext);
  // console.log("user", user);

  return (
    <div className={styles.dashboard}>
      <aside className={styles.searchWrap}>
        <div className={styles.search}>
          <label htmlFor="search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z" />
            </svg>
            <input type="text" id="search" />
          </label>
        </div>
        <div className={styles.userActions}>
          <button >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M13.094 2.085l-1.013-.082a1.082 1.082 0 0 0-.161 0l-1.063.087C6.948 2.652 4 6.053 4 10v3.838l-.948 2.846A1 1 0 0 0 4 18h4.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5H20a1 1 0 0 0 .889-1.495L20 13.838V10c0-3.94-2.942-7.34-6.906-7.915zM12 19.5c-.841 0-1.5-.659-1.5-1.5h3c0 .841-.659 1.5-1.5 1.5zM5.388 16l.561-1.684A1.03 1.03 0 0 0 6 14v-4c0-2.959 2.211-5.509 5.08-5.923l.921-.074.868.068C15.794 4.497 18 7.046 18 10v4c0 .107.018.214.052.316l.56 1.684H5.388z" />
            </svg>
          </button>
        </div>
      </aside>
      <header className={styles.menuWrap}>
        <figure className={styles.user}>
          <div className={styles.userAvatar}>
            {/* <img
              className="user-avatar"
              src={`http://localhost:9191/api/users/user-image/${user.avatar}`}
              alt={user.avatar}
            /> */}
          </div>
          {/* <figcaption>{user?.name}</figcaption> */}
          <i className="fas fa-book ml-3"></i>
        </figure>
        <nav>
          <section className={styles.discover}>
            <h3>Discover</h3>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6.855 14.365l-1.817 6.36a1.001 1.001 0 0 0 1.517 1.106L12 18.202l5.445 3.63a1 1 0 0 0 1.517-1.106l-1.817-6.36 4.48-3.584a1.001 1.001 0 0 0-.461-1.767l-5.497-.916-2.772-5.545c-.34-.678-1.449-.678-1.789 0L8.333 8.098l-5.497.916a1 1 0 0 0-.461 1.767l4.48 3.584zm2.309-4.379c.315-.053.587-.253.73-.539L12 5.236l2.105 4.211c.144.286.415.486.73.539l3.79.632-3.251 2.601a1.003 1.003 0 0 0-.337 1.056l1.253 4.385-3.736-2.491a1 1 0 0 0-1.109-.001l-3.736 2.491 1.253-4.385a1.002 1.002 0 0 0-.337-1.056l-3.251-2.601 3.79-.631z" />
                  </svg>
                  Manage Customer
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
                  <i className="fas fa-piggy-bank mr-3"></i>
                  Manage Staff
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/managebook"
                  className={
                    activeLink === "/dashboard/managebook" ? styles.active : ""
                  }
                  onClick={() => handleLinkClick("/dashboard/managebook")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.707 2.293A.996.996 0 0 0 12 2H3a1 1 0 0 0-1 1v9c0 .266.105.52.293.707l9 9a.997.997 0 0 0 1.414 0l9-9a.999.999 0 0 0 0-1.414l-9-9zM12 19.586l-8-8V4h7.586l8 8L12 19.586z" />
                    <circle cx="7.507" cy="7.505" r="1.505" />
                  </svg>
                  Manage Book
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.293a1 1 0 0 0-1.707 0L1.293 12.293a1 1 0 0 0 0 1.414l9 9a1 1 0 0 0 1.414 0l9-9a1 1 0 0 0 0-1.414L12 2.293zM12 19.586l-8-8V4h7.586l8 8L12 19.586z" />
                    <circle cx="7.507" cy="7.505" r="1.505" />
                  </svg>
                  Manage Category
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20,9l-4-4v3H9c-2.757,0-5,2.243-5,5s2.243,5,5,5h3v-2H9c-1.654,0-3-1.346-3-3s1.346-3,3-3h7v3L20,9z" />
                  </svg>
                  Manage Publisher
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/viewprofile"
                  className={
                    activeLink === "/dashboard/viewprofile" ? styles.active : ""
                  }
                  onClick={() => handleLinkClick("/dashboard/viewprofile")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3C6.486 3 2 6.364 2 10.5c0 2.742 1.982 5.354 5 6.678V21a.999.999 0 0 0 1.707.707l3.714-3.714C17.74 17.827 22 14.529 22 10.5 22 6.364 17.514 3 12 3zm0 13a.996.996 0 0 0-.707.293L9 18.586V16.5a1 1 0 0 0-.663-.941C5.743 14.629 4 12.596 4 10.5 4 7.468 7.589 5 12 5s8 2.468 8 5.5-3.589 5.5-8 5.5z" />
                  </svg>
                  Your Profile
                </Link>
              </li>
            </ul>
          </section>
          <section className={styles.tools}>
            <h3>Tools</h3>
            <ul>
              <li>
                <Link
                  to="/dashboard/search"
                  className={
                    activeLink === "/dashboard/search" ? styles.active : ""
                  }
                  onClick={() => handleLinkClick("/dashboard/search")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z" />
                  </svg>
                  Search
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/create-portfolio"
                  className={
                    activeLink === "/dashboard/create-portfolio"
                      ? styles.active
                      : ""
                  }
                  onClick={() => handleLinkClick("/dashboard/create-portfolio")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 7L11 7 11 11 7 11 7 13 11 13 11 17 13 17 13 13 17 13 17 11 13 11z" />
                    <path d="M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10c5.514,0,10-4.486,10-10S17.514,2,12,2z M12,20c-4.411,0-8-3.589-8-8 s3.589-8,8-8s8,3.589,8,8S16.411,20,12,20z" />
                  </svg>
                  Create portfolio
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/messages"
                  className={
                    activeLink === "/dashboard/messages" ? styles.active : ""
                  }
                  onClick={() => handleLinkClick("/dashboard/messages")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 4H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-1 14H4V9.227l7.335 6.521a1.003 1.003 0 0 0 1.33-.001L20 9.227V18zm0-11.448l-8 7.11-8-7.111V6h16v.552z" />
                  </svg>
                  Messages
                </Link>
              </li>
            </ul>
          </section>
          <section className={styles.finance}>
            <h3>Finance</h3>
            <ul>
              <li>
                <Link
                  to="/dashboard/buy"
                  className={
                    activeLink === "/dashboard/buy" ? styles.active : ""
                  }
                  onClick={() => handleLinkClick("/dashboard/buy")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20,9l-4-4v3H9c-2.757,0-5,2.243-5,5s2.243,5,5,5h3v-2H9c-1.654,0-3-1.346-3-3s1.346-3,3-3h7v3L20,9z" />
                  </svg>
                  Buy
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/sell"
                  className={
                    activeLink === "/dashboard/sell" ? styles.active : ""
                  }
                  onClick={() => handleLinkClick("/dashboard/sell")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15,8H8V5L4,9l4,4v-3h7c1.654,0,3,1.346,3,3s-1.346,3-3,3h-3v2h3c2.757,0,5-2.243,5-5S17.757,8,15,8z" />
                  </svg>
                  Sell
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/invoice"
                  className={
                    activeLink === "/dashboard/invoice" ? styles.active : ""
                  }
                  onClick={() => handleLinkClick("/dashboard/invoice")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21,3h-4V2h-2v1H9V2H7v1H3C2.447,3,2,3.447,2,4v17c0,0.553,0.447,1,1,1h18c0.553,0,1-0.447,1-1V4C22,3.447,21.553,3,21,3z M7,5v1h2V5h6v1h2V5h3v3H4V5H7z M4,20V10h16v10H4z" />
                    <path d="M11,15.586l-1.793-1.793l-1.414,1.414l2.5,2.5C10.488,17.902,10.744,18,11,18s0.512-0.098,0.707-0.293l5-5l-1.414-1.414 L11,15.586z" />
                  </svg>
                  Invoice
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/wallet"
                  className={
                    activeLink === "/dashboard/wallet" ? styles.active : ""
                  }
                  onClick={() => handleLinkClick("/dashboard/wallet")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 12h2v3h-2z" />
                    <path d="M21 7h-1V4a1 1 0 0 0-1-1H5c-1.206 0-3 .799-3 3v11c0 2.201 1.794 3 3 3h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zM5 5h13v2H5.012C4.55 6.988 4 6.805 4 6s.55-.988 1-1zm15 13H5.012C4.55 17.988 4 17.805 4 17V8.833c.346.115.691.167 1 .167h15v9z" />
                  </svg>
                  Wallet
                </Link>
              </li>
            </ul>
          </section>
        </nav>
      </header>
      <main className={styles.contentWrap}>
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
  );
};

export default Dashboard;
