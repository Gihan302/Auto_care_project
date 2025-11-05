'use client'

import { usePathname } from 'next/navigation'
import Header from './(user)/user/layout/header/page'
import Footer from './(user)/user/layout/footer/page'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  
  // Define routes where you want header/footer
  const showHeaderFooter = pathname === '/' || pathname === '/home' || pathname === '/signin' || pathname === '/signup'
  
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
      </body>
    </html>
  )
}