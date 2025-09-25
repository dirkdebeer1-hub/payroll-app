import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEmployeeSchema } from "@shared/schema";
import type { InsertEmployee, Employee, Company } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: InsertEmployee) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function EmployeeForm({ employee, onSubmit, onCancel, isSubmitting = false }: EmployeeFormProps) {
  // Fetch companies for selection
  const { data: companies = [] } = useQuery({
    queryKey: ['/api/companies']
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<InsertEmployee>({
    resolver: zodResolver(insertEmployeeSchema),
    defaultValues: employee ? {
      companyId: employee.companyId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      idNumber: employee.idNumber,
      taxNumber: employee.taxNumber || '',
      email: employee.email || '',
      phone: employee.phone || '',
      payFrequency: employee.payFrequency,
      rate: employee.rate,
      rateType: employee.rateType,
      bankName: employee.bankName || '',
      accountNumber: employee.accountNumber || '',
      branchCode: employee.branchCode || '',
      startDate: employee.startDate,
      endDate: employee.endDate || '',
      status: employee.status
    } : {
      companyId: '',
      firstName: '',
      lastName: '',
      idNumber: '',
      taxNumber: '',
      email: '',
      phone: '',
      payFrequency: 'Monthly',
      rate: 0,
      rateType: 'Salary',
      bankName: '',
      accountNumber: '',
      branchCode: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'ACTIVE'
    }
  });

  const payFrequency = watch('payFrequency');
  const rateType = watch('rateType');
  const companyId = watch('companyId');

  // Update companyId when companies are loaded and no company is selected
  useEffect(() => {
    if (companies.length > 0 && !companyId && !employee) {
      setValue('companyId', companies[0].id);
    }
  }, [companies, companyId, employee, setValue]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            data-testid="button-close-form"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  data-testid="input-first-name"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  data-testid="input-last-name"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="idNumber">ID Number *</Label>
                <Input
                  id="idNumber"
                  {...register('idNumber')}
                  placeholder="e.g., 9001015555088"
                  data-testid="input-id-number"
                />
                {errors.idNumber && (
                  <p className="text-sm text-red-600">{errors.idNumber.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="taxNumber">Tax Number</Label>
                <Input
                  id="taxNumber"
                  {...register('taxNumber')}
                  placeholder="e.g., TAX001"
                  data-testid="input-tax-number"
                />
                {errors.taxNumber && (
                  <p className="text-sm text-red-600">{errors.taxNumber.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="employee@company.com"
                  data-testid="input-email"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+27 82 555 0001"
                  data-testid="input-phone"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Company Selection */}
            <div>
              <Label htmlFor="companyId">Company *</Label>
              <Select value={companyId} onValueChange={(value) => setValue('companyId', value)}>
                <SelectTrigger data-testid="select-company">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.companyId && (
                <p className="text-sm text-red-600">{errors.companyId.message}</p>
              )}
            </div>

            {/* Employment Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="payFrequency">Pay Frequency *</Label>
                <Select value={payFrequency} onValueChange={(value) => setValue('payFrequency', value as any)}>
                  <SelectTrigger data-testid="select-pay-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                {errors.payFrequency && (
                  <p className="text-sm text-red-600">{errors.payFrequency.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="rateType">Rate Type *</Label>
                <Select value={rateType} onValueChange={(value) => setValue('rateType', value as any)}>
                  <SelectTrigger data-testid="select-rate-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salary">Salary</SelectItem>
                    <SelectItem value="Hourly">Hourly</SelectItem>
                  </SelectContent>
                </Select>
                {errors.rateType && (
                  <p className="text-sm text-red-600">{errors.rateType.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="rate">Rate (ZAR) *</Label>
                <Input
                  id="rate"
                  type="number"
                  {...register('rate', { valueAsNumber: true })}
                  placeholder="25000"
                  data-testid="input-rate"
                />
                {errors.rate && (
                  <p className="text-sm text-red-600">{errors.rate.message}</p>
                )}
              </div>
            </div>

            {/* Banking Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  {...register('bankName')}
                  placeholder="FNB"
                  data-testid="input-bank-name"
                />
                {errors.bankName && (
                  <p className="text-sm text-red-600">{errors.bankName.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  {...register('accountNumber')}
                  placeholder="62123456789"
                  data-testid="input-account-number"
                />
                {errors.accountNumber && (
                  <p className="text-sm text-red-600">{errors.accountNumber.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="branchCode">Branch Code</Label>
                <Input
                  id="branchCode"
                  {...register('branchCode')}
                  placeholder="250655"
                  data-testid="input-branch-code"
                />
                {errors.branchCode && (
                  <p className="text-sm text-red-600">{errors.branchCode.message}</p>
                )}
              </div>
            </div>

            {/* Employment Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                  data-testid="input-start-date"
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                  data-testid="input-end-date"
                />
                {errors.endDate && (
                  <p className="text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Company ID is now handled by the visible company selector above */}

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                data-testid="button-submit"
              >
                {isSubmitting ? 'Saving...' : (employee ? 'Update Employee' : 'Add Employee')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}