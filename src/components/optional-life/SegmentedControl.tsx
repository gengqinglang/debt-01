
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  description?: string;
  price?: string;
  icon?: React.ComponentType<any>;
  iconColor?: string;
  gradient?: string;
  accentColor?: string;
  minAmount?: number;
  maxAmount?: number;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  customAmounts?: { [key: string]: string };
  activeTab?: string;
  onEditAmount?: (option: Option) => void;
  isConfirmed?: boolean;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  className = '',
  customAmounts = {},
  activeTab = '',
  onEditAmount,
  isConfirmed = false
}) => {
  // 获取显示的金额
  const getDisplayAmount = (option: Option) => {
    const key = `${activeTab}-${option.value}`;
    return customAmounts[key] || option.price;
  };

  return (
    <div className={`bg-gray-50 rounded-2xl p-2 ${className}`}>
      <div className="grid grid-cols-1 gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          const displayAmount = getDisplayAmount(option);
          
          return (
            <button
              key={option.value}
              onClick={() => !isConfirmed && onChange(option.value)}
              className={`relative p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 transform hover:scale-[1.01] ${
                isSelected
                  ? 'bg-white shadow-2xl shadow-[#B3EBEF]/30 text-gray-900 border-2 border-[#B3EBEF] ring-2 ring-[#B3EBEF]/20 ring-offset-2 ring-offset-gray-50'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-transparent hover:border-gray-100 hover:shadow-md shadow-sm'
              } ${isConfirmed ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div>
                    <div className={`font-semibold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                      {option.label}
                    </div>
                    {option.description && (
                      <div className={`text-xs mt-1 leading-relaxed ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {displayAmount && (
                    <div className="flex flex-col items-end">
                      <div className={`font-bold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                        {displayAmount}万
                      </div>
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] mt-2 shadow-sm"></div>
                      )}
                    </div>
                  )}
                  {!isConfirmed && onEditAmount && (
                    <div
                      className="w-7 h-7 p-0 hover:bg-gray-100 flex-shrink-0 rounded cursor-pointer flex items-center justify-center transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditAmount(option);
                      }}
                    >
                      <Edit className="w-3 h-3 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
              {isSelected && (
                <>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#B3EBEF]/5 to-[#8FD8DC]/5 pointer-events-none"></div>
                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] rounded-full shadow-lg"></div>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SegmentedControl;
