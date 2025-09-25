import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  logo: text("logo"), // Base64 encoded image string
  country: text("country").notNull(),
  employees: integer("employees").notNull(),
  payslips: integer("payslips").notNull(),
  status: text("status").notNull().default("ACTIVE"),
  version: integer("version").notNull().default(1),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  
  // Company Settings
  registration: text("registration"),
  physicalAddress: text("physical_address"),
  physicalAddressLine2: text("physical_address_line2"),
  physicalAddressLine3: text("physical_address_line3"),
  city: text("city"),
  province: text("province"),
  postalCode: text("postal_code"),
  telephone: text("telephone"),
  fax: text("fax"),
  email: text("email"),
  postalAddress: text("postal_address"),
  postalAddressLine2: text("postal_address_line2"),
  postalAddressLine3: text("postal_address_line3"),
  postalCity: text("postal_city"),
  postalProvince: text("postal_province"),
  postalPostalCode: text("postal_postal_code"),
  timezone: text("timezone"),
  
  // Tax Numbers
  taxNumber: text("tax_number"),
  vatNumber: text("vat_number"),
  payeNumber: text("paye_number"),
  sdlNumber: text("sdl_number"),
  sdlContribution: boolean("sdl_contribution").default(false),
  uifNumber: text("uif_number"),
  uifEmployerReference: text("uif_employer_reference"),
  
  // Rates
  extratimeRate: real("extratime_rate").default(1.33),
  overtimeRate: real("overtime_rate").default(1.5),
  doubletimeRate: real("doubletime_rate").default(2.0),
  lastDayOfWeek: text("last_day_of_week").default("Sunday"),
  
  // Settings
  disableShading: boolean("disable_shading").default(false),
  enableTimekeeping: boolean("enable_timekeeping").default(false),
  
  // South Africa Settings
  eligibleForETI: boolean("eligible_for_eti").default(false),
  monthlyMinimumWage: real("monthly_minimum_wage").default(2000.00),
  tradeClassification: text("trade_classification"),
  industryClassificationCode: text("industry_classification_code"),
  
  // Bank Details
  branchCode: text("branch_code"),
  bankAccountNumber: text("bank_account_number"),
  bankAccountHolderName: text("bank_account_holder_name"),
  bankingReference: text("banking_reference"),
  
  // Tax Type
  taxType: text("tax_type").default("Average"), // "Independent periods" or "Average"
  
  // Payslips Settings
  addOvertimeFromTravel: boolean("add_overtime_from_travel").default(false),
  subtractAbsentFromAllowances: boolean("subtract_absent_from_allowances").default(false),
  showHourlyRate: boolean("show_hourly_rate").default(false),
  showOrdinaryHours: boolean("show_ordinary_hours").default(false),
  addLoansToPayslips: boolean("add_loans_to_payslips").default(true),
  allowChangeLeavePayoutOnPayslips: boolean("allow_change_leave_payout").default(true),
  useOvertimeLeave: boolean("use_overtime_leave").default(false),
  printPublicHolidayOnPayslips: boolean("print_public_holiday").default(false),
  hideZeroOvertimeAndLeave: boolean("hide_zero_overtime_leave").default(true),
  showSdlOnPayslips: boolean("show_sdl_on_payslips").default(false),
  showBankingDetailsOnPayslips: boolean("show_banking_details").default(true),
  showOvertimeRatesOnPayslips: text("show_overtime_rates").default("No"), // "Yes", "No", "Hide words"
  
  // Leave Settings
  automaticLeaveAccrual: boolean("automatic_leave_accrual").default(true),
  sickLeaveDaysPer36Months: real("sick_leave_days_per_36_months").default(30.0),
  annualLeaveDaysPerMonth: real("annual_leave_days_per_month").default(1.25),
  printSickLeaveBalance: text("print_sick_leave_balance").default("No"), // "Yes", "No", "Update all employees"
  printAnnualLeaveBalance: text("print_annual_leave_balance").default("No"),
  printOvertimeLeaveBalance: text("print_overtime_leave_balance").default("No"),
  maternityLeaveIsPaid: boolean("maternity_leave_is_paid").default(false),
  parentalLeaveIsPaid: boolean("parental_leave_is_paid").default(false),
  
  // Contact Person
  contactPersonFirstName: text("contact_person_first_name"),
  contactPersonSurname: text("contact_person_surname"),
  contactPersonBusinessPhone: text("contact_person_business_phone"),
  contactPersonBusinessEmail: text("contact_person_business_email"),
  contactPersonUnitNumber: text("contact_person_unit_number"),
  contactPersonComplex: text("contact_person_complex"),
  contactPersonStreetNumber: text("contact_person_street_number"),
  contactPersonStreetName: text("contact_person_street_name"),
  contactPersonSuburb: text("contact_person_suburb"),
  contactPersonCityTown: text("contact_person_city_town"),
  contactPersonPostalCode: text("contact_person_postal_code"),
  contactPersonCountry: text("contact_person_country").default("South Africa"),
  
  // Declarant
  declarantFirstName: text("declarant_first_name"),
  declarantSurname: text("declarant_surname"),
  declarantIdNumber: text("declarant_id_number"),
  declarantContactEmail: text("declarant_contact_email"),
  declarantInitials: text("declarant_initials"),
  declarantPosition: text("declarant_position"),
  declarantBusinessPhone: text("declarant_business_phone"),
  declarantFaxNumber: text("declarant_fax_number"),
  declarantCellNumber: text("declarant_cell_number"),
  declarantDateOfBirth: text("declarant_date_of_birth"),
  
  // Payslips Type
  payslipType: text("payslip_type").default("A4 - Plain paper - Default layout B"),
  
  // Custom Payperiod
  customPayperiod: boolean("custom_payperiod").default(false),
  customPayperiodName: text("custom_payperiod_name"),
  customPayperiodDays: integer("custom_payperiod_days"),
  customPayperiodFirstDay: text("custom_payperiod_first_day"),
});

// Company Version History Table
export const companyVersions = pgTable("company_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => companies.id),
  version: integer("version").notNull(),
  data: text("data").notNull(), // JSON string of company data at that version
  changedBy: text("changed_by").default("System"),
  changeReason: text("change_reason"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => companies.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  idNumber: text("id_number").notNull(),
  taxNumber: text("tax_number"),
  email: text("email"),
  phone: text("phone"),
  payFrequency: text("pay_frequency").notNull().default("Monthly"),
  rate: real("rate").notNull(),
  rateType: text("rate_type").notNull().default("Salary"),
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  branchCode: text("branch_code"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  status: text("status").notNull().default("ACTIVE"),
});

export const payslips = pgTable("payslips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull().references(() => employees.id),
  companyId: varchar("company_id").notNull().references(() => companies.id),
  payPeriodStart: text("pay_period_start").notNull(),
  payPeriodEnd: text("pay_period_end").notNull(),
  payDate: text("pay_date").notNull(),
  // Earnings
  basicSalary: real("basic_salary").notNull(),
  overtime: real("overtime").default(0),
  allowances: real("allowances").default(0),
  bonus: real("bonus").default(0),
  grossPay: real("gross_pay").notNull(),
  // Deductions
  payeTax: real("paye_tax").default(0),
  uif: real("uif").default(0),
  medicalAid: real("medical_aid").default(0),
  pensionFund: real("pension_fund").default(0),
  otherDeductions: real("other_deductions").default(0),
  totalDeductions: real("total_deductions").notNull(),
  // Net Pay
  netPay: real("net_pay").notNull(),
  // Status
  status: text("status").notNull().default("DRAFT"),
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  version: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompanyVersionSchema = createInsertSchema(companyVersions).omit({
  id: true,
});

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;
export type InsertCompanyVersion = z.infer<typeof insertCompanyVersionSchema>;
export type CompanyVersion = typeof companyVersions.$inferSelect;

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
});

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

export const insertPayslipSchema = createInsertSchema(payslips).omit({
  id: true,
});

export type InsertPayslip = z.infer<typeof insertPayslipSchema>;
export type Payslip = typeof payslips.$inferSelect;
