// 贷款月供计算工具函数

/**
 * 计算等额本息月供
 * @param principal 贷款本金（元）
 * @param annualRate 年利率（小数形式，如0.05表示5%）
 * @param termMonths 贷款期限（月）
 * @returns 月供金额（元）
 */
export const calculateEqualPaymentMonthly = (
  principal: number,
  annualRate: number,
  termMonths: number
): number => {
  if (annualRate === 0) {
    return principal / termMonths;
  }
  
  const monthlyRate = annualRate / 12;
  const monthlyPayment = 
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  
  return monthlyPayment;
};

/**
 * 计算等额本金首期月供
 * @param principal 贷款本金（元）
 * @param annualRate 年利率（小数形式，如0.05表示5%）
 * @param termMonths 贷款期限（月）
 * @returns 首期月供金额（元）
 */
export const calculateEqualPrincipalFirstMonthly = (
  principal: number,
  annualRate: number,
  termMonths: number
): number => {
  const monthlyPrincipal = principal / termMonths;
  const firstMonthInterest = principal * (annualRate / 12);
  return monthlyPrincipal + firstMonthInterest;
};

/**
 * 计算贷款期限（月）基于开始和结束日期
 * @param startDate 开始日期 (YYYY-MM-DD)
 * @param endDate 结束日期 (YYYY-MM-DD)
 * @returns 期限（月）
 */
export const calculateLoanTermMonths = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const yearDiff = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  
  return yearDiff * 12 + monthDiff;
};

/**
 * 格式化金额显示
 * @param amount 金额（元）
 * @returns 格式化后的金额字符串
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// LPR 利率常量
export const LPR_RATES = {
  FIVE_YEAR: 3.50,      // 5年期LPR（公积金）
  FIVE_YEAR_PLUS: 3.50, // 5年期以上LPR（商业）
} as const;

// 贷款信息接口（与useLoanData.ts保持一致）
export interface MortgageLoanInfo {
  id: string;
  propertyName: string;
  loanType: string;
  loanStartDate: string;
  loanEndDate: string;
  rateType: string;
  fixedRate: string;
  floatingRateAdjustment: string;
  paymentMethod: string;
  loanAmount: string;
  remainingPrincipal: string;
  // 组合贷款专用字段
  commercialLoanAmount?: string;
  commercialStartDate?: string;
  commercialEndDate?: string;
  commercialPaymentMethod?: string;
  commercialRateType?: string;
  commercialFixedRate?: string;
  commercialFloatingRateAdjustment?: string;
  commercialRemainingPrincipal?: string;
  providentLoanAmount?: string;
  providentStartDate?: string;
  providentEndDate?: string;
  providentPaymentMethod?: string;
  providentRate?: string;
  providentRemainingPrincipal?: string;
}

/**
 * 计算剩余还款月数（从最近一次已发生的还款日到结束日期）
 * @param startDate 贷款开始日期 (YYYY-MM-DD)
 * @param endDate 贷款结束日期 (YYYY-MM-DD)
 * @param today 当前日期（可选，默认为今天）
 * @returns 剩余月数
 */
export const calculateRemainingMonthsFromLastRepayment = (
  startDate: string, 
  endDate: string, 
  today: Date = new Date()
): number => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  
  // 计算最近一次已发生的还款日（不晚于今天）
  const startDay = start.getDate();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();
  
  let lastRepaymentDate: Date;
  
  if (todayDay >= startDay) {
    // 今天已过本月还款日，使用本月还款日
    lastRepaymentDate = new Date(todayYear, todayMonth, startDay);
  } else {
    // 今天未到本月还款日，使用上月还款日
    lastRepaymentDate = new Date(todayYear, todayMonth - 1, startDay);
  }
  
  // 处理月末日期对齐问题（如：开始日期是31号，但某些月份没有31号）
  if (lastRepaymentDate.getDate() !== startDay) {
    // 如果目标日期不存在（如2月31日），使用该月最后一天
    lastRepaymentDate = new Date(lastRepaymentDate.getFullYear(), lastRepaymentDate.getMonth() + 1, 0);
  }
  
  // 确保最近还款日不早于贷款开始日
  if (lastRepaymentDate.getTime() < start.getTime()) {
    lastRepaymentDate = start;
  }
  
  // 计算从最近还款日到结束日的月数
  const remainingMonths = Math.max(0, 
    (end.getFullYear() - lastRepaymentDate.getFullYear()) * 12 + 
    (end.getMonth() - lastRepaymentDate.getMonth())
  );
  
  return remainingMonths;
};

/**
 * 计算剩余还款月数（旧版本，向后兼容）
 * @param endDate 贷款结束日期 (YYYY-MM-DD)
 * @returns 剩余月数
 */
export const calculateRemainingMonths = (endDate: string): number => {
  if (!endDate) return 0;
  
  const currentDate = new Date();
  const loanEndDate = new Date(endDate);
  if (isNaN(loanEndDate.getTime())) return 0;
  
  const remainingMonths = Math.max(0, 
    (loanEndDate.getFullYear() - currentDate.getFullYear()) * 12 + 
    (loanEndDate.getMonth() - currentDate.getMonth())
  );
  
  return remainingMonths;
};

/**
 * 计算单一贷款月供（商业或公积金）
 * @param principalWan 剩余本金（万元）
 * @param annualRate 年利率（小数形式，如0.035表示3.5%）
 * @param paymentMethod 还款方式：'equal-payment' | 'equal-principal'
 * @param remainingMonths 剩余月数
 * @returns 月供金额（元）
 */
export const calculateSingleLoanMonthlyPayment = (
  principalWan: number,
  annualRate: number,
  paymentMethod: string,
  remainingMonths: number
): number => {
  const principal = principalWan * 10000; // 转换为元
  if (!principal || principal <= 0 || remainingMonths <= 0) return 0;
  if (!isFinite(annualRate) || annualRate <= 0) return 0;

  const monthlyRate = annualRate / 12;

  if (paymentMethod === 'equal-payment') {
    // 等额本息
    return principal * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths) / 
           (Math.pow(1 + monthlyRate, remainingMonths) - 1);
  } else {
    // 等额本金 - 当前月份的还款额
    const monthlyPrincipal = principal / remainingMonths;
    const interest = principal * monthlyRate;
    return monthlyPrincipal + interest;
  }
};

/**
 * 计算商业贷款月供
 * @param loan 贷款信息
 * @returns 月供金额（元）
 */
export const calculateCommercialLoanPayment = (loan: MortgageLoanInfo): number => {
  const principalWan = parseFloat(loan.commercialRemainingPrincipal || '0');
  if (!principalWan || principalWan <= 0) return 0;

  let rate = 0;
  if (loan.commercialRateType === 'fixed') {
    const fixed = parseFloat(loan.commercialFixedRate || '');
    rate = (isFinite(fixed) && fixed > 0) ? fixed / 100 : LPR_RATES.FIVE_YEAR_PLUS / 100;
  } else {
    const adjustmentBP = parseFloat(loan.commercialFloatingRateAdjustment || '0');
    const adjustment = isFinite(adjustmentBP) ? adjustmentBP / 10000 : 0; // BP 转为小数
    rate = LPR_RATES.FIVE_YEAR_PLUS / 100 + adjustment;
  }

  // 使用新的计算方式：从最近还款日计算剩余期数
  let remainingMonths = 0;
  if (loan.commercialStartDate && loan.commercialEndDate) {
    remainingMonths = calculateRemainingMonthsFromLastRepayment(loan.commercialStartDate, loan.commercialEndDate);
  } else if (loan.commercialEndDate) {
    // 向后兼容：如果没有开始日期，使用旧逻辑
    remainingMonths = calculateRemainingMonths(loan.commercialEndDate);
  }
  
  const paymentMethod = loan.commercialPaymentMethod || 'equal-payment';

  return calculateSingleLoanMonthlyPayment(principalWan, rate, paymentMethod, remainingMonths);
};

/**
 * 计算公积金贷款月供
 * @param loan 贷款信息
 * @returns 月供金额（元）
 */
export const calculateProvidentLoanPayment = (loan: MortgageLoanInfo): number => {
  const principalWan = parseFloat(loan.providentRemainingPrincipal || '0');
  if (!principalWan || principalWan <= 0) return 0;

  let rate = parseFloat(loan.providentRate || '');
  rate = (isFinite(rate) && rate > 0) ? rate / 100 : LPR_RATES.FIVE_YEAR / 100;

  // 使用新的计算方式：从最近还款日计算剩余期数
  let remainingMonths = 0;
  if (loan.providentStartDate && loan.providentEndDate) {
    remainingMonths = calculateRemainingMonthsFromLastRepayment(loan.providentStartDate, loan.providentEndDate);
  } else if (loan.providentEndDate) {
    // 向后兼容：如果没有开始日期，使用旧逻辑
    remainingMonths = calculateRemainingMonths(loan.providentEndDate);
  }
  
  const paymentMethod = loan.providentPaymentMethod || 'equal-payment';

  return calculateSingleLoanMonthlyPayment(principalWan, rate, paymentMethod, remainingMonths);
};

/**
 * 计算非组合贷款月供（商业或公积金）
 * @param loan 贷款信息
 * @returns 月供金额（元）
 */
export const calculateNonCombinationLoanPayment = (loan: MortgageLoanInfo): number => {
  const principalWan = parseFloat(loan.remainingPrincipal || '0');
  if (!principalWan || principalWan <= 0) return 0;

  let rate = 0;
  if (loan.rateType === 'fixed') {
    const fixed = parseFloat(loan.fixedRate || '');
    rate = (isFinite(fixed) && fixed > 0)
      ? fixed / 100
      : ((loan.loanType === 'provident' ? LPR_RATES.FIVE_YEAR : LPR_RATES.FIVE_YEAR_PLUS) / 100);
  } else {
    const baseLPR = loan.loanType === 'provident' ? LPR_RATES.FIVE_YEAR : LPR_RATES.FIVE_YEAR_PLUS;
    const adjustmentBP = parseFloat(loan.floatingRateAdjustment || '0');
    const adjustment = isFinite(adjustmentBP) ? adjustmentBP / 10000 : 0; // BP 转为小数
    rate = baseLPR / 100 + adjustment;
  }

  // 使用新的计算方式：从最近还款日计算剩余期数
  let remainingMonths = 0;
  if (loan.loanStartDate && loan.loanEndDate) {
    remainingMonths = calculateRemainingMonthsFromLastRepayment(loan.loanStartDate, loan.loanEndDate);
  } else if (loan.loanEndDate) {
    // 向后兼容：如果没有开始日期，使用旧逻辑
    remainingMonths = calculateRemainingMonths(loan.loanEndDate);
  }
  
  const paymentMethod = loan.paymentMethod || 'equal-payment';

  return calculateSingleLoanMonthlyPayment(principalWan, rate, paymentMethod, remainingMonths);
};

/**
 * 金额单位规范化：自动识别并转换"元"输入为"万元"
 * @param input 输入字符串，可能是万元或元
 * @returns 规范化后的万元数值
 */
export const normalizeWan = (input: string): number => {
  const num = parseFloat(input || '0');
  if (isNaN(num) || num <= 0) return 0;
  
  // 如果数值 > 10000，可能误填了"元"，自动转换为"万元"
  if (num > 10000) {
    return num / 10000;
  }
  
  return num;
};

/**
 * 计算剩余天数（从今天到结束日期）
 * @param endDate 结束日期 (YYYY-MM-DD)
 * @returns 剩余天数
 */
export const calculateRemainingDays = (endDate: string): number => {
  if (!endDate) return 0;
  
  const today = new Date();
  const end = new Date(endDate);
  if (isNaN(end.getTime())) return 0;
  
  const diffTime = end.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

/**
 * 计算房贷月供（统一入口，支持组合贷款）
 * @param loan 贷款信息
 * @returns 月供金额（元）
 */
export const calculateMortgageLoanPayment = (loan: MortgageLoanInfo): number => {
  if (loan.loanType === 'combination') {
    const commercialPayment = calculateCommercialLoanPayment(loan);
    const providentPayment = calculateProvidentLoanPayment(loan);
    return commercialPayment + providentPayment;
  }
  
  return calculateNonCombinationLoanPayment(loan);
};