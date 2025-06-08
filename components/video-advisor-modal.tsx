'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Expense, User } from '@/types';
import { Video, Phone, PhoneOff, Mic, MicOff, Camera, CameraOff, Settings, Loader2, AlertCircle, CheckCircle, Clock, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface VideoAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  expenses: Expense[];
}

interface ConversationData {
  conversationId: string;
  conversationUrl: string;
  status: string;
}

export function VideoAdvisorModal({ isOpen, onClose, user, expenses }: VideoAdvisorModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [conversationData, setConversationData] = useState<ConversationData | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Calculate financial context for the AI
  const getFinancialContext = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthTransactions = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const monthlyIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netIncome = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

    const categoryTotals = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    return {
      monthlyIncome: monthlyIncome.toFixed(2),
      monthlyExpenses: monthlyExpenses.toFixed(2),
      netIncome: netIncome.toFixed(2),
      savingsRate: savingsRate.toFixed(1),
      activeGoals: 0, // You can integrate with goals data
      topCategories,
      recentTransactions: expenses.slice(-5),
    };
  };

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startVideoCall = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      const financialContext = getFinancialContext();
      
      const response = await fetch('/api/tavus/create-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData: user,
          financialContext,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create video session';
        try {
          const errorData = await response.json();
          errorMessage = errorData.details || errorData.error || errorMessage;
        } catch (parseError) {
          // If we can't parse JSON, it might be an HTML error page
          const errorText = await response.text();
          if (errorText.includes('<!DOCTYPE')) {
            errorMessage = 'Server error occurred. Please check your configuration and try again.';
          } else {
            errorMessage = errorText || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setConversationData(data);
      setIsConnected(true);
      setCallDuration(0);
      setRetryCount(0);
      
      toast.success('Video session started! 🎥');
    } catch (error) {
      console.error('Video call error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start video call';
      setConnectionError(errorMessage);
      setRetryCount(prev => prev + 1);
      
      // Provide more helpful error messages
      if (errorMessage.includes('credentials') || errorMessage.includes('Invalid access token')) {
        toast.error('Invalid API credentials. Please check your Tavus configuration.');
      } else if (errorMessage.includes('Rate limit')) {
        toast.error('Rate limit exceeded. Please wait before trying again.');
      } else if (errorMessage.includes('server error')) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Failed to start video session');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const endVideoCall = () => {
    setIsConnected(false);
    setConversationData(null);
    setCallDuration(0);
    setIsMuted(false);
    setIsCameraOff(false);
    toast.success('Video session ended');
  };

  const handleClose = () => {
    if (isConnected) {
      endVideoCall();
    }
    setConnectionError(null);
    setRetryCount(0);
    onClose();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.success(isMuted ? 'Microphone unmuted' : 'Microphone muted');
  };

  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
    toast.success(isCameraOff ? 'Camera turned on' : 'Camera turned off');
  };

  const retryConnection = () => {
    setConnectionError(null);
    startVideoCall();
  };

  const getErrorHelp = (error: string) => {
    if (error.includes('credentials') || error.includes('Invalid access token')) {
      return {
        title: 'API Credentials Issue',
        description: 'Your Tavus API credentials appear to be invalid or expired.',
        actions: [
          'Verify your API key in the Tavus dashboard',
          'Check that your replica ID is correct',
          'Ensure your account has active credits',
          'Restart the development server after updating credentials'
        ]
      };
    } else if (error.includes('Rate limit')) {
      return {
        title: 'Rate Limit Exceeded',
        description: 'Too many requests have been made. Please wait before trying again.',
        actions: ['Wait a few minutes before retrying', 'Check your Tavus account usage limits']
      };
    } else if (error.includes('server error')) {
      return {
        title: 'Server Error',
        description: 'There was an issue with the Tavus service.',
        actions: ['Try again in a few moments', 'Check Tavus status page for service issues']
      };
    }
    return {
      title: 'Connection Error',
      description: 'Unable to establish video session.',
      actions: ['Check your internet connection', 'Try refreshing the page']
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl h-[80vh] gradient-card border-0 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
              <Video className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              AI Financial Advisor
            </span>
            {isConnected && (
              <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                Live • {formatDuration(callDuration)}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 p-6 pt-0">
          {!isConnected ? (
            // Pre-call interface
            <div className="h-full flex flex-col">
              {/* Financial Summary */}
              <Card className="gradient-card border-0 mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-500" />
                    Your Financial Overview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(() => {
                      const context = getFinancialContext();
                      return (
                        <>
                          <div className="text-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl">
                            <div className="text-lg font-bold text-emerald-600">${context.monthlyIncome}</div>
                            <div className="text-xs text-emerald-700 dark:text-emerald-300">Monthly Income</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl">
                            <div className="text-lg font-bold text-red-600">${context.monthlyExpenses}</div>
                            <div className="text-xs text-red-700 dark:text-red-300">Monthly Expenses</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                            <div className="text-lg font-bold text-blue-600">${context.netIncome}</div>
                            <div className="text-xs text-blue-700 dark:text-blue-300">Net Income</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                            <div className="text-lg font-bold text-purple-600">{context.savingsRate}%</div>
                            <div className="text-xs text-purple-700 dark:text-purple-300">Savings Rate</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Video placeholder */}
              <div className="flex-1 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-600 flex items-center justify-center mb-6">
                <div className="text-center max-w-md mx-auto p-6">
                  {connectionError ? (
                    <>
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-10 w-10 text-white" />
                      </div>
                      <p className="text-red-700 dark:text-red-300 font-medium mb-2">{getErrorHelp(connectionError).title}</p>
                      <p className="text-sm text-red-600 dark:text-red-400 mb-4">{getErrorHelp(connectionError).description}</p>
                      
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Troubleshooting Steps:</h4>
                        <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                          {getErrorHelp(connectionError).actions.map((action, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {connectionError.includes('credentials') && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                          <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                            <ExternalLink className="h-3 w-3" />
                            Visit the <a href="https://tavusapi.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Tavus Dashboard</a> to verify your credentials
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={retryConnection}
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/20"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry Connection {retryCount > 0 && `(${retryCount})`}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Video className="h-10 w-10 text-white" />
                      </div>
                      <p className="text-emerald-700 dark:text-emerald-300 font-medium mb-2">AI Financial Advisor Ready</p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        Get personalized financial advice through video conversation
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Call controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={startVideoCall}
                  disabled={isConnecting}
                  className="h-14 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Video className="h-5 w-5 mr-2" />
                      {connectionError ? 'Try Again' : 'Start Video Session'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            // Active call interface
            <div className="h-full flex flex-col">
              {/* Video container */}
              <div className="flex-1 bg-black rounded-2xl mb-4 relative overflow-hidden">
                {conversationData?.conversationUrl ? (
                  <iframe
                    src={conversationData.conversationUrl}
                    className="w-full h-full rounded-2xl"
                    allow="camera; microphone; fullscreen"
                    title="Tavus AI Video Call"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
                      <p>Loading video session...</p>
                    </div>
                  </div>
                )}
                
                {/* Call status overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <Badge className="bg-emerald-500 text-white border-0">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    Live
                  </Badge>
                  <Badge variant="secondary" className="bg-black/50 text-white border-0">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(callDuration)}
                  </Badge>
                </div>
              </div>

              {/* Call controls */}
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                  className={`h-12 w-12 rounded-full border-2 transition-all duration-300 ${
                    isMuted 
                      ? 'bg-red-500 border-red-500 text-white hover:bg-red-600' 
                      : 'border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleCamera}
                  className={`h-12 w-12 rounded-full border-2 transition-all duration-300 ${
                    isCameraOff 
                      ? 'bg-red-500 border-red-500 text-white hover:bg-red-600' 
                      : 'border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  {isCameraOff ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
                </Button>
                
                <Button
                  onClick={endVideoCall}
                  className="h-12 w-12 rounded-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white transition-all duration-300 transform hover:scale-105"
                >
                  <PhoneOff className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-2 border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}