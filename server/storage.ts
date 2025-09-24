import { type Company, type InsertCompany } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getCompany(id: string): Promise<Company | undefined>;
  getAllCompanies(): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, updates: Partial<InsertCompany>): Promise<Company | undefined>;
  deleteCompany(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private companies: Map<string, Company>;

  constructor() {
    this.companies = new Map();
    // //todo: remove mock functionality - Add some sample data
    this.seedData();
  }

  private seedData() {
    const sampleCompanies: InsertCompany[] = [
      { name: "Actum Innovations (Pty) Ltd", country: "South Africa", employees: 1, payslips: 31, status: "ACTIVE" },
      { name: "AE South Africa (Pty) Ltd", country: "South Africa", employees: 3, payslips: 89, status: "ACTIVE" },
      { name: "Almeria 240 ICHAF (Pty) Ltd", country: "South Africa", employees: 7, payslips: 203, status: "ACTIVE" },
      { name: "Anti-Thing Transport Co", country: "South Africa", employees: 5, payslips: 110, status: "ACTIVE" },
      { name: "Art-Plastaforn CC", country: "South Africa", employees: 3, payslips: 42, status: "ACTIVE" },
      { name: "Asset Healthcare Solutions CC", country: "South Africa", employees: 4, payslips: 118, status: "ACTIVE" },
      { name: "Career Indaba NPC", country: "South Africa", employees: 2, payslips: 3, status: "ACTIVE" },
      { name: "Carls Cronje Designs (Pty) Ltd", country: "South Africa", employees: 3, payslips: 23, status: "ACTIVE" },
      { name: "Crontech Consulting", country: "South Africa", employees: 8, payslips: 256, status: "ACTIVE" },
      { name: "Danmig (Pty) Ltd", country: "South Africa", employees: 5, payslips: 173, status: "ACTIVE" },
      { name: "DCKO (Pty) Ltd", country: "South Africa", employees: 6, payslips: 88, status: "ACTIVE" },
      { name: "DDD Electrical (Pty) Ltd", country: "South Africa", employees: 4, payslips: 46, status: "ACTIVE" },
      { name: "Exceptional Marketing", country: "South Africa", employees: 2, payslips: 32, status: "ACTIVE" },
      { name: "Frontier Psychology (Pty) Ltd", country: "South Africa", employees: 2, payslips: 43, status: "ACTIVE" },
    ];

    sampleCompanies.forEach(company => {
      const id = randomUUID();
      const newCompany: Company = { ...company, id };
      this.companies.set(id, newCompany);
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
    const company: Company = { ...insertCompany, id };
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
    return this.companies.delete(id);
  }
}

export const storage = new MemStorage();
