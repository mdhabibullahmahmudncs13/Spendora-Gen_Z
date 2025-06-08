'use client';

import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  Settings,
  Wallet
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'expenses', name: 'Add Expense', icon: PlusCircle },
  { id: 'reports', name: 'Reports', icon: BarChart3 },
  { id: 'settings', name: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-card border-r">
        <div className="flex items-center flex-shrink-0 px-6 pb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">FinanceAI</h1>
              <p className="text-xs text-muted-foreground">Smart Financial Advisor</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg w-full text-left transition-all duration-200',
                    currentPage === item.id
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}