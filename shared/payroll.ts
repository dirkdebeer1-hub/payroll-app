import type { Company, Employee } from './schema';

// South African tax brackets for 2024/2025 (SARS compliant)
export const SA_TAX_BRACKETS_2024 = [
  { min: 0, max: 237100, rate: 0.18, threshold: 0 },
  { min: 237101, max: 370500, rate: 0.26, threshold: 42678 },
  { min: 370501, max: 512800, rate: 0.31, threshold: 77362 },
  { min: 512801, max: 673000, rate: 0.36, threshold: 121475 },
  { min: 673001, max: 857900, rate: 0.39, threshold: 179147 },
  { min: 857901, max: 1817000, rate: 0.41, threshold: 251258 },
  { min: 1817001, max: Infinity, rate: 0.45, threshold: 644489 }
];

// South African tax rebates for 2024/2025 (annual amounts)
export const SA_TAX_REBATES_2024 = {
  primary: 17235, // Primary rebate for all taxpayers under 65
  secondary: 9444, // Additional rebate for taxpayers 65 and older
  tertiary: 3145   // Additional rebate for taxpayers 75 and older
};

// Medical aid tax credits for 2024/2025 (monthly amounts)
export const SA_MEDICAL_TAX_CREDITS_2024 = {
  mainMember: 364,     // Main member credit
  dependant: 246       // Each dependant (including first dependant)
};

// UIF contribution rates (2024)
export const UIF_RATE = 0.02; // 2% total (split between employer and employee)
export const UIF_EMPLOYEE_RATE = 0.01; // 1% employee contribution
export const UIF_EMPLOYER_RATE = 0.01; // 1% employer contribution
export const UIF_MAX_ANNUAL_INCOME = 177120; // Maximum annual income subject to UIF
export const UIF_MAX_MONTHLY_CONTRIBUTION = 177.12; // Maximum monthly contribution per party (updated June 2021)

// SDL rates (Skills Development Levy)
export const SDL_RATE = 0.01; // 1% of gross salary (employer only, applies to payrolls > R500k annually)
export const SDL_THRESHOLD_ANNUAL = 500000; // Annual payroll threshold for SDL

// Employment Tax Incentive (ETI) for 2024/2025
export const ETI_RATES_2024 = {
  maxMonthlyETI: 1000, // Maximum monthly ETI
  qualifyingEmployeeMaxSalary: 6500, // Monthly salary threshold
  startAge: 18,
  endAge: 29
};

export interface PayrollInput {
  employee: Employee;
  company: Company;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  regularHours?: number;
  overtimeHours?: number;
  doubletimeHours?: number;
  allowances?: number;
  bonus?: number;
  // Pre-tax deductions (reduce taxable income)
  medicalAidContribution?: number;
  pensionFundContribution?: number;
  retirementAnnuityContribution?: number;
  // Post-tax deductions
  medicalAidPostTax?: number;
  otherDeductions?: number;
  // Tax calculation parameters
  employeeAge?: number;
  hasMedicalAid?: boolean;
  medicalAidDependants?: number;
}

export interface PayrollCalculation {
  // Earnings
  basicSalary: number;
  overtime: number;
  allowances: number;
  bonus: number;
  grossPay: number;
  
  // Pre-tax deductions (reduce taxable income)
  medicalAidContribution: number;
  pensionFundContribution: number;
  retirementAnnuityContribution: number;
  totalPreTaxDeductions: number;
  
  // Taxable income after pre-tax deductions
  taxableIncome: number;
  
  // Tax calculations
  payeTax: number;
  uifEmployee: number;
  
  // Post-tax deductions
  medicalAidPostTax: number;
  otherDeductions: number;
  totalPostTaxDeductions: number;
  
  // Total deductions
  totalDeductions: number;
  
  // Net Pay
  netPay: number;
  
  // Employer contributions
  employerContributions: {
    uif: number;
    sdl: number;
    eti: number;
  };
  
  // Breakdown details for transparency
  breakdown: {
    hourlyRate?: number;
    regularHours?: number;
    overtimeHours?: number;
    overtimeRate?: number;
    doubletimeHours?: number;
    doubletimeRate?: number;
    annualizedGrossIncome: number;
    annualizedTaxableIncome: number;
    annualPAYEBeforeRebates: number;
    taxRebates: number;
    medicalTaxCredits: number;
    uifEmployeeContribution: number;
    uifEmployerContribution: number;
  };
}

/**
 * Calculate hourly rate from annual/monthly salary
 */
export function calculateHourlyRate(rate: number, rateType: string, payFrequency: string): number {
  if (rateType === 'Hourly') {
    return rate;
  }
  
  // Convert to hourly rate
  let annualSalary = rate;
  if (payFrequency === 'Monthly') {
    annualSalary = rate * 12;
  } else if (payFrequency === 'Weekly') {
    annualSalary = rate * 52;
  } else if (payFrequency === 'Bi-weekly') {
    annualSalary = rate * 26;
  }
  
  // Assume 8 hours per day, 5 days per week, 52 weeks per year
  const hoursPerYear = 8 * 5 * 52;
  return annualSalary / hoursPerYear;
}

/**
 * Calculate gross pay from basic salary and overtime
 */
export function calculateGrossPay(
  basicSalary: number,
  overtime: number,
  allowances: number = 0,
  bonus: number = 0
): number {
  return basicSalary + overtime + allowances + bonus;
}

/**
 * Calculate overtime pay
 */
export function calculateOvertimePay(
  hourlyRate: number,
  overtimeHours: number = 0,
  doubletimeHours: number = 0,
  overtimeRate: number = 1.5,
  doubletimeRate: number = 2.0
): number {
  const overtimePay = hourlyRate * overtimeHours * overtimeRate;
  const doubletimePay = hourlyRate * doubletimeHours * doubletimeRate;
  return overtimePay + doubletimePay;
}

/**
 * Calculate annual taxable income for PAYE calculation
 */
export function calculateAnnualTaxableIncome(
  monthlyGrossPay: number,
  payFrequency: string
): number {
  if (payFrequency === 'Monthly') {
    return monthlyGrossPay * 12;
  } else if (payFrequency === 'Weekly') {
    return monthlyGrossPay * 52;
  } else if (payFrequency === 'Bi-weekly') {
    return monthlyGrossPay * 26;
  }
  return monthlyGrossPay * 12; // Default to monthly
}

/**
 * Calculate PAYE tax based on South African tax brackets with proper rebates and credits
 */
export function calculatePAYE(
  annualTaxableIncome: number, 
  payFrequency: string = 'Monthly',
  employeeAge?: number,
  hasMedicalAid: boolean = false,
  medicalAidDependants: number = 0
): number {
  // Calculate tax before rebates using progressive brackets
  let annualTaxBeforeRebates = 0;
  
  for (const bracket of SA_TAX_BRACKETS_2024) {
    if (annualTaxableIncome > bracket.min) {
      const taxableInThisBracket = Math.min(
        annualTaxableIncome - bracket.min,
        bracket.max - bracket.min
      );
      annualTaxBeforeRebates = bracket.threshold + (taxableInThisBracket * bracket.rate);
    }
  }
  
  // Calculate tax rebates based on age
  let totalRebates = SA_TAX_REBATES_2024.primary; // Primary rebate for all taxpayers under 65
  
  if (employeeAge && employeeAge >= 65) {
    totalRebates += SA_TAX_REBATES_2024.secondary; // Additional for 65+
  }
  
  if (employeeAge && employeeAge >= 75) {
    totalRebates += SA_TAX_REBATES_2024.tertiary; // Additional for 75+
  }
  
  // Calculate medical aid tax credits (monthly amounts)
  // Credits only apply if employee has medical aid
  let monthlyMedicalCredits = 0;
  if (hasMedicalAid) {
    // Main member always gets the main member credit
    monthlyMedicalCredits = SA_MEDICAL_TAX_CREDITS_2024.mainMember; // R364
    
    // First dependant gets another R364, additional dependants get R246 each
    if (medicalAidDependants > 0) {
      monthlyMedicalCredits += SA_MEDICAL_TAX_CREDITS_2024.mainMember; // First dependant gets R364
      if (medicalAidDependants > 1) {
        // Additional dependants (after first) get R246 each
        monthlyMedicalCredits += (medicalAidDependants - 1) * SA_MEDICAL_TAX_CREDITS_2024.dependant;
      }
    }
  }
  const annualMedicalCredits = monthlyMedicalCredits * 12;
  
  // Apply rebates and credits
  let annualTaxAfterCredits = Math.max(0, annualTaxBeforeRebates - totalRebates - annualMedicalCredits);
  
  // Convert to pay period amount
  if (payFrequency === 'Monthly') {
    return annualTaxAfterCredits / 12;
  } else if (payFrequency === 'Weekly') {
    return annualTaxAfterCredits / 52;
  } else if (payFrequency === 'Bi-weekly') {
    return annualTaxAfterCredits / 26;
  }
  
  return annualTaxAfterCredits / 12; // Default to monthly
}

/**
 * Calculate UIF contribution (employee portion)
 */
export function calculateUIF(grossPay: number, payFrequency: string = 'Monthly'): number {
  const uifContribution = grossPay * UIF_EMPLOYEE_RATE;
  
  // Calculate the maximum contribution based on pay frequency
  let maxContribution = UIF_MAX_MONTHLY_CONTRIBUTION;
  if (payFrequency === 'Weekly') {
    maxContribution = UIF_MAX_MONTHLY_CONTRIBUTION / 4.33; // Approximate weeks per month
  } else if (payFrequency === 'Bi-weekly') {
    maxContribution = UIF_MAX_MONTHLY_CONTRIBUTION / 2.17; // Approximate bi-weeks per month
  }
  
  return Math.min(uifContribution, maxContribution);
}

/**
 * Calculate total deductions
 */
export function calculateTotalDeductions(
  payeTax: number,
  uif: number,
  medicalAid: number = 0,
  pensionFund: number = 0,
  otherDeductions: number = 0
): number {
  return payeTax + uif + medicalAid + pensionFund + otherDeductions;
}

/**
 * Main payroll calculation function
 */
export function calculatePayroll(input: PayrollInput): PayrollCalculation {
  const { employee, company, regularHours = 0, overtimeHours = 0, doubletimeHours = 0 } = input;
  
  // Calculate hourly rate if needed
  const hourlyRate = calculateHourlyRate(employee.rate, employee.rateType, employee.payFrequency);
  
  // Calculate basic salary for the period
  let basicSalary = 0;
  if (employee.rateType === 'Salary') {
    // For salaried employees, use the rate directly based on pay frequency
    basicSalary = employee.rate;
  } else {
    // For hourly employees, calculate based on regular hours
    basicSalary = hourlyRate * regularHours;
  }
  
  // Calculate overtime
  const overtime = calculateOvertimePay(
    hourlyRate,
    overtimeHours,
    doubletimeHours,
    company.overtimeRate ?? 1.5,
    company.doubletimeRate ?? 2.0
  );
  
  // Get allowances and bonus from input
  const allowances = input.allowances || 0;
  const bonus = input.bonus || 0;
  
  // Calculate gross pay
  const grossPay = calculateGrossPay(basicSalary, overtime, allowances, bonus);
  
  // Calculate pre-tax deductions
  const medicalAidContribution = input.medicalAidContribution || 0;
  const pensionFundContribution = input.pensionFundContribution || 0;
  const retirementAnnuityContribution = input.retirementAnnuityContribution || 0;
  const totalPreTaxDeductions = medicalAidContribution + pensionFundContribution + retirementAnnuityContribution;
  
  // Calculate taxable income (gross pay minus pre-tax deductions)
  const taxableIncome = grossPay - totalPreTaxDeductions;
  
  // Calculate annualized taxable income for PAYE
  const annualizedTaxableIncome = calculateAnnualTaxableIncome(taxableIncome, employee.payFrequency);
  
  // Calculate PAYE tax with proper rebates and credits
  const payeTax = calculatePAYE(annualizedTaxableIncome, employee.payFrequency, input.employeeAge, input.hasMedicalAid, input.medicalAidDependants);
  
  // Calculate UIF
  const uifEmployee = calculateUIF(grossPay, employee.payFrequency);
  
  // Calculate post-tax deductions
  const medicalAidPostTax = input.medicalAidPostTax || 0;
  const otherDeductions = input.otherDeductions || 0;
  const totalPostTaxDeductions = medicalAidPostTax + otherDeductions;
  
  // Calculate total deductions
  const totalDeductions = totalPreTaxDeductions + payeTax + uifEmployee + totalPostTaxDeductions;
  
  // Calculate net pay
  const netPay = grossPay - totalDeductions;
  
  // Calculate employer contributions
  const uifEmployer = calculateUIF(grossPay, employee.payFrequency); // Same amount as employee
  
  // SDL applies to employers with annual payroll > R500k (1% of gross salary)
  // This should be determined by company's annual payroll, not ETI eligibility
  const isSubjectToSDL = company.sdlContribution || false; // Company flag indicating annual payroll > R500k
  const sdl = isSubjectToSDL && grossPay > 0 ? grossPay * SDL_RATE : 0;
  
  // ETI is separate from SDL and applies to qualifying employers with young employees
  const eti = company.eligibleForETI ? calculateETI(grossPay, input.employeeAge) : 0;
  
  return {
    basicSalary,
    overtime,
    allowances,
    bonus,
    grossPay,
    medicalAidContribution,
    pensionFundContribution,
    retirementAnnuityContribution,
    totalPreTaxDeductions,
    taxableIncome,
    payeTax,
    uifEmployee,
    medicalAidPostTax,
    otherDeductions,
    totalPostTaxDeductions,
    totalDeductions,
    netPay,
    employerContributions: {
      uif: uifEmployer,
      sdl,
      eti
    },
    breakdown: {
      hourlyRate: employee.rateType === 'Hourly' ? hourlyRate : undefined,
      regularHours: employee.rateType === 'Hourly' ? regularHours : undefined,
      overtimeHours: overtimeHours > 0 ? overtimeHours : undefined,
      overtimeRate: overtimeHours > 0 ? (company.overtimeRate ?? 1.5) : undefined,
      doubletimeHours: doubletimeHours > 0 ? doubletimeHours : undefined,
      doubletimeRate: doubletimeHours > 0 ? (company.doubletimeRate ?? 2.0) : undefined,
      annualizedGrossIncome: calculateAnnualTaxableIncome(grossPay, employee.payFrequency),
      annualizedTaxableIncome,
      annualPAYEBeforeRebates: 0, // Will be calculated in enhanced PAYE function
      taxRebates: 0, // Will be calculated in enhanced PAYE function
      medicalTaxCredits: 0, // Will be calculated in enhanced PAYE function
      uifEmployeeContribution: uifEmployee,
      uifEmployerContribution: uifEmployer,
    }
  };
}

/**
 * Utility function to format currency for South African Rand
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Utility function to format percentage
 */
export function formatPercentage(rate: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(rate);
}