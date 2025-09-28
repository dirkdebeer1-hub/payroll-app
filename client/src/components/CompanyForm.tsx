import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCompanySchema } from "@shared/schema";
import type { InsertCompany, Company } from "@shared/schema";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, Copy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: InsertCompany) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isInline?: boolean;
}

// South African provinces
const SA_PROVINCES = [
  { value: "eastern-cape", label: "Eastern Cape" },
  { value: "free-state", label: "Free State" },
  { value: "gauteng", label: "Gauteng" },
  { value: "kwazulu-natal", label: "KwaZulu-Natal" },
  { value: "limpopo", label: "Limpopo" },
  { value: "mpumalanga", label: "Mpumalanga" },
  { value: "northern-cape", label: "Northern Cape" },
  { value: "north-west", label: "North West" },
  { value: "western-cape", label: "Western Cape" }
];

export default function CompanyForm({ company, onSubmit, onCancel, isSubmitting = false, isInline = false }: CompanyFormProps) {
  const [activeTab, setActiveTab] = useState("company-settings");
  const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo || null);
  const [copyAddress, setCopyAddress] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  // Fetch existing companies to check for duplicates
  const { data: existingCompanies = [] } = useQuery<Company[]>({
    queryKey: ['/api/companies'],
  });

  // Handle escape key and focus management (only for modal mode)
  useEffect(() => {
    if (!isInline) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      };

      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [onCancel, isInline]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<InsertCompany>({
    resolver: zodResolver(insertCompanySchema),
    defaultValues: company ? {
      name: company.name,
      logo: company.logo,
      country: company.country,
      employees: company.employees,
      payslips: company.payslips,
      status: company.status,
      registration: company.registration || '',
      physicalAddress: company.physicalAddress || '',
      physicalAddressLine2: company.physicalAddressLine2 || '',
      physicalAddressLine3: company.physicalAddressLine3 || '',
      city: company.city || '',
      province: company.province || '',
      postalCode: company.postalCode || '',
      streetCode: company.streetCode || '',
      telephone: company.telephone || '',
      fax: company.fax || '',
      email: company.email || '',
      postalAddress: company.postalAddress || '',
      postalAddressLine2: company.postalAddressLine2 || '',
      postalAddressLine3: company.postalAddressLine3 || '',
      postalCity: company.postalCity || '',
      postalProvince: company.postalProvince || '',
      postalPostalCode: company.postalPostalCode || '',
      timezone: company.timezone || '',
      taxNumber: company.taxNumber || '',
      vatNumber: company.vatNumber || '',
      payeNumber: company.payeNumber || '',
      sdlNumber: company.sdlNumber || '',
      sdlContribution: company.sdlContribution,
      uifNumber: company.uifNumber || '',
      uifEmployerReference: company.uifEmployerReference || '',
      extratimeRate: company.extratimeRate,
      overtimeRate: company.overtimeRate,
      doubletimeRate: company.doubletimeRate,
      lastDayOfWeek: company.lastDayOfWeek,
      disableShading: company.disableShading,
      enableTimekeeping: company.enableTimekeeping,
      eligibleForETI: company.eligibleForETI,
      monthlyMinimumWage: company.monthlyMinimumWage,
      tradeClassification: company.tradeClassification || '',
      industryClassificationCode: company.industryClassificationCode || '',
      branchCode: company.branchCode || '',
      bankAccountNumber: company.bankAccountNumber || '',
      bankAccountHolderName: company.bankAccountHolderName || '',
      bankingReference: company.bankingReference || '',
      taxType: company.taxType,
      addOvertimeFromTravel: company.addOvertimeFromTravel,
      subtractAbsentFromAllowances: company.subtractAbsentFromAllowances,
      showHourlyRate: company.showHourlyRate,
      showOrdinaryHours: company.showOrdinaryHours,
      addLoansToPayslips: company.addLoansToPayslips,
      allowChangeLeavePayoutOnPayslips: company.allowChangeLeavePayoutOnPayslips,
      useOvertimeLeave: company.useOvertimeLeave,
      printPublicHolidayOnPayslips: company.printPublicHolidayOnPayslips,
      hideZeroOvertimeAndLeave: company.hideZeroOvertimeAndLeave,
      showSdlOnPayslips: company.showSdlOnPayslips,
      showBankingDetailsOnPayslips: company.showBankingDetailsOnPayslips,
      showOvertimeRatesOnPayslips: company.showOvertimeRatesOnPayslips,
      automaticLeaveAccrual: company.automaticLeaveAccrual,
      sickLeaveDaysPer36Months: company.sickLeaveDaysPer36Months,
      annualLeaveDaysPerMonth: company.annualLeaveDaysPerMonth,
      printSickLeaveBalance: company.printSickLeaveBalance,
      printAnnualLeaveBalance: company.printAnnualLeaveBalance,
      printOvertimeLeaveBalance: company.printOvertimeLeaveBalance,
      maternityLeaveIsPaid: company.maternityLeaveIsPaid,
      parentalLeaveIsPaid: company.parentalLeaveIsPaid,
      contactPersonFirstName: company.contactPersonFirstName || '',
      contactPersonSurname: company.contactPersonSurname || '',
      contactPersonBusinessPhone: company.contactPersonBusinessPhone || '',
      contactPersonBusinessEmail: company.contactPersonBusinessEmail || '',
      contactPersonUnitNumber: company.contactPersonUnitNumber || '',
      contactPersonComplex: company.contactPersonComplex || '',
      contactPersonStreetNumber: company.contactPersonStreetNumber || '',
      contactPersonStreetName: company.contactPersonStreetName || '',
      contactPersonSuburb: company.contactPersonSuburb || '',
      contactPersonCityTown: company.contactPersonCityTown || '',
      contactPersonPostalCode: company.contactPersonPostalCode || '',
      contactPersonCountry: company.contactPersonCountry || 'South Africa',
      declarantFirstName: company.declarantFirstName || '',
      declarantSurname: company.declarantSurname || '',
      declarantIdNumber: company.declarantIdNumber || '',
      declarantContactEmail: company.declarantContactEmail || '',
      declarantInitials: company.declarantInitials || '',
      declarantPosition: company.declarantPosition || '',
      declarantBusinessPhone: company.declarantBusinessPhone || '',
      declarantFaxNumber: company.declarantFaxNumber || '',
      declarantCellNumber: company.declarantCellNumber || '',
      declarantDateOfBirth: company.declarantDateOfBirth || '',
      payslipType: company.payslipType,
      customPayperiod: company.customPayperiod,
      customPayperiodName: company.customPayperiodName || '',
      customPayperiodDays: company.customPayperiodDays || undefined,
      customPayperiodFirstDay: company.customPayperiodFirstDay || '',
    } : {
      name: 'Demo Tech Solutions (Pty) Ltd',
      logo: undefined,
      country: 'South Africa',
      employees: 25,
      payslips: 125,
      registration: '2018/123456/07',
      physicalAddress: '456 Business Park Drive',
      physicalAddressLine2: 'Suite 201',
      physicalAddressLine3: 'Tech Hub Complex',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      telephone: '021 555 0123',
      fax: '021 555 0124',
      email: 'info@demotechsolutions.co.za',
      postalAddress: 'PO Box 12345',
      postalAddressLine2: '',
      postalAddressLine3: '',
      postalCity: 'Cape Town',
      postalProvince: 'Western Cape',
      postalPostalCode: '8000',
      timezone: 'SAST',
      taxNumber: '9012345678',
      vatNumber: '4123456789',
      payeNumber: '7123456789',
      sdlNumber: 'L123456789',
      sdlContribution: true,
      uifNumber: 'U123456789',
      uifEmployerReference: '1234567/8',
      extratimeRate: 1.33,
      overtimeRate: 1.5,
      doubletimeRate: 2.0,
      lastDayOfWeek: 'Sunday',
      disableShading: false,
      enableTimekeeping: true,
      eligibleForETI: true,
      monthlyMinimumWage: 2456.0,
      tradeClassification: 'Information Technology',
      industryClassificationCode: '62010: Computer programming activities',
      branchCode: '632005',
      bankAccountNumber: '1234567890',
      bankAccountHolderName: 'Demo Tech Solutions (Pty) Ltd',
      bankingReference: 'PAYROLL',
      taxType: 'Average',
      addOvertimeFromTravel: false,
      subtractAbsentFromAllowances: true,
      showHourlyRate: true,
      showOrdinaryHours: true,
      addLoansToPayslips: true,
      allowChangeLeavePayoutOnPayslips: true,
      useOvertimeLeave: false,
      printPublicHolidayOnPayslips: true,
      hideZeroOvertimeAndLeave: true,
      showSdlOnPayslips: true,
      showBankingDetailsOnPayslips: true,
      showOvertimeRatesOnPayslips: 'Yes',
      automaticLeaveAccrual: true,
      sickLeaveDaysPer36Months: 30.0,
      annualLeaveDaysPerMonth: 1.25,
      printSickLeaveBalance: 'Yes',
      printAnnualLeaveBalance: 'Yes',
      printOvertimeLeaveBalance: 'No',
      maternityLeaveIsPaid: true,
      parentalLeaveIsPaid: false,
      contactPersonFirstName: 'Sarah',
      contactPersonSurname: 'Johnson',
      contactPersonBusinessPhone: '021 555 0125',
      contactPersonBusinessEmail: 'sarah.johnson@demotechsolutions.co.za',
      contactPersonUnitNumber: '12',
      contactPersonComplex: 'Tech Hub Complex',
      contactPersonStreetNumber: '456',
      contactPersonStreetName: 'Business Park Drive',
      contactPersonSuburb: 'Foreshore',
      contactPersonCityTown: 'Cape Town',
      contactPersonPostalCode: '8001',
      contactPersonCountry: 'South Africa',
      declarantFirstName: 'Michael',
      declarantSurname: 'Davies',
      declarantIdNumber: '8501015800087',
      declarantContactEmail: 'michael.davies@demotechsolutions.co.za',
      declarantInitials: 'M.J.',
      declarantPosition: 'Financial Director',
      declarantBusinessPhone: '021 555 0126',
      declarantFaxNumber: '021 555 0127',
      declarantCellNumber: '082 555 1234',
      declarantDateOfBirth: '1985-01-01',
      payslipType: 'A4 - Plain paper - Default layout B',
      customPayperiod: false,
      customPayperiodName: '',
      customPayperiodDays: undefined,
      customPayperiodFirstDay: '',
    }
  });

  // Watch physical address fields for real-time copying
  const physicalAddress = watch("physicalAddress");
  const physicalAddressLine2 = watch("physicalAddressLine2");
  const physicalAddressLine3 = watch("physicalAddressLine3");
  const province = watch("province");
  const postalCode = watch("postalCode");

  // Handle copying physical address to postal address - keep synchronized
  useEffect(() => {
    if (copyAddress) {
      setValue("postalAddress", physicalAddress || "", { shouldDirty: true });
      setValue("postalAddressLine2", physicalAddressLine2 || "", { shouldDirty: true });
      setValue("postalAddressLine3", physicalAddressLine3 || "", { shouldDirty: true });
      setValue("postalProvince", province || "", { shouldDirty: true });
      setValue("postalPostalCode", postalCode || "", { shouldDirty: true });
    }
  }, [copyAddress, physicalAddress, physicalAddressLine2, physicalAddressLine3, province, postalCode, setValue]);

  // Check for duplicate registration number
  const checkDuplicateRegistration = (registration: string) => {
    if (!registration.trim()) {
      setRegistrationError("");
      return;
    }
    
    const isDuplicate = existingCompanies.some(c => 
      c.registration?.toLowerCase().trim() === registration.toLowerCase().trim() && 
      c.id !== company?.id
    );
    
    if (isDuplicate) {
      setRegistrationError("A company with this registration number already exists");
    } else {
      setRegistrationError("");
    }
  };

  // Custom submit handler to check for duplicates
  const handleFormSubmit = (data: InsertCompany) => {
    // Final duplicate check before submission
    if (registrationError) {
      return;
    }
    onSubmit(data);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setLogoPreview(base64String);
        setValue('logo', base64String, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a valid JPG or PNG file.');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className={isInline ? "" : "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"}
      onClick={isInline ? undefined : handleBackdropClick}
      role={isInline ? undefined : "dialog"}
      aria-modal={isInline ? undefined : "true"}
      aria-labelledby={isInline ? undefined : "company-form-title"}
    >
      <Card 
        className={`w-full bg-[#f7fbff] font-['Roboto'] ${
          isInline ? "h-full flex flex-col" : "max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        }`}
        onClick={isInline ? undefined : (e) => e.stopPropagation()}
      >
        {!isInline && (
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle id="company-form-title">{company ? 'Company Settings' : 'Add New Company'}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              data-testid="button-close-company-form"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
        )}
        <CardContent className={`space-y-4 bg-[#f7fbff] ${isInline ? "flex-1 overflow-y-auto min-h-0" : ""}`}>
          <form 
            id={isInline ? "company-form" : undefined}
            onSubmit={handleSubmit(handleFormSubmit)} 
            className="space-y-4"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-9 w-full h-auto text-sm bg-[#465193]">
                <TabsTrigger value="company-settings" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Info</TabsTrigger>
                <TabsTrigger value="bank-details" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Bank details</TabsTrigger>
                <TabsTrigger value="tax-type" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Tax type</TabsTrigger>
                <TabsTrigger value="payslips-settings" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Payslips settings</TabsTrigger>
                <TabsTrigger value="leave-settings" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Leave</TabsTrigger>
                <TabsTrigger value="contact-person" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Contact person</TabsTrigger>
                <TabsTrigger value="declarant" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Declarant</TabsTrigger>
                <TabsTrigger value="payslips-type" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Payslips type</TabsTrigger>
                <TabsTrigger value="south-africa" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Classification</TabsTrigger>
              </TabsList>

              {/* Info Tab - Responsive Layout */}
              <TabsContent value="company-settings" className="space-y-6">
                {/* Compact Form Fields for Desktop */}
                <div className="space-y-3">
                  {/* Company name and Telephone */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <Label htmlFor="name" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Company name <span className="text-red-500">*</span></Label>
                      <div className="lg:flex-1">
                        <Input
                          id="name"
                          {...register("name")}
                          placeholder="Company name"
                          data-testid="input-company-name"
                          className="bg-white mt-1 lg:mt-0"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <Label htmlFor="telephone" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Telephone <span className="text-red-500">*</span></Label>
                      <div className="lg:flex-1">
                        <Input
                          id="telephone"
                          {...register("telephone")}
                          placeholder="Telephone number"
                          data-testid="input-telephone"
                          className="bg-white mt-1 lg:mt-0"
                        />
                        {errors.telephone && (
                          <p className="text-sm text-red-500 mt-1">{errors.telephone.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Registration and Email */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <Label htmlFor="registration" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Company registration <span className="text-red-500">*</span></Label>
                      <div className="lg:flex-1">
                        <Input
                          id="registration"
                          {...register("registration")}
                          placeholder="2006/165834/23"
                          data-testid="input-registration"
                          className="bg-white mt-1 lg:mt-0"
                          onChange={(e) => {
                            register("registration").onChange(e);
                            checkDuplicateRegistration(e.target.value);
                          }}
                        />
                        {registrationError && (
                          <p className="text-sm text-red-500 mt-1">{registrationError}</p>
                        )}
                        {errors.registration && (
                          <p className="text-sm text-red-500 mt-1">{errors.registration.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <Label htmlFor="email" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Email <span className="text-red-500">*</span></Label>
                      <div className="lg:flex-1">
                        <Input
                          id="email"
                          {...register("email")}
                          placeholder="Email address"
                          data-testid="input-email"
                          className="bg-white mt-1 lg:mt-0"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Tax number and Extratime rate */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <Label htmlFor="taxNumber" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Tax number <span className="text-red-500">*</span></Label>
                      <div className="lg:flex-1">
                        <Input
                          id="taxNumber"
                          {...register("taxNumber")}
                          placeholder="Tax number"
                          data-testid="input-tax-number"
                          className="bg-white mt-1 lg:mt-0"
                        />
                        {errors.taxNumber && (
                          <p className="text-sm text-red-500 mt-1">{errors.taxNumber.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <Label htmlFor="extratimeRate" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Extratime rate <span className="text-red-500">*</span></Label>
                      <div className="lg:flex-1">
                        <Input
                          id="extratimeRate"
                          type="number"
                          step="0.01"
                          {...register("extratimeRate")}
                          placeholder="1.33"
                          data-testid="input-extratime-rate"
                          className="bg-white mt-1 lg:mt-0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* VAT number and Overtime rate */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <Label htmlFor="vatNumber" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">VAT number <span className="text-red-500">*</span></Label>
                      <div className="lg:flex-1">
                        <Input
                          id="vatNumber"
                          {...register("vatNumber")}
                          placeholder="VAT number"
                          data-testid="input-vat-number"
                          className="bg-white mt-1 lg:mt-0"
                        />
                        {errors.vatNumber && (
                          <p className="text-sm text-red-500 mt-1">{errors.vatNumber.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <Label htmlFor="overtimeRate" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Overtime rate <span className="text-red-500">*</span></Label>
                      <div className="lg:flex-1">
                        <Input
                          id="overtimeRate"
                          type="number"
                          step="0.01"
                          {...register("overtimeRate")}
                          placeholder="1.5"
                          data-testid="input-overtime-rate"
                          className="bg-white mt-1 lg:mt-0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PAYE number and Doubletime rate */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <Label htmlFor="payeNumber" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">PAYE number <span className="text-red-500">*</span></Label>
                      <div className="lg:flex-1">
                        <Input
                          id="payeNumber"
                          {...register("payeNumber")}
                          placeholder="7370773675"
                          data-testid="input-paye-number"
                          className="bg-white mt-1 lg:mt-0"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <Label htmlFor="doubletimeRate" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Doubletime rate <span className="text-red-500">*</span></Label>
                      <div className="lg:flex-1">
                        <Input
                          id="doubletimeRate"
                          type="number"
                          step="0.01"
                          {...register("doubletimeRate")}
                          placeholder="2.0"
                          data-testid="input-doubletime-rate"
                          className="bg-white mt-1 lg:mt-0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SDL number and Last day of week */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <Label htmlFor="sdlNumber" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">SDL number <span className="text-red-500">*</span></Label>
                      <div className="lg:flex-1">
                        <Input
                          id="sdlNumber"
                          {...register("sdlNumber")}
                          placeholder="L370773675"
                          data-testid="input-sdl-number"
                          className="bg-white mt-1 lg:mt-0"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <Label htmlFor="lastDayOfWeek" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Last day of week <span className="text-red-500">*</span></Label>
                      <div className="lg:flex-1">
                        <Select 
                          value={watch("lastDayOfWeek") || undefined} 
                          onValueChange={(value) => setValue("lastDayOfWeek", value)}
                        >
                          <SelectTrigger className="bg-white mt-1 lg:mt-0" data-testid="select-last-day-of-week">
                            <SelectValue placeholder="Select last day of week" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* UIF number and SDL contribution */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <Label htmlFor="uifNumber" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">UIF number <span className="text-red-500">*</span></Label>
                      <div className="lg:flex-1">
                        <Input
                          id="uifNumber"
                          {...register("uifNumber")}
                          placeholder="U370773675"
                          data-testid="input-uif-number"
                          className="bg-white mt-1 lg:mt-0"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <Label htmlFor="sdlContribution" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">SDL contribution</Label>
                      <div className="lg:flex-1">
                        <div className="flex items-center space-x-2 mt-1 lg:mt-0">
                          <Checkbox
                            id="sdlContribution"
                            checked={watch("sdlContribution") || false}
                            onCheckedChange={(checked) => setValue("sdlContribution", !!checked)}
                            data-testid="checkbox-sdl-contribution"
                          />
                          <Label htmlFor="sdlContribution" className="text-sm">Enable SDL contribution</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* UIF employer */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <Label htmlFor="uifEmployerReference" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">UIF employer (DOL)</Label>
                      <div className="lg:flex-1">
                        <Input
                          id="uifEmployerReference"
                          {...register("uifEmployerReference")}
                          placeholder="2035064/8"
                          data-testid="input-uif-employer-reference"
                          className="bg-white mt-1 lg:mt-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Section - Side by Side Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  {/* Physical Address Card */}
                  <Card className="border border-gray-200 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <h3 className="text-sm font-bold">Physical address <span className="text-red-500">*</span></h3>
                      <div className="invisible">
                        <Button type="button" variant="outline" size="sm" className="text-xs">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy from Physical
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                        <Label className="text-sm font-bold lg:w-32 lg:flex-shrink-0">Address Line 1 <span className="text-red-500">*</span></Label>
                        <div className="lg:flex-1">
                          <Input
                            {...register("physicalAddress")}
                            placeholder="Address Line 1"
                            data-testid="input-physical-address"
                            className="bg-white mt-1 lg:mt-0"
                          />
                          {errors.physicalAddress && (
                            <p className="text-sm text-red-500 mt-1">{errors.physicalAddress.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                        <Label className="text-sm font-bold lg:w-32 lg:flex-shrink-0">Address Line 2</Label>
                        <div className="lg:flex-1">
                          <Input
                            {...register("physicalAddressLine2")}
                            placeholder="Address Line 2 (Optional)"
                            data-testid="input-physical-address-line2"
                            className="bg-white mt-1 lg:mt-0"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                        <Label className="text-sm font-bold lg:w-32 lg:flex-shrink-0">Address Line 3</Label>
                        <div className="lg:flex-1">
                          <Input
                            {...register("physicalAddressLine3")}
                            placeholder="Address Line 3 (Optional)"
                            data-testid="input-physical-address-line3"
                            className="bg-white mt-1 lg:mt-0"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                        <Label className="text-sm font-bold lg:w-32 lg:flex-shrink-0">Province <span className="text-red-500">*</span></Label>
                        <div className="lg:flex-1">
                          <Select 
                            value={watch("province") || undefined} 
                            onValueChange={(value) => setValue("province", value)}
                          >
                            <SelectTrigger className="bg-white mt-1 lg:mt-0" data-testid="select-province">
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                            <SelectContent>
                              {SA_PROVINCES.map((province) => (
                                <SelectItem key={province.value} value={province.value}>
                                  {province.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.province && (
                            <p className="text-sm text-red-500 mt-1">{errors.province.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                        <Label className="text-sm font-bold lg:w-32 lg:flex-shrink-0">Street Code <span className="text-red-500">*</span></Label>
                        <div className="lg:flex-1">
                          <Input
                            {...register("streetCode")}
                            placeholder="Street Code"
                            data-testid="input-street-code"
                            className="bg-white mt-1 lg:mt-0"
                          />
                          {errors.streetCode && (
                            <p className="text-sm text-red-500 mt-1">{errors.streetCode.message}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Postal Address Card */}
                  <Card className="border border-gray-200 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <h3 className="text-sm font-bold">Postal address <span className="text-red-500">*</span></h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const physicalAddress = watch("physicalAddress");
                          const physicalAddressLine2 = watch("physicalAddressLine2");
                          const physicalAddressLine3 = watch("physicalAddressLine3");
                          const province = watch("province");
                          const postalCode = watch("postalCode");
                          
                          setValue("postalAddress", physicalAddress || "");
                          setValue("postalAddressLine2", physicalAddressLine2 || "");
                          setValue("postalAddressLine3", physicalAddressLine3 || "");
                          setValue("postalProvince", province || "");
                          setValue("postalPostalCode", postalCode || "");
                        }}
                        className="text-xs"
                        data-testid="button-copy-physical-address"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy from Physical
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                        <Label className="text-sm font-bold lg:w-32 lg:flex-shrink-0">Address Line 1 <span className="text-red-500">*</span></Label>
                        <div className="lg:flex-1">
                          <Input
                            {...register("postalAddress")}
                            placeholder="Address Line 1"
                            data-testid="input-postal-address"
                            className="bg-white mt-1 lg:mt-0"
                          />
                          {errors.postalAddress && (
                            <p className="text-sm text-red-500 mt-1">{errors.postalAddress.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                        <Label className="text-sm font-bold lg:w-32 lg:flex-shrink-0">Address Line 2</Label>
                        <div className="lg:flex-1">
                          <Input
                            {...register("postalAddressLine2")}
                            placeholder="Address Line 2 (Optional)"
                            data-testid="input-postal-address-line2"
                            className="bg-white mt-1 lg:mt-0"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                        <Label className="text-sm font-bold lg:w-32 lg:flex-shrink-0">Address Line 3</Label>
                        <div className="lg:flex-1">
                          <Input
                            {...register("postalAddressLine3")}
                            placeholder="Address Line 3 (Optional)"
                            data-testid="input-postal-address-line3"
                            className="bg-white mt-1 lg:mt-0"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                        <Label className="text-sm font-bold lg:w-32 lg:flex-shrink-0">Province <span className="text-red-500">*</span></Label>
                        <div className="lg:flex-1">
                          <Select 
                            value={watch("postalProvince") || undefined} 
                            onValueChange={(value) => setValue("postalProvince", value)}
                          >
                            <SelectTrigger className="bg-white mt-1 lg:mt-0" data-testid="select-postal-province">
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                            <SelectContent>
                              {SA_PROVINCES.map((province) => (
                                <SelectItem key={province.value} value={province.value}>
                                  {province.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.postalProvince && (
                            <p className="text-sm text-red-500 mt-1">{errors.postalProvince.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                        <Label className="text-sm font-bold lg:w-32 lg:flex-shrink-0">Postal Code <span className="text-red-500">*</span></Label>
                        <div className="lg:flex-1">
                          <Input
                            {...register("postalPostalCode")}
                            placeholder="Postal Code"
                            data-testid="input-postal-postal-code"
                            className="bg-white mt-1 lg:mt-0"
                          />
                          {errors.postalPostalCode && (
                            <p className="text-sm text-red-500 mt-1">{errors.postalPostalCode.message}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Company Logo Section - Below Address Cards */}
                <div className="mt-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:gap-4">
                    <Label htmlFor="logo" className="text-sm font-bold lg:w-48 lg:flex-shrink-0 lg:pt-2">Company logo</Label>
                    <div className="lg:flex-1">
                      <div className="space-y-2 mt-1 lg:mt-0">
                        {logoPreview && (
                          <div className="mb-2">
                            <img 
                              src={logoPreview} 
                              alt="Company logo preview" 
                              className="max-w-32 max-h-32 object-contain border border-gray-300 rounded"
                            />
                          </div>
                        )}
                        <Input
                          id="logo"
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={handleLogoUpload}
                          data-testid="input-company-logo"
                          className="bg-white"
                        />
                        <input
                          type="hidden"
                          {...register("logo")}
                        />
                        <p className="text-xs text-muted-foreground">
                          Upload JPG or PNG file (max 5MB recommended)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Classification Tab */}
              <TabsContent value="south-africa" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="eligibleForETI"
                    checked={watch("eligibleForETI") || false}
                    onCheckedChange={(checked) => setValue("eligibleForETI", checked === true)}
                    data-testid="checkbox-eligible-for-eti"
                  />
                  <Label htmlFor="eligibleForETI" className="text-sm font-bold">Eligible for Employment Tax Incentive</Label>
                </div>

                <div>
                  <Label htmlFor="monthlyMinimumWage" className="text-sm font-bold">Monthly minimum wage (ETI)</Label>
                  <Input
                    id="monthlyMinimumWage"
                    type="number"
                    step="0.01"
                    {...register("monthlyMinimumWage", { valueAsNumber: true })}
                    placeholder="2000.00"
                    data-testid="input-monthly-minimum-wage"
                    className="bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="tradeClassification" className="text-sm font-bold">Trade classification (Not required from 2021 tax year)</Label>
                  <Input
                    id="tradeClassification"
                    {...register("tradeClassification")}
                    data-testid="input-trade-classification"
                    className="bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="industryClassificationCode" className="text-sm font-bold">Standard industry classification code <span className="text-red-500">*</span></Label>
                  <Input
                    id="industryClassificationCode"
                    {...register("industryClassificationCode")}
                    placeholder="69201: Accounting and bookkeeping activities"
                    data-testid="input-industry-classification-code"
                    className="bg-white"
                  />
                </div>
                
                {/* Version Display */}
                <div className="text-center text-xs text-muted-foreground mt-4 pt-4 border-t">
                  v{company ? 
                    `1.${Math.floor(((company.version || 1) - 1) / 20) + 1}.${((company.version || 1) - 1) % 20}` : 
                    '1.1.0'
                  }
                </div>
              </TabsContent>

              {/* Bank Details Tab */}
              <TabsContent value="bank-details" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="branchCode" className="text-sm font-bold">Branch code</Label>
                    <Input
                      id="branchCode"
                      {...register("branchCode")}
                      data-testid="input-branch-code"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bankAccountNumber" className="text-sm font-bold">Bank account number</Label>
                    <Input
                      id="bankAccountNumber"
                      {...register("bankAccountNumber")}
                      data-testid="input-bank-account-number"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bankAccountHolderName" className="text-sm font-bold">Bank account holder name</Label>
                  <Input
                    id="bankAccountHolderName"
                    {...register("bankAccountHolderName")}
                    data-testid="input-bank-account-holder-name"
                    className="bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="bankingReference" className="text-sm font-bold">Banking reference</Label>
                  <Input
                    id="bankingReference"
                    {...register("bankingReference")}
                    data-testid="input-banking-reference"
                    className="bg-white"
                  />
                </div>
              </TabsContent>

              {/* Tax Type Tab */}
              <TabsContent value="tax-type" className="space-y-4">
                <div>
                  <Label className="text-sm font-bold">Tax type <span className="text-red-500">*</span></Label>
                  <RadioGroup 
                    value={watch("taxType") || undefined} 
                    onValueChange={(value) => setValue("taxType", value)}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Average" id="average" />
                      <Label htmlFor="average">Average</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Threshold" id="threshold" />
                      <Label htmlFor="threshold">Threshold</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Flat Rate" id="flat-rate" />
                      <Label htmlFor="flat-rate">Flat Rate</Label>
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>

              {/* Payslips Settings Tab */}
              <TabsContent value="payslips-settings" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="addOvertimeFromTravel"
                      checked={watch("addOvertimeFromTravel") || false}
                      onCheckedChange={(checked) => setValue("addOvertimeFromTravel", !!checked)}
                    />
                    <Label htmlFor="addOvertimeFromTravel" className="text-sm">Add overtime from travel</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="subtractAbsentFromAllowances"
                      checked={watch("subtractAbsentFromAllowances") || false}
                      onCheckedChange={(checked) => setValue("subtractAbsentFromAllowances", !!checked)}
                    />
                    <Label htmlFor="subtractAbsentFromAllowances" className="text-sm">Subtract absent from allowances</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showHourlyRate"
                      checked={watch("showHourlyRate") || false}
                      onCheckedChange={(checked) => setValue("showHourlyRate", !!checked)}
                    />
                    <Label htmlFor="showHourlyRate" className="text-sm">Show hourly rate</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showOrdinaryHours"
                      checked={watch("showOrdinaryHours") || false}
                      onCheckedChange={(checked) => setValue("showOrdinaryHours", !!checked)}
                    />
                    <Label htmlFor="showOrdinaryHours" className="text-sm">Show ordinary hours</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="addLoansToPayslips"
                      checked={watch("addLoansToPayslips") || false}
                      onCheckedChange={(checked) => setValue("addLoansToPayslips", !!checked)}
                    />
                    <Label htmlFor="addLoansToPayslips" className="text-sm">Add loans to payslips</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowChangeLeavePayoutOnPayslips"
                      checked={watch("allowChangeLeavePayoutOnPayslips") || false}
                      onCheckedChange={(checked) => setValue("allowChangeLeavePayoutOnPayslips", !!checked)}
                    />
                    <Label htmlFor="allowChangeLeavePayoutOnPayslips" className="text-sm">Allow change leave payout on payslips</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useOvertimeLeave"
                      checked={watch("useOvertimeLeave") || false}
                      onCheckedChange={(checked) => setValue("useOvertimeLeave", !!checked)}
                    />
                    <Label htmlFor="useOvertimeLeave" className="text-sm">Use overtime leave</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="printPublicHolidayOnPayslips"
                      checked={watch("printPublicHolidayOnPayslips") || false}
                      onCheckedChange={(checked) => setValue("printPublicHolidayOnPayslips", !!checked)}
                    />
                    <Label htmlFor="printPublicHolidayOnPayslips" className="text-sm">Print public holiday on payslips</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hideZeroOvertimeAndLeave"
                      checked={watch("hideZeroOvertimeAndLeave") || false}
                      onCheckedChange={(checked) => setValue("hideZeroOvertimeAndLeave", !!checked)}
                    />
                    <Label htmlFor="hideZeroOvertimeAndLeave" className="text-sm">Hide zero overtime and leave</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showSdlOnPayslips"
                      checked={watch("showSdlOnPayslips") || false}
                      onCheckedChange={(checked) => setValue("showSdlOnPayslips", !!checked)}
                    />
                    <Label htmlFor="showSdlOnPayslips" className="text-sm">Show SDL on payslips</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showBankingDetailsOnPayslips"
                      checked={watch("showBankingDetailsOnPayslips") || false}
                      onCheckedChange={(checked) => setValue("showBankingDetailsOnPayslips", !!checked)}
                    />
                    <Label htmlFor="showBankingDetailsOnPayslips" className="text-sm">Show banking details on payslips</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="showOvertimeRatesOnPayslips" className="text-sm font-bold">Show overtime rates on payslips</Label>
                  <Select 
                    value={watch("showOvertimeRatesOnPayslips") || undefined} 
                    onValueChange={(value) => setValue("showOvertimeRatesOnPayslips", value)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              {/* Leave Settings Tab */}
              <TabsContent value="leave-settings" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="automaticLeaveAccrual"
                    checked={watch("automaticLeaveAccrual") || false}
                    onCheckedChange={(checked) => setValue("automaticLeaveAccrual", !!checked)}
                  />
                  <Label htmlFor="automaticLeaveAccrual" className="text-sm font-bold">Automatic leave accrual</Label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sickLeaveDaysPer36Months" className="text-sm font-bold">Sick leave days per 36 months</Label>
                    <Input
                      id="sickLeaveDaysPer36Months"
                      type="number"
                      step="0.1"
                      {...register("sickLeaveDaysPer36Months", { valueAsNumber: true })}
                      placeholder="30"
                      data-testid="input-sick-leave-days"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="annualLeaveDaysPerMonth" className="text-sm font-bold">Annual leave days per month</Label>
                    <Input
                      id="annualLeaveDaysPerMonth"
                      type="number"
                      step="0.01"
                      {...register("annualLeaveDaysPerMonth", { valueAsNumber: true })}
                      placeholder="1.25"
                      data-testid="input-annual-leave-days"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="printSickLeaveBalance" className="text-sm font-bold">Print sick leave balance</Label>
                    <Select 
                      value={watch("printSickLeaveBalance") || undefined} 
                      onValueChange={(value) => setValue("printSickLeaveBalance", value)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="printAnnualLeaveBalance" className="text-sm font-bold">Print annual leave balance</Label>
                    <Select 
                      value={watch("printAnnualLeaveBalance") || undefined} 
                      onValueChange={(value) => setValue("printAnnualLeaveBalance", value)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="printOvertimeLeaveBalance" className="text-sm font-bold">Print overtime leave balance</Label>
                    <Select 
                      value={watch("printOvertimeLeaveBalance") || undefined} 
                      onValueChange={(value) => setValue("printOvertimeLeaveBalance", value)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="maternityLeaveIsPaid"
                      checked={watch("maternityLeaveIsPaid") || false}
                      onCheckedChange={(checked) => setValue("maternityLeaveIsPaid", !!checked)}
                    />
                    <Label htmlFor="maternityLeaveIsPaid" className="text-sm">Maternity leave is paid</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parentalLeaveIsPaid"
                      checked={watch("parentalLeaveIsPaid") || false}
                      onCheckedChange={(checked) => setValue("parentalLeaveIsPaid", !!checked)}
                    />
                    <Label htmlFor="parentalLeaveIsPaid" className="text-sm">Parental leave is paid</Label>
                  </div>
                </div>
              </TabsContent>

              {/* Contact Person Tab */}
              <TabsContent value="contact-person" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPersonFirstName" className="text-sm font-bold">First name</Label>
                    <Input
                      id="contactPersonFirstName"
                      {...register("contactPersonFirstName")}
                      data-testid="input-contact-person-first-name"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPersonSurname" className="text-sm font-bold">Surname</Label>
                    <Input
                      id="contactPersonSurname"
                      {...register("contactPersonSurname")}
                      data-testid="input-contact-person-surname"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPersonBusinessPhone" className="text-sm font-bold">Business phone</Label>
                    <Input
                      id="contactPersonBusinessPhone"
                      {...register("contactPersonBusinessPhone")}
                      data-testid="input-contact-person-business-phone"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPersonBusinessEmail" className="text-sm font-bold">Business email</Label>
                    <Input
                      id="contactPersonBusinessEmail"
                      {...register("contactPersonBusinessEmail")}
                      data-testid="input-contact-person-business-email"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPersonUnitNumber" className="text-sm font-bold">Unit number</Label>
                    <Input
                      id="contactPersonUnitNumber"
                      {...register("contactPersonUnitNumber")}
                      data-testid="input-contact-person-unit-number"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPersonComplex" className="text-sm font-bold">Complex</Label>
                    <Input
                      id="contactPersonComplex"
                      {...register("contactPersonComplex")}
                      data-testid="input-contact-person-complex"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPersonStreetNumber" className="text-sm font-bold">Street number</Label>
                    <Input
                      id="contactPersonStreetNumber"
                      {...register("contactPersonStreetNumber")}
                      data-testid="input-contact-person-street-number"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPersonStreetName" className="text-sm font-bold">Street name</Label>
                    <Input
                      id="contactPersonStreetName"
                      {...register("contactPersonStreetName")}
                      data-testid="input-contact-person-street-name"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPersonSuburb" className="text-sm font-bold">Suburb</Label>
                    <Input
                      id="contactPersonSuburb"
                      {...register("contactPersonSuburb")}
                      data-testid="input-contact-person-suburb"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPersonCityTown" className="text-sm font-bold">City/Town</Label>
                    <Input
                      id="contactPersonCityTown"
                      {...register("contactPersonCityTown")}
                      data-testid="input-contact-person-city-town"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPersonPostalCode" className="text-sm font-bold">Postal code</Label>
                    <Input
                      id="contactPersonPostalCode"
                      {...register("contactPersonPostalCode")}
                      data-testid="input-contact-person-postal-code"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPersonCountry" className="text-sm font-bold">Country</Label>
                    <Input
                      id="contactPersonCountry"
                      {...register("contactPersonCountry")}
                      placeholder="South Africa"
                      data-testid="input-contact-person-country"
                      className="bg-white"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Declarant Tab */}
              <TabsContent value="declarant" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="declarantFirstName" className="text-sm font-bold">First name</Label>
                    <Input
                      id="declarantFirstName"
                      {...register("declarantFirstName")}
                      data-testid="input-declarant-first-name"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="declarantSurname" className="text-sm font-bold">Surname</Label>
                    <Input
                      id="declarantSurname"
                      {...register("declarantSurname")}
                      data-testid="input-declarant-surname"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="declarantIdNumber" className="text-sm font-bold">ID number</Label>
                    <Input
                      id="declarantIdNumber"
                      {...register("declarantIdNumber")}
                      data-testid="input-declarant-id-number"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="declarantContactEmail" className="text-sm font-bold">Contact email</Label>
                    <Input
                      id="declarantContactEmail"
                      {...register("declarantContactEmail")}
                      data-testid="input-declarant-contact-email"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="declarantInitials" className="text-sm font-bold">Initials</Label>
                    <Input
                      id="declarantInitials"
                      {...register("declarantInitials")}
                      data-testid="input-declarant-initials"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="declarantPosition" className="text-sm font-bold">Position</Label>
                    <Input
                      id="declarantPosition"
                      {...register("declarantPosition")}
                      data-testid="input-declarant-position"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="declarantBusinessPhone" className="text-sm font-bold">Business phone</Label>
                    <Input
                      id="declarantBusinessPhone"
                      {...register("declarantBusinessPhone")}
                      data-testid="input-declarant-business-phone"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="declarantFaxNumber" className="text-sm font-bold">Fax number</Label>
                    <Input
                      id="declarantFaxNumber"
                      {...register("declarantFaxNumber")}
                      data-testid="input-declarant-fax-number"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="declarantCellNumber" className="text-sm font-bold">Cell number</Label>
                    <Input
                      id="declarantCellNumber"
                      {...register("declarantCellNumber")}
                      data-testid="input-declarant-cell-number"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="declarantDateOfBirth" className="text-sm font-bold">Date of birth</Label>
                  <Input
                    id="declarantDateOfBirth"
                    type="date"
                    {...register("declarantDateOfBirth")}
                    data-testid="input-declarant-date-of-birth"
                    className="bg-white"
                  />
                </div>
              </TabsContent>

              {/* Payslips Type Tab */}
              <TabsContent value="payslips-type" className="space-y-4">
                <div>
                  <Label htmlFor="payslipType" className="text-sm font-bold">Payslip type <span className="text-red-500">*</span></Label>
                  <Select 
                    value={watch("payslipType") || undefined} 
                    onValueChange={(value) => setValue("payslipType", value)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select payslip type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4 - Plain paper - Default layout A">A4 - Plain paper - Default layout A</SelectItem>
                      <SelectItem value="A4 - Plain paper - Default layout B">A4 - Plain paper - Default layout B</SelectItem>
                      <SelectItem value="A4 - Plain paper - Compact layout">A4 - Plain paper - Compact layout</SelectItem>
                      <SelectItem value="Letter - Plain paper - Default layout">Letter - Plain paper - Default layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="customPayperiod"
                    checked={watch("customPayperiod") || false}
                    onCheckedChange={(checked) => setValue("customPayperiod", !!checked)}
                  />
                  <Label htmlFor="customPayperiod" className="text-sm font-bold">Custom pay period</Label>
                </div>

                {watch("customPayperiod") && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customPayperiodName" className="text-sm font-bold">Custom pay period name</Label>
                      <Input
                        id="customPayperiodName"
                        {...register("customPayperiodName")}
                        placeholder="Enter custom pay period name"
                        data-testid="input-custom-payperiod-name"
                        className="bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customPayperiodDays" className="text-sm font-bold">Number of days</Label>
                        <Input
                          id="customPayperiodDays"
                          type="number"
                          {...register("customPayperiodDays", { valueAsNumber: true })}
                          placeholder="Enter number of days"
                          data-testid="input-custom-payperiod-days"
                          className="bg-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="customPayperiodFirstDay" className="text-sm font-bold">First day of pay period</Label>
                        <Select 
                          value={watch("customPayperiodFirstDay") || undefined} 
                          onValueChange={(value) => setValue("customPayperiodFirstDay", value)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select first day" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {!isInline && (
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  data-testid="button-cancel-company-form"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !!registrationError}
                  data-testid="button-submit-company-form"
                >
                  {isSubmitting ? 'Saving...' : company ? 'Update Company' : 'Add Company'}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}