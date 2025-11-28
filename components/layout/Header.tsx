'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MobileSidebar } from './Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
      <MobileSidebar />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-lg font-semibold md:text-xl text-foreground">
          {title || 'My Finance'}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-block text-sm font-medium text-muted-foreground">
              {user?.displayName || user?.email}
            </span>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photoURL || ''} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {user?.displayName ? getInitials(user.displayName) : 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
