import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HousePlan {
  id: string;
  motive: string;
  roomType: string;
  amount: string;
  purchaseAge?: number;
  purchaseMethod?: string;
  downPayment?: number;
  loanAmount?: number;
  loanYears?: number;
  monthlyPayment?: number;
  saleInfo?: {
    currentValue: number;
    earlyRepayment: number;
  };
}

interface HousePlanEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPlan: Partial<HousePlan>) => void;
  plan: HousePlan;
}

const HousePlanEditModal: React.FC<HousePlanEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  plan
}) => {
  const [formData, setFormData] = useState({
    purchaseAge: plan.purchaseAge?.toString() || '',
    amount: plan.amount || ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // 生成年龄选项 (18-70岁)
  const ageOptions = Array.from({ length: 53 }, (_, i) => i + 18);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        purchaseAge: plan.purchaseAge?.toString() || '',
        amount: plan.amount || ''
      });
      setErrors({});
    }
  }, [isOpen, plan]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.purchaseAge) {
      newErrors.purchaseAge = '请选择购房年龄';
    }
    
    if (!formData.amount) {
      newErrors.amount = '请输入购房预算';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = '请输入有效的预算金额';
      } else if (amount > 10000) {
        newErrors.amount = '预算金额不能超过10000万元';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        purchaseAge: parseInt(formData.purchaseAge),
        amount: formData.amount
      });
      onClose();
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 只允许数字和小数点
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, amount: value }));
      // 清除错误信息
      if (errors.amount) {
        setErrors(prev => ({ ...prev, amount: '' }));
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>编辑购房计划</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* 购房动机（只读） */}
          <div>
            <Label className="text-sm font-medium text-gray-700">购房动机</Label>
            <div className="mt-1 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
              {plan.motive}
            </div>
          </div>

          {/* 购房年龄 */}
          <div>
            <Label className="text-sm font-medium text-gray-700">购房年龄</Label>
            <Select
              value={formData.purchaseAge}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, purchaseAge: value }));
                if (errors.purchaseAge) {
                  setErrors(prev => ({ ...prev, purchaseAge: '' }));
                }
              }}
            >
              <SelectTrigger className={`mt-1 ${errors.purchaseAge ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="请选择购房年龄" />
              </SelectTrigger>
              <SelectContent className="max-h-40">
                {ageOptions.map((age) => (
                  <SelectItem key={age} value={age.toString()}>
                    {age}岁
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.purchaseAge && (
              <p className="text-red-500 text-xs mt-1">{errors.purchaseAge}</p>
            )}
          </div>

          {/* 购房预算 */}
          <div>
            <Label className="text-sm font-medium text-gray-700">购房预算</Label>
            <div className="mt-1 relative">
              <Input
                type="text"
                value={formData.amount}
                onChange={handleAmountChange}
                placeholder="请输入购房预算"
                className={errors.amount ? 'border-red-500 pr-12' : 'pr-12'}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                万元
              </span>
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleSave}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HousePlanEditModal;