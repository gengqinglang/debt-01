import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Edit, TrendingUp, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AmountEditModal from '@/components/AmountEditModal';
import PensionEditModal from './PensionEditModal';
import RetirementEditModal from './RetirementEditModal';
import OtherIncomeEditModal from './OtherIncomeEditModal';
import AddIncomeModal from './AddIncomeModal';
import RentalIncomeEditModal from './RentalIncomeEditModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMembership } from '@/components/membership/MembershipProvider';

// 定义收入项目的统一类型
interface IncomeItem {
  id: string;
  name: string;
  amount: number;
  balance?: number;
  contributionRate?: number;
  period?: string;
  rentalPeriods?: RentalPeriod[];
  isCore?: boolean; // 标识是否为核心科目
  isEditable?: boolean; // 标识是否可编辑
}

interface RentalPeriod {
  id: string;
  startAge: string;
  endAge: string;
  monthlyRent: string;
  propertyValue: string;
}

interface IncomeExpenditureDisplayProps {
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';
  onInteractionAttempt?: () => void;
}

const IncomeExpenditureDisplay: React.FC<IncomeExpenditureDisplayProps> = ({ 
  pageMode = 'public-balanced',
  onInteractionAttempt 
}) => {
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pensionModalOpen, setPensionModalOpen] = useState(false);
  const [retirementModalOpen, setRetirementModalOpen] = useState(false);
  const [otherIncomeModalOpen, setOtherIncomeModalOpen] = useState(false);
  const [addIncomeModalOpen, setAddIncomeModalOpen] = useState(false);
  const [rentalIncomeModalOpen, setRentalIncomeModalOpen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: string; name: string; amount: number } | null>(null);
  const [editingPension, setEditingPension] = useState<{ id: string; name: string; balance: number; contributionRate: number } | null>(null);
  const [editingRetirement, setEditingRetirement] = useState<{ id: string; name: string; amount: number } | null>(null);
  const [editingOtherIncome, setEditingOtherIncome] = useState<{ id: string; name: string; amount: number; period?: string } | null>(null);
  const [editingRental, setEditingRental] = useState<{ id: string; name: string; periods: RentalPeriod[] } | null>(null);

  // 核心收入科目数据（万元）
  const [coreIncomeItems, setCoreIncomeItems] = useState<IncomeItem[]>([
    { id: 'personal-salary', name: '本人工资奖金', amount: 600, isCore: true, isEditable: true },
    { id: 'partner-salary', name: '伴侣工资奖金', amount: 500, isCore: true, isEditable: true },
    { id: 'personal-retirement', name: '本人退休金', amount: 200, isCore: true, isEditable: true },
    { id: 'partner-retirement', name: '伴侣退休金', amount: 180, isCore: true, isEditable: true },
    { id: 'rental-income', name: '房租收入', amount: 186, isCore: true, isEditable: true, rentalPeriods: [] },
    { id: 'investment-income', name: '投资收益', amount: 89, isCore: true, isEditable: false }
  ]);

  // 可选收入科目数据（万元）
  const [optionalIncomeItems, setOptionalIncomeItems] = useState<IncomeItem[]>([]);

  // 数据更新时间
  const [lastUpdateTime, setLastUpdateTime] = useState<string>(() => {
    const saved = localStorage.getItem('income_last_update_time');
    return saved || new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  // 更新时间的函数
  const updateLastModifiedTime = () => {
    const newTime = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    setLastUpdateTime(newTime);
    localStorage.setItem('income_last_update_time', newTime);
  };

  // 从localStorage加载房租收入数据，如果没有则使用默认数据
  useEffect(() => {
    console.log('初始化房租收入数据...');
    
    // 强制清除旧数据，使用新的默认数据
    const rentalPeriods = getDefaultRentalPeriods();
    localStorage.setItem('income_rental_periods', JSON.stringify(rentalPeriods));
    
    const totalAmount = calculateRentalTotalAmount(rentalPeriods);
    console.log('计算的房租总收入:', totalAmount, '万');
    
    setCoreIncomeItems(prev => 
      prev.map(item => 
        item.id === 'rental-income' 
          ? { ...item, amount: totalAmount, rentalPeriods }
          : item
      )
    );
  }, []);

  // 默认房租收入期间数据
  const getDefaultRentalPeriods = (): RentalPeriod[] => [
    {
      id: '1',
      startAge: '35',
      endAge: '45', 
      monthlyRent: '5000',
      propertyValue: '200'
    },
    {
      id: '2',
      startAge: '50',
      endAge: '65',
      monthlyRent: '7000', 
      propertyValue: '300'
    }
  ];

  const calculateRentalTotalAmount = (periods: RentalPeriod[]): number => {
    return periods.reduce((total, period) => {
      const startAge = parseInt(period.startAge) || 0;
      const endAge = parseInt(period.endAge) || 0;
      const monthlyRent = parseFloat(period.monthlyRent) || 0;
      const years = Math.max(0, endAge - startAge);
      const yearlyRent = monthlyRent * 12;
      return total + (yearlyRent * years / 10000); // 转换为万元
    }, 0);
  };

  const totalAmount = [...coreIncomeItems, ...optionalIncomeItems].reduce((sum, item) => sum + item.amount, 0);

  const formatAmount = (amount: number) => {
    return amount.toFixed(0);
  };

  const handleEditClick = (item: any) => {
    // 如果是本人工资奖金或伴侣工资奖金，导航到AI职业规划页面
    if (item.id === 'personal-salary' || item.id === 'partner-salary') {
      navigate('/ai-career-planning', {
        state: {
          returnTo: '/new',
          activeTab: 'planning',
          activePlanningTab: 'career-income'
        }
      });
      return;
    }

    // 如果是房租收入，打开房租收入编辑弹窗
    if (item.id === 'rental-income') {
      setEditingRental({
        id: item.id,
        name: item.name,
        periods: item.rentalPeriods || []
      });
      setRentalIncomeModalOpen(true);
      return;
    }

    // 如果是投资收益，不允许编辑
    if (item.id === 'investment-income') {
      return;
    }
    
    // 如果是企业年金，打开企业年金编辑弹窗
    if (item.id.includes('pension')) {
      setEditingPension({
        id: item.id,
        name: item.name,
        balance: item.balance || 0,
        contributionRate: item.contributionRate || 0
      });
      setPensionModalOpen(true);
      return;
    }
    
    // 如果是退休金，打开退休金编辑弹窗
    if (item.id.includes('retirement')) {
      setEditingRetirement({
        id: item.id,
        name: item.name,
        amount: item.amount
      });
      setRetirementModalOpen(true);
      return;
    }
    
    // 如果是其他收入，打开其他收入编辑弹窗
    if (item.period) {
      setEditingOtherIncome({
        id: item.id,
        name: item.name,
        amount: item.amount,
        period: item.period || '2024-2050'
      });
      setOtherIncomeModalOpen(true);
      return;
    }
    
    // 其他收入项目打开编辑弹窗
    setEditingItem(item);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (newAmount: string) => {
    if (editingItem) {
      const numAmount = parseFloat(newAmount);
      const oldItem = [...coreIncomeItems, ...optionalIncomeItems].find(item => item.id === editingItem.id);
      const hasChanged = oldItem && oldItem.amount !== numAmount;
      
      setCoreIncomeItems(prev => 
        prev.map(item => 
          item.id === editingItem.id 
            ? { ...item, amount: numAmount }
            : item
        )
      );
      setOptionalIncomeItems(prev => 
        prev.map(item => 
          item.id === editingItem.id 
            ? { ...item, amount: numAmount }
            : item
        )
      );
      
      if (hasChanged) {
        updateLastModifiedTime();
        setShowSuccessDialog(true);
      }
    }
  };

  const handleSaveRental = (periods: RentalPeriod[]) => {
    if (editingRental) {
      const totalAmount = calculateRentalTotalAmount(periods);
      const oldItem = coreIncomeItems.find(item => item.id === editingRental.id);
      const hasChanged = !oldItem || oldItem.amount !== totalAmount || 
        JSON.stringify(oldItem.rentalPeriods) !== JSON.stringify(periods);
      
      // 保存到localStorage
      localStorage.setItem('income_rental_periods', JSON.stringify(periods));
      
      setCoreIncomeItems(prev => 
        prev.map(item => 
          item.id === editingRental.id 
            ? { ...item, amount: totalAmount, rentalPeriods: periods }
            : item
        )
      );
      
      if (hasChanged) {
        updateLastModifiedTime();
        setShowSuccessDialog(true);
      }
    }
  };

  const handleSavePension = (data: { balance: string; contributionRate: string }) => {
    if (editingPension) {
      const newBalance = parseFloat(data.balance);
      const newRate = parseFloat(data.contributionRate);
      const oldItem = optionalIncomeItems.find(item => item.id === editingPension.id);
      const hasChanged = !oldItem || oldItem.balance !== newBalance || oldItem.contributionRate !== newRate;
      
      setOptionalIncomeItems(prev => 
        prev.map(item => 
          item.id === editingPension.id 
            ? { 
                ...item, 
                balance: newBalance,
                contributionRate: newRate,
                amount: item.amount
              }
            : item
        )
      );
      
      if (hasChanged) {
        updateLastModifiedTime();
        setShowSuccessDialog(true);
      }
    }
  };

  const handleSaveRetirement = (newAmount: string) => {
    if (editingRetirement) {
      const numAmount = parseFloat(newAmount);
      const oldItem = coreIncomeItems.find(item => item.id === editingRetirement.id);
      const hasChanged = oldItem && oldItem.amount !== numAmount;
      
      setCoreIncomeItems(prev => 
        prev.map(item => 
          item.id === editingRetirement.id 
            ? { ...item, amount: numAmount }
            : item
        )
      );
      
      if (hasChanged) {
        updateLastModifiedTime();
        setShowSuccessDialog(true);
      }
    }
  };

  const handleSaveOtherIncome = (data: { period: string; amount: string }) => {
    if (editingOtherIncome) {
      const newAmount = parseFloat(data.amount);
      const oldItem = optionalIncomeItems.find(item => item.id === editingOtherIncome.id);
      const hasChanged = !oldItem || oldItem.amount !== newAmount || oldItem.period !== data.period;
      
      setOptionalIncomeItems(prev => 
        prev.map(item => 
          item.id === editingOtherIncome.id 
            ? { 
                ...item, 
                amount: newAmount,
                period: data.period
              }
            : item
        )
      );
      
      if (hasChanged) {
        updateLastModifiedTime();
        setShowSuccessDialog(true);
      }
    }
  };

  // 获取已存在的收入科目ID列表
  const getExistingIncomeIds = () => {
    const existingIds: string[] = [];
    
    // 添加核心收入科目中已有的ID（排除固定科目）
    coreIncomeItems.forEach(item => {
      if (item.id && !['personal-salary', 'partner-salary', 'personal-retirement', 'partner-retirement', 'rental-income', 'investment-income'].includes(item.id)) {
        existingIds.push(item.id);
      }
    });
    
    // 添加可选收入科目的ID
    optionalIncomeItems.forEach(item => {
      if (item.id) {
        // 将现有的ID映射到新的收入类型值
        if (item.id.includes('pension')) {
          existingIds.push(item.id.includes('personal') ? 'personal-pension' : 'partner-pension');
        } else if (item.id.includes('fund')) {
          existingIds.push(item.id.includes('personal') ? 'personal-fund' : 'partner-fund');
        } else {
          existingIds.push(item.id);
        }
      }
    });
    
    return existingIds;
  };

  const handleAddIncome = (incomeData: any) => {
    // 根据收入类型生成合适的ID
    let newId = `optional-${Date.now()}`;
    if (incomeData.type) {
      newId = incomeData.type + '-' + Date.now();
    }
    
    const newItem: IncomeItem = {
      id: newId,
      name: incomeData.name,
      amount: parseFloat(incomeData.amount) || 0,
      balance: incomeData.balance ? parseFloat(incomeData.balance) : undefined,
      contributionRate: incomeData.contributionRate ? parseFloat(incomeData.contributionRate) : undefined,
      period: incomeData.period,
      isCore: false,
      isEditable: true
    };
    
    setOptionalIncomeItems(prev => [...prev, newItem]);
    updateLastModifiedTime();
    setShowSuccessDialog(true);
  };

  const handleDeleteIncome = (itemId: string) => {
    setOptionalIncomeItems(prev => prev.filter(item => item.id !== itemId));
    updateLastModifiedTime();
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setEditingItem(null);
  };

  const handleClosePensionModal = () => {
    setPensionModalOpen(false);
    setEditingPension(null);
  };

  const handleCloseRetirementModal = () => {
    setRetirementModalOpen(false);
    setEditingRetirement(null);
  };

  const handleCloseOtherIncomeModal = () => {
    setOtherIncomeModalOpen(false);
    setEditingOtherIncome(null);
  };

  const handleCloseAddIncomeModal = () => {
    setAddIncomeModalOpen(false);
  };

  const handleCloseRentalModal = () => {
    setRentalIncomeModalOpen(false);
    setEditingRental(null);
  };

  const handleContinueAdjusting = () => {
    setShowSuccessDialog(false);
  };

  const handleViewWealthType = () => {
    setShowSuccessDialog(false);
    // 跳转到发现页面
    navigate('/new', {
      state: {
        activeTab: 'discover'
      }
    });
  };

  const getItemDescription = (item: IncomeItem) => {
    if (item.id === 'rental-income' && item.rentalPeriods && item.rentalPeriods.length > 0) {
      const periods = item.rentalPeriods;
      if (periods.length === 1) {
        const period = periods[0];
        return `${period.startAge}-${period.endAge}岁，${period.monthlyRent}元/月，房产市值${period.propertyValue}万`;
      } else {
        return `${periods.length}个租赁期间`;
      }
    }
    
    if (item.id === 'investment-income') {
      return '投资组合收益（不可编辑）';
    }
    
    if (item.name.includes('工资奖金')) {
      return '工作期间薪资收入';
    }
    
    if (item.name.includes('退休金')) {
      return '退休后养老金收入';
    }
    
    if (item.balance && item.contributionRate) {
      return `余额${item.balance}万，缴纳比例${item.contributionRate}%`;
    }
    
    if (item.period) {
      return `收入期间：${item.period}`;
    }
    
    return '其他收入来源';
  };

  return (
    <div className="space-y-3">
      {/* 大卡片容器 - 使用更浅的绿色基调 */}
      <Card className="bg-gradient-to-r from-[#CCE9B5]/10 to-[#B8E6A1]/10 border-[#CCE9B5] shadow-lg rounded-xl">
        <CardContent className="p-4">
          {/* 总收入展示 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#CCE9B5] to-[#B8E6A1] rounded-full flex items-center justify-center">
                <Calculator className="w-4 h-4 text-gray-900" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">未来人生总收入</h3>
                <p className="text-xs text-gray-500 mt-1">最后更新：{lastUpdateTime}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-gray-900">
                {formatAmount(totalAmount)}万
              </div>
            </div>
          </div>

          {/* 核心收入科目详细展示 */}
          <div className="space-y-3 mt-4">
            {coreIncomeItems.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-gray-100 hover:bg-white/80 transition-all duration-200"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {getItemDescription(item)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">
                      {formatAmount(item.amount)}万
                    </div>
                    <div className="text-xs text-gray-500">
                      占比 {totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                  {item.isEditable && (
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      title={item.name.includes('工资奖金') ? '职业规划' : '修改金额'}
                    >
                      <Edit className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 可选收入科目 */}
          {optionalIncomeItems.length > 0 && (
            <div className="space-y-3 mt-4">
              <div className="border-t border-gray-200 pt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-3">其他收入来源</h4>
                {optionalIncomeItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-white/40 rounded-lg border border-gray-100 hover:bg-white/60 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {getItemDescription(item)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">
                          {formatAmount(item.amount)}万
                        </div>
                        <div className="text-xs text-gray-500">
                          占比 {totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : 0}%
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="修改"
                      >
                        <Edit className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleDeleteIncome(item.id)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        title="删除"
                      >
                        <svg className="w-4 h-4 text-red-500 hover:text-red-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c0 1 1 2 2 2v2M10 11v6M14 11v6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 添加收入科目按钮 */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              onClick={() => setAddIncomeModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-[#CCE9B5]/20 to-[#B8E6A1]/20 border border-[#CCE9B5]/30 rounded-lg hover:bg-gradient-to-r hover:from-[#CCE9B5]/30 hover:to-[#B8E6A1]/30 transition-all duration-200"
            >
              <Plus className="w-4 h-4 text-[#6B8E5A]" />
              <span className="text-sm font-medium text-[#6B8E5A]">添加收入科目</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 精准录入提醒 - 使用与页面一致的绿色基调 */}
      <Card className="bg-gradient-to-r from-[#CCE9B5]/8 to-[#B8E6A1]/8 border-[#CCE9B5]/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gradient-to-r from-[#CCE9B5] to-[#B8E6A1] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <TrendingUp className="w-3 h-3 text-gray-800" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                让分型结果更精准
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                觉得预测结果不够准确？直接在页面上调整收入数据，
                <span className="font-medium text-[#6B8E5A]">系统会实时重新计算</span>给你更精准的财富分型结果
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 修改金额弹窗 */}
      {editingItem && (
        <AmountEditModal
          isOpen={editModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveEdit}
          currentAmount={editingItem.amount.toString()}
          itemName={editingItem.name}
          minAmount={0}
          maxAmount={10000}
          unit="万"
        />
      )}

      {/* 企业年金编辑弹窗 */}
      {editingPension && (
        <PensionEditModal
          isOpen={pensionModalOpen}
          onClose={handleClosePensionModal}
          onSave={handleSavePension}
          itemName={editingPension.name}
          currentBalance={editingPension.balance}
          currentContributionRate={editingPension.contributionRate}
        />
      )}

      {/* 退休金编辑弹窗 */}
      {editingRetirement && (
        <RetirementEditModal
          isOpen={retirementModalOpen}
          onClose={handleCloseRetirementModal}
          onSave={handleSaveRetirement}
          itemName={editingRetirement.name}
          currentAmount={editingRetirement.amount}
        />
      )}

      {/* 其他收入编辑弹窗 */}
      {editingOtherIncome && (
        <OtherIncomeEditModal
          isOpen={otherIncomeModalOpen}
          onClose={handleCloseOtherIncomeModal}
          onSave={handleSaveOtherIncome}
          itemName={editingOtherIncome.name}
          currentAmount={editingOtherIncome.amount}
          currentPeriod={editingOtherIncome.period}
        />
      )}

      {/* 房租收入编辑弹窗 */}
      {editingRental && (
        <RentalIncomeEditModal
          isOpen={rentalIncomeModalOpen}
          onClose={handleCloseRentalModal}
          onSave={handleSaveRental}
          itemName={editingRental.name}
          currentPeriods={editingRental.periods}
        />
      )}

      {/* 添加收入科目弹窗 */}
      <AddIncomeModal
        isOpen={addIncomeModalOpen}
        onClose={handleCloseAddIncomeModal}
        onSave={handleAddIncome}
        existingIncomeIds={getExistingIncomeIds()}
        pageMode={pageMode}
        onInteractionAttempt={onInteractionAttempt}
      />

      {/* 成功弹窗 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">
              收入配置更新成功！
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 leading-relaxed pt-2">
              您的收入设置已更新，这可能会影响您的财富分型和风险评估结果。建议查看最新的财富分型，了解调整后的财务状况变化。
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleContinueAdjusting}
              className="flex-1 rounded-full border-2 border-gray-300 hover:bg-gray-50"
            >
              暂不查看，继续调整
            </Button>
            <Button
              onClick={handleViewWealthType}
              className="flex-1 rounded-full bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:bg-gradient-to-r hover:from-[#A5E0E4] hover:to-[#7DD3D7] text-gray-800 font-medium"
            >
              查看最新财富分型
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IncomeExpenditureDisplay;
