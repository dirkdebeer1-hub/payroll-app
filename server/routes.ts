import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCompanySchema, insertEmployeeSchema, insertPayslipSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Companies routes
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getAllCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const result = insertCompanySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid company data", details: result.error });
      }
      const company = await storage.createCompany(result.data);
      res.status(201).json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to create company" });
    }
  });

  app.put("/api/companies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = insertCompanySchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid company data", details: result.error });
      }
      const company = await storage.updateCompany(id, result.data);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to update company" });
    }
  });

  app.delete("/api/companies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCompany(id);
      if (!deleted) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message.includes('Cannot delete')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete company" });
      }
    }
  });

  // Employee routes
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getAllEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  app.get("/api/companies/:companyId/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployeesByCompanyId(req.params.companyId);
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const result = insertEmployeeSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid employee data", details: result.error });
      }
      const employee = await storage.createEmployee(result.data);
      res.status(201).json(employee);
    } catch (error) {
      if (error instanceof Error && error.message.includes('does not exist')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create employee" });
      }
    }
  });

  app.put("/api/employees/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = insertEmployeeSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid employee data", details: result.error });
      }
      const employee = await storage.updateEmployee(id, result.data);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      if (error instanceof Error && error.message.includes('does not exist')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to update employee" });
      }
    }
  });

  app.delete("/api/employees/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteEmployee(id);
      if (!deleted) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message.includes('Cannot delete')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete employee" });
      }
    }
  });

  // Payslip routes
  app.get("/api/payslips", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (startDate && endDate) {
        const payslips = await storage.getPayslipsByPeriod(startDate as string, endDate as string);
        res.json(payslips);
      } else {
        const payslips = await storage.getAllPayslips();
        res.json(payslips);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payslips" });
    }
  });

  app.get("/api/companies/:companyId/payslips", async (req, res) => {
    try {
      const payslips = await storage.getPayslipsByCompanyId(req.params.companyId);
      res.json(payslips);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company payslips" });
    }
  });

  app.get("/api/employees/:employeeId/payslips", async (req, res) => {
    try {
      const payslips = await storage.getPayslipsByEmployeeId(req.params.employeeId);
      res.json(payslips);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee payslips" });
    }
  });

  app.post("/api/payslips", async (req, res) => {
    try {
      const result = insertPayslipSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid payslip data", details: result.error });
      }
      const payslip = await storage.createPayslip(result.data);
      res.status(201).json(payslip);
    } catch (error) {
      if (error instanceof Error && (error.message.includes('does not exist') || error.message.includes('does not belong'))) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create payslip" });
      }
    }
  });

  // Payroll processing
  app.post("/api/payroll/run", async (req, res) => {
    try {
      const { companyId, payPeriodStart, payPeriodEnd, payDate } = req.body;
      
      if (!companyId || !payPeriodStart || !payPeriodEnd || !payDate) {
        return res.status(400).json({ error: "Missing required payroll parameters" });
      }
      
      // Get active employees for the company
      const employees = await storage.getEmployeesByCompanyId(companyId);
      const activeEmployees = employees.filter(emp => emp.status === 'ACTIVE');
      const processedPayslips = [];
      
      for (const employee of activeEmployees) {
        try {
          // Basic payroll calculation (simplified)
          const basicSalary = employee.rate;
          const grossPay = basicSalary;
          const payeTax = grossPay * 0.18; // Simplified PAYE calculation
          const uif = grossPay * 0.01; // UIF contribution
          const totalDeductions = payeTax + uif;
          const netPay = grossPay - totalDeductions;
          
          const payslipData = {
            employeeId: employee.id,
            companyId: companyId,
            payPeriodStart,
            payPeriodEnd,
            payDate,
            basicSalary,
            overtime: 0,
            allowances: 0,
            bonus: 0,
            grossPay,
            payeTax,
            uif,
            medicalAid: 0,
            pensionFund: 0,
            otherDeductions: 0,
            totalDeductions,
            netPay,
            status: 'PROCESSED' as const
          };
          
          const payslip = await storage.createPayslip(payslipData);
          processedPayslips.push(payslip);
        } catch (error) {
          console.error(`Failed to create payslip for employee ${employee.id}:`, error);
          // Continue processing other employees even if one fails
        }
      }
      
      res.json({ 
        message: `Payroll processed for ${processedPayslips.length} employees`,
        payslips: processedPayslips 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process payroll" });
    }
  });

  // Export routes
  app.get("/api/exports/ui19", async (req, res) => {
    try {
      const { period } = req.query;
      if (!period) {
        return res.status(400).json({ error: "Period parameter is required" });
      }
      
      // Generate UI-19 file content (simplified)
      const payslips = await storage.getAllPayslips();
      const filteredPayslips = payslips.filter(p => p.payPeriodStart >= String(period));
      
      const ui19Content = filteredPayslips
        .map(p => `${p.employeeId},${p.grossPay},${p.uif}`)
        .join('\n');
        
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename=ui19_${period}.txt`);
      res.send(ui19Content);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate UI-19 export" });
    }
  });

  app.get("/api/exports/irp5", async (req, res) => {
    try {
      const { year } = req.query;
      if (!year) {
        return res.status(400).json({ error: "Year parameter is required" });
      }
      
      // Generate IRP5 CSV content (simplified)
      const payslips = await storage.getAllPayslips();
      const yearlyPayslips = payslips.filter(p => p.payPeriodStart.startsWith(String(year)));
      
      const irp5Content = 'Employee ID,Gross Income,PAYE Tax,UIF\n' + 
        yearlyPayslips
          .map(p => `${p.employeeId},${p.grossPay},${p.payeTax},${p.uif}`)
          .join('\n');
          
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=irp5_${year}.csv`);
      res.send(irp5Content);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate IRP5 export" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
