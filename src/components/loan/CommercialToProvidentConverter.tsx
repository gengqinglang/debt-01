import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLoanData, LoanInfo } from '@/hooks/useLoanData';
import { Calculator, TrendingDown, TrendingUp } from 'lucide-react';

interface ConversionData {
  selectedLoanId: string;
  conversionAmount: string;
  providentRate: string;
  paymentMethod: string;
  loanTerm: string;
  feeRate: string;
}

interface CalculationResult {
  totalSavings: number;
  nextMonthPayment: number;
  paymentChange: number;
  newProvidentPayment: number;
  remainingCommercialPayment: number;
}

const CommercialToProvidentConverter = () => {
  const { loans } = useLoanData();
  const [conversionData, setConversionData] = useState<ConversionData>({
    selectedLoanId: '',
    conversionAmount: '',
    providentRate: '3.1',
    paymentMethod: '',
    loanTerm: '',
    feeRate: '0.5'
  });
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  // 过滤掉纯公积金贷款
  const eligibleLoans = loans.filter(loan => 
    loan.loanType !== 'provident' && 
    loan.loanType !== '' &&
    loan.propertyName &&
    loan.loanAmount
  );

  const updateField = (field: keyof ConversionData, value: string) => {
    setConversionData(prev => ({ ...prev, [field]: value }));
  };

  // 计算逻辑
  const calculateConversion = () => {
    const selectedLoan = loans.find(loan => loan.id === conversionData.selectedLoanId);
    if (!selectedLoan || !conversionData.conversionAmount || !conversionData.paymentMethod || !conversionData.loanTerm) {
      return;
    }

    const conversionAmount = parseFloat(conversionData.conversionAmount) * 10000; // 万元转元
    const providentRate = parseFloat(conversionData.providentRate) / 100;
    const loanTermMonths = parseInt(conversionData.loanTerm) * 12;
    const feeRate = parseFloat(conversionData.feeRate) / 100;

    // 简化计算逻辑
    const monthlyProvidentRate = providentRate / 12;
    let newProvidentPayment = 0;

    if (conversionData.paymentMethod === 'equal_payment') {
      // 等额本息
      newProvidentPayment = conversionAmount * monthlyProvidentRate * Math.pow(1 + monthlyProvidentRate, loanTermMonths) / 
        (Math.pow(1 + monthlyProvidentRate, loanTermMonths) - 1);
    } else {
      // 等额本金
      newProvidentPayment = conversionAmount / loanTermMonths + conversionAmount * monthlyProvidentRate;
    }

    // 估算原商贷月供（假设利率4.5%）
    const originalRate = 0.045 / 12;
    const originalAmount = parseFloat(selectedLoan.loanAmount) * 10000;
    const remainingAmount = originalAmount - conversionAmount;
    const estimatedOriginalPayment = originalAmount * originalRate * Math.pow(1 + originalRate, 360) / 
      (Math.pow(1 + originalRate, 360) - 1);
    
    const remainingCommercialPayment = remainingAmount * originalRate * Math.pow(1 + originalRate, 360) / 
      (Math.pow(1 + originalRate, 360) - 1);

    const nextMonthPayment = newProvidentPayment + remainingCommercialPayment;
    const paymentChange = nextMonthPayment - estimatedOriginalPayment;
    const totalSavings = (estimatedOriginalPayment - nextMonthPayment) * loanTermMonths - (conversionAmount * feeRate);

    setCalculationResult({
      totalSavings,
      nextMonthPayment,
      paymentChange,
      newProvidentPayment,
      remainingCommercialPayment
    });
  };

  useEffect(() => {
    if (conversionData.selectedLoanId && conversionData.conversionAmount && 
        conversionData.paymentMethod && conversionData.loanTerm) {
      calculateConversion();
    }
  }, [conversionData]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          商业贷款转公积金贷款测算
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {eligibleLoans.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            暂无可转换的商业贷款
          </div>
        ) : (
          <>
            {/* 选择贷款 */}
            <div className="space-y-2">
              <Label>选择需要转公积金的贷款</Label>
              <Select value={conversionData.selectedLoanId} onValueChange={(value) => updateField('selectedLoanId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择贷款" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleLoans.map(loan => (
                    <SelectItem key={loan.id} value={loan.id}>
                      {loan.propertyName} - {loan.loanAmount}万元
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 转换参数 */}
            {conversionData.selectedLoanId && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>转公积金贷款金额（万元）</Label>
                  <Input
                    type="number"
                    placeholder="请输入金额"
                    value={conversionData.conversionAmount}
                    onChange={(e) => updateField('conversionAmount', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>公积金利率（%）</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={conversionData.providentRate}
                    onChange={(e) => updateField('providentRate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>公积金还款方式</Label>
                  <Select value={conversionData.paymentMethod} onValueChange={(value) => updateField('paymentMethod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择还款方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal_payment">等额本息</SelectItem>
                      <SelectItem value="equal_principal">等额本金</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>贷款期限（年）</Label>
                  <Input
                    type="number"
                    placeholder="请输入期限"
                    value={conversionData.loanTerm}
                    onChange={(e) => updateField('loanTerm', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>手续费率（%）</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={conversionData.feeRate}
                    onChange={(e) => updateField('feeRate', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* 计算结果 */}
            {calculationResult && (
              <div className="mt-8 p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-4">测算结果</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {calculationResult.totalSavings > 0 ? '节约' : '增加'}
                      ¥{Math.abs(calculationResult.totalSavings).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">总成本变化</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      ¥{calculationResult.nextMonthPayment.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">下月月供</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                      calculationResult.paymentChange > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {calculationResult.paymentChange > 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                      {calculationResult.paymentChange > 0 ? '+' : ''}¥{Math.abs(calculationResult.paymentChange).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">月供变化</div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      ¥{calculationResult.newProvidentPayment.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">转后公积金月供</div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      ¥{calculationResult.remainingCommercialPayment.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">转后商贷月供</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CommercialToProvidentConverter;