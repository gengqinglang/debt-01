
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AssetLiabilityItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: 'asset' | 'liability';
}

interface AssetLiabilityEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AssetLiabilityItem | null;
  onSave: (item: AssetLiabilityItem) => void;
}

const AssetLiabilityEditModal: React.FC<AssetLiabilityEditModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave
}) => {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (item) {
      setAmount(item.amount.toString());
    }
  }, [item]);

  const handleSave = () => {
    if (item && amount) {
      const updatedItem = {
        ...item,
        amount: parseFloat(amount) || 0
      };
      onSave(updatedItem);
      onClose();
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {item.type === 'asset' ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            编辑{item.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              {item.type === 'asset' ? '资产' : '负债'}金额（万元）
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="请输入金额"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg py-3"
              min="0"
              step="0.1"
            />
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">科目分类</div>
            <div className="text-sm font-medium text-gray-800">{item.category}</div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={!amount || parseFloat(amount) < 0}
            className="flex-1 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] text-gray-900 hover:from-[#A5E0E4] hover:to-[#7DD3D7]"
          >
            确认保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetLiabilityEditModal;
