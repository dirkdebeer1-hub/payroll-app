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
  physicalAddress: text("physical_address").notNull(),
  physicalAddressLine2: text("physical_address_line2"),
  physicalAddressLine3: text("physical_address_line3"),
  city: text("city"),
  province: text("province").notNull(),
  postalCode: text("postal_code").notNull(),
  streetCode: text("street_code").notNull(),
  telephone: text("telephone").notNull(),
  fax: text("fax"),
  email: text("email").notNull(),
  postalAddress: text("postal_address").notNull(),
  postalAddressLine2: text("postal_address_line2"),
  postalAddressLine3: text("postal_address_line3"),
  postalCity: text("postal_city"),
  postalProvince: text("postal_province"),
  postalPostalCode: text("postal_postal_code"),
  timezone: text("timezone"),
  
  // Tax Numbers
  taxNumber: text("tax_number").notNull(),
  vatNumber: text("vat_number"),
  payeNumber: text("paye_number"),
  sdlNumber: text("sdl_number"),
  sdlContribution: boolean("sdl_contribution").default(false),
  uifNumber: text("uif_number"),
  uifNumberDol: text("uif_number_dol"),
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
  bankName: text("bank_name"),
  branchCode: text("branch_code"),
  bankAccountNumber: text("bank_account_number"),
  branchName: text("branch_name").default("Universal bank code"),
  bankAccountHolderName: text("bank_account_holder_name"),
  bankingReference: text("banking_reference"),
  
  // Tax Type
  taxType: text("tax_type").default("Average"), // "Independent periods" or "Average"
  
  // Settings
  enableEmployeeLoanManagement: boolean("enable_employee_loan_management").default(true),
  displayBankDetailsOnPayslips: boolean("display_bank_details_on_payslips").default(true),
  hideZeroValueItems: boolean("hide_zero_value_items").default(true),
  sickLeaveAccrualCycle: real("sick_leave_accrual_cycle").default(30.0),
  annualLeaveAccrualRate: real("annual_leave_accrual_rate").default(1.25),
  showLeaveBalanceOnPayslips: boolean("show_leave_balance_on_payslips").default(true),
  showSickBalanceOnPayslips: boolean("show_sick_balance_on_payslips").default(false),
  showCompanyContributions: boolean("show_company_contributions").default(false),
  
  // Contact Person
  contactPersonFirstName: text("contact_person_first_name").notNull(),
  contactPersonSurname: text("contact_person_surname").notNull(),
  contactPersonBusinessPhone: text("contact_person_business_phone").notNull(),
  contactPersonBusinessEmail: text("contact_person_business_email").notNull(),
  contactPersonUnitNumber: text("contact_person_unit_number"),
  contactPersonComplex: text("contact_person_complex"),
  contactPersonStreetNumber: text("contact_person_street_number"),
  contactPersonStreetName: text("contact_person_street_name"),
  contactPersonSuburb: text("contact_person_suburb"),
  contactPersonCityTown: text("contact_person_city_town"),
  contactPersonPostalCode: text("contact_person_postal_code"),
  contactPersonCountry: text("contact_person_country").default("South Africa"),
  
  // Declarant
  declarantFirstName: text("declarant_first_name").notNull(),
  declarantSurname: text("declarant_surname").notNull(),
  declarantIdNumber: text("declarant_id_number"),
  declarantContactEmail: text("declarant_contact_email").notNull(),
  declarantInitials: text("declarant_initials"),
  declarantPosition: text("declarant_position"),
  declarantBusinessPhone: text("declarant_business_phone").notNull(),
  declarantCellNumber: text("declarant_cell_number"),
  declarantDateOfBirth: text("declarant_date_of_birth"),
  
  // Payslips Type
  payslipType: text("payslip_type").default("Layout 1"),
  
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
}).extend({
  // Extend with additional validation for required fields
  taxNumber: z.string().min(1, "Tax number is required"),
  telephone: z.string().min(1, "Telephone is required"),
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  physicalAddress: z.string().min(1, "Address Line 1 is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().min(1, "Postal Code is required"),
  streetCode: z.string().min(1, "Street Code is required"),
  postalAddress: z.string().min(1, "Postal address is required"),
  
  // Contact Person Required Fields
  contactPersonFirstName: z.string().min(1, "First name is required"),
  contactPersonSurname: z.string().min(1, "Surname is required"),
  contactPersonBusinessPhone: z.string().min(1, "Business phone is required"),
  contactPersonBusinessEmail: z.string().email("Please enter a valid email address").min(1, "Business email is required"),
  
  // Declarant Required Fields  
  declarantFirstName: z.string().min(1, "First name is required"),
  declarantSurname: z.string().min(1, "Surname is required"),
  declarantBusinessPhone: z.string().min(1, "Business phone is required"),
  declarantContactEmail: z.string().email("Please enter a valid email address").min(1, "Contact email is required"),
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
