
import React from 'react';
import { Home, TrendingUp, GraduationCap, MapPin, Users, Building, DollarSign } from 'lucide-react';

interface MotiveOption {
  id: string;
  label: string;
}

interface MotiveSelectorProps {
  motives: MotiveOption[];
  selectedMotive: string | null;
  onSelectMotive: (motiveId: string) => void;
  confirmedPlanMotives: string[];
}

// 为不同购房动机配置图标和颜色
const getMotiveConfig = (motiveId: string) => {
  const configs = {
    '刚需购房': { icon: Home, color: 'text-blue-500', bgColor: 'bg-blue-100' },
    '买套改善房': { icon: TrendingUp, color: 'text-green-500', bgColor: 'bg-green-100' },
    '买个学区房': { icon: GraduationCap, color: 'text-purple-500', bgColor: 'bg-purple-100' },
    '跨城置业': { icon: MapPin, color: 'text-orange-500', bgColor: 'bg-orange-100' },
    '给父母买房': { icon: Users, color: 'text-red-500', bgColor: 'bg-red-100' },
    '买个养老房': { icon: Building, color: 'text-gray-500', bgColor: 'bg-gray-100' },
    '投资买房': { icon: DollarSign, color: 'text-yellow-500', bgColor: 'bg-yellow-100' }
  };
  return configs[motiveId] || { icon: Home, color: 'text-gray-500', bgColor: 'bg-gray-100' };
};

const MotiveSelector: React.FC<MotiveSelectorProps> = ({ 
  motives, 
  selectedMotive, 
  onSelectMotive,
  confirmedPlanMotives 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xs sm:text-sm font-semibold text-gray-700">选择购房动机</h3>
      <div className="grid grid-cols-2 gap-3">
        {motives.map((motive) => {
          const isSelected = selectedMotive === motive.id;
          const isConfirmed = confirmedPlanMotives.includes(motive.id);
          const config = getMotiveConfig(motive.id);
          const IconComponent = config.icon;
          
          return (
            <button
              key={motive.id}
              onClick={() => onSelectMotive(motive.id)}
              className={`p-3 rounded-xl text-left transition-all duration-300 border-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#B3EBEF]/10 to-[#8FD8DC]/10 border-[#B3EBEF] shadow-lg'
                  : isConfirmed
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  isSelected 
                    ? 'bg-[#B3EBEF]/30' 
                    : isConfirmed
                    ? 'bg-green-100'
                    : config.bgColor
                }`}>
                  <IconComponent className={`w-5 h-5 ${
                    isSelected 
                      ? 'text-[#8FD8DC]' 
                      : isConfirmed
                      ? 'text-green-600'
                      : config.color
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium block">{motive.label}</span>
                  {isConfirmed && (
                    <span className="text-xs text-green-600 mt-1 block">已确定计划</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MotiveSelector;
