import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Grid3X3, Table, Users, UserX } from "lucide-react";

interface EmployeeControlsBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  onAddEmployee: () => void;
  showInactive: boolean;
  onInactiveToggle: () => void;
}

export default function EmployeeControlsBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onAddEmployee,
  showInactive,
  onInactiveToggle
}: EmployeeControlsBarProps) {
  return (
    <div className="bg-card border rounded-lg p-3 sm:p-4">
      <div className="flex flex-col gap-4">
        {/* Search and filters */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
              data-testid="input-search-employees"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="flex-1" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Remove confusing inactive toggle since we have status filter dropdown */}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* View toggle - hidden on mobile since mobile always uses cards */}
          <div className="hidden sm:flex items-center border rounded-md">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              className="rounded-r-none border-r"
              data-testid="button-table-view"
            >
              <Table className="h-3 w-3" />
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('cards')}
              className="rounded-l-none"
              data-testid="button-cards-view"
            >
              <Grid3X3 className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={onAddEmployee}
            className="w-full sm:w-auto"
            data-testid="button-add-employee"
          >
            <Plus className="h-3 w-3 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>
    </div>
  );
}