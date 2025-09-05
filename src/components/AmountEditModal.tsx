
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Check, X } from 'lucide-react';

interface AmountEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newAmount: string) => void;
  currentAmount: string;
  itemName: string;
  minAmount: number;
  maxAmount: number;
  unit?: string;
}

const AmountEditModal = ({
  isOpen,
  onClose,
  onSave,
  currentAmount,
  itemName,
  minAmount,
  maxAmount,
  unit = '万'
}: AmountEditModalProps) => {
  const [inputValue, setInputValue] = useState(currentAmount);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputValue(currentAmount);
      setError('');
    }
  }, [isOpen, currentAmount]);

  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setError('请输入有效的数字');
      return false;
    }
    if (numValue < minAmount || numValue > maxAmount) {
      setError(`金额范围应在 ${minAmount}-${maxAmount}${unit} 之间`);
      return false;
    }
    setError('');
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      validateAmount(value);
    } else {
      setError('');
    }
  };

  const handleSave = () => {
    if (validateAmount(inputValue)) {
      onSave(inputValue);
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
            <Edit className="w-5 h-5 text-blue-600" />
            修改支出金额
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {itemName}
            </label>
            <div className="relative">
              <Input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={`${minAmount}-${maxAmount}`}
                className={`pr-8 text-base ${error ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
                autoFocus
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                {unit}
              </span>
            </div>
            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {error}
              </p>
            )}
            {!error && inputValue && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                金额有效
              </p>
            )}
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              建议范围：{minAmount}-{maxAmount}{unit}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              您可以根据个人情况在此范围内调整
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
            disabled={!!error || !inputValue}
            className="flex-1 bg-gradient-to-r from-[#CCE9B5] to-[#B8E0A1] text-gray-900 hover:from-[#BBE3A8] hover:to-[#A5D094]"
          >
            确认修改
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AmountEditModal;
