import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, DollarSign } from "lucide-react";

interface EmployeeStatsCardsProps {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  averageSalary: number;
}

export default function EmployeeStatsCards({
  totalEmployees,
  activeEmployees,
  inactiveEmployees,
  averageSalary
}: EmployeeStatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card className="hover-elevate">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs-13 font-medium text-secondary-foreground">
            Total Employees
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-total-employees">
            {totalEmployees}
          </div>
          <p className="text-xs text-muted-foreground">
            All registered employees
          </p>
        </CardContent>
      </Card>

      <Card className="hover-elevate">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs-13 font-medium text-secondary-foreground">
            Active Employees
          </CardTitle>
          <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="text-active-employees">
            {activeEmployees}
          </div>
          <p className="text-xs text-muted-foreground">
            Currently employed
          </p>
        </CardContent>
      </Card>

      <Card className="hover-elevate">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs-13 font-medium text-secondary-foreground">
            Inactive Employees
          </CardTitle>
          <UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400" data-testid="text-inactive-employees">
            {inactiveEmployees}
          </div>
          <p className="text-xs text-muted-foreground">
            No longer employed
          </p>
        </CardContent>
      </Card>

      <Card className="hover-elevate">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs-13 font-medium text-secondary-foreground">
            Average Salary
          </CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-average-salary">
            {formatCurrency(averageSalary)}
          </div>
          <p className="text-xs text-muted-foreground">
            Monthly average
          </p>
        </CardContent>
      </Card>
    </div>
  );
}