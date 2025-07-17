import React from "react";
import Sidebar from "../admin/layout/sidebar"; // Custom sidebar component for Admin
import Header from "../admin/layout/header";   // Admin-specific header

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Header />
      <div className="admin-content">
        <Sidebar />
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
