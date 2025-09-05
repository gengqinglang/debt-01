
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, DollarSign, PiggyBank, HandHeart, Check, Edit, Home, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IncomeEntry {
  id: string;
  startYear: string;
  endYear: string;
  amount: string;
  balance?: string; // 余额（元）- 仅公积金和企业年金使用
  contributionRate?: string; // 月缴纳比例（%）- 仅公积金和企业年金使用
}

interface CategoryData {
  [categoryId: string]: IncomeEntry[];
}

const FutureIncomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categoryData, setCategoryData] = useState<CategoryData>({
    rental: [],
    pension_fund: [],
    enterprise_annuity: [],
    other: []
  });
  
  // Add state for confirmation status
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasDataChanged, setHasDataChanged] = useState(false);
  const [hasNone, setHasNone] = useState(false);
  const [activeCategory, setActiveCategory] = useState('rental');

  // Generate year options from current year to current year + 50
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 51 }, (_, i) => currentYear + i);

  // 收入分类配置 - 按顺序：房租收入、公积金、企业年金、其他收入
  const incomeCategories = [
    { id: 'rental', label: '房租收入', icon: Home },
    { id: 'pension_fund', label: '公积金', icon: PiggyBank },
    { id: 'enterprise_annuity', label: '企业年金', icon: DollarSign },
    { id: 'other', label: '其他收入', icon: HandHeart }
  ];

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem('futureIncomeData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.categoryData) {
          setCategoryData(parsed.categoryData);
        }
      } catch (error) {
        console.error('Failed to parse saved future income data:', error);
      }
    }

    // Initialize each category with one empty entry if no data exists
    setCategoryData(prev => ({
      rental: prev.rental?.length > 0 ? prev.rental : [{ id: Date.now().toString(), startYear: '', endYear: '', amount: '' }],
      pension_fund: prev.pension_fund?.length > 0 ? prev.pension_fund : [{ id: (Date.now() + 1).toString(), startYear: '', endYear: '', amount: '', balance: '', contributionRate: '12' }],
      enterprise_annuity: prev.enterprise_annuity?.length > 0 ? prev.enterprise_annuity : [{ id: (Date.now() + 2).toString(), startYear: '', endYear: '', amount: '', balance: '', contributionRate: '4' }],
      other: prev.other?.length > 0 ? prev.other : [{ id: (Date.now() + 3).toString(), startYear: '', endYear: '', amount: '' }]
    }));
  }, []);

  // 计算各类收入总额
  const calculateRentalIncome = () => {
    return categoryData.rental?.reduce((total, entry) => {
      const amount = parseFloat(entry.amount) || 0;
      return total + amount;
    }, 0) || 0;
  };

  const calculatePensionFundIncome = () => {
    return categoryData.pension_fund?.reduce((total, entry) => {
      const amount = parseFloat(entry.amount) || 0;
      return total + amount;
    }, 0) || 0;
  };

  const calculateEnterpriseAnnuityIncome = () => {
    return categoryData.enterprise_annuity?.reduce((total, entry) => {
      const amount = parseFloat(entry.amount) || 0;
      return total + amount;
    }, 0) || 0;
  };

  const calculateOtherIncome = () => {
    return categoryData.other?.reduce((total, entry) => {
      const amount = parseFloat(entry.amount) || 0;
      return total + amount;
    }, 0) || 0;
  };

  const rentalIncome = calculateRentalIncome();
  const pensionFundIncome = calculatePensionFundIncome();
  const enterpriseAnnuityIncome = calculateEnterpriseAnnuityIncome();
  const otherIncome = calculateOtherIncome();
  const totalIncome = rentalIncome + pensionFundIncome + enterpriseAnnuityIncome + otherIncome;

  // 处理输入变化
  const handleInputChange = (categoryId: string, entryId: string, field: string, value: string) => {
    setCategoryData(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].map(entry =>
        entry.id === entryId ? { ...entry, [field]: value } : entry
      )
    }));
    
    // If data changes after confirmation, mark as changed
    if (isConfirmed) {
      setHasDataChanged(true);
    }
    
    if (hasNone) setHasNone(false);
  };

  // 添加新的收入条目
  const addNewEntry = (categoryId: string) => {
    let newEntry: IncomeEntry;
    
    if (categoryId === 'pension_fund') {
      newEntry = {
        id: Date.now().toString(),
        startYear: '',
        endYear: '',
        amount: '',
        balance: '',
        contributionRate: '12'
      };
    } else if (categoryId === 'enterprise_annuity') {
      newEntry = {
        id: Date.now().toString(),
        startYear: '',
        endYear: '',
        amount: '',
        balance: '',
        contributionRate: '4'
      };
    } else {
      newEntry = {
        id: Date.now().toString(),
        startYear: '',
        endYear: '',
        amount: ''
      };
    }
    
    setCategoryData(prev => ({
      ...prev,
      [categoryId]: [...prev[categoryId], newEntry]
    }));
  };

  // 删除收入条目
  const removeEntry = (categoryId: string, entryId: string) => {
    setCategoryData(prev => {
      const updatedEntries = prev[categoryId].filter(entry => entry.id !== entryId);
      // 确保至少保留一个空条目
      if (updatedEntries.length === 0) {
        updatedEntries.push({ id: Date.now().toString(), startYear: '', endYear: '', amount: '' });
      }
      return {
        ...prev,
        [categoryId]: updatedEntries
      };
    });
  };

  const handleSkip = () => {
    setCategoryData({ rental: [], pension_fund: [], enterprise_annuity: [], other: [] });
    navigate('/income-summary');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleConfirm = () => {
    // Save data to localStorage but don't navigate
    const dataToSave = {
      categoryData,
      rentalIncome,
      pensionFundIncome,
      enterpriseAnnuityIncome,
      otherIncome,
      totalIncome
    };
    
    localStorage.setItem('futureIncomeData', JSON.stringify(dataToSave));
    
    // Set confirmation state instead of navigating
    setIsConfirmed(true);
    setHasDataChanged(false);
  };

  const hasAnyData = Object.values(categoryData).some(entries =>
    entries.some(entry => entry.startYear || entry.endYear || entry.amount)
  );

  return (
    <div className="min-h-screen bg-[#F4FDFD] flex flex-col">
      <div className="relative flex flex-col bg-white/90 backdrop-blur-xl flex-1">
        {/* 标题区域 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#B3EBEF]/20 via-white/60 to-[#B3EBEF]/20 -mx-2">
          <div className="relative py-6 text-center flex flex-col justify-center" style={{ minHeight: '80px' }}>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              未来生涯其他收入
            </h1>
            
            {/* 收入汇总卡片 */}
            <div className="px-3 mt-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 rounded-lg p-2 border border-[#B3EBEF]/30">
                  <div className="text-sm font-bold text-gray-900 mb-1">0.0万</div>
                  <p className="text-xs text-gray-700">工资收入</p>
                </div>
                <div className="bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 rounded-lg p-2 border border-[#B3EBEF]/30">
                  <div className="text-sm font-bold text-gray-900 mb-1">{totalIncome.toFixed(1)}万</div>
                  <p className="text-xs text-gray-700">其他收入</p>
                </div>
                <div className="bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 rounded-lg p-2 border border-[#B3EBEF]/30">
                  <div className="text-sm font-bold text-gray-900 mb-1">{totalIncome.toFixed(1)}万</div>
                  <p className="text-xs text-gray-700">总收入</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 收入分类 Tab 区域 */}
        <div className="bg-white border-t border-gray-100 px-3 py-2">
          <div className="flex gap-2">
            {incomeCategories.map(category => {
              const IconComponent = category.icon;
              const hasData = categoryData[category.id]?.some(entry => 
                entry.startYear || entry.endYear || entry.amount || entry.balance
              );
              return (
                <Button 
                  key={category.id} 
                  onClick={() => setActiveCategory(category.id)} 
                  className={`relative flex-1 justify-center px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 border-0 h-12 flex-col gap-1 ${
                    activeCategory === category.id 
                      ? 'bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 text-gray-900 shadow-lg border border-[#B3EBEF]/30' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 shadow-sm'
                  }`} 
                  variant="ghost"
                >
                  <IconComponent className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-xs">{category.label}</span>
                  {hasData && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#01BCD6' }}>
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* 标题部分 - 复用参考组件的格式 */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{incomeCategories.find(cat => cat.id === activeCategory)?.label}</h2>
            </div>

            <div className="space-y-4">
              {/* 收入条目列表 */}
              {categoryData[activeCategory]?.map((entry, index) => (
                <div key={entry.id} className="rounded-lg py-6 px-3 bg-white relative" style={{ border: '2px solid #CAF4F7' }}>
                  {/* 删除按钮 - 右上角 */}
                  {categoryData[activeCategory].length > 1 && (
                    <Button 
                      onClick={() => removeEntry(activeCategory, entry.id)}
                      variant="ghost" 
                      size="sm"
                      className="absolute top-2 right-2 text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 h-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="space-y-4">
                    {(activeCategory === 'pension_fund' || activeCategory === 'enterprise_annuity') ? (
                      // 公积金和企业年金的特殊字段 - 并排布局
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm text-gray-600 mb-1 block">
                            {activeCategory === 'pension_fund' ? '公积金余额' : '企业年金余额'} <span className="text-red-500">*</span> <span className="text-xs text-gray-400">(元)</span>
                          </Label>
                          <Input
                            type="number"
                            placeholder={activeCategory === 'pension_fund' ? '请输入公积金余额' : '请输入企业年金余额'}
                            value={entry.balance || ''}
                            onChange={(e) => handleInputChange(activeCategory, entry.id, 'balance', e.target.value)}
                            className="h-10 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600 mb-1 block">
                            月缴纳比例 <span className="text-red-500">*</span> <span className="text-xs text-gray-400">(%)</span>
                          </Label>
                          <Input
                            type="number"
                            placeholder="请输入月缴纳比例"
                            value={entry.contributionRate || ''}
                            onChange={(e) => handleInputChange(activeCategory, entry.id, 'contributionRate', e.target.value)}
                            className="h-10 text-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      // 房租收入和其他收入的通用字段
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm text-gray-600 mb-1 block">
                              开始时间 <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={entry.startYear}
                              onValueChange={(value) => handleInputChange(activeCategory, entry.id, 'startYear', value)}
                            >
                              <SelectTrigger className="h-10 text-sm">
                                <SelectValue placeholder="选择年份" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 z-50">
                                {yearOptions.map((year) => (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}年
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-sm text-gray-600 mb-1 block">
                              结束时间 <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={entry.endYear}
                              onValueChange={(value) => handleInputChange(activeCategory, entry.id, 'endYear', value)}
                            >
                              <SelectTrigger className="h-10 text-sm">
                                <SelectValue placeholder="选择年份" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 z-50">
                                {yearOptions.map((year) => (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}年
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-600 mb-1 block">
                            金额 <span className="text-red-500">*</span> <span className="text-xs text-gray-400">(万元/年)</span>
                          </Label>
                          <Input
                            type="number"
                            placeholder="请输入年收入金额"
                            value={entry.amount}
                            onChange={(e) => handleInputChange(activeCategory, entry.id, 'amount', e.target.value)}
                            className="h-10 text-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
              
              {/* 按钮区域 - 完全匹配参考组件的布局 */}
              <div className="grid grid-cols-2 gap-3 mt-6 mb-3">
                {/* 只为房租收入和其他收入显示"再录一笔"按钮 */}
                {(activeCategory === 'rental' || activeCategory === 'other') ? (
                  <Button
                    onClick={() => addNewEntry(activeCategory)}
                    variant="outline"
                    className="h-12 border-dashed"
                    style={{ borderColor: '#01BCD6', color: '#01BCD6' }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    再录一笔
                  </Button>
                ) : (
                  <div></div>
                )}
                <Button
                  onClick={handleConfirm}
                  className={`w-full h-12 font-semibold rounded-lg transition-all duration-300 ${
                    isConfirmed && !hasDataChanged
                      ? 'bg-[#B3EBEF]/50 text-gray-500'
                      : 'bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900'
                  } ${(activeCategory === 'pension_fund' || activeCategory === 'enterprise_annuity') ? 'col-span-2' : ''}`}
                >
                  <Check className="w-4 w-4 mr-2" />
                  {isConfirmed && !hasDataChanged ? '已保存' : '确认'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-2 space-y-3 bg-gradient-to-t from-white via-white/95 to-white/90 backdrop-blur-xl border-t border-gray-100 pb-safe" 
             style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
          <div className="flex gap-2">
            <Button 
              onClick={handleGoBack}
              className="flex-1 py-2 text-gray-700 font-bold rounded-2xl text-xs shadow-lg transform hover:scale-[1.02] transition-all duration-300 border border-gray-300 bg-white hover:bg-gray-50"
              variant="outline"
            >
              <span className="flex items-center justify-center gap-2">
                <ArrowLeft className="w-3 h-3" />
                上一步
              </span>
            </Button>
            
            <Button 
              onClick={handleSkip}
              className="flex-1 py-2 text-gray-900 font-bold rounded-2xl text-xs shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-0 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A0E2E6] hover:to-[#7BC9CE]"
            >
              录入完毕，下一步
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureIncomePage;
