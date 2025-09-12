'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/AdminDashboard';



export default function AdminPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
 

  useEffect(() => {
    if (loading) {
      return;
    }
    

    if (!isAuthenticated) {
      router.push('/login');
    } else if (user.role !== 'admin') {
      alert('You are not authorized to view this page.');
      logout(); // Log out the unauthorized user
      router.push('/login');
    }
  }, [user, isAuthenticated, loading, router, logout]);

  if (loading) {
    return <p className="text-center mt-8">Loading and verifying access...</p>;
  }

  // If we pass the checks, we show the dashboard
 if (isAuthenticated && user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <p className="text-center mt-8">Verifying access...</p>;
}