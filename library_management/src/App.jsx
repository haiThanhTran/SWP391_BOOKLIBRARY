import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Main_page from "./pages/_id";
import Signup from "./pages/authen/Signup";
import Signin from "./pages/authen/Signin";
import ForgotPasswordForm from "./pages/authen/ForgotPass";
import ResetPassword from "./pages/authen/ResetPassword";
import ManageAccounts from "./pages/authen/ManageAccounts";
import BookDetail from "./pages/details/BookDetail";
import { UserProvider, UserContext } from "./ultils/userContext";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import SearchResults from "./pages/SearchResults";
import ChangePass from "./pages/authen/ChangePass";
import ManageCustomer from "./pages/authen/ManageCustomer";
import ManageStaff from "./pages/authen/ManageStaff";
import ManageBook from "./pages/authen/ManageBook";
import AddBookForm from "./pages/authen/AddBookForm";
import UpdateBookForm from "./pages/authen/UpdateBookForm";
import ViewOrder from "./pages/order/ViewOrder";
import Wishlist from "./pages/wishlist/Wishlist";
import { WishlistProvider } from "./pages/wishlist/WishlistContext";
import StaffOrderManagement from "./pages/wishlist/StaffOrderManagement";
import ManageCategory from "./pages/category/ManageCategory";
import ManagePublisher from "./pages/publisher/ManagePublisher";
import ViewProfile from "./pages/profile/ViewProfile";
import AdminFunction from "./pages/dashboard/AdminFunction";
import Dashboard from "./pages/dashboard/Dashboard";
import { NotificationProvider } from "./pages/notification/NotificationContext";
import AggregatedOrdersTable from "./pages/dashboard/viewAllOrder/AggregatedOrdersTable";
import BorrowerOrdersTable from "./pages/dashboard/viewAllBorrower/BorrowerOrdersTable";
import MoneyDashboard from "./pages/dashboard/viewAllImport/MoneyDashboard";

const App = () => {
  return (
    <UserProvider>
      <NotificationProvider>
        <WishlistProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Main_page />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/BookDetail/:id" element={<BookDetail />} />
              <Route path="/forgotPass" element={<ForgotPasswordForm />} />
              <Route path="/manageaccounts" element={<ManageAccounts />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/changepass" element={<ChangePass />} />
              <Route path="/managecustomer" element={<ManageCustomer />} />
              <Route path="/managestaff" element={<ManageStaff />} />
              <Route path="/managebook" element={<ManageBook />} />
              <Route path="/addbookform" element={<AddBookForm />} />
              <Route path="/updatebookform/:id" element={<UpdateBookForm />} />
              <Route path="/vieworder" element={<ViewOrder />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/manageborrow" element={<StaffOrderManagement />} />
              <Route path="/managecategory" element={<ManageCategory />} />
              <Route path="/managepublisher" element={<ManagePublisher />} />
              <Route path="/viewprofile" element={<ViewProfile />} />
              <Route path="/adminfunction/*" element={<AdminFunction />} />{" "}
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/vieworder/:orderId" element={<ViewOrder />} />
            </Routes>
          </Router>
        </WishlistProvider>
      </NotificationProvider>
    </UserProvider>
  );
};

export default App;
