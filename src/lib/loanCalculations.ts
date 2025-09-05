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