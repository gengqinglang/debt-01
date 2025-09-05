import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DebtItem {
  id: string;
  name?: string; // 用户录入的贷款名称
  type: string;
  category?: string; // Add category field to distinguish debt types
  loanType?: string; // Add loan type for mortgage/car loan subtypes
  remainingPrincipal: number;
  borrower: string;
  term: number;
  interestRate: number;
  interestRateCommercial?: number;
  interestRatePublic?: number;
  repaymentMethod: string;
  totalAmount: number;
  paidPrincipal: number;
  paidInterest: number;
  remainingInterest: number;
  monthsPaid?: number;
  remainingMonths?: number;
}

interface LoanSelectorDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  debtData: DebtItem[];
  selectedLoanIds: string[];
  setSelectedLoanIds: (ids: string[]) => void;
  loanPrepaymentAmounts: { [key: string]: string };
  setLoanPrepaymentAmounts: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  loanFeeRates: { [key: string]: string };
  setLoanFeeRates: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  loanRepaymentMethods: { [key: string]: string };
  setLoanRepaymentMethods: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  getTotalPrepaymentAmount: () => number;
  getTotalHandlingFee: () => number;
}

export const LoanSelectorDrawer: React.FC<LoanSelectorDrawerProps> = ({
  isOpen,
  onOpenChange,
  debtData,
  selectedLoanIds,
  setSelectedLoanIds,
  loanPrepaymentAmounts,
  setLoanPrepaymentAmounts,
  loanFeeRates,
  setLoanFeeRates,
  loanRepaymentMethods,
  setLoanRepaymentMethods,
  getTotalPrepaymentAmount,
  getTotalHandlingFee
}) => {
  const { toast } = useToast();

  const getLoanTypeTag = (debt: DebtItem) => {
    switch (debt.category) {
      case 'mortgage':
        return '房贷';
      case 'carLoan':
        return '车贷';
      case 'businessLoan':
        return '经营贷';
      case 'consumerLoan':
        return '消费贷';
      case 'privateLoan':
        return '民间贷';
      case 'creditCard':
        return '信用卡';
      default:
        return debt.type || '其他';
    }
  };

  const getDisplayInfo = (debt: DebtItem) => {
    const monthlyPayment = debt.totalAmount * (debt.interestRate / 100 / 12);
    switch (debt.category) {
      case 'mortgage':
        return { subtitle: '房贷', amount: `${Math.round(monthlyPayment).toLocaleString()}元`, label: '月供' };
      case 'carLoan':
        return { subtitle: '车贷', amount: `${Math.round(monthlyPayment).toLocaleString()}元`, label: '每期还款' };
      case 'businessLoan':
        return { subtitle: '经营贷', amount: `${Math.round(monthlyPayment).toLocaleString()}元`, label: '每期利息' };
      case 'consumerLoan':
        return { subtitle: '消费贷', amount: `${Math.round(monthlyPayment).toLocaleString()}元`, label: '月供' };
      case 'privateLoan':
        return { subtitle: '民间贷', amount: `${(debt.remainingPrincipal / 10000).toFixed(1)}万元`, label: '本金' };
      case 'creditCard':
        return { subtitle: '信用卡', amount: `${(debt.remainingPrincipal / 10000).toFixed(1)}万元`, label: '本金' };
      default:
        return { subtitle: '', amount: '0元', label: '' };
    }
  };

  const handleSelectAll = () => {
    if (selectedLoanIds.length === debtData.length) {
      setSelectedLoanIds([]);
    } else {
      setSelectedLoanIds(debtData.map(debt => debt.id));
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[95vh] max-h-[95vh] max-w-md mx-auto rounded-t-2xl">
        <DrawerHeader className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-lg font-semibold">选择要提前还款的债务</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs"
            >
              {selectedLoanIds.length === debtData.length ? '取消全选' : '全选'}
            </Button>
            <span className="text-sm text-muted-foreground">
              已选择 {selectedLoanIds.length}/{debtData.length} 笔
            </span>
          </div>
        </DrawerHeader>
        
        {/* 可滚动的贷款列表 */}
        <div className="flex-1 overflow-auto px-4 pb-20">
          <div className="space-y-3 py-4">
            {debtData.filter(debt => debt.category !== 'creditCard').map(debt => {
              const displayInfo = getDisplayInfo(debt);
              const loanTypeTag = getLoanTypeTag(debt);
              
              return (
                <div 
                  key={debt.id} 
                  className={`p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors relative ${
                    selectedLoanIds.includes(debt.id) ? 'border-[#01BCD6]' : 'border-border'
                  }`} 
                  style={{
                    backgroundColor: selectedLoanIds.includes(debt.id) ? 'rgba(202, 244, 247, 0.3)' : undefined
                  }} 
                  onClick={() => {
                    const isSelected = selectedLoanIds.includes(debt.id);
                    if (isSelected) {
                      setSelectedLoanIds(selectedLoanIds.filter(id => id !== debt.id));
                    } else {
                      setSelectedLoanIds([...selectedLoanIds, debt.id]);
                    }
                  }}
                >
                  
                  {selectedLoanIds.includes(debt.id) && (
                    <div className="absolute -top-2 right-2 bg-[#01BCD6] text-white text-xs px-2 py-1 rounded">
                      测算中
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 pt-2">
                    {/* 左侧勾选框 */}
                    <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedLoanIds.includes(debt.id)} 
                        onCheckedChange={checked => {
                          if (checked) {
                            setSelectedLoanIds([...selectedLoanIds, debt.id]);
                          } else {
                            setSelectedLoanIds(selectedLoanIds.filter(id => id !== debt.id));
                          }
                        }}
                        className="w-5 h-5 rounded-full border-2 border-gray-300 data-[state=checked]:bg-[#01BCD6] data-[state=checked]:border-[#01BCD6] data-[state=checked]:text-white" 
                      />
                    </div>
                    
                    {/* 右侧贷款信息 */}
                    <div className="flex-1 grid grid-cols-3 gap-8 items-center">
                      <div className="text-center">
                        <div className="text-base font-bold text-foreground mb-1">{debt.name || debt.type}</div>
                        <p className="text-xs text-muted-foreground">{displayInfo.subtitle}</p>
                      </div>
                      <div className="text-center">
                        <div className="text-base font-bold text-foreground mb-1">
                          {(debt.remainingPrincipal / 10000).toFixed(1)}万元
                        </div>
                        <div className="text-xs text-muted-foreground">剩余本金</div>
                      </div>
                      <div className="text-center">
                        <div className="text-base font-bold mb-1" style={{ color: '#01BCD6' }}>
                          {displayInfo.amount}
                        </div>
                        <div className="text-xs text-muted-foreground">{displayInfo.label}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 提前还款输入区域 - 仅在被选中时显示 */}
                  {selectedLoanIds.includes(debt.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3" onClick={e => e.stopPropagation()}>
                      {/* 第一行：提前还款金额、后续还款方式 */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* 还款金额输入 */}
                        <div>
                          <Label className="text-xs text-gray-600 mb-1 block">
                            录入提前还款金额(万元) <span className="text-red-500">*</span>
                          </Label>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder={`最大可还${(debt.remainingPrincipal / 10000).toFixed(2)}万元`} 
                            value={loanPrepaymentAmounts[debt.id] || ''} 
                            onChange={e => {
                              const value = e.target.value;
                              const remainingPrincipal = debt.remainingPrincipal / 10000;
                              const prepaymentAmountValue = parseFloat(value);
                              if (value && prepaymentAmountValue > remainingPrincipal) {
                                toast({
                                  title: '输入错误',
                                  description: `提前还款金额不能超过剩余本金${remainingPrincipal.toFixed(2)}万元`,
                                  variant: 'destructive'
                                });
                                return;
                              }
                              setLoanPrepaymentAmounts(prev => ({
                                ...prev,
                                [debt.id]: value
                              }));
                            }} 
                            className="h-8 text-xs border-gray-300 focus:border-[#01BCD6]" 
                          />
                        </div>
                       
                        {/* 后续还款方式 */}
                        <div>
                          <Label className="text-xs text-gray-600 mb-1 block">
                            后续还款方式 <span className="text-red-500">*</span>
                          </Label>
                          {(debt.category === 'mortgage' || debt.category === 'carLoan') ? (
                            <Select 
                              value={loanRepaymentMethods[debt.id] || '期限不变，减少月供'} 
                              onValueChange={value => setLoanRepaymentMethods(prev => ({
                                ...prev,
                                [debt.id]: value
                              }))}
                            >
                              <SelectTrigger className="h-8 text-xs border-gray-300 focus:border-[#01BCD6] bg-white z-50">
                                <SelectValue placeholder="请选择还款方式" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                <SelectItem value="期限不变，减少月供">期限不变，减少月供</SelectItem>
                                <SelectItem value="月供不变，缩短期限">月供不变，缩短期限</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="h-8 px-2 py-1 rounded border border-gray-200 bg-gray-50 flex items-center text-xs text-gray-600">
                              一次性结清
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* 第二行：费率、手续费 */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* 费率输入 */}
                        <div>
                          <Label className="text-xs text-gray-600 mb-1 block">
                            费率(%) <span className="text-red-500">*</span>
                          </Label>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0" 
                            value={loanFeeRates[debt.id] || ''} 
                            onChange={e => setLoanFeeRates(prev => ({
                              ...prev,
                              [debt.id]: e.target.value
                            }))} 
                            className="h-8 text-xs border-gray-300 focus:border-[#01BCD6]" 
                          />
                        </div>
                        
                        {/* 手续费显示 */}
                        <div>
                          <Label className="text-xs text-gray-600 mb-1 block">手续费(元)</Label>
                          <div className="h-8 px-2 py-1 rounded border border-gray-200 bg-gray-50 flex items-center text-xs text-gray-600">
                            {(() => {
                              const amount = loanPrepaymentAmounts[debt.id] || '0';
                              const rate = loanFeeRates[debt.id] || '0';
                              const prepaymentAmountValue = parseFloat(amount) * 10000;
                              const feeRateValue = parseFloat(rate) / 100;
                              if (!isNaN(prepaymentAmountValue) && !isNaN(feeRateValue)) {
                                const prepaymentFee = prepaymentAmountValue * feeRateValue;
                                return `${Math.round(prepaymentFee)}元`;
                              }
                              return '0元';
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部固定操作栏 */}
        <div className="flex-shrink-0 bg-white border-t px-4 py-3 pb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm">
              <span className="text-muted-foreground">已选择 </span>
              <span className="font-medium text-[#01BCD6]">{selectedLoanIds.length}</span>
              <span className="text-muted-foreground"> 笔债务</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">提前还款 </span>
              <span className="font-medium text-[#01BCD6]">{getTotalPrepaymentAmount().toFixed(1)}万元</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm">
              <span className="text-muted-foreground">手续费 </span>
              <span className="font-medium text-red-500">{Math.round(getTotalHandlingFee()).toLocaleString()}元</span>
            </div>
          </div>
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full bg-[#01BCD6] hover:bg-[#01BCD6]/90 text-white"
            disabled={selectedLoanIds.length === 0}
          >
            完成选择，查看测算结果
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};