import { 
  calculateMortgageLoanPayment, 
  calculateRemainingMonths, 
  type MortgageLoanInfo 
} from '@/lib/loanCalculations';
import type { DebtInfo } from '@/pages/FinancialStatusPage';

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
const getDueDayFromDate = (dateStr?: string, defaultDay: number = 10): number => {
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
          amount: monthlyPayment,
          dueDay,
        });
        
        processedMortgageIds.add(loan.id || safeName);
      }
    });
  }

  // Process other debt types from aggregated data
  debts.forEach(debt => {
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
        dueDay = getDueDayFromDate(
          debt.carStartDate ? (typeof debt.carStartDate === 'string' ? debt.carStartDate : debt.carStartDate.toISOString().split('T')[0]) : undefined, 
          25
        );
        break;
      case 'consumerLoan':
        dueDay = 15;
        break;
      case 'businessLoan':
        dueDay = 10;
        break;
      case 'privateLoan':
        dueDay = 25;
        break;
      case 'creditCard':
        dueDay = 5;
        break;
      default:
        dueDay = 10;
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
        amount: monthlyPayment,
        dueDay,
      });
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
  // For next month, we sum all active repayment items
  return repaymentItems.reduce((total, item) => total + item.amount, 0);
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