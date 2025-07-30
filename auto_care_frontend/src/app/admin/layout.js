// src/app/admin/layout.js
import React from "react";
import Sidebar from "./layout/sidebar"; // Adjust path as needed
import Header from "./layout/header";   // Adjust path as needed



export default function AdminRootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-grow p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
