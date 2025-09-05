
import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileHintProps {
  message: string;
  variant?: 'info' | 'warning';
  className?: string;
}

const MobileHint: React.FC<MobileHintProps> = ({ 
  message, 
  variant = 'info',
  className 
}) => {
  return (
    <div className={cn(
      "flex items-start gap-1.5 p-2 rounded-lg border text-xs bg-white",
      "sm:p-3 sm:gap-2 sm:text-sm", // 桌面端稍大一些
      "border-[#CAF4F7] text-[#01BCD6]",
      className
    )}>
      <Info className="w-3 h-3 mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
      <span className="leading-tight">{message}</span>
    </div>
  );
};

export default MobileHint;
