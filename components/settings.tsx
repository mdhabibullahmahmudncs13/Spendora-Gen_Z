'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { Settings as SettingsIcon, User as UserIcon, LogOut, Video, Mic, Brain, Sparkles, Shield, Zap, Edit3 } from 'lucide-react';
import { EditProfileModal } from '@/components/edit-profile-modal';

interface SettingsProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

export function Settings({ user, onLogout, onUpdateUser }: SettingsProps) {
  const [showEditProfile, setShowEditProfile] = useState(false);

  return (
    <div className="space-y-8 p-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-red-600/20 to-pink-600/20"></div>
        <div className="absolute top-4 right-4 animate-float">
          <SettingsIcon className="h-8 w-8 text-orange-200" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Settings & Preferences ⚙️</h1>
          <p className="text-xl text-orange-100">Manage your account and app preferences</p>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark Mode</span>
                <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200">
                  Auto (System)
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notifications</span>
                <Badge variant="outline" className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200">
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-700">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Currency</span>
                <Badge variant="outline" className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200">
                  USD ($)
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full h-12 border-2 border-purple-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-600 hover:text-white hover:border-transparent transition-all duration-300" disabled>
              <Zap className="h-4 w-4 mr-2" />
              Manage Preferences
            </Button>
          </CardContent>
        </Card>
      </div>

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

      {/* Integration Documentation */}
      <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              External API Integration Guide
            </span>
          </CardTitle>
          <CardDescription className="text-base">
            How to enable advanced features with external services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 text-sm">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-700">
              <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                OpenAI Integration
              </h4>
              <p className="text-blue-700 dark:text-blue-300 mb-3">
                To enable AI financial insights, you'll need to:
              </p>
              <ul className="list-disc list-inside text-blue-600 dark:text-blue-400 space-y-2">
                <li>Create an OpenAI account and get your API key</li>
                <li>Add the API key to your environment variables</li>
                <li>Configure the AI analysis endpoints</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700">
              <h4 className="font-semibold mb-3 text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <Video className="h-4 w-4" />
                Tavus Video API
              </h4>
              <p className="text-emerald-700 dark:text-emerald-300 mb-3">
                For interactive video advisor features:
              </p>
              <ul className="list-disc list-inside text-emerald-600 dark:text-emerald-400 space-y-2">
                <li>Sign up for Tavus API access</li>
                <li>Create your AI avatar and conversation flows</li>
                <li>Integrate the video widget into the dashboard</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-700">
              <h4 className="font-semibold mb-3 text-orange-800 dark:text-orange-200 flex items-center gap-2">
                <Mic className="h-4 w-4" />
                ElevenLabs Voice
              </h4>
              <p className="text-orange-700 dark:text-orange-300 mb-3">
                To enable voice expense tracking:
              </p>
              <ul className="list-disc list-inside text-orange-600 dark:text-orange-400 space-y-2">
                <li>Get your ElevenLabs API credentials</li>
                <li>Set up speech-to-text processing</li>
                <li>Configure natural language expense parsing</li>
              </ul>
            </div>
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
    </div>
  );
}