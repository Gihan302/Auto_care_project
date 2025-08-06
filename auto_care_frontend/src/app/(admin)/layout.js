import Sidebar from "./admin/layout/sidebar";
import Header from "./admin/layout/header";

export default function AdminLayout({ children }) {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-grow p-4">
          {children}
        </main>
      </div>
    </>
  );
}