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
    <div className="bg-card border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Left side - Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search employees by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
              data-testid="input-search-employees"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-32" data-testid="select-status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center border rounded-md">
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
            variant={showInactive ? "default" : "secondary"}
            className={showInactive ? 'bg-primary text-primary-foreground' : ''}
            onClick={onInactiveToggle}
            data-testid="button-inactive-toggle"
          >
            {showInactive ? (
              <>
                <Users className="h-3 w-3 mr-1" />
                Show Active
              </>
            ) : (
              <>
                <UserX className="h-3 w-3 mr-1" />
                Show Inactive
              </>
            )}
          </Button>

          <Button
            variant="default"
            className=""
            onClick={onAddEmployee}
            data-testid="button-add-employee"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Employee
          </Button>
        </div>
      </div>
    </div>
  );
}