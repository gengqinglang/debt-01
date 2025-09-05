import React, { useState } from 'react';
import { Heart, HelpCircle, ChevronDown as ExpandIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgeGapDetailsComponent } from './AgeGapDetailsComponent';
import { DeathAgeGapDetailsComponent } from './DeathAgeGapDetailsComponent';
import { CashFlowDeficitChart } from './CashFlowDeficitChart';

interface CriticalIllnessRiskCardProps {
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';
  expandedMode?: boolean;
}

export const CriticalIllnessRiskCard: React.FC<CriticalIllnessRiskCardProps> = ({ pageMode = 'public-balanced', expandedMode = false }) => {
  // 展开状态管理
  const [isExpanded, setIsExpanded] = useState(false);
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const [expandedTimelineItems, setExpandedTimelineItems] = useState<Set<number>>(new Set());
  const [deathTimelineExpanded, setDeathTimelineExpanded] = useState(false);
  const [expandedDeathTimelineItems, setExpandedDeathTimelineItems] = useState<Set<number>>(new Set());
  const [cashFlowChartOpen, setCashFlowChartOpen] = useState(false);

  // 处理展开切换
  const handleExpandToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // 计算实际现金流缺口的工具函数
  const calculateActualGap = (age: number) => {
    // 现金流入计算
    const baseIncome = {
      salary: 400000 + (age - 30) * 5000, // 工资随年龄增长
      rent: 5000 + (age - 30) * 500,      // 房租随年龄增长
      housingFund: 2000 + (age - 30) * 100, // 公积金增长
      criticalIllnessInsurance: 0,   // 删除重疾险赔付
    };
    
    // 因为发生重疾失能，工资大幅减少
    baseIncome.salary = Math.round(baseIncome.salary * 0.3);
    
    const totalIncome = Object.values(baseIncome).reduce((sum, value) => sum + value, 0);
    
    // 现金流出计算
    const baseExpenses = {
      basic: 45000 + (age - 30) * 1000,        // 基础生活费用
      medical: 8000 + (age - 30) * 500,        // 日常医疗
      criticalTreatment: 300000 + (age - 30) * 10000, // 重疾治疗费用
      education: age < 40 ? 20000 + (age - 30) * 2000 : 0, // 教育费用
      pension: 12000 + (age - 30) * 500,       // 养老金缴费
      housing: 50000,                          // 居住费用
      transportation: 15000,                   // 交通费用
      majorPurchases: 10000,                   // 大额消费
      familySupport: 10000 + (age - 30) * 500, // 家庭赡养
    };
    
    const totalExpenses = Object.values(baseExpenses).reduce((sum, value) => sum + value, 0);
    
    // 计算缺口（取绝对值，以万为单位，四舍五入）
    const gap = Math.abs(totalIncome - totalExpenses);
    return Math.round(gap / 10000); // 转换为万元并四舍五入
  };

  // 生成15年的模拟数据
  const generateTimelineData = () => {
    const baseYear = 2024;
    const data = [];
    
    // 不连续的年龄分布
    const agePattern = [30, 32, 34, 36, 39, 41, 43, 46, 48, 50, 53, 55, 57, 60, 62];
    
    for (let i = 0; i < 15; i++) {
      const age = agePattern[i];
      const gap = calculateActualGap(age);
      data.push({
        year: baseYear + i,
        age: age,
        gap: gap
      });
    }
    
    return data;
  };

  const timelineData = generateTimelineData();

  // 生成重疾死亡时间轴数据（模拟5年数据）
  const generateDeathTimelineData = () => {
    // 重疾死亡风险的5年数据，年龄和缺口金额
    const deathData = [
      { age: 30, gap: 85 },
      { age: 32, gap: 78 },
      { age: 35, gap: 92 },
      { age: 38, gap: 68 },
      { age: 41, gap: 75 }
    ];
    
    return deathData;
  };

  const deathTimelineData = generateDeathTimelineData();

  // 处理时间轴展开
  const handleTimelineToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimelineExpanded(!timelineExpanded);
  };

  // 处理时间轴项目展开
  const handleTimelineItemToggle = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpandedItems = new Set(expandedTimelineItems);
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index);
    } else {
      newExpandedItems.add(index);
    }
    setExpandedTimelineItems(newExpandedItems);
  };

  // 处理重疾死亡时间轴展开
  const handleDeathTimelineToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeathTimelineExpanded(!deathTimelineExpanded);
  };

  // 处理重疾死亡时间轴项目展开
  const handleDeathTimelineItemToggle = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpandedItems = new Set(expandedDeathTimelineItems);
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index);
    } else {
      newExpandedItems.add(index);
    }
    setExpandedDeathTimelineItems(newExpandedItems);
  };

  // 本人风险内容
  const renderPersonContent = () => (
    <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-white shadow-md">
      {/* 重疾失能标签 */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-gray-800 text-sm font-medium">重疾失能</span>
        <div className="bg-[#FF7F7F]/20 text-gray-700 border border-[#FF7F7F]/20 text-xs font-medium px-2 py-1 rounded-full">
          有风险，卖房也无法解决现金流缺口
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button>
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>重疾失能风险说明</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 leading-relaxed">
              "一旦您不幸发生风险，家庭财务将面临严重危机——所有资产都难以维持正常生活，甚至可能出现负债。建议尽早配置保险，为家庭筑起财务安全网。"
            </p>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* 风险警示文案 */}
      <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
        <div className="text-sm text-gray-800 font-semibold leading-relaxed">
          <div>30岁发生风险问题最大，导致家庭现金流总缺口</div>
          <div className="flex items-center justify-center space-x-2 text-red-600 font-bold text-base mt-1">
            <span 
              className="cursor-pointer" 
              onClick={handleTimelineToggle}
            >
              -{timelineData.reduce((sum, item) => sum + item.gap, 0)}万元
            </span>
            <button 
              onClick={handleTimelineToggle}
              className="text-black hover:text-gray-700 transition-colors"
            >
              <ExpandIcon className={`w-4 h-4 transition-transform ${timelineExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* 时间轴展开内容 */}
        {timelineExpanded && (
          <div className="mt-4 pt-4 border-t border-red-200">
            {/* 数据列表 - 卡片形式 */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {timelineData.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-red-50 border border-red-200 rounded p-3 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-600">{item.year}年</span>
                      <span className="text-sm font-medium text-gray-800">{item.age}岁</span>
                      <span className="text-sm font-bold text-red-600">缺口 {item.gap}万</span>
                    </div>
                    <button 
                      onClick={(e) => handleTimelineItemToggle(index, e)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <ExpandIcon className={`w-3 h-3 transition-transform ${
                        expandedTimelineItems.has(index) ? 'rotate-180' : ''
                      }`} />
                    </button>
                  </div>
                  
                  {/* 展开的详细内容 */}
                  {expandedTimelineItems.has(index) && (
                    <div className="mt-3 pt-3 border-t border-red-300">
                      <AgeGapDetailsComponent age={item.age} gapAmount={item.gap} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 展开的重疾死亡和重疾康复内容 */}
      <div className="space-y-6 mb-4 pt-4">
          {/* 重疾死亡 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-gray-800 text-sm font-medium">重疾死亡</span>
              <div className="bg-[#FF7F7F]/20 text-gray-700 border border-[#FF7F7F]/20 text-xs font-medium px-2 py-1 rounded-full">
                有风险，卖房可解决现金流缺口
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>重疾死亡风险说明</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "一旦发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。"
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* 风险警示文案 */}
            <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
              <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                <div>30岁发生风险问题最大，导致家庭现金流总缺口</div>
                <div className="flex items-center justify-center space-x-2 text-red-600 font-bold text-base mt-1">
                  <span 
                    className="cursor-pointer" 
                    onClick={handleDeathTimelineToggle}
                  >
                    -{deathTimelineData.reduce((sum, item) => sum + item.gap, 0)}万元
                  </span>
                  <button 
                    onClick={handleDeathTimelineToggle}
                    className="text-black hover:text-gray-700 transition-colors"
                  >
                    <ExpandIcon className={`w-4 h-4 transition-transform ${deathTimelineExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              
              {/* 重疾死亡时间轴展开内容 */}
              {deathTimelineExpanded && (
                <div className="mt-4 pt-4 border-t border-red-200">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {deathTimelineData.map((item, index) => (
                      <div 
                        key={index} 
                        className="bg-red-50 border border-red-200 rounded p-3 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-800">{item.age}岁</span>
                            <span className="text-sm font-bold text-red-600">缺口 {item.gap}万</span>
                          </div>
                          <button 
                            onClick={(e) => handleDeathTimelineItemToggle(index, e)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            <ExpandIcon className={`w-3 h-3 transition-transform ${
                              expandedDeathTimelineItems.has(index) ? 'rotate-180' : ''
                            }`} />
                          </button>
                        </div>
                        
                        {/* 展开的详细内容 */}
                        {expandedDeathTimelineItems.has(index) && (
                          <div className="mt-3 pt-3 border-t border-red-300">
                            <DeathAgeGapDetailsComponent age={item.age} gapAmount={item.gap} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 重疾康复 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-gray-800 text-sm font-medium">重疾康复</span>
              <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                无风险
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>重疾康复风险说明</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* 风险警示文案 */}
            <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
              <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                任何一年发生此风险，都不会导致现金流缺口
              </div>
            </div>
          </div>
          
          {/* 意外失能 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-gray-800 text-sm font-medium">意外失能</span>
              <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                有风险，处置实物资产可解决现金流缺口
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>意外失能风险说明</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "一旦发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。"
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* 风险警示文案 */}
            <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
              <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                <div>30岁发生风险问题最大，导致家庭现金流总缺口</div>
                <div className="text-red-600 font-bold text-base mt-1">-398万元</div>
              </div>
            </div>
          </div>
          
          {/* 意外死亡 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-gray-800 text-sm font-medium">意外死亡</span>
              <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                无风险
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>意外死亡风险说明</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* 风险警示文案 */}
            <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
              <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                任何一年发生此风险，都不会导致现金流缺口
              </div>
            </div>
          </div>
        </div>
      </div>
  );

  // 配偶风险内容
  const renderSpouseContent = () => (
    <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-white shadow-md">
      {/* 重疾失能标签 */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-gray-800 text-sm font-medium">重疾失能</span>
        <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
          有风险，处置实物资产可解决现金流缺口
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button>
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>重疾失能风险说明</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 leading-relaxed">
              "一旦配偶发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。"
            </p>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* 风险警示文案 */}
      <div className="p-3 bg-white border border-red-200 rounded-lg text-center mb-4">
        <div className="text-sm text-gray-800 font-semibold leading-relaxed">
          <div>28岁发生风险问题最大，导致家庭现金流总缺口</div>
          <div className="flex items-center justify-center space-x-2 text-red-600 font-bold text-base mt-1">
            <span 
              className="cursor-pointer" 
              onClick={() => setCashFlowChartOpen(true)}
            >
              -1,250万元
            </span>
            <button 
              onClick={() => setCashFlowChartOpen(true)}
              className="text-black hover:text-gray-700 transition-colors"
            >
              <ExpandIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 展开的重疾死亡和重疾康复内容 */}
      <div className="space-y-6 mb-4 pt-4">
          {/* 重疾死亡 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-gray-800 text-sm font-medium">重疾死亡</span>
              <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                无风险，但保障方式有优化空间
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>重疾死亡风险说明</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "一旦发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。"
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* 风险警示文案 */}
            <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
              <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                <div>30岁发生风险问题最大，导致家庭现金流总缺口</div>
                <div className="text-red-600 font-bold text-base mt-1">7年</div>
              </div>
            </div>
          </div>
          
          {/* 重疾康复 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-gray-800 text-sm font-medium">重疾康复</span>
              <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                无风险
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>重疾康复风险说明</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* 风险警示文案 */}
            <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
              <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                任何一年发生此风险，都不会导致现金流缺口
              </div>
            </div>
          </div>
          
          {/* 意外失能 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-gray-800 text-sm font-medium">意外失能</span>
              <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                有风险，处置实物资产可解决现金流缺口
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>意外失能风险说明</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "一旦发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。"
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* 风险警示文案 */}
            <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
              <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                <div>30岁发生风险问题最大，导致家庭现金流总缺口</div>
                <div className="text-red-600 font-bold text-base mt-1">-285万元</div>
              </div>
            </div>
          </div>
          
          {/* 意外死亡 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-gray-800 text-sm font-medium">意外死亡</span>
              <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                无风险
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>意外死亡风险说明</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* 风险警示文案 */}
            <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
              <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                任何一年发生此风险，都不会导致现金流缺口
              </div>
            </div>
          </div>
        </div>
      </div>
  );

  // 孩子风险内容
  const renderChildContent = () => (
    <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-white shadow-md">
      {/* 重疾失能标签 */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-gray-800 text-sm font-medium">重疾失能</span>
        <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
          无风险
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button>
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>重疾失能风险说明</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 leading-relaxed">
              "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
            </p>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* 风险警示文案 */}
      <div className="p-3 bg-white border border-red-200 rounded-lg text-center mb-4">
        <div className="text-sm text-gray-800 font-semibold leading-relaxed">
          任何一年发生此风险，都不会导致现金流缺口
        </div>
      </div>

      {/* 展开的重疾死亡和重疾康复内容 */}
      <div className="space-y-6 mb-4 pt-4">
          {/* 重疾死亡 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-gray-800 text-sm font-medium">重疾死亡</span>
              <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                无风险
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>重疾死亡风险说明</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* 风险警示文案 */}
            <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
              <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                任何一年发生此风险，都不会导致现金流缺口
              </div>
            </div>
          </div>
          
          {/* 重疾康复 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-gray-800 text-sm font-medium">重疾康复</span>
              <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                无风险
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>重疾康复风险说明</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* 风险警示文案 */}
            <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
              <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                任何一年发生此风险，都不会导致现金流缺口
              </div>
            </div>
          </div>
          
          {/* 意外失能 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-gray-800 text-sm font-medium">意外失能</span>
              <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                无风险
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>意外失能风险说明</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* 风险警示文案 */}
            <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
              <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                任何一年发生此风险，都不会导致现金流缺口
              </div>
            </div>
          </div>
          
          {/* 意外死亡 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-gray-800 text-sm font-medium">意外死亡</span>
              <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                无风险
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>意外死亡风险说明</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* 风险警示文案 */}
            <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
              <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                任何一年发生此风险，都不会导致现金流缺口
              </div>
            </div>
          </div>
        </div>
      </div>
  );
  const renderCriticalIllnessExpandedContent = () => (
    <div className="space-y-4 mt-4 pt-4 border-t border-orange-200">
      {/* 本人单独出险 */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-semibold text-gray-800">本人</h4>
          </div>
        </div>
        
        {/* 解释文案区域 - 合并的风险卡片 */}
        <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-white shadow-md">
          {/* 重疾失能标签 */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-gray-800 text-sm font-medium">重疾失能</span>
            <div className="bg-[#FF7F7F]/20 text-gray-700 border border-[#FF7F7F]/20 text-xs font-medium px-2 py-1 rounded-full">
              有风险，卖房也无法解决现金流缺口
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button>
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>重疾失能风险说明</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "一旦您不幸发生风险，家庭财务将面临严重危机——所有资产都难以维持正常生活，甚至可能出现负债。建议尽早配置保险，为家庭筑起财务安全网。"
                </p>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* 风险警示文案 */}
          <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
            <div className="text-sm text-gray-800 font-semibold leading-relaxed">
              <div>30岁发生风险问题最大，导致家庭现金流总缺口</div>
              <div className="flex items-center justify-center space-x-2 text-red-600 font-bold text-base mt-1">
                <span 
                  className="cursor-pointer" 
                  onClick={handleTimelineToggle}
                >
                  -{timelineData.reduce((sum, item) => sum + item.gap, 0)}万元
                </span>
                <button 
                  onClick={handleTimelineToggle}
                  className="text-black hover:text-gray-700 transition-colors"
                >
                  <ExpandIcon className={`w-4 h-4 transition-transform ${timelineExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
            
            {/* 时间轴展开内容 */}
            {timelineExpanded && (
              <div className="mt-4 pt-4 border-t border-red-200">
                {/* 数据列表 - 卡片形式 */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {timelineData.map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-red-50 border border-red-200 rounded p-3 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-gray-600">{item.year}年</span>
                          <span className="text-sm font-medium text-gray-800">{item.age}岁</span>
                          <span className="text-sm font-bold text-red-600">缺口 {item.gap}万</span>
                        </div>
                        <button 
                          onClick={(e) => handleTimelineItemToggle(index, e)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <ExpandIcon className={`w-3 h-3 transition-transform ${
                            expandedTimelineItems.has(index) ? 'rotate-180' : ''
                          }`} />
                        </button>
                      </div>
                      
                      {/* 展开的详细内容 */}
                      {expandedTimelineItems.has(index) && (
                        <div className="mt-3 pt-3 border-t border-red-300">
                          <AgeGapDetailsComponent age={item.age} gapAmount={item.gap} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 展开的重疾死亡和重疾康复内容 */}
          <div className="space-y-6 mb-4 pt-4">
              {/* 重疾死亡 */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-800 text-sm font-medium">重疾死亡</span>
                  <div className="bg-[#FF7F7F]/20 text-gray-700 border border-[#FF7F7F]/20 text-xs font-medium px-2 py-1 rounded-full">
                    有风险，卖房可解决现金流缺口
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>重疾死亡风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* 风险警示文案 */}
                <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                  <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                    <div>30岁发生风险问题最大，导致家庭现金流总缺口</div>
                    <div className="flex items-center justify-center space-x-2 text-red-600 font-bold text-base mt-1">
                      <span 
                        className="cursor-pointer" 
                        onClick={handleDeathTimelineToggle}
                      >
                        -{deathTimelineData.reduce((sum, item) => sum + item.gap, 0)}万元
                      </span>
                      <button 
                        onClick={handleDeathTimelineToggle}
                        className="text-black hover:text-gray-700 transition-colors"
                      >
                        <ExpandIcon className={`w-4 h-4 transition-transform ${deathTimelineExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  {/* 重疾死亡时间轴展开内容 */}
                  {deathTimelineExpanded && (
                    <div className="mt-4 pt-4 border-t border-red-200">
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {deathTimelineData.map((item, index) => (
                          <div 
                            key={index} 
                            className="bg-red-50 border border-red-200 rounded p-3 text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-800">{item.age}岁</span>
                                <span className="text-sm font-bold text-red-600">缺口 {item.gap}万</span>
                              </div>
                              <button 
                                onClick={(e) => handleDeathTimelineItemToggle(index, e)}
                                className="text-blue-500 hover:text-blue-700 transition-colors"
                              >
                                <ExpandIcon className={`w-3 h-3 transition-transform ${
                                  expandedDeathTimelineItems.has(index) ? 'rotate-180' : ''
                                }`} />
                              </button>
                            </div>
                            
                            {/* 展开的详细内容 */}
                            {expandedDeathTimelineItems.has(index) && (
                              <div className="mt-3 pt-3 border-t border-red-300">
                                <DeathAgeGapDetailsComponent age={item.age} gapAmount={item.gap} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 重疾康复 */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-800 text-sm font-medium">重疾康复</span>
                  <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                    无风险
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>重疾康复风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* 风险警示文案 */}
                <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                  <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                    任何一年发生此风险，都不会导致现金流缺口
                  </div>
                </div>
              </div>
              
              {/* 意外失能 */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-800 text-sm font-medium">意外失能</span>
                  <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                    有风险，处置实物资产可解决现金流缺口
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>意外失能风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* 风险警示文案 */}
                <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                  <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                    <div>30岁发生风险问题最大，导致家庭现金流总缺口</div>
                    <div className="text-red-600 font-bold text-base mt-1">-398万元</div>
                  </div>
                </div>
              </div>
              
              {/* 意外死亡 */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-800 text-sm font-medium">意外死亡</span>
                  <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                    无风险
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>意外死亡风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* 风险警示文案 */}
                <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                  <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                    任何一年发生此风险，都不会导致现金流缺口
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* 配偶单独出险 */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-semibold text-gray-800">配偶</h4>
          </div>
        </div>
        
        {/* 解释文案区域 - 合并的风险卡片 */}
        <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-white shadow-md">
          {/* 重疾失能标签 */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-gray-800 text-sm font-medium">重疾失能</span>
            <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
              无风险，但保障方式有优化空间
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button>
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>重疾失能风险说明</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "一旦配偶发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。"
                </p>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* 风险警示文案 */}
          <div className="p-3 bg-white border border-red-200 rounded-lg text-center mb-4">
            <div className="text-sm text-gray-800 font-semibold leading-relaxed">
              <div>30岁发生风险问题最大，导致现金流缺口</div>
              <div className="text-red-600 font-bold text-base mt-1">3年</div>
            </div>
          </div>

          {/* 展开的重疾死亡和重疾康复内容 */}
          <div className="space-y-6 mb-4 pt-4">
              {/* 重疾死亡 */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-800 text-sm font-medium">重疾死亡</span>
                  <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                    无风险，但保障方式有优化空间
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>重疾死亡风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* 风险警示文案 */}
                <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                  <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                    <div>30岁发生风险问题最大，导致家庭现金流总缺口</div>
                    <div className="text-red-600 font-bold text-base mt-1">7年</div>
                  </div>
                </div>
              </div>
              
              {/* 重疾康复 */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-800 text-sm font-medium">重疾康复</span>
                  <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                    无风险
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>重疾康复风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* 风险警示文案 */}
                <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                  <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                    任何一年发生此风险，都不会导致现金流缺口
                  </div>
                </div>
              </div>
              
              {/* 意外失能 */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-800 text-sm font-medium">意外失能</span>
                  <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                    有风险，处置实物资产可解决现金流缺口
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>意外失能风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* 风险警示文案 */}
                <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                  <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                    <div>30岁发生风险问题最大，导致家庭现金流总缺口</div>
                    <div className="text-red-600 font-bold text-base mt-1">-285万元</div>
                  </div>
                </div>
              </div>
              
              {/* 意外死亡 */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-800 text-sm font-medium">意外死亡</span>
                  <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                    无风险
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>意外死亡风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* 风险警示文案 */}
                <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                  <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                    任何一年发生此风险，都不会导致现金流缺口
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* 孩子单独出险 */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-semibold text-gray-800">孩子</h4>
          </div>
        </div>
        
        {/* 解释文案区域 - 合并的风险卡片 */}
        <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-white shadow-md">
          {/* 重疾失能标签 */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-gray-800 text-sm font-medium">重疾失能</span>
            <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
              无风险
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button>
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>重疾失能风险说明</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                </p>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* 风险警示文案 */}
          <div className="p-3 bg-white border border-red-200 rounded-lg text-center mb-4">
            <div className="text-sm text-gray-800 font-semibold leading-relaxed">
              任何一年发生此风险，都不会导致现金流缺口
            </div>
          </div>

          {/* 展开的重疾死亡和重疾康复内容 */}
          <div className="space-y-6 mb-4 pt-4">
              {/* 重疾死亡 */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-800 text-sm font-medium">重疾死亡</span>
                  <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                    无风险
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>重疾死亡风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* 风险警示文案 */}
                <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                  <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                    任何一年发生此风险，都不会导致现金流缺口
                  </div>
                </div>
              </div>
              
              {/* 重疾康复 */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-800 text-sm font-medium">重疾康复</span>
                  <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                    无风险
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>重疾康复风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* 风险警示文案 */}
                <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                  <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                    任何一年发生此风险，都不会导致现金流缺口
                  </div>
                </div>
              </div>
              
              {/* 意外失能 */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-800 text-sm font-medium">意外失能</span>
                  <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                    无风险
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>意外失能风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* 风险警示文案 */}
                <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                  <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                    任何一年发生此风险，都不会导致现金流缺口
                  </div>
                </div>
              </div>
              
              {/* 意外死亡 */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-800 text-sm font-medium">意外死亡</span>
                  <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                    无风险
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>意外死亡风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* 风险警示文案 */}
                <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                  <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                    任何一年发生此风险，都不会导致现金流缺口
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      
      {/* 查看保障建议按钮 */}
      <button className="w-full bg-orange-100 text-orange-700 text-sm font-medium py-2.5 rounded-lg hover:bg-orange-200 transition-colors">
        查看保障建议
      </button>
    </div>
  );

  // 当 expandedMode 为 true 时，使用 TAB 展示展开内容
  if (expandedMode) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">重疾/意外风险测评结果</h3>
        <Tabs defaultValue="person" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="person">本人</TabsTrigger>
            <TabsTrigger value="spouse">配偶</TabsTrigger>
            <TabsTrigger value="child">孩子</TabsTrigger>
          </TabsList>
          <TabsContent value="person" className="space-y-4">
            {renderPersonContent()}
            <button className="w-full bg-orange-100 text-orange-700 text-sm font-medium py-2.5 rounded-lg hover:bg-orange-200 transition-colors">
              查看保障建议
            </button>
          </TabsContent>
          <TabsContent value="spouse" className="space-y-4">
            {renderSpouseContent()}
            <button className="w-full bg-orange-100 text-orange-700 text-sm font-medium py-2.5 rounded-lg hover:bg-orange-200 transition-colors">
              查看保障建议
            </button>
          </TabsContent>
          <TabsContent value="child" className="space-y-4">
            {renderChildContent()}
            <button className="w-full bg-orange-100 text-orange-700 text-sm font-medium py-2.5 rounded-lg hover:bg-orange-200 transition-colors">
              查看保障建议
            </button>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <Card className={`bg-white border border-orange-300 ${
      isExpanded ? 'h-auto' : 'h-20'
    } transition-all duration-200`}>
      <CardContent className="p-4">
        <div className={`${isExpanded ? '' : 'h-12'}`}>
          <div className="flex items-center space-x-4">
            {/* icon */}
            <div className="w-6 h-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
              <Heart className="w-3 h-3 text-orange-600" />
            </div>
            
            {/* 风险名称和描述 */}
            <div className="flex-1 min-w-0">
              <div className="text-base font-medium text-gray-800 mb-1">
                重疾/意外风险
              </div>
              <div className="text-sm text-gray-800 line-clamp-1">
                大病意外，家庭易陷困境
              </div>
            </div>
            
             {/* 查看详情按钮和箭头 */}
             <div 
               className="flex-shrink-0 flex items-center space-x-1 cursor-pointer"
               onClick={handleExpandToggle}
             >
               <span className="text-sm font-medium" style={{ color: '#01BCD6' }}>查看详情</span>
               <ExpandIcon className={`w-3 h-3 transition-transform ${
                 isExpanded ? 'rotate-180' : ''
               }`} style={{ color: '#01BCD6' }} />
             </div>
          </div>
        </div>
        
         {/* 展开内容 */}
         {isExpanded && (
           <div onClick={(e) => e.stopPropagation()}>
             {renderCriticalIllnessExpandedContent()}
           </div>
         )}

         {/* 现金流缺口图表 */}
         <CashFlowDeficitChart 
           isOpen={cashFlowChartOpen} 
           onClose={() => setCashFlowChartOpen(false)} 
         />
      </CardContent>
    </Card>
  );
};