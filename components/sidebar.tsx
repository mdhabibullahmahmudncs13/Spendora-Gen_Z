'use client';

import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  Settings,
  Wallet,
  Sparkles,
  Target,
  Calculator
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-indigo-600' },
  { id: 'expenses', name: 'Add Expense', icon: PlusCircle, gradient: 'from-emerald-500 to-teal-600' },
  { id: 'bills', name: 'Bill Calculator', icon: Calculator, gradient: 'from-indigo-500 to-purple-600' },
  { id: 'goals', name: 'Goals', icon: Target, gradient: 'from-purple-500 to-pink-600' },
  { id: 'reports', name: 'Reports', icon: BarChart3, gradient: 'from-orange-500 to-red-600' },
  { id: 'settings', name: 'Settings', icon: Settings, gradient: 'from-slate-500 to-gray-600' },
];

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <div className="hidden md:flex md:w-72 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto glass-effect border-r border-white/20">
        <div className="flex items-center flex-shrink-0 px-6 pb-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="p-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FinanceAI
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Smart Financial Advisor</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col px-4">
          <nav className="flex-1 space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    'group flex items-center px-4 py-3 text-sm font-medium rounded-2xl w-full text-left transition-all duration-300 transform hover:scale-105',
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.gradient.split('-')[1]}-500/25`
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-xl mr-3 transition-all duration-300',
                    isActive 
                      ? 'bg-white/20' 
                      : `group-hover:bg-gradient-to-r group-hover:${item.gradient} group-hover:text-white`
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
          
          {/* Bottom decoration */}
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-200/20 dark:border-purple-700/20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">AI Powered</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Financial Insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}