import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import EmployeeTable from '@/components/EmployeeTable';
import EmployeeCards from '@/components/EmployeeCards';
import EmployeeControlsBar from '@/components/EmployeeControlsBar';
import EmployeeStatsCards from '@/components/EmployeeStatsCards';
import EmployeeForm from '@/components/EmployeeForm';
import { useToast } from '@/hooks/use-toast';
import type { Employee, InsertEmployee } from '@shared/schema';

// Mock employee data - will be replaced with actual API calls
const mockEmployees: Employee[] = [
  {
    id: '1',
    companyId: 'comp-1',
    firstName: 'John',
    lastName: 'Smith',
    idNumber: '9001015555088',
    taxNumber: 'TAX001',
    email: 'john.smith@company.com',
    phone: '+27 82 555 0001',
    payFrequency: 'Monthly',
    rate: 25000,
    rateType: 'Salary',
    bankName: 'FNB',
    accountNumber: '62123456789',
    branchCode: '250655',
    startDate: '2023-01-15',
    endDate: null,
    status: 'ACTIVE'
  },
  {
    id: '2',
    companyId: 'comp-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    idNumber: '8505204444077',
    taxNumber: 'TAX002',
    email: 'sarah.johnson@company.com',
    phone: '+27 83 555 0002',
    payFrequency: 'Monthly',
    rate: 30000,
    rateType: 'Salary',
    bankName: 'Standard Bank',
    accountNumber: '10123456789',
    branchCode: '051001',
    startDate: '2022-06-01',
    endDate: null,
    status: 'ACTIVE'
  },
  {
    id: '3',
    companyId: 'comp-2',
    firstName: 'Michael',
    lastName: 'Brown',
    idNumber: '7809123333066',
    taxNumber: 'TAX003',
    email: 'michael.brown@company.com',
    phone: '+27 84 555 0003',
    payFrequency: 'Monthly',
    rate: 28000,
    rateType: 'Salary',
    bankName: 'ABSA',
    accountNumber: '40123456789',
    branchCode: '632005',
    startDate: '2023-03-20',
    endDate: null,
    status: 'ACTIVE'
  },
  {
    id: '4',
    companyId: 'comp-1',
    firstName: 'Lisa',
    lastName: 'Wilson',
    idNumber: '9203155555099',
    taxNumber: 'TAX004',
    email: 'lisa.wilson@company.com',
    phone: '+27 85 555 0004',
    payFrequency: 'Monthly',
    rate: 22000,
    rateType: 'Salary',
    bankName: 'Nedbank',
    accountNumber: '12123456789',
    branchCode: '198765',
    startDate: '2021-11-10',
    endDate: '2024-01-31',
    status: 'INACTIVE'
  }
];

export default function Employees() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInactive, setShowInactive] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch employees from API
  const { data: apiEmployees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ['/api/employees']
  });
  
  // Use API data directly - no mock fallback to ensure real backend state
  const employees: Employee[] = apiEmployees;

  // Filter employees based on search and status
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const fullName = `${employee.firstName} ${employee.lastName}`;
      const matchesSearch = searchTerm === '' || 
                           fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           employee.idNumber.includes(searchTerm);
      
      let matchesStatus = true;
      if (statusFilter === 'ACTIVE') {
        matchesStatus = employee.status === 'ACTIVE';
      } else if (statusFilter === 'INACTIVE') {
        matchesStatus = employee.status === 'INACTIVE';
      } else if (statusFilter === 'all') {
        // Show all employees regardless of status
        matchesStatus = true;
      }
      
      return matchesSearch && matchesStatus;
    });
  }, [employees, searchTerm, statusFilter, showInactive]);

  // Calculate stats from real backend data
  const activeEmployees = employees.filter(emp => emp.status === 'ACTIVE').length;
  const inactiveEmployees = employees.filter(emp => emp.status === 'INACTIVE').length;
  const averageSalary = employees.length > 0 
    ? employees.reduce((sum, emp) => sum + emp.rate, 0) / employees.length 
    : 0;

  // Show empty state when no employees
  const showEmptyState = !isLoading && employees.length === 0;

  // Mutations
  const createEmployeeMutation = useMutation({
    mutationFn: (employee: InsertEmployee) => {
      console.log('Creating employee:', employee);
      return apiRequest('POST', '/api/employees', employee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      toast({ title: 'Success', description: 'Employee created successfully' });
      setShowForm(false);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create employee', variant: 'destructive' });
    }
  });
  
  const updateEmployeeMutation = useMutation({
    mutationFn: ({ id, employee }: { id: string; employee: Partial<InsertEmployee> }) => {
      console.log('Updating employee:', id, employee);
      return apiRequest('PUT', `/api/employees/${id}`, employee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      toast({ title: 'Success', description: 'Employee updated successfully' });
      setShowForm(false);
      setEditingEmployee(null);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update employee', variant: 'destructive' });
    }
  });
  
  const deleteEmployeeMutation = useMutation({
    mutationFn: (id: string) => {
      console.log('Deleting employee:', id);
      return apiRequest('DELETE', `/api/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      toast({ title: 'Success', description: 'Employee deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete employee', variant: 'destructive' });
    }
  });
  
  const handleEmployeeAction = (action: string, id: string) => {
    console.log(`${action} action triggered for employee:`, id);
    
    if (action === 'Delete') {
      if (confirm('Are you sure you want to delete this employee?')) {
        deleteEmployeeMutation.mutate(id);
      }
    } else if (action === 'Deactivate' || action === 'Activate') {
      const newStatus = action === 'Deactivate' ? 'INACTIVE' : 'ACTIVE';
      updateEmployeeMutation.mutate({ 
        id, 
        employee: { status: newStatus as 'ACTIVE' | 'INACTIVE' } 
      });
    } else if (action === 'Edit') {
      const employee = employees.find(emp => emp.id === id);
      if (employee) {
        setEditingEmployee(employee);
        setShowForm(true);
      }
    } else if (action === 'View') {
      // //todo: implement view employee details modal
      console.log('View employee details for:', id);
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };
  
  const handleFormSubmit = (data: InsertEmployee) => {
    if (editingEmployee) {
      updateEmployeeMutation.mutate({ id: editingEmployee.id, employee: data });
    } else {
      createEmployeeMutation.mutate(data);
    }
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleInactiveToggle = () => {
    setShowInactive(!showInactive);
    console.log('Inactive toggle triggered:', !showInactive ? 'Showing inactive' : 'Showing active');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          showBackButton={true}
          onBack={() => navigate('/')}
          title="Employee Management"
        />
        
        <main className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-auto">
          <EmployeeStatsCards
            totalEmployees={employees.length}
            activeEmployees={activeEmployees}
            inactiveEmployees={inactiveEmployees}
            averageSalary={averageSalary}
          />
          
          <EmployeeControlsBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddEmployee={handleAddEmployee}
            showInactive={showInactive}
            onInactiveToggle={handleInactiveToggle}
          />
          
          {showEmptyState ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">No employees found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Get started by adding your first employee to the system.
                </p>
              </div>
              <Button onClick={handleAddEmployee} data-testid="button-add-first-employee">
                Add First Employee
              </Button>
            </div>
          ) : (
            <>
              {/* Mobile: Always show cards */}
              <div className="block sm:hidden">
                <EmployeeCards
                  employees={filteredEmployees}
                  onView={(id: string) => handleEmployeeAction('View', id)}
                  onEdit={(id: string) => handleEmployeeAction('Edit', id)}
                  onDeactivate={(id: string) => handleEmployeeAction(showInactive ? 'Activate' : 'Deactivate', id)}
                  onDelete={(id: string) => handleEmployeeAction('Delete', id)}
                  showInactive={showInactive}
                />
              </div>
              
              {/* Desktop: Show user's selected view mode */}
              <div className="hidden sm:block">
                {viewMode === 'table' ? (
                  <EmployeeTable
                    employees={filteredEmployees}
                    onView={(id: string) => handleEmployeeAction('View', id)}
                    onEdit={(id: string) => handleEmployeeAction('Edit', id)}
                    onDeactivate={(id: string) => handleEmployeeAction(showInactive ? 'Activate' : 'Deactivate', id)}
                    onDelete={(id: string) => handleEmployeeAction('Delete', id)}
                    showInactive={showInactive}
                  />
                ) : (
                  <EmployeeCards
                    employees={filteredEmployees}
                    onView={(id: string) => handleEmployeeAction('View', id)}
                    onEdit={(id: string) => handleEmployeeAction('Edit', id)}
                    onDeactivate={(id: string) => handleEmployeeAction(showInactive ? 'Activate' : 'Deactivate', id)}
                    onDelete={(id: string) => handleEmployeeAction('Delete', id)}
                    showInactive={showInactive}
                  />
                )}
              </div>
            </>
          )}
        </main>
      </div>
      
      {/* Employee Form Modal */}
      {showForm && (
        <EmployeeForm
          employee={editingEmployee || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isSubmitting={createEmployeeMutation.isPending || updateEmployeeMutation.isPending}
        />
      )}
    </div>
  );
}