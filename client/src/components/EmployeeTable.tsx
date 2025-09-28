import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, UserX, UserCheck, Trash2 } from "lucide-react";
import type { Employee } from '@shared/schema';

interface EmployeeTableProps {
  employees: Employee[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
  showInactive?: boolean;
}

export default function EmployeeTable({ 
  employees, 
  onView, 
  onEdit, 
  onDeactivate, 
  onDelete,
  showInactive = false
}: EmployeeTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-ZA');
  };

  if (employees.length === 0) {
    return (
      <div className="bg-card border rounded-lg">
        <div className="p-8 text-center">
          <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No {showInactive ? 'inactive' : 'active'} employees found
          </h3>
          <p className="text-muted-foreground">
            {showInactive 
              ? "There are no inactive employees to display."
              : "Get started by adding your first employee."
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-card sticky top-0 z-10">
              <TableHead className="text-xs font-medium text-muted-foreground bg-card">Name</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground bg-card">ID Number</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground bg-card">Email</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground bg-card">Phone</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground bg-card">Salary</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground bg-card">Frequency</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground bg-card">Start Date</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground bg-card">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground bg-card text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-muted/50">
                <TableCell className="py-2">
                  <div>
                    <div className="font-medium text-sm" data-testid={`text-employee-name-${employee.id}`}>
                      {employee.firstName} {employee.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">{employee.taxNumber}</div>
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <span className="text-sm font-mono" data-testid={`text-employee-id-${employee.id}`}>
                    {employee.idNumber}
                  </span>
                </TableCell>
                <TableCell className="py-2">
                  <span className="text-sm" data-testid={`text-employee-email-${employee.id}`}>
                    {employee.email || '-'}
                  </span>
                </TableCell>
                <TableCell className="py-2">
                  <span className="text-sm" data-testid={`text-employee-phone-${employee.id}`}>
                    {employee.phone || '-'}
                  </span>
                </TableCell>
                <TableCell className="py-2">
                  <div>
                    <div className="text-sm font-medium" data-testid={`text-employee-salary-${employee.id}`}>
                      {formatCurrency(employee.rate)}
                    </div>
                    <div className="text-xs text-muted-foreground">{employee.rateType}</div>
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <span className="text-sm" data-testid={`text-employee-frequency-${employee.id}`}>
                    {employee.payFrequency}
                  </span>
                </TableCell>
                <TableCell className="py-2">
                  <span className="text-sm" data-testid={`text-employee-start-date-${employee.id}`}>
                    {formatDate(employee.startDate)}
                  </span>
                </TableCell>
                <TableCell className="py-2">
                  <span 
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      employee.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                    data-testid={`text-employee-status-${employee.id}`}
                  >
                    {employee.status}
                  </span>
                </TableCell>
                <TableCell className="py-2 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(employee.id)}
                      className="px-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                      data-testid={`button-view-${employee.id}`}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(employee.id)}
                      className="px-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                      data-testid={`button-edit-${employee.id}`}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeactivate(employee.id)}
                      className="px-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                      data-testid={`button-deactivate-${employee.id}`}
                    >
                      {showInactive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(employee.id)}
                      className="px-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                      data-testid={`button-delete-${employee.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}