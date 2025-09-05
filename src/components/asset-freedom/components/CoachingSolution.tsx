
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Crown } from 'lucide-react';
import { useMembership } from '@/components/membership/MembershipProvider';
import { useNavigationState } from '@/hooks/useNavigationState';

const CoachingSolution = () => {
  const { navigateWithState } = useNavigationState();
  const { isMember } = useMembership();

  const handleAdjustmentClick = () => {
    navigateWithState('/adjustment-solution', {
      activeTab: 'discover',
      sourceModule: 'coaching-solution'
    });
  };

  return (
    <div className="space-y-4 md:space-y-6 relative">
      {/* 统一的卡片包含调整规划模块 */}
      <Card className="bg-[#CAF4F7]/5 border border-[#CAF4F7]/20 shadow-sm">
        <CardContent className="p-4 md:p-6 space-y-6 md:space-y-8">
          
          {/* 调整规划解决危机模块 */}
          <div className="space-y-3 md:space-y-4">
            {/* 步骤标识和标题 - 调整布局，标题和按钮在同一行 */}
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#CAF4F7] flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-sm md:text-base font-bold text-gray-700">1</span>
              </div>
              
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <h3 className="text-sm md:text-base font-bold text-gray-800 leading-tight break-words">
                  调整规划解决危机
                </h3>
                
                {/* 查看按钮 - 移到标题右侧，添加箭头图标 */}
                <Button
                  onClick={handleAdjustmentClick}
                  className="bg-transparent hover:bg-transparent border-0 font-semibold py-1 px-2 rounded-lg transition-all duration-300 flex-shrink-0"
                  style={{ color: '#01BCD6' }}
                >
                  <span className="text-xs md:text-sm flex items-center space-x-1">
                    <span>查看方案</span>
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </span>
                </Button>
              </div>
            </div>

            {/* 描述文案 */}
            <div className="text-xs md:text-sm text-gray-700 leading-relaxed py-1 md:py-2 pl-0">
              <p className="break-words">告诉您哪些钱可以省，哪些钱不能省，让您花钱更聪明，跟着方案走，既能缓解财务压力，又能为未来投资做准备！</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachingSolution;
