import React, { useState } from 'react';
import { ArrowLeft, Home, Car, CreditCard, Check, AlertTriangle, CheckCircle, XCircle, Plus, Minus, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, ReferenceLine } from 'recharts';

interface SubLoan {
  id: string;
  principal: number;
  term: number;
  monthlyPayment: number;
  interestRate: number;
  repaymentMethod: 'equalPrincipalAndInterest' | 'equalPrincipal';
  loanType?: 'commercial' | 'housingFund' | 'combination';
  commercialAmount?: number;
  commercialRate?: number;
  housingFundAmount?: number;
  housingFundRate?: number;
}

interface LoanData {
  id: string;
  type: 'mortgage' | 'carLoan' | 'consumerLoan';
  name: string;
  icon: React.ReactNode;
  original: {
    principal: number;
    term: number;
    monthlyPayment: number;
    interestRate: number;
    loanType?: 'commercial' | 'housingFund' | 'combination';
    commercialAmount?: number;
    commercialRate?: number;
    housingFundAmount?: number;
    housingFundRate?: number;
  };
  optimizedSubLoans: SubLoan[];
}

const DebtOptimizationPage: React.FC = () => {
  const navigate = useNavigate();
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [expandedLoans, setExpandedLoans] = useState<Set<string>>(new Set());
  const [showOptimizationResult, setShowOptimizationResult] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    feasible: boolean;
    monthlySavings: number;
    percentageReduction: number;
    message: string;
  } | null>(null);

  // 初始贷款数据
  const [loansData, setLoansData] = useState<LoanData[]>([
    {
      id: '1',
      type: 'mortgage',
      name: '房贷',
      icon: <Home className="w-5 h-5" />,
      original: {
        principal: 300,
        term: 30,
        monthlyPayment: 1.8,
        interestRate: 4.9,
        loanType: 'combination',
        commercialAmount: 180,
        commercialRate: 4.9,
        housingFundAmount: 120,
        housingFundRate: 3.25
      },
      optimizedSubLoans: [
        {
          id: 'mortgage-1',
          principal: 300,
          term: 30,
          monthlyPayment: 1.8,
          interestRate: 4.9,
          repaymentMethod: 'equalPrincipalAndInterest',
          loanType: 'combination',
          commercialAmount: 180,
          commercialRate: 4.9,
          housingFundAmount: 120,
          housingFundRate: 3.25
        }
      ]
    },
    {
      id: '2',
      type: 'carLoan',
      name: '车贷',
      icon: <Car className="w-5 h-5" />,
      original: {
        principal: 20,
        term: 5,
        monthlyPayment: 0.42,
        interestRate: 6.5
      },
      optimizedSubLoans: [
        {
          id: 'car-1',
          principal: 20,
          term: 5,
          monthlyPayment: 0.42,
          interestRate: 6.5,
          repaymentMethod: 'equalPrincipalAndInterest'
        }
      ]
    },
    {
      id: '3',
      type: 'consumerLoan',
      name: '消费贷',
      icon: <CreditCard className="w-5 h-5" />,
      original: {
        principal: 15,
        term: 3,
        monthlyPayment: 0.52,
        interestRate: 12.8
      },
      optimizedSubLoans: [
        {
          id: 'consumer-1',
          principal: 15,
          term: 3,
          monthlyPayment: 0.52,
          interestRate: 12.8,
          repaymentMethod: 'equalPrincipalAndInterest'
        }
      ]
    }
  ]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/debt-info-entry');
    }
  };

  // 切换贷款优化展开状态
  const toggleLoanOptimization = (loanId: string) => {
    const newExpanded = new Set(expandedLoans);
    if (newExpanded.has(loanId)) {
      newExpanded.delete(loanId);
    } else {
      newExpanded.add(loanId);
    }
    setExpandedLoans(newExpanded);
  };

  // 更新子贷款信息
  const updateSubLoan = (loanId: string, subLoanId: string, field: string, value: any) => {
    setLoansData(prev => prev.map(loan => 
      loan.id === loanId 
        ? { 
            ...loan, 
            optimizedSubLoans: loan.optimizedSubLoans.map(subLoan =>
              subLoan.id === subLoanId 
                ? { ...subLoan, [field]: value }
                : subLoan
            )
          }
        : loan
    ));
  };

  // 添加子贷款
  const addSubLoan = (loanId: string, loanType: 'mortgage' | 'carLoan' | 'consumerLoan') => {
    const newSubLoanId = `${loanType}-${Date.now()}`;
    const newSubLoan: SubLoan = {
      id: newSubLoanId,
      principal: 0,
      term: 1,
      monthlyPayment: 0,
      interestRate: 0,
      repaymentMethod: 'equalPrincipalAndInterest'
    };

    // 房贷类型需要添加默认的贷款类型
    if (loanType === 'mortgage') {
      newSubLoan.loanType = 'commercial';
    }

    setLoansData(prev => prev.map(loan => 
      loan.id === loanId 
        ? { ...loan, optimizedSubLoans: [...loan.optimizedSubLoans, newSubLoan] }
        : loan
    ));
  };

  // 删除子贷款
  const removeSubLoan = (loanId: string, subLoanId: string) => {
    setLoansData(prev => prev.map(loan => 
      loan.id === loanId 
        ? { 
            ...loan, 
            optimizedSubLoans: loan.optimizedSubLoans.filter(subLoan => subLoan.id !== subLoanId)
          }
        : loan
    ));
  };

  // 确认优化方案
  const handleConfirmOptimization = () => {
    setHasConfirmed(true);
    setShowOptimizationResult(true);
  };

  // 计算利息对比数据
  const calculateInterestComparison = () => {
    const ages = Array.from({length: 56}, (_, i) => i + 30); // 30岁到85岁
    
    return ages.map(age => {
      // 确保现金流始终为正值，模拟优化前现金流盈余
      const beforeOptimization = Math.max(5, 25 - (age - 30) * 0.3 + Math.sin((age - 30) * 0.3) * 3);
      
      // 优化后现金流更好，确保比优化前高
      const afterOptimization = beforeOptimization + 2 + Math.sin((age - 30) * 0.2) * 2;
      
      return {
        age,
        beforeOptimization: Math.round(beforeOptimization * 10) / 10,
        afterOptimization: Math.round(afterOptimization * 10) / 10,
        saved: Math.round((afterOptimization - beforeOptimization) * 10) / 10
      };
    });
  };

  // 添加选中点状态
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  // 点击图表点的处理函数
  const handlePointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      setSelectedPoint(data.activePayload[0].payload);
    }
  };

  // 自定义 Tooltip 组件
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800 mb-2">{`${label}岁`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'afterOptimization' ? '优化后' : '优化前'}: 盈余{entry.value}万元
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#F4FDFD] flex flex-col">
      <div className="relative flex flex-col bg-white/90 backdrop-blur-xl flex-1">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#B3EBEF]/20 via-white/60 to-[#B3EBEF]/20">
          <div className="relative p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="absolute left-4 top-4 p-0 h-auto text-gray-600 hover:text-gray-800 z-10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            
            <div className="text-center flex flex-col justify-center pt-8" style={{ minHeight: '60px' }}>
              <h1 className="text-lg font-bold text-gray-900 mb-1 tracking-tight">
                债务优化测评
              </h1>
              <div className="w-20 h-1 mx-auto rounded-full mb-2 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC]"></div>
              <p className="text-gray-700 text-xs font-medium">
                输入您的优化方案，获取可行性分析
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* 债务优化整体容器 */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">债务优化方案录入</h3>
                <p className="text-sm text-gray-600">请为以下贷款录入您的优化方案，完成后可查看整体优化效果</p>
              </div>

              {/* 贷款卡片列表 */}
              <div className="space-y-3">
                {loansData.map((loan) => (
                  <Card key={loan.id} className="bg-gray-50 border border-gray-100 shadow-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-gray-800">
                        {loan.icon}
                        {loan.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* 原始信息展示 */}
                      <div className="p-2 bg-red-50 rounded-lg">
                        <h4 className="text-xs font-medium text-red-800 mb-2">原始信息</h4>
                        
                        {/* 房贷特殊展示 */}
                        {loan.type === 'mortgage' && loan.original.loanType === 'combination' ? (
                          <div className="space-y-2">
                            {/* 债务总金额 */}
                            <div className="p-2 bg-gray-100 rounded border">
                              <div className="text-xs font-medium text-gray-800 mb-1">债务总金额</div>
                              <div className="text-sm font-semibold text-gray-900">
                                {((loan.original.commercialAmount || 0) + (loan.original.housingFundAmount || 0))}万元
                              </div>
                            </div>
                            
                            {/* 商贷部分 */}
                            <div className="p-2 bg-blue-50 rounded border">
                              <div className="text-xs font-medium text-blue-800 mb-1">商业贷款</div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-600">商贷金额：</span>
                                  <span className="font-medium text-gray-900">{loan.original.commercialAmount}万元</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">商贷利率：</span>
                                  <span className="font-medium text-gray-900">{loan.original.commercialRate}%</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* 公积金贷款部分 */}
                            <div className="p-2 bg-green-50 rounded border">
                              <div className="text-xs font-medium text-green-800 mb-1">公积金贷款</div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-600">公积金金额：</span>
                                  <span className="font-medium text-gray-900">{loan.original.housingFundAmount}万元</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">公积金利率：</span>
                                  <span className="font-medium text-gray-900">{loan.original.housingFundRate}%</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* 总体信息 */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-600">贷款期限：</span>
                                <span className="font-medium text-gray-900">{loan.original.term}年</span>
                              </div>
                              <div>
                                <span className="text-gray-600">月供：</span>
                                <span className="font-medium text-gray-900">{loan.original.monthlyPayment}万元</span>
                              </div>
                            </div>
                          </div>
                        ) : loan.type === 'mortgage' ? (
                          <div className="space-y-2">
                            {/* 债务总金额 */}
                            <div className="p-2 bg-gray-100 rounded border">
                              <div className="text-xs font-medium text-gray-800 mb-1">债务总金额</div>
                              <div className="text-sm font-semibold text-gray-900">
                                {loan.original.principal}万元
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-600">贷款本金：</span>
                                <span className="font-medium text-gray-900">{loan.original.principal}万元</span>
                              </div>
                              <div>
                                <span className="text-gray-600">贷款期限：</span>
                                <span className="font-medium text-gray-900">{loan.original.term}年</span>
                              </div>
                              <div>
                                <span className="text-gray-600">月供：</span>
                                <span className="font-medium text-gray-900">{loan.original.monthlyPayment}万元</span>
                              </div>
                              <div>
                                <span className="text-gray-600">利率：</span>
                                <span className="font-medium text-gray-900">{loan.original.interestRate}%</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-600">贷款本金：</span>
                              <span className="font-medium text-gray-900">{loan.original.principal}万元</span>
                            </div>
                            <div>
                              <span className="text-gray-600">贷款期限：</span>
                              <span className="font-medium text-gray-900">{loan.original.term}年</span>
                            </div>
                            <div>
                              <span className="text-gray-600">月供：</span>
                              <span className="font-medium text-gray-900">{loan.original.monthlyPayment}万元</span>
                            </div>
                            <div>
                              <span className="text-gray-600">利率：</span>
                              <span className="font-medium text-gray-900">{loan.original.interestRate}%</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 做优化按钮 */}
                      {!expandedLoans.has(loan.id) && (
                        <div className="pt-2">
                          <Button
                            type="button"
                            onClick={() => toggleLoanOptimization(loan.id)}
                            variant="outline"
                            size="sm"
                            className="w-full text-[#01BCD6] border-[#01BCD6] hover:bg-[#01BCD6] hover:text-white"
                          >
                            录入优化方案
                          </Button>
                        </div>
                      )}

                      {/* 优化后信息录入 - 支持拆分为多个子贷款 */}
                      {expandedLoans.has(loan.id) && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-green-800">优化后信息</h4>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                onClick={() => addSubLoan(loan.id, loan.type)}
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-100"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                拆分贷款
                              </Button>
                              <Button
                                type="button"
                                onClick={() => toggleLoanOptimization(loan.id)}
                                size="sm"
                                variant="ghost"
                                className="text-gray-500 hover:text-gray-700"
                              >
                                收起
                              </Button>
                            </div>
                          </div>
                          
                          {/* 子贷款列表 */}
                          <div className="space-y-4">
                            {loan.optimizedSubLoans.map((subLoan, subLoanIndex) => (
                              <div key={subLoan.id} className="p-3 bg-white rounded-lg border border-green-200 relative">
                                {/* 删除按钮 */}
                                {loan.optimizedSubLoans.length > 1 && (
                                  <Button
                                    type="button"
                                    onClick={() => removeSubLoan(loan.id, subLoan.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 h-auto"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                )}
                                
                                <div className="space-y-3 pr-8">
                                  <div className="text-xs font-medium text-gray-700 mb-2">
                                    子贷款 {subLoanIndex + 1}
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <Label htmlFor={`principal-${loan.id}-${subLoan.id}`} className="text-xs text-gray-600">贷款本金（万元）</Label>
                                      <Input
                                        id={`principal-${loan.id}-${subLoan.id}`}
                                        type="number"
                                        value={subLoan.principal}
                                        onChange={(e) => updateSubLoan(loan.id, subLoan.id, 'principal', parseFloat(e.target.value) || 0)}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`term-${loan.id}-${subLoan.id}`} className="text-xs text-gray-600">贷款期限（年）</Label>
                                      <Input
                                        id={`term-${loan.id}-${subLoan.id}`}
                                        type="number"
                                        value={subLoan.term}
                                        onChange={(e) => updateSubLoan(loan.id, subLoan.id, 'term', parseInt(e.target.value) || 0)}
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <Label htmlFor={`monthly-${loan.id}-${subLoan.id}`} className="text-xs text-gray-600">月供（万元）</Label>
                                      <Input
                                        id={`monthly-${loan.id}-${subLoan.id}`}
                                        type="number"
                                        step="0.01"
                                        value={subLoan.monthlyPayment}
                                        onChange={(e) => updateSubLoan(loan.id, subLoan.id, 'monthlyPayment', parseFloat(e.target.value) || 0)}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`rate-${loan.id}-${subLoan.id}`} className="text-xs text-gray-600">利率（%）</Label>
                                      <Input
                                        id={`rate-${loan.id}-${subLoan.id}`}
                                        type="number"
                                        step="0.01"
                                        value={subLoan.interestRate}
                                        onChange={(e) => updateSubLoan(loan.id, subLoan.id, 'interestRate', parseFloat(e.target.value) || 0)}
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-3">
                                    <div>
                                      <Label className="text-xs text-gray-600">还款方式</Label>
                                      <Select
                                        value={subLoan.repaymentMethod}
                                        onValueChange={(value) => updateSubLoan(loan.id, subLoan.id, 'repaymentMethod', value)}
                                      >
                                        <SelectTrigger className="mt-1">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="equalPrincipalAndInterest">等额本息</SelectItem>
                                          <SelectItem value="equalPrincipal">等额本金</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* 整体查看优化效果按钮 */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button
                  onClick={handleConfirmOptimization}
                  className="w-full bg-[#01BCD6] hover:bg-[#00A8BA] text-white font-medium"
                  disabled={expandedLoans.size === 0}
                >
                  查看整体优化效果
                </Button>
                {expandedLoans.size === 0 && (
                  <p className="text-xs text-gray-500 text-center mt-2">请至少录入一个贷款的优化方案</p>
                )}
              </div>
            </div>

            {/* 优化效果展示区域 */}
            {showOptimizationResult && (
              <div className="rounded-lg p-4 border" style={{ backgroundColor: 'rgba(202, 244, 247, 0.1)', borderColor: '#B3EBEF' }}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">优化方案评估</h3>
                
                {/* 可行性判断 */}
                <div className="mb-6">
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-base font-bold text-green-800">
                        优化后还款能力可行
                      </h4>
                    </div>
                    <p className="text-sm text-green-700">
                      此优化方案不会造成现金流缺口，您的财务规划不受影响。
                    </p>
                  </div>
                </div>

                {/* 优化前后对比 */}
                <div className="mb-6">
                  <h4 className="text-base font-semibold text-gray-800 mb-4">优化前后对比</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-sm text-gray-600">月供变化</div>
                      <div className="text-lg font-bold text-green-600">-0.45万元</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-sm text-gray-600">总利息变化</div>
                      <div className="text-lg font-bold text-green-600">-65.8万元</div>
                    </div>
                  </div>

                  {/* 债务优化效果统一展示 */}
                  <div className="rounded-lg p-4 border" style={{ backgroundColor: 'rgba(202, 244, 247, 0.1)', borderColor: '#B3EBEF' }}>
                    {/* 总计节省 */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-base font-medium text-gray-800">优化后节省利息总金额</span>
                      <span className="text-xl font-bold" style={{ color: '#01BCD6' }}>65.8万元</span>
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
                          data={calculateInterestComparison()}
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
                      <div className="p-3 rounded-lg border border-gray-200 mt-4" style={{ backgroundColor: 'rgba(202, 244, 247, 0.3)' }}>
                        <h4 className="font-medium text-gray-800 mb-2 text-sm">{selectedPoint.age}岁现金流详情</h4>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="text-center">
                            <div className="font-medium" style={{ color: '#01BCD6' }}>
                              {selectedPoint.afterOptimization >= 0 ? '盈余' : '缺口'}{Math.abs(selectedPoint.afterOptimization)}万元
                            </div>
                            <div className="text-gray-500">优化后</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-red-600">
                              {selectedPoint.beforeOptimization >= 0 ? '盈余' : '缺口'}{Math.abs(selectedPoint.beforeOptimization)}万元
                            </div>
                            <div className="text-gray-500">优化前</div>
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
                  
                  {/* 行动提示文案 */}
                  <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">接下来该怎么做？</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          评估通过后，建议立即落实优化方案。完成后请及时更新资产负债数据，我们将持续为您监测新的优化机会。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtOptimizationPage;