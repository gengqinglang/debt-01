import { useMemo } from 'react';

interface IncomeItem {
  label: string;
  amount: number;
  icon: string;
}

export const useIncomeSummary = () => {
  const incomeData = useMemo(() => {
    try {
      const futureIncomeData = JSON.parse(localStorage.getItem('futureIncomeData') || '{}');
      const careerData = JSON.parse(localStorage.getItem('careerData') || '{}');
      
      // Calculate career income
      const careerIncome = careerData.stages?.reduce((total: number, stage: any) => {
        return total + (stage.annualIncome || 0);
      }, 0) || 0;

      // Get other income sources
      const personalIncome = futureIncomeData.personalIncome || 0;
      const partnerIncome = futureIncomeData.partnerIncome || 0;
      const rentalIncome = futureIncomeData.rentalIncome || 0;
      const otherIncome = futureIncomeData.otherIncome || 0;

      const incomeItems: IncomeItem[] = [
        { label: '职业收入', amount: careerIncome, icon: '💼' },
        { label: '个人收入', amount: personalIncome, icon: '👤' },
        { label: '伴侣收入', amount: partnerIncome, icon: '👫' },
        { label: '租赁收入', amount: rentalIncome, icon: '🏠' },
        { label: '其他收入', amount: otherIncome, icon: '💰' }
      ].filter(item => item.amount > 0);

      const totalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0);

      return {
        totalIncome,
        incomeItems,
        hasData: incomeItems.length > 0
      };
    } catch (error) {
      return {
        totalIncome: 0,
        incomeItems: [],
        hasData: false
      };
    }
  }, []);

  return incomeData;
};