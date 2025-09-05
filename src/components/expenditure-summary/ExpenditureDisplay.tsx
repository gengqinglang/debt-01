import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Home, Apple, Stethoscope, Plane, GraduationCap, Heart, Baby, Car, HandHeart, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const ExpenditureDisplay = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);

  // 配置详情描述映射 - 移到组件外部避免重复创建
  const configDescriptions = useMemo(() => ({
    // 基础生活规划
    '经济实用版': '满足基本生活需求，注重性价比',
    '小康滋润版': '舒适生活品质，适度享受',
    '品质生活版': '高品质生活体验，注重细节',
    
    // 医疗保健规划
    '基础保障': '基本医疗保险，应急保障',
    '全面守护': '全面医疗保障，预防为主',
    '至尊呵护': '顶级医疗服务，全方位健康管理',
    
    // 旅游规划
    '经济出行版': '国内游为主，经济实惠',
    '人间清醒版': '国内外平衡，性价比出游',
    '诗和远方版': '高端旅游体验，享受生活',
    
    // 子女教育规划
    '公立教育型': '公立学校教育，基础素质培养',
    '学科投资型': '重点学科补习，提升学习成绩',
    '全面发展型': '综合素质培养，多元化教育',
    
    // 养老规划
    '基础养老版': '基本生活保障，简朴养老',
    '舒适体验版': '舒适养老生活，适度享受',
    '尊享生活版': '高端养老服务，品质生活',

    // 可选大事档位描述
    // 结婚档位
    '轻简甜蜜版': '精致登记照+亲友小宴+蜜月周边游',
    '温馨记忆版': '主题婚纱拍摄+三星宴请+轻奢对戒',
    '悦己臻选版': '旅拍婚纱照+设计师礼服+珠宝纪念',
    '梦幻绽放版': '海外婚礼+高定主纱+定制婚宴',
    '名流盛典版': '明星策划团队+私人海岛仪式',

    // 生育档位
    '简约温馨版': '公立全流程 家人月子 基础育儿',
    '精算优选版': '私立产检 月嫂助力 早教启蒙',
    '品质护航版': '高端产检套餐 LDR产房 月子会所',
    '尊享定制版': '海外胎教 明星医院 蒙氏早教',
    '星际臻享版': '顶尖产科团队 科技分娩 医护月子',

    // 赡养档位
    '基础关怀版': '定期探望+基础生活费+社区医疗',
    '舒心照料版': '专属营养餐+家庭医生+适老改造',
    '品质陪伴版': '旅居疗养+健康管家+文娱课程',
    '尊享颐养版': '高端养老社区+专属护理+全球疗养',
    '殿堂级守护版': '私人医疗团队+抗衰管理+环球旅居'
  }), []);

  // 缓存从localStorage读取的数据
  const { requiredLifeData, optionalLifeData, loanData } = useMemo(() => {
    const getRequiredLifeData = () => {
      try {
        const savedData = localStorage.getItem('requiredLifeData');
        return savedData ? JSON.parse(savedData) : { totalAmount: 0, breakdown: {}, selectedSubjectLevels: {} };
      } catch (error) {
        return { totalAmount: 0, breakdown: {}, selectedSubjectLevels: {} };
      }
    };

    const getOptionalLifeData = () => {
      try {
        const savedData = localStorage.getItem('optionalLifeData');
        return savedData ? JSON.parse(savedData) : { totalAmount: 0, breakdown: {}, selectedModules: [], detailedConfigs: {} };
      } catch (error) {
        return { totalAmount: 0, breakdown: {}, selectedModules: [], detailedConfigs: {} };
      }
    };

    const getLoanData = () => {
      try {
        const savedData = localStorage.getItem('shared_loan_data');
        return savedData ? JSON.parse(savedData) : [];
      } catch (error) {
        return [];
      }
    };

    return {
      requiredLifeData: getRequiredLifeData(),
      optionalLifeData: getOptionalLifeData(),
      loanData: getLoanData()
    };
  }, []);

  // 计算贷款总金额（月还款×12个月）
  const loanTotalAmount = useMemo(() => {
    if (!Array.isArray(loanData) || loanData.length === 0) return 0;
    
    // 简化计算：假设平均月还款为贷款金额的1%（实际应该根据利率和期限计算）
    const totalLoanAmount = loanData.reduce((sum, loan) => {
      const amount = parseFloat(loan.loanAmount) || 0;
      return sum + amount;
    }, 0);
    
    // 假设平均还款期为30年，年化还款约为贷款金额的6%
    return totalLoanAmount * 0.06;
  }, [loanData]);

  // 缓存计算的总金额
  const totalAmount = useMemo(() => {
    return (requiredLifeData.totalAmount || 0) + (optionalLifeData.totalAmount || 0) + loanTotalAmount;
  }, [requiredLifeData.totalAmount, optionalLifeData.totalAmount, loanTotalAmount]);

  // 缓存人生必须大事配置
  const requiredItems = useMemo(() => [
    { 
      key: '基础生活规划', 
      name: '基础生活', 
      icon: Apple, 
      amount: requiredLifeData.breakdown?.['基础生活规划'] || 0,
      config: requiredLifeData.selectedSubjectLevels?.['基础生活规划'],
      type: 'required'
    },
    { 
      key: '医疗保健规划', 
      name: '医疗保健', 
      icon: Stethoscope, 
      amount: requiredLifeData.breakdown?.['医疗保健规划'] || 0,
      config: requiredLifeData.selectedSubjectLevels?.['医疗保健规划'],
      type: 'required'
    },
    { 
      key: '旅游规划', 
      name: '旅游', 
      icon: Plane, 
      amount: requiredLifeData.breakdown?.['旅游规划'] || 0,
      config: requiredLifeData.selectedSubjectLevels?.['旅游规划'],
      type: 'required'
    },
    { 
      key: '子女教育规划', 
      name: '子女教育', 
      icon: GraduationCap, 
      amount: requiredLifeData.breakdown?.['子女教育规划'] || 0,
      config: requiredLifeData.selectedSubjectLevels?.['子女教育规划'],
      type: 'required'
    },
    { 
      key: '养老规划', 
      name: '养老', 
      icon: Home, 
      amount: requiredLifeData.breakdown?.['养老规划'] || 0,
      config: requiredLifeData.selectedSubjectLevels?.['养老规划'],
      type: 'required'
    }
  ], [requiredLifeData.breakdown, requiredLifeData.selectedSubjectLevels]);

  // 缓存人生可选大事配置 - 简化赡养数据读取逻辑
  const optionalItems = useMemo(() => {
    const breakdown = optionalLifeData.breakdown || {};
    const detailedConfigs = optionalLifeData.detailedConfigs || {};
    const selectedModules = optionalLifeData.selectedModules || [];

    // 简化赡养数据读取
    const careAmount = breakdown.care || breakdown['赡养'] || detailedConfigs.care?.amount || detailedConfigs['赡养']?.amount || 0;
    const careConfig = detailedConfigs.care?.standard || detailedConfigs['赡养']?.standard;

    return [
      { 
        key: 'marriage', 
        name: '结婚', 
        icon: Heart, 
        amount: breakdown.marriage || 0,
        selected: selectedModules.includes('结婚'),
        config: detailedConfigs.marriage?.standard,
        type: 'optional'
      },
      { 
        key: 'birth', 
        name: '生娃', 
        icon: Baby, 
        amount: breakdown.birth || 0,
        selected: selectedModules.includes('生育'),
        config: detailedConfigs.birth?.standard,
        type: 'optional'
      },
      { 
        key: 'housing', 
        name: '买房', 
        icon: Home, 
        amount: breakdown.housing || 0,
        selected: selectedModules.includes('购房'),
        motives: detailedConfigs.housing?.motives || [],
        type: 'optional'
      },
      { 
        key: 'car', 
        name: '买车', 
        icon: Car, 
        amount: breakdown.car || 0,
        selected: selectedModules.includes('购车'),
        carLevels: detailedConfigs.car?.levels || [],
        type: 'optional'
      },
      { 
        key: 'care', 
        name: '赡养', 
        icon: HandHeart, 
        amount: careAmount,
        selected: selectedModules.includes('赡养'),
        config: careConfig,
        type: 'optional'
      }
    ];
  }, [optionalLifeData]);

  // 缓存已选择的可选项目
  const selectedOptionalItems = useMemo(() => {
    return optionalItems.filter(item => item.selected && item.amount > 0);
  }, [optionalItems]);

  // 贷款还款项目
  const loanItems = useMemo(() => {
    if (loanTotalAmount <= 0) return [];
    
    return [{
      key: 'loan-repayment',
      name: '贷款还款',
      icon: CreditCard,
      amount: loanTotalAmount,
      type: 'loan',
      config: `共${loanData.length}笔贷款`
    }];
  }, [loanTotalAmount, loanData.length]);

  // 缓存所有支出项目
  const allItems = useMemo(() => {
    return [...requiredItems, ...selectedOptionalItems, ...loanItems];
  }, [requiredItems, selectedOptionalItems, loanItems]);

  // 使用useCallback优化配置描述获取函数
  const getConfigDescription = useCallback((item: any) => {
    if (item.type === 'required' && item.config) {
      return configDescriptions[item.config as keyof typeof configDescriptions];
    }
    
    if (item.type === 'optional') {
      if (item.key === 'housing' && item.motives?.length > 0) {
        return item.motives.join(' / ');
      }
      if (item.key === 'car' && item.carLevels?.length > 0) {
        return item.carLevels.join(' / ');
      }
      if (item.config) {
        return configDescriptions[item.config as keyof typeof configDescriptions];
      }
    }
    
    return null;
  }, [configDescriptions]);

  // 模拟数据加载过程
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 计算30岁到85岁的支出数据
  const lifetimeExpenditureData = useMemo(() => {
    const data = [];
    
    for (let age = 30; age <= 85; age++) {
      // 基础年度支出
      let baseAmount = totalAmount;
      
      // 年龄相关的支出调整
      if (age >= 60) {
        // 退休后支出略减少，但医疗支出增加
        baseAmount = baseAmount * 0.85 + (age - 60) * 0.5;
      } else if (age >= 40 && age < 50) {
        // 40-50岁支出高峰期（子女教育等）
        baseAmount = baseAmount * 1.2;
      }
      
      // 通胀调整（假设每年2%通胀）
      const inflationFactor = Math.pow(1.02, age - 30);
      const yearlyAmount = baseAmount * inflationFactor;
      
      data.push({
        age,
        amount: Math.round(yearlyAmount),
        year: new Date().getFullYear() + (age - 30)
      });
    }
    
    return data;
  }, [totalAmount]);

  // 处理图表点击事件
  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const clickedData = data.activePayload[0].payload;
      setSelectedYear(clickedData.age);
      setIsDetailExpanded(true);
    }
  };

  // 自定义Tooltip组件
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{`${label}岁 (${data.year}年)`}</p>
          <p className="text-sm" style={{ color: '#01BCD6' }}>
            年度支出：{`${data.amount}万元`}
          </p>
          <p className="text-xs text-gray-500 mt-1">点击查看详情</p>
        </div>
      );
    }
    return null;
  };

  // 获取选中年份的支出详情
  const getYearDetail = (age: number) => {
    if (!age) return null;
    
    const yearData = lifetimeExpenditureData.find(item => item.age === age);
    if (!yearData) return null;
    
    // 计算各项支出在该年的金额（按比例分配）
    const yearTotal = yearData.amount;
    const itemDetails = allItems.map(item => ({
      ...item,
      yearAmount: Math.round((item.amount / totalAmount) * yearTotal)
    }));
    
    return {
      age,
      year: yearData.year,
      total: yearTotal,
      items: itemDetails
    };
  };

  const ExpenditureItem = React.memo(({ item }: { item: any }) => {
    const IconComponent = item.icon;
    const configDescription = getConfigDescription(item);
    
    return (
      <div className="flex items-center gap-3 py-3 px-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 bg-white border" style={{ borderColor: '#01BCD6' }}>
          <IconComponent className="w-4 h-4" style={{ color: '#01BCD6' }} strokeWidth={1.5} />
        </div>
        
        <div className="flex-1 min-w-0 flex justify-between items-center">
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-900 mb-1">{item.name}</div>
            {configDescription && (
              <div className="text-xs text-gray-600 leading-relaxed">{configDescription}</div>
            )}
          </div>
          
          <div className="text-right flex-shrink-0 ml-3">
            {item.config && (
              <div className="text-xs font-medium mb-1" style={{ color: '#01BCD6' }}>
                {item.config}
              </div>
            )}
            <div className="text-base font-bold text-gray-900">
              {item.amount.toFixed(0)}万
            </div>
          </div>
        </div>
      </div>
    );
  });

  if (isLoading) {
    return (
      <div className="p-3 pb-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-8 w-full" />
          <Card className="p-3">
            <Skeleton className="h-16 w-full" />
          </Card>
          <Card className="p-4">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 pb-8">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">请确认您的未来人生支出</h1>
        </div>

        {/* 支出合计模块 */}
        <Card className="p-4 bg-gradient-to-br from-[#CCE9B5]/10 to-[#B8E0A1]/10 border-[#CCE9B5]/30">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              支出合计：{totalAmount.toFixed(0)}万元
            </div>
          </div>
        </Card>

        {/* 支出明细模块 */}
        <Card className="p-4">
          <div className="space-y-1">
            {allItems.map((item) => (
              <ExpenditureItem key={item.key} item={item} />
            ))}
          </div>
        </Card>

        {/* 一生支出趋势图模块 */}
        <Card className="p-4">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-2">未来支出曲线</h3>
            <p className="text-xs text-gray-600">基于当前规划，考虑年龄和通胀因素的支出预测</p>
          </div>
          
          {/* 图表说明 */}
          <div className="p-3 bg-gray-50 rounded-lg mb-4">
            <h4 className="font-medium text-gray-800 mb-2 text-sm">支出趋势分析</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p className="flex items-center">
                <span className="inline-block w-4 h-0.5 bg-[#01BCD6] mr-2"></span>
                年度总支出（含通胀调整）
              </p>
              <p className="text-xs text-gray-500">💡 点击图表上的任意点查看该年详细支出</p>
            </div>
          </div>
          
          <div className="h-64 pl-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={lifetimeExpenditureData}
                margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
                onClick={handleChartClick}
              >
                <defs>
                  <linearGradient id="expenditureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#01BCD6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#01BCD6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="age" 
                  tick={{ fontSize: 10 }}
                  axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                  tickLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                />
                <YAxis 
                  tick={{ 
                    fontSize: 10, 
                    textAnchor: 'end', 
                    fill: '#000'
                  }}
                  tickFormatter={(value) => `${value}万`}
                  axisLine={{ stroke: '#000', strokeWidth: 1 }}
                  tickLine={{ stroke: '#000', strokeWidth: 1 }}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#01BCD6"
                  strokeWidth={2}
                  fill="url(#expenditureGradient)"
                  activeDot={{ r: 6, stroke: '#01BCD6', strokeWidth: 2, fill: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 年度支出详情展开区域 */}
        {selectedYear && (
          <Collapsible open={isDetailExpanded} onOpenChange={setIsDetailExpanded}>
            <Card className="border-[#01BCD6]/30">
              <CollapsibleTrigger className="w-full p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="text-base font-semibold text-gray-900">
                      {selectedYear}岁年度支出详情 ({getYearDetail(selectedYear)?.year}年)
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      总支出：{getYearDetail(selectedYear)?.total}万元
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {isDetailExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="px-4 pb-4 border-t border-gray-100">
                  {(() => {
                    const yearDetail = getYearDetail(selectedYear);
                    if (!yearDetail) return null;
                    
                    return (
                      <div className="space-y-3 pt-4">
                        <h4 className="font-medium text-gray-800 text-sm">支出明细</h4>
                        {yearDetail.items.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <div key={item.key} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white border" style={{ borderColor: '#01BCD6' }}>
                                  <IconComponent className="w-3 h-3" style={{ color: '#01BCD6' }} strokeWidth={1.5} />
                                </div>
                                <span className="text-sm font-medium text-gray-800">{item.name}</span>
                              </div>
                              <span className="text-sm font-bold text-gray-900">{item.yearAmount}万</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export default ExpenditureDisplay;
