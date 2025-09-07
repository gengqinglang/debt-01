// 统一的债务数据适配器，用于标准化不同类型的贷款数据结构

export interface NormalizedSummary {
  count: number;
  amountWan: number; // 债务金额（万元）
  monthlyPaymentYuan: number; // 月供（元）
  remainingMonths: number; // 剩余月数
}

export interface NormalizedInterestSummary {
  remainingInterestWan: number; // 剩余利息（万元）
}

// 房贷数据适配器
export const adaptMortgageData = (liveData: any): NormalizedSummary => {
  if (!liveData || !liveData.loans) {
    return { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 };
  }

  const loans = Array.isArray(liveData.loans) ? liveData.loans : [liveData.loans];
  const validLoans = loans.filter((loan: any) => 
    loan && (parseFloat(loan.remainingPrincipal) > 0 || parseFloat(loan.loanAmount) > 0)
  );

  if (validLoans.length === 0) {
    return { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 };
  }

  const totalAmountWan = validLoans.reduce((sum: number, loan: any) => {
    const remainingPrincipal = parseFloat(loan.remainingPrincipal) || 0;
    const loanAmount = parseFloat(loan.loanAmount) || 0;
    return sum + Math.max(remainingPrincipal, loanAmount);
  }, 0);

  const totalMonthlyPaymentYuan = validLoans.reduce((sum: number, loan: any) => {
    // 从calculateLoanStats逻辑计算月供
    const monthlyPayment = loan.monthlyPayment || 0;
    return sum + monthlyPayment;
  }, 0);

  const maxRemainingMonths = Math.max(0, ...validLoans.map((loan: any) => loan.remainingMonths || 0));

  return {
    count: validLoans.length,
    amountWan: totalAmountWan,
    monthlyPaymentYuan: totalMonthlyPaymentYuan,
    remainingMonths: maxRemainingMonths
  };
};

// 车贷数据适配器
export const adaptCarLoanData = (liveData: any): NormalizedSummary => {
  if (!liveData || !liveData.carLoans) {
    return { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 };
  }

  const carLoans = Array.isArray(liveData.carLoans) ? liveData.carLoans : [liveData.carLoans];
  const validLoans = carLoans.filter((loan: any) => {
    if (loan.loanType === 'installment') {
      return parseFloat(loan.installmentAmount) > 0 && parseFloat(loan.remainingInstallments) > 0;
    } else if (loan.loanType === 'bankLoan') {
      return parseFloat(loan.principal) > 0;
    }
    return false;
  });

  if (validLoans.length === 0) {
    return { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 };
  }

  let totalAmountWan = 0;
  let totalMonthlyPaymentYuan = 0;
  let maxRemainingMonths = 0;

  validLoans.forEach((loan: any) => {
    if (loan.loanType === 'installment') {
      const monthlyAmount = parseFloat(loan.installmentAmount) || 0;
      const remainingMonths = parseFloat(loan.remainingInstallments) || 0;
      totalAmountWan += (monthlyAmount * remainingMonths) / 10000; // 转万元
      totalMonthlyPaymentYuan += monthlyAmount;
      maxRemainingMonths = Math.max(maxRemainingMonths, remainingMonths);
    } else if (loan.loanType === 'bankLoan') {
      const principal = parseFloat(loan.principal) || 0;
      const remainingPrincipal = parseFloat(loan.remainingPrincipal) || 0;
      totalAmountWan += Math.max(principal, remainingPrincipal / 10000); // remainingPrincipal是元，需要转万元
      
      // 简单估算月供
      const rate = parseFloat(loan.interestRate) || 0;
      const term = parseFloat(loan.term) || 1;
      if (rate > 0 && term > 0) {
        const monthlyRate = rate / 100 / 12;
        const totalMonths = term * 12;
        const monthlyPayment = (principal * 10000) * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        totalMonthlyPaymentYuan += monthlyPayment;
        maxRemainingMonths = Math.max(maxRemainingMonths, totalMonths);
      }
    }
  });

  return {
    count: validLoans.length,
    amountWan: totalAmountWan,
    monthlyPaymentYuan: totalMonthlyPaymentYuan,
    remainingMonths: maxRemainingMonths
  };
};

// 消费贷数据适配器
export const adaptConsumerLoanData = (liveData: any): NormalizedSummary => {
  if (!liveData || !liveData.consumerLoans) {
    return { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 };
  }

  const loans = Array.isArray(liveData.consumerLoans) ? liveData.consumerLoans : [liveData.consumerLoans];
  const validLoans = loans.filter((loan: any) => parseFloat(loan.loanAmount) > 0);

  if (validLoans.length === 0) {
    return { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 };
  }

  const totalAmountWan = validLoans.reduce((sum: number, loan: any) => {
    return sum + (parseFloat(loan.loanAmount) || 0);
  }, 0);

  // 简化月供计算
  const totalMonthlyPaymentYuan = validLoans.reduce((sum: number, loan: any) => {
    const amount = parseFloat(loan.loanAmount) || 0;
    const rate = parseFloat(loan.annualRate) || 0;
    const term = parseFloat(loan.loanTerm) || 1;
    
    if (rate > 0 && term > 0) {
      const monthlyRate = rate / 100 / 12;
      const totalMonths = term * 12;
      const monthlyPayment = (amount * 10000) * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      return sum + monthlyPayment;
    }
    return sum;
  }, 0);

  const maxRemainingMonths = Math.max(0, ...validLoans.map((loan: any) => {
    const term = parseFloat(loan.loanTerm) || 0;
    return term * 12;
  }));

  return {
    count: validLoans.length,
    amountWan: totalAmountWan,
    monthlyPaymentYuan: totalMonthlyPaymentYuan,
    remainingMonths: maxRemainingMonths
  };
};

// 经营贷数据适配器
export const adaptBusinessLoanData = (liveData: any): NormalizedSummary => {
  if (!liveData || !liveData.businessLoans) {
    return { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 };
  }

  const loans = Array.isArray(liveData.businessLoans) ? liveData.businessLoans : [liveData.businessLoans];
  const validLoans = loans.filter((loan: any) => parseFloat(loan.loanAmount) > 0);

  if (validLoans.length === 0) {
    return { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 };
  }

  const totalAmountWan = validLoans.reduce((sum: number, loan: any) => {
    return sum + (parseFloat(loan.loanAmount) || 0);
  }, 0);

  // 简化月供计算
  const totalMonthlyPaymentYuan = validLoans.reduce((sum: number, loan: any) => {
    const amount = parseFloat(loan.loanAmount) || 0;
    const rate = parseFloat(loan.annualRate) || 0;
    
    if (rate > 0) {
      // 简化计算：假设1年期
      const monthlyRate = rate / 100 / 12;
      const totalMonths = 12;
      const monthlyPayment = (amount * 10000) * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      return sum + monthlyPayment;
    }
    return sum;
  }, 0);

  const maxRemainingMonths = Math.max(0, ...validLoans.map(() => 12)); // 假设1年期

  return {
    count: validLoans.length,
    amountWan: totalAmountWan,
    monthlyPaymentYuan: totalMonthlyPaymentYuan,
    remainingMonths: maxRemainingMonths
  };
};

// 民间贷数据适配器
export const adaptPrivateLoanData = (liveData: any): NormalizedSummary => {
  if (!liveData || !liveData.privateLoans) {
    return { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 };
  }

  const loans = Array.isArray(liveData.privateLoans) ? liveData.privateLoans : [liveData.privateLoans];
  const validLoans = loans.filter((loan: any) => parseFloat(loan.loanAmount) > 0);

  if (validLoans.length === 0) {
    return { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 };
  }

  const totalAmountWan = validLoans.reduce((sum: number, loan: any) => {
    return sum + (parseFloat(loan.loanAmount) || 0);
  }, 0);

  // 简化月供计算
  const totalMonthlyPaymentYuan = validLoans.reduce((sum: number, loan: any) => {
    const amount = parseFloat(loan.loanAmount) || 0;
    const rate = parseFloat(loan.annualRate) || 0;
    
    if (rate > 0) {
      // 简化计算：假设1年期
      const monthlyRate = rate / 100 / 12;
      const totalMonths = 12;
      const monthlyPayment = (amount * 10000) * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      return sum + monthlyPayment;
    }
    return sum;
  }, 0);

  const maxRemainingMonths = Math.max(0, ...validLoans.map(() => 12)); // 假设1年期

  return {
    count: validLoans.length,
    amountWan: totalAmountWan,
    monthlyPaymentYuan: totalMonthlyPaymentYuan,
    remainingMonths: maxRemainingMonths
  };
};

// 信用卡数据适配器
export const adaptCreditCardData = (liveData: any): NormalizedSummary => {
  if (!liveData || !liveData.creditCards) {
    return { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 };
  }

  const cards = Array.isArray(liveData.creditCards) ? liveData.creditCards : [liveData.creditCards];
  const validCards = cards.filter((card: any) => 
    parseFloat(card.currentAmount) > 0 || parseFloat(card.unbilledAmount) > 0
  );

  if (validCards.length === 0) {
    return { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 };
  }

  const totalAmountWan = validCards.reduce((sum: number, card: any) => {
    const currentAmount = parseFloat(card.currentAmount) || 0;
    const unbilledAmount = parseFloat(card.unbilledAmount) || 0;
    return sum + (currentAmount + unbilledAmount) / 10000; // 转万元
  }, 0);

  return {
    count: validCards.length,
    amountWan: totalAmountWan,
    monthlyPaymentYuan: 0, // 信用卡没有固定月供
    remainingMonths: 0
  };
};

// 统一的债务数据标准化函数
export const normalizeDebtData = (categoryType: string, liveData: any): NormalizedSummary => {
  switch (categoryType) {
    case 'mortgage':
      return adaptMortgageData(liveData);
    case 'carLoan':
      return adaptCarLoanData(liveData);
    case 'consumerLoan':
      return adaptConsumerLoanData(liveData);
    case 'businessLoan':
      return adaptBusinessLoanData(liveData);
    case 'privateLoan':
      return adaptPrivateLoanData(liveData);
    case 'creditCard':
      return adaptCreditCardData(liveData);
    default:
      return { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 };
  }
};

// 标准化已确认债务数据
export const normalizeConfirmedDebt = (debt: any): NormalizedSummary => {
  return {
    count: debt.amount > 0 ? 1 : 0,
    amountWan: debt.amount || 0,
    monthlyPaymentYuan: debt.monthlyPayment || 0,
    remainingMonths: debt.remainingMonths || 0
  };
};

// 计算利息的适配器
export const calculateInterestFromNormalizedData = (summary: NormalizedSummary): NormalizedInterestSummary => {
  if (summary.monthlyPaymentYuan > 0 && summary.remainingMonths > 0 && summary.amountWan > 0) {
    const totalPaymentsWan = (summary.monthlyPaymentYuan * summary.remainingMonths) / 10000;
    const interestWan = Math.max(0, totalPaymentsWan - summary.amountWan);
    return { remainingInterestWan: interestWan };
  }
  return { remainingInterestWan: 0 };
};