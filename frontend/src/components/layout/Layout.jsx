// Layout.jsx
import React from "react";
import { useLocation, Navigate } from "react-router-dom"; // ✅ Add Navigate here
import Header from "./Header";
import Sidebar from "./Sidebar";
import { getToken } from "../../services/authService";

const Layout = ({ children }) => {
  const location = useLocation();
  const token = getToken();

  // Define routes where Header and Sidebar should be hidden
  const authRoutes = ["/signup", "/signin"];
  const isAuthPage = authRoutes.includes(location.pathname);

  // If token exists and user is on auth page, redirect to dashboard
  if (token && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  // If no token and not on auth page, redirect to signin
  if (!token && !isAuthPage) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Show Header only if not on auth pages and token exists */}
      {!isAuthPage && <Header />}

      <div className="flex flex-1">
        {/* Show Sidebar only if not on auth pages and token exists */}
        {!isAuthPage && <Sidebar />}

        <main
          className={`flex-1 p-6 bg-finance-neutral ${
            isAuthPage ? "w-full flex justify-center items-center" : ""
          }`}
        >
          {children}
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
