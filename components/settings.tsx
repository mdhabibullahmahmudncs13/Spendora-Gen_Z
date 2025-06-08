'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { Settings as SettingsIcon, User as UserIcon, LogOut, Video, Mic, Brain } from 'lucide-react';

interface SettingsProps {
  user: User;
  onLogout: () => void;
}

export function Settings({ user, onLogout }: SettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and app preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Profile */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-lg font-medium">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <p className="text-lg font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline" className="w-full" disabled>
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              App Preferences
            </CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dark Mode</span>
                <span className="text-sm text-muted-foreground">Auto (System)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Notifications</span>
                <Badge variant="outline">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Currency</span>
                <span className="text-sm text-muted-foreground">USD ($)</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" disabled>
              Manage Preferences
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* External API Integration Status */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-primary" />
              OpenAI Integration
            </CardTitle>
            <CardDescription>AI-powered financial insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge variant="secondary" className="w-full justify-center">
                Not Connected
              </Badge>
              <p className="text-sm text-muted-foreground">
                Connect your OpenAI API key to enable personalized financial advice
              </p>
              <Button variant="outline" className="w-full" disabled>
                Configure API Key
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Video className="h-5 w-5 text-primary" />
              Tavus Video API
            </CardTitle>
            <CardDescription>Interactive AI video advisor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge variant="secondary" className="w-full justify-center">
                Not Connected
              </Badge>
              <p className="text-sm text-muted-foreground">
                Enable video conversations with your AI financial advisor
              </p>
              <Button variant="outline" className="w-full" disabled>
                Setup Video Agent
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mic className="h-5 w-5 text-primary" />
              ElevenLabs Voice
            </CardTitle>
            <CardDescription>Voice-powered expense tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge variant="secondary" className="w-full justify-center">
                Not Connected
              </Badge>
              <p className="text-sm text-muted-foreground">
                Add expenses using natural voice commands
              </p>
              <Button variant="outline" className="w-full" disabled>
                Configure Voice API
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Actions */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-700 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <h4 className="font-medium">Sign Out</h4>
              <p className="text-sm text-muted-foreground">
                Sign out of your account
              </p>
            </div>
            <Button
              variant="outline"
              onClick={onLogout}
              className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integration Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>External API Integration Guide</CardTitle>
          <CardDescription>
            How to enable advanced features with external services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">OpenAI Integration</h4>
              <p className="text-muted-foreground mb-2">
                To enable AI financial insights, you'll need to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Create an OpenAI account and get your API key</li>
                <li>Add the API key to your environment variables</li>
                <li>Configure the AI analysis endpoints</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Tavus Video API</h4>
              <p className="text-muted-foreground mb-2">
                For interactive video advisor features:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Sign up for Tavus API access</li>
                <li>Create your AI avatar and conversation flows</li>
                <li>Integrate the video widget into the dashboard</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">ElevenLabs Voice</h4>
              <p className="text-muted-foreground mb-2">
                To enable voice expense tracking:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Get your ElevenLabs API credentials</li>
                <li>Set up speech-to-text processing</li>
                <li>Configure natural language expense parsing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}