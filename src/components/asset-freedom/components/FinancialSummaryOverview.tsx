import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, ChevronRight, Info, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import AnnualSurplusHeatmap from './AnnualSurplusHeatmap';

interface FinancialSummaryOverviewProps {
  simplified?: boolean;
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';
  displayMode?: 'first-time' | 'returning';
  onNavigateToWealthTyping?: () => void;
  financialMetrics?: {
    totalAssets: number;
    totalLiabilities: number;
    futureIncome: number;
    futureExpenditure: number;
    lifeBalance: number;
    yearsMoneyLasts: number;
    yearsToRetirement: string;
    cashFlowGapYears: number;
  };
}

const FinancialSummaryOverview: React.FC<FinancialSummaryOverviewProps> = ({ 
  simplified = false, 
  pageMode = 'public-balanced',
  displayMode = 'first-time',
  onNavigateToWealthTyping,
  financialMetrics 
}) => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<string>('');
  const [isHeatmapExpanded, setIsHeatmapExpanded] = useState(false);

  // 使用传入的财务数据或默认数据
  const financialData = financialMetrics || {
    totalAssets: 500, // 万元
    totalLiabilities: 224, // 万元
    futureIncome: 2193, // 万元
    futureExpenditure: 1882, // 万元
    lifeBalance: 311, // 万元 (盈余)
    yearsMoneyLasts: 5, // 年
    yearsToRetirement: '本人不能提前退休', // 年
    cashFlowGapYears: 3 // 终生现金流缺口年份
  };

  // 指标解释文案
  const tooltipTexts: Record<string, string> = {
    lifeBalance: "基于您当前的资产、负债和未来收支情况精确计算得出。正数表示您一生的财富有盈余，负数表示有缺口。这个数字决定了您未来生活的基本方向，是制定理财规划的重要参考。",
    yearsMoneyLasts: "假如您从现在开始完全不工作、不赚取任何收入，仅凭现有资产能够维持目前生活水平的年数。这个指标帮您了解当前的财务安全边际。",
    yearsToRetirement: "基于当前的收入增长和储蓄率计算，分别评估您和伴侣实现财务自由、提前退休的时间。这是您们各自奋斗的明确目标，帮助制定差异化的理财策略。",
    cashFlowGapYears: "在您的整个人生中，预计会有多少年出现入不敷出的情况。这些年份可能影响您的生活品质或重要支出计划，需要提前准备解决方案。"
  };

  // 指标标题映射
  const getLifeBalanceTitle = () => {
    if (['member-balanced', 'member-liquidity-tight', 'public-balanced', 'public-liquidity-tight'].includes(pageMode)) {
      return '生涯收支盈余';
    } else if (['member-severe-shortage', 'public-severe-shortage'].includes(pageMode)) {
      return '生涯收支缺口';
    }
    return '生涯收支盈余';
  };

  const indicatorTitles: Record<string, string> = {
    lifeBalance: getLifeBalanceTitle(),
    yearsMoneyLasts: '现在的金融资产能撑几年',
    yearsToRetirement: '还有多少年财务自由提前退休',
    cashFlowGapYears: '未来现金流缺口年数'
  };

  const handleIndicatorClick = (indicator: string) => {
    setSelectedIndicator(indicator);
    setDialogOpen(true);
  };

  const handleAssetClick = () => {
    navigate('/new', {
      state: {
        activeTab: 'planning',
        activePlanningTab: 'assets-liabilities',
        sourceModule: 'discover-financial-cards'
      }
    });
  };

  const handleLiabilityClick = () => {
    navigate('/new', {
      state: {
        activeTab: 'planning',
        activePlanningTab: 'assets-liabilities',
        sourceModule: 'discover-financial-cards'
      }
    });
  };

  const handleIncomeClick = () => {
    navigate('/new', {
      state: {
        activeTab: 'planning',
        activePlanningTab: 'career-income',
        sourceModule: 'discover-financial-cards'
      }
    });
  };

  const handleExpenditureClick = () => {
    navigate('/new', {
      state: {
        activeTab: 'planning',
        activePlanningTab: 'life-events',
        sourceModule: 'discover-financial-cards'
      }
    });
  };

  return (
    <>
      <div className="space-y-3">
        {/* 财富分型卡片 - 仅在"情况2：再次"模式下显示 */}
        {displayMode === 'returning' && (
          <Card className="bg-gradient-to-r from-[#B3EBEF]/10 to-[#CAF4F7]/10 border-[#B3EBEF]/30 cursor-pointer hover:from-[#B3EBEF]/15 hover:to-[#CAF4F7]/15 transition-all duration-200">
            <CardContent className="p-3">
              <div className="relative flex items-center justify-center">
                {/* 失效标记 - 绝对定位到左侧 */}
                <Badge className="absolute left-0 bg-red-500/90 text-white border-none text-xs px-2 py-1">
                  失效
                </Badge>
                
                {/* 财富分型内容 - 在整个容器中居中 */}
                <div className="text-center">
                  <div className="text-base font-semibold text-gray-800 mb-1">
                    {(pageMode?.endsWith('-liquidity-tight') || pageMode?.endsWith('-balanced')) ? '资产充裕型' : '中度支出压缩型'}
                  </div>
                  <Badge className="bg-[#B3EBEF]/20 text-gray-700 border-[#B3EBEF]/40 text-xs px-2 py-0.5">
                    {(pageMode?.endsWith('-liquidity-tight') || pageMode?.endsWith('-balanced')) ? 'A3-E03-R6' : 'C01-I02-E03-R2'}
                  </Badge>
                </div>
                
                {/* 查看详情按钮 - 绝对定位到右侧 */}
                <div 
                  className="absolute right-0 cursor-pointer hover:opacity-70"
                  onClick={() => onNavigateToWealthTyping?.()}
                >
                  <ChevronRight className="w-4 h-4 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 第一行 - 当前总资产和当前总负债 */}
        <div className="grid grid-cols-2 gap-2">
            <Card 
              className="bg-[#CAF4F7]/20 border border-[#CAF4F7]/40 cursor-pointer hover:bg-[#CAF4F7]/30 transition-colors"
              onClick={handleAssetClick}
            >
              <CardContent className="p-2 text-center relative">
                <div className="text-sm font-bold text-gray-800 mb-1">
                  {financialData.totalAssets}万
                </div>
              <div className="text-xs text-gray-600 leading-tight">
                当前总资产
              </div>
              <ChevronRight className="w-4 h-4 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400" />
            </CardContent>
          </Card>

            <Card 
              className="bg-[#CAF4F7]/20 border border-[#CAF4F7]/40 cursor-pointer hover:bg-[#CAF4F7]/30 transition-colors"
              onClick={handleLiabilityClick}
            >
              <CardContent className="p-2 text-center relative">
                <div className="text-sm font-bold text-gray-800 mb-1">
                  {financialData.totalLiabilities}万
                </div>
              <div className="text-xs text-gray-600 leading-tight">
                当前总负债
              </div>
              <ChevronRight className="w-4 h-4 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400" />
            </CardContent>
          </Card>
        </div>

        {/* 第二行 - 预计未来收入和预计未来支出 */}
        <div className="grid grid-cols-2 gap-2">
            <Card 
              className="bg-[#CAF4F7]/15 border border-[#CAF4F7]/30 cursor-pointer hover:bg-[#CAF4F7]/25 transition-colors"
              onClick={handleIncomeClick}
            >
              <CardContent className="p-2 text-center relative">
                <div className="text-sm font-bold text-gray-800 mb-1">
                  {financialData.futureIncome}万
                </div>
              <div className="text-xs text-gray-600 leading-tight">
                预计未来收入
              </div>
              <ChevronRight className="w-4 h-4 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400" />
            </CardContent>
          </Card>

            <Card 
              className="bg-[#CAF4F7]/15 border border-[#CAF4F7]/30 cursor-pointer hover:bg-[#CAF4F7]/25 transition-colors"
              onClick={handleExpenditureClick}
            >
              <CardContent className="p-2 text-center relative">
                <div className="text-sm font-bold text-gray-800 mb-1">
                  {financialData.futureExpenditure}万
                </div>
              <div className="text-xs text-gray-600 leading-tight">
                预计未来支出
              </div>
              <ChevronRight className="w-4 h-4 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400" />
            </CardContent>
          </Card>
        </div>

        {/* 第三行 - 根据简化模式决定布局 */}
        {simplified ? (
          /* 简化模式：只显示未来资产盈余/缺口 */
          <div className="grid grid-cols-1 gap-2">
            <Card 
              className="bg-[#CAF4F7]/10 border border-[#CAF4F7]/20 cursor-pointer hover:bg-[#CAF4F7]/20 transition-colors"
            >
              <CardContent className="p-2">
                <div 
                  className="flex items-center justify-between"
                  onClick={() => setIsHeatmapExpanded(!isHeatmapExpanded)}
                >
                  <div className="text-center flex-1">
                    <div className="text-sm font-bold text-gray-800 mb-1">
                      {financialData.lifeBalance >= 0 ? `盈余${financialData.lifeBalance}万` : `缺口${Math.abs(financialData.lifeBalance)}万`}
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-xs text-gray-600 leading-tight">
                      <span>{getLifeBalanceTitle()}</span>
                      <HelpCircle
                        className="w-4 h-4 text-gray-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIndicatorClick('lifeBalance');
                        }}
                      />
                    </div>
                  </div>
                  {isHeatmapExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
                  )}
                </div>
                
                {/* 展开的热力图 */}
                {isHeatmapExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <AnnualSurplusHeatmap />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* 完整模式：只显示生涯收支盈余/缺口 */
          <div className="grid grid-cols-1 gap-2">
            <Card 
              className="bg-[#CAF4F7]/10 border border-[#CAF4F7]/20 cursor-pointer hover:bg-[#CAF4F7]/20 transition-colors"
            >
              <CardContent className="p-2">
                <div 
                  className="flex items-center justify-between"
                  onClick={() => setIsHeatmapExpanded(!isHeatmapExpanded)}
                >
                  <div className="text-center flex-1">
                    <div className="text-sm font-bold text-gray-800 mb-1">
                      {financialData.lifeBalance >= 0 ? `盈余${financialData.lifeBalance}万` : `缺口${Math.abs(financialData.lifeBalance)}万`}
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-xs text-gray-600 leading-tight">
                      <span>{getLifeBalanceTitle()}</span>
                      <HelpCircle
                        className="w-4 h-4 text-gray-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIndicatorClick('lifeBalance');
                        }}
                      />
                    </div>
                  </div>
                  {isHeatmapExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
                  )}
                </div>
                
                {/* 展开的热力图 */}
                {isHeatmapExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <AnnualSurplusHeatmap />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* 更新提醒卡片 - 只在"情况2：再次"模式下显示 */}
        {displayMode === 'returning' && (
          <Card className="bg-orange-50 border border-orange-200">
            <CardContent className="p-3">
              <p className="text-sm text-orange-700 leading-relaxed mb-3">
                <span className="font-bold">更新提醒</span>：您已31天未更新规划信息，为保障财富分型准确性，建议及时更新收入、支出、资产负债情况。
              </p>
              <Button
                onClick={() => {
                  // 这里应该触发更新操作，比如导航到相关页面
                  console.log('立即更新财富分型信息');
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2"
              >
                立即更新
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 精准度提示卡片 - 在情况2时隐藏 */}
        {!simplified && displayMode !== 'returning' && (
          <Card className="bg-[#CAF4F7]/10 border border-[#CAF4F7]/20">
            <CardContent className="p-3">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-700 leading-relaxed">
                  <span className="font-medium">提升预测精准度：</span>
                  点击前四个指标（资产、负债、收入、支出）录入详细信息，获取更精准的财富分型测评。
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 解释弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedIndicator === 'lifeBalance' && getLifeBalanceTitle()}
              {selectedIndicator === 'yearsMoneyLasts' && '现在的金融资产能撑几年'}
              {selectedIndicator === 'yearsToRetirement' && '还有多少年财务自由提前退休'}
              {selectedIndicator === 'cashFlowGapYears' && '未来现金流缺口年数'}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm leading-relaxed text-gray-700">
            {selectedIndicator === 'lifeBalance' && "基于您当前的资产、负债和未来收支情况精确计算得出。正数表示您一生的财富有盈余，负数表示有缺口。这个数字决定了您未来生活的基本方向，是制定理财规划的重要参考。"}
            {selectedIndicator === 'yearsMoneyLasts' && "假如您从现在开始完全不工作、不赚取任何收入，仅凭现有资产能够维持目前生活水平的年数。这个指标帮您了解当前的财务安全边际。"}
            {selectedIndicator === 'yearsToRetirement' && "基于当前的收入增长和储蓄率计算，分别评估您和伴侣实现财务自由、提前退休的时间。这是您们各自奋斗的明确目标，帮助制定差异化的理财策略。"}
            {selectedIndicator === 'cashFlowGapYears' && "在您的整个人生中，预计会有多少年出现入不敷出的情况。这些年份可能影响您的生活品质或重要支出计划，需要提前准备解决方案。"}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FinancialSummaryOverview;
