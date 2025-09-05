import React, { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HousePlanEditModal from './HousePlanEditModal';

interface HousePlan {
  id: string;
  motive: string;
  roomType: string;
  amount: string;
  purchaseAge?: number; // 购房时间（年龄）
  purchaseMethod?: string; // 购房方式
  downPayment?: number; // 首付金额
  loanAmount?: number; // 贷款金额
  loanYears?: number; // 贷款年限
  monthlyPayment?: number; // 月供
  saleInfo?: { // 置换信息
    currentValue: number; // 当前房产市值
    earlyRepayment: number; // 提前还贷金额
  };
}

interface HousePlanSummaryProps {
  plans: HousePlan[];
  onRemovePlan: (planId: string) => void;
  onUpdatePlan?: (planId: string, updatedData: Partial<HousePlan>) => void;
  hideDetails?: boolean; // 控制是否隐藏详细信息
}
const HousePlanSummary: React.FC<HousePlanSummaryProps> = ({
  plans,
  onRemovePlan,
  onUpdatePlan,
  hideDetails = false
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<HousePlan | null>(null);

  const handleEditPlan = (plan: HousePlan) => {
    setEditingPlan(plan);
    setEditModalOpen(true);
  };

  const handleSavePlan = (updatedData: Partial<HousePlan>) => {
    if (editingPlan && onUpdatePlan) {
      onUpdatePlan(editingPlan.id, updatedData);
    }
    setEditModalOpen(false);
    setEditingPlan(null);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setEditingPlan(null);
  };
  if (plans.length === 0) {
    return <div className="bg-gray-50 rounded-2xl p-6 text-center">
        <p className="text-gray-500 text-sm">您还没有确定任何购房计划</p>
        <p className="text-gray-400 text-xs mt-1">请在下方选择购房动机并配置详情</p>
      </div>;
  }
  return <div className="bg-gradient-to-br from-[#B3EBEF]/10 to-[#8FD8DC]/10 border border-[#B3EBEF] rounded-2xl p-6">
      <h3 className="font-bold text-gray-900 mb-4 text-base">已确定的购房计划</h3>
      <div className="space-y-3">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex-1">
              {/* 主要信息行：购房动机、预算、编辑和删除按钮 */}
              <div className="flex flex-col gap-3 mb-3">
                {/* 第一行：购房动机和操作按钮 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-800">{plan.motive}</h4>
                    {plan.purchaseAge && (
                      <span className="text-xs px-2 py-1 bg-[#CAF4F7]/50 text-[#01BCD6] rounded-full">
                        {plan.purchaseAge}岁
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditPlan(plan)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <button 
                      onClick={() => onRemovePlan(plan.id)} 
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* 第二行：预算和居室信息 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">预算 {plan.amount}万元</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#B3EBEF]/20 text-gray-700 font-medium text-sm">
                    {plan.roomType}
                  </span>
                </div>
              </div>
              
              {/* 次要信息行 */}
              <div className="flex items-center gap-2">
                {!hideDetails && plan.purchaseMethod && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    {plan.purchaseMethod}
                  </span>
                )}
              </div>
              
              {/* 置换+融资购房的详细信息 */}
              {!hideDetails && plan.purchaseMethod === '置换+融资购房' && (
                <div className="space-y-3 mt-3">
                  {/* 置换房产信息 */}
                  {plan.saleInfo && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium text-gray-800 mb-2 text-sm">置换房产</div>
                      <div className="space-y-2 text-xs text-gray-700">
                        <div className="flex justify-between">
                          <span className="text-gray-600">出售：</span>
                          <span>当前价值{plan.saleInfo.currentValue}万的房产</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">提前还贷：</span>
                          <span>{plan.saleInfo.earlyRepayment}万</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">由此房屋无法出租：</span>
                          <span>45岁-50岁</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">减少租金收入：</span>
                          <span>30万元</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 融资计划信息 */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-medium text-gray-800 mb-2 text-sm">融资计划</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">首付金额：</span>
                        <span className="font-medium">{plan.downPayment}万</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">贷款金额：</span>
                        <span className="font-medium">{plan.loanAmount}万</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">贷款期限：</span>
                        <span className="font-medium">{plan.loanYears}年</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">预估月供：</span>
                        <span className="font-medium">{plan.monthlyPayment}万元/月</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 其他融资购房的信息 */}
              {!hideDetails && plan.purchaseMethod === '融资购房' && (
                <div className="bg-gray-50 rounded-lg p-3 mt-3">
                  <div className="font-medium text-gray-800 mb-2 text-sm">融资计划</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">首付金额：</span>
                      <span className="font-medium">{plan.downPayment}万元</span>
                    </div>
                    <div>
                      <span className="text-gray-500">贷款金额：</span>
                      <span className="font-medium">{plan.loanAmount}万元</span>
                    </div>
                    <div>
                      <span className="text-gray-500">贷款年限：</span>
                      <span className="font-medium">{plan.loanYears}年</span>
                    </div>
                    <div>
                      <span className="text-gray-500">预估月供：</span>
                      <span className="font-medium">{plan.monthlyPayment}元/约</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* 编辑弹窗 */}
      {editingPlan && (
        <HousePlanEditModal
          isOpen={editModalOpen}
          onClose={handleCloseModal}
          onSave={handleSavePlan}
          plan={editingPlan}
        />
      )}
    </div>;
};
export default HousePlanSummary;