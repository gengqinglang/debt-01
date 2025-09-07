import React, { useRef, useEffect } from 'react';
import { Home, ChevronDown, ChevronUp, Trash2, Percent, TrendingUp, Calculator } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LoanInfo } from '@/hooks/useLoanData';
import { useToast } from '@/hooks/use-toast';

interface LoanFormCardProps {
  loan: LoanInfo;
  index: number;
  updateLoan: (id: string, field: keyof LoanInfo, value: string) => void;
  removeLoan: (id: string) => void;
  loansLength: number;
  calculateLoanStats: (loan: LoanInfo) => any;
  isLoanComplete: (loan: LoanInfo) => boolean;
  calculateMonthlyPayment: (loan: LoanInfo) => number;
  currentLPR_5Year: number;
  currentLPR_5YearPlus: number;
  isCommercialLoanComplete: (loan: LoanInfo) => boolean;
  isProvidentLoanComplete: (loan: LoanInfo) => boolean;
  calculateCommercialMonthlyPayment: (loan: LoanInfo) => number;
  calculateProvidentMonthlyPayment: (loan: LoanInfo) => number;
  calculateCommercialLoanStats: (loan: LoanInfo) => any;
  calculateProvidentLoanStats: (loan: LoanInfo) => any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onCollapse: () => void;
}

export const LoanFormCard: React.FC<LoanFormCardProps> = ({ 
  loan, 
  index, 
  updateLoan, 
  removeLoan, 
  loansLength,
  calculateLoanStats,
  isLoanComplete,
  calculateMonthlyPayment,
  currentLPR_5Year,
  currentLPR_5YearPlus,
  isCommercialLoanComplete,
  isProvidentLoanComplete,
  calculateCommercialMonthlyPayment,
  calculateProvidentMonthlyPayment,
  calculateCommercialLoanStats,
  calculateProvidentLoanStats,
  isExpanded,
  onToggleExpand,
  onCollapse
}) => {
  const renderRef = useRef(0)
  useEffect(() => {
    console.log('[LoanFormCard] mounted', loan.id)
    return () => console.log('[LoanFormCard] unmounted', loan.id)
  }, [loan.id])
  useEffect(() => {
    renderRef.current += 1
    console.log('[LoanFormCard] render', loan.id, 'count', renderRef.current)
  })

  const { toast } = useToast();
  const stats = calculateLoanStats(loan);
  const commercialStats = calculateCommercialLoanStats(loan);
  const providentStats = calculateProvidentLoanStats(loan);

  // 处理确认按钮点击
  const handleConfirmClick = () => {
    if (loan.loanType === 'combination') {
      if (isCommercialLoanComplete(loan) && isProvidentLoanComplete(loan)) {
        // 不再自动折叠卡片，保持展开状态
        toast({
          title: "房贷信息已确认",
          description: "组合贷款信息录入完成",
        });
      } else {
        toast({
          title: "请完善贷款信息",
          description: "请填写完整的商贷和公积金贷款信息",
          variant: "destructive"
        });
      }
    } else {
      if (isLoanComplete(loan)) {
        // 不再自动折叠卡片，保持展开状态
        toast({
          title: "房贷信息已确认",
          description: "贷款信息录入完成",
        });
      } else {
        toast({
          title: "请完善贷款信息", 
          description: "请填写完整的贷款信息",
          variant: "destructive"
        });
      }
    }
  };

  // 计算还款进度
  const getRepaymentProgress = (loanStats: any) => {
    if (!loanStats) return { timeProgress: 0, principalProgress: 0 };
    
    const timeProgress = Math.round(((loanStats.totalMonths - loanStats.remainingMonths) / loanStats.totalMonths) * 100);
    const principalProgress = Math.round(((parseFloat(loanStats.originalAmount) - parseFloat(loanStats.remainingPrincipal)) / parseFloat(loanStats.originalAmount)) * 100);
    
    return { timeProgress, principalProgress };
  };

  const renderCollapsedProgress = () => {
    if (loan.loanType === 'combination') {
      const commercialProgress = getRepaymentProgress(commercialStats);
      const providentProgress = getRepaymentProgress(providentStats);
      
      if (!isCommercialLoanComplete(loan) && !isProvidentLoanComplete(loan)) {
        return <span className="text-sm text-gray-500">请完善贷款信息</span>;
      }
      
      return (
        <div className="space-y-2 text-xs">
          {isCommercialLoanComplete(loan) && (
            <div className="flex items-center space-x-4">
              <span style={{ color: '#01BCD6' }}>商贷:</span>
              <span>还款时间进度 {commercialProgress.timeProgress}%</span>
              <span>本金还款进度 {commercialProgress.principalProgress}%</span>
            </div>
          )}
          {isProvidentLoanComplete(loan) && (
            <div className="flex items-center space-x-4">
              <span style={{ color: '#2563EB' }}>公积金:</span>
              <span>还款时间进度 {providentProgress.timeProgress}%</span>
              <span>本金还款进度 {providentProgress.principalProgress}%</span>
            </div>
          )}
        </div>
      );
    } else {
      if (!isLoanComplete(loan)) {
        return <span className="text-sm text-gray-500">请完善贷款信息</span>;
      }
      
      const progress = getRepaymentProgress(stats);
      return (
        <div className="flex items-center space-x-4 text-xs">
          <span>还款时间进度 {progress.timeProgress}%</span>
          <span>本金还款进度 {progress.principalProgress}%</span>
        </div>
      );
    }
  };

  return (
    <Card className="relative">
      <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
        <CardHeader className="pb-1 pt-3">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="mobile" className="p-0 h-auto justify-start flex-1">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Home className="h-4 w-4" style={{ color: '#01BCD6' }} />
                  <span>房贷信息录入</span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 ml-2" style={{ color: '#01BCD6' }} />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-2" style={{ color: '#01BCD6' }} />
                  )}
                </CardTitle>
              </Button>
            </CollapsibleTrigger>
            {loansLength > 1 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="mobile"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[320px] mx-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-base">确认删除</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                      确定要删除这笔房贷信息吗？删除后无法恢复。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-row justify-end gap-2">
                    <AlertDialogCancel className="mt-0">取消</AlertDialogCancel>
                    <AlertDialogAction onClick={() => removeLoan(loan.id)}>
                      确认删除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          
          {/* 折叠时显示的进度摘要 */}
          {!isExpanded && (
            <div className="mt-2 px-0">
              {renderCollapsedProgress()}
              
              {/* 只有在贷款信息完整时才显示提前还款试算模块 */}
              {isLoanComplete(loan) && (
                <div className="mt-4 space-y-4">
                  <div className="rounded-lg p-3" style={{ backgroundColor: '#F8FFFE', borderColor: '#CAF4F7', border: '1px solid' }}>
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {loan.propertyName || '未命名房产'} - {loan.loanType === 'commercial' ? '商业贷款' : loan.loanType === 'provident' ? '公积金贷款' : '组合贷款'}
                    </div>
                     <div className="text-xs text-gray-500">
                       原始贷款金额：{loan.loanAmount}万元 | 剩余本金：{(loan.remainingPrincipal)}万元
                     </div>
                  </div>
                  
                  {/* 组合贷款子贷款选择 */}
                  {loan.loanType === 'combination' && (
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">
                        选择还款方式 <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup 
                        value={''} 
                        onValueChange={(value: 'commercial' | 'provident') => {
                          // TODO: 实现选择逻辑
                        }}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="commercial" id={`single-commercial-${loan.id}`} />
                          <Label htmlFor={`single-commercial-${loan.id}`} className="text-xs">
                            提前还商业贷款
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="provident" id={`single-provident-${loan.id}`} />
                          <Label htmlFor={`single-provident-${loan.id}`} className="text-xs">
                            提前还公积金贷款
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                  
                   {/* 提前还款信息录入 */}
                   <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-3">
                       <div className="space-y-2">
                         <Label className="text-xs font-medium">
                           提前还款金额(万元) <span className="text-red-500">*</span>
                         </Label>
                         <Input
                           type="number"
                           step="0.01"
                           placeholder="如：50"
                           value={''}
                           onChange={(e) => {
                             // TODO: 实现输入逻辑
                           }}
                           className="text-sm h-9"
                         />
                       </div>
                       <div className="space-y-2">
                         <Label className="text-xs font-medium">
                           费率(%) <span className="text-red-500">*</span>
                         </Label>
                         <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="如：0.5"
                              value={'0'}
                              onChange={(e) => {
                                // TODO: 实现输入逻辑
                              }}
                              className="pr-8 text-sm h-9"
                            />
                            <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                         </div>
                       </div>
                     </div>
                     
                     {/* 提前还款费用显示 */}
                     <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                       <div className="flex items-center justify-between">
                         <span className="text-xs text-gray-600">提前还款费用</span>
                         <span className="text-sm font-medium" style={{ color: '#FF6B6B' }}>
                           0元
                         </span>
                       </div>
                     </div>
                   </div>

                  {/* 提前还款效果分析 */}
                  <div className="mt-6 p-6 bg-gray-100/60 rounded-xl space-y-6 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#CAF4F7' }}>
                        <Calculator className="w-4 h-4" style={{ color: '#01BCD6' }} />
                      </div>
                      <h4 className="text-base font-semibold text-gray-800">提前还款效果分析</h4>
                    </div>

                    {/* 方式一：按照原期限继续还 */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#01BCD6' }}>1</span>
                        方式一：按照原期限继续还（减少月供）
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                           <span className="text-xs font-medium block mb-1 text-gray-600">节省总成本</span>
                           <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                             0万元
                           </div>
                        </div>
                        <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                          <span className="text-xs font-medium block mb-1 text-gray-600">下期月供</span>
                          <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                            0元
                          </div>
                        </div>
                        <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                          <span className="text-xs font-medium block mb-1 text-gray-600">下期月供变化</span>
                          <div className="text-base font-bold" style={{ color: '#9CA3AF' }}>
                            0元
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 分隔线 */}
                    <div className="border-t border-gray-300"></div>

                    {/* 方式二：按照原月供继续还 */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#01BCD6' }}>2</span>
                        方式二：按照原月供继续还(缩短期限)
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                           <span className="text-xs font-medium block mb-1 text-gray-600">节省总成本</span>
                           <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                             0万元
                           </div>
                        </div>
                        <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                          <span className="text-xs font-medium block mb-1 text-gray-600">下期月供</span>
                          <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                            0元
                          </div>
                        </div>
                        <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                          <span className="text-xs font-medium block mb-1 text-gray-600">下期月供变化</span>
                          <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                            0元
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 分隔线 */}
                    <div className="border-t border-gray-300"></div>

                    {/* 方式三：自定义月供 */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#01BCD6' }}>3</span>
                        方式三：自定义月供
                      </h5>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">
                            设定月供金额(元) <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            placeholder="如：5000"
                            value={''}
                            onChange={(e) => {
                              // TODO: 实现输入逻辑
                            }}
                            className="text-sm h-9"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                            <span className="text-xs font-medium block mb-1 text-gray-600">节省总成本</span>
                            <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                              0万元
                            </div>
                          </div>
                          <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                            <span className="text-xs font-medium block mb-1 text-gray-600">还款期限</span>
                            <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                              0个月
                            </div>
                          </div>
                          <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                            <span className="text-xs font-medium block mb-1 text-gray-600">提前几个月</span>
                            <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                              0个月
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 投资收益对比部分 */}
                  <div className="mt-6 p-6 bg-gray-100/60 rounded-xl space-y-6 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#CAF4F7' }}>
                        <TrendingUp className="w-4 h-4" style={{ color: '#01BCD6' }} />
                      </div>
                      <h4 className="text-base font-semibold text-gray-800">投资收益对比</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600">
                        将提前还款金额用于投资的收益对比分析
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4 px-4 py-3">
            {/* ... keep existing code (loan form content) */}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};