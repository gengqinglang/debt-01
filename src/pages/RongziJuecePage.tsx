import React, { useState } from 'react';
import { AlertTriangle, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const RongziJuecePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // 模拟购房计划数据
  const housingPlan = {
    purchaseAge: 35,
    motive: '改善住房',
    roomType: '三居室',
    amount: 380
  };

  // 模拟融资计划数据
  const [financingPlan, setFinancingPlan] = useState({
    totalPrice: 380, // 房价总额（万元）
    loanAmount: 266, // 贷款金额（万元）
    downPayment: 114, // 首付金额（万元）
    loanTerm: 30, // 贷款期间（年）
    monthlyPayment: 1.3 // 月供金额（万元/月）
  });

  const [editValues, setEditValues] = useState({
    loanAmount: financingPlan.loanAmount.toString(),
    loanTerm: financingPlan.loanTerm.toString()
  });

  // 简单的月供计算（实际应该用更复杂的公式）
  const calculateMonthlyPayment = (loanAmount: number, loanTerm: number) => {
    // 假设年利率5%
    const monthlyRate = 0.05 / 12;
    const totalMonths = loanTerm * 12;
    const monthlyPayment = (loanAmount * 10000 * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                          (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return Math.round(monthlyPayment / 10000 * 100) / 100; // 保留两位小数，转换为万元
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValues({
      loanAmount: financingPlan.loanAmount.toString(),
      loanTerm: financingPlan.loanTerm.toString()
    });
  };

  const handleSave = () => {
    const newLoanAmount = parseFloat(editValues.loanAmount) || financingPlan.loanAmount;
    const newLoanTerm = parseInt(editValues.loanTerm) || financingPlan.loanTerm;
    const newDownPayment = financingPlan.totalPrice - newLoanAmount;
    const newMonthlyPayment = calculateMonthlyPayment(newLoanAmount, newLoanTerm);

    setFinancingPlan({
      ...financingPlan,
      loanAmount: newLoanAmount,
      loanTerm: newLoanTerm,
      downPayment: newDownPayment,
      monthlyPayment: newMonthlyPayment
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({
      loanAmount: financingPlan.loanAmount.toString(),
      loanTerm: financingPlan.loanTerm.toString()
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-center px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-900">融资决策</h1>
        </div>
      </div>

      <div className="py-6 space-y-6 bg-white">
        {/* 醒目提醒 */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                融资提醒
              </h3>
              <p className="text-orange-700 text-sm leading-relaxed">
                系统检测到您未来的规划中有购房计划，基于当前财务状况分析，您需要通过融资才能实现购房目标。建议您仔细考虑以下融资方案。
              </p>
            </div>
          </div>
        </div>

        {/* 购房计划 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">您的购房计划</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-gray-500">购房时间</span>
                <div className="text-sm font-medium text-gray-900">
                  {housingPlan.purchaseAge}岁
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">购房动机</span>
                <div className="text-sm font-medium text-gray-900">
                  {housingPlan.motive}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">居室</span>
                <div className="text-sm font-medium text-gray-900">
                  {housingPlan.roomType}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">金额</span>
                <div className="text-sm font-medium text-gray-900">
                  {housingPlan.amount}万元
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 建议融资计划 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">建议融资计划</h2>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
            {isEditing && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:text-green-700"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-gray-500">房价总额:</span>
                <div className="text-sm font-medium text-gray-900">
                  {financingPlan.totalPrice}万
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">贷款金额:</span>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editValues.loanAmount}
                    onChange={(e) => setEditValues({...editValues, loanAmount: e.target.value})}
                    className="h-8 text-sm"
                    placeholder="贷款金额"
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">
                    {financingPlan.loanAmount}万
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">首付金额:</span>
                <div className="text-sm font-medium text-gray-900">
                  {financingPlan.downPayment}万
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">贷款期间:</span>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editValues.loanTerm}
                    onChange={(e) => setEditValues({...editValues, loanTerm: e.target.value})}
                    className="h-8 text-sm"
                    placeholder="贷款期间"
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">
                    {financingPlan.loanTerm}年
                  </div>
                )}
              </div>
            </div>
            
            {/* 月供金额单独显示，更突出 */}
            <div className="mt-6 p-3 bg-[#01BCD6]/10 rounded-lg border border-[#01BCD6]/20">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">月供金额:</div>
                <div className="text-lg font-semibold text-[#01BCD6]">
                  {financingPlan.monthlyPayment}万元/月
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3 pt-4">
          <Button 
            className="w-full bg-[#01BCD6] hover:bg-[#01BCD6]/90 text-white border-[#01BCD6]"
            size="lg"
            onClick={() => navigate('/baogao', { state: { fromRongzijuece: true } })}
          >
            接受融资方案
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-[#01BCD6] text-[#01BCD6] hover:bg-[#01BCD6]/10"
            size="lg"
            onClick={handleEdit}
            disabled={isEditing}
          >
            调整融资计划
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RongziJuecePage;