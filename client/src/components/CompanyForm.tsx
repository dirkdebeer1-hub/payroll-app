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

export default function CompanyForm({ company, onSubmit, onCancel, isSubmitting = false }: CompanyFormProps) {
  const [activeTab, setActiveTab] = useState("company-settings");
  const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo || null);
  const [copyAddress, setCopyAddress] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  // Fetch existing companies to check for duplicates
  const { data: existingCompanies = [] } = useQuery<Company[]>({
    queryKey: ['/api/companies'],
  });

  // Handle escape key and focus management
  useEffect(() => {
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
  }, [onCancel]);

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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="company-form-title"
    >
      <Card 
        className="w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-[#f7fbff] font-['Roboto']"
        onClick={(e) => e.stopPropagation()}
      >
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
        <CardContent className="space-y-4 bg-[#f7fbff]">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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

              {/* Info Tab */}
              <TabsContent value="company-settings" className="space-y-6">
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="name" className="text-sm font-bold">Company name <span className="text-red-500">*</span></Label>
                      <div className="lg:col-span-2">
                        <Input
                          id="name"
                          {...register("name")}
                          placeholder="Company name"
                          data-testid="input-company-name"
                          className="bg-white"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="registration" className="text-sm font-bold">Company registration <span className="text-red-500">*</span></Label>
                      <div className="lg:col-span-2">
                        <Input
                          id="registration"
                          {...register("registration")}
                          placeholder="2006/165834/23"
                          data-testid="input-registration"
                          className="bg-white"
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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="taxNumber" className="text-sm font-bold">Tax number <span className="text-red-500">*</span></Label>
                      <div className="lg:col-span-2">
                        <Input
                          id="taxNumber"
                          {...register("taxNumber")}
                          placeholder="Tax number"
                          data-testid="input-tax-number"
                          className="bg-white"
                        />
                        {errors.taxNumber && (
                          <p className="text-sm text-red-500 mt-1">{errors.taxNumber.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="vatNumber" className="text-sm font-bold">VAT number <span className="text-red-500">*</span></Label>
                      <div className="lg:col-span-2">
                        <Input
                          id="vatNumber"
                          {...register("vatNumber")}
                          placeholder="VAT number"
                          data-testid="input-vat-number"
                          className="bg-white"
                        />
                        {errors.vatNumber && (
                          <p className="text-sm text-red-500 mt-1">{errors.vatNumber.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="payeNumber" className="text-sm font-bold">PAYE number <span className="text-red-500">*</span></Label>
                      <div className="lg:col-span-2">
                        <Input
                          id="payeNumber"
                          {...register("payeNumber")}
                          placeholder="7370773675"
                          data-testid="input-paye-number"
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="sdlNumber" className="text-sm font-bold">SDL number <span className="text-red-500">*</span></Label>
                      <div className="lg:col-span-2">
                        <Input
                          id="sdlNumber"
                          {...register("sdlNumber")}
                          placeholder="L370773675"
                          data-testid="input-sdl-number"
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="uifNumber" className="text-sm font-bold">UIF number <span className="text-red-500">*</span></Label>
                      <div className="lg:col-span-2">
                        <Input
                          id="uifNumber"
                          {...register("uifNumber")}
                          placeholder="U370773675"
                          data-testid="input-uif-number"
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="uifEmployerReference" className="text-sm font-bold">UIF employer (DOL)</Label>
                      <div className="lg:col-span-2">
                        <Input
                          id="uifEmployerReference"
                          {...register("uifEmployerReference")}
                          placeholder="2035064/8"
                          data-testid="input-uif-employer-reference"
                          className="bg-white"
                        />
                      </div>
                    </div>

                    {/* Physical Address */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold">Physical address <span className="text-red-500">*</span></h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                        <Label className="text-sm font-bold">Address Line 1</Label>
                        <div className="lg:col-span-2">
                          <Input
                            {...register("physicalAddress")}
                            placeholder="Address Line 1"
                            data-testid="input-physical-address"
                            className="bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                        <Label className="text-sm font-bold">Address Line 2</Label>
                        <div className="lg:col-span-2">
                          <Input
                            {...register("physicalAddressLine2")}
                            placeholder="Address Line 2 (Optional)"
                            data-testid="input-physical-address-line2"
                            className="bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                        <Label className="text-sm font-bold">Address Line 3</Label>
                        <div className="lg:col-span-2">
                          <Input
                            {...register("physicalAddressLine3")}
                            placeholder="Address Line 3 (Optional)"
                            data-testid="input-physical-address-line3"
                            className="bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                        <Label className="text-sm font-bold">Province & Postal Code</Label>
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Select 
                            value={watch("province") || undefined} 
                            onValueChange={(value) => setValue("province", value)}
                          >
                            <SelectTrigger className="bg-white" data-testid="select-province">
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

                          <Input
                            {...register("postalCode")}
                            placeholder="Postal Code"
                            data-testid="input-postal-code"
                            className="bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Company logo - aligned with Province & Postal Code */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="logo" className="text-sm font-bold">Company logo</Label>
                      <div className="lg:col-span-2 space-y-2">
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
                        {/* Hidden input to register logo field with react-hook-form */}
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

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="telephone" className="text-sm font-bold">Telephone</Label>
                      <div className="lg:col-span-2">
                        <Input
                          id="telephone"
                          {...register("telephone")}
                          placeholder="Telephone number"
                          data-testid="input-telephone"
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="email" className="text-sm font-bold">Email</Label>
                      <div className="lg:col-span-2">
                        <Input
                          id="email"
                          {...register("email")}
                          placeholder="Email address"
                          data-testid="input-email"
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="extratimeRate" className="text-sm font-bold">Extratime rate <span className="text-red-500">*</span></Label>
                      <div className="lg:col-span-2">
                        <Input
                          id="extratimeRate"
                          type="number"
                          step="0.01"
                          {...register("extratimeRate")}
                          placeholder="1.33"
                          data-testid="input-extratime-rate"
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="overtimeRate" className="text-sm font-bold">Overtime rate <span className="text-red-500">*</span></Label>
                      <div className="lg:col-span-2">
                        <Input
                          id="overtimeRate"
                          type="number"
                          step="0.01"
                          {...register("overtimeRate")}
                          placeholder="1.5"
                          data-testid="input-overtime-rate"
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="doubletimeRate" className="text-sm font-bold">Doubletime rate <span className="text-red-500">*</span></Label>
                      <div className="lg:col-span-2">
                        <Input
                          id="doubletimeRate"
                          type="number"
                          step="0.01"
                          {...register("doubletimeRate")}
                          placeholder="2.0"
                          data-testid="input-doubletime-rate"
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="sdlContribution" className="text-sm font-bold">SDL contribution</Label>
                      <div className="lg:col-span-2">
                        <div className="flex items-center space-x-2">
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

                    {/* Space for two additional fields to be inserted later */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <div className="text-sm font-bold text-transparent">Placeholder Field 1</div>
                      <div className="lg:col-span-2"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <div className="text-sm font-bold text-transparent">Placeholder Field 2</div>
                      <div className="lg:col-span-2"></div>
                    </div>

                    {/* Postal Address - moved down to leave space for two additional fields */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold">Postal address <span className="text-red-500">*</span></h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Copy physical address details to postal address
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
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                        <Label className="text-sm font-bold">Address Line 1</Label>
                        <div className="lg:col-span-2">
                          <Input
                            {...register("postalAddress")}
                            placeholder="Address Line 1"
                            data-testid="input-postal-address"
                            className="bg-white"
                          />
                          {errors.postalAddress && (
                            <p className="text-sm text-red-500 mt-1">{errors.postalAddress.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                        <Label className="text-sm font-bold">Address Line 2</Label>
                        <div className="lg:col-span-2">
                          <Input
                            {...register("postalAddressLine2")}
                            placeholder="Address Line 2 (Optional)"
                            data-testid="input-postal-address-line2"
                            className="bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                        <Label className="text-sm font-bold">Address Line 3</Label>
                        <div className="lg:col-span-2">
                          <Input
                            {...register("postalAddressLine3")}
                            placeholder="Address Line 3 (Optional)"
                            data-testid="input-postal-address-line3"
                            className="bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                        <Label className="text-sm font-bold">Province & Postal Code</Label>
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Select 
                            value={watch("postalProvince") || undefined} 
                            onValueChange={(value) => setValue("postalProvince", value)}
                          >
                            <SelectTrigger className="bg-white" data-testid="select-postal-province">
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

                          <Input
                            {...register("postalPostalCode")}
                            placeholder="Postal Code"
                            data-testid="input-postal-postal-code"
                            className="bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <Label htmlFor="lastDayOfWeek" className="text-sm font-bold">Last day of week <span className="text-red-500">*</span></Label>
                      <div className="lg:col-span-2">
                        <Select 
                          value={watch("lastDayOfWeek") || undefined} 
                          onValueChange={(value) => setValue("lastDayOfWeek", value)}
                        >
                          <SelectTrigger className="bg-white" data-testid="select-last-day-of-week">
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
                    <Label htmlFor="bankingReference" className="text-sm font-bold">Reference to put in banking import files</Label>
                    <Input
                      id="bankingReference"
                      {...register("bankingReference")}
                      data-testid="input-banking-reference"
                      className="bg-white"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Tax Type Tab */}
              <TabsContent value="tax-type" className="space-y-4">
                <div className="space-y-4">
                  <Label className="text-sm font-bold">Tax type</Label>
                  <RadioGroup
                    value={watch("taxType") ?? "Average"}
                    onValueChange={(value) => setValue("taxType", value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Independent periods" id="independent-periods" />
                      <Label htmlFor="independent-periods" className="text-sm font-bold">Independent periods</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Average" id="average" />
                      <Label htmlFor="average" className="text-sm font-bold">Average</Label>
                    </div>
                  </RadioGroup>
                  
                  <p className="text-sm text-muted-foreground">
                    There are two ways to calculate tax. Either treat each pay period (week/fortnight/month) as a separate calculation, or use an averaging method that is 
                    more accurate, but more complicated. It is not practical to switch between methods after you have started creating payslips for a tax year, so you need 
                    to decide now which method you prefer.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This setting can be changed later, subject to the condition about changing in the middle of a tax year.
                  </p>
                </div>
              </TabsContent>

              {/* Payslips Settings Tab */}
              <TabsContent value="payslips-settings" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold">Add overtime / Subtract deduction from travel allowance</Label>
                    <RadioGroup
                      value={watch("addOvertimeFromTravel") ? "Yes" : "No"}
                      onValueChange={(value) => setValue("addOvertimeFromTravel", value === "Yes")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="add-overtime-yes" />
                        <Label htmlFor="add-overtime-yes" className="text-sm font-bold">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="add-overtime-no" />
                        <Label htmlFor="add-overtime-no" className="text-sm font-bold">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold">Subtract absent / Unpaid leave from allowances</Label>
                    <RadioGroup
                      value={watch("subtractAbsentFromAllowances") ? "Yes" : "No"}
                      onValueChange={(value) => setValue("subtractAbsentFromAllowances", value === "Yes")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="subtract-absent-yes" />
                        <Label htmlFor="subtract-absent-yes" className="text-sm font-bold">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="subtract-absent-no" />
                        <Label htmlFor="subtract-absent-no" className="text-sm font-bold">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold">Show hourly rate on payslips</Label>
                    <RadioGroup
                      value={watch("showHourlyRate") ? "Yes" : "No"}
                      onValueChange={(value) => setValue("showHourlyRate", value === "Yes")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="show-hourly-yes" />
                        <Label htmlFor="show-hourly-yes" className="text-sm font-bold">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="show-hourly-no" />
                        <Label htmlFor="show-hourly-no" className="text-sm font-bold">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold">Show ordinary hours on payslips</Label>
                    <RadioGroup
                      value={watch("showOrdinaryHours") ? "Yes" : "No"}
                      onValueChange={(value) => setValue("showOrdinaryHours", value === "Yes")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="show-ordinary-yes" />
                        <Label htmlFor="show-ordinary-yes" className="text-sm font-bold">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="show-ordinary-no" />
                        <Label htmlFor="show-ordinary-no" className="text-sm font-bold">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold">Add loans given to payslips</Label>
                    <RadioGroup
                      value={watch("addLoansToPayslips") ? "Yes" : "No"}
                      onValueChange={(value) => setValue("addLoansToPayslips", value === "Yes")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="add-loans-yes" />
                        <Label htmlFor="add-loans-yes" className="text-sm font-bold">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="add-loans-no" />
                        <Label htmlFor="add-loans-no" className="text-sm font-bold">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold">Allow to change leave payout on payslips</Label>
                    <RadioGroup
                      value={watch("allowChangeLeavePayoutOnPayslips") ? "Yes" : "No"}
                      onValueChange={(value) => setValue("allowChangeLeavePayoutOnPayslips", value === "Yes")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="allow-leave-payout-yes" />
                        <Label htmlFor="allow-leave-payout-yes" className="text-sm font-bold">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="allow-leave-payout-no" />
                        <Label htmlFor="allow-leave-payout-no" className="text-sm font-bold">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Use overtime leave</Label>
                    <RadioGroup
                      value={watch("useOvertimeLeave") ? "Yes" : "No"}
                      onValueChange={(value) => setValue("useOvertimeLeave", value === "Yes")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="use-overtime-leave-yes" />
                        <Label htmlFor="use-overtime-leave-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="use-overtime-leave-no" />
                        <Label htmlFor="use-overtime-leave-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Print public holiday on payslips</Label>
                    <RadioGroup
                      value={watch("printPublicHolidayOnPayslips") ? "Yes" : "No"}
                      onValueChange={(value) => setValue("printPublicHolidayOnPayslips", value === "Yes")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="print-holiday-yes" />
                        <Label htmlFor="print-holiday-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="print-holiday-no" />
                        <Label htmlFor="print-holiday-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Hide zero overtime and leave from payslips</Label>
                    <RadioGroup
                      value={watch("hideZeroOvertimeAndLeave") ? "Yes" : "No"}
                      onValueChange={(value) => setValue("hideZeroOvertimeAndLeave", value === "Yes")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="hide-zero-yes" />
                        <Label htmlFor="hide-zero-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="hide-zero-no" />
                        <Label htmlFor="hide-zero-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Show SDL on payslips</Label>
                    <RadioGroup
                      value={watch("showSdlOnPayslips") ? "Yes" : "No"}
                      onValueChange={(value) => setValue("showSdlOnPayslips", value === "Yes")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="show-sdl-yes" />
                        <Label htmlFor="show-sdl-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="show-sdl-no" />
                        <Label htmlFor="show-sdl-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Show banking details on payslips</Label>
                    <RadioGroup
                      value={watch("showBankingDetailsOnPayslips") ? "Yes" : "No"}
                      onValueChange={(value) => setValue("showBankingDetailsOnPayslips", value === "Yes")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="show-banking-yes" />
                        <Label htmlFor="show-banking-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="show-banking-no" />
                        <Label htmlFor="show-banking-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Show overtime rates on payslips</Label>
                    <RadioGroup
                      value={watch("showOvertimeRatesOnPayslips") ?? "No"}
                      onValueChange={(value) => setValue("showOvertimeRatesOnPayslips", value)}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Hide words Extratime/Overtime/Doubletime" id="hide-words" />
                        <Label htmlFor="hide-words">Hide words</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="show-overtime-rates-yes" />
                        <Label htmlFor="show-overtime-rates-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="show-overtime-rates-no" />
                        <Label htmlFor="show-overtime-rates-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </TabsContent>

              {/* Leave Settings Tab */}
              <TabsContent value="leave-settings" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Automatic leave accrual</Label>
                    <RadioGroup
                      value={watch("automaticLeaveAccrual") ? "Yes" : "No"}
                      onValueChange={(value) => setValue("automaticLeaveAccrual", value === "Yes")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="auto-accrual-yes" />
                        <Label htmlFor="auto-accrual-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="auto-accrual-no" />
                        <Label htmlFor="auto-accrual-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="sickLeaveDaysPer36Months">Number of days every 36 month cycle to accrue (sick leave)</Label>
                    <Input
                      id="sickLeaveDaysPer36Months"
                      type="number"
                      step="0.01"
                      {...register("sickLeaveDaysPer36Months", { valueAsNumber: true })}
                      placeholder="30.00"
                      data-testid="input-sick-leave-days"
                    />
                  </div>

                  <div>
                    <Label htmlFor="annualLeaveDaysPerMonth">Number of days per month to accrue (annual leave)</Label>
                    <Input
                      id="annualLeaveDaysPerMonth"
                      type="number"
                      step="0.01"
                      {...register("annualLeaveDaysPerMonth", { valueAsNumber: true })}
                      placeholder="1.25"
                      data-testid="input-annual-leave-days"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Print sick leave balance on payslips</Label>
                    <RadioGroup
                      value={watch("printSickLeaveBalance") ?? "No"}
                      onValueChange={(value) => setValue("printSickLeaveBalance", value)}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="print-sick-yes" />
                        <Label htmlFor="print-sick-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="print-sick-no" />
                        <Label htmlFor="print-sick-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Update all employees" id="print-sick-update" />
                        <Label htmlFor="print-sick-update">Update all employees</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Print annual leave balance on payslips</Label>
                    <RadioGroup
                      value={watch("printAnnualLeaveBalance") ?? "No"}
                      onValueChange={(value) => setValue("printAnnualLeaveBalance", value)}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="print-annual-yes" />
                        <Label htmlFor="print-annual-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="print-annual-no" />
                        <Label htmlFor="print-annual-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Update all employees" id="print-annual-update" />
                        <Label htmlFor="print-annual-update">Update all employees</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Print overtime leave balance on payslips</Label>
                    <RadioGroup
                      value={watch("printOvertimeLeaveBalance") ?? "No"}
                      onValueChange={(value) => setValue("printOvertimeLeaveBalance", value)}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="print-overtime-leave-yes" />
                        <Label htmlFor="print-overtime-leave-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="print-overtime-leave-no" />
                        <Label htmlFor="print-overtime-leave-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Update all employees" id="print-overtime-leave-update" />
                        <Label htmlFor="print-overtime-leave-update">Update all employees</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Maternity leave is paid (default setting)</Label>
                    <RadioGroup
                      value={watch("maternityLeaveIsPaid") ? "Yes" : "No"}
                      onValueChange={(value) => setValue("maternityLeaveIsPaid", value === "Yes")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="maternity-paid-yes" />
                        <Label htmlFor="maternity-paid-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="maternity-paid-no" />
                        <Label htmlFor="maternity-paid-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Parental leave is paid (default setting)</Label>
                    <RadioGroup
                      value={watch("parentalLeaveIsPaid") ? "Yes" : "No"}
                      onValueChange={(value) => setValue("parentalLeaveIsPaid", value === "Yes")}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="parental-paid-yes" />
                        <Label htmlFor="parental-paid-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="parental-paid-no" />
                        <Label htmlFor="parental-paid-no">No</Label>
                      </div>
                    </RadioGroup>
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
                      placeholder="Charlize"
                      data-testid="input-contact-first-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPersonSurname" className="text-sm font-bold">Surname</Label>
                    <Input
                      id="contactPersonSurname"
                      {...register("contactPersonSurname")}
                      placeholder="de Beer"
                      data-testid="input-contact-surname"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPersonBusinessPhone" className="text-sm font-bold">Business phone number</Label>
                    <Input
                      id="contactPersonBusinessPhone"
                      {...register("contactPersonBusinessPhone")}
                      placeholder="0825589600"
                      data-testid="input-contact-business-phone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPersonBusinessEmail" className="text-sm font-bold">Business email</Label>
                    <Input
                      id="contactPersonBusinessEmail"
                      type="email"
                      {...register("contactPersonBusinessEmail")}
                      placeholder="charlize@saregistrations.co.za"
                      data-testid="input-contact-business-email"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold">Business address to use in tax submissions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPersonUnitNumber" className="text-sm font-bold">Unit number</Label>
                      <Input
                        id="contactPersonUnitNumber"
                        {...register("contactPersonUnitNumber")}
                        data-testid="input-contact-unit-number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPersonComplex" className="text-sm font-bold">Complex</Label>
                      <Input
                        id="contactPersonComplex"
                        {...register("contactPersonComplex")}
                        data-testid="input-contact-complex"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPersonStreetNumber" className="text-sm font-bold">Street number</Label>
                      <Input
                        id="contactPersonStreetNumber"
                        {...register("contactPersonStreetNumber")}
                        placeholder="204"
                        data-testid="input-contact-street-number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPersonStreetName" className="text-sm font-bold">Street / name of farm</Label>
                      <Input
                        id="contactPersonStreetName"
                        {...register("contactPersonStreetName")}
                        placeholder="Sunbird Drive"
                        data-testid="input-contact-street-name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPersonSuburb" className="text-sm font-bold">Suburb / district</Label>
                      <Input
                        id="contactPersonSuburb"
                        {...register("contactPersonSuburb")}
                        data-testid="input-contact-suburb"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPersonCityTown" className="text-sm font-bold">City / Town</Label>
                      <Input
                        id="contactPersonCityTown"
                        {...register("contactPersonCityTown")}
                        placeholder="Langebaan"
                        data-testid="input-contact-city-town"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPersonPostalCode" className="text-sm font-bold">Postal code</Label>
                      <Input
                        id="contactPersonPostalCode"
                        {...register("contactPersonPostalCode")}
                        placeholder="7357"
                        data-testid="input-contact-postal-code"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPersonCountry" className="text-sm font-bold">Country</Label>
                      <Select 
                        value={watch("contactPersonCountry") ?? "South Africa"} 
                        onValueChange={(value) => setValue("contactPersonCountry", value)}
                      >
                        <SelectTrigger data-testid="select-contact-country">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="South Africa">South Africa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                      placeholder="Dirk"
                      data-testid="input-declarant-first-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="declarantSurname" className="text-sm font-bold">Surname</Label>
                    <Input
                      id="declarantSurname"
                      {...register("declarantSurname")}
                      placeholder="de Beer"
                      data-testid="input-declarant-surname"
                    />
                  </div>

                  <div>
                    <Label htmlFor="declarantIdNumber" className="text-sm font-bold">ID number</Label>
                    <Input
                      id="declarantIdNumber"
                      {...register("declarantIdNumber")}
                      placeholder="7006195267083"
                      data-testid="input-declarant-id-number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="declarantContactEmail" className="text-sm font-bold">Contact email address</Label>
                    <Input
                      id="declarantContactEmail"
                      type="email"
                      {...register("declarantContactEmail")}
                      placeholder="dirkdebeer1@gmail.com"
                      data-testid="input-declarant-contact-email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="declarantInitials" className="text-sm font-bold">Initials</Label>
                    <Input
                      id="declarantInitials"
                      {...register("declarantInitials")}
                      placeholder="D"
                      data-testid="input-declarant-initials"
                    />
                  </div>

                  <div>
                    <Label htmlFor="declarantPosition" className="text-sm font-bold">Position held at business</Label>
                    <Input
                      id="declarantPosition"
                      {...register("declarantPosition")}
                      placeholder="Accountant"
                      data-testid="input-declarant-position"
                    />
                  </div>

                  <div>
                    <Label htmlFor="declarantBusinessPhone" className="font-bold">Business phone</Label>
                    <Input
                      id="declarantBusinessPhone"
                      {...register("declarantBusinessPhone")}
                      placeholder="0827192209"
                      data-testid="input-declarant-business-phone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="declarantFaxNumber" className="font-bold">Fax number</Label>
                    <Input
                      id="declarantFaxNumber"
                      {...register("declarantFaxNumber")}
                      data-testid="input-declarant-fax-number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="declarantCellNumber" className="font-bold">Cell number</Label>
                    <Input
                      id="declarantCellNumber"
                      {...register("declarantCellNumber")}
                      placeholder="0827192209"
                      data-testid="input-declarant-cell-number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="declarantDateOfBirth" className="text-sm font-bold">Date of birth</Label>
                    <Input
                      id="declarantDateOfBirth"
                      type="date"
                      {...register("declarantDateOfBirth")}
                      data-testid="input-declarant-date-of-birth"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Payslips Type Tab */}
              <TabsContent value="payslips-type" className="space-y-4">
                <div>
                  <Label htmlFor="payslipType">Payslips type</Label>
                  <Select 
                    value={watch("payslipType") ?? "A4 - Plain paper - Default layout B"} 
                    onValueChange={(value) => setValue("payslipType", value)}
                  >
                    <SelectTrigger data-testid="select-payslip-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4 - Plain paper - Default layout A">A4 - Plain paper - Default layout A</SelectItem>
                      <SelectItem value="A4 - Plain paper - Default layout B">A4 - Plain paper - Default layout B</SelectItem>
                      <SelectItem value="A4 - Confidential paper - visible 40mm">A4 - Confidential paper - visible 40mm</SelectItem>
                      <SelectItem value="A4 - VIP Confidential paper">A4 - VIP Confidential paper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold">Preview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>A4 - Plain paper - Default layout A</span>
                      <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                        View
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>A4 - Plain paper - Default layout B</span>
                      <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                        View
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>A4 - Confidential paper - visible 40mm</span>
                      <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                        View
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>A4 - VIP Confidential paper</span>
                      <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                        View
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>Layout A with annual,sick,overtime under income for hourly employees</span>
                      <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>


            </Tabs>

            <div className="flex justify-end pt-4">
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onCancel} data-testid="button-cancel-company">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="button-save-company"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}