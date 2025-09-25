import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import StatsCards from "@/components/StatsCards";
import ControlsBar from "@/components/ControlsBar";
import CompanyTable from "@/components/CompanyTable";
import CompanyCards from "@/components/CompanyCards";
import CompanyForm from "@/components/CompanyForm";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Company, InsertCompany } from "@shared/schema";


export default function Companies() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [showArchived, setShowArchived] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Fetch companies from API
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ['/api/companies'],
  });

  // Create company mutation
  const createCompanyMutation = useMutation({
    mutationFn: async (data: InsertCompany) => {
      console.log('Creating company with data:', data);
      const response = await apiRequest('POST', '/api/companies', data);
      console.log('Company created successfully:', response.id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      setShowForm(false);
      setEditingCompany(null);
      toast({
        title: "Success",
        description: "Company created successfully",
      });
    },
    onError: (error: any) => {
      console.error('Failed to create company:', error);
      toast({
        title: "Error",
        description: "Failed to create company. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update company mutation
  const updateCompanyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertCompany> }) => {
      console.log('Updating company:', id, 'with data:', data);
      const response = await apiRequest('PUT', `/api/companies/${id}`, data);
      console.log('Company updated successfully:', response.id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      setShowForm(false);
      setEditingCompany(null);
      toast({
        title: "Success",
        description: "Company updated successfully",
      });
    },
    onError: (error: any) => {
      console.error('Failed to update company:', error);
      toast({
        title: "Error",
        description: "Failed to update company. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete company mutation
  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting company:', id);
      await apiRequest('DELETE', `/api/companies/${id}`);
      console.log('Company deleted successfully:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      toast({
        title: "Success",
        description: "Company deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Failed to delete company:', error);
      const errorMessage = error?.message || "Failed to delete company. Please try again.";
      toast({
        title: "Cannot Delete Company",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Filter companies based on search and status
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.country.toLowerCase().includes(searchTerm.toLowerCase());
      const currentFilter = showArchived ? 'ARCHIVED' : 'ACTIVE';
      const matchesStatus = statusFilter === 'all' || company.status === currentFilter;
      return matchesSearch && matchesStatus;
    });
  }, [companies, searchTerm, statusFilter, showArchived]);

  const activeCompanies = companies.filter(c => c.status === 'ACTIVE').length;

  const handleViewCompany = (id: string) => {
    console.log('View company triggered for:', id);
    // Navigate to employee management for this company
    navigate('/employees');
  };

  const handleEditCompany = (id: string) => {
    console.log('Edit company triggered for:', id);
    const company = companies.find(c => c.id === id);
    if (company) {
      setEditingCompany(company);
      setShowForm(true);
    }
  };

  const handleArchiveCompany = (id: string) => {
    console.log('Archive company triggered for:', id);
    const company = companies.find(c => c.id === id);
    if (company) {
      const newStatus = company.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';
      updateCompanyMutation.mutate({
        id,
        data: { status: newStatus }
      });
    }
  };

  const handleDeleteCompany = (id: string) => {
    console.log('Delete company triggered for:', id);
    if (window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      deleteCompanyMutation.mutate(id);
    }
  };

  const handleCompanyAction = (action: string, id: string) => {
    switch (action) {
      case 'View':
        handleViewCompany(id);
        break;
      case 'Edit':
        handleEditCompany(id);
        break;
      case 'Archive':
        handleArchiveCompany(id);
        break;
      case 'Delete':
        handleDeleteCompany(id);
        break;
      default:
        console.log(`${action} not implemented yet for company:`, id);
    }
  };

  const handleAddCompany = () => {
    console.log('Add company triggered');
    setEditingCompany(null);
    setShowForm(true);
  };

  const handleFormSubmit = (data: InsertCompany) => {
    if (editingCompany) {
      updateCompanyMutation.mutate({
        id: editingCompany.id,
        data
      });
    } else {
      createCompanyMutation.mutate(data);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  const handleArchivedToggle = () => {
    setShowArchived(!showArchived);
    console.log('Archived toggle triggered:', !showArchived ? 'Showing archived' : 'Showing active');
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
            onAdd={handleAddCompany}
            showArchived={showArchived}
            onArchivedToggle={handleArchivedToggle}
          />
          
          {viewMode === 'table' ? (
            <CompanyTable
              companies={filteredCompanies}
              onView={(id) => handleCompanyAction('View', id)}
              onEdit={(id) => handleCompanyAction('Edit', id)}
              onArchive={(id) => handleCompanyAction('Archive', id)}
              onDelete={(id) => handleCompanyAction('Delete', id)}
              showArchived={showArchived}
            />
          ) : (
            <CompanyCards
              companies={filteredCompanies}
              onView={(id) => handleCompanyAction('View', id)}
              onEdit={(id) => handleCompanyAction('Edit', id)}
              onArchive={(id) => handleCompanyAction('Archive', id)}
              onDelete={(id) => handleCompanyAction('Delete', id)}
              showArchived={showArchived}
            />
          )}
        </main>
      </div>
      
      {/* Company Form Modal */}
      {showForm && (
        <CompanyForm
          company={editingCompany || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isSubmitting={createCompanyMutation.isPending || updateCompanyMutation.isPending}
        />
      )}
    </div>
  );
}