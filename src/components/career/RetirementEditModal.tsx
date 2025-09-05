
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Check, X } from 'lucide-react';

interface RetirementEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: string) => void;
  itemName: string;
  currentAmount: number;
}

const RetirementEditModal = ({
  isOpen,
  onClose,
  onSave,
  itemName,
  currentAmount
}: RetirementEditModalProps) => {
  const [amount, setAmount] = useState((currentAmount * 10000).toString());
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Convert from 万元 to 元
      setAmount((currentAmount * 10000).toString());
      setError('');
    }
  }, [isOpen, currentAmount]);

  const validateInput = (): boolean => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0) {
      setError('请输入有效的退休金金额');
      return false;
    } else if (amountNum > 100000) {
      setError('退休金金额不能超过10万元/月');
      return false;
    }
    setError('');
    return true;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value) {
      validateInput();
    }
  };

  const handleSave = () => {
    if (validateInput()) {
      // Convert from 元 to 万元
      const amountInWan = (parseFloat(amount) / 10000).toString();
      onSave(amountInWan);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-green-600" />
            修改退休金
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              退休金金额
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                onKeyDown={handleKeyDown}
                placeholder="0-100000"
                className={`pr-12 text-base ${error ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
                autoFocus
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                元/月
              </span>
            </div>
            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>退休金：</strong>退休后每月领取的养老金金额，单位为元/月
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={!!error || !amount}
            className="flex-1 bg-gradient-to-r from-[#CCE9B5] to-[#B8E0A1] text-gray-900 hover:from-[#BBE3A8] hover:to-[#A5D094]"
          >
            确认修改
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RetirementEditModal;
