
import React from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import SegmentedControl from '@/components/optional-life/SegmentedControl';

interface CareConfigProps {
  careOptions: any[];
  careStandards: any[];
  selectedCareRecipients: {[key: string]: boolean};
  handleCareRecipientToggle: (recipientId: string) => void;
  careStartAge: number;
  setCareStartAge: (age: number) => void;
  careCount: number;
  setCareCount: (count: number) => void;
  careYears: string;
  setCareYears: (years: string) => void;
  selectedCareStandard: string;
  setSelectedCareStandard: (standard: string) => void;
  customAmounts: {[key: string]: string};
  onEditAmount: (option: any) => void;
  isConfirmed: boolean;
}

const CareConfig: React.FC<CareConfigProps> = ({
  careOptions,
  careStandards,
  selectedCareRecipients,
  handleCareRecipientToggle,
  careStartAge,
  setCareStartAge,
  careCount,
  setCareCount,
  careYears,
  setCareYears,
  selectedCareStandard,
  setSelectedCareStandard,
  customAmounts,
  onEditAmount,
  isConfirmed
}) => {
  const handleAgeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 25 && value <= 65) {
      setCareStartAge(value);
    }
  };

  const handleCareYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCareYears(e.target.value);
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-3">从我几岁开始赡养：</p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setCareStartAge(Math.max(25, careStartAge - 1))}
            disabled={careStartAge <= 25}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B3EBEF] to-[#8FD8DC] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center justify-center"
          >
            <Minus className="w-4 h-4" strokeWidth={2} />
          </button>
          
          <div 
            className="px-6 py-2 rounded-xl bg-white shadow-sm border border-gray-200 min-w-[100px] text-center cursor-text"
          >
            <div className="flex items-baseline justify-center gap-1">
              <input
                type="number"
                value={careStartAge}
                onChange={handleAgeInputChange}
                min={25}
                max={65}
                className="text-lg font-bold text-gray-900 bg-transparent text-center w-auto outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:outline-none cursor-text"
                style={{ width: `${careStartAge.toString().length + 1}ch` }}
              />
              <span className="text-lg font-bold text-gray-500">岁</span>
            </div>
          </div>
          
          <button
            onClick={() => setCareStartAge(Math.min(65, careStartAge + 1))}
            disabled={careStartAge >= 65}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B3EBEF] to-[#8FD8DC] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center justify-center"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-3">赡养几个人：</p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setCareCount(Math.max(1, careCount - 1))}
            disabled={careCount <= 1}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B3EBEF] to-[#8FD8DC] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center justify-center"
          >
            <Minus className="w-4 h-4" strokeWidth={2} />
          </button>
          
          <div 
            className="px-6 py-2 rounded-xl bg-white shadow-sm border border-gray-200 min-w-[100px] text-center cursor-text"
          >
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-lg font-bold text-gray-900">{careCount}</span>
              <span className="text-lg font-bold text-gray-500">人</span>
            </div>
          </div>
          
          <button
            onClick={() => setCareCount(careCount + 1)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B3EBEF] to-[#8FD8DC] text-white font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-3">赡养多少年：</p>
        <div className="flex items-center justify-center">
          <div 
            className="px-6 py-2 rounded-xl bg-white shadow-sm border border-gray-200 min-w-[120px] text-center"
          >
            <div className="flex items-baseline justify-center gap-1">
              <input
                type="number"
                value={careYears}
                onChange={handleCareYearsChange}
                placeholder="输入年数"
                className="text-lg font-bold text-gray-900 bg-transparent text-center w-auto outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:outline-none"
                style={{ width: `${Math.max(careYears.length, 3)}ch` }}
              />
              <span className="text-lg font-bold text-gray-500">年</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-baseline gap-2">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-700">选择赡养支出水平</h4>
          <span className="text-xs text-gray-500">（万元/人/年）</span>
        </div>
        <SegmentedControl
          options={careStandards}
          value={selectedCareStandard}
          onChange={setSelectedCareStandard}
          customAmounts={customAmounts}
          activeTab="赡养"
          onEditAmount={onEditAmount}
          isConfirmed={isConfirmed}
        />
      </div>
    </div>
  );
};

export default CareConfig;
