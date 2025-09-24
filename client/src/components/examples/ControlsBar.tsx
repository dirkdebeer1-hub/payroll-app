import { useState } from 'react';
import ControlsBar from '../ControlsBar';

export default function ControlsBarExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  return (
    <ControlsBar
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      onAddCompany={() => console.log('Add company triggered')}
    />
  );
}