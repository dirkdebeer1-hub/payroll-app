import { useState } from "react";
import { Plus, Search, Table, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ControlsBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  onAddCompany: () => void;
  showArchived: boolean;
  onArchivedToggle: () => void;
}

export default function ControlsBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onAddCompany,
  showArchived,
  onArchivedToggle
}: ControlsBarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 mb-6 font-['Roboto']">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <Button
            onClick={onAddCompany}
            size="sm"
            className="bg-[#465193] text-white hover:bg-[#384080] text-sm px-4 py-2"
            data-testid="button-add-company"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
          
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-48 text-sm bg-white border-gray-300"
            data-testid="input-search"
          />
          
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-32 text-sm bg-white border-gray-300" data-testid="select-status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
          
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
        </div>
        
        <div className="flex items-center gap-0 border border-gray-300 rounded-md overflow-hidden">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
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
            onClick={() => onViewModeChange('cards')}
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
    </div>
  );
}