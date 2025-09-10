/**
 * 实际天数计息工具函数 (ACT/360, ACT/365)
 * 用于"先息后本"还款方式的准确利息计算
 */

export type DayBasis = 360 | 365;

/**
 * 格式化日期为本地时间 YYYY-MM-DD 格式，避免时区问题
 * @param date Date对象
 * @returns YYYY-MM-DD格式的日期字符串
 */
export const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 解析本地日期字符串，避免时区问题
 * @param dateStr YYYY-MM-DD格式的日期字符串
 * @returns Date对象，使用本地时间
 */
export const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

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
 * 生成"先息后本"还款计划，支持指定每月还款日
 * @param principal 本金（万元）
 * @param annualRatePercent 年利率（百分比形式）
 * @param startDate 贷款开始日期 (YYYY-MM-DD)
 * @param endDate 贷款结束日期 (YYYY-MM-DD)
 * @param repaymentDayOfMonth 每月还款日（1-31）
 * @param dayBasis 天数基础，默认360
 * @returns 还款计划数组，包含每期的日期、利息、本金
 */
export const generateInterestFirstScheduleWithDay = (
  principal: number,
  annualRatePercent: number,
  startDate: string,
  endDate: string,
  repaymentDayOfMonth: number,
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
  
  if (!startDate || !endDate || repaymentDayOfMonth < 1 || repaymentDayOfMonth > 28) return schedule;
  
  try {
    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return schedule;
    
    let currentPeriodStart = new Date(start);
    
    while (currentPeriodStart < end) {
      // 计算下一个还款日：设置为下一个月的指定日期  
      let nextPaymentDate = new Date(
        currentPeriodStart.getFullYear(),
        currentPeriodStart.getMonth() + 1,
        repaymentDayOfMonth
      );
      
      // 处理月末日期对齐（如31号在某些月份不存在，使用该月最后一天）
      if (nextPaymentDate.getDate() !== repaymentDayOfMonth) {
        nextPaymentDate = new Date(nextPaymentDate.getFullYear(), nextPaymentDate.getMonth() + 1, 0);
      }
      
      // 确保下一个还款日严格在当前期间开始之后（避免零天期间）
      if (nextPaymentDate <= currentPeriodStart) {
        nextPaymentDate = new Date(
          currentPeriodStart.getFullYear(),
          currentPeriodStart.getMonth() + 2,
          repaymentDayOfMonth
        );
        // 再次处理月末日期对齐
        if (nextPaymentDate.getDate() !== repaymentDayOfMonth) {
          nextPaymentDate = new Date(nextPaymentDate.getFullYear(), nextPaymentDate.getMonth() + 1, 0);
        }
      }
      
      // 如果超过结束日期，调整为结束日期
      const isLastPayment = nextPaymentDate >= end;
      if (isLastPayment) {
        nextPaymentDate = new Date(end);
      }
      
      const fromDateStr = formatDateLocal(currentPeriodStart);
      const toDateStr = formatDateLocal(nextPaymentDate);
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

/**
 * 计算"先息后本"模式下的下一期应还利息
 * 基于每月还款日计算最近的下一个还款期的利息
 * @param principal 本金（万元）
 * @param annualRatePercent 年利率（百分比形式）
 * @param startDate 贷款开始日期 (YYYY-MM-DD)
 * @param endDate 贷款结束日期 (YYYY-MM-DD)
 * @param repaymentDayOfMonth 每月还款日（1-31）
 * @param dayBasis 天数基础，默认360
 * @returns 下一期应还利息（元），如果无法计算则返回null
 */
export const calculateNextPaymentInterest = (
  principal: number,
  annualRatePercent: number,
  startDate: string,
  endDate: string,
  repaymentDayOfMonth: number,
  dayBasis: DayBasis = 360
): number | null => {
  if (!startDate || !endDate || repaymentDayOfMonth < 1 || repaymentDayOfMonth > 28) return null;
  
  const schedule = generateInterestFirstScheduleWithDay(
    principal,
    annualRatePercent,
    startDate,
    endDate,
    repaymentDayOfMonth,
    dayBasis
  );
  
  if (schedule.length === 0) return null;
  
  const today = new Date();
  const todayStr = formatDateLocal(today);
  
  // 找到下一个未到期的还款期
  const nextPayment = schedule.find(payment => payment.toDate >= todayStr);
  
  return nextPayment ? nextPayment.interestPayment : null;
};