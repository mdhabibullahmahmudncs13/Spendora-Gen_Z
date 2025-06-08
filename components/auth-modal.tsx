'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Shield, BarChart3, Bot, Sparkles, Zap } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, name: string) => void;
}

export function AuthModal({ isOpen, onClose, onLogin, onSignup }: AuthModalProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      onLogin(loginEmail, loginPassword);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupEmail && signupPassword && signupName) {
      onSignup(signupEmail, signupPassword, signupName);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md gradient-card border-0">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center space-x-3 text-center">
            <div className="relative">
              <div className="p-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome to FinanceAI
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-6">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-700">
            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 mb-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-center font-semibold text-emerald-700 dark:text-emerald-300">Secure Data</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 mb-3">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-center font-semibold text-blue-700 dark:text-blue-300">Smart Analytics</span>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="gradient-card border-0">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Login
                </CardTitle>
                <CardDescription>
                  Enter your credentials to access your financial dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="text-sm font-semibold">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="mt-1 h-11 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 transition-colors duration-300"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password" className="text-sm font-semibold">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="mt-1 h-11 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 transition-colors duration-300"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105">
                    <Zap className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card className="gradient-card border-0">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Create Account
                </CardTitle>
                <CardDescription>
                  Join FinanceAI to start tracking your expenses smartly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name" className="text-sm font-semibold">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Enter your full name"
                      className="mt-1 h-11 border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 transition-colors duration-300"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email" className="text-sm font-semibold">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="mt-1 h-11 border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 transition-colors duration-300"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password" className="text-sm font-semibold">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Create a password"
                      className="mt-1 h-11 border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 transition-colors duration-300"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold transition-all duration-300 transform hover:scale-105">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="p-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-600">
            <Bot className="h-3 w-3 text-white" />
          </div>
          <span>AI-powered financial insights coming soon</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}