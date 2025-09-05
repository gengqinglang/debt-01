
import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface CountSelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}

const CountSelector: React.FC<CountSelectorProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  unit = '个'
}) => {
  return (
    <div className="space-y-3">
      <p className="text-xs sm:text-sm font-semibold text-gray-700">{label}：</p>
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => onChange(Math.max(min, value - 1))}
            disabled={value <= min}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B3EBEF] to-[#8FD8DC] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 flex items-center justify-center"
          >
            <Minus className="w-4 h-4" strokeWidth={2} />
          </button>
          
          <div className="px-6 py-2 rounded-xl bg-white shadow-sm border border-gray-200 min-w-[80px] text-center">
            <span className="text-lg font-bold text-gray-900">{value}{unit}</span>
          </div>
          
          <button
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B3EBEF] to-[#8FD8DC] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 flex items-center justify-center"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountSelector;
