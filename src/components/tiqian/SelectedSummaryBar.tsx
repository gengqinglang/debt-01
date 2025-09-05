import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Settings, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface SelectedSummaryBarProps {
  selectedCount: number;
  totalCount: number;
  totalPrepaymentAmount: number;
  totalHandlingFee: number;
  onSelectDebts: () => void;
  // 单笔贷款快速编辑的新属性
  singleLoanData?: {
    id: string;
    type: string;
    category?: string;
    remainingPrincipal: number;
    prepaymentAmount: string;
    feeRate: string;
    repaymentMethod: string;
    onPrepaymentAmountChange: (value: string) => void;
    onFeeRateChange: (value: string) => void;
    onRepaymentMethodChange: (value: string) => void;
  };
}

export const SelectedSummaryBar: React.FC<SelectedSummaryBarProps> = ({
  selectedCount,
  totalCount,
  totalPrepaymentAmount,
  totalHandlingFee,
  onSelectDebts,
  singleLoanData
}) => {
  const isSingleLoan = totalCount === 1;
  const { toast } = useToast();

  // 获取贷款基本信息显示
  const getDisplayInfo = (category?: string) => {
    if (!singleLoanData) return { subtitle: '', amount: '0元', label: '' };
    
    const monthlyPayment = singleLoanData.remainingPrincipal * 0.045 / 12; // 简化计算
    switch (category) {
      case 'mortgage':
        return { subtitle: '房贷', amount: `${Math.round(monthlyPayment).toLocaleString()}元`, label: '月供' };
      case 'carLoan':
        return { subtitle: '车贷', amount: `${Math.round(monthlyPayment).toLocaleString()}元`, label: '每期还款' };
      case 'businessLoan':
        return { subtitle: '经营贷', amount: `${Math.round(monthlyPayment).toLocaleString()}元`, label: '每期利息' };
      case 'consumerLoan':
        return { subtitle: '消费贷', amount: `${Math.round(monthlyPayment).toLocaleString()}元`, label: '月供' };
      case 'privateLoan':
        return { subtitle: '民间贷', amount: `${(singleLoanData.remainingPrincipal / 10000).toFixed(1)}万元`, label: '本金' };
      case 'creditCard':
        return { subtitle: '信用卡', amount: `${(singleLoanData.remainingPrincipal / 10000).toFixed(1)}万元`, label: '本金' };
      default:
        return { subtitle: '', amount: '0元', label: '' };
    }
  };

  const displayInfo = getDisplayInfo(singleLoanData?.category);

  // 是否支持还款方式选择
  const supportsRepaymentSelect = ['mortgage', 'carLoan'].includes(singleLoanData?.category || '');

  return (
    <div>
      {/* 标题 - 在组件外面 */}
      <h4 className="text-base font-bold text-cyan-700 mb-4 flex items-center gap-2">
        <CheckSquare className="h-4 w-4" />
        {isSingleLoan ? '录入提前还款信息' : '选择要提前还款的债务'}
      </h4>
      
      <div 
        className="rounded-lg border p-4 mb-4 cursor-pointer" 
        style={{ backgroundColor: '#CAF4F733' }}
        onClick={!isSingleLoan ? onSelectDebts : undefined}
      >
        {/* 多笔贷款时显示选择按钮 */}
        {!isSingleLoan && (
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-foreground">
              <span>已选择 <span className="text-[#01BCD6]">{selectedCount}</span>/{totalCount} 笔债务</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectDebts}
              className="text-xs flex items-center gap-1"
            >
              <Settings className="h-3 w-3" />
              选择债务(可选多笔)
            </Button>
          </div>
        )}
        
        {/* 单笔贷款详细信息 */}
        {isSingleLoan && singleLoanData && (
          <div className="space-y-4">
            {/* 贷款基本信息展示 */}
            <div className="grid grid-cols-3 gap-8 items-center py-3 border-b border-white">
              <div className="text-center">
                <div className="text-base font-bold text-foreground mb-1">{singleLoanData.type}</div>
                <p className="text-xs text-muted-foreground">{displayInfo.subtitle}</p>
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-foreground mb-1">
                  {(singleLoanData.remainingPrincipal / 10000).toFixed(1)}万元
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

            {/* 提前还款输入区域 */}
            <div className="space-y-3">
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
                    placeholder={`最大可还${(singleLoanData.remainingPrincipal / 10000).toFixed(2)}万元`} 
                    value={singleLoanData.prepaymentAmount} 
                    onChange={(e) => {
                      const value = e.target.value;
                      const remainingPrincipal = singleLoanData.remainingPrincipal / 10000;
                      const prepaymentAmountValue = parseFloat(value);
                      if (value && prepaymentAmountValue > remainingPrincipal) {
                        toast({
                          title: '输入错误',
                          description: `提前还款金额不能超过剩余本金${remainingPrincipal.toFixed(2)}万元`,
                          variant: 'destructive'
                        });
                        return;
                      }
                      singleLoanData.onPrepaymentAmountChange(value);
                    }} 
                    className="h-8 text-xs border-gray-300 focus:border-[#01BCD6]" 
                  />
                </div>
               
                {/* 后续还款方式 */}
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">
                    后续还款方式 <span className="text-red-500">*</span>
                  </Label>
                  {supportsRepaymentSelect ? (
                    <Select 
                      value={singleLoanData.repaymentMethod || '期限不变，减少月供'} 
                      onValueChange={singleLoanData.onRepaymentMethodChange}
                    >
                      <SelectTrigger className="h-8 text-xs border-gray-300 focus:border-[#01BCD6] bg-white">
                        <SelectValue placeholder="请选择还款方式" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
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
                    value={singleLoanData.feeRate} 
                    onChange={(e) => singleLoanData.onFeeRateChange(e.target.value)} 
                    className="h-8 text-xs border-gray-300 focus:border-[#01BCD6]" 
                  />
                </div>
                
                {/* 手续费显示 */}
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">手续费(元)</Label>
                  <div className="h-8 px-2 py-1 rounded border border-gray-200 bg-gray-50 flex items-center text-xs text-gray-600">
                    {(() => {
                      const amount = singleLoanData.prepaymentAmount || '0';
                      const rate = singleLoanData.feeRate || '0';
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
            
          </div>
        )}
        
        {/* 多笔贷款汇总显示 */}
        {!isSingleLoan && selectedCount > 0 && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">提前还款总额：</span>
              <span className="font-medium text-[#01BCD6]">{totalPrepaymentAmount.toFixed(1)}万元</span>
            </div>
            <div>
              <span className="text-muted-foreground">手续费总计：</span>
              <span className="font-medium text-red-500">{Math.round(totalHandlingFee).toLocaleString()}元</span>
            </div>
          </div>
        )}
        
        {/* 无选择状态 */}
        {!isSingleLoan && selectedCount === 0 && (
          <div className="text-center text-muted-foreground text-sm py-2">
            请选择要提前还款的债务
          </div>
        )}
      </div>
    </div>
  );
};