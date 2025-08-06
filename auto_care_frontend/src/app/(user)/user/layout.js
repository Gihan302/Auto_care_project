import Header from "./user/layout/header/page";
import Footer from "./user/layout/footer/page";

export default function UserLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen px-4">{children}</main>
      <Footer />
    </>
  );
}