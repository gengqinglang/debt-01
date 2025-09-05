import { useState, useEffect, useMemo } from 'react';

export interface ExpenditureItem {
  id: string;
  name: string;
  type: 'required' | 'optional';
  category: string;
  amount: number;
  selectedLevel?: string;
  isCustom?: boolean;
}

const useExpenditureData = () => {
  const [expenditureData, setExpenditureData] = useState<ExpenditureItem[]>([]);

  // 定义基础支出项目和默认档位 - 更新可选科目的默认档位
  const baseExpenditureItems: ExpenditureItem[] = [
    { id: 'basic-life', name: '基础生活', type: 'required', category: '基础生活规划', amount: 800, selectedLevel: '小康滋润版' },
    { id: 'education', name: '教育', type: 'required', category: '子女教育规划', amount: 200, selectedLevel: '学科投资型' },
    { id: 'medical', name: '医疗', type: 'required', category: '医疗保健规划', amount: 300, selectedLevel: '全面守护' },
    { id: 'retirement', name: '养老', type: 'required', category: '养老规划', amount: 600, selectedLevel: '舒适体验版' },
    { id: 'travel', name: '大额消费', type: 'required', category: '旅游规划', amount: 50, selectedLevel: '人间清醒版' },
    { id: 'loan-interest', name: '贷款还款利息', type: 'required', category: '贷款利息支出', amount: 234, selectedLevel: '标准利息', isCustom: true },
    { id: 'loan-principal', name: '贷款还款本金', type: 'required', category: '贷款本金支出', amount: 210, selectedLevel: '标准本金', isCustom: true },
    { id: 'marriage', name: '结婚', type: 'optional', category: 'marriage', amount: 50, selectedLevel: '轻简甜蜜版' },
    { id: 'birth', name: '生育', type: 'optional', category: 'birth', amount: 30, selectedLevel: '简约温馨版' },
    { id: 'housing', name: '居住', type: 'optional', category: 'housing', amount: 500, selectedLevel: '改善型住房' },
    { id: 'car', name: '交通', type: 'optional', category: 'car', amount: 150, selectedLevel: '通勤神器' },
    { id: 'care', name: '赡养', type: 'optional', category: 'care', amount: 200, selectedLevel: '基础关怀版' }
  ];

  // 获取 required-life 数据
  const getRequiredLifeData = () => {
    try {
      const savedData = localStorage.getItem('requiredLifeData');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error reading required life data:', error);
    }
    return null;
  };

  // 获取 optional-life 数据
  const getOptionalLifeData = () => {
    try {
      const savedData = localStorage.getItem('optionalLifeData');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error reading optional life data:', error);
    }
    return null;
  };

  // 初始化数据
  useEffect(() => {
    const requiredData = getRequiredLifeData();
    const optionalData = getOptionalLifeData();
    
    const updatedItems = baseExpenditureItems.map(item => {
      if (item.type === 'required' && requiredData?.selectedSubjectLevels?.[item.category]) {
        const isCustomAmount = requiredData.customAmounts && requiredData.customAmounts[item.category];
        return {
          ...item,
          selectedLevel: requiredData.selectedSubjectLevels[item.category],
          amount: isCustomAmount ? 
            parseFloat(requiredData.customAmounts[item.category]) : 
            item.amount,
          isCustom: !!isCustomAmount
        };
      }
      
      if (item.type === 'optional' && optionalData?.breakdown?.[item.category]) {
        return {
          ...item,
          amount: optionalData.breakdown[item.category],
          isCustom: true // Optional items are typically custom configured
        };
      }
      
      return item;
    });

    setExpenditureData(updatedItems);
  }, []);

  // 更新支出项目
  const updateExpenditureItem = (id: string, updates: Partial<ExpenditureItem>) => {
    setExpenditureData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
    
    // 同步到 localStorage
    const item = expenditureData.find(item => item.id === id);
    if (item) {
      if (item.type === 'required') {
        const requiredData = getRequiredLifeData() || { selectedSubjectLevels: {}, customAmounts: {} };
        
        if (updates.selectedLevel) {
          requiredData.selectedSubjectLevels = {
            ...requiredData.selectedSubjectLevels,
            [item.category]: updates.selectedLevel
          };
        }
        
        if (updates.amount !== undefined) {
          if (updates.isCustom) {
            requiredData.customAmounts = {
              ...requiredData.customAmounts,
              [item.category]: updates.amount.toString()
            };
          } else {
            // Remove custom amount if not custom
            if (requiredData.customAmounts && requiredData.customAmounts[item.category]) {
              delete requiredData.customAmounts[item.category];
            }
          }
        }
        
        localStorage.setItem('requiredLifeData', JSON.stringify(requiredData));
      } else if (item.type === 'optional') {
        const optionalData = getOptionalLifeData() || { breakdown: {}, totalAmount: 0 };
        
        if (updates.amount !== undefined) {
          optionalData.breakdown[item.category] = updates.amount;
          
          // Recalculate total amount
          optionalData.totalAmount = Object.values(optionalData.breakdown).reduce(
            (sum: number, amount: any) => sum + (typeof amount === 'number' ? amount : 0), 
            0
          );
        }
        
        localStorage.setItem('optionalLifeData', JSON.stringify(optionalData));
      }
    }
  };

  // 新增支出项目
  const addExpenditureItem = (newItem: ExpenditureItem) => {
    setExpenditureData(prev => {
      // 检查是否已存在该项目
      const exists = prev.some(item => item.id === newItem.id);
      if (exists) {
        return prev;
      }
      return [...prev, newItem];
    });

    // 同步到 localStorage
    if (newItem.type === 'optional') {
      const optionalData = getOptionalLifeData() || { breakdown: {}, totalAmount: 0 };
      
      optionalData.breakdown[newItem.category] = newItem.amount;
      
      // Recalculate total amount
      optionalData.totalAmount = Object.values(optionalData.breakdown).reduce(
        (sum: number, amount: any) => sum + (typeof amount === 'number' ? amount : 0), 
        0
      );
      
      localStorage.setItem('optionalLifeData', JSON.stringify(optionalData));
    }
  };

  const totalAmount = useMemo(() => {
    return expenditureData.reduce((sum, item) => sum + item.amount, 0);
  }, [expenditureData]);

  return {
    expenditureData,
    totalAmount,
    updateExpenditureItem,
    addExpenditureItem
  };
};

export default useExpenditureData;
