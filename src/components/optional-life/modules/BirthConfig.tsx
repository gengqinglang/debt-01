
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import SegmentedControl from '@/components/optional-life/SegmentedControl';

interface BirthConfigProps {
  birthStandards: any[];
  childrenCount: number;
  setChildrenCount: (count: number) => void;
  selectedBirthStandard: string;
  setSelectedBirthStandard: (value: string) => void;
  customAmounts: {[key: string]: string};
  onEditAmount: (option: any) => void;
  isConfirmed: boolean;
  childrenAges?: string[];
  setChildrenAges?: (ages: string[]) => void;
}

const BirthConfig: React.FC<BirthConfigProps> = ({
  birthStandards,
  childrenCount,
  setChildrenCount,
  selectedBirthStandard,
  setSelectedBirthStandard,
  customAmounts,
  onEditAmount,
  isConfirmed,
  childrenAges: incomingChildrenAges = [],
  setChildrenAges
}) => {
  const [localAges, setLocalAges] = React.useState<string[]>(() => Array.from({ length: childrenCount }, (_, i) => (28 + i * 2).toString()));
  const childrenAges = setChildrenAges ? incomingChildrenAges : localAges;
  // 生成孩子年龄数组的辅助函数（支持本地或外部状态）
  const updateChildrenAges = (count: number) => {
    const baseAges = (setChildrenAges ? childrenAges : localAges) as string[];
    const newAges = [...baseAges];
    if (count > newAges.length) {
      // 添加新的年龄，第一胎28岁，第二胎30岁，第三胎32岁，以此类推
      for (let i = newAges.length; i < count; i++) {
        const defaultAge = 28 + (i * 2);
        newAges.push(defaultAge.toString());
      }
    } else if (count < newAges.length) {
      // 移除多余的年龄
      newAges.splice(count);
    }
    if (setChildrenAges) {
      setChildrenAges(newAges);
    } else {
      setLocalAges(newAges);
    }
  };

  // 当孩子数量改变时，更新年龄数组
  const handleChildrenCountChange = (count: number) => {
    setChildrenCount(count);
    updateChildrenAges(count);
  };

  // 更新单个孩子的年龄（支持本地或外部状态）
  const updateChildAge = (index: number, age: string) => {
    const baseAges = (setChildrenAges ? childrenAges : localAges) as string[];
    const newAges = [...baseAges];
    newAges[index] = age;
    if (setChildrenAges) {
      setChildrenAges(newAges);
    } else {
      setLocalAges(newAges);
    }
  };

  // 获取默认生育年龄（从28岁开始，每胎+2）
  const getDefaultAgeForIndex = (index: number) => (28 + index * 2).toString();


  // 获取孩子的称呼
  const getChildTitle = (index: number) => {
    const titles = ['老大', '老二', '老三', '老四', '老五'];
    return titles[index] || `老${index + 1}`;
  };
  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-3">计划生几个孩子：</p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleChildrenCountChange(Math.max(1, childrenCount - 1))}
            disabled={childrenCount <= 1}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B3EBEF] to-[#8FD8DC] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center justify-center"
          >
            <Minus className="w-4 h-4" strokeWidth={2} />
          </button>
          
          <div className="px-6 py-2 rounded-xl bg-white shadow-sm border border-gray-200 min-w-[100px] text-center">
            <span className="text-lg font-bold text-gray-900">{childrenCount}个</span>
          </div>
          
          <button
            onClick={() => handleChildrenCountChange(Math.min(5, childrenCount + 1))}
            disabled={childrenCount >= 5}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B3EBEF] to-[#8FD8DC] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center justify-center"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* 计划生育时间设置 */}
      {childrenCount > 0 && (
        <div className="space-y-3">
          
          {Array.from({ length: childrenCount }, (_, index) => {
            const fallback = getDefaultAgeForIndex(index);
            const currentAge = (childrenAges[index] || fallback).toString();
            const ageNum = parseInt(currentAge);
            return (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">{getChildTitle(index)}计划生育时间：</p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => updateChildAge(index, Math.max(18, ageNum - 1).toString())}
                    disabled={ageNum <= 18 || isConfirmed}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B3EBEF] to-[#8FD8DC] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" strokeWidth={2} />
                  </button>
                  
                  <div className="px-6 py-2 rounded-xl bg-white shadow-sm border border-gray-200 min-w-[100px] text-center cursor-text">
                    <div className="flex items-baseline justify-center gap-1">
                      <input
                        type="number"
                        value={currentAge}
                        onChange={(e) => updateChildAge(index, e.target.value)}
                        min={18}
                        max={50}
                        disabled={isConfirmed}
                        className="text-lg font-bold text-gray-900 bg-transparent text-center w-auto outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:outline-none cursor-text"
                        style={{ width: `${currentAge.toString().length + 1}ch` }}
                      />
                      <span className="text-lg font-bold text-gray-500">岁</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => updateChildAge(index, Math.min(50, ageNum + 1).toString())}
                    disabled={ageNum >= 50 || isConfirmed}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B3EBEF] to-[#8FD8DC] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        <SegmentedControl
          options={birthStandards}
          value={selectedBirthStandard}
          onChange={setSelectedBirthStandard}
          customAmounts={customAmounts}
          activeTab="生育"
          onEditAmount={onEditAmount}
          isConfirmed={isConfirmed}
        />
      </div>

    </div>
  );
};

export default BirthConfig;
