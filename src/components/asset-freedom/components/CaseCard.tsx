import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNavigationState } from '@/hooks/useNavigationState';
import { CaseItem } from '@/data/practicalCases';

interface CaseCardProps {
  case_: CaseItem;
  onDetailClick?: (case_: CaseItem) => void;
  compact?: boolean;
}

const CaseCard: React.FC<CaseCardProps> = ({ case_, onDetailClick, compact = false }) => {
  const navigate = useNavigate();
  const { navigateWithState, getReturnState } = useNavigationState();

  const handleFunctionClick = (functionLink: { label: string; route: string; params?: any }) => {
    if (functionLink.params) {
      navigate(functionLink.route, { state: functionLink.params });
    } else {
      navigate(functionLink.route);
    }
  };

  const handleDetailClick = () => {
    // 使用navigateWithState来保存当前状态，确保能正确返回案例tab页
    const currentState = getReturnState() || {};
    navigateWithState(`/case/${case_.id}`, {
      ...currentState,
      activeTab: 'cases' // 确保返回时显示案例tab
    });
  };

  if (compact) {
    return (
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={handleDetailClick}>
        <CardContent className="p-4">
          <div className="flex space-x-3">
            {/* 图片区域 - 紧凑版 */}
            <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
              <img 
                src={case_.image} 
                alt={case_.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNiAyNkg0MFYzOEgyNlYyNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                }}
              />
            </div>
            
            {/* 内容区域 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-800 leading-tight truncate">
                  {case_.title}
                </h4>
                <Badge variant="outline" className="ml-2 text-xs px-2 py-1 bg-[#CAF4F7]/20 text-[#0891b2] border-[#CAF4F7]/50 flex-shrink-0">
                  {case_.category}
                </Badge>
              </div>
              
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-2">
                {case_.description}
              </p>
              
              {/* 标签 */}
              <div className="flex flex-wrap gap-1">
                {case_.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-0">
        {/* 图片区域 */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img 
            src={case_.image} 
            alt={case_.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMzAgODBIMTkwVjExMkgxMzBWODBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg==';
            }}
          />
          
          {/* 类别标签 */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 text-gray-700 border-0 shadow-sm">
              {case_.category}
            </Badge>
          </div>
        </div>
        
        {/* 内容区域 */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
              {case_.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {case_.description}
            </p>
          </div>
          
          {/* 标签区域 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {case_.tags.map((tag, index) => (
              <span key={index} className="text-xs px-3 py-1 bg-[#CAF4F7]/20 text-[#0891b2] rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          {/* 功能链接区域 */}
          <div className="space-y-2 mb-4">
            {case_.functionLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleFunctionClick(link)}
                className="w-full justify-between text-left border-[#CAF4F7]/30 hover:bg-[#CAF4F7]/10 hover:border-[#CAF4F7]/50"
              >
                <span className="text-sm">{link.label}</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
            ))}
          </div>
          
          {/* 查看详情按钮 */}
          <Button
            onClick={handleDetailClick}
            className="w-full bg-gradient-to-r from-[#B3EBEF] to-[#9FE6EB] hover:from-[#9FE6EB] hover:to-[#8AE1E6] text-gray-800 font-medium border-0"
          >
            查看详细案例
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseCard;