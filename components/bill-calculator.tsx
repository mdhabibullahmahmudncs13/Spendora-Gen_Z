'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bill, BillItem } from '@/types';
import { Calculator, Plus, Trash2, Save, FileText, DollarSign, Percent, Minus, ShoppingCart, Receipt, Sparkles, Edit3, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

interface BillCalculatorProps {
  bills: Bill[];
  onSaveBill: (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateBill: (id: string, bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteBill: (id: string) => void;
}

export function BillCalculator({ bills, onSaveBill, onUpdateBill, onDeleteBill }: BillCalculatorProps) {
  const [currentBill, setCurrentBill] = useState<Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    items: [],
    subtotal: 0,
    tax: 0,
    taxRate: 0,
    discount: 0,
    discountType: 'percentage',
    total: 0,
  });
  
  const [editingBillId, setEditingBillId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: '', price: '', quantity: '1' });
  const [showBillForm, setShowBillForm] = useState(false);

  const calculateTotals = (items: BillItem[], taxRate: number, discount: number, discountType: 'percentage' | 'fixed') => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = (subtotal * discount) / 100;
    } else {
      discountAmount = discount;
    }
    
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const tax = (discountedSubtotal * taxRate) / 100;
    const total = discountedSubtotal + tax;
    
    return { subtotal, tax, total };
  };

  const addItem = () => {
    if (!newItem.name.trim() || !newItem.price || parseFloat(newItem.price) <= 0) {
      toast.error('Please enter valid item name and price');
      return;
    }

    const item: BillItem = {
      id: Date.now().toString(),
      name: newItem.name.trim(),
      price: parseFloat(newItem.price),
      quantity: parseInt(newItem.quantity) || 1,
    };

    const updatedItems = [...currentBill.items, item];
    const totals = calculateTotals(updatedItems, currentBill.taxRate, currentBill.discount, currentBill.discountType);
    
    setCurrentBill({
      ...currentBill,
      items: updatedItems,
      ...totals,
    });

    setNewItem({ name: '', price: '', quantity: '1' });
    toast.success('Item added successfully! 🛒');
  };

  const removeItem = (itemId: string) => {
    const updatedItems = currentBill.items.filter(item => item.id !== itemId);
    const totals = calculateTotals(updatedItems, currentBill.taxRate, currentBill.discount, currentBill.discountType);
    
    setCurrentBill({
      ...currentBill,
      items: updatedItems,
      ...totals,
    });
    
    toast.success('Item removed');
  };

  const updateTaxRate = (taxRate: number) => {
    const totals = calculateTotals(currentBill.items, taxRate, currentBill.discount, currentBill.discountType);
    setCurrentBill({
      ...currentBill,
      taxRate,
      ...totals,
    });
  };

  const updateDiscount = (discount: number, discountType: 'percentage' | 'fixed') => {
    const totals = calculateTotals(currentBill.items, currentBill.taxRate, discount, discountType);
    setCurrentBill({
      ...currentBill,
      discount,
      discountType,
      ...totals,
    });
  };

  const saveBill = () => {
    if (!currentBill.title.trim()) {
      toast.error('Please enter a bill title');
      return;
    }

    if (currentBill.items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    if (editingBillId) {
      onUpdateBill(editingBillId, currentBill);
      toast.success('Bill updated successfully! 📄');
      setEditingBillId(null);
    } else {
      onSaveBill(currentBill);
      toast.success('Bill saved successfully! 📄');
    }

    resetForm();
  };

  const resetForm = () => {
    setCurrentBill({
      title: '',
      description: '',
      items: [],
      subtotal: 0,
      tax: 0,
      taxRate: 0,
      discount: 0,
      discountType: 'percentage',
      total: 0,
    });
    setShowBillForm(false);
    setEditingBillId(null);
  };

  const editBill = (bill: Bill) => {
    setCurrentBill({
      title: bill.title,
      description: bill.description || '',
      items: bill.items,
      subtotal: bill.subtotal,
      tax: bill.tax,
      taxRate: bill.taxRate,
      discount: bill.discount,
      discountType: bill.discountType,
      total: bill.total,
    });
    setEditingBillId(bill.id);
    setShowBillForm(true);
  };

  const duplicateBill = (bill: Bill) => {
    setCurrentBill({
      title: `${bill.title} (Copy)`,
      description: bill.description || '',
      items: bill.items.map(item => ({ ...item, id: Date.now().toString() + Math.random() })),
      subtotal: bill.subtotal,
      tax: bill.tax,
      taxRate: bill.taxRate,
      discount: bill.discount,
      discountType: bill.discountType,
      total: bill.total,
    });
    setEditingBillId(null);
    setShowBillForm(true);
    toast.success('Bill duplicated! 📋');
  };

  return (
    <div className="space-y-8 p-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute top-4 right-4 animate-float">
          <Calculator className="h-8 w-8 text-indigo-200" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Bill Calculator 🧮</h1>
              <p className="text-xl text-indigo-100 mb-6">Create detailed bills with items, taxes, and discounts</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Receipt className="h-5 w-5" />
                  <span className="font-medium">{bills.length} Saved Bills</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Calculator className="h-5 w-5" />
                  <span className="font-medium">Smart Calculator</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-pulse-slow">
                <Calculator className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowBillForm(true)}
          className="h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Bill
        </Button>
      </div>

      {/* Bill Form */}
      {showBillForm && (
        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {editingBillId ? 'Edit Bill' : 'Create New Bill'}
              </span>
            </CardTitle>
            <CardDescription className="text-base">
              Add items, set taxes and discounts to calculate your bill total
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bill Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bill-title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Bill Title *
                </Label>
                <Input
                  id="bill-title"
                  value={currentBill.title}
                  onChange={(e) => setCurrentBill({ ...currentBill, title: e.target.value })}
                  placeholder="e.g., Grocery Shopping, Restaurant Bill"
                  className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 transition-colors duration-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bill-description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Description (Optional)
                </Label>
                <Input
                  id="bill-description"
                  value={currentBill.description}
                  onChange={(e) => setCurrentBill({ ...currentBill, description: e.target.value })}
                  placeholder="Brief description"
                  className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 transition-colors duration-300"
                />
              </div>
            </div>

            {/* Add Item Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  Add Item
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label className="text-sm font-semibold text-blue-700 dark:text-blue-300">Item Name *</Label>
                    <Input
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="e.g., Coffee, Notebook"
                      className="mt-1 h-11 border-2 border-blue-200 dark:border-blue-700 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && addItem()}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-blue-700 dark:text-blue-300">Price *</Label>
                    <div className="relative mt-1">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600">
                        <DollarSign className="h-3 w-3 text-white" />
                      </div>
                      <Input
                        type="number"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        placeholder="0.00"
                        className="pl-12 h-11 border-2 border-blue-200 dark:border-blue-700 focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && addItem()}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-blue-700 dark:text-blue-300">Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      className="mt-1 h-11 border-2 border-blue-200 dark:border-blue-700 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && addItem()}
                    />
                  </div>
                </div>
                <Button
                  onClick={addItem}
                  className="mt-4 w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>

            {/* Items List */}
            {currentBill.items.length > 0 && (
              <Card className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 border-2 border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-600" />
                    Items ({currentBill.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentBill.items.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                              #{index + 1}
                            </Badge>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                            <span>${item.price.toFixed(2)} × {item.quantity}</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              = ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 transition-all duration-300 rounded-xl"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tax and Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-700">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Percent className="h-5 w-5 text-orange-600" />
                    Tax Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-orange-700 dark:text-orange-300">Tax Percentage</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={currentBill.taxRate}
                        onChange={(e) => updateTaxRate(parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="pr-12 h-11 border-2 border-orange-200 dark:border-orange-700 focus:border-orange-500"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-600 font-semibold">
                        %
                      </div>
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      Tax Amount: ${currentBill.tax.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-200 dark:border-emerald-700">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Minus className="h-5 w-5 text-emerald-600" />
                    Discount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateDiscount(currentBill.discount, 'percentage')}
                        className={`p-2 rounded-lg border-2 transition-all duration-300 ${
                          currentBill.discountType === 'percentage'
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'border-emerald-200 hover:border-emerald-400'
                        }`}
                      >
                        Percentage
                      </button>
                      <button
                        onClick={() => updateDiscount(currentBill.discount, 'fixed')}
                        className={`p-2 rounded-lg border-2 transition-all duration-300 ${
                          currentBill.discountType === 'fixed'
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'border-emerald-200 hover:border-emerald-400'
                        }`}
                      >
                        Fixed Amount
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={currentBill.discount}
                        onChange={(e) => updateDiscount(parseFloat(e.target.value) || 0, currentBill.discountType)}
                        placeholder="0.00"
                        className="h-11 border-2 border-emerald-200 dark:border-emerald-700 focus:border-emerald-500"
                      />
                      {currentBill.discountType === 'percentage' && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 font-semibold">
                          %
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bill Summary */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Receipt className="h-6 w-6 text-purple-600" />
                  Bill Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">${currentBill.subtotal.toFixed(2)}</span>
                  </div>
                  {currentBill.discount > 0 && (
                    <div className="flex justify-between text-lg text-emerald-600">
                      <span>Discount ({currentBill.discountType === 'percentage' ? `${currentBill.discount}%` : 'Fixed'}):</span>
                      <span className="font-semibold">
                        -${currentBill.discountType === 'percentage' 
                          ? ((currentBill.subtotal * currentBill.discount) / 100).toFixed(2)
                          : currentBill.discount.toFixed(2)
                        }
                      </span>
                    </div>
                  )}
                  {currentBill.taxRate > 0 && (
                    <div className="flex justify-between text-lg text-orange-600">
                      <span>Tax ({currentBill.taxRate}%):</span>
                      <span className="font-semibold">+${currentBill.tax.toFixed(2)}</span>
                    </div>
                  )}
                  <hr className="border-purple-200 dark:border-purple-700" />
                  <div className="flex justify-between text-2xl font-bold">
                    <span className="text-purple-800 dark:text-purple-200">Total:</span>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ${currentBill.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex-1 h-12 border-2 border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                onClick={saveBill}
                disabled={!currentBill.title.trim() || currentBill.items.length === 0}
                className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingBillId ? 'Update Bill' : 'Save Bill'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Bills */}
      {bills.length > 0 && (
        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Saved Bills
              </span>
              <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700">
                {bills.length} Bills
              </Badge>
            </CardTitle>
            <CardDescription className="text-base">
              Your previously created bills and calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bills.map((bill) => (
                <Card key={bill.id} className="gradient-card border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">
                          {bill.title}
                        </CardTitle>
                        {bill.description && (
                          <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {bill.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => editBill(bill)}
                          className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => duplicateBill(bill)}
                          className="h-8 w-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            onDeleteBill(bill.id);
                            toast.success('Bill deleted');
                          }}
                          className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Items:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{bill.items.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">${bill.subtotal.toFixed(2)}</span>
                      </div>
                      {bill.tax > 0 && (
                        <div className="flex justify-between text-sm text-orange-600">
                          <span>Tax ({bill.taxRate}%):</span>
                          <span className="font-semibold">+${bill.tax.toFixed(2)}</span>
                        </div>
                      )}
                      {bill.discount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600">
                          <span>Discount:</span>
                          <span className="font-semibold">
                            -${bill.discountType === 'percentage' 
                              ? ((bill.subtotal * bill.discount) / 100).toFixed(2)
                              : bill.discount.toFixed(2)
                            }
                          </span>
                        </div>
                      )}
                      <hr className="border-slate-200 dark:border-slate-700" />
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-slate-800 dark:text-slate-200">Total:</span>
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          ${bill.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Created: {new Date(bill.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {bills.length === 0 && !showBillForm && (
        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
          <CardContent className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-10 w-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">No Bills Created Yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Start by creating your first bill with items, taxes, and discounts
            </p>
            <Button
              onClick={() => setShowBillForm(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Bill
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}