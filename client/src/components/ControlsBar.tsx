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
}

export default function ControlsBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onAddCompany
}: ControlsBarProps) {
  return (
    <div className="bg-card border border-card-border rounded-md p-3 mb-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <Button
            onClick={onAddCompany}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-2 py-1 h-auto hover-elevate"
            data-testid="button-add-company"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
          
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-32 text-xs h-6"
            data-testid="input-search"
          />
          
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-24 text-xs h-6" data-testid="select-status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="secondary"
            className="text-xs px-2 py-1 h-auto hover-elevate"
            onClick={() => console.log('Archive triggered')}
            data-testid="button-archived"
          >
            Archived
          </Button>
        </div>
        
        <div className="flex items-center gap-0 border border-border rounded-md overflow-hidden">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            className={`text-xs px-2 py-1 h-auto rounded-none ${
              viewMode === 'table' ? 'bg-primary text-primary-foreground' : 'bg-background'
            }`}
            data-testid="button-view-table"
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('cards')}
            className={`text-xs px-2 py-1 h-auto rounded-none border-l border-border ${
              viewMode === 'cards' ? 'bg-primary text-primary-foreground' : 'bg-background'
            }`}
            data-testid="button-view-cards"
          >
            Cards
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          25
        </div>
      </div>
    </div>
  );
}