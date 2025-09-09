import { 
  calculateMortgageLoanPayment, 
  calculateRemainingMonths, 
  calculateSingleLoanMonthlyPayment,
  type MortgageLoanInfo 
} from '@/lib/loanCalculations';
import type { DebtInfo } from '@/pages/FinancialStatusPage';
import type { CarLoanInfo } from '@/hooks/useCarLoanData';
import type { ConsumerLoanInfo } from '@/hooks/useConsumerLoanData';
import type { BusinessLoanInfo } from '@/hooks/useBusinessLoanData';
import type { PrivateLoanInfo } from '@/hooks/usePrivateLoanData';

// Detailed repayment item with precise due date information
export interface RepaymentItem {
  type: string;
  subType?: string;
  name: string;
  amount: number;
  dueDay: number;
  id?: string;
}

// Helper to extract due day from date string
const getDueDayFromDate = (dateStr?: string, defaultDay: number = 1): number => {
  if (!dateStr) return defaultDay;
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return defaultDay;
    const day = date.getDate();
    return day >= 1 && day <= 31 ? day : defaultDay;
  } catch {
    return defaultDay;
  }
};

// Helper function to determine due day based on repayment method
const getDueDayByMethod = (repaymentMethod: string, startDate?: string, endDate?: string): number => {
  const defaultDay = 1;
  
  // For interest-first and lump-sum: prioritize endDate, then startDate, then default
  if (repaymentMethod === 'interest-first' || repaymentMethod === 'lump-sum') {
    if (endDate) {
      return getDueDayFromDate(endDate, defaultDay);
    } else if (startDate) {
      return getDueDayFromDate(startDate, defaultDay);
    } else {
      return defaultDay;
    }
  }
  
  // For equal payment/principal methods: prioritize startDate, then endDate, then default
  if (startDate) {
    return getDueDayFromDate(startDate, defaultDay);
  } else if (endDate) {
    return getDueDayFromDate(endDate, defaultDay);
  } else {
    return defaultDay;
  }
};

// Load detailed mortgage loan data from localStorage
const loadMortgageLoans = (): MortgageLoanInfo[] => {
  try {
    const sharedMortgage = JSON.parse(localStorage.getItem('shared_loan_data') || '[]');
    return Array.isArray(sharedMortgage) ? sharedMortgage : [];
  } catch (error) {
    console.error('Error loading mortgage loan data:', error);
    return [];
  }
};

// Load detailed car loan data from localStorage
const loadCarLoans = (): CarLoanInfo[] => {
  try {
    const carLoans = JSON.parse(localStorage.getItem('car_loan_data') || '[]');
    return Array.isArray(carLoans) ? carLoans : [];
  } catch (error) {
    console.error('Error loading car loan data:', error);
    return [];
  }
};

// Calculate car loan monthly payment
const calculateCarLoanMonthlyPayment = (loan: CarLoanInfo): number => {
  if (loan.loanType === 'installment') {
    return parseFloat(loan.installmentAmount || '0');
  }
  
  // For bank loans, use remaining months calculation
  const principalWan = parseFloat(loan.remainingPrincipal || loan.principal || '0');
  const annualRate = parseFloat(loan.interestRate || '0') / 100;
  
  if (principalWan <= 0 || annualRate <= 0) return 0;
  
  // Calculate remaining months from dates
  let remainingMonths = 0;
  if (loan.startDateMonth && loan.endDateMonth) {
    const today = new Date();
    const endDate = new Date(loan.endDateMonth);
    const diffTime = endDate.getTime() - today.getTime();
    remainingMonths = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)));
  }
  
  if (remainingMonths <= 0) return 0;
  
  return calculateSingleLoanMonthlyPayment(
    principalWan,
    annualRate,
    loan.repaymentMethod || 'equal-payment',
    remainingMonths
  );
};

// Calculate consumer loan monthly payment
const calculateConsumerLoanMonthlyPayment = (loan: ConsumerLoanInfo): number => {
  const principalWan = parseFloat(loan.remainingPrincipal || loan.loanAmount || '0');
  const annualRate = parseFloat(loan.annualRate || '0') / 100;
  
  if (principalWan <= 0 || annualRate <= 0) return 0;
  
  // Handle different repayment methods
  if (loan.repaymentMethod === 'interest-first') {
    // Interest-only payment: principal × annual rate / 12
    return principalWan * 10000 * annualRate / 12;
  } else if (loan.repaymentMethod === 'lump-sum') {
    // Lump sum at maturity: no monthly payment
    return 0;
  }
  
  // For equal payment/principal methods, calculate remaining months
  let remainingMonths = 0;
  if (loan.endDate) {
    remainingMonths = calculateRemainingMonths(loan.endDate);
  } else if (loan.startDate && loan.loanTerm) {
    const startDate = new Date(loan.startDate);
    const termYears = parseFloat(loan.loanTerm);
    const endDate = new Date(startDate.getFullYear() + termYears, startDate.getMonth(), startDate.getDate());
    remainingMonths = calculateRemainingMonths(endDate.toISOString().split('T')[0]);
  }
  
  if (remainingMonths <= 0) return 0;
  
  return calculateSingleLoanMonthlyPayment(
    principalWan,
    annualRate,
    loan.repaymentMethod,
    remainingMonths
  );
};

// Calculate business loan monthly payment
const calculateBusinessLoanMonthlyPayment = (loan: BusinessLoanInfo): number => {
  const principalWan = parseFloat(loan.remainingPrincipal || loan.loanAmount || '0');
  const annualRate = parseFloat(loan.annualRate || '0') / 100;
  
  if (principalWan <= 0 || annualRate <= 0) return 0;
  
  // Handle different repayment methods
  if (loan.repaymentMethod === 'interest-first') {
    // Interest-only payment: principal × annual rate / 12
    return principalWan * 10000 * annualRate / 12;
  } else if (loan.repaymentMethod === 'lump-sum') {
    // Lump sum at maturity: no monthly payment
    return 0;
  }
  
  // For equal payment/principal methods, calculate remaining months
  let remainingMonths = 0;
  if (loan.endDate) {
    remainingMonths = calculateRemainingMonths(loan.endDate);
  } else if (loan.startDate && loan.loanTerm) {
    const startDate = new Date(loan.startDate);
    const termYears = parseFloat(loan.loanTerm);
    const endDate = new Date(startDate.getFullYear() + termYears, startDate.getMonth(), startDate.getDate());
    remainingMonths = calculateRemainingMonths(endDate.toISOString().split('T')[0]);
  }
  
  if (remainingMonths <= 0) return 0;
  
  return calculateSingleLoanMonthlyPayment(
    principalWan,
    annualRate,
    loan.repaymentMethod,
    remainingMonths
  );
};

// Calculate private loan monthly payment
const calculatePrivateLoanMonthlyPayment = (loan: PrivateLoanInfo): number => {
  const principalWan = parseFloat(loan.loanAmount || '0');
  
  if (principalWan <= 0) return 0;
  
  // Handle different repayment methods
  if (loan.repaymentMethod === 'interest-first') {
    // Calculate annual rate from fen and li
    const fenRate = parseFloat(loan.rateFen || '0') / 100; // 分 to decimal
    const liRate = parseFloat(loan.rateLi || '0') / 1000; // 厘 to decimal
    const annualRate = fenRate + liRate;
    
    if (annualRate <= 0) return 0;
    
    // Interest-only payment: principal × annual rate / 12
    return principalWan * 10000 * annualRate / 12;
  } else if (loan.repaymentMethod === 'lump-sum') {
    // Lump sum at maturity: no monthly payment
    return 0;
  }
  
  // For equal payment/principal methods
  const annualRate = parseFloat(loan.annualRate || '0') / 100;
  if (annualRate <= 0) return 0;
  
  let remainingMonths = 0;
  if (loan.endDate) {
    remainingMonths = calculateRemainingMonths(loan.endDate);
  }
  
  if (remainingMonths <= 0) return 0;
  
  return calculateSingleLoanMonthlyPayment(
    principalWan,
    annualRate,
    loan.repaymentMethod,
    remainingMonths
  );
};

// Build detailed repayment items from all loan data sources
export const buildRepaymentItems = (debts: DebtInfo[]): RepaymentItem[] => {
  const repaymentItems: RepaymentItem[] = [];

  // Process detailed mortgage loans from localStorage
  const mortgageLoans = loadMortgageLoans();
  const processedMortgageIds = new Set<string>();

  if (mortgageLoans.length > 0) {
    mortgageLoans.forEach((loan, idx) => {
      const monthlyPayment = calculateMortgageLoanPayment(loan);
      
      if (monthlyPayment > 0) {
        const safeName = loan.propertyName || `房贷${idx + 1}`;
        
        // Determine due date from loan data
        let startDate = '';
        if (loan.loanType === 'combination') {
          startDate = loan.commercialStartDate || loan.providentStartDate || '';
        } else {
          startDate = loan.loanStartDate || '';
        }
        
        const dueDay = getDueDayFromDate(startDate, 20); // Default to 20th for mortgages
        
        repaymentItems.push({
          id: loan.id,
          type: '房贷',
          name: safeName,
          amount: Math.round(monthlyPayment),
          dueDay,
        });
        
        processedMortgageIds.add(loan.id || safeName);
      }
    });
  }

  // Process detailed car loans from localStorage
  const carLoans = loadCarLoans();
  const processedCarLoanIds = new Set<string>();

  if (carLoans.length > 0) {
    carLoans.forEach((loan, idx) => {
      const monthlyPayment = calculateCarLoanMonthlyPayment(loan);
      
      if (monthlyPayment > 0) {
        const safeName = loan.vehicleName || `车贷${idx + 1}`;
        const subType = loan.loanType === 'bankLoan' ? '银行贷款' : '分期';
        
        // Determine due date from loan data
        let dueDay = 10; // Default
        if (loan.loanType === 'bankLoan' && loan.startDateMonth) {
          dueDay = getDueDayFromDate(loan.startDateMonth, 1);
        } else if (loan.loanType === 'installment' && loan.repaymentDay) {
          dueDay = parseInt(loan.repaymentDay, 10);
        } else {
          dueDay = 10; // Default for installments without repaymentDay
        }
        
        repaymentItems.push({
          id: loan.id,
          type: '车贷',
          subType,
          name: safeName,
          amount: Math.round(monthlyPayment),
          dueDay,
        });
        
        processedCarLoanIds.add(loan.id || safeName);
      }
    });
  }

  // Process detailed consumer, business, and private loans from debt data
  debts.forEach(debt => {
    // Process detailed consumer loans
    if (debt.type === 'consumerLoan' && (debt as any).consumerLoans) {
      const consumerLoans = (debt as any).consumerLoans as ConsumerLoanInfo[];
      consumerLoans.forEach((loan, idx) => {
        if (loan.loanAmount && parseFloat(loan.loanAmount) > 0) {
          const dueDay = getDueDayByMethod(loan.repaymentMethod || 'equal-payment', loan.startDate, loan.endDate);
          const amount = calculateConsumerLoanMonthlyPayment(loan);
          
          if (amount > 0) {
            repaymentItems.push({
              id: loan.id,
              type: '消费贷',
              name: loan.name || `消费贷${idx + 1}`,
              amount: Math.round(amount),
              dueDay,
            });
          }
        }
      });
    }
    
    // Process detailed business loans
    else if (debt.type === 'businessLoan' && (debt as any).businessLoans) {
      const businessLoans = (debt as any).businessLoans as BusinessLoanInfo[];
      businessLoans.forEach((loan, idx) => {
        if (loan.loanAmount && parseFloat(loan.loanAmount) > 0) {
          const dueDay = getDueDayByMethod(loan.repaymentMethod || 'equal-payment', loan.startDate, loan.endDate);
          const amount = calculateBusinessLoanMonthlyPayment(loan);
          
          if (amount > 0) {
            repaymentItems.push({
              id: loan.id,
              type: '经营贷',
              name: loan.name || `经营贷${idx + 1}`,
              amount: Math.round(amount),
              dueDay,
            });
          }
        }
      });
    }
    
    // Process detailed private loans
    else if (debt.type === 'privateLoan' && (debt as any).privateLoans) {
      const privateLoans = (debt as any).privateLoans as PrivateLoanInfo[];
      privateLoans.forEach((loan, idx) => {
        if (loan.loanAmount && parseFloat(loan.loanAmount) > 0) {
          const dueDay = getDueDayByMethod(loan.repaymentMethod || 'equal-payment', loan.startDate, loan.endDate);
          const amount = calculatePrivateLoanMonthlyPayment(loan);
          
          if (amount > 0) {
            repaymentItems.push({
              id: loan.id,
              type: '民间贷',
              name: loan.name || `民间贷${idx + 1}`,
              amount: Math.round(amount),
              dueDay,
            });
          }
        }
      });
    }
    
    // Process aggregated debt types (fallback for backward compatibility)
    else {
      const monthlyPayment = debt.monthlyPayment || 0;
      if (monthlyPayment <= 0 || (debt.remainingMonths || 0) <= 0) return;

      let shouldSkip = false;
      let dueDay = 10; // Default due day

      // Determine due day based on debt type and available data
      switch (debt.type) {
        case 'mortgage':
          // Skip if already processed from localStorage
          if (processedMortgageIds.size > 0) {
            shouldSkip = true;
          } else {
            dueDay = 20;
          }
          break;
        case 'carLoan':
          // Skip if already processed from localStorage
          if (processedCarLoanIds.size > 0) {
            shouldSkip = true;
          } else {
            dueDay = getDueDayFromDate(
              debt.carStartDate ? (typeof debt.carStartDate === 'string' ? debt.carStartDate : debt.carStartDate.toISOString().split('T')[0]) : undefined, 
              25
            );
          }
          break;
        case 'consumerLoan':
          // Use inferred date instead of hardcoded default
          if ((debt as any).startDate) {
            dueDay = getDueDayFromDate((debt as any).startDate);
          } else if ((debt as any).endDate) {
            dueDay = getDueDayFromDate((debt as any).endDate);
          } else {
            dueDay = 1;
          }
          break;
        case 'businessLoan':
          // Use inferred date instead of hardcoded default
          if ((debt as any).startDate) {
            dueDay = getDueDayFromDate((debt as any).startDate);
          } else if ((debt as any).endDate) {
            dueDay = getDueDayFromDate((debt as any).endDate);
          } else {
            dueDay = 1;
          }
          break;
        case 'privateLoan':
          // Use inferred date instead of hardcoded default
          if ((debt as any).startDate) {
            dueDay = getDueDayFromDate((debt as any).startDate);
          } else if ((debt as any).endDate) {
            dueDay = getDueDayFromDate((debt as any).endDate);
          } else {
            dueDay = 1;
          }
          break;
        case 'creditCard':
          dueDay = 5;
          break;
        default:
          dueDay = 1;
      }

      if (!shouldSkip) {
        // Debt type name mapping
        const debtTypeNames: Record<string, string> = {
          mortgage: '房贷',
          carLoan: '车贷', 
          consumerLoan: '消费贷',
          businessLoan: '经营贷',
          privateLoan: '民间贷',
          creditCard: '信用卡'
        };

        repaymentItems.push({
          type: debtTypeNames[debt.type] || debt.type,
          name: debt.name || debtTypeNames[debt.type] || debt.type,
          amount: Math.round(monthlyPayment),
          dueDay,
        });
      }
    }
  });

  return repaymentItems;
};

// Calculate remaining repayments for current month from a specific date
export const calculateCurrentMonthRemaining = (
  repaymentItems: RepaymentItem[], 
  fromDate: Date = new Date()
): number => {
  const currentYear = fromDate.getFullYear();
  const currentMonth = fromDate.getMonth();
  const currentDay = fromDate.getDate();
  
  return repaymentItems.reduce((total, item) => {
    // Create repayment date for current month
    const repaymentDate = new Date(currentYear, currentMonth, item.dueDay);
    
    // Only include if repayment is today or later in the current month
    if (repaymentDate.getMonth() === currentMonth && repaymentDate.getDate() >= currentDay) {
      return total + item.amount;
    }
    
    return total;
  }, 0);
};

// Calculate next month's total repayments
export const calculateNextMonthTotal = (repaymentItems: RepaymentItem[]): number => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const nextMonthYear = nextMonth.getFullYear();
  const nextMonthIndex = nextMonth.getMonth();
  
  return repaymentItems.reduce((total, item) => {
    // Create repayment date for next month
    const repaymentDate = new Date(nextMonthYear, nextMonthIndex, item.dueDay);
    
    // Only include if the repayment date is actually in the next month
    if (repaymentDate.getMonth() === nextMonthIndex && repaymentDate.getFullYear() === nextMonthYear) {
      return total + item.amount;
    }
    
    return total;
  }, 0);
};

// Calculate repayments for a specific date
export const calculateDateRepayments = (
  repaymentItems: RepaymentItem[],
  targetDate: Date
): RepaymentItem[] => {
  const targetDay = targetDate.getDate();
  
  return repaymentItems.filter(item => item.dueDay === targetDay);
};

// Get all repayment dates for a specific month
export const getMonthlyRepaymentDates = (
  repaymentItems: RepaymentItem[],
  year: number,
  month: number,
  fromDate: Date = new Date()
): Map<string, RepaymentItem[]> => {
  const repaymentMap = new Map<string, RepaymentItem[]>();
  
  repaymentItems.forEach(item => {
    const repaymentDate = new Date(year, month, item.dueDay);
    repaymentDate.setHours(0, 0, 0, 0);
    
    // Only include dates from today onwards
    const today = new Date(fromDate);
    today.setHours(0, 0, 0, 0);
    
    if (repaymentDate.getMonth() === month && repaymentDate >= today) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(item.dueDay).padStart(2, '0')}`;
      
      if (!repaymentMap.has(dateKey)) {
        repaymentMap.set(dateKey, []);
      }
      
      repaymentMap.get(dateKey)!.push(item);
    }
  });
  
  return repaymentMap;
};