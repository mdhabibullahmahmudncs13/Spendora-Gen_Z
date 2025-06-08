'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, FinancialGoal } from '@/types';
import { Settings as SettingsIcon, User as UserIcon, LogOut, Video, Mic, Brain, Sparkles, Shield, Zap, Edit3, Moon, Sun, Bell, DollarSign, Target, Plus, CheckCircle, Calendar, Globe } from 'lucide-react';
import { EditProfileModal } from '@/components/edit-profile-modal';
import { GoalSettingModal } from '@/components/goal-setting-modal';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

interface SettingsProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
  goals?: FinancialGoal[];
  onAddGoal?: (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => void;
  onUpdateGoal?: (id: string, goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => void;
  onDeleteGoal?: (id: string) => void;
}

// Currency options with symbols and names
const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', flag: '🇭🇰' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', flag: '🇳🇴' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', flag: '🇩🇰' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', flag: '🇵🇱' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', flag: '🇨🇿' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', flag: '🇭🇺' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', flag: '🇲🇽' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦' },
];

export function Settings({ user, onLogout, onUpdateUser, goals = [], onAddGoal, onUpdateGoal, onDeleteGoal }: SettingsProps) {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const { theme, setTheme } = useTheme();

  const handleNotificationToggle = (enabled: boolean) => {
    setNotifications(enabled);
    toast.success(enabled ? 'Notifications enabled' : 'Notifications disabled');
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    const selectedCurrency = CURRENCY_OPTIONS.find(c => c.code === newCurrency);
    toast.success(`Currency changed to ${selectedCurrency?.name} (${selectedCurrency?.symbol})`);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setShowGoalModal(true);
  };

  const handleSaveGoal = (goalData: Omit<FinancialGoal, 'id' | 'createdAt'>) => {
    if (editingGoal && onUpdateGoal) {
      onUpdateGoal(editingGoal.id, goalData);
    } else if (onAddGoal) {
      onAddGoal(goalData);
    }
    setEditingGoal(null);
    setShowGoalModal(false);
  };

  const handleDeleteGoal = (id: string) => {
    if (onDeleteGoal) {
      onDeleteGoal(id);
      toast.success('Goal deleted successfully');
    }
  };

  const activeGoals = goals.filter(goal => goal.isActive);
  const completedGoals = goals.filter(goal => (goal.currentAmount / goal.targetAmount) * 100 >= 100);

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'spending': return '💸';
      case 'saving': return '🏦';
      case 'income': return '💰';
      default: return '🎯';
    }
  };

  const selectedCurrency = CURRENCY_OPTIONS.find(c => c.code === currency);

  return (
    <div className="space-y-8 p-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-red-600/20 to-pink-600/20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Settings & Goals ⚙️</h1>
          <p className="text-xl text-orange-100">Manage your account, preferences, and financial goals</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* User Profile */}
        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Profile Information
              </span>
            </CardTitle>
            <CardDescription className="text-base">Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-700">
              <label className="text-sm font-semibold text-blue-700 dark:text-blue-300">Name</label>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{user.name}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700">
              <label className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Email</label>
              <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">{user.email}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700">
              <label className="text-sm font-semibold text-purple-700 dark:text-purple-300">Member Since</label>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Button 
              onClick={() => setShowEditProfile(true)}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600">
                <SettingsIcon className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                App Preferences
              </span>
            </CardTitle>
            <CardDescription className="text-base">Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showPreferences ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark Mode</span>
                  <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200">
                    {theme === 'system' ? 'Auto (System)' : theme === 'dark' ? 'Dark' : 'Light'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notifications</span>
                  <Badge variant="outline" className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200">
                    {notifications ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-700">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Currency</span>
                    <span className="text-lg">{selectedCurrency?.flag}</span>
                  </div>
                  <Badge variant="outline" className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200">
                    {selectedCurrency?.code} ({selectedCurrency?.symbol})
                  </Badge>
                </div>
                <Button 
                  onClick={() => setShowPreferences(true)}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Manage Preferences
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Theme Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
                      {theme === 'dark' ? <Moon className="h-3 w-3 text-white" /> : <Sun className="h-3 w-3 text-white" />}
                    </div>
                    Theme
                  </Label>
                  <Select value={theme} onValueChange={handleThemeChange}>
                    <SelectTrigger className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 transition-colors duration-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notifications Toggle */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600">
                      <Bell className="h-3 w-3 text-white" />
                    </div>
                    Notifications
                  </Label>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700">
                    <span className="text-sm text-emerald-700 dark:text-emerald-300">Enable push notifications</span>
                    <Switch
                      checked={notifications}
                      onCheckedChange={handleNotificationToggle}
                    />
                  </div>
                </div>

                {/* Currency Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
                      <Globe className="h-3 w-3 text-white" />
                    </div>
                    Currency & Region
                  </Label>
                  
                  {/* Current Currency Display */}
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Current Currency</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{selectedCurrency?.flag}</span>
                        <Badge variant="outline" className="bg-white/50 text-orange-700 border-orange-300">
                          {selectedCurrency?.symbol}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                      {selectedCurrency?.name}
                    </p>
                  </div>

                  {/* Currency Selector */}
                  <Select value={currency} onValueChange={handleCurrencyChange}>
                    <SelectTrigger className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-orange-500 transition-colors duration-300">
                      <SelectValue>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{selectedCurrency?.flag}</span>
                          <span>{selectedCurrency?.code} - {selectedCurrency?.name}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {selectedCurrency?.symbol}
                          </Badge>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {CURRENCY_OPTIONS.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code} className="hover:bg-orange-50 dark:hover:bg-orange-900/20">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{curr.flag}</span>
                              <div>
                                <span className="font-medium">{curr.code}</span>
                                <span className="text-sm text-slate-500 ml-2">{curr.name}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="ml-4">
                              {curr.symbol}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Currency Info */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    💡 All amounts in the app will be displayed using your selected currency format. 
                    Exchange rates are not automatically converted - enter amounts in your preferred currency.
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => setShowPreferences(false)}
                    variant="outline"
                    className="flex-1 h-12 border-2 border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowPreferences(false);
                      toast.success('Preferences saved successfully! 🎉');
                    }}
                    className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Goals Management Section */}
      <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600">
              <Target className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Financial Goals
            </span>
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
              {activeGoals.length} Active
            </Badge>
          </CardTitle>
          <CardDescription className="text-base">
            Manage your financial goals and track your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Goals Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 text-center">
                <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Active Goals</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700 text-center">
                <div className="text-2xl font-bold text-emerald-600">{completedGoals.length}</div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300">Completed</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-700 text-center">
                <div className="text-2xl font-bold text-orange-600">{goals.length}</div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Total Goals</div>
              </div>
            </div>

            {/* Recent Goals */}
            {activeGoals.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Recent Goals</h4>
                  <Button
                    onClick={() => setShowGoalModal(true)}
                    variant="outline"
                    size="sm"
                    className="border-2 border-purple-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-600 hover:text-white hover:border-transparent transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {activeGoals.slice(0, 3).map((goal) => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    return (
                      <div
                        key={goal.id}
                        className="p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-purple-50 dark:hover:from-slate-800 dark:hover:to-purple-900/20 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getGoalIcon(goal.type)}</span>
                            <div>
                              <h5 className="font-semibold text-slate-800 dark:text-slate-200">{goal.title}</h5>
                              <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">{goal.type} • {goal.period}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditGoal(goal)}
                              className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Progress</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {progress.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={Math.min(100, progress)} className="h-2" />
                          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>{selectedCurrency?.symbol}{goal.currentAmount.toFixed(2)}</span>
                            <span>{selectedCurrency?.symbol}{goal.targetAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">No Goals Set</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Start your financial journey by setting your first goal
                </p>
                <Button
                  onClick={() => setShowGoalModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Set Your First Goal
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* External API Integration Status */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="gradient-card border-2 border-dashed border-blue-300 dark:border-blue-600 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                OpenAI Integration
              </span>
            </CardTitle>
            <CardDescription>AI-powered financial insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Badge variant="secondary" className="w-full justify-center py-2 bg-gradient-to-r from-slate-100 to-blue-100 text-slate-700 border-slate-200">
                Not Connected
              </Badge>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Connect your OpenAI API key to enable personalized financial advice
              </p>
              <Button variant="outline" className="w-full border-2 border-blue-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all duration-300" disabled>
                <Brain className="h-4 w-4 mr-2" />
                Configure API Key
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-2 border-dashed border-emerald-300 dark:border-emerald-600 hover:border-emerald-500 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600">
                <Video className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Tavus Video API
              </span>
            </CardTitle>
            <CardDescription>Interactive AI video advisor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Badge variant="secondary" className="w-full justify-center py-2 bg-gradient-to-r from-slate-100 to-emerald-100 text-slate-700 border-slate-200">
                Not Connected
              </Badge>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Enable video conversations with your AI financial advisor
              </p>
              <Button variant="outline" className="w-full border-2 border-emerald-300 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:text-white hover:border-transparent transition-all duration-300" disabled>
                <Video className="h-4 w-4 mr-2" />
                Setup Video Agent
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-2 border-dashed border-orange-300 dark:border-orange-600 hover:border-orange-500 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                ElevenLabs Voice
              </span>
            </CardTitle>
            <CardDescription>Voice-powered expense tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Badge variant="secondary" className="w-full justify-center py-2 bg-gradient-to-r from-slate-100 to-orange-100 text-slate-700 border-slate-200">
                Not Connected
              </Badge>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Add expenses using natural voice commands
              </p>
              <Button variant="outline" className="w-full border-2 border-orange-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 hover:text-white hover:border-transparent transition-all duration-300" disabled>
                <Mic className="h-4 w-4 mr-2" />
                Configure Voice API
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Actions */}
      <Card className="gradient-card border-2 border-red-200 dark:border-red-800 hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-6 border-2 border-red-200 dark:border-red-800 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
            <div>
              <h4 className="font-semibold text-red-800 dark:text-red-200">Sign Out</h4>
              <p className="text-sm text-red-600 dark:text-red-300">
                Sign out of your account
              </p>
            </div>
            <Button
              variant="outline"
              onClick={onLogout}
              className="border-2 border-red-300 text-red-700 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 hover:text-white hover:border-transparent transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        user={user}
        onUpdateUser={onUpdateUser}
      />

      {/* Goal Setting Modal */}
      <GoalSettingModal
        isOpen={showGoalModal}
        onClose={() => {
          setShowGoalModal(false);
          setEditingGoal(null);
        }}
        onSaveGoal={handleSaveGoal}
        editingGoal={editingGoal}
      />
    </div>
  );
}