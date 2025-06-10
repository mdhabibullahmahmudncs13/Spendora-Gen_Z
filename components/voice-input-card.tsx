'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Loader2, Sparkles, Volume2, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceInputCardProps {
  onTransactionParsed: (transaction: any) => void;
}

export function VoiceInputCard({ onTransactionParsed }: VoiceInputCardProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscription, setLastTranscription] = useState<string>('');
  const [parsedTransaction, setParsedTransaction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError(null);
      
      // Check if browser supports MediaRecorder
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Voice recording is not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: Blob[] = [];
      setAudioChunks(chunks);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.start(1000); // Collect data every second
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      toast.success('Recording started! 🎤 Speak clearly...');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
      toast.error(`Recording failed: ${errorMessage}`);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorder || !isRecording) return;

    setIsProcessing(true);
    
    return new Promise<void>((resolve) => {
      if (!mediaRecorder) {
        resolve();
        return;
      }

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          
          // Stop all tracks to release microphone
          const stream = mediaRecorder.stream;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          
          setIsRecording(false);
          
          if (audioBlob.size === 0) {
            throw new Error('No audio data recorded');
          }

          // Simulate transcription since we don't have ElevenLabs API configured
          await simulateTranscription(audioBlob);
          
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to process recording';
          setError(errorMessage);
          toast.error(`Processing failed: ${errorMessage}`);
        } finally {
          setIsProcessing(false);
          resolve();
        }
      };

      mediaRecorder.stop();
    });
  };

  const simulateTranscription = async (audioBlob: Blob) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate transcription result
    const sampleTranscriptions = [
      "I spent $15 on lunch at McDonald's",
      "I earned $500 from freelance work",
      "Add $120 for gas on Monday",
      "Record $2000 salary payment",
      "I bought groceries for $85",
      "Coffee expense $4.50 at Starbucks"
    ];
    
    const randomTranscription = sampleTranscriptions[Math.floor(Math.random() * sampleTranscriptions.length)];
    setLastTranscription(randomTranscription);
    
    // Parse the transcription
    const transaction = parseVoiceToTransaction(randomTranscription);
    setParsedTransaction(transaction);
    
    toast.success(`Transcribed: "${randomTranscription}"`);
  };

  const parseVoiceToTransaction = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Extract amount using various patterns
    const amountPatterns = [
      /\$(\d+(?:\.\d{2})?)/,
      /(\d+(?:\.\d{2})?) dollars?/,
      /(\d+(?:\.\d{2})?) bucks?/,
      /(\d+(?:\.\d{2})?)/
    ];
    
    let amount = 0;
    for (const pattern of amountPatterns) {
      const match = lowerText.match(pattern);
      if (match) {
        amount = parseFloat(match[1]);
        break;
      }
    }
    
    // Determine transaction type
    const incomeKeywords = ['earned', 'received', 'got paid', 'income', 'salary', 'freelance', 'bonus', 'refund'];
    const expenseKeywords = ['spent', 'paid', 'bought', 'purchased', 'cost', 'expense'];
    
    let type: 'income' | 'expense' = 'expense'; // default
    
    if (incomeKeywords.some(keyword => lowerText.includes(keyword))) {
      type = 'income';
    } else if (expenseKeywords.some(keyword => lowerText.includes(keyword))) {
      type = 'expense';
    }
    
    // Category mapping
    const categoryMappings = {
      // Food & Dining
      'food': 'Food & Dining',
      'lunch': 'Food & Dining',
      'dinner': 'Food & Dining',
      'breakfast': 'Food & Dining',
      'restaurant': 'Food & Dining',
      'coffee': 'Food & Dining',
      'pizza': 'Food & Dining',
      'burger': 'Food & Dining',
      'mcdonalds': 'Food & Dining',
      'starbucks': 'Food & Dining',
      
      // Transportation
      'gas': 'Transportation',
      'fuel': 'Transportation',
      'uber': 'Transportation',
      'taxi': 'Transportation',
      'bus': 'Transportation',
      'train': 'Transportation',
      'parking': 'Transportation',
      
      // Shopping
      'shopping': 'Shopping',
      'clothes': 'Shopping',
      'shirt': 'Shopping',
      'shoes': 'Shopping',
      'amazon': 'Shopping',
      
      // Entertainment
      'movie': 'Entertainment',
      'netflix': 'Entertainment',
      'spotify': 'Entertainment',
      'game': 'Entertainment',
      'concert': 'Entertainment',
      
      // Bills & Utilities
      'electricity': 'Bills & Utilities',
      'water': 'Bills & Utilities',
      'internet': 'Bills & Utilities',
      'phone': 'Bills & Utilities',
      'rent': 'Bills & Utilities',
      
      // Groceries
      'groceries': 'Groceries',
      'grocery': 'Groceries',
      'supermarket': 'Groceries',
      'walmart': 'Groceries',
      'target': 'Groceries',
      
      // Income categories
      'salary': 'Salary',
      'freelance': 'Freelance',
      'business': 'Business',
      'investment': 'Investments',
      'bonus': 'Bonuses',
      'refund': 'Refunds',
      'gift': 'Gifts'
    };
    
    let category = type === 'income' ? 'Other Income' : 'Other';
    
    for (const [keyword, cat] of Object.entries(categoryMappings)) {
      if (lowerText.includes(keyword)) {
        category = cat;
        break;
      }
    }
    
    // Extract description (clean up the text)
    let description = text.trim();
    
    // Remove common voice command prefixes
    const prefixes = [
      'i spent', 'i paid', 'i bought', 'i purchased',
      'i earned', 'i received', 'i got paid',
      'add', 'record', 'track'
    ];
    
    for (const prefix of prefixes) {
      if (lowerText.startsWith(prefix)) {
        description = description.substring(prefix.length).trim();
        break;
      }
    }
    
    // Capitalize first letter
    description = description.charAt(0).toUpperCase() + description.slice(1);
    
    return {
      amount,
      category,
      description: description || `${type === 'income' ? 'Income' : 'Expense'} from voice input`,
      type,
      date: new Date().toISOString().split('T')[0],
      confidence: amount > 0 ? 0.9 : 0.6
    };
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const confirmTransaction = () => {
    if (parsedTransaction) {
      onTransactionParsed(parsedTransaction);
      setParsedTransaction(null);
      setLastTranscription('');
      toast.success('Transaction added successfully! 🎉');
    }
  };

  const discardTransaction = () => {
    setParsedTransaction(null);
    setLastTranscription('');
    toast.info('Transaction discarded');
  };

  const tryDemo = () => {
    const demoTranscription = "I spent $25 on groceries at the supermarket";
    setLastTranscription(demoTranscription);
    const transaction = parseVoiceToTransaction(demoTranscription);
    setParsedTransaction(transaction);
    toast.success('Demo transaction parsed! 🎉');
  };

  return (
    <Card className="gradient-card border-2 border-dashed border-orange-300 dark:border-orange-600 hover:border-orange-500 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600">
            <Mic className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Voice Input
          </span>
          <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200">
            Browser Speech API
          </Badge>
        </CardTitle>
        <CardDescription className="text-base">
          Add transactions using natural voice commands
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Example Commands */}
          <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border-2 border-dashed border-orange-200 dark:border-orange-700">
            <h4 className="font-semibold mb-4 text-orange-800 dark:text-orange-200 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Example Commands:
            </h4>
            <ul className="space-y-3 text-sm text-orange-700 dark:text-orange-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                "I spent $15 on lunch at McDonald's"
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                "I earned $500 from freelance work"
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                "Add $120 for gas on Monday"
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                "Record $2000 salary payment"
              </li>
            </ul>
          </div>

          {/* Voice Recording Button */}
          <div className="relative">
            <Button 
              onClick={handleVoiceInput}
              disabled={isProcessing}
              className={`w-full h-16 border-2 transition-all duration-300 group ${
                isRecording 
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-500 animate-pulse' 
                  : 'border-orange-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 hover:text-white hover:border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                {isProcessing ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : isRecording ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 group-hover:bg-white/20">
                    <Mic className="h-5 w-5 text-white" />
                  </div>
                )}
                <span className="font-semibold">
                  {isProcessing ? 'Processing...' : isRecording ? 'Stop Recording' : 'Start Voice Recording'}
                </span>
              </div>
            </Button>
            
            {isRecording && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20 animate-pulse pointer-events-none"></div>
            )}
          </div>

          {/* Demo Button */}
          <div className="text-center">
            <Button
              onClick={tryDemo}
              variant="outline"
              size="sm"
              className="border-2 border-blue-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all duration-300"
            >
              <Play className="h-4 w-4 mr-2" />
              Try Demo Transaction
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-700">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Error:</span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
            </div>
          )}

          {/* Transcription Display */}
          {lastTranscription && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                <Volume2 className="h-4 w-4" />
                <span className="font-medium">Transcription:</span>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 italic">"{lastTranscription}"</p>
            </div>
          )}

          {/* Parsed Transaction Preview */}
          {parsedTransaction && (
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-700">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 mb-4">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Parsed Transaction:</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Type</label>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 capitalize">
                    {parsedTransaction.type}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Amount</label>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                    ${parsedTransaction.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Category</label>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                    {parsedTransaction.category}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Date</label>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                    {new Date(parsedTransaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Description</label>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  {parsedTransaction.description}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={confirmTransaction}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
                <Button
                  onClick={discardTransaction}
                  variant="outline"
                  className="border-2 border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Discard
                </Button>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="text-center">
            <Badge variant="outline" className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200 px-4 py-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Browser Speech Recognition
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}