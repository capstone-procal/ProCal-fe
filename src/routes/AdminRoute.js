import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ isLoggedIn, userRole, onRequireLogin, children }) => {
  if (!isLoggedIn) {
    onRequireLogin();
    return null;
  }

  if (userRole !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;