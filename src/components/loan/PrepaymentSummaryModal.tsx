import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoanInfo } from '@/hooks/useLoanData';

interface PrepaymentSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanInfo;
  calculateCommercialMonthlyPayment: (loan: LoanInfo) => number;
  calculateProvidentMonthlyPayment: (loan: LoanInfo) => number;
  calculateCommercialLoanStats: (loan: LoanInfo) => any;
  calculateProvidentLoanStats: (loan: LoanInfo) => any;
  calculateLoanStats: (loan: LoanInfo) => any;
}

export const PrepaymentSummaryModal: React.FC<PrepaymentSummaryModalProps> = ({
  isOpen,
  onClose,
  loan,
  calculateCommercialMonthlyPayment,
  calculateProvidentMonthlyPayment,
  calculateCommercialLoanStats,
  calculateProvidentLoanStats,
  calculateLoanStats
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLoanForPrepayment, setSelectedLoanForPrepayment] = useState<'commercial' | 'provident' | null>(null);
  const [showLoanSelection, setShowLoanSelection] = useState(true);

  const stats = calculateLoanStats(loan);
  const commercialStats = calculateCommercialLoanStats(loan);
  const providentStats = calculateProvidentLoanStats(loan);

  const onToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>贷款概要</DialogTitle>
        </DialogHeader>
        
        <div className="mx-2">
          <div className="flex items-center justify-between mb-3 mt-4">
            <div className="flex items-center">
              <span className="text-base font-semibold text-gray-900">
                {loan.propertyName || '房产信息'}
                {loan.loanType === 'combination' && selectedLoanForPrepayment && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({selectedLoanForPrepayment === 'commercial' ? '商业贷款' : '公积金贷款'})
                  </span>
                )}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onToggleExpand}
              className="h-8 px-3 text-xs flex items-center gap-1"
              style={{ color: '#01BCD6' }}
            >
              修改贷款信息
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </div>

          {/* 组合贷款选择界面 */}
          {showLoanSelection && loan.loanType === 'combination' && !isExpanded && (
            <div className="mt-4">
              <div className="rounded-lg border border-gray-200 p-4 bg-white">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">选择要提前还款的贷款</h4>
                <div className="space-y-3">
                  <div 
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedLoanForPrepayment === 'commercial' 
                        ? 'border-[#01BCD6] bg-[#F8FFFE]' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => { 
                      setSelectedLoanForPrepayment('commercial');
                      window.dispatchEvent(new CustomEvent('prepayment_subloan_selected', { detail: { loanId: loan.id, selected: 'commercial' } }));
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">商业贷款</h5>
                        <p className="text-xs text-gray-500 mt-1">
                          剩余本金：{loan.commercialRemainingPrincipal ? `${(parseFloat(loan.commercialRemainingPrincipal) / 10000).toFixed(1)}万元` : '0万元'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold" style={{ color: '#01BCD6' }}>
                          ¥{calculateCommercialMonthlyPayment(loan).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">月供</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 商业贷款选中后的进度展示 */}
                  {selectedLoanForPrepayment === 'commercial' && (
                    <div className="rounded-lg py-4 px-3 bg-[#CAF4F7]/30">
                      <div className="space-y-4">
                        {/* 贷款基本信息展示 */}
                        <div className="grid grid-cols-3 gap-3 border-b border-white pb-3">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">原始贷款本金</div>
                            <div className="text-sm font-bold text-gray-900">
                              {loan.commercialLoanAmount || '未设置'}万元
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">利率</div>
                            <div className="text-sm font-bold text-gray-900">
                              {loan.commercialRateType === 'fixed' ? `${loan.commercialFixedRate || '未设置'}%` : `LPR${loan.commercialFloatingRateAdjustment || '+0'}BP`}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">月供</div>
                            <div className="text-sm font-bold text-gray-900">
                              {`${Math.round(calculateCommercialMonthlyPayment(loan)).toLocaleString()}元`}
                            </div>
                          </div>
                        </div>
                        {/* 时间进度 */}
                        <div>
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">已还时间</div>
                              <div className="text-sm font-semibold text-gray-900">
                                {commercialStats?.paidMonths || 0}个月
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">剩余时间</div>
                              <div className="text-sm font-semibold text-gray-900">
                                {(commercialStats?.totalMonths || 0) - (commercialStats?.paidMonths || 0)}个月
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">进度</div>
                              <div className="text-sm font-semibold" style={{ color: '#01BCD6' }}>
                                {commercialStats?.timeProgress?.toFixed(1) || '0.0'}%
                              </div>
                            </div>
                          </div>
                          <Progress value={commercialStats?.timeProgress || 0} className="h-2" />
                        </div>

                        {/* 本金进度 */}
                        <div>
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">已还本金</div>
                              <div className="text-sm font-semibold text-gray-900">
                                {((commercialStats?.paidPrincipal || 0) / 10000).toFixed(1)}万元
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">待还本金</div>
                              <div className="text-sm font-semibold text-gray-900">
                                {(((commercialStats?.totalPrincipal || 0) - (commercialStats?.paidPrincipal || 0)) / 10000).toFixed(1)}万元
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">进度</div>
                              <div className="text-sm font-semibold" style={{ color: '#01BCD6' }}>
                                {commercialStats?.principalProgress?.toFixed(1) || '0.0'}%
                              </div>
                            </div>
                          </div>
                          <Progress value={commercialStats?.principalProgress || 0} className="h-2" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedLoanForPrepayment === 'provident' 
                        ? 'border-[#01BCD6] bg-[#F8FFFE]' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => { 
                      setSelectedLoanForPrepayment('provident');
                      window.dispatchEvent(new CustomEvent('prepayment_subloan_selected', { detail: { loanId: loan.id, selected: 'provident' } }));
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">公积金贷款</h5>
                        <p className="text-xs text-gray-500 mt-1">
                          剩余本金：{loan.providentRemainingPrincipal ? `${(parseFloat(loan.providentRemainingPrincipal) / 10000).toFixed(1)}万元` : '0万元'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold" style={{ color: '#01BCD6' }}>
                          ¥{calculateProvidentMonthlyPayment(loan).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">月供</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 公积金贷款选中后的进度展示 */}
                  {selectedLoanForPrepayment === 'provident' && (
                    <div className="rounded-lg py-4 px-3 bg-[#CAF4F7]/30">
                      <div className="space-y-4">
                        {/* 贷款基本信息展示 */}
                        <div className="grid grid-cols-3 gap-3 border-b border-white pb-3">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">原始贷款本金</div>
                            <div className="text-sm font-bold text-gray-900">
                              {loan.providentLoanAmount || '未设置'}万元
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">利率</div>
                            <div className="text-sm font-bold text-gray-900">
                              {`${loan.providentRate || '未设置'}%`}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">月供</div>
                            <div className="text-sm font-bold text-gray-900">
                              {`${Math.round(calculateProvidentMonthlyPayment(loan)).toLocaleString()}元`}
                            </div>
                          </div>
                        </div>
                        {/* 时间进度 */}
                        <div>
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">已还时间</div>
                              <div className="text-sm font-semibold text-gray-900">
                                {providentStats?.paidMonths || 0}个月
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">剩余时间</div>
                              <div className="text-sm font-semibold text-gray-900">
                                {(providentStats?.totalMonths || 0) - (providentStats?.paidMonths || 0)}个月
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">进度</div>
                              <div className="text-sm font-semibold" style={{ color: '#01BCD6' }}>
                                {providentStats?.timeProgress?.toFixed(1) || '0.0'}%
                              </div>
                            </div>
                          </div>
                          <Progress value={providentStats?.timeProgress || 0} className="h-2" />
                        </div>

                        {/* 本金进度 */}
                        <div>
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">已还本金</div>
                              <div className="text-sm font-semibold text-gray-900">
                                {((providentStats?.paidPrincipal || 0) / 10000).toFixed(1)}万元
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">待还本金</div>
                              <div className="text-sm font-semibold text-gray-900">
                                {(((providentStats?.totalPrincipal || 0) - (providentStats?.paidPrincipal || 0)) / 10000).toFixed(1)}万元
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">进度</div>
                              <div className="text-sm font-semibold" style={{ color: '#01BCD6' }}>
                                {providentStats?.principalProgress?.toFixed(1) || '0.0'}%
                              </div>
                            </div>
                          </div>
                          <Progress value={providentStats?.principalProgress || 0} className="h-2" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* 还款进度展示 - 仅对非组合贷款显示，组合贷款的进度已在选择界面中显示 */}
          <div className="space-y-3">
            {loan.loanType !== 'combination' && stats && (
              <div className="rounded-lg py-4 px-3 bg-[#CAF4F7]/30">
                <div className="space-y-4">
                  {/* 贷款基本信息展示 */}
                  <div className="grid grid-cols-3 gap-3 border-b border-white pb-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">原始贷款本金</div>
                      <div className="text-sm font-bold text-gray-900">
                        {loan.loanAmount || '未设置'}万元
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">利率</div>
                      <div className="text-sm font-bold text-gray-900">
                        {loan.rateType === 'fixed' ? `${loan.fixedRate || '未设置'}%` : `LPR${loan.floatingRateAdjustment || '+0'}BP`}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">月供</div>
                      <div className="text-sm font-bold text-gray-900">
                        {stats?.currentMonthlyPayment ? `${Math.round(stats.currentMonthlyPayment).toLocaleString()}元` : '计算中...'}
                      </div>
                    </div>
                  </div>
                  {/* 时间进度 */}
                  <div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">已还时间</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {stats?.paidMonths || 0}个月
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">剩余时间</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {(stats?.totalMonths || 0) - (stats?.paidMonths || 0)}个月
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">进度</div>
                        <div className="text-sm font-semibold" style={{ color: '#01BCD6' }}>
                          {stats?.timeProgress?.toFixed(1) || '0.0'}%
                        </div>
                      </div>
                    </div>
                    <Progress value={stats?.timeProgress || 0} className="h-2" />
                  </div>

                  {/* 本金进度 */}
                  <div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">已还本金</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {((stats?.paidPrincipal || 0) / 10000).toFixed(1)}万元
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">待还本金</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {(((stats?.totalPrincipal || 0) - (stats?.paidPrincipal || 0)) / 10000).toFixed(1)}万元
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">进度</div>
                        <div className="text-sm font-semibold" style={{ color: '#01BCD6' }}>
                          {stats?.principalProgress?.toFixed(1) || '0.0'}%
                        </div>
                      </div>
                    </div>
                    <Progress value={stats?.principalProgress || 0} className="h-2" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};