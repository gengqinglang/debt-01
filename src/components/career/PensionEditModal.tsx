
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Check, X } from 'lucide-react';

interface PensionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { balance: string; contributionRate: string }) => void;
  itemName: string;
  currentBalance: number;
  currentContributionRate: number;
}

const PensionEditModal = ({
  isOpen,
  onClose,
  onSave,
  itemName,
  currentBalance,
  currentContributionRate
}: PensionEditModalProps) => {
  const [balance, setBalance] = useState(currentBalance.toString());
  const [contributionRate, setContributionRate] = useState(currentContributionRate.toString());
  const [errors, setErrors] = useState({ balance: '', contributionRate: '' });

  useEffect(() => {
    if (isOpen) {
      setBalance(currentBalance.toString());
      setContributionRate(currentContributionRate.toString());
      setErrors({ balance: '', contributionRate: '' });
    }
  }, [isOpen, currentBalance, currentContributionRate]);

  const validateInputs = (): boolean => {
    const newErrors = { balance: '', contributionRate: '' };
    
    const balanceNum = parseFloat(balance);
    if (isNaN(balanceNum) || balanceNum < 0) {
      newErrors.balance = '请输入有效的余额金额';
    } else if (balanceNum > 1000) {
      newErrors.balance = '余额不能超过1000万';
    }

    const rateNum = parseFloat(contributionRate);
    if (isNaN(rateNum) || rateNum < 0) {
      newErrors.contributionRate = '请输入有效的缴纳比例';
    } else if (rateNum > 20) {
      newErrors.contributionRate = '缴纳比例不能超过20%';
    }

    setErrors(newErrors);
    return !newErrors.balance && !newErrors.contributionRate;
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBalance(value);
    if (value) {
      validateInputs();
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContributionRate(value);
    if (value) {
      validateInputs();
    }
  };

  const handleSave = () => {
    if (validateInputs()) {
      onSave({ balance, contributionRate });
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
            <Building2 className="w-5 h-5 text-blue-600" />
            修改企业年金
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">{itemName}</p>
            <p className="text-xs text-gray-600">企业补充养老保险计划</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              企业年金余额
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={balance}
                onChange={handleBalanceChange}
                onKeyDown={handleKeyDown}
                placeholder="0-1000"
                className={`pr-8 text-base ${errors.balance ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
                autoFocus
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                万
              </span>
            </div>
            {errors.balance && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.balance}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              缴纳比例
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={contributionRate}
                onChange={handleRateChange}
                onKeyDown={handleKeyDown}
                placeholder="0-20"
                className={`pr-8 text-base ${errors.contributionRate ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                %
              </span>
            </div>
            {errors.contributionRate && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.contributionRate}
              </p>
            )}
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">
              <strong>企业年金余额：</strong>当前账户中的年金总额
            </p>
            <p className="text-xs text-gray-600">
              <strong>缴纳比例：</strong>每月工资的缴纳百分比
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
            disabled={!!errors.balance || !!errors.contributionRate || !balance || !contributionRate}
            className="flex-1 bg-gradient-to-r from-[#CCE9B5] to-[#B8E0A1] text-gray-900 hover:from-[#BBE3A8] hover:to-[#A5D094]"
          >
            确认修改
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PensionEditModal;
