import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  country: text("country").notNull(),
  employees: integer("employees").notNull(),
  payslips: integer("payslips").notNull(),
  status: text("status").notNull().default("ACTIVE"),
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
});

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

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
