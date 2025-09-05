import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { CalendarIcon, Trash2, Percent, Calculator, TrendingUp, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { CarLoanInfo } from '@/hooks/useCarLoanData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface CarLoanCardProps {
  carLoan: CarLoanInfo;
  index: number;
  updateCarLoan: (id: string, field: keyof CarLoanInfo, value: string) => void;
  removeCarLoan: (id: string) => void;
  carLoansLength: number;
  activePrepayCarloanId?: string | null;
  setActivePrepayCarloanId?: (id: string | null) => void;
  isCarLoanComplete: (carLoan: any) => boolean;
}

const CarLoanCard: React.FC<CarLoanCardProps> = ({
  carLoan,
  index,
  updateCarLoan,
  removeCarLoan,
  carLoansLength,
  activePrepayCarloanId,
  setActivePrepayCarloanId,
  isCarLoanComplete: isCarLoanCompleteFromProps
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const showPrepaymentPanel = activePrepayCarloanId === carLoan.id;
  const [prepaymentAmount, setPrepaymentAmount] = useState('');
  const [prepaymentFeeRate, setPrepaymentFeeRate] = useState('0');
  const [customMonthlyPayment, setCustomMonthlyPayment] = useState('');
  
  const calculateCarLoanMonthlyPayment = (loan: CarLoanInfo) => {
    const principalAmount = parseFloat(loan.remainingPrincipal || loan.principal || '0') * 10000; // 万元转元
    const annual = parseFloat(loan.interestRate || '0') / 100;
    const r = annual / 12;
    let months = 0;
    if (loan.startDateMonth && loan.endDateMonth) {
      const [sy, sm] = loan.startDateMonth.split('-').map(Number);
      const [ey, em] = loan.endDateMonth.split('-').map(Number);
      months = (ey - sy) * 12 + (em - sm);
    } else if (loan.term) {
      months = parseFloat(loan.term || '0') * 12;
    }
    if (principalAmount <= 0 || r <= 0 || months <= 0) return 0;
    const method = (loan as any).repaymentMethod || 'equal-payment';
    if (method === 'equal-principal') {
      return principalAmount / months + principalAmount * r;
    }
    return principalAmount * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  };
  
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // 检查贷款是否完整
  const isCarLoanComplete = (loan: CarLoanInfo) => {
    if (loan.loanType === 'installment') {
      return !!(loan.vehicleName?.trim() && loan.installmentAmount?.trim() && loan.remainingInstallments?.trim());
    } else {
      return !!(loan.vehicleName?.trim() && loan.principal?.trim() && loan.remainingPrincipal?.trim() && 
               loan.startDateMonth && loan.endDateMonth && loan.repaymentMethod && loan.interestRate?.trim());
    }
  };

  // 计算贷款统计信息
  const calculateLoanStats = () => {
    if (!isCarLoanComplete(carLoan)) return null;
    
    if (carLoan.loanType === 'bankLoan') {
      const principal = parseFloat(carLoan.principal || '0') * 10000;
      const remainingPrincipal = parseFloat(carLoan.remainingPrincipal || '0') * 10000;
      const rate = parseFloat(carLoan.interestRate || '0') / 100;
      
      // 计算总期数和已还期数
      let totalMonths = 0;
      let paidMonths = 0;
      
      if (carLoan.startDateMonth && carLoan.endDateMonth) {
        const [sy, sm] = carLoan.startDateMonth.split('-').map(Number);
        const [ey, em] = carLoan.endDateMonth.split('-').map(Number);
        totalMonths = (ey - sy) * 12 + (em - sm);
        
        const now = new Date();
        const currentMonths = (now.getFullYear() - sy) * 12 + (now.getMonth() + 1 - sm);
        paidMonths = Math.max(0, Math.min(totalMonths, currentMonths));
      }
      
      const timeProgress = totalMonths > 0 ? (paidMonths / totalMonths) * 100 : 0;
      const paidPrincipal = principal - remainingPrincipal;
      const principalProgress = principal > 0 ? (paidPrincipal / principal) * 100 : 0;
      
      return {
        totalMonths,
        paidMonths,
        timeProgress,
        totalPrincipal: principal,
        paidPrincipal,
        principalProgress,
        currentMonthlyPayment: calculateCarLoanMonthlyPayment(carLoan)
      };
    }
    
    return null;
  };

  const stats = calculateLoanStats();

  // 提前还款计算函数
  const calculatePrepaymentEffect = (amount: number, method: 'reduce-payment' | 'shorten-term' | 'custom') => {
    if (!stats || !amount || carLoan.loanType !== 'bankLoan') return null;
    
    const principal = parseFloat(carLoan.remainingPrincipal || '0') * 10000;
    const rate = parseFloat(carLoan.interestRate || '0') / 100 / 12;
    const remainingMonths = stats.totalMonths - stats.paidMonths;
    const currentPayment = stats.currentMonthlyPayment;
    
    if (amount * 10000 >= principal) return null; // 不能超过剩余本金
    
    const newPrincipal = principal - amount * 10000;
    const feeAmount = amount * 10000 * (parseFloat(prepaymentFeeRate) / 100);
    
    if (method === 'reduce-payment') {
      // 减少月供，期限不变
      const newPayment = newPrincipal * rate * Math.pow(1 + rate, remainingMonths) / (Math.pow(1 + rate, remainingMonths) - 1);
      const totalInterestOriginal = currentPayment * remainingMonths - principal;
      const totalInterestNew = newPayment * remainingMonths - newPrincipal;
      const totalSavings = totalInterestOriginal - totalInterestNew - feeAmount;
      
      return {
        newPayment,
        savingsAmount: totalSavings / 10000,
        paymentChange: (newPayment - currentPayment),
        monthsChange: 0
      };
    } else if (method === 'shorten-term') {
      // 缩短期限，月供不变
      const newMonths = Math.log(1 + (newPrincipal * rate) / currentPayment) / Math.log(1 + rate);
      const totalInterestOriginal = currentPayment * remainingMonths - principal;
      const totalInterestNew = currentPayment * newMonths - newPrincipal;
      const totalSavings = totalInterestOriginal - totalInterestNew - feeAmount;
      
      return {
        newPayment: currentPayment,
        savingsAmount: totalSavings / 10000,
        paymentChange: 0,
        monthsChange: remainingMonths - newMonths,
        newMonths
      };
    } else if (method === 'custom' && customMonthlyPayment) {
      // 自定义月供
      const newPayment = parseFloat(customMonthlyPayment);
      if (newPayment <= 0) return null;
      
      const newMonths = Math.log(1 + (newPrincipal * rate) / newPayment) / Math.log(1 + rate);
      const totalInterestOriginal = currentPayment * remainingMonths - principal;
      const totalInterestNew = newPayment * newMonths - newPrincipal;
      const totalSavings = totalInterestOriginal - totalInterestNew - feeAmount;
      
      return {
        newPayment,
        savingsAmount: totalSavings / 10000,
        paymentChange: newPayment - currentPayment,
        monthsChange: remainingMonths - newMonths,
        newMonths
      };
    }
    
    return null;
  };

  const prepaymentAmount_num = parseFloat(prepaymentAmount || '0');
  const effect1 = calculatePrepaymentEffect(prepaymentAmount_num, 'reduce-payment');
  const effect2 = calculatePrepaymentEffect(prepaymentAmount_num, 'shorten-term');
  const effect3 = calculatePrepaymentEffect(prepaymentAmount_num, 'custom');

  const handlePrepaymentClick = () => {
    if (isCarLoanCompleteFromProps && isCarLoanCompleteFromProps(carLoan) && setActivePrepayCarloanId) {
      setIsExpanded(false);
      setActivePrepayCarloanId(carLoan.id);
    }
  };
  
  return (
    <div>
      {/* 收起时的摘要显示 */}
      {!isExpanded && !showPrepaymentPanel && (
        <div 
          className="rounded-lg py-6 px-3 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
          style={{ border: '2px solid #CAF4F7' }}
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-medium text-gray-900">
                {carLoan.vehicleName || `车贷 ${index + 1}`}
              </h4>
              <span className="text-xs px-2 py-1 bg-white/80 rounded text-gray-600">
                {carLoan.loanType === 'installment' ? '分期' : '银行贷款'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
          
          {stats && (
            <div className="space-y-3">
              {/* 贷款基本信息展示 */}
              <div className="grid grid-cols-3 gap-3 border-b border-white pb-2">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">原始贷款本金</div>
                  <div className="text-sm font-bold text-gray-900">
                    {carLoan.principal || '未设置'}万元
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">利率</div>
                  <div className="text-sm font-bold text-gray-900">
                    {carLoan.interestRate || '未设置'}%
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
                <div className="grid grid-cols-3 gap-3 mb-2">
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
                <div className="grid grid-cols-3 gap-3 mb-2">
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
          )}
        </div>
      )}

      {/* 提前还款计算面板 */}
      {showPrepaymentPanel && (
        <div className="rounded-lg py-6 px-3 bg-white" style={{ border: '2px solid #CAF4F7' }}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">
              {carLoan.vehicleName || `车贷 ${index + 1}`} - 提前还款计算
            </h4>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => {
                  if (setActivePrepayCarloanId) {
                    setActivePrepayCarloanId(null);
                    setIsExpanded(true);
                  }
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronUp className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* 贷款概要信息 */}
          <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: '#F8FFFE', borderColor: '#CAF4F7', border: '1px solid' }}>
            <div className="text-sm font-medium text-gray-900 mb-1">
              {carLoan.vehicleName || '未命名车辆'} - {carLoan.loanType === 'installment' ? '分期' : '银行贷款'}
            </div>
            <div className="text-xs text-gray-500">
              原始贷款金额：{carLoan.principal}万元 | 剩余本金：{carLoan.remainingPrincipal}万元
            </div>
          </div>

          {/* 提前还款信息录入 */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium">
                  提前还款金额(万元) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="如：50"
                  value={prepaymentAmount}
                  onChange={(e) => setPrepaymentAmount(e.target.value)}
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
                    value={prepaymentFeeRate}
                    onChange={(e) => setPrepaymentFeeRate(e.target.value)}
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
                  {(prepaymentAmount_num * 10000 * (parseFloat(prepaymentFeeRate) / 100)).toLocaleString()}元
                </span>
              </div>
            </div>
          </div>

          {/* 提前还款效果分析 */}
          <div className="p-6 bg-gray-100/60 rounded-xl space-y-6 shadow-md">
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
                    {effect1?.savingsAmount ? `${effect1.savingsAmount.toFixed(1)}万元` : '--'}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                  <span className="text-xs font-medium block mb-1 text-gray-600">下期月供</span>
                  <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                    {effect1?.newPayment ? `${Math.round(effect1.newPayment).toLocaleString()}元` : '--'}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                  <span className="text-xs font-medium block mb-1 text-gray-600">下期月供变化</span>
                  <div className="text-base font-bold" style={{ color: '#9CA3AF' }}>
                    {effect1?.paymentChange ? `${Math.round(effect1.paymentChange).toLocaleString()}元` : '--'}
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
                    {effect2?.savingsAmount ? `${effect2.savingsAmount.toFixed(1)}万元` : '--'}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                  <span className="text-xs font-medium block mb-1 text-gray-600">下期月供</span>
                  <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                    {effect2?.newPayment ? `${Math.round(effect2.newPayment).toLocaleString()}元` : '--'}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                  <span className="text-xs font-medium block mb-1 text-gray-600">提前几个月</span>
                  <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                    {effect2?.monthsChange ? `${Math.round(effect2.monthsChange)}个月` : '--'}
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
                    value={customMonthlyPayment}
                    onChange={(e) => setCustomMonthlyPayment(e.target.value)}
                    className="text-sm h-9"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                    <span className="text-xs font-medium block mb-1 text-gray-600">节省总成本</span>
                    <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                      {effect3?.savingsAmount ? `${effect3.savingsAmount.toFixed(1)}万元` : '--'}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                    <span className="text-xs font-medium block mb-1 text-gray-600">还款期限</span>
                    <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                      {effect3?.newMonths ? `${Math.round(effect3.newMonths)}个月` : '--'}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                    <span className="text-xs font-medium block mb-1 text-gray-600">提前几个月</span>
                    <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                      {effect3?.monthsChange ? `${Math.round(effect3.monthsChange)}个月` : '--'}
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

      {/* 展开时的编辑表单 */}
      {isExpanded && !showPrepaymentPanel && (
        <div className="rounded-lg py-6 px-3 bg-white" style={{ border: '2px solid #CAF4F7' }}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">
              {carLoan.vehicleName || `车贷 ${index + 1}`}
            </h4>
            <div className="flex items-center space-x-1">
              {carLoansLength > 1 && (
                <button 
                  onClick={() => removeCarLoan(carLoan.id)}
                  className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
                  title="删除此车贷"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronUp className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
      
          <div className="space-y-4">
            {/* 车辆名称和贷款类型在一行 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium">
                  车辆名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="如：奔驰C200"
                  value={carLoan.vehicleName}
                  onChange={(e) => updateCarLoan(carLoan.id, 'vehicleName', e.target.value)}
                  className="h-9 text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-medium">
                  贷款类型 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={carLoan.loanType}
                  onValueChange={(value: 'installment' | 'bankLoan') => updateCarLoan(carLoan.id, 'loanType', value)}
                >
                  <SelectTrigger className="h-9 text-sm mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="installment">分期</SelectItem>
                    <SelectItem value="bankLoan">银行贷款</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* 根据贷款类型显示不同字段 */}
            {carLoan.loanType === 'installment' ? (
              /* 分期类型字段 */
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium">
                    每期分期金额（元） <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="如：3000"
                    value={carLoan.installmentAmount}
                    onChange={(e) => updateCarLoan(carLoan.id, 'installmentAmount', e.target.value)}
                    className="h-9 text-sm mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium">
                    剩余期限（月） <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="如：24"
                    value={carLoan.remainingInstallments}
                    onChange={(e) => updateCarLoan(carLoan.id, 'remainingInstallments', e.target.value)}
                    className="h-9 text-sm mt-1"
                  />
                </div>
              </div>
            ) : (
              /* 银行贷款类型字段 */
              <div className="space-y-5">
                {/* 金额 + 剩余本金 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 min-w-0">
                    <Label className="text-xs font-medium">
                      贷款原始金额(万元) <span className="text-red-500">*</span>
                    </Label>
                    <input
                      type="text"
                      placeholder="如：30"
                      value={carLoan.principal || ''}
                      onChange={(e) => updateCarLoan(carLoan.id, 'principal', e.target.value)}
                      className="h-9 w-full min-w-0 box-border rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <Label className="text-xs font-medium">
                      贷款剩余本金(万元) <span className="text-red-500">*</span>
                    </Label>
                    <input
                      type="text"
                      placeholder="如：25"
                      value={carLoan.remainingPrincipal || ''}
                      onChange={(e) => updateCarLoan(carLoan.id, 'remainingPrincipal', e.target.value)}
                      className="h-9 w-full min-w-0 box-border rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>

                {/* 开始/结束日期 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 min-w-0">
                    <Label className="text-xs font-medium">
                      贷款开始日期 <span className="text-red-500">*</span>
                    </Label>
                    <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-9 w-full justify-start text-left font-normal",
                            !carLoan.startDateMonth && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {carLoan.startDateMonth ? format(new Date(carLoan.startDateMonth), "yyyy-MM-dd") : "选择日期"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                         <Calendar
                           mode="single"
                           selected={carLoan.startDateMonth ? new Date(carLoan.startDateMonth) : undefined}
                           onSelect={(date) => {
                             updateCarLoan(carLoan.id, 'startDateMonth', date ? format(date, "yyyy-MM-dd") : '');
                             setStartDateOpen(false);
                           }}
                           disabled={(date) => {
                             // 贷款开始日期：今天-50年 到 今天（不能选择未来日期）
                             const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                             const today = new Date();
                             const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                             const minDate = new Date(todayDate.getTime());
                             minDate.setFullYear(minDate.getFullYear() - 50);
                             return selectedDate.getTime() < minDate.getTime() || selectedDate.getTime() > todayDate.getTime();
                           }}
                           initialFocus
                           captionLayout="dropdown"
                           fromYear={1975}
                           toYear={new Date().getFullYear()}
                           locale={zhCN}
                          classNames={{ 
                            caption_label: "hidden", 
                            nav: "hidden",
                            caption_dropdowns: "flex justify-between w-full",
                            dropdown: "min-w-[120px] w-[120px]"
                          }}
                          className={cn("p-3 pointer-events-auto w-full")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2 min-w-0">
                    <Label className="text-xs font-medium">
                      贷款结束日期 <span className="text-red-500">*</span>
                    </Label>
                    <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-9 w-full justify-start text-left font-normal",
                            !carLoan.endDateMonth && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {carLoan.endDateMonth ? format(new Date(carLoan.endDateMonth), "yyyy-MM-dd") : "选择日期"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                         <Calendar
                           mode="single"
                           selected={carLoan.endDateMonth ? new Date(carLoan.endDateMonth) : undefined}
                           onSelect={(date) => {
                             updateCarLoan(carLoan.id, 'endDateMonth', date ? format(date, "yyyy-MM-dd") : '');
                             setEndDateOpen(false);
                           }}
                           disabled={(date) => {
                             // 贷款结束日期：今天 到 今天+50年
                             const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                             const today = new Date();
                             const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                             const maxDate = new Date(todayDate.getTime());
                             maxDate.setFullYear(maxDate.getFullYear() + 50);
                             return selectedDate.getTime() < todayDate.getTime() || selectedDate.getTime() > maxDate.getTime();
                           }}
                           initialFocus
                           captionLayout="dropdown"
                           fromYear={new Date().getFullYear()}
                           toYear={new Date().getFullYear() + 50}
                           locale={zhCN}
                          classNames={{ 
                            caption_label: "hidden", 
                            nav: "hidden",
                            caption_dropdowns: "flex justify-between w-full",
                            dropdown: "min-w-[120px] w-[120px]"
                          }}
                          className={cn("p-3 pointer-events-auto w-full")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* 还款方式 + 贷款利率 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 min-w-0">
                    <Label className="text-xs font-medium">
                      还款方式 <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={carLoan.repaymentMethod || ''}
                      onValueChange={(value) => updateCarLoan(carLoan.id, 'repaymentMethod', value)}
                      className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 pt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="equal-payment" id={`car-equal-payment-${carLoan.id}`} />
                        <Label htmlFor={`car-equal-payment-${carLoan.id}`} className="text-xs whitespace-nowrap">等额本息</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="equal-principal" id={`car-equal-principal-${carLoan.id}`} />
                        <Label htmlFor={`car-equal-principal-${carLoan.id}`} className="text-xs whitespace-nowrap">等额本金</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2 min-w-0">
                    <Label className="text-xs font-medium">
                      贷款利率 <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        placeholder="如：6.5"
                        value={carLoan.interestRate || ''}
                        onChange={(e) => updateCarLoan(carLoan.id, 'interestRate', e.target.value)}
                        className="pr-8 text-sm h-9"
                      />
                      <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* 月供金额显示（始终展示，未完成显示'--'） */}
                <div className="mt-2 pt-2">
                  <div className="rounded-lg p-3 bg-white border border-cyan-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2" style={{ color: '#01BCD6' }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#01BCD6' }}></div>
                        <span className="text-sm font-medium">月供金额</span>
                      </div>
                      <div className="text-right" style={{ color: '#01BCD6' }}>
                        <div className="text-lg font-semibold">
                          {(() => {
                            const v = calculateCarLoanMonthlyPayment(carLoan);
                            return v > 0 ? `¥${Math.round(v).toLocaleString()}` : '--';
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

interface TQSharedCarLoanModuleProps {
  children: React.ReactNode;
  existingData?: any;
  carLoans: any[];
  addCarLoan: () => void;
  removeCarLoan: (id: string) => void;
  updateCarLoan: (id: string, field: any, value: string) => void;
  isCarLoanComplete: (carLoan: any) => boolean;
}

export const TQSharedCarLoanModule: React.FC<TQSharedCarLoanModuleProps> = ({ 
  children, 
  existingData,
  carLoans,
  addCarLoan,
  removeCarLoan,
  updateCarLoan,
  isCarLoanComplete
}) => {
  const [activePrepayCarloanId, setActivePrepayCarloanId] = useState<string | null>(null);

  return (
    <>
      {/* 车贷列表 */}
      {carLoans.map((carLoan, index) => (
        <div key={carLoan.id} className="mb-4">
          <CarLoanCard
            carLoan={carLoan}
            index={index}
            updateCarLoan={updateCarLoan}
            removeCarLoan={removeCarLoan}
            carLoansLength={carLoans.length}
            activePrepayCarloanId={activePrepayCarloanId}
            setActivePrepayCarloanId={setActivePrepayCarloanId}
            isCarLoanComplete={isCarLoanComplete}
          />
        </div>
      ))}

      {/* 按钮区域 */}
      <div className="grid grid-cols-2 gap-3 mt-6 mb-3">
        {/* 左侧：再录一笔（虚线边框，青色） */}
        <Button
          onClick={addCarLoan}
          variant="outline"
          className="h-12 border-dashed"
          style={{ borderColor: '#01BCD6', color: '#01BCD6' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          再录一笔
        </Button>

        {/* 右侧：外部操作插槽（父容器传入的按钮） */}
        <div className="w-full flex items-stretch">
          {children}
        </div>
      </div>
    </>
  );
};