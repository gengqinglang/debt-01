
import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Briefcase, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

const IncomeDataSummary = () => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  // 读取收入数据
  const incomeData = useMemo(() => {
    console.log('=== 收入数据调试 ===');
    console.log('所有 localStorage 键:', Object.keys(localStorage));
    
    // 读取职业收入数据 - 使用实际的键名
    const getCareerIncome = () => {
      try {
        // 尝试实际存储的键名
        const possibleKeys = ['career_careerPlan', 'personalCareerPlan', 'career_stages', 'careerStages', 'careerData'];
        let careerData = null;
        let usedKey = '';
        
        for (const key of possibleKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            careerData = data;
            usedKey = key;
            break;
          }
        }
        
        console.log('职业数据键名:', usedKey);
        console.log('职业数据原始:', careerData);
        
        if (careerData) {
          const stages = JSON.parse(careerData);
          console.log('解析后的职业数据:', stages);
          
          const total = stages.reduce((total: number, stage: any) => {
            const duration = parseInt(stage.duration) || 0;
            const yearlyIncome = stage.yearlyIncome || 0;
            console.log(`职业阶段: ${stage.position}, 年收入: ${yearlyIncome}, 持续: ${duration}年`);
            return total + (yearlyIncome * duration);
          }, 0);
          
          console.log('职业总收入:', total);
          return total;
        }
        return 0;
      } catch (error) {
        console.error('读取职业收入数据错误:', error);
        return 0;
      }
    };

    // 读取其他收入数据 - 修复数据格式处理，只处理剩余的收入类型
    const getOtherIncome = () => {
      try {
        const futureIncomeData = localStorage.getItem('futureIncomeData');
        console.log('其他收入数据原始:', futureIncomeData);
        
        if (futureIncomeData) {
          const data = JSON.parse(futureIncomeData);
          console.log('解析后的其他收入数据:', data);
          
          // 计算所有收入项的总和，只包含企业年金、退休金、其他收入
          let total = 0;
          Object.entries(data).forEach(([key, itemData]: [string, any]) => {
            // 跳过已删除的分类
            if (key === 'family-support' || key === 'children-support') {
              return;
            }
            
            if (itemData && typeof itemData === 'object') {
              if (itemData.balance) total += parseFloat(itemData.balance) || 0;
              if (itemData.monthly) total += (parseFloat(itemData.monthly) || 0) * 12 / 10000; // 转换为年收入（万元）
              if (itemData.amount) total += parseFloat(itemData.amount) || 0;
            }
          });
          
          console.log('其他收入总计:', total);
          return total;
        }
        return 0;
      } catch (error) {
        console.error('读取其他收入数据错误:', error);
        return 0;
      }
    };

    const careerIncome = getCareerIncome();
    const otherIncome = getOtherIncome();

    const result = {
      careerIncome: careerIncome / 10000, // 转换为万元
      otherIncome: otherIncome,
      totalIncome: (careerIncome / 10000) + otherIncome
    };
    
    console.log('最终收入数据:', result);
    console.log('=== 收入数据调试结束 ===');
    
    return result;
  }, []);

  // 读取职业阶段详情 - 使用实际键名
  const careerStages = useMemo(() => {
    try {
      const possibleKeys = ['career_careerPlan', 'personalCareerPlan', 'career_stages', 'careerStages', 'careerData'];
      
      for (const key of possibleKeys) {
        const careerData = localStorage.getItem(key);
        if (careerData) {
          return JSON.parse(careerData);
        }
      }
      return [];
    } catch (error) {
      console.error('读取职业阶段详情错误:', error);
      return [];
    }
  }, []);

  // 读取其他收入详情 - 修复数据格式，只包含剩余的收入类型
  const otherIncomeDetails = useMemo(() => {
    try {
      const futureIncomeData = localStorage.getItem('futureIncomeData');
      if (futureIncomeData) {
        const data = JSON.parse(futureIncomeData);
        // 将对象转换为数组格式，提取有效的收入项
        const incomes: any[] = [];
        Object.entries(data).forEach(([key, itemData]: [string, any]) => {
          // 跳过已删除的分类
          if (key === 'family-support' || key === 'children-support') {
            return;
          }
          
          if (itemData && typeof itemData === 'object') {
            let amount = 0;
            let name = key;
            
            if (itemData.balance) {
              amount = parseFloat(itemData.balance) || 0;
              name = '企业年金';
            } else if (itemData.monthly) {
              amount = (parseFloat(itemData.monthly) || 0) * 12 / 10000;
              name = '退休金';
            } else if (itemData.amount) {
              amount = parseFloat(itemData.amount) || 0;
              name = key === 'other-income' ? '其他收入' : '其他收入';
            }
            
            if (amount > 0) {
              incomes.push({ name, amount });
            }
          }
        });
        return incomes;
      }
      return [];
    } catch (error) {
      console.error('读取其他收入详情错误:', error);
      return [];
    }
  }, []);

  if (incomeData.totalIncome === 0) {
    return (
      <Card className="p-4 text-center">
        <div className="text-gray-500">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">暂无收入规划数据</p>
          <p className="text-xs text-gray-400 mt-1">请先完成职业规划或其他收入设置</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* 收入合计模块 */}
      <Card className="p-3 bg-gradient-to-br from-[#B3EBEF]/10 to-[#8FD8DC]/10 border-[#B3EBEF]/30">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowBreakdown(!showBreakdown)}
        >
          <div>
            <div className="text-base font-semibold text-gray-900">
              收入合计：{incomeData.totalIncome.toFixed(0)}万元
            </div>
            <div className="text-xs text-gray-600 mt-1">点击查看详细分类</div>
          </div>
          {showBreakdown ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </div>
      </Card>

      {/* 收入明细模块 */}
      {showBreakdown && (
        <div className="space-y-2">
          {/* 职业收入 */}
          {incomeData.careerIncome > 0 && (
            <Card className="p-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <Briefcase className="w-3 h-3 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">职业收入</div>
                  <div className="text-xs text-gray-600">{careerStages.length}个职业阶段</div>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {incomeData.careerIncome.toFixed(0)}万
                </div>
              </div>
              {careerStages.map((stage: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-xs py-1 ml-9">
                  <span className="text-gray-700">{stage.position}</span>
                  <span className="font-medium text-gray-900">
                    {((stage.yearlyIncome * parseInt(stage.duration)) / 10000).toFixed(0)}万
                  </span>
                </div>
              ))}
            </Card>
          )}

          {/* 其他收入 */}
          {incomeData.otherIncome > 0 && (
            <Card className="p-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-3 h-3 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">其他收入</div>
                  <div className="text-xs text-gray-600">{otherIncomeDetails.length}个收入来源</div>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {incomeData.otherIncome.toFixed(0)}万
                </div>
              </div>
              {otherIncomeDetails.map((income: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-xs py-1 ml-9">
                  <span className="text-gray-700">{income.name}</span>
                  <span className="font-medium text-gray-900">{income.amount}万</span>
                </div>
              ))}
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default IncomeDataSummary;
