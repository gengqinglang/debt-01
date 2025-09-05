
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface UnlockIndicatorProps {
  isUnlocked: boolean;
  backgroundColor?: string;
}

const UnlockIndicator: React.FC<UnlockIndicatorProps> = ({ 
  isUnlocked, 
  backgroundColor = '#10B981' 
}) => {
  if (!isUnlocked) return null;

  return (
    <div className="absolute top-4 right-4 z-20">
      <div 
        className="flex items-center space-x-1 text-gray-700 px-2 py-1 rounded-full text-xs font-medium shadow-lg"
        style={{ backgroundColor }}
      >
        <CheckCircle className="w-3 h-3" />
        <span>已解锁</span>
      </div>
    </div>
  );
};

export default UnlockIndicator;
