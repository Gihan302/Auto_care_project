<<<<<<< Updated upstream
import { Geist, Geist_Mono } from "next/font/google";
import "./page.module.css";

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
=======
'use client'

import { usePathname } from 'next/navigation'
import Header from './(user)/user/layout/header/page'
import Footer from './(user)/user/layout/footer/page'
import AutoGenie from './(user)/user/layout/autoGenie/page'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  
  // Define routes where you want header/footer
  const showHeaderFooter = pathname === '/' || pathname === '/home' || pathname === '/signin' || pathname === '/signup' || pathname.startsWith('/advertisement')
  
  // Define routes where you DON'T want AutoGenie (like the full chat page)
  const hideAutoGenie = pathname === '/chat' || pathname.startsWith('/admin')
  
  // Or define routes where you DON'T want header/footer
  // const hideHeaderFooter = pathname.startsWith('/admin') || pathname.startsWith('/user')
  
  return (
    <html lang="en">
      <body>
        {showHeaderFooter && <Header />}
        
        <main className={showHeaderFooter ? 'with-header-footer' : 'full-page'}>
          {children}
        </main>
        
        {showHeaderFooter && <Footer />}
        
        {/* AutoGenie appears on all pages except excluded routes */}
        {!hideAutoGenie && <AutoGenie />}
      </body>
    </html>
  )
>>>>>>> Stashed changes
}