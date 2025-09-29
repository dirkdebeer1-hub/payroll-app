import { Menu, ArrowLeft, Plus, Table, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Company } from "@shared/schema";

interface HeaderProps {
  onToggleSidebar?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
  selectedCompany?: Company | null;
  // Companies page controls
  onAddCompany?: () => void;
  showArchived?: boolean;
  onArchivedToggle?: () => void;
  hasArchivedCompanies?: boolean;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  viewMode?: 'table' | 'cards';
  onViewModeChange?: (mode: 'table' | 'cards') => void;
  showCompanyControls?: boolean;
  // Form mode controls
  showFormControls?: boolean;
  onFormCancel?: () => void;
  isFormSubmitting?: boolean;
  editingCompany?: Company | null;
}

export default function Header({ 
  onToggleSidebar, 
  showBackButton, 
  onBack, 
  title = "Payroll", 
  selectedCompany,
  onAddCompany,
  showArchived = false,
  onArchivedToggle,
  hasArchivedCompanies = false,
  searchTerm = "",
  onSearchChange,
  viewMode = 'table',
  onViewModeChange,
  showCompanyControls = false,
  showFormControls = false,
  onFormCancel,
  isFormSubmitting = false,
  editingCompany
}: HeaderProps) {
  return (
    <header className="bg-card border-b border-border">
      <div className="flex items-center justify-between px-3 sm:px-4 py-3">
        <div className="flex items-center gap-0.5 min-w-0 flex-1">
          {showBackButton && (
            <Button
              variant="ghost"
  
              onClick={onBack}
              className="hover-elevate"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"

            onClick={onToggleSidebar}
            className="md:hidden hover-elevate"
            data-testid="button-toggle-sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
          {showCompanyControls ? (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-0.5 flex-wrap">
                <Button
                  onClick={onAddCompany}
      
                  className="inline-flex items-center justify-center gap-0.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-primary-border h-9 bg-[#465193] hover:bg-[#384080] font-medium px-4 py-2 text-[#fcfcfc] text-[13px]"
                  data-testid="button-add-company"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
                
                {hasArchivedCompanies && (
                  <Button
                    variant={showArchived ? "default" : "outline"}
        
                    className={`text-xs-13 font-medium px-3 ${
                      showArchived ? 'bg-[#465193] text-white hover:bg-[#384080]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={onArchivedToggle}
                    data-testid="button-archived"
                  >
                    {showArchived ? 'Show Active' : 'Show Archived'}
                  </Button>
                )}
                
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-48 text-xs-13 font-medium bg-white border-gray-300"
                  data-testid="input-search"
                />
                
                <div className="flex items-center gap-0 border border-gray-300 overflow-hidden">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
        
                    onClick={() => onViewModeChange?.('table')}
                    className="inline-flex items-center justify-center gap-0.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-primary-border h-9 font-medium px-3 bg-[#465193] text-white text-[13px]"
                    data-testid="button-view-table"
                  >
                    <Table className="h-4 w-4 mr-1" />
                    Table
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
        
                    onClick={() => onViewModeChange?.('cards')}
                    className="inline-flex items-center justify-center gap-0.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border h-9 font-medium px-3 border-l border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-[13px]"
                    data-testid="button-view-cards"
                  >
                    <Grid className="h-4 w-4 mr-1" />
                    Cards
                  </Button>
                </div>
              </div>
            </div>
          ) : showFormControls ? (
            <div className="flex items-center gap-0.5 flex-wrap">
              <Button
                variant="outline"
                onClick={onFormCancel}
                className="text-gray-600 hover:text-gray-800 text-xs-13 font-medium px-3"
                data-testid="button-back-to-list"
              >
                ← Back to Companies
              </Button>
              
              <Button
                type="submit"
                form="company-form"
                disabled={isFormSubmitting}
                className="inline-flex items-center justify-center gap-0.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-primary-border h-9 bg-[#465193] hover:bg-[#384080] font-medium px-4 py-2 text-[#fcfcfc]"
                data-testid="button-submit-company-form"
              >
                {isFormSubmitting ? 'Saving...' : editingCompany ? 'Update Company' : 'Add Company'}
              </Button>
            </div>
          ) : (
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight truncate">
              {title}
            </h1>
          )}
        </div>
        {/* Right side - empty for now */}
        <div></div>
      </div>
    </header>
  );
}