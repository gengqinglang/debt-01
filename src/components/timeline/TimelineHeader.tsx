
import React, { useState } from 'react';
import { Users, Edit3 } from 'lucide-react';
import FamilyTreeDialog from './FamilyTreeDialog';

interface TimelineHeaderProps {
  currentAge: number;
  partnerAge: number;
  onCurrentAgeChange: (age: number) => void;
  onPartnerAgeChange: (age: number) => void;
  readonly?: boolean;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  currentAge,
  partnerAge,
  onCurrentAgeChange,
  onPartnerAgeChange,
  readonly = false
}) => {
  const [isFamilyTreeOpen, setIsFamilyTreeOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="pt-6 px-5 pb-1">
      {/* 标题和家庭树入口在同一行 - 优化响应式布局 */}
      <div className="flex items-center justify-between mb-2 gap-2">
        {/* 左侧：标题 - 响应式字体大小和可伸缩 */}
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight relative overflow-hidden flex-1 min-w-0" style={{
          color: '#01BCD6'
        }}>
          <span className="relative z-10 block truncate">请确认人生大事时间线</span>
          {/* 流光效果 */}
          <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]"></div>
        </h1>
        
        {/* 右侧：家庭树入口 - 紧凑布局 */}
        <div 
          className="flex items-center space-x-1.5 bg-gray-50/80 hover:bg-gray-100/80 px-2.5 py-1.5 rounded-lg border border-gray-200 cursor-pointer transition-colors group flex-shrink-0"
          onClick={() => setIsFamilyTreeOpen(true)}
        >
          <Users className="w-4 h-4 text-gray-600 group-hover:text-[#01BCD6] transition-colors" />
          <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-[#01BCD6] transition-colors whitespace-nowrap">家庭成员</span>
          <Edit3 className="w-3 h-3 text-gray-500 group-hover:text-[#01BCD6] transition-colors" />
        </div>
      </div>

      {/* Family Tree Dialog */}
      <FamilyTreeDialog 
        open={isFamilyTreeOpen}
        onOpenChange={setIsFamilyTreeOpen}
        currentAge={currentAge}
        partnerAge={partnerAge}
        onCurrentAgeChange={onCurrentAgeChange}
        onPartnerAgeChange={onPartnerAgeChange}
        currentYear={currentYear}
        readonly={readonly}
      />
    </div>
  );
};

export default TimelineHeader;
