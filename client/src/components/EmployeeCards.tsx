import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Edit, UserX, UserCheck, Trash2, Mail, Phone, Calendar } from "lucide-react";
import type { Employee } from '@shared/schema';

interface EmployeeCardsProps {
  employees: Employee[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
  showInactive?: boolean;
}

export default function EmployeeCards({ 
  employees, 
  onView, 
  onEdit, 
  onDeactivate, 
  onDelete,
  showInactive = false
}: EmployeeCardsProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((employee) => (
        <Card key={employee.id} className="hover-elevate">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-base font-semibold mb-1" data-testid={`card-employee-name-${employee.id}`}>
                  {employee.firstName} {employee.lastName}
                </CardTitle>
                <p className="text-sm text-muted-foreground font-mono" data-testid={`card-employee-id-${employee.id}`}>
                  {employee.idNumber}
                </p>
                <p className="text-xs text-muted-foreground">{employee.taxNumber}</p>
              </div>
              <span 
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  employee.status === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                }`}
                data-testid={`card-employee-status-${employee.id}`}
              >
                {employee.status}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="h-3 w-3 mr-2 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground truncate" data-testid={`card-employee-email-${employee.id}`}>
                  {employee.email || 'No email'}
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                <Phone className="h-3 w-3 mr-2 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground" data-testid={`card-employee-phone-${employee.id}`}>
                  {employee.phone || 'No phone'}
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                <Calendar className="h-3 w-3 mr-2 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground" data-testid={`card-employee-start-date-${employee.id}`}>
                  Started {formatDate(employee.startDate)}
                </span>
              </div>
            </div>

            <div className="bg-muted rounded-md p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Salary</span>
                <span className="text-xs text-muted-foreground">{employee.payFrequency}</span>
              </div>
              <div className="text-lg font-semibold text-foreground" data-testid={`card-employee-salary-${employee.id}`}>
                {formatCurrency(employee.rate)}
              </div>
              <div className="text-xs text-muted-foreground">{employee.rateType}</div>
            </div>

            <div className="flex gap-1 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(employee.id)}
                className="px-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 flex-1"
                data-testid={`card-button-view-${employee.id}`}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(employee.id)}
                className="px-1.5 text-xs bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900 dark:text-orange-100 dark:hover:bg-orange-800 flex-1"
                data-testid={`card-button-edit-${employee.id}`}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeactivate(employee.id)}
                className={`px-1.5 text-xs flex-1 ${
                  showInactive 
                    ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                data-testid={`card-button-deactivate-${employee.id}`}
              >
                {showInactive ? <UserCheck className="h-3 w-3 mr-1" /> : <UserX className="h-3 w-3 mr-1" />}
                {showInactive ? 'Activate' : 'Deactivate'}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(employee.id)}
                className="px-1.5 text-xs bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
                data-testid={`card-button-delete-${employee.id}`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}