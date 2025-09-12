'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function AppLayout({ children }) {
  const pathname = usePathname();
  
  // Define the routes where the main layout (Navbar, etc.) should NOT be shown
  const authRoutes = ['/login', '/signup'];
  
  // Check if the current page is an authentication route
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute) {
    // For login/signup pages, just render the page itself.
    return <>{children}</>;
  } else {
    // For all other pages, render the Navbar and the main content wrapper.
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </>
    );
  }
}