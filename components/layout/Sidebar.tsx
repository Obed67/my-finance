'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { logOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const routes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      href: '/transactions',
      label: 'Transactions',
      icon: CreditCard,
      active: pathname === '/transactions',
    },
    {
      href: '/settings',
      label: 'Paramètres',
      icon: Settings,
      active: pathname === '/settings',
    },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Déconnexion réussie');
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };


  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        'relative flex flex-col h-screen border-r bg-card transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-6 z-20 h-8 w-8 rounded-full border bg-background shadow-md hidden md:flex"
        onClick={toggleCollapse}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Header / Logo */}
      <div className={cn('flex items-center h-16 px-4 mb-8', isCollapsed ? 'justify-center' : 'justify-start')}>
        {isCollapsed ? (
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            M
          </div>
        ) : (
          <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate">
            My Finance
          </h2>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 space-y-2">
        <TooltipProvider delayDuration={0}>
          {routes.map((route) => (
            <Tooltip key={route.href}>
              <TooltipTrigger asChild>
                <Button
                  variant={route.active ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start transition-all',
                    isCollapsed ? 'justify-center px-2' : 'px-4',
                    route.active && 'bg-secondary'
                  )}
                  asChild
                >
                  <Link href={route.href}>
                    <route.icon className={cn('h-5 w-5', isCollapsed ? 'mr-0' : 'mr-3')} />
                    {!isCollapsed && <span>{route.label}</span>}
                  </Link>
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  {route.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Footer / Logout */}
      <div className="p-3 mt-auto mb-4">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/30',
                  isCollapsed ? 'justify-center px-2' : 'px-4'
                )}
                onClick={handleLogout}
              >
                <LogOut className={cn('h-5 w-5', isCollapsed ? 'mr-0' : 'mr-3')} />
                {!isCollapsed && <span>Déconnexion</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Déconnexion
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const routes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      href: '/transactions',
      label: 'Transactions',
      icon: CreditCard,
      active: pathname === '/transactions',
    },
    {
      href: '/settings',
      label: 'Paramètres',
      icon: Settings,
      active: pathname === '/settings',
    },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Déconnexion réussie');
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <div className="flex flex-col h-full">
          <div className="px-6 py-6 mb-6">
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Finance
            </h2>
          </div>
          
          <div className="flex-1 px-3 space-y-2">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start text-lg h-12',
                  route.active && 'bg-secondary'
                )}
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={route.href}>
                  <route.icon className="mr-4 h-5 w-5" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>

          <div className="p-4 mt-auto mb-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 text-lg h-12 border border-destructive/30"
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
            >
              <LogOut className="mr-4 h-5 w-5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
