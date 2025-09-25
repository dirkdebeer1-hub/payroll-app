// Test file for payroll calculations
// This would typically use a testing framework like Jest, but for now it's a demonstration

import {
  calculateHourlyRate,
  calculateGrossPay,
  calculateOvertimePay,
  calculatePAYE,
  calculateUIF,
  calculatePayroll,
  formatCurrency,
  SA_TAX_BRACKETS_2024,
  UIF_EMPLOYEE_RATE,
  type PayrollInput
} from './payroll';

import type { Company, Employee } from './schema';

// Mock data for testing
const mockCompany: Company = {
  id: 'test-company',
  name: 'Test Company',
  country: 'South Africa',
  employees: 10,
  payslips: 0,
  status: 'ACTIVE',
  registration: null,
  physicalAddress: null,
  city: null,
  province: null,
  postalCode: null,
  telephone: null,
  fax: null,
  email: null,
  postalAddress: null,
  timezone: null,
  vatNumber: null,
  payeNumber: null,
  sdlNumber: null,
  sdlContribution: false,
  uifNumber: null,
  uifEmployerReference: null,
  extratimeRate: 1.33,
  overtimeRate: 1.5,
  doubletimeRate: 2.0,
  lastDayOfWeek: 'Sunday',
  disableShading: false,
  enableTimekeeping: false,
  eligibleForETI: false,
  monthlyMinimumWage: 2000.00,
  tradeClassification: null,
  industryClassificationCode: null,
  branchCode: null,
  bankAccountNumber: null,
  bankAccountHolderName: null,
  bankingReference: null,
  taxType: 'Average',
  addOvertimeFromTravel: false,
  subtractAbsentFromAllowances: false,
  showHourlyRate: false,
  showOrdinaryHours: false,
  addLoansToPayslips: true,
  allowChangeLeavePayoutOnPayslips: true,
  useOvertimeLeave: false,
  printPublicHolidayOnPayslips: false,
  hideZeroOvertimeAndLeave: true,
  showSdlOnPayslips: false,
  showBankingDetailsOnPayslips: true,
  showOvertimeRatesOnPayslips: 'No',
  automaticLeaveAccrual: true,
  sickLeaveDaysPer36Months: 30.0,
  annualLeaveDaysPerMonth: 1.25,
  printSickLeaveBalance: 'No',
  printAnnualLeaveBalance: 'No',
  printOvertimeLeaveBalance: 'No',
  maternityLeaveIsPaid: false,
  parentalLeaveIsPaid: false,
  contactPersonFirstName: null,
  contactPersonSurname: null,
  contactPersonBusinessPhone: null,
  contactPersonBusinessEmail: null,
  contactPersonUnitNumber: null,
  contactPersonComplex: null,
  contactPersonStreetNumber: null,
  contactPersonStreetName: null,
  contactPersonSuburb: null,
  contactPersonCityTown: null,
  contactPersonPostalCode: null,
  contactPersonCountry: 'South Africa',
  declarantFirstName: null,
  declarantSurname: null,
  declarantIdNumber: null,
  declarantContactEmail: null,
  declarantInitials: null,
  declarantPosition: null,
  declarantBusinessPhone: null,
  declarantFaxNumber: null,
  declarantCellNumber: null,
  declarantDateOfBirth: null,
  payslipType: 'A4 - Plain paper - Default layout B',
  customPayperiod: false,
  customPayperiodName: null,
  customPayperiodDays: null,
  customPayperiodFirstDay: null
};

const mockSalariedEmployee: Employee = {
  id: 'emp-1',
  companyId: 'test-company',
  firstName: 'John',
  lastName: 'Doe',
  idNumber: '9001015555088',
  taxNumber: 'TAX001',
  email: 'john@test.com',
  phone: '+27 82 555 0001',
  payFrequency: 'Monthly',
  rate: 25000, // R25,000 per month
  rateType: 'Salary',
  bankName: 'FNB',
  accountNumber: '62123456789',
  branchCode: '250655',
  startDate: '2023-01-15',
  endDate: null,
  status: 'ACTIVE'
};

const mockHourlyEmployee: Employee = {
  id: 'emp-2',
  companyId: 'test-company',
  firstName: 'Jane',
  lastName: 'Smith',
  idNumber: '8505204444077',
  taxNumber: 'TAX002',
  email: 'jane@test.com',
  phone: '+27 83 555 0002',
  payFrequency: 'Monthly',
  rate: 150, // R150 per hour
  rateType: 'Hourly',
  bankName: 'Standard Bank',
  accountNumber: '10123456789',
  branchCode: '051001',
  startDate: '2022-06-01',
  endDate: null,
  status: 'ACTIVE'
};

// Test functions (these would normally use a testing framework)
export function testCalculateHourlyRate() {
  console.log('Testing calculateHourlyRate...');
  
  // Test salaried employee
  const salariedHourlyRate = calculateHourlyRate(25000, 'Salary', 'Monthly');
  const expectedSalariedRate = (25000 * 12) / (8 * 5 * 52); // ~144.23
  console.log(`Salaried hourly rate: ${salariedHourlyRate.toFixed(2)} (expected: ~144.23)`);
  
  // Test hourly employee
  const hourlyRate = calculateHourlyRate(150, 'Hourly', 'Monthly');
  console.log(`Hourly rate: ${hourlyRate} (expected: 150)`);
  
  return salariedHourlyRate > 144 && salariedHourlyRate < 145 && hourlyRate === 150;
}

export function testCalculateOvertimePay() {
  console.log('Testing calculateOvertimePay...');
  
  const hourlyRate = 150;
  const overtimeHours = 5;
  const doubletimeHours = 2;
  const overtimeRate = 1.5;
  const doubletimeRate = 2.0;
  
  const overtime = calculateOvertimePay(hourlyRate, overtimeHours, doubletimeHours, overtimeRate, doubletimeRate);
  const expected = (150 * 5 * 1.5) + (150 * 2 * 2.0); // 1125 + 600 = 1725
  
  console.log(`Overtime pay: ${overtime} (expected: 1725)`);
  return overtime === expected;
}

export function testCalculatePAYE() {
  console.log('Testing calculatePAYE...');
  
  // Test with R25,000 monthly salary (R300,000 annually)
  const annualSalary = 300000;
  const monthlyPAYE = calculatePAYE(annualSalary, 'Monthly');
  
  // R300,000 falls in the second tax bracket (237,101 - 370,500)
  // PAYE = 42,678 + ((300,000 - 237,100) * 0.26) = 42,678 + 16,354 = 59,032 annually
  // Monthly = 59,032 / 12 = 4,919.33
  const expectedMonthly = 59032 / 12;
  
  console.log(`Monthly PAYE: ${monthlyPAYE.toFixed(2)} (expected: ~${expectedMonthly.toFixed(2)})`);
  return Math.abs(monthlyPAYE - expectedMonthly) < 1; // Allow small rounding differences
}

export function testCalculateUIF() {
  console.log('Testing calculateUIF...');
  
  const grossPay = 25000;
  const uif = calculateUIF(grossPay);
  const expected = grossPay * UIF_EMPLOYEE_RATE; // 25000 * 0.01 = 250
  
  console.log(`UIF contribution: ${uif} (expected: ${expected})`);
  return uif === expected;
}

export function testCalculatePayroll() {
  console.log('Testing calculatePayroll (salaried employee)...');
  
  const payrollInput: PayrollInput = {
    employee: mockSalariedEmployee,
    company: mockCompany,
    payPeriodStart: '2024-01-01',
    payPeriodEnd: '2024-01-31',
    payDate: '2024-01-31',
    regularHours: 160, // Not used for salaried employees
    overtimeHours: 10,
    allowances: 1000,
    bonus: 2000
  };
  
  const result = calculatePayroll(payrollInput);
  
  console.log('Payroll calculation result:');
  console.log(`Basic Salary: ${formatCurrency(result.basicSalary)}`);
  console.log(`Overtime: ${formatCurrency(result.overtime)}`);
  console.log(`Allowances: ${formatCurrency(result.allowances)}`);
  console.log(`Bonus: ${formatCurrency(result.bonus)}`);
  console.log(`Gross Pay: ${formatCurrency(result.grossPay)}`);
  console.log(`PAYE Tax: ${formatCurrency(result.payeTax)}`);
  console.log(`UIF: ${formatCurrency(result.uif)}`);
  console.log(`Total Deductions: ${formatCurrency(result.totalDeductions)}`);
  console.log(`Net Pay: ${formatCurrency(result.netPay)}`);
  
  // Basic validations
  const expectedGrossPay = result.basicSalary + result.overtime + result.allowances + result.bonus;
  const expectedNetPay = result.grossPay - result.totalDeductions;
  
  console.log(`Gross pay calculation correct: ${result.grossPay === expectedGrossPay}`);
  console.log(`Net pay calculation correct: ${result.netPay === expectedNetPay}`);
  
  return result.grossPay === expectedGrossPay && result.netPay === expectedNetPay;
}

export function testCalculatePayrollHourly() {
  console.log('Testing calculatePayroll (hourly employee)...');
  
  const payrollInput: PayrollInput = {
    employee: mockHourlyEmployee,
    company: mockCompany,
    payPeriodStart: '2024-01-01',
    payPeriodEnd: '2024-01-31',
    payDate: '2024-01-31',
    regularHours: 160,
    overtimeHours: 8,
    allowances: 500
  };
  
  const result = calculatePayroll(payrollInput);
  
  console.log('Hourly employee payroll calculation:');
  console.log(`Basic Salary (160 hrs @ R150): ${formatCurrency(result.basicSalary)}`);
  console.log(`Overtime (8 hrs @ R225): ${formatCurrency(result.overtime)}`);
  console.log(`Gross Pay: ${formatCurrency(result.grossPay)}`);
  console.log(`Net Pay: ${formatCurrency(result.netPay)}`);
  
  // Expected basic salary: 160 * 150 = 24,000
  // Expected overtime: 8 * 150 * 1.5 = 1,800
  const expectedBasic = 160 * 150;
  const expectedOvertime = 8 * 150 * 1.5;
  
  console.log(`Basic salary correct: ${result.basicSalary === expectedBasic}`);
  console.log(`Overtime correct: ${result.overtime === expectedOvertime}`);
  
  return result.basicSalary === expectedBasic && result.overtime === expectedOvertime;
}

// Run all tests
export function runAllPayrollTests() {
  console.log('=== PAYROLL CALCULATION TESTS ===\n');
  
  const tests = [
    testCalculateHourlyRate,
    testCalculateOvertimePay,
    testCalculatePAYE,
    testCalculateUIF,
    testCalculatePayroll,
    testCalculatePayrollHourly
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const result = test();
      if (result) {
        console.log('✅ PASSED\n');
        passed++;
      } else {
        console.log('❌ FAILED\n');
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error}\n`);
    }
  }
  
  console.log(`=== TEST SUMMARY: ${passed}/${total} tests passed ===`);
  return passed === total;
}