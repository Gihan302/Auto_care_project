import Header from "./layout/header/page";
import Footer from "./layout/footer/page";
import autoGenie from "./layout/autoGenie/page"

export default function UserLayout({ children }) {
  return (
    <>
      <Header />
      <autoGenie/>
      <main className="min-h-screen px-4">{children}</main>
      <Footer />
    </>
  );
}