export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'No text provided for parsing' },
        { status: 400 }
      );
    }

    // Parse the voice input to extract transaction details
    const transaction = parseVoiceToTransaction(text);
    
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Transaction parsing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to parse transaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function parseVoiceToTransaction(text: string) {
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
}