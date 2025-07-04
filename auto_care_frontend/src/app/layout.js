// src/app/layout.tsx

import { Geist, Geist_Mono } from "next/font/google";
import "./page.module.css"; // adjust path if needed

import Header from "./layout/header/page";
import Footer from "./layout/footer/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Auto Care",
  description: "Smooth Rides, Start Here",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-secondary text-primary`}
      >
        <Header />
        <main className="min-h-screen px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
