import React, { useState } from 'react';
import { ChevronRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CaseCard from './CaseCard';
import CaseDetailModal from './CaseDetailModal';
import { getRecommendedCases, CaseItem } from '@/data/practicalCases';

interface CaseSectionProps {
  title?: string;
  userContext?: {
    age?: number;
    wealthType?: string;
    hasFinancialGap?: boolean;
  };
  onViewMore?: () => void;
  compact?: boolean;
  showTitle?: boolean;
}

const CaseSection: React.FC<CaseSectionProps> = ({ 
  title = "实用案例", 
  userContext,
  onViewMore,
  compact = false,
  showTitle = true
}) => {
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  
  // 获取推荐案例
  const recommendedCases = getRecommendedCases({
    ...userContext,
    limit: compact ? 3 : 4
  });

  const handleDetailClick = (case_: CaseItem) => {
    setSelectedCase(case_);
  };

  const handleCloseModal = () => {
    setSelectedCase(null);
  };

  const handleViewMore = () => {
    if (onViewMore) {
      onViewMore();
    }
  };

  if (compact) {
    return (
      <div className="space-y-3">
        {showTitle && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-[#01BCD6]" />
              <h3 className="text-base font-semibold text-gray-800">{title}</h3>
              <Badge variant="outline" className="text-xs px-2 py-1 bg-[#CAF4F7]/20 text-[#0891b2] border-[#CAF4F7]/50">
                让理财更简单
              </Badge>
            </div>
            {onViewMore && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewMore}
                className="text-[#01BCD6] hover:text-[#01BCD6]/80 text-sm p-0 h-auto"
              >
                查看更多
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        )}
        
        <div className="space-y-3">
          {recommendedCases.map((case_) => (
            <CaseCard
              key={case_.id}
              case_={case_}
              onDetailClick={handleDetailClick}
              compact={true}
            />
          ))}
        </div>

        {/* 案例详情弹窗 */}
        {selectedCase && (
          <CaseDetailModal
            case_={selectedCase}
            open={!!selectedCase}
            onClose={handleCloseModal}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#B3EBEF] to-[#9FE6EB] rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              <p className="text-sm text-gray-600">让复杂的理财变得简单易懂</p>
            </div>
          </div>
          {onViewMore && (
            <Button
              variant="outline"
              onClick={handleViewMore}
              className="border-[#CAF4F7]/30 hover:bg-[#CAF4F7]/10 hover:border-[#CAF4F7]/50"
            >
              查看全部案例
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      )}
      
      {/* 单列上下布局 */}
      <div className="space-y-4">
        {recommendedCases.map((case_) => (
          <CaseCard
            key={case_.id}
            case_={case_}
            onDetailClick={handleDetailClick}
            compact={false}
          />
        ))}
      </div>

      {/* 案例详情弹窗 */}
      {selectedCase && (
        <CaseDetailModal
          case_={selectedCase}
          open={!!selectedCase}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CaseSection;