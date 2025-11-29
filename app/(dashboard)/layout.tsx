'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/transactions')) return 'Transactions';
    if (path.includes('/settings')) return 'Paramètres';
    return 'My Finance';
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="hidden md:block border-r bg-card">
          <Sidebar />
        </div>
        {/* Scrollable Content Area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header title={getPageTitle(pathname)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
