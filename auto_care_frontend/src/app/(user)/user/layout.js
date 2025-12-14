import Header from "./layout/header/page";
import Footer from "./layout/footer/page";

export default function UserLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen px-4">{children}</main>
      <Footer />
    </>
  );
}