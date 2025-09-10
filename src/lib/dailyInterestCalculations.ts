/**
 * 实际天数计息工具函数 (ACT/360, ACT/365)
 * 用于"先息后本"还款方式的准确利息计算
 */

export type DayBasis = 360 | 365;

/**
 * 计算两个日期之间的实际天数
 * @param fromDate 开始日期 (YYYY-MM-DD)
 * @param toDate 结束日期 (YYYY-MM-DD)
 * @returns 实际天数
 */
export const calculateActualDays = (fromDate: string, toDate: string): number => {
  if (!fromDate || !toDate) return 0;
  
  try {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    
    // 计算实际天数差
    const diffTime = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  } catch {
    return 0;
  }
};

/**
 * 计算日利率
 * @param annualRate 年利率（小数形式，如0.06表示6%）
 * @param dayBasis 天数基础：360或365，默认360
 * @returns 日利率（小数形式）
 */
export const calculateDailyRate = (annualRate: number, dayBasis: DayBasis = 360): number => {
  return annualRate / dayBasis;
};

/**
 * 根据实际天数计算利息
 * @param principal 本金（元）
 * @param annualRate 年利率（小数形式，如0.06表示6%）
 * @param actualDays 实际天数
 * @param dayBasis 天数基础：360或365，默认360
 * @returns 利息金额（元）
 */
export const calculateInterestByActualDays = (
  principal: number,
  annualRate: number,
  actualDays: number,
  dayBasis: DayBasis = 360
): number => {
  if (principal <= 0 || annualRate <= 0 || actualDays <= 0) return 0;
  
  const dailyRate = calculateDailyRate(annualRate, dayBasis);
  return principal * dailyRate * actualDays;
};

/**
 * 计算某个月的实际天数
 * @param year 年份
 * @param month 月份 (1-12)
 * @returns 该月的天数
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

/**
 * 计算从上次还款日到当前还款日的实际天数
 * @param lastRepaymentDate 上次还款日期 (YYYY-MM-DD)
 * @param currentRepaymentDate 当前还款日期 (YYYY-MM-DD)
 * @returns 实际占用天数
 */
export const calculateRepaymentPeriodDays = (
  lastRepaymentDate: string,
  currentRepaymentDate: string
): number => {
  return calculateActualDays(lastRepaymentDate, currentRepaymentDate);
};

/**
 * 计算"先息后本"模式下某期的利息
 * 适用于消费贷、经营贷、民间贷
 * @param principal 本金（万元）
 * @param annualRatePercent 年利率（百分比形式，如6表示6%）
 * @param fromDate 计息开始日期 (YYYY-MM-DD)
 * @param toDate 计息结束日期 (YYYY-MM-DD)
 * @param dayBasis 天数基础：360或365，默认360
 * @returns 该期利息（元）
 */
export const calculateInterestFirstPayment = (
  principal: number,
  annualRatePercent: number,
  fromDate: string,
  toDate: string,
  dayBasis: DayBasis = 360
): number => {
  const principalYuan = principal * 10000; // 万元转元
  const annualRate = annualRatePercent / 100; // 百分比转小数
  const actualDays = calculateActualDays(fromDate, toDate);
  
  return calculateInterestByActualDays(principalYuan, annualRate, actualDays, dayBasis);
};

/**
 * 生成"先息后本"还款计划
 * @param principal 本金（万元）
 * @param annualRatePercent 年利率（百分比形式）
 * @param startDate 贷款开始日期 (YYYY-MM-DD)
 * @param endDate 贷款结束日期 (YYYY-MM-DD)
 * @param dayBasis 天数基础，默认360
 * @returns 还款计划数组，包含每期的日期、利息、本金
 */
export const generateInterestFirstSchedule = (
  principal: number,
  annualRatePercent: number,
  startDate: string,
  endDate: string,
  dayBasis: DayBasis = 360
): Array<{
  fromDate: string;
  toDate: string;
  actualDays: number;
  interestPayment: number;
  principalPayment: number;
  isLastPayment: boolean;
}> => {
  const schedule: Array<{
    fromDate: string;
    toDate: string;
    actualDays: number;
    interestPayment: number;
    principalPayment: number;
    isLastPayment: boolean;
  }> = [];
  
  if (!startDate || !endDate) return schedule;
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return schedule;
    
    const startDay = start.getDate();
    let currentPeriodStart = new Date(start);
    
    while (currentPeriodStart < end) {
      // 计算下一个还款日
      let nextPaymentDate = new Date(
        currentPeriodStart.getFullYear(),
        currentPeriodStart.getMonth() + 1,
        startDay
      );
      
      // 处理月末日期对齐（如31号在某些月份不存在）
      if (nextPaymentDate.getDate() !== startDay) {
        nextPaymentDate = new Date(nextPaymentDate.getFullYear(), nextPaymentDate.getMonth() + 1, 0);
      }
      
      // 如果超过结束日期，调整为结束日期
      const isLastPayment = nextPaymentDate >= end;
      if (isLastPayment) {
        nextPaymentDate = end;
      }
      
      const fromDateStr = currentPeriodStart.toISOString().split('T')[0];
      const toDateStr = nextPaymentDate.toISOString().split('T')[0];
      const actualDays = calculateActualDays(fromDateStr, toDateStr);
      const interestPayment = calculateInterestFirstPayment(
        principal,
        annualRatePercent,
        fromDateStr,
        toDateStr,
        dayBasis
      );
      
      schedule.push({
        fromDate: fromDateStr,
        toDate: toDateStr,
        actualDays,
        interestPayment,
        principalPayment: isLastPayment ? principal * 10000 : 0, // 最后一期还本金
        isLastPayment
      });
      
      if (isLastPayment) break;
      
      currentPeriodStart = new Date(nextPaymentDate);
    }
    
    return schedule;
  } catch {
    return schedule;
  }
};