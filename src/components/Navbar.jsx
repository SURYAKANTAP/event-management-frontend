'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // State for managing the mobile menu (hamburger)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State for managing the profile dropdown on desktop
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const profileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false); // Close menu on logout
    setIsMobileMenuOpen(false);
    router.replace('/login');
  };

  // Effect to close the profile dropdown if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

  // Get the first initial of the user's email for the avatar
  const userInitial = user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-3">
          {/* Brand/Logo */}
          <Link href="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700">
            EventFlow
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              // Profile dropdown for logged-in users on desktop
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {userInitial}
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm text-gray-700">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    </div>
                    <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileMenuOpen(false)}>Events</Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileMenuOpen(false)}>Admin Dashboard</Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Links for logged-out users on desktop
              <>
                <Link href="/login" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-indigo-600 focus:outline-none">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (collapsible) */}
      {isMobileMenuOpen && (
        <div className="md:hidden pb-3">
          {user ? (
             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
               <div className="px-2 py-2">
                 <p className="text-sm text-gray-500">Signed in as</p>
                 <p className="text-base font-medium text-gray-800 truncate">{user.email}</p>
               </div>
               <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Events</Link>
               {user.role === 'admin' && (
                 <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
               )}
               <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-white hover:bg-red-600">Logout</button>
             </div>
          ) : (
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-indigo-600">Login</Link>
              <Link href="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-indigo-600">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}