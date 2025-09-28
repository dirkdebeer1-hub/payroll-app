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
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  viewMode?: 'table' | 'cards';
  onViewModeChange?: (mode: 'table' | 'cards') => void;
  showCompanyControls?: boolean;
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
  searchTerm = "",
  onSearchChange,
  viewMode = 'table',
  onViewModeChange,
  showCompanyControls = false
}: HeaderProps) {
  return (
    <header className="bg-card border-b border-border">
      <div className="flex items-center justify-between px-3 sm:px-4 py-3">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover-elevate p-2"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="md:hidden hover-elevate p-2"
            data-testid="button-toggle-sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
          {showCompanyControls ? (
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={onAddCompany}
                size="sm"
                className="bg-[#465193] text-white hover:bg-[#384080] text-sm px-4 py-2"
                data-testid="button-add-company"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Button>
              
              <Button
                variant={showArchived ? "default" : "outline"}
                size="sm"
                className={`text-sm px-4 py-2 ${
                  showArchived ? 'bg-[#465193] text-white hover:bg-[#384080]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={onArchivedToggle}
                data-testid="button-archived"
              >
                {showArchived ? 'Show Active' : 'Show Archived'}
              </Button>
              
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-48 text-sm bg-white border-gray-300"
                data-testid="input-search"
              />
              
              <div className="flex items-center gap-0 border border-gray-300 rounded-md overflow-hidden">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange?.('table')}
                  className={`text-sm px-3 py-2 h-auto rounded-none ${
                    viewMode === 'table' ? 'bg-[#465193] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  data-testid="button-view-table"
                >
                  <Table className="h-4 w-4 mr-1" />
                  Table
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange?.('cards')}
                  className={`text-sm px-3 py-2 h-auto rounded-none border-l border-gray-300 ${
                    viewMode === 'cards' ? 'bg-[#465193] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  data-testid="button-view-cards"
                >
                  <Grid className="h-4 w-4 mr-1" />
                  Cards
                </Button>
              </div>
            </div>
          ) : (
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight truncate">
              {title}
            </h1>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-sm font-bold text-foreground">
            {selectedCompany ? selectedCompany.name : "No Company Selected"}
          </span>
          <span className="text-muted-foreground text-sm">|</span>
          <span className="text-sm text-muted-foreground font-medium">
            Dirk de Beer
          </span>
        </div>
        <div className="sm:hidden">
          <span className="text-xs font-bold text-foreground">
            {selectedCompany ? selectedCompany.name.substring(0, 12) + '...' : 'No Company'}
          </span>
        </div>
      </div>
    </header>
  );
}