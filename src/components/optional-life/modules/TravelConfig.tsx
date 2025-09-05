import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Edit, Plane } from 'lucide-react';
import AmountEditModal from '@/components/AmountEditModal';

interface TravelConfigProps {
  travelStandards: any[];
  selectedTravelStandard: string;
  setSelectedTravelStandard: (standard: string) => void;
  customAmounts: {[key: string]: string};
  onEditAmount: (option: any) => void;
  isConfirmed: boolean;
}

const TravelConfig: React.FC<TravelConfigProps> = ({
  travelStandards,
  selectedTravelStandard,
  setSelectedTravelStandard,
  customAmounts,
  onEditAmount,
  isConfirmed
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<any>(null);

  const getDisplayAmount = (option: any) => {
    const key = `旅游-${option.value}`;
    return customAmounts[key] || option.price;
  };

  const openEditModal = (option: any) => {
    setEditingOption(option);
    setEditModalOpen(true);
    onEditAmount(option);
  };

  if (isConfirmed) {
    const selectedOption = travelStandards.find(s => s.value === selectedTravelStandard);
    return (
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Plane className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">已选择标准</h3>
              <p className="text-sm text-gray-600">{selectedOption?.label}</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-cyan-600 mb-2">
            {getDisplayAmount(selectedOption)}万/年
          </div>
          <p className="text-sm text-gray-600">{selectedOption?.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700 mb-3">
        选择旅游消费标准：
      </div>
      
      <RadioGroup value={selectedTravelStandard} onValueChange={setSelectedTravelStandard} className="space-y-2">
        {travelStandards.map((option) => {
          return (
            <div key={option.value} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-2">{option.label}</div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {option.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <div className="text-base font-bold text-gray-900">
                        {getDisplayAmount(option)}万/年
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-8 h-8 p-0 hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openEditModal(option);
                      }}
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </Button>
                  </div>
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default TravelConfig;