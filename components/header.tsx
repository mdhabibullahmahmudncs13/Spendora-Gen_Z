'use client';

import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Bell, Menu, Sparkles } from 'lucide-react';

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="glass-effect border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-white/20">
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome back, {user.name}! ✨
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Here's your financial overview
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-600 hover:text-white transition-all duration-300 rounded-xl">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-3 w-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-full animate-pulse"></span>
          </Button>
          <div className="relative">
            <Avatar className="ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all duration-300">
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}