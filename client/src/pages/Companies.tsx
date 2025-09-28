import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import StatsCards from "@/components/StatsCards";
import ControlsBar from "@/components/ControlsBar";
import CompanyTable from "@/components/CompanyTable";
import CompanyCards from "@/components/CompanyCards";
import CompanyForm from "@/components/CompanyForm";
import CompanyA4View from "@/components/CompanyA4View";
import { ScrollableDashboardCard } from "@/components/ScrollableDashboardCard";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useVersion } from "@/hooks/useVersion";
import type { Company, InsertCompany } from "@shared/schema";

interface CompaniesProps {
  selectedCompany?: Company | null;
  onSelectCompany?: (company: Company | null) => void;
}

export default function Companies({ selectedCompany, onSelectCompany }: CompaniesProps = {}) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { versionString, incrementVersion } = useVersion();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showA4View, setShowA4View] = useState(false);
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

  // Fetch companies from API
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ['/api/companies'],
  });

  // Create company mutation
  const createCompanyMutation = useMutation({
    mutationFn: async (data: InsertCompany) => {
      console.log('Creating company with data:', data);
      const response = await apiRequest('POST', '/api/companies', data);
      console.log('Company created successfully:', response);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      setShowForm(false);
      setEditingCompany(null);
      incrementVersion(); // Increment version on successful company creation
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
      console.log('Company updated successfully:', response);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      setShowForm(false);
      setEditingCompany(null);
      incrementVersion(); // Increment version on successful company update
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
      const matchesStatus = company.status === currentFilter;
      return matchesSearch && matchesStatus;
    });
  }, [companies, searchTerm, showArchived]);

  const activeCompanies = companies.filter(c => c.status === 'ACTIVE').length;

  const handleViewCompany = (id: string) => {
    console.log('View company triggered for:', id);
    const company = companies.find(c => c.id === id);
    if (company) {
      setViewingCompany(company);
      setShowA4View(true);
    }
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
    setCompanyToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (companyToDelete) {
      deleteCompanyMutation.mutate(companyToDelete);
      setShowDeleteDialog(false);
      setCompanyToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setCompanyToDelete(null);
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

  const handleA4ViewClose = () => {
    setShowA4View(false);
    setViewingCompany(null);
  };

  const handleDownloadPDF = async () => {
    if (!viewingCompany) return;
    
    try {
      // Find the A4 view content element
      const element = document.querySelector('[data-pdf-content]') as HTMLElement;
      if (!element) {
        toast({
          title: "Error",
          description: "Could not find content to export",
          variant: "destructive",
        });
        return;
      }

      // Generate canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions for A4
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm  
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add the first page
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `${viewingCompany.name.replace(/[^a-zA-Z0-9]/g, '_')}_Company_Info.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle escape key for A4 view modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showA4View) {
        handleA4ViewClose();
      }
    };

    if (showA4View) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showA4View]);

  const handleArchivedToggle = () => {
    setShowArchived(!showArchived);
    console.log('Archived toggle triggered:', !showArchived ? 'Showing archived' : 'Showing active');
  };

  const handleSelectCompany = (company: Company) => {
    console.log('Company selected:', company.name);
    if (onSelectCompany) {
      onSelectCompany(company);
    }
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
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header */}
        <Header 
          onToggleSidebar={() => setSidebarOpen(true)}
          selectedCompany={selectedCompany}
          showCompanyControls={!showForm}
          showFormControls={showForm}
          onAddCompany={handleAddCompany}
          showArchived={showArchived}
          onArchivedToggle={handleArchivedToggle}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onFormCancel={handleFormCancel}
          isFormSubmitting={createCompanyMutation.isPending || updateCompanyMutation.isPending}
          editingCompany={editingCompany}
        />
        
        {/* SCROLLABLE CONTENT AREA - This is where scrolling happens */}
        <main className="flex-1 overflow-y-auto p-4 pb-8" style={{ backgroundColor: '#f7fbff' }}>
          
          
          <div className="flex-1 flex flex-col">
            {showForm ? (
              /* Company Form Inline View with Scrollable Card */
              <ScrollableDashboardCard
                title={
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingCompany ? `Edit Company | ${editingCompany.name}` : 'Add Company'}
                  </h2>
                }
                maxHeight="calc(100vh - 200px)"
              >
                <CompanyForm
                  company={editingCompany || undefined}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                  isSubmitting={createCompanyMutation.isPending || updateCompanyMutation.isPending}
                  isInline={true}
                  onArchive={(companyId) => handleCompanyAction('Archive', companyId)}
                  onDelete={(companyId) => handleCompanyAction('Delete', companyId)}
                />
              </ScrollableDashboardCard>
            ) : viewMode === 'table' ? (
              <>
                <div className="flex-1">
                  <CompanyTable
                    companies={filteredCompanies}
                    onView={(id) => handleCompanyAction('View', id)}
                    onEdit={(id) => handleCompanyAction('Edit', id)}
                    onSelectCompany={handleSelectCompany}
                    showArchived={showArchived}
                  />
                </div>
                
                {/* Pagination Controls aligned with Sign Out button */}
                <div className="flex justify-between items-center mt-4 px-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      data-testid="button-first-page-table"
                    >
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      data-testid="button-previous-page-table"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      data-testid="button-next-page-table"
                    >
                      Next
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      data-testid="button-last-page-table"
                    >
                      Last
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Page 1 of 1 ({filteredCompanies.length} companies) - {versionString}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <CompanyCards
                    companies={filteredCompanies}
                    onView={(id) => handleCompanyAction('View', id)}
                    onEdit={(id) => handleCompanyAction('Edit', id)}
                    onSelectCompany={handleSelectCompany}
                    showArchived={showArchived}
                  />
                </div>
                
                {/* Pagination Controls aligned with Sign Out button */}
                <div className="flex justify-between items-center mt-4 px-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      data-testid="button-first-page"
                    >
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      data-testid="button-previous-page"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      data-testid="button-next-page"
                    >
                      Next
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      data-testid="button-last-page"
                    >
                      Last
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Page 1 of 1 ({filteredCompanies.length} companies) - {versionString}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      
      {/* Company A4 View Modal */}
      {showA4View && viewingCompany && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:bg-transparent print:relative print:p-0 print:flex-col print:items-start"
          onClick={handleA4ViewClose}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto print:shadow-none print:rounded-none print:max-w-none print:max-h-none print:overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center print:hidden">
              <h2 className="text-xl font-bold text-black">Company Information - {viewingCompany.name}</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  data-testid="button-download-pdf"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  data-testid="button-print"
                >
                  Print / Save as PDF
                </button>
                <button
                  onClick={handleA4ViewClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  data-testid="button-close-a4-view"
                >
                  Close
                </button>
              </div>
            </div>
            <CompanyA4View company={viewingCompany} />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this company? This action cannot be undone and will permanently remove all company data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete} data-testid="button-cancel-delete">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              data-testid="button-confirm-delete"
            >
              Delete Company
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}