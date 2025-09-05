import { useMemo } from 'react';

interface ExpenditureItem {
  label: string;
  amount: number;
  icon: string;
}

export const useExpenditureSummary = () => {
  const expenditureData = useMemo(() => {
    try {
      const requiredLifeData = JSON.parse(localStorage.getItem('requiredLifeData') || '{}');
      const optionalLifeData = JSON.parse(localStorage.getItem('optionalLifeData') || '{}');
      const loanData = JSON.parse(localStorage.getItem('loanData') || '{}');

      // Calculate required life expenses
      const requiredTotal = Object.values(requiredLifeData).reduce((sum: number, value: any) => {
        if (typeof value === 'object' && value !== null) {
          return sum + Number(value.totalAmount || value.amount || 0);
        }
        return sum + Number(value || 0);
      }, 0);

      // Calculate optional life expenses
      const optionalTotal = Object.values(optionalLifeData).reduce((sum: number, value: any) => {
        if (typeof value === 'object' && value !== null) {
          return sum + Number(value.totalAmount || value.amount || 0);
        }
        return sum + Number(value || 0);
      }, 0);

      // Calculate loan total
      const loanTotal = Object.values(loanData).reduce((sum: number, value: any) => {
        if (typeof value === 'object' && value !== null) {
          return sum + Number(value.totalAmount || value.amount || 0);
        }
        return sum + Number(value || 0);
      }, 0);

      const allExpenditureItems: ExpenditureItem[] = [
        { label: '基础生活支出', amount: requiredTotal as number, icon: '🏠' },
        { label: '可选生活支出', amount: optionalTotal as number, icon: '✨' },
        { label: '贷款支出', amount: loanTotal as number, icon: '💳' }
      ];
      
      const expenditureItems: ExpenditureItem[] = allExpenditureItems.filter(item => item.amount > 0);

      const totalExpenditure = expenditureItems.reduce((sum, item) => sum + item.amount, 0);

      return {
        totalExpenditure,
        expenditureItems,
        hasData: expenditureItems.length > 0
      };
    } catch (error) {
      return {
        totalExpenditure: 0,
        expenditureItems: [],
        hasData: false
      };
    }
  }, []);

  return expenditureData;
};