
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, X } from 'lucide-react';

interface OtherIncomeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { period: string; amount: string }) => void;
  itemName: string;
  currentAmount: number;
  currentPeriod?: string;
}

const OtherIncomeEditModal = ({
  isOpen,
  onClose,
  onSave,
  itemName,
  currentAmount,
  currentPeriod = '2024-2050'
}: OtherIncomeEditModalProps) => {
  const [period, setPeriod] = useState(currentPeriod);
  const [amount, setAmount] = useState(currentAmount.toString());
  const [errors, setErrors] = useState({ period: '', amount: '' });

  useEffect(() => {
    if (isOpen) {
      setPeriod(currentPeriod);
      setAmount(currentAmount.toString());
      setErrors({ period: '', amount: '' });
    }
  }, [isOpen, currentAmount, currentPeriod]);

  const validateInputs = (): boolean => {
    const newErrors = { period: '', amount: '' };
    
    if (!period.trim()) {
      newErrors.period = '请输入收入时间段';
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0) {
      newErrors.amount = '请输入有效的收入金额';
    } else if (amountNum > 10000) {
      newErrors.amount = '收入金额不能超过10000万元/年';
    }

    setErrors(newErrors);
    return !newErrors.period && !newErrors.amount;
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPeriod(value);
    if (value) {
      validateInputs();
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value) {
      validateInputs();
    }
  };

  const handleSave = () => {
    if (validateInputs()) {
      onSave({ period, amount });
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
            <DollarSign className="w-5 h-5 text-orange-600" />
            修改其他收入
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-3 bg-orange-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">{itemName}</p>
            <p className="text-xs text-gray-600">投资理财等其他收入来源</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              收入时间段
            </Label>
            <Input
              type="text"
              value={period}
              onChange={handlePeriodChange}
              onKeyDown={handleKeyDown}
              placeholder="例如：2024-2050"
              className={`text-base ${errors.period ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
              autoFocus
            />
            {errors.period && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.period}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              收入金额
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                onKeyDown={handleKeyDown}
                placeholder="0-10000"
                className={`pr-16 text-base ${errors.amount ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                万元/年
              </span>
            </div>
            {errors.amount && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.amount}
              </p>
            )}
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">
              <strong>收入时间段：</strong>该收入来源的时间范围
            </p>
            <p className="text-xs text-gray-600">
              <strong>收入金额：</strong>每年的收入总额，单位为万元
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
            disabled={!!errors.period || !!errors.amount || !period || !amount}
            className="flex-1 bg-gradient-to-r from-[#CCE9B5] to-[#B8E0A1] text-gray-900 hover:from-[#BBE3A8] hover:to-[#A5D094]"
          >
            确认修改
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OtherIncomeEditModal;
