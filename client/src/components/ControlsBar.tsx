import { Plus, Search, Table, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Company } from "@shared/schema";

interface ControlsBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  onAddCompany: () => void;
  showArchived: boolean;
  onArchivedToggle: () => void;
  showForm?: boolean;
  editingCompany?: Company | null;
  onFormCancel?: () => void;
  isFormSubmitting?: boolean;
}

export default function ControlsBar({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onAddCompany,
  showArchived,
  onArchivedToggle,
  showForm = false,
  editingCompany = null,
  onFormCancel,
  isFormSubmitting = false
}: ControlsBarProps) {
  return (
    <div className="bg-white border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {!showForm ? (
            <>
              <button
                onClick={onAddCompany}
                className="bg-blue-50 border border-blue-200 text-gray-600 hover:bg-blue-100/50 text-sm font-bold uppercase tracking-wide px-3 py-1 cursor-pointer transition-colors rounded-md flex items-center"
                data-testid="button-add-company"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </button>
              
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-48 text-xs-13 font-medium bg-white border-gray-300"
                data-testid="input-search"
              />
              
              <Button
                variant={showArchived ? "default" : "outline"}
                size="sm"
                className={`text-xs-13 font-medium px-4 py-2 ${
                  showArchived ? 'bg-[#465193] text-white hover:bg-[#384080]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={onArchivedToggle}
                data-testid="button-archived"
              >
                {showArchived ? 'Show Active' : 'Show Archived'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onFormCancel}
                className="text-gray-600 hover:text-gray-800 text-xs-13 font-medium px-4 py-2"
                data-testid="button-back-to-list"
              >
                ← Back to Companies
              </Button>
              
              <Button
                type="submit"
                form="company-form"
                disabled={isFormSubmitting}
                className="bg-[#465193] text-white hover:bg-[#384080] text-xs-13 font-medium px-4 py-2"
                data-testid="button-submit-company-form"
              >
                {isFormSubmitting ? 'Saving...' : editingCompany ? 'Update Company' : 'Add Company'}
              </Button>
            </>
          )}
        </div>
        
        {!showForm && (
          <div className="flex items-center gap-0 border border-gray-300 overflow-hidden">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              className={`text-xs-13 font-medium px-3 py-2 h-auto ${
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
              onClick={() => onViewModeChange('cards')}
              className={`text-xs-13 font-medium px-3 py-2 h-auto border-l border-gray-300 ${
                viewMode === 'cards' ? 'bg-[#465193] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              data-testid="button-view-cards"
            >
              <Grid className="h-4 w-4 mr-1" />
              Cards
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}