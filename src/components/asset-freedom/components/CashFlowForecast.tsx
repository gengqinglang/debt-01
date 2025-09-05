
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HelpCircle, AlertTriangle, CircleCheck, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import YearlyFinancialDetails from './YearlyFinancialDetails';

interface YearlyForecast {
  year: string;
  age: number;
  status: 'surplus' | 'use-financial' | 'use-physical' | 'insufficient';
  statusLabel?: string;
  statusLabels?: string[];
  description: string;
  breakdown: Array<{
    title: string;
    amount: string;
    hasTooltip?: boolean;
    tooltipContent?: string;
  }>;
  extraLabels?: string[];
  titleRightLabels?: string[];
}

interface CashFlowForecastProps {
  forecastData?: YearlyForecast[];
  isMember?: boolean;
  pageMode?: string;
  onInteractionAttempt?: () => void;
}

const CashFlowForecast: React.FC<CashFlowForecastProps> = ({ 
  forecastData: propsForecastData, 
  isMember = false, 
  pageMode = '', 
  onInteractionAttempt 
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  
  const defaultForecastData: YearlyForecast[] = [
    {
      year: '今年（30岁）',
      age: 30,
      status: 'surplus',
      statusLabel: '有结余',
      description: '当年收入大于支出，结余的钱也要合理安排好',
      breakdown: [
        { title: '当年现金流盈余', amount: '+5万元' },
        { title: '当年结余', amount: '20万元' },
        { title: '要攒下以后花的', amount: '12万元' },
        { title: '当前可随便花的', amount: '8万元' }
      ],
      extraLabels: ['现金流健康']
    },
    {
      year: '明年（31岁）',
      age: 31,
      status: 'use-physical',
      statusLabel: '要动老本',
      description: '当年收入无法覆盖支出，需要动用家庭资产',
      breakdown: [
        { title: '当年现金流缺口', amount: '150万元' },
        { title: '当年可抵御缺口的房产', amount: '150万元' }
      ],
      extraLabels: ['收不抵支', '现金流不健康']
    },
    {
      year: '后年（32岁）',
      age: 32,
      status: 'insufficient',
      statusLabel: '钱不够花',
      description: '当年入不敷出，即便动用所有资产仍有缺口',
      breakdown: [
        { title: '当年收支缺口', amount: '50万元' },
        { title: '家庭当前资产', amount: '40万元' },
        { title: '仍有缺口', amount: '10万元' }
      ]
    }
  ];

  const forecastData = propsForecastData || defaultForecastData;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'surplus':
        return 'bg-[#CAEC8D]/20 text-gray-700 border-[#CAEC8D]/20';
      case 'use-physical':
        return 'bg-[#80DBE0]/20 text-gray-700 border-[#80DBE0]/20';
      case 'insufficient':
        return 'bg-[#ABABAB]/20 text-gray-700 border-[#ABABAB]/20';
      default:
        return 'bg-gray-200/20 text-gray-700 border-gray-200/20';
    }
  };

  const getLabelSpecificBadgeStyle = (label: string) => {
    switch (label) {
      case '无现金流缺口':
        return 'bg-[#CAEC8D]/20 text-gray-700 border-[#CAEC8D]/20'; // 绿色
      case '有现金流缺口':
        return 'bg-[#FF7F7F]/20 text-gray-700 border-[#FF7F7F]/20'; // 与"资产不足无法补足"一致的珊瑚色系
      case '资产不足无法补足':
        return 'bg-[#FF7F7F]/20 text-gray-700 border-[#FF7F7F]/20'; // 珊瑚色系
      default:
        return null; // 返回null表示使用默认的status样式
    }
  };

  const handleTooltipClick = (content: string) => {
    setTooltipContent(content);
    setTooltipOpen(true);
  };

  const toggleYearExpansion = (year: string) => {
    console.log('=== CashFlowForecast toggleYearExpansion 被调用 ===');
    console.log('year:', year);
    console.log('isMember:', isMember);
    console.log('onInteractionAttempt:', onInteractionAttempt);
    console.log('expandedYears:', expandedYears);
    
    if (!isMember) {
      console.log('非会员用户，调用 onInteractionAttempt');
      onInteractionAttempt?.();
      return;
    }
    
    console.log('会员用户，切换展开状态');
    const newExpandedYears = new Set(expandedYears);
    if (newExpandedYears.has(year)) {
      newExpandedYears.delete(year);
      console.log('收起年份:', year);
    } else {
      newExpandedYears.add(year);
      console.log('展开年份:', year);
    }
    setExpandedYears(newExpandedYears);
    console.log('更新后的 expandedYears:', newExpandedYears);
  };

  // 获取与FinancialHealthOverview相同的年度财务数据
  const getYearlyDataFromOverview = (year: number) => {
    // 从预计算数据或FinancialHealthOverview中获取对应年份的真实数据
    // 这样确保两个入口使用完全相同的数据源
    
    // 统一的数据源 - 会员-没钱状态的真实数据
    // 会员-缺钱状态数据
    const severeShortageMasterData: Record<number, any> = {
      30: {
        year: 30,
        healthy: true,
        cashFlow: 15000,
        beginningBalance: 50000,
        propertyValue: 1000000,
        diagnosis: "现金流健康，收入大于支出，有结余积累",
        healthType: 'income_covers_expenses',
        income: { total: 407000, salary: 400000, rent: 5000, housingFund: 2000 },
        expenses: { total: 170000, basic: 45000, education: 20000, medical: 8000, pension: 12000, housing: 50000, transportation: 15000, majorPurchases: 10000, familySupport: 10000 }
      },
      31: {
        year: 31,
        healthy: true,
        cashFlow: -50000,
        beginningBalance: 65000,
        propertyValue: 1030000,
        diagnosis: "当年收入不足以覆盖支出，需要动用金融资产补足缺口",
        healthType: 'need_use_savings',
        income: { total: 430000, salary: 250000, rent: 50000, housingFund: 20000, financialAssetPrincipal: 100000, financialAssetInterest: 10000 },
        expenses: { total: 430000, basic: 45000, education: 180000, medical: 8000, pension: 12000, housing: 50000, transportation: 15000, majorPurchases: 100000, familySupport: 20000 }
      },
      32: {
        year: 32,
        healthy: false,
        cashFlow: -600000,
        beginningBalance: 750000,
        propertyValue: 1060000,
        diagnosis: "财务危机，收支严重失衡",
        pressureType: 'need_sell_property',
        income: { total: 409000, salary: 400000, rent: 6000, housingFund: 3000 },
        expenses: { total: 727200, basic: 240000, education: 100000, medical: 1000, pension: 1200, housing: 5000, transportation: 300000, majorPurchases: 50000, familySupport: 30000 }
      },
      33: {
        year: 33,
        healthy: false,
        cashFlow: -300000,
        beginningBalance: 150000,
        propertyValue: 1080000,
        diagnosis: "财务危机，收支严重失衡",
        pressureType: 'need_sell_property',
        income: { total: 420000, salary: 410000, rent: 7000, housingFund: 3000 },
        expenses: { total: 140500, basic: 60000, education: 20000, medical: 1000, pension: 1500, housing: 5000, transportation: 2000, majorPurchases: 50000, familySupport: 1000 },
        titleRightLabels: ['当年有卖房计划']
      }
    };
    
    // 会员-平状态数据 - 完全独立的数据集
    const memberBalancedMasterData: Record<number, any> = {
      30: {
        year: 30,
        healthy: true,
        cashFlow: 15000,
        beginningBalance: 50000,
        propertyValue: 1000000,
        diagnosis: "现金流健康，收入大于支出，有结余积累",
        healthType: 'income_covers_expenses',
        income: { total: 407000, salary: 400000, rent: 5000, housingFund: 2000 },
        expenses: { total: 170000, basic: 45000, education: 20000, medical: 8000, pension: 12000, housing: 50000, transportation: 15000, majorPurchases: 10000, familySupport: 10000 }
      },
      31: {
        year: 31,
        healthy: true,
        cashFlow: 0,
        beginningBalance: 65000,
        propertyValue: 1030000,
        diagnosis: "当年收支平衡",
        healthType: 'need_use_savings',
        income: { total: 430000, salary: 250000, rent: 50000, housingFund: 20000, financialAssetPrincipal: 100000, financialAssetInterest: 10000 },
        expenses: { total: 430000, basic: 45000, education: 180000, medical: 8000, pension: 12000, housing: 50000, transportation: 15000, majorPurchases: 100000, familySupport: 20000 }
      },
      32: {
        year: 32,
        healthy: true,
        cashFlow: -20000,
        beginningBalance: 75000,
        propertyValue: 1060000,
        diagnosis: "轻微现金流缺口，可通过金融资产补足",
        healthType: 'need_use_savings',
        income: { total: 340000, salary: 260000, rent: 55000, housingFund: 25000 },
        expenses: { total: 370000, basic: 50000, education: 100000, medical: 10000, pension: 15000, housing: 55000, transportation: 20000, majorPurchases: 90000, familySupport: 30000 }
      }
    };
    
    // 会员-缺钱状态直接使用独立数据
    if (pageMode === 'member-severe-shortage') {
      return severeShortageMasterData[year];
    }
    
    // 会员-平状态使用独立数据集
    if (pageMode === 'member-balanced') {
      return memberBalancedMasterData[year];
    }
    
    // 其他pageMode可以根据需要添加相应的数据映射
    return null;
  };

  // 使用统一的年度财务详情组件
  const renderYearDetails = (item: YearlyForecast) => {
    // 优先使用与FinancialHealthOverview相同的真实数据
    const realYearData = getYearlyDataFromOverview(item.age);
    
    if (realYearData) {
      return (
        <div className="mt-3">
          <YearlyFinancialDetails yearData={realYearData} pageMode={pageMode as any} isFromCardExpansion={true} />
        </div>
      );
    }
    
    // 如果没有找到真实数据，使用原有的模拟数据结构（向后兼容）
    const yearData = {
      year: item.age,
      healthy: item.status === 'surplus' || (pageMode === 'member-severe-shortage' && item.age === 31),
      diagnosis: pageMode === 'member-severe-shortage' && item.age === 31 ? "虽然当年收入不足以覆盖支出，但动用金融资产即可补足缺口，财务健康" : item.description,
      pressureType: (item.status === 'use-physical' ? 'need_sell_property' : item.status === 'insufficient' ? 'insufficient_even_after_selling' : null) as 'need_sell_property' | 'insufficient_even_after_selling' | null,
      healthType: (item.status === 'surplus' ? 'income_covers_expenses' : null) as 'income_covers_expenses' | 'need_use_savings' | null,
      income: {
        total: item.status === 'surplus' ? 500000 : 200000,
        salary: item.status === 'surplus' ? 400000 : 180000,
        rent: 0,
        housingFund: item.status === 'surplus' ? 100000 : 20000
      },
      expenses: {
        total: item.status === 'surplus' ? 450000 : item.status === 'use-physical' ? 350000 : 500000,
        basic: 120000,
        education: item.age === 32 ? 200000 : item.age === 33 ? 250000 : 50000,
        medical: 30000,
        pension: 50000,
        housing: 100000,
        transportation: 30000,
        majorPurchases: 20000,
        support: 50000
      },
      beginningBalance: item.status === 'use-physical' ? 1500000 : item.status === 'insufficient' ? 400000 : 800000
    };

    return (
      <div className="mt-3">
        <YearlyFinancialDetails yearData={yearData} pageMode={pageMode as any} isFromCardExpansion={true} />
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        {forecastData
          .filter((item) => {
            // 会员-没钱状态下：隐藏31岁、32岁、33岁卡片
            if (pageMode === 'member-severe-shortage') {
              return ![31, 32, 33].includes(item.age);
            }
            // 会员-平状态下：隐藏31岁、32岁卡片
            if (pageMode === 'member-balanced') {
              return ![31, 32].includes(item.age);
            }
            // 其他状态下显示所有卡片
            return true;
          })
          .map((item, index) => (
          <Card key={index} className="bg-white border-t border-gray-100 shadow-md rounded-lg relative">
            <CardContent className="p-4">
              {/* 印章样式的现金流健康标签 */}
              {item.extraLabels && item.extraLabels.includes('现金流健康') && (
                <div className="absolute -top-1 -right-1 z-10">
                  <div className="relative transform rotate-12">
                    <div className="w-16 h-16 rounded-full border-2 border-[#01BCD6] bg-white/90 flex items-center justify-center shadow-lg">
                      <span className="text-[#01BCD6] font-bold text-xs text-center leading-tight">
                        现金流<br/>健康
                      </span>
                    </div>
                    {/* 印章内圈效果 */}
                    <div className="absolute inset-2 rounded-full border border-[#01BCD6] opacity-50"></div>
                  </div>
                </div>
              )}

              {/* 印章样式的现金流不健康标签 */}
              {item.extraLabels && item.extraLabels.includes('现金流不健康') && (
                <div className="absolute -top-1 -right-1 z-10">
                  <div className="relative transform rotate-12">
                    <div className="w-16 h-16 rounded-full border-2 border-red-600 bg-white/90 flex items-center justify-center shadow-lg">
                      <span className="text-red-600 font-bold text-xs text-center leading-tight">
                        现金流<br/>不健康
                      </span>
                    </div>
                    {/* 印章内圈效果 */}
                    <div className="absolute inset-2 rounded-full border border-red-600 opacity-50"></div>
                  </div>
                </div>
              )}
              
              {/* 顶部：年龄和状态标签 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-medium text-gray-800">
                    {item.year}
                  </h3>
                  {/* 32岁和33岁显示预警图标，但member-balanced状态下的32岁不显示 */}
                  {(item.age === 32 || item.age === 33) && 
                   !(pageMode === 'member-balanced' && item.age === 32) && (
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  )}
                   {/* 删除收不抵支等老逻辑标签 */}
                </div>
                <div className="flex items-center space-x-2">
                  {/* 其他标签保持在右侧，但排除收不抵支、现金流健康和现金流不健康 */}
                  {item.extraLabels && item.extraLabels.map((label, idx) => (
                    label !== '现金流健康' && label !== '收不抵支' && label !== '现金流不健康' && (
                      <span 
                        key={idx} 
                        className="px-2 py-1 text-xs rounded-full text-gray-800"
                        style={{backgroundColor: '#CAF4F7'}}
                      >
                        {label}
                      </span>
                    )
                  ))}
                </div>
              </div>

              {/* 标题下方的标签 */}
              {item.titleRightLabels && (
                <div className="flex items-center space-x-2 mb-3">
                  {item.titleRightLabels.map((label, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 text-xs rounded-md text-gray-600 bg-gray-100/80 border border-gray-200/60"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}

              {/* statusLabel 或 statusLabels 显示在右上角 */}
              {item.statusLabels ? (
                <div className="absolute top-4 right-4 z-20 flex flex-row gap-2">
                  {item.statusLabels.map((label, labelIndex) => {
                    const specificStyle = getLabelSpecificBadgeStyle(label);
                    const badgeStyle = specificStyle || getStatusBadgeStyle(item.status);
                    return (
                      <Badge 
                        key={labelIndex}
                        className={`${badgeStyle} text-sm font-medium`}
                      >
                        {label}
                      </Badge>
                    );
                  })}
                </div>
              ) : item.statusLabel && (
                <div className="absolute top-4 right-4 z-20">
                  <Badge 
                    className={`${getStatusBadgeStyle(item.status)} text-sm font-medium`}
                  >
                    {item.statusLabel}
                  </Badge>
                </div>
              )}

              {/* 描述文案 - 根据数据决定是否显示 */}
              {item.description && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )}
              
              {/* 资金分解小卡片 */}
              <div className={`grid ${(() => {
                const filteredBreakdown = item.status === 'surplus' 
                  ? item.breakdown.filter(b => b.title === '当年现金流盈余' || b.title === '当年结余')
                  : item.breakdown;
                return filteredBreakdown.length === 5 ? 'grid-cols-2' : filteredBreakdown.length === 3 ? 'grid-cols-3' : filteredBreakdown.length === 1 ? 'grid-cols-1' : 'grid-cols-2';
              })()} gap-3 mb-3`}>
                {(item.status === 'surplus' 
                  ? item.breakdown.filter(b => b.title === '当年现金流盈余' || b.title === '当年结余')
                  : item.breakdown
                ).map((breakdownItem, breakdownIndex) => {
                  let displayTitle = breakdownItem.title;
                  let displayAmount = breakdownItem.amount;
                  
                  // 对于会员状态下的现金流盈余/缺口项，基于实际计算结果动态显示文案和金额
                  if ((pageMode === 'member-balanced' || pageMode === 'member-severe-shortage') && 
                      (breakdownItem.title === '当年现金流盈余' || breakdownItem.title === '当年现金流缺口')) {
                    const realYearData = getYearlyDataFromOverview(item.age);
                    if (realYearData) {
                      // 计算实际现金流净额 - 使用与YearlyFinancialDetails完全相同的逻辑
                      const actualIncome = (() => {
                        let totalIncome = realYearData.income.salary + realYearData.income.rent + realYearData.income.housingFund;
                        
                        // 根据不同pageMode和年份添加特殊收入项目
                        if (pageMode === 'member-balanced' || pageMode === 'member-severe-shortage') {
                          if (realYearData.year === 30) {
                            totalIncome += 1000000; // 卖房收入
                            totalIncome += 500000;  // 房贷放款
                            totalIncome += 100000;  // 金融资产赎回
                          }
                          
                          if (realYearData.healthType === 'need_use_savings' || pageMode === 'member-severe-shortage') {
                            if (realYearData.year === 31) {
                              totalIncome += 110000;   // 金融资产赎回
                            } else if (realYearData.year === 32) {
                              totalIncome += 24000;   // 金融资产赎回-本金
                              totalIncome += 6000;    // 金融资产赎回-利息
                            }
                          }
                          
                          if (pageMode === 'member-severe-shortage' && realYearData.year === 33) {
                            totalIncome += 2500000;  // 卖房收入
                          }
                        }
                        
                        // 其他收入项目 (除了30岁的特殊情况)
                        if (realYearData.income.other && !((pageMode === 'member-balanced' || pageMode === 'member-severe-shortage') && realYearData.year === 30)) {
                          totalIncome += realYearData.income.other;
                        }
                        
                        return totalIncome;
                      })();
                       
                      const actualExpenses = (() => {
                        let totalExpenses = realYearData.expenses.basic + realYearData.expenses.education + realYearData.expenses.medical + 
                                           realYearData.expenses.pension + realYearData.expenses.housing + realYearData.expenses.transportation + 
                                           realYearData.expenses.majorPurchases;
                        
                        // 赡养费用
                        if (realYearData.expenses.support || realYearData.expenses.familySupport) {
                          const supportAmount = realYearData.expenses.support || realYearData.expenses.familySupport || 0;
                          totalExpenses += supportAmount;
                        }
                        
                        // 其他费用 (提前还贷等)
                        if (realYearData.expenses.other && !(pageMode === 'member-severe-shortage' && realYearData.year === 41)) {
                          totalExpenses += realYearData.expenses.other;
                        }
                        
                         // 30岁买房支出
                         if ((pageMode === 'member-balanced' || pageMode === 'member-severe-shortage') && realYearData.year === 30) {
                           totalExpenses += 1700000;
                         }
                         
                         // 33岁特殊支出
                         if (pageMode === 'member-severe-shortage' && realYearData.year === 33) {
                           totalExpenses += 600000;  // 提前还贷
                           totalExpenses += 3000000; // 买房
                         }
                        
                        return totalExpenses;
                      })();
                      
                       const netCashFlow = actualIncome - actualExpenses;
                       let isDeficit = false;
                       
                       if (netCashFlow >= 0) {
                         displayTitle = '当年现金流盈余';
                         displayAmount = `+¥${netCashFlow.toLocaleString()}`;
                         isDeficit = false;
                       } else {
                         displayTitle = '当年现金流缺口';
                         displayAmount = `-¥${Math.abs(netCashFlow).toLocaleString()}`;
                         isDeficit = true;
                       }
                     }
                   }
                   
                   // 检查当前项是否为现金流缺口
                   const isCurrentDeficit = displayTitle === '当年现金流缺口';
                   
                    return (
                      <div key={breakdownIndex} className={`bg-[#F8FEFE] rounded-lg p-3 text-center ${item.breakdown.length === 5 && breakdownIndex === 4 ? 'col-span-2' : ''}`}>
                        <div className="text-xs text-gray-600 mb-1 flex items-center justify-center">
                          <span>{displayTitle}</span>
                          {breakdownItem.hasTooltip && breakdownItem.tooltipContent && (
                            <HelpCircle 
                              className="w-3 h-3 ml-1 text-gray-400 cursor-pointer hover:text-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick(breakdownItem.tooltipContent!);
                              }}
                            />
                          )}
                        </div>
                        <div className="flex items-center justify-center">
                          <div className={`text-base font-bold ${isCurrentDeficit ? 'text-red-500' : 'text-[#01BCD6]'}`}>
                            {displayAmount}
                          </div>
                        </div>
                       </div>
                     );
                 })}
               </div>
               
               {/* 只为30岁且当年现金流盈余的卡片在外面显示查看详情按钮（仅在收起状态下显示） */}
               {item.age === 30 && !expandedYears.has(item.year) && item.breakdown.some(b => b.title === '当年现金流盈余' || (pageMode === 'member-balanced' || pageMode === 'member-severe-shortage')) && (
                 <div className="mt-3">
                   {/* 细灰色分割线 */}
                   <div className="w-full h-px bg-gray-200 mb-3"></div>
                   {/* 查看详情文字和箭头 */}
                   <button
                     className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                     onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       toggleYearExpansion(item.year);
                     }}
                   >
                     <span>查看详情</span>
                     <ChevronDown size={16} className="text-gray-600" />
                   </button>
                 </div>
               )}
               
               {/* 展开的详情内容 */}
               {expandedYears.has(item.year) && (
                 <div className="mt-3 pt-3 border-t border-gray-100">
                   {renderYearDetails(item)}
                   {/* 收起详情按钮放在展开内容的底部 */}
                   {item.age === 30 && (
                     <div className="mt-4 pt-3">
                       <div className="w-full h-px bg-gray-200 mb-3"></div>
                       <button
                         className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                         onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           toggleYearExpansion(item.year);
                         }}
                       >
                         <span>收起详情</span>
                         <ChevronUp size={16} className="text-gray-600" />
                       </button>
                     </div>
                   )}
                 </div>
               )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 提示弹窗 */}
      <Dialog open={tooltipOpen} onOpenChange={setTooltipOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-medium">房产可变现金额</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              {tooltipContent}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CashFlowForecast;
