import { useState, useCallback } from 'react';

export interface CreditCardInfo {
  id: string;
  name?: string; // 信用卡名称（非必输）
  currentAmount: string; // 本期待还金额（元）
  unbilledAmount: string; // 未出账单金额（元）
}

export const useCreditCardData = (initialData?: CreditCardInfo[]) => {
  const [creditCards, setCreditCards] = useState<CreditCardInfo[]>(
    initialData && initialData.length > 0 
      ? initialData 
      : [{ 
          id: crypto.randomUUID(), 
          name: '',
          currentAmount: '',
          unbilledAmount: ''
        }]
  );

  const addCreditCard = useCallback(() => {
    const newCreditCard: CreditCardInfo = {
      id: crypto.randomUUID(),
      name: '',
      currentAmount: '',
      unbilledAmount: ''
    };
    setCreditCards(prev => [...prev, newCreditCard]);
  }, []);

  const removeCreditCard = useCallback((id: string) => {
    setCreditCards(prev => prev.length > 1 ? prev.filter(card => card.id !== id) : prev);
  }, []);

  const updateCreditCard = useCallback((id: string, field: keyof CreditCardInfo, value: string) => {
    setCreditCards(prev => prev.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ));
  }, []);

  // 检查信用卡信息是否完整
  const isCreditCardComplete = useCallback((creditCard: CreditCardInfo): boolean => {
    return Boolean(
      (creditCard.currentAmount && parseFloat(creditCard.currentAmount) > 0) ||
      (creditCard.unbilledAmount && parseFloat(creditCard.unbilledAmount) > 0)
    );
  }, []);

  // 计算汇总数据
  const getAggregatedData = useCallback(() => {
    const completeCards = creditCards.filter(isCreditCardComplete);
    
    if (completeCards.length === 0) {
      return {
        count: 0,
        totalCurrentAmount: 0,
        totalUnbilledAmount: 0,
        totalAmount: 0
      };
    }

    const totalCurrentAmount = completeCards.reduce((sum, card) => {
      return sum + (parseFloat(card.currentAmount) || 0);
    }, 0);

    const totalUnbilledAmount = completeCards.reduce((sum, card) => {
      return sum + (parseFloat(card.unbilledAmount) || 0);
    }, 0);

    const totalAmount = totalCurrentAmount + totalUnbilledAmount;

    return {
      count: completeCards.length,
      totalCurrentAmount,
      totalUnbilledAmount,
      totalAmount: totalAmount / 10000 // 转换为万元
    };
  }, [creditCards, isCreditCardComplete]);

  return {
    creditCards,
    addCreditCard,
    removeCreditCard,
    updateCreditCard,
    isCreditCardComplete,
    getAggregatedData
  };
};