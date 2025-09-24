import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import StatsCards from "@/components/StatsCards";
import ControlsBar from "@/components/ControlsBar";
import CompanyTable from "@/components/CompanyTable";
import CompanyCards from "@/components/CompanyCards";
import type { Company } from "@shared/schema";

// //todo: remove mock functionality - This will be replaced with actual API calls
const mockCompanies: Company[] = [
  { id: '1', name: 'Actum Innovations (Pty) Ltd', country: 'South Africa', employees: 1, payslips: 31, status: 'ACTIVE' },
  { id: '2', name: 'AE South Africa (Pty) Ltd', country: 'South Africa', employees: 3, payslips: 89, status: 'ACTIVE' },
  { id: '3', name: 'Almeria 240 ICHAF (Pty) Ltd', country: 'South Africa', employees: 7, payslips: 203, status: 'ACTIVE' },
  { id: '4', name: 'Anti-Thing Transport Co', country: 'South Africa', employees: 5, payslips: 110, status: 'ACTIVE' },
  { id: '5', name: 'Art-Plastaforn CC', country: 'South Africa', employees: 3, payslips: 42, status: 'ACTIVE' },
  { id: '6', name: 'Asset Healthcare Solutions CC', country: 'South Africa', employees: 4, payslips: 118, status: 'ACTIVE' },
  { id: '7', name: 'Career Indaba NPC', country: 'South Africa', employees: 2, payslips: 3, status: 'ACTIVE' },
  { id: '8', name: 'Carls Cronje Designs (Pty) Ltd', country: 'South Africa', employees: 3, payslips: 23, status: 'ACTIVE' },
  { id: '9', name: 'Crontech Consulting', country: 'South Africa', employees: 8, payslips: 256, status: 'ACTIVE' },
  { id: '10', name: 'Danmig (Pty) Ltd', country: 'South Africa', employees: 5, payslips: 173, status: 'ACTIVE' },
  { id: '11', name: 'DCKO (Pty) Ltd', country: 'South Africa', employees: 6, payslips: 88, status: 'ACTIVE' },
  { id: '12', name: 'DDD Electrical (Pty) Ltd', country: 'South Africa', employees: 4, payslips: 46, status: 'ACTIVE' },
  { id: '13', name: 'Exceptional Marketing', country: 'South Africa', employees: 2, payslips: 32, status: 'ACTIVE' },
  { id: '14', name: 'Frontier Psychology (Pty) Ltd', country: 'South Africa', employees: 2, payslips: 43, status: 'ACTIVE' },
];

export default function Companies() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // //todo: remove mock functionality - Replace with actual API call
  const { data: companies = mockCompanies, isLoading } = useQuery({
    queryKey: ['/api/companies'],
    queryFn: () => Promise.resolve(mockCompanies),
  });

  // Filter companies based on search and status
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [companies, searchTerm, statusFilter]);

  const activeCompanies = companies.filter(c => c.status === 'ACTIVE').length;

  const handleCompanyAction = (action: string, id: string) => {
    console.log(`${action} action triggered for company:`, id);
    // //todo: remove mock functionality - Replace with actual API calls
  };

  const handleAddCompany = () => {
    console.log('Add company triggered');
    // //todo: remove mock functionality - Replace with actual add company functionality
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header onToggleSidebar={() => setSidebarOpen(true)} />
        
        {/* Page Content */}
        <main className="flex-1 p-4 pb-8 bg-muted/30 overflow-hidden">
          <div className="mb-3">
            <h1 className="text-xl font-semibold text-foreground mb-3 tracking-tight">
              Companies
            </h1>
          </div>
          
          <StatsCards 
            totalCompanies={companies.length}
            activeCompanies={activeCompanies}
          />
          
          <ControlsBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddCompany={handleAddCompany}
          />
          
          {viewMode === 'table' ? (
            <CompanyTable
              companies={filteredCompanies}
              onView={(id) => handleCompanyAction('View', id)}
              onEdit={(id) => handleCompanyAction('Edit', id)}
              onArchive={(id) => handleCompanyAction('Archive', id)}
              onDelete={(id) => handleCompanyAction('Delete', id)}
            />
          ) : (
            <CompanyCards
              companies={filteredCompanies}
              onView={(id) => handleCompanyAction('View', id)}
              onEdit={(id) => handleCompanyAction('Edit', id)}
              onArchive={(id) => handleCompanyAction('Archive', id)}
              onDelete={(id) => handleCompanyAction('Delete', id)}
            />
          )}
        </main>
      </div>
    </div>
  );
}