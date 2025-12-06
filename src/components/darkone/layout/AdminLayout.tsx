import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { useEffect } from "react";

const AdminLayout = () => {
  useEffect(() => {
    // Load Iconify script for icons
    const iconifyScript = document.createElement("script");
    iconifyScript.src = "https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js";
    iconifyScript.async = true;
    document.head.appendChild(iconifyScript);

    // Initialize sidebar size from localStorage
    const savedSidebarSize = localStorage.getItem("darkone-sidebar-size") || "default";
    document.documentElement.setAttribute("data-sidebar-size", savedSidebarSize);

    return () => {
      document.head.removeChild(iconifyScript);
    };
  }, []);

  return (
    <div className="darkone-admin">
      <div className="app-wrapper">
        {/* Topbar */}
        <Topbar />
        
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <div className="page-content">
          <div className="container-fluid">
            <Outlet />
          </div>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
