import { type Company, type InsertCompany, type Employee, type InsertEmployee, type Payslip, type InsertPayslip } from "@shared/schema";
import { calculatePayroll, type PayrollInput, type PayrollCalculation } from "@shared/payroll";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Company operations
  getCompany(id: string): Promise<Company | undefined>;
  getAllCompanies(): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, updates: Partial<InsertCompany>): Promise<Company | undefined>;
  deleteCompany(id: string): Promise<boolean>;
  
  // Employee operations
  getEmployee(id: string): Promise<Employee | undefined>;
  getAllEmployees(): Promise<Employee[]>;
  getEmployeesByCompanyId(companyId: string): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, updates: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;
  
  // Payslip operations
  getPayslip(id: string): Promise<Payslip | undefined>;
  getAllPayslips(): Promise<Payslip[]>;
  getPayslipsByCompanyId(companyId: string): Promise<Payslip[]>;
  getPayslipsByEmployeeId(employeeId: string): Promise<Payslip[]>;
  createPayslip(payslip: InsertPayslip): Promise<Payslip>;
  updatePayslip(id: string, updates: Partial<InsertPayslip>): Promise<Payslip | undefined>;
  deletePayslip(id: string): Promise<boolean>;
  getPayslipsByPeriod(startDate: string, endDate: string): Promise<Payslip[]>;
  
  // Payroll calculation operations
  calculatePayrollForEmployee(input: PayrollInput): Promise<PayrollCalculation>;
  generatePayslipFromCalculation(
    employeeId: string, 
    companyId: string, 
    calculation: PayrollCalculation, 
    payPeriodStart: string,
    payPeriodEnd: string,
    payDate: string
  ): Promise<Payslip>;
}

export class MemStorage implements IStorage {
  private companies: Map<string, Company>;
  private employees: Map<string, Employee>;
  private payslips: Map<string, Payslip>;

  constructor() {
    this.companies = new Map();
    this.employees = new Map();
    this.payslips = new Map();
    // //todo: remove mock functionality - Add some sample data
    this.seedData();
  }

  private seedData() {
    const sampleCompanies: InsertCompany[] = [
      { name: "Actum Innovations (Pty) Ltd", country: "South Africa", employees: 1, payslips: 31 },
      { name: "AE South Africa (Pty) Ltd", country: "South Africa", employees: 3, payslips: 89 },
      { name: "Almeria 240 ICHAF (Pty) Ltd", country: "South Africa", employees: 7, payslips: 203 },
      { name: "Anti-Thing Transport Co", country: "South Africa", employees: 5, payslips: 110 },
      { name: "Art-Plastaforn CC", country: "South Africa", employees: 3, payslips: 42 },
      { name: "Asset Healthcare Solutions CC", country: "South Africa", employees: 4, payslips: 118 },
      { name: "Career Indaba NPC", country: "South Africa", employees: 2, payslips: 3 },
      { name: "Carls Cronje Designs (Pty) Ltd", country: "South Africa", employees: 3, payslips: 23 },
      { name: "Crontech Consulting", country: "South Africa", employees: 8, payslips: 256 },
      { name: "Danmig (Pty) Ltd", country: "South Africa", employees: 5, payslips: 173 },
      { name: "DCKO (Pty) Ltd", country: "South Africa", employees: 6, payslips: 88 },
      { name: "DDD Electrical (Pty) Ltd", country: "South Africa", employees: 4, payslips: 46 },
      { name: "Exceptional Marketing", country: "South Africa", employees: 2, payslips: 32 },
      { name: "Frontier Psychology (Pty) Ltd", country: "South Africa", employees: 2, payslips: 43 },
    ];

    // Create companies first and get the first company ID for employees
    let firstCompanyId = '';
    sampleCompanies.forEach((company, index) => {
      const id = randomUUID();
      if (index === 0) firstCompanyId = id;
      const newCompany: Company = { 
        ...company, 
        id, 
        status: "ACTIVE",
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        logo: company.logo || null,
        // Set registration numbers for some sample companies for testing duplicate validation
        registration: index === 0 ? "2006165834" : index === 1 ? "2007123456" : index === 2 ? "2008789012" : null,
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
        lastDayOfWeek: "Sunday",
        disableShading: false,
        enableTimekeeping: false,
        eligibleForETI: false,
        monthlyMinimumWage: 2000.0,
        tradeClassification: null,
        industryClassificationCode: null,
        branchCode: null,
        bankAccountNumber: null,
        bankAccountHolderName: null,
        bankingReference: null,
        taxType: "Average",
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
        showOvertimeRatesOnPayslips: "No",
        automaticLeaveAccrual: true,
        sickLeaveDaysPer36Months: 30.0,
        annualLeaveDaysPerMonth: 1.25,
        printSickLeaveBalance: "No",
        printAnnualLeaveBalance: "No",
        printOvertimeLeaveBalance: "No",
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
        contactPersonCountry: "South Africa",
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
        payslipType: "A4 - Plain paper - Default layout B",
        customPayperiod: false,
        customPayperiodName: null,
        customPayperiodDays: null,
        customPayperiodFirstDay: null
      };
      this.companies.set(id, newCompany);
    });

    // Add sample employees
    const sampleEmployees: InsertEmployee[] = [
      {
        companyId: firstCompanyId,
        firstName: 'John',
        lastName: 'Smith',
        idNumber: '9001015555088',
        taxNumber: 'TAX001',
        email: 'john.smith@company.com',
        phone: '+27 82 555 0001',
        payFrequency: 'Monthly',
        rate: 25000,
        rateType: 'Salary',
        bankName: 'FNB',
        accountNumber: '62123456789',
        branchCode: '250655',
        startDate: '2023-01-15',
        endDate: null,
        status: 'ACTIVE'
      },
      {
        companyId: firstCompanyId,
        firstName: 'Sarah',
        lastName: 'Johnson',
        idNumber: '8505204444077',
        taxNumber: 'TAX002',
        email: 'sarah.johnson@company.com',
        phone: '+27 83 555 0002',
        payFrequency: 'Monthly',
        rate: 30000,
        rateType: 'Salary',
        bankName: 'Standard Bank',
        accountNumber: '10123456789',
        branchCode: '051001',
        startDate: '2022-06-01',
        endDate: null,
        status: 'ACTIVE'
      },
      {
        companyId: firstCompanyId,
        firstName: 'Michael',
        lastName: 'Brown',
        idNumber: '7809123333066',
        taxNumber: 'TAX003',
        email: 'michael.brown@company.com',
        phone: '+27 84 555 0003',
        payFrequency: 'Monthly',
        rate: 28000,
        rateType: 'Salary',
        bankName: 'ABSA',
        accountNumber: '40123456789',
        branchCode: '632005',
        startDate: '2023-03-20',
        endDate: null,
        status: 'ACTIVE'
      },
      {
        companyId: firstCompanyId,
        firstName: 'Lisa',
        lastName: 'Wilson',
        idNumber: '9203155555099',
        taxNumber: 'TAX004',
        email: 'lisa.wilson@company.com',
        phone: '+27 85 555 0004',
        payFrequency: 'Monthly',
        rate: 22000,
        rateType: 'Salary',
        bankName: 'Nedbank',
        accountNumber: '12123456789',
        branchCode: '198765',
        startDate: '2021-11-10',
        endDate: '2024-01-31',
        status: 'INACTIVE'
      }
    ];

    sampleEmployees.forEach(employee => {
      const id = randomUUID();
      const newEmployee: Employee = { 
        ...employee, 
        id,
        status: employee.status || "ACTIVE",
        payFrequency: employee.payFrequency || "Monthly",
        rateType: employee.rateType || "Salary",
        taxNumber: employee.taxNumber ?? null,
        email: employee.email ?? null,
        phone: employee.phone ?? null,
        bankName: employee.bankName ?? null,
        accountNumber: employee.accountNumber ?? null,
        branchCode: employee.branchCode ?? null,
        endDate: employee.endDate ?? null
      };
      this.employees.set(id, newEmployee);
    });
  }

  async getCompany(id: string): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async getAllCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = randomUUID();
    const company: Company = { 
      ...insertCompany, 
      id, 
      status: insertCompany.status || "ACTIVE",
      // Ensure all optional fields have proper null values
      registration: insertCompany.registration ?? null,
      physicalAddress: insertCompany.physicalAddress ?? null,
      city: insertCompany.city ?? null,
      province: insertCompany.province ?? null,
      postalCode: insertCompany.postalCode ?? null,
      telephone: insertCompany.telephone ?? null,
      fax: insertCompany.fax ?? null,
      email: insertCompany.email ?? null,
      postalAddress: insertCompany.postalAddress ?? null,
      timezone: insertCompany.timezone ?? null,
      vatNumber: insertCompany.vatNumber ?? null,
      payeNumber: insertCompany.payeNumber ?? null,
      sdlNumber: insertCompany.sdlNumber ?? null,
      sdlContribution: insertCompany.sdlContribution ?? false,
      uifNumber: insertCompany.uifNumber ?? null,
      uifEmployerReference: insertCompany.uifEmployerReference ?? null,
      extratimeRate: insertCompany.extratimeRate ?? 1.33,
      overtimeRate: insertCompany.overtimeRate ?? 1.5,
      doubletimeRate: insertCompany.doubletimeRate ?? 2.0,
      lastDayOfWeek: insertCompany.lastDayOfWeek ?? "Sunday",
      disableShading: insertCompany.disableShading ?? false,
      enableTimekeeping: insertCompany.enableTimekeeping ?? false,
      eligibleForETI: insertCompany.eligibleForETI ?? false,
      monthlyMinimumWage: insertCompany.monthlyMinimumWage ?? 2000.0,
      tradeClassification: insertCompany.tradeClassification ?? null,
      industryClassificationCode: insertCompany.industryClassificationCode ?? null,
      branchCode: insertCompany.branchCode ?? null,
      bankAccountNumber: insertCompany.bankAccountNumber ?? null,
      bankAccountHolderName: insertCompany.bankAccountHolderName ?? null,
      bankingReference: insertCompany.bankingReference ?? null,
      taxType: insertCompany.taxType ?? "Average",
      addOvertimeFromTravel: insertCompany.addOvertimeFromTravel ?? false,
      subtractAbsentFromAllowances: insertCompany.subtractAbsentFromAllowances ?? false,
      showHourlyRate: insertCompany.showHourlyRate ?? false,
      showOrdinaryHours: insertCompany.showOrdinaryHours ?? false,
      addLoansToPayslips: insertCompany.addLoansToPayslips ?? true,
      allowChangeLeavePayoutOnPayslips: insertCompany.allowChangeLeavePayoutOnPayslips ?? true,
      useOvertimeLeave: insertCompany.useOvertimeLeave ?? false,
      printPublicHolidayOnPayslips: insertCompany.printPublicHolidayOnPayslips ?? false,
      hideZeroOvertimeAndLeave: insertCompany.hideZeroOvertimeAndLeave ?? true,
      showSdlOnPayslips: insertCompany.showSdlOnPayslips ?? false,
      showBankingDetailsOnPayslips: insertCompany.showBankingDetailsOnPayslips ?? true,
      showOvertimeRatesOnPayslips: insertCompany.showOvertimeRatesOnPayslips ?? "No",
      automaticLeaveAccrual: insertCompany.automaticLeaveAccrual ?? true,
      sickLeaveDaysPer36Months: insertCompany.sickLeaveDaysPer36Months ?? 30.0,
      annualLeaveDaysPerMonth: insertCompany.annualLeaveDaysPerMonth ?? 1.25,
      printSickLeaveBalance: insertCompany.printSickLeaveBalance ?? "No",
      printAnnualLeaveBalance: insertCompany.printAnnualLeaveBalance ?? "No",
      printOvertimeLeaveBalance: insertCompany.printOvertimeLeaveBalance ?? "No",
      maternityLeaveIsPaid: insertCompany.maternityLeaveIsPaid ?? false,
      parentalLeaveIsPaid: insertCompany.parentalLeaveIsPaid ?? false,
      contactPersonFirstName: insertCompany.contactPersonFirstName ?? null,
      contactPersonSurname: insertCompany.contactPersonSurname ?? null,
      contactPersonBusinessPhone: insertCompany.contactPersonBusinessPhone ?? null,
      contactPersonBusinessEmail: insertCompany.contactPersonBusinessEmail ?? null,
      contactPersonUnitNumber: insertCompany.contactPersonUnitNumber ?? null,
      contactPersonComplex: insertCompany.contactPersonComplex ?? null,
      contactPersonStreetNumber: insertCompany.contactPersonStreetNumber ?? null,
      contactPersonStreetName: insertCompany.contactPersonStreetName ?? null,
      contactPersonSuburb: insertCompany.contactPersonSuburb ?? null,
      contactPersonCityTown: insertCompany.contactPersonCityTown ?? null,
      contactPersonPostalCode: insertCompany.contactPersonPostalCode ?? null,
      contactPersonCountry: insertCompany.contactPersonCountry ?? "South Africa",
      declarantFirstName: insertCompany.declarantFirstName ?? null,
      declarantSurname: insertCompany.declarantSurname ?? null,
      declarantIdNumber: insertCompany.declarantIdNumber ?? null,
      declarantContactEmail: insertCompany.declarantContactEmail ?? null,
      declarantInitials: insertCompany.declarantInitials ?? null,
      declarantPosition: insertCompany.declarantPosition ?? null,
      declarantBusinessPhone: insertCompany.declarantBusinessPhone ?? null,
      declarantFaxNumber: insertCompany.declarantFaxNumber ?? null,
      declarantCellNumber: insertCompany.declarantCellNumber ?? null,
      declarantDateOfBirth: insertCompany.declarantDateOfBirth ?? null,
      payslipType: insertCompany.payslipType ?? "A4 - Plain paper - Default layout B",
      customPayperiod: insertCompany.customPayperiod ?? false,
      customPayperiodName: insertCompany.customPayperiodName ?? null,
      customPayperiodDays: insertCompany.customPayperiodDays ?? null,
      customPayperiodFirstDay: insertCompany.customPayperiodFirstDay ?? null
    };
    this.companies.set(id, company);
    return company;
  }

  async updateCompany(id: string, updates: Partial<InsertCompany>): Promise<Company | undefined> {
    const company = this.companies.get(id);
    if (!company) return undefined;
    
    const updatedCompany = { ...company, ...updates };
    this.companies.set(id, updatedCompany);
    return updatedCompany;
  }

  async deleteCompany(id: string): Promise<boolean> {
    // Check for dependent employees
    const employees = await this.getEmployeesByCompanyId(id);
    if (employees.length > 0) {
      throw new Error(`Cannot delete company with ${employees.length} employees. Remove all employees first.`);
    }
    
    // Check for dependent payslips
    const payslips = await this.getPayslipsByCompanyId(id);
    if (payslips.length > 0) {
      throw new Error(`Cannot delete company with ${payslips.length} payslips. Remove all payslips first.`);
    }
    
    return this.companies.delete(id);
  }

  // Employee operations
  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getAllEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployeesByCompanyId(companyId: string): Promise<Employee[]> {
    return Array.from(this.employees.values()).filter(e => e.companyId === companyId);
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    // Validate that the company exists
    const company = await this.getCompany(insertEmployee.companyId);
    if (!company) {
      throw new Error(`Company with id ${insertEmployee.companyId} does not exist`);
    }

    const id = randomUUID();
    const employee: Employee = {
      id,
      companyId: insertEmployee.companyId,
      firstName: insertEmployee.firstName,
      lastName: insertEmployee.lastName,
      idNumber: insertEmployee.idNumber,
      taxNumber: insertEmployee.taxNumber ?? null,
      email: insertEmployee.email ?? null,
      phone: insertEmployee.phone ?? null,
      payFrequency: insertEmployee.payFrequency || "Monthly",
      rate: insertEmployee.rate,
      rateType: insertEmployee.rateType || "Salary",
      bankName: insertEmployee.bankName ?? null,
      accountNumber: insertEmployee.accountNumber ?? null,
      branchCode: insertEmployee.branchCode ?? null,
      startDate: insertEmployee.startDate,
      endDate: insertEmployee.endDate ?? null,
      status: insertEmployee.status || "ACTIVE"
    };
    this.employees.set(id, employee);
    
    // Update company employee count
    await this.updateCompany(insertEmployee.companyId, {
      employees: company.employees + 1
    });
    
    return employee;
  }

  async updateEmployee(id: string, updates: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    if (!employee) return undefined;
    
    // If updating companyId, validate the new company exists and check for payslips
    if (updates.companyId && updates.companyId !== employee.companyId) {
      const newCompany = await this.getCompany(updates.companyId);
      if (!newCompany) {
        throw new Error(`Company with id ${updates.companyId} does not exist`);
      }
      
      // Check if employee has existing payslips
      const payslips = await this.getPayslipsByEmployeeId(id);
      if (payslips.length > 0) {
        throw new Error(`Cannot change employee company when ${payslips.length} payslips exist. Remove all payslips first.`);
      }
      
      // Update employee counts for both companies
      const oldCompany = await this.getCompany(employee.companyId);
      if (oldCompany) {
        await this.updateCompany(employee.companyId, {
          employees: Math.max(0, oldCompany.employees - 1)
        });
      }
      await this.updateCompany(updates.companyId, {
        employees: newCompany.employees + 1
      });
    }
    
    const updatedEmployee = { ...employee, ...updates };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const employee = await this.getEmployee(id);
    if (!employee) return false;
    
    // Check for dependent payslips
    const payslips = await this.getPayslipsByEmployeeId(id);
    if (payslips.length > 0) {
      throw new Error(`Cannot delete employee with ${payslips.length} payslips. Remove all payslips first.`);
    }
    
    const deleted = this.employees.delete(id);
    if (deleted) {
      // Update company employee count (strict transaction)
      const company = await this.getCompany(employee.companyId);
      if (!company) {
        throw new Error(`Cannot delete employee: company ${employee.companyId} no longer exists`);
      }
      
      const companyUpdate = await this.updateCompany(employee.companyId, {
        employees: Math.max(0, company.employees - 1)
      });
      if (!companyUpdate) {
        // Rollback employee deletion
        this.employees.set(id, employee);
        throw new Error(`Failed to update company ${employee.companyId} employee count`);
      }
    }
    return deleted;
  }

  // Payslip operations
  async getPayslip(id: string): Promise<Payslip | undefined> {
    return this.payslips.get(id);
  }

  async getAllPayslips(): Promise<Payslip[]> {
    return Array.from(this.payslips.values());
  }

  async getPayslipsByCompanyId(companyId: string): Promise<Payslip[]> {
    return Array.from(this.payslips.values()).filter(p => p.companyId === companyId);
  }

  async getPayslipsByEmployeeId(employeeId: string): Promise<Payslip[]> {
    return Array.from(this.payslips.values()).filter(p => p.employeeId === employeeId);
  }

  async createPayslip(insertPayslip: InsertPayslip): Promise<Payslip> {
    // Validate that the employee and company exist
    const employee = await this.getEmployee(insertPayslip.employeeId);
    if (!employee) {
      throw new Error(`Employee with id ${insertPayslip.employeeId} does not exist`);
    }
    
    const company = await this.getCompany(insertPayslip.companyId);
    if (!company) {
      throw new Error(`Company with id ${insertPayslip.companyId} does not exist`);
    }
    
    // Ensure employee belongs to the company
    if (employee.companyId !== insertPayslip.companyId) {
      throw new Error(`Employee ${insertPayslip.employeeId} does not belong to company ${insertPayslip.companyId}`);
    }

    const id = randomUUID();
    const payslip: Payslip = {
      ...insertPayslip,
      id,
      status: insertPayslip.status || "DRAFT",
      overtime: insertPayslip.overtime ?? null,
      allowances: insertPayslip.allowances ?? null,
      bonus: insertPayslip.bonus ?? null,
      payeTax: insertPayslip.payeTax ?? null,
      uif: insertPayslip.uif ?? null,
      medicalAid: insertPayslip.medicalAid ?? null,
      pensionFund: insertPayslip.pensionFund ?? null,
      otherDeductions: insertPayslip.otherDeductions ?? null
    };
    this.payslips.set(id, payslip);
    
    // Update company payslip count
    await this.updateCompany(insertPayslip.companyId, {
      payslips: company.payslips + 1
    });
    
    return payslip;
  }

  async updatePayslip(id: string, updates: Partial<InsertPayslip>): Promise<Payslip | undefined> {
    const payslip = this.payslips.get(id);
    if (!payslip) return undefined;
    
    // Always validate current employee-company relationship before any update
    const currentEmployee = await this.getEmployee(payslip.employeeId);
    if (!currentEmployee) {
      throw new Error(`Payslip references non-existent employee ${payslip.employeeId}`);
    }
    if (currentEmployee.companyId !== payslip.companyId) {
      throw new Error(`Payslip data is inconsistent: employee ${payslip.employeeId} belongs to company ${currentEmployee.companyId}, not ${payslip.companyId}`);
    }
    
    // If updating employeeId or companyId, validate relationships
    if (updates.employeeId && updates.employeeId !== payslip.employeeId) {
      const employee = await this.getEmployee(updates.employeeId);
      if (!employee) {
        throw new Error(`Employee with id ${updates.employeeId} does not exist`);
      }
      // Ensure employee belongs to the payslip's company
      const targetCompanyId = updates.companyId || payslip.companyId;
      if (employee.companyId !== targetCompanyId) {
        throw new Error(`Employee ${updates.employeeId} does not belong to company ${targetCompanyId}`);
      }
    }
    
    if (updates.companyId && updates.companyId !== payslip.companyId) {
      const newCompany = await this.getCompany(updates.companyId);
      if (!newCompany) {
        throw new Error(`Company with id ${updates.companyId} does not exist`);
      }
      
      // Ensure employee belongs to the new company
      const targetEmployeeId = updates.employeeId || payslip.employeeId;
      const employee = await this.getEmployee(targetEmployeeId);
      if (employee && employee.companyId !== updates.companyId) {
        throw new Error(`Employee ${targetEmployeeId} does not belong to company ${updates.companyId}`);
      }
      
      // Update payslip counts for both companies (strict transaction)
      const oldCompany = await this.getCompany(payslip.companyId);
      if (!oldCompany) {
        throw new Error(`Cannot update payslip: source company ${payslip.companyId} no longer exists`);
      }
      
      const oldCompanyUpdate = await this.updateCompany(payslip.companyId, {
        payslips: Math.max(0, oldCompany.payslips - 1)
      });
      if (!oldCompanyUpdate) {
        throw new Error(`Failed to update source company ${payslip.companyId} payslip count`);
      }
      
      const newCompanyUpdate = await this.updateCompany(updates.companyId, {
        payslips: newCompany.payslips + 1
      });
      if (!newCompanyUpdate) {
        // Rollback the old company update
        await this.updateCompany(payslip.companyId, {
          payslips: oldCompany.payslips
        });
        throw new Error(`Failed to update destination company ${updates.companyId} payslip count`);
      }
    }
    
    const updatedPayslip = { ...payslip, ...updates };
    this.payslips.set(id, updatedPayslip);
    return updatedPayslip;
  }

  async deletePayslip(id: string): Promise<boolean> {
    const payslip = await this.getPayslip(id);
    if (!payslip) return false;
    
    const deleted = this.payslips.delete(id);
    if (deleted) {
      // Update company payslip count (strict transaction)
      const company = await this.getCompany(payslip.companyId);
      if (!company) {
        throw new Error(`Cannot delete payslip: company ${payslip.companyId} no longer exists`);
      }
      
      const companyUpdate = await this.updateCompany(payslip.companyId, {
        payslips: Math.max(0, company.payslips - 1)
      });
      if (!companyUpdate) {
        // Rollback payslip deletion
        this.payslips.set(id, payslip);
        throw new Error(`Failed to update company ${payslip.companyId} payslip count`);
      }
    }
    return deleted;
  }

  async getPayslipsByPeriod(startDate: string, endDate: string): Promise<Payslip[]> {
    return Array.from(this.payslips.values()).filter(p => 
      p.payPeriodStart >= startDate && p.payPeriodEnd <= endDate
    );
  }

  // Payroll calculation operations
  async calculatePayrollForEmployee(input: PayrollInput): Promise<PayrollCalculation> {
    // Validate that employee and company exist
    const employee = await this.getEmployee(input.employee.id);
    if (!employee) {
      throw new Error(`Employee with id ${input.employee.id} does not exist`);
    }
    
    const company = await this.getCompany(input.company.id);
    if (!company) {
      throw new Error(`Company with id ${input.company.id} does not exist`);
    }
    
    // Ensure employee belongs to the company
    if (employee.companyId !== company.id) {
      throw new Error(`Employee ${input.employee.id} does not belong to company ${input.company.id}`);
    }
    
    // Use the current employee and company data for calculations
    const updatedInput: PayrollInput = {
      ...input,
      employee,
      company
    };
    
    return calculatePayroll(updatedInput);
  }

  async generatePayslipFromCalculation(
    employeeId: string,
    companyId: string,
    calculation: PayrollCalculation,
    payPeriodStart: string,
    payPeriodEnd: string,
    payDate: string
  ): Promise<Payslip> {
    const insertPayslip: InsertPayslip = {
      employeeId,
      companyId,
      payPeriodStart,
      payPeriodEnd,
      payDate,
      basicSalary: calculation.basicSalary,
      overtime: calculation.overtime || 0,
      allowances: calculation.allowances || 0,
      bonus: calculation.bonus || 0,
      grossPay: calculation.grossPay,
      payeTax: calculation.payeTax || 0,
      uif: calculation.uifEmployee || 0,
      medicalAid: calculation.medicalAidPostTax || 0,
      pensionFund: calculation.pensionFundContribution || 0,
      otherDeductions: calculation.otherDeductions || 0,
      totalDeductions: calculation.totalDeductions,
      netPay: calculation.netPay,
      status: 'DRAFT'
    };
    
    return await this.createPayslip(insertPayslip);
  }
}

export const storage = new MemStorage();
