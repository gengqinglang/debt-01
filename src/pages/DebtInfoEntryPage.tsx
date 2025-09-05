import React, { useState } from 'react';
import { ArrowLeft, Home, Car, CreditCard, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

interface LoanInfo {
  id: string;
  type: 'mortgage' | 'carLoan' | 'consumerLoan';
  name: string;
  icon: React.ReactNode;
  principal: number;
  term: number;
  monthlyPayment: number;
  interestRate?: number;
  repaymentMethod?: string;
  // 房贷特有字段
  loanType?: 'commercial' | 'housingFund' | 'combination';
  commercialAmount?: number;
  commercialRate?: number;
  housingFundAmount?: number;
  housingFundRate?: number;
}

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

const DebtInfoEntryPage: React.FC = () => {
  const navigate = useNavigate();

  // 状态管理
  const [showOptimization, setShowOptimization] = useState(false);
  const [cardsCollapsed, setCardsCollapsed] = useState(false);
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<string>>(new Set());
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [selectedOptimizations, setSelectedOptimizations] = useState<Set<string>>(new Set(['mortgage', 'carLoan', 'consumerLoan']));

  // 初始债务数据
  const [loansList, setLoansList] = useState<LoanInfo[]>([
    {
      id: '1',
      type: 'mortgage',
      name: '房贷',
      icon: <Home className="w-5 h-5" />,
      principal: 0,
      term: 30,
      monthlyPayment: 1.2,
      loanType: 'commercial'
    },
    {
      id: '2',
      type: 'carLoan',
      name: '车贷',
      icon: <Car className="w-5 h-5" />,
      principal: 20,
      term: 5,
      monthlyPayment: 0.4
    },
    {
      id: '3',
      type: 'consumerLoan',
      name: '消费贷',
      icon: <CreditCard className="w-5 h-5" />,
      principal: 15,
      term: 3,
      monthlyPayment: 0.5
    }
  ]);

  // 模拟优化建议数据
  const optimizationSuggestions: OptimizationSuggestion[] = [
    {
      id: '1',
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
      id: '2',
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
      id: '3',
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

  const totalOptimizableAmount = optimizationSuggestions.reduce((sum, item) => sum + item.principal, 0);
  const totalSavedInterest = optimizationSuggestions.reduce((sum, item) => sum + item.savedInterest, 0);
  
  // 根据选中的优化项目计算节省的利息
  const selectedSavings = optimizationSuggestions
    .filter(item => selectedOptimizations.has(item.type))
    .reduce((sum, item) => sum + item.savedInterest, 0);
  const totalSavings = selectedSavings;

  // 优化前后现金流对比数据
  const optimizationData = [];
  for (let age = 30; age <= 85; age++) {
    // 生成更平滑且为正值的现金流数据
    const baseFlow = 5 + Math.sin((age - 30) * 0.08) * 8 + (age >= 35 && age <= 65 ? 10 : 5);
    const ageMultiplier = age <= 50 ? (age - 30) * 0.3 : Math.max(0, (65 - age) * 0.2);
    
    const beforeOptimization = Math.max(2, baseFlow + ageMultiplier);
    
    // 根据选中的优化项目计算优化幅度
    let optimizationBoost = 0; // 基础无提升
    if (selectedOptimizations.has('mortgage')) optimizationBoost += 2;
    if (selectedOptimizations.has('carLoan')) optimizationBoost += 1;
    if (selectedOptimizations.has('consumerLoan')) optimizationBoost += 0.5;
    
    // 如果没有选择任何优化，则优化后等于优化前
    const afterOptimization = selectedOptimizations.size === 0 
      ? beforeOptimization 
      : beforeOptimization + Math.max(1, optimizationBoost) + Math.abs(Math.sin((age - 30) * 0.1)) * 0.5;
    
    optimizationData.push({
      age,
      beforeOptimization: Math.round(beforeOptimization * 10) / 10,
      afterOptimization: Math.round(afterOptimization * 10) / 10
    });
  }

  // 处理优化选择变化
  const toggleOptimization = (type: string) => {
    const newSelected = new Set(selectedOptimizations);
    if (newSelected.has(type)) {
      newSelected.delete(type);
    } else {
      newSelected.add(type);
    }
    setSelectedOptimizations(newSelected);
    setSelectedPoint(null); // 重置选中点
  };

  // 处理图表点击
  const handlePointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      setSelectedPoint(data.activePayload[0].payload);
    }
  };

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // 确保正确识别优化前后的数据
      const beforeData = payload.find((p: any) => p.dataKey === 'beforeOptimization');
      const afterData = payload.find((p: any) => p.dataKey === 'afterOptimization');
      
      const beforeValue = beforeData?.value || 0;
      const afterValue = afterData?.value || 0;
      const increaseAmount = afterValue - beforeValue;
      
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-sm mb-1">{`${label}岁`}</p>
          <p className="text-[#01BCD6] text-xs">
            {`优化后: 盈余${afterValue}万元`}
          </p>
          <p className="text-red-500 text-xs">
            {`优化前: 盈余${beforeValue}万元`}
          </p>
          <p className="text-green-600 text-xs font-medium mt-1">
            {`盈余增加: ${Math.round(increaseAmount * 10) / 10}万元`}
          </p>
        </div>
      );
    }
    return null;
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

  // 更新贷款信息
  const updateLoanInfo = (id: string, field: string, value: any) => {
    setLoansList(prev => prev.map(loan => 
      loan.id === id ? { ...loan, [field]: value } : loan
    ));
  };

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

  // 渲染房贷特殊字段
  const renderMortgageFields = (loan: LoanInfo) => {
    if (loan.type !== 'mortgage') return null;

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">贷款类型</Label>
          <RadioGroup
            value={loan.loanType || 'commercial'}
            onValueChange={(value) => updateLoanInfo(loan.id, 'loanType', value)}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="commercial" id="commercial" />
              <Label htmlFor="commercial" className="text-sm">纯商贷</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="housingFund" id="housingFund" />
              <Label htmlFor="housingFund" className="text-sm">公积金贷款</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="combination" id="combination" />
              <Label htmlFor="combination" className="text-sm">组合贷款</Label>
            </div>
          </RadioGroup>
        </div>

        {loan.loanType === 'combination' && (
          <div className="space-y-4">
            {/* 商贷信息 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`commercial-amount-${loan.id}`} className="text-sm text-gray-600">商贷金额（万元）</Label>
                <Input
                  id={`commercial-amount-${loan.id}`}
                  type="number"
                  placeholder="请输入"
                  value={loan.commercialAmount || ''}
                  onChange={(e) => updateLoanInfo(loan.id, 'commercialAmount', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`commercial-rate-${loan.id}`} className="text-sm text-gray-600">商贷利率（%）</Label>
                <Input
                  id={`commercial-rate-${loan.id}`}
                  type="number"
                  placeholder="请输入"
                  step="0.1"
                  value={loan.commercialRate || ''}
                  onChange={(e) => updateLoanInfo(loan.id, 'commercialRate', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>
            
            {/* 公积金信息 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`fund-amount-${loan.id}`} className="text-sm text-gray-600">公积金金额（万元）</Label>
                <Input
                  id={`fund-amount-${loan.id}`}
                  type="number"
                  placeholder="请输入"
                  value={loan.housingFundAmount || ''}
                  onChange={(e) => updateLoanInfo(loan.id, 'housingFundAmount', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`fund-rate-${loan.id}`} className="text-sm text-gray-600">公积金利率（%）</Label>
                <Input
                  id={`fund-rate-${loan.id}`}
                  type="number"
                  placeholder="请输入"
                  step="0.1"
                  value={loan.housingFundRate || ''}
                  onChange={(e) => updateLoanInfo(loan.id, 'housingFundRate', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>
            
            {/* 贷款期限和月供 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`term-${loan.id}`} className="text-sm text-gray-600">贷款期限（年）</Label>
                <Input
                  id={`term-${loan.id}`}
                  type="number"
                  value={loan.term}
                  onChange={(e) => updateLoanInfo(loan.id, 'term', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`payment-${loan.id}`} className="text-sm text-gray-600">月供（万元）</Label>
                <Input
                  id={`payment-${loan.id}`}
                  type="number"
                  value={loan.monthlyPayment}
                  onChange={(e) => updateLoanInfo(loan.id, 'monthlyPayment', parseFloat(e.target.value) || 0)}
                  className="mt-1 bg-gray-50"
                  disabled
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">录入详细负债信息</h1>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 债务卡片区域 */}
        <div className="space-y-4">
          {/* 收起/展开控制 */}
          {showOptimization && (
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">债务信息</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCardsCollapsed(!cardsCollapsed)}
                className="text-gray-600 hover:text-gray-900"
              >
                {cardsCollapsed ? (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    展开
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    收起
                  </>
                )}
              </Button>
            </div>
          )}

          {/* 债务卡片列表 */}
          <div className={`space-y-4 ${showOptimization && cardsCollapsed ? 'hidden' : ''}`}>
            {loansList.map((loan) => (
              <Card key={loan.id} className="border border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <div className="w-8 h-8 rounded-full bg-[#CAF4F7] flex items-center justify-center">
                      {loan.icon}
                    </div>
                    <span>{loan.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 房贷特殊字段 */}
                  {renderMortgageFields(loan)}

                  {/* 基础信息 - 只在非组合贷款时显示 */}
                  {loan.loanType !== 'combination' && (
                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`principal-${loan.id}`} className="text-sm text-gray-600">贷款本金（万元）</Label>
                          <Input
                            id={`principal-${loan.id}`}
                            type="number"
                            placeholder={loan.type === 'mortgage' ? '请输入' : undefined}
                            value={loan.type === 'mortgage' && loan.principal === 0 ? '' : loan.principal}
                            onChange={(e) => updateLoanInfo(loan.id, 'principal', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`term-${loan.id}`} className="text-sm text-gray-600">贷款期限（年）</Label>
                          <Input
                            id={`term-${loan.id}`}
                            type="number"
                            value={loan.term}
                            onChange={(e) => updateLoanInfo(loan.id, 'term', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 通用字段：利率和还款方式 */}
                  {loan.loanType !== 'combination' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`rate-${loan.id}`} className="text-sm text-gray-600">利率（%）</Label>
                        <Input
                          id={`rate-${loan.id}`}
                          type="number"
                          placeholder="请输入年利率"
                          step="0.1"
                          value={loan.interestRate || ''}
                          onChange={(e) => updateLoanInfo(loan.id, 'interestRate', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`method-${loan.id}`} className="text-sm text-gray-600">还款方式</Label>
                        <Select
                          value={loan.repaymentMethod || ''}
                          onValueChange={(value) => updateLoanInfo(loan.id, 'repaymentMethod', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="选择还款方式" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equalPrincipalAndInterest">等额本息</SelectItem>
                            <SelectItem value="equalPrincipal">等额本金</SelectItem>
                            {loan.type !== 'mortgage' && (
                              <SelectItem value="interestOnly">先息后本</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* 月供字段 - 只在非组合贷款时显示 */}
                  {loan.loanType !== 'combination' && (
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor={`payment-${loan.id}`} className="text-sm text-gray-600">月供（万元）</Label>
                        <Input
                          id={`payment-${loan.id}`}
                          type="number"
                          value={loan.monthlyPayment}
                          onChange={(e) => updateLoanInfo(loan.id, 'monthlyPayment', parseFloat(e.target.value) || 0)}
                          className="mt-1 bg-gray-50"
                          disabled
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="mt-8 pb-6">
          <Button 
            className="w-full h-12 text-white font-medium text-base"
            style={{ backgroundColor: '#01BCD6' }}
            onClick={() => {
              setShowOptimization(true);
              setCardsCollapsed(true);
            }}
          >
            <Check className="w-5 h-5 mr-2" />
            录完了，获取债务优化建议
          </Button>
        </div>

        {/* 优化建议区域 */}
        {showOptimization && (
          <div className="mt-6 space-y-6">
            {/* 优化摘要标题 */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">债务优化建议</h3>
              <p className="text-gray-600">
                您共有 <span className="font-semibold text-[#01BCD6]">5</span> 笔债务，其中 
                <span className="font-semibold text-[#01BCD6]"> 3</span> 笔有优化空间
              </p>
            </div>

            {/* 总结信息 */}
            <Card className="border-2 border-[#01BCD6] bg-gradient-to-r from-[#CAF4F7] to-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">优化总结</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">总可优化债务金额</p>
                      <p className="text-2xl font-bold text-[#01BCD6]">{totalOptimizableAmount}万元</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">总节省利息</p>
                      <p className="text-2xl font-bold text-green-600">{totalSavedInterest}万元</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 优化建议列表 */}
            <div className="space-y-4">
              {optimizationSuggestions.map((suggestion) => (
                <Card key={suggestion.id} className="border border-gray-200 bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#CAF4F7] flex items-center justify-center">
                            {suggestion.type === 'mortgage' && <Home className="w-3 h-3" />}
                            {suggestion.type === 'carLoan' && <Car className="w-3 h-3" />}
                            {suggestion.type === 'consumerLoan' && <CreditCard className="w-3 h-3" />}
                          </div>
                          <span className="font-medium text-gray-900">{suggestion.name}</span>
                          <span className="text-sm text-gray-500">本金：{suggestion.principal}万元</span>
                        </div>
                        <div className="flex items-start space-x-2 mb-2">
                          <span className="text-gray-700 whitespace-nowrap">建议优化：</span>
                          <p className="text-gray-700 flex-1">{suggestion.suggestion}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-green-600 font-medium">可节省利息：{suggestion.savedInterest}万元</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSuggestionExpanded(suggestion.id)}
                            className="text-[#01BCD6] hover:text-[#01BCD6] hover:bg-[#CAF4F7]/50"
                          >
                            {expandedSuggestions.has(suggestion.id) ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                收起详情
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                查看详情
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* 详细对比信息 */}
                    {renderOptimizationDetails(suggestion)}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 债务优化效果统一展示 */}
            <div className="rounded-lg p-4 border" style={{ backgroundColor: 'rgba(202, 244, 247, 0.1)', borderColor: '#B3EBEF' }}>
              {/* 总计节省 */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-medium text-gray-800">优化后节省利息总金额</span>
                <span className="text-xl font-bold" style={{ color: '#01BCD6' }}>{totalSavings}万元</span>
              </div>
              
              {/* 优化选项控制 */}
              <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(202, 244, 247, 0.2)' }}>
                <h5 className="text-sm font-medium text-gray-700 mb-3">选择优化方案</h5>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedOptimizations.has('mortgage')}
                      onChange={() => toggleOptimization('mortgage')}
                      className="rounded border-gray-300 text-[#01BCD6] focus:ring-[#01BCD6]"
                    />
                    <span className="text-sm text-gray-700">房贷优化 (节省28.5万利息)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedOptimizations.has('carLoan')}
                      onChange={() => toggleOptimization('carLoan')}
                      className="rounded border-gray-300 text-[#01BCD6] focus:ring-[#01BCD6]"
                    />
                    <span className="text-sm text-gray-700">车贷优化 (节省3.2万利息)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedOptimizations.has('consumerLoan')}
                      onChange={() => toggleOptimization('consumerLoan')}
                      className="rounded border-gray-300 text-[#01BCD6] focus:ring-[#01BCD6]"
                    />
                    <span className="text-sm text-gray-700">消费贷优化 (节省1.8万利息)</span>
                  </label>
                </div>
              </div>
              
              {/* 分隔线 */}
              <div className="border-t border-gray-200 mb-4"></div>
              
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
                    onClick={handlePointClick}
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
                          <span className="text-xs font-medium text-blue-600 hover:underline">
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
                          <span className="text-xs font-medium text-orange-600 hover:underline">
                            {Math.round(15 * 10) / 10}万元 →
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
                          <span className="text-xs font-medium text-blue-600">
                            {Math.round((selectedPoint.afterOptimization + 15) * 10) / 10}万元
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-white/20">
                          <span className="text-xs text-gray-600">现金流出</span>
                          <span className="text-xs font-medium text-orange-600">
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


            {/* 债务优化测评入口 */}
            <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: 'rgba(202, 244, 247, 0.3)', borderColor: '#B3EBEF' }}>
              <div>
                <h4 className="font-medium text-gray-800 mb-2 text-sm">💡 系统方案不够理想？</h4>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed text-left">
                  想要量身定制专属优化策略？试试"债务优化测评"，通过智能分析为您找到最适合的解决方案！
                </p>
                <button 
                  className="w-full bg-[#01BCD6] hover:bg-[#01BCD6]/90 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-200 hover:shadow-md"
                  onClick={() => navigate('/debt-optimization')}
                >
                  🔍 债务优化测评
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DebtInfoEntryPage;