import React from 'react';
import { TrendingDown } from 'lucide-react';

export const MarriageRecommendationContent: React.FC = () => {
  return (
    <div>
      
      <div className="flex items-start justify-between py-1.5">
        <div className="flex flex-col items-start">
          <span className="text-sm text-gray-600 mb-1">原规划支出</span>
          <span className="text-sm text-gray-400 line-through">
            140万元
          </span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm text-gray-600 mb-1">建议调整为</span>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-gray-800">
              21万元
            </span>
            <div className="flex items-center space-x-1">
              <TrendingDown className="w-3 h-3 text-red-500" />
              <span className="text-sm text-red-500 font-medium">
                85%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};