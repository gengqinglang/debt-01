import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CircleCheck, AlertCircle, ChevronLeft, Home, Car, CreditCard, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import FinancialHealthOverview from '@/components/asset-freedom/components/FinancialHealthOverview';

const DebtPressureAnalysisPage = () => {
  const navigate = useNavigate();
  const [showAllCards, setShowAllCards] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // 债务优化相关状态
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<string>>(new Set());
  const [selectedOptimizations, setSelectedOptimizations] = useState<Set<string>>(new Set(['mortgage', 'carLoan', 'consumerLoan']));
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  // 模拟会员权限状态
  const isMember = true; // 设为会员用户，这样才能看到详情

  // 处理年龄段卡片点击 - 完全照抄原组件逻辑
  const handlePeriodClick = (period: string) => {
    if (!isMember) {
      // 这里可以添加onInteractionAttempt回调
      return;
    }
    setSelectedPeriod(period);
    setSelectedYear(null);
  };

  const handleBack = () => {
    if (selectedYear !== null) {
      setSelectedYear(null);
    } else {
      setSelectedPeriod(null);
    }
  };

  const handleYearClick = (year: number) => {
    if (!isMember) {
      return;
    }
    setSelectedYear(year);
  };

  // 债务优化相关数据和函数
  const totalOptimizableAmount = 285;
  const totalSavedInterest = 33.5;
  const totalSavings = 33.5;

  // 定义完整的优化建议接口和数据
  interface OptimizationSuggestion {
    id: string;
    type: 'mortgage' | 'carLoan' | 'consumerLoan';
    name: string;
    principal: number;
    suggestion: string;
    savedInterest: number;
    before: {
      principal: number;
      interestRate?: number;
      repaymentMethod: string;
      monthlyPayment: number;
      // 组合贷特有字段
      loanType?: string;
      commercialAmount?: number;
      commercialRate?: number;
      housingFundAmount?: number;
      housingFundRate?: number;
    };
    after: {
      principal: number;
      interestRate?: number;
      repaymentMethod: string;
      monthlyPayment: number;
      // 组合贷特有字段
      loanType?: string;
      commercialAmount?: number;
      commercialRate?: number;
      housingFundAmount?: number;
      housingFundRate?: number;
    };
  }

  const optimizationSuggestions: OptimizationSuggestion[] = [
    {
      id: 'mortgage',
      type: 'mortgage',
      name: '房贷',
      principal: 200,
      suggestion: '提前还款50万元，缩期至15年',
      savedInterest: 28.5,
      before: {
        principal: 200,
        repaymentMethod: '等额本息',
        monthlyPayment: 1.2,
        loanType: '组合贷款',
        commercialAmount: 120,
        commercialRate: 4.9,
        housingFundAmount: 80,
        housingFundRate: 3.25
      },
      after: {
        principal: 150,
        repaymentMethod: '等额本息', 
        monthlyPayment: 1.05,
        loanType: '组合贷款',
        commercialAmount: 70,
        commercialRate: 4.9,
        housingFundAmount: 80,
        housingFundRate: 3.25
      }
    },
    {
      id: 'carLoan',
      type: 'carLoan',
      name: '车贷',
      principal: 20,
      suggestion: '提前还清',
      savedInterest: 3.2,
      before: {
        principal: 20,
        interestRate: 6.5,
        repaymentMethod: '等额本息',
        monthlyPayment: 0.4
      },
      after: {
        principal: 0,
        interestRate: 0,
        repaymentMethod: '已还清',
        monthlyPayment: 0
      }
    },
    {
      id: 'consumerLoan',
      type: 'consumerLoan',
      name: '消费贷',
      principal: 15,
      suggestion: '更换还款方式为等额本金',
      savedInterest: 1.8,
      before: {
        principal: 15,
        interestRate: 12.8,
        repaymentMethod: '等额本息',
        monthlyPayment: 0.5
      },
      after: {
        principal: 15,
        interestRate: 12.8,
        repaymentMethod: '等额本金',
        monthlyPayment: 0.47
      }
    }
  ];
  // 渲染优化前后对比详情
  const renderOptimizationDetails = (suggestion: OptimizationSuggestion) => {
    const isExpanded = expandedSuggestions.has(suggestion.id);
    if (!isExpanded) return null;

    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h5 className="text-sm font-medium text-gray-900 mb-3">优化前后对比</h5>
        
        {/* 对比表格 */}
        <div className="space-y-4">
          {/* 表头 */}
          <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-600 bg-gray-50 p-3 rounded-lg">
            <div className="col-span-2">项目</div>
            <div>优化前</div>
            <div>优化后</div>
          </div>

          {/* 房贷组合贷详情 */}
          {suggestion.type === 'mortgage' && suggestion.before.loanType === '组合贷款' && (
            <>
              {/* 商业贷款金额 */}
              <div className="grid grid-cols-4 gap-4 text-sm p-3 border border-gray-100 rounded-lg bg-blue-50">
                <div className="col-span-2 text-gray-600">商贷金额（万元）</div>
                <div className="text-gray-900">{suggestion.before.commercialAmount}</div>
                <div className="text-gray-900">{suggestion.after.commercialAmount}</div>
              </div>

              {/* 商业贷款利率 */}
              <div className="grid grid-cols-4 gap-4 text-sm p-3 border border-gray-100 rounded-lg bg-blue-50">
                <div className="col-span-2 text-gray-600">商贷利率（%）</div>
                <div className="text-gray-900">{suggestion.before.commercialRate}</div>
                <div className="text-gray-900">{suggestion.after.commercialRate}</div>
              </div>

              {/* 公积金贷款金额 */}
              <div className="grid grid-cols-4 gap-4 text-sm p-3 border border-gray-100 rounded-lg bg-green-50">
                <div className="col-span-2 text-gray-600">公积金金额（万元）</div>
                <div className="text-gray-900">{suggestion.before.housingFundAmount}</div>
                <div className="text-gray-900">{suggestion.after.housingFundAmount}</div>
              </div>

              {/* 公积金贷款利率 */}
              <div className="grid grid-cols-4 gap-4 text-sm p-3 border border-gray-100 rounded-lg bg-green-50">
                <div className="col-span-2 text-gray-600">公积金利率（%）</div>
                <div className="text-gray-900">{suggestion.before.housingFundRate}</div>
                <div className="text-gray-900">{suggestion.after.housingFundRate}</div>
              </div>

              {/* 月供 */}
              <div className="grid grid-cols-4 gap-4 text-sm p-3 border border-gray-100 rounded-lg">
                <div className="col-span-2 text-gray-600">月供（万元）</div>
                <div className="text-gray-900">{suggestion.before.monthlyPayment}</div>
                <div className="text-gray-900">{suggestion.after.monthlyPayment}</div>
              </div>
            </>
          )}

          {/* 非房贷的详情 */}
          {suggestion.type !== 'mortgage' && (
            <>
              {/* 贷款本金 */}
              <div className="grid grid-cols-4 gap-4 text-sm p-3 border border-gray-100 rounded-lg">
                <div className="col-span-2 text-gray-600">贷款本金（万元）</div>
                <div className="text-gray-900">{suggestion.before.principal}</div>
                <div className="text-gray-900">{suggestion.after.principal}</div>
              </div>

              {/* 利率 */}
              <div className="grid grid-cols-4 gap-4 text-sm p-3 border border-gray-100 rounded-lg">
                <div className="col-span-2 text-gray-600">利率（%）</div>
                <div className="text-gray-900">{suggestion.before.interestRate}</div>
                <div className="text-gray-900">{suggestion.after.interestRate}</div>
              </div>

              {/* 还款方式 */}
              <div className="grid grid-cols-4 gap-4 text-sm p-3 border border-gray-100 rounded-lg">
                <div className="col-span-2 text-gray-600">还款方式</div>
                <div className="text-gray-900">{suggestion.before.repaymentMethod}</div>
                <div className="text-gray-900">{suggestion.after.repaymentMethod}</div>
              </div>

              {/* 月供 */}
              <div className="grid grid-cols-4 gap-4 text-sm p-3 border border-gray-100 rounded-lg">
                <div className="col-span-2 text-gray-600">月供（万元）</div>
                <div className="text-gray-900">{suggestion.before.monthlyPayment}</div>
                <div className="text-gray-900">{suggestion.after.monthlyPayment}</div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // 切换优化建议展开状态
  const toggleSuggestionExpanded = (id: string) => {
    const newExpanded = new Set(expandedSuggestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSuggestions(newExpanded);
  };

  // 处理优化选择变化
  const toggleOptimization = (type: string) => {
    const newSelected = new Set(selectedOptimizations);
    if (newSelected.has(type)) {
      newSelected.delete(type);
    } else {
      newSelected.add(type);
    }
    setSelectedOptimizations(newSelected);
  };

  // 优化前后现金流对比数据
  const optimizationData = [
    { age: 30, beforeOptimization: -5, afterOptimization: 2 },
    { age: 35, beforeOptimization: -8, afterOptimization: 1 },
    { age: 40, beforeOptimization: -10, afterOptimization: 3 },
    { age: 45, beforeOptimization: 5, afterOptimization: 12 },
    { age: 50, beforeOptimization: 15, afterOptimization: 22 },
    { age: 55, beforeOptimization: 20, afterOptimization: 27 },
    { age: 60, beforeOptimization: -5, afterOptimization: 2 },
    { age: 65, beforeOptimization: 10, afterOptimization: 17 },
    { age: 70, beforeOptimization: 8, afterOptimization: 15 }
  ];

  // 处理图表点击
  const handlePointClick = (data: any) => {
    setSelectedPoint(data.activePayload?.[0]?.payload);
  };

  // 自定义Tooltip组件
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{`${label}岁`}</p>
          <p className="text-xs text-red-600">
            {`优化前: ${payload[1]?.value}万元`}
          </p>
          <p className="text-xs text-[#01BCD6]">
            {`优化后: ${payload[0]?.value}万元`}
          </p>
        </div>
      );
    }
    return null;
  };

  // 模拟财务数据
  const stagesData = [
    {
      period: '25岁-29岁',
      healthy: true,
      yearlyData: [
        { year: 25, healthy: true, diagnosis: '财务状况良好，现金流充裕' },
        { year: 26, healthy: true, diagnosis: '收入稳定，支出合理' },
        { year: 27, healthy: true, diagnosis: '储蓄增长，投资收益良好' },
        { year: 28, healthy: true, diagnosis: '债务压力较小，财务健康' },
        { year: 29, healthy: true, diagnosis: '资产配置合理，风险可控' }
      ]
    },
    {
      period: '30岁-34岁',
      healthy: false,
      yearlyData: [
        { year: 30, healthy: false, diagnosis: '房贷压力增大，现金流紧张' },
        { year: 31, healthy: false, diagnosis: '支出增长过快，储蓄不足' },
        { year: 32, healthy: false, diagnosis: '债务负担重，投资收益下降' },
        { year: 33, healthy: false, diagnosis: '财务压力达到峰值' },
        { year: 34, healthy: false, diagnosis: '需要调整理财策略' }
      ]
    },
    {
      period: '35岁-39岁',
      healthy: false,
      yearlyData: [
        { year: 35, healthy: false, diagnosis: '家庭支出增加，财务紧张' },
        { year: 36, healthy: false, diagnosis: '教育支出压力大' },
        { year: 37, healthy: false, diagnosis: '中年危机，收入增长放缓' },
        { year: 38, healthy: false, diagnosis: '债务偿还压力持续' },
        { year: 39, healthy: false, diagnosis: '需要增加收入来源' }
      ]
    },
    {
      period: '40岁-44岁',
      healthy: false,
      yearlyData: [
        { year: 40, healthy: false, diagnosis: '事业压力与家庭支出双重负担' },
        { year: 41, healthy: false, diagnosis: '父母赡养费用增加' },
        { year: 42, healthy: false, diagnosis: '孩子教育费用高峰期' },
        { year: 43, healthy: false, diagnosis: '投资风险偏好需要调整' },
        { year: 44, healthy: false, diagnosis: '为退休准备需要加强' }
      ]
    },
    {
      period: '45岁-49岁',
      healthy: true,
      yearlyData: [
        { year: 45, healthy: true, diagnosis: '收入达到峰值，财务好转' },
        { year: 46, healthy: true, diagnosis: '债务逐步减少，压力缓解' },
        { year: 47, healthy: true, diagnosis: '投资收益稳定增长' },
        { year: 48, healthy: true, diagnosis: '退休规划逐步完善' },
        { year: 49, healthy: true, diagnosis: '财务状况明显改善' }
      ]
    },
    {
      period: '50岁-54岁',
      healthy: true,
      yearlyData: [
        { year: 50, healthy: true, diagnosis: '财务自由度大幅提升' },
        { year: 51, healthy: true, diagnosis: '投资组合成熟稳健' },
        { year: 52, healthy: true, diagnosis: '被动收入逐步增加' },
        { year: 53, healthy: true, diagnosis: '退休金储备充足' },
        { year: 54, healthy: true, diagnosis: '财务安全感显著增强' }
      ]
    },
    {
      period: '55岁-59岁',
      healthy: true,
      yearlyData: [
        { year: 55, healthy: true, diagnosis: '接近退休，财务准备充分' },
        { year: 56, healthy: true, diagnosis: '投资收益稳定可观' },
        { year: 57, healthy: true, diagnosis: '生活质量稳步提升' },
        { year: 58, healthy: true, diagnosis: '退休规划基本完成' },
        { year: 59, healthy: true, diagnosis: '财务目标基本达成' }
      ]
    },
    {
      period: '60岁-64岁',
      healthy: false,
      yearlyData: [
        { year: 60, healthy: false, diagnosis: '退休初期，收入下降明显' },
        { year: 61, healthy: false, diagnosis: '医疗支出开始增加' },
        { year: 62, healthy: false, diagnosis: '通胀对固定收入影响较大' },
        { year: 63, healthy: false, diagnosis: '需要调整支出结构' },
        { year: 64, healthy: false, diagnosis: '长期护理费用需要考虑' }
      ]
    },
    {
      period: '65岁以上',
      healthy: true,
      yearlyData: [
        { year: 65, healthy: true, diagnosis: '退休金体系成熟，保障充分' },
        { year: 66, healthy: true, diagnosis: '医疗保险覆盖全面' },
        { year: 67, healthy: true, diagnosis: '生活成本控制良好' },
        { year: 68, healthy: true, diagnosis: '家庭财务传承规划完善' },
        { year: 69, healthy: true, diagnosis: '晚年生活质量有保障' }
      ]
    }
  ];

  const selectedPeriodData = selectedPeriod 
    ? stagesData.find(stage => stage.period === selectedPeriod)
    : null;

  const selectedYearData = selectedYear && selectedPeriodData
    ? selectedPeriodData.yearlyData.find(data => data.year === selectedYear)
    : null;

  const sections = [
    {
      title: "压力诊断分析",
      showDemo: true,
      demoData: {
        conclusion: "有债务压力",
        cashFlowGap: {
          years: "15年",
          amount: "578万"
        }
      }
    },
    {
      title: "债务优化建议",
      showOptimization: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col w-full max-w-md mx-auto relative bg-white">
      
      {/* 主要内容 */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* 头部导航 */}
        <div className="px-6 py-4 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft size={20} className="text-slate-700" />
            </button>
            <h1 className="text-lg font-semibold text-slate-800">
              通过财富分型，您能获得什么
            </h1>
          </div>
        </div>
        
        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {selectedYearData ? (
            // 显示具体年份的详情
            <div>
              <div className="flex items-center mb-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack} 
                  className="flex items-center text-xs p-1"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  返回
                </Button>
                <span className="text-xs font-medium ml-2">{selectedYear}岁财务详情</span>
              </div>
              
              <div className="space-y-4">
                <div className={`rounded-lg p-4 ${
                  selectedYearData.healthy 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <h3 className="text-base font-semibold mb-2">
                    {selectedYear}岁 财务诊断
                  </h3>
                  <p className="text-sm text-slate-700">
                    {selectedYearData.diagnosis}
                  </p>
                </div>
              </div>
            </div>
          ) : selectedPeriod && isMember ? (
            // 显示年龄段详情
            <div>
              <div className="flex items-center mb-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack} 
                  className="flex items-center text-xs p-1"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  返回
                </Button>
                <span className="text-xs font-medium ml-2">{selectedPeriod}详情</span>
              </div>
              
              <div className="space-y-2">
                {selectedPeriodData?.yearlyData.map((yearData, index) => (
                  <div 
                    key={index}
                    className={`rounded-md px-3 py-3 text-xs cursor-pointer transition-shadow ${
                      yearData.healthy 
                        ? 'bg-green-50 border border-green-100' 
                        : 'bg-red-50 border border-red-100'
                    }`}
                    onClick={() => handleYearClick(yearData.year)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{yearData.year}岁</span>
                      <span className={`text-xs ${
                        yearData.healthy ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {yearData.healthy ? '✓ 健康' : '⚠ 风险'}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 line-clamp-2">
                      {yearData.diagnosis}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // 显示主要内容
            <div className="space-y-6">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-4">
                  
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-medium text-xs"
                         style={{ backgroundColor: '#01BCD6' }}>
                      {sectionIndex + 1}
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      {section.title}
                    </h2>
                  </div>
                  
                  {/* 债务优化建议展示 */}
                  {section.showOptimization && (
                    <div className="mt-6 space-y-6">
                      

                      {/* 债务优化手段 */}
                      <div className="relative">
                        {/* 演示数据标签 */}
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                          演示数据
                        </div>
                        
                        <Card className="border border-gray-200 bg-white">
                          <CardContent className="p-6">
                            <div className="text-center mb-6">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                通过3项手段帮您进行债务优化
                              </h3>
                            </div>
                            
                            <div className="space-y-3">
                              {/* 调整支出 */}
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <div className="flex items-center">
                                  <div className="w-7 h-7 mr-3 rounded bg-gray-50 flex items-center justify-center border-2 border-[#01BCD6]">
                                    <div className="text-[#01BCD6] font-bold text-xs">1</div>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 text-sm">优化3项支出结构</h4>
                                  </div>
                                  <div className="text-sm font-semibold text-[#01BCD6]">共计减少35万</div>
                                </div>
                              </div>
                              
                              {/* 增加收入 */}
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <div className="flex items-center">
                                  <div className="w-7 h-7 mr-3 rounded bg-gray-50 flex items-center justify-center border-2 border-[#01BCD6]">
                                    <div className="text-[#01BCD6] font-bold text-xs">2</div>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 text-sm">新增1笔收入来源</h4>
                                  </div>
                                  <div className="text-sm font-semibold text-[#01BCD6]">共计增加34万</div>
                                </div>
                              </div>
                              
                              {/* 调整还款方式 */}
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <div className="flex items-center">
                                  <div className="w-7 h-7 mr-3 rounded bg-gray-50 flex items-center justify-center border-2 border-[#01BCD6]">
                                    <div className="text-[#01BCD6] font-bold text-xs">3</div>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 text-sm">调整还款方式</h4>
                                  </div>
                                  <div className="text-sm font-semibold text-[#01BCD6]">节省利息33.5万</div>
                                </div>
                              </div>
                            </div>
                            
                          </CardContent>
                        </Card>
                        
                        {/* 演示功能提示 */}
                        <div className="text-xs text-gray-500 mt-2 text-center bg-gray-50 py-2 rounded-lg border">
                          <span className="text-orange-600 font-medium">演示功能：</span>
                          点击下方按钮获取您的真实财务分析
                        </div>
                      </div>


                      {/* 债务优化效果统一展示 */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium" style={{ backgroundColor: '#01BCD6' }}>
                          3
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">优化效果展示</h3>
                      </div>
                      
                      {/* 总结信息 */}
                      <div className="relative">
                        {/* 演示数据标签 */}
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                          演示数据
                        </div>
                        
                        <Card className="mb-4" style={{ backgroundColor: 'rgba(202, 244, 247, 0.3)' }}>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-xs text-gray-600 mb-1">现金流缺口年数</p>
                                <p className="text-lg font-bold text-[#01BCD6]">15年→0年</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 mb-1">现金流缺口金额</p>
                                <p className="text-lg font-bold text-[#01BCD6]">578→0万</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 mb-1">总节省利息</p>
                                <p className="text-lg font-bold text-[#01BCD6]">{totalSavedInterest}万元</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="relative">
                        {/* 演示数据标签 */}
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                          演示数据
                        </div>
                        
                        <div className="rounded-lg p-4 border" style={{ backgroundColor: 'rgba(202, 244, 247, 0.1)', borderColor: '#B3EBEF' }}>
                        
                        {/* 图表说明 */}
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-800 mb-3 text-sm">优化前后现金流对比</h4>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p className="flex items-center">
                              <span className="inline-block w-4 h-0.5 mr-2" style={{ backgroundColor: '#01BCD6' }}></span>
                              债务优化后每年现金流盈余/缺口
                            </p>
                             <p className="flex items-center">
                               <span className="inline-block w-4 h-0.5 bg-red-500 mr-2"></span>
                               债务优化前每年现金流盈余/缺口
                             </p>
                           </div>
                         </div>


                         {/* 折线图 */}
                        <div className="h-64 pl-3">
                          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={optimizationData}
              margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
            >
                              <defs>
                                <linearGradient id="afterOptimizationGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#01BCD6" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="#01BCD6" stopOpacity={0.05}/>
                                </linearGradient>
                                <linearGradient id="beforeOptimizationGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis 
                                dataKey="age" 
                                tick={{ fontSize: 10 }}
                                ticks={[30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85]}
                                axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                tickLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                              />
                              <YAxis 
                                tick={{ 
                                  fontSize: 10, 
                                  textAnchor: 'end', 
                                  fill: '#000'
                                }}
                                tickFormatter={(value) => `${value}`}
                                domain={[0, 30]}
                                axisLine={{ stroke: '#000', strokeWidth: 1 }}
                                tickLine={{ stroke: '#000', strokeWidth: 1 }}
                                width={26}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="2 2" />
                              <Area
                                type="monotone"
                                dataKey="afterOptimization"
                                stroke="#01BCD6"
                                strokeWidth={2}
                                fill="url(#afterOptimizationGradient)"
                                fillOpacity={0.6}
                                dot={false}
                                activeDot={{ r: 5, stroke: '#01BCD6', strokeWidth: 2, fill: '#ffffff' }}
                              />
                              <Area
                                type="monotone"
                                dataKey="beforeOptimization"
                                stroke="#ef4444"
                                strokeWidth={2}
                                fill="url(#beforeOptimizationGradient)"
                                fillOpacity={0.6}
                                dot={false}
                                activeDot={{ r: 5, stroke: '#ef4444', strokeWidth: 2, fill: '#ffffff' }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>

                        {/* 详细数据展示 */}
                        {selectedPoint && (
                          <div className="p-4 rounded-lg border border-gray-200 mt-4" style={{ backgroundColor: 'rgba(202, 244, 247, 0.3)' }}>
                            <h4 className="font-medium text-gray-800 mb-3 text-sm">{selectedPoint.age}岁现金流详情</h4>
                            
                            {/* 优化前后对比 */}
                            <div className="grid grid-cols-2 gap-6">
                              {/* 优化前 */}
                              <div className="space-y-3">
                                <h5 className="text-xs font-medium text-red-600">优化前</h5>
                                <div className="space-y-2">
                                  <div 
                                    className="flex justify-between items-center p-2 rounded cursor-pointer hover:bg-white/50 transition-colors"
                                    onClick={() => {
                                      navigate('/new', { 
                                        state: { 
                                          activeTab: 'planning',
                                          activePlanningTab: 'career-income'
                                        }
                                      });
                                    }}
                                  >
                                     <span className="text-xs text-gray-600">现金流入</span>
                                     <span className="text-xs font-medium text-red-600 hover:underline">
                                       {Math.round((selectedPoint.beforeOptimization + 15) * 10) / 10}万元 →
                                     </span>
                                   </div>
                                   <div 
                                     className="flex justify-between items-center p-2 rounded cursor-pointer hover:bg-white/50 transition-colors"
                                     onClick={() => {
                                       navigate('/new', { 
                                         state: { 
                                           activeTab: 'planning',
                                           activePlanningTab: 'life-events'
                                         }
                                       });
                                     }}
                                   >
                                     <span className="text-xs text-gray-600">现金流出</span>
                                     <span className="text-xs font-medium text-red-600 hover:underline">
                                       {Math.round((15 + (selectedPoint.beforeOptimization - selectedPoint.afterOptimization)) * 10) / 10}万元 →
                                     </span>
                                   </div>
                                   <div className="flex justify-between items-center p-2 rounded bg-white/30">
                                     <span className="text-xs text-gray-600">盈余金额</span>
                                     <span className="text-xs font-medium text-red-600">
                                       {selectedPoint.beforeOptimization}万元
                                     </span>
                                   </div>
                                 </div>
                               </div>

                               {/* 优化后 */}
                               <div className="space-y-3">
                                 <h5 className="text-xs font-medium text-[#01BCD6]">优化后</h5>
                                 <div className="space-y-2">
                                   <div className="flex justify-between items-center p-2 rounded bg-white/20">
                                     <span className="text-xs text-gray-600">现金流入</span>
                                     <span className="text-xs font-medium text-[#01BCD6]">
                                       {Math.round((selectedPoint.beforeOptimization + 15) * 10) / 10}万元
                                     </span>
                                   </div>
                                   <div className="flex justify-between items-center p-2 rounded bg-white/20">
                                     <span className="text-xs text-gray-600">现金流出</span>
                                     <span className="text-xs font-medium text-[#01BCD6]">
                                       {Math.round(15 * 10) / 10}万元
                                     </span>
                                   </div>
                                   <div className="flex justify-between items-center p-2 rounded bg-white/30">
                                     <span className="text-xs text-gray-600">盈余金额</span>
                                     <span className="text-xs font-medium text-[#01BCD6]">
                                       {selectedPoint.afterOptimization}万元
                                     </span>
                                   </div>
                                </div>
                              </div>
                            </div>

                            {/* 优化效果总结 */}
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="text-center">
                                <span className="text-xs text-gray-600">本年度优化效果：盈余增加 </span>
                                <span className="text-xs font-medium text-green-600">
                                  {Math.round((selectedPoint.afterOptimization - selectedPoint.beforeOptimization) * 10) / 10}万元
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {!selectedPoint && (
                          <div className="p-3 rounded-lg text-center text-gray-500 text-xs mt-4" style={{ backgroundColor: 'rgba(202, 244, 247, 0.3)' }}>
                            点击图表上的任意点查看详细数据
                          </div>
                        )}
                        </div>
                      </div>
                      
                      {/* 演示功能提示 - 紧接在折线图容器下方 */}
                      <div className="text-xs text-gray-500 mt-2 text-center bg-gray-50 py-2 rounded-lg border">
                        <span className="text-orange-600 font-medium">演示功能：</span>
                        点击下方按钮获取您的真实财务分析
                      </div>
                      

                    </div>
                  )}

                  {/* 示意功能展示 */}
                  {section.showDemo && (
                    <div className="space-y-4">
                      
                      {/* 债务压力警告提示 - 右上角演示数据标签 */}
                      <div className="relative p-4 rounded-xl bg-red-50 border border-red-200">
                        {/* 演示数据标签 - 右上角 */}
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                          演示数据
                        </div>
                        
                        {/* 警告标题 */}
                        <div className="flex items-center mb-4">
                          <div className="w-4 h-4 mr-2">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 9V14M12 18H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.55 21H20.45A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" 
                                    stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className="text-sm font-medium text-red-600">
                            提醒您存在债务压力，可能影响未来生活
                          </div>
                        </div>
                        
                        {/* 关键数据展示 */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-xs text-gray-600 mb-1">未来有现金流缺口年份</div>
                            <div className="text-xl font-bold text-red-600">
                              {section.demoData.cashFlowGap.years}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-600 mb-1">未来现金流缺口总额</div>
                            <div className="text-xl font-bold text-red-600">
                              {section.demoData.cashFlowGap.amount}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 现金流预测图展示区域 - 右上角演示数据标签 */}
                      <div className="px-4 -mx-4 relative">
                        {/* 3x3网格容器 */}
                        <div className="relative">
                          {/* 演示数据标签 - 右上角 */}
                          <div className="absolute -top-2 right-0 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-30">
                            演示数据
                          </div>
                          
                          {/* 禁用点击的3x3网格 */}
                          <div className="relative pointer-events-none">
                            <FinancialHealthOverview 
                              pageMode={isMember ? "member-severe-shortage" : "public-severe-shortage"}
                              onInteractionAttempt={() => {
                                // 禁用所有交互
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* 提示文字 */}
                        <div className="text-xs text-gray-500 mt-2 text-center bg-gray-50 py-2 rounded-lg border">
                          <span className="text-orange-600 font-medium">演示功能：</span>
                          点击下方按钮获取您的真实财务分析
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 底部间距，避免被固定按钮遮挡 */}
        <div className="h-20"></div>
      </div>
      
      {/* 吸底按钮 */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 p-4 shadow-lg z-50">
        <Button 
          className="w-full bg-[#01BCD6] hover:bg-[#01BCD6]/90 text-white font-semibold py-3 rounded-lg"
          onClick={() => {
            navigate('/wealth-journey-launch');
          }}
        >
          获取专属债务优化方案
        </Button>
      </div>
    </div>
  );
};

export default DebtPressureAnalysisPage;