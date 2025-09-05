
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HandHeart, Plus } from 'lucide-react';

interface AddExpenditureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (itemType: string) => void;
}

const AddExpenditureModal: React.FC<AddExpenditureModalProps> = ({
  isOpen,
  onClose,
  onSelectItem
}) => {
  const availableItems = [
    {
      id: 'family-support',
      name: '资助亲人',
      description: '资助家庭成员、帮扶亲友的费用',
      icon: HandHeart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const handleSelectItem = (itemId: string) => {
    onSelectItem(itemId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-gray-800">
            新增支出科目
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {availableItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card 
                key={item.id}
                className={`cursor-pointer hover:shadow-md transition-all duration-200 ${item.borderColor}`}
                onClick={() => handleSelectItem(item.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bgColor}`}>
                      <IconComponent className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <Plus className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <Button 
            onClick={onClose}
            variant="outline"
            className="px-6"
          >
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenditureModal;
