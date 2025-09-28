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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Copy, Archive, Trash2, Undo2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: InsertCompany) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isInline?: boolean;
  onArchive?: (companyId: string) => void;
  onDelete?: (companyId: string) => void;
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

// South African banks with universal branch codes
const SA_BANKS = [
  { value: "standard-bank", label: "Standard Bank", branchCode: "051001" },
  { value: "absa-bank", label: "Absa Bank", branchCode: "632005" },
  { value: "fnb", label: "First National Bank (FNB)", branchCode: "250655" },
  { value: "nedbank", label: "Nedbank", branchCode: "198765" },
  { value: "capitec-bank", label: "Capitec Bank", branchCode: "470010" },
  { value: "african-bank", label: "African Bank", branchCode: "430000" },
  { value: "discovery-bank", label: "Discovery Bank", branchCode: "679000" },
  { value: "tyme-bank", label: "TYME Bank", branchCode: "678910" },
  { value: "investec-bank", label: "Investec Bank", branchCode: "580105" },
  { value: "bidvest-bank", label: "Bidvest Bank", branchCode: "462005" },
  { value: "rmb", label: "Rand Merchant Bank (RMB)", branchCode: "261251" },
  { value: "rmb-private-bank", label: "RMB Private Bank", branchCode: "222026" },
  { value: "sa-post-bank", label: "SA Post Bank", branchCode: "460005" },
  { value: "access-bank", label: "Access Bank", branchCode: "410105" },
  { value: "bank-of-athens", label: "Bank of Athens", branchCode: "410506" }
];

export default function CompanyForm({ company, onSubmit, onCancel, isSubmitting = false, isInline = false, onArchive, onDelete }: CompanyFormProps) {
  const [activeTab, setActiveTab] = useState("company-settings");
  const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo || null);
  const [copyAddress, setCopyAddress] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      bankName: company.bankName || '',
      branchCode: company.branchCode || '',
      branchName: company.branchName || 'Universal bank code',
      bankAccountNumber: company.bankAccountNumber || '',
      bankAccountHolderName: company.bankAccountHolderName || '',
      bankingReference: company.bankingReference || '',
      taxType: company.taxType,
      enableEmployeeLoanManagement: company.enableEmployeeLoanManagement,
      displayBankDetailsOnPayslips: company.displayBankDetailsOnPayslips,
      hideZeroValueItems: company.hideZeroValueItems,
      sickLeaveAccrualCycle: company.sickLeaveAccrualCycle,
      annualLeaveAccrualRate: company.annualLeaveAccrualRate,
      showLeaveBalanceOnPayslips: company.showLeaveBalanceOnPayslips,
      showSickBalanceOnPayslips: company.showSickBalanceOnPayslips,
      showCompanyContributions: company.showCompanyContributions,
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
      branchName: 'Universal bank code',
      bankAccountNumber: '1234567890',
      bankAccountHolderName: 'Demo Tech Solutions (Pty) Ltd',
      bankingReference: 'PAYROLL',
      taxType: 'Average',
      enableEmployeeLoanManagement: true,
      displayBankDetailsOnPayslips: true,
      hideZeroValueItems: true,
      sickLeaveAccrualCycle: 30.0,
      annualLeaveAccrualRate: 1.25,
      showLeaveBalanceOnPayslips: true,
      showSickBalanceOnPayslips: false,
      showCompanyContributions: false,
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
      declarantCellNumber: '082 555 1234',
      declarantDateOfBirth: '1985-01-01',
      payslipType: 'Layout 1',
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
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 w-full h-auto text-sm bg-[#465193]">
                <TabsTrigger value="company-settings" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Details</TabsTrigger>
                <TabsTrigger value="bank-details" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Bank</TabsTrigger>
                <TabsTrigger value="tax-type" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Type</TabsTrigger>
                <TabsTrigger value="payslips-settings" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Settings</TabsTrigger>
                <TabsTrigger value="contact-person" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Contact</TabsTrigger>
                <TabsTrigger value="declarant" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Declarant</TabsTrigger>
                <TabsTrigger value="payslips-type" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Layout</TabsTrigger>
                <TabsTrigger value="archive" className="text-sm p-1 sm:p-2 text-white data-[state=active]:bg-[#384080] data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-[#384080]">Archive</TabsTrigger>
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
                      <Label htmlFor="vatNumber" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">VAT number</Label>
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
                        Copy
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


              {/* Bank Details Tab */}
              <TabsContent value="bank-details" className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="bankAccountHolderName" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Bank account holder name</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="bankAccountHolderName"
                        {...register("bankAccountHolderName")}
                        data-testid="input-bank-account-holder-name"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Bank name</Label>
                    <div className="lg:flex-1">
                      <Select 
                        value={watch("bankName") || undefined} 
                        onValueChange={(value) => {
                          setValue("bankName", value);
                          // Auto-populate branch code based on selected bank
                          const selectedBank = SA_BANKS.find(bank => bank.value === value);
                          if (selectedBank) {
                            setValue("branchCode", selectedBank.branchCode);
                          }
                        }}
                      >
                        <SelectTrigger className="bg-white mt-1 lg:mt-0" data-testid="select-bank-name">
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {SA_BANKS.map((bank) => (
                            <SelectItem key={bank.value} value={bank.value}>
                              {bank.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="bankAccountNumber" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Bank account number</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="bankAccountNumber"
                        {...register("bankAccountNumber")}
                        data-testid="input-bank-account-number"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="branchName" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Branch name</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="branchName"
                        {...register("branchName")}
                        data-testid="input-branch-name"
                        className="bg-white mt-1 lg:mt-0"
                        placeholder="Universal bank code"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="branchCode" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Branch code</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="branchCode"
                        {...register("branchCode")}
                        data-testid="input-branch-code"
                        className="bg-white mt-1 lg:mt-0"
                        placeholder="Universal branch code"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="bankingReference" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Banking reference</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="bankingReference"
                        {...register("bankingReference")}
                        data-testid="input-banking-reference"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Tax Type Tab */}
              <TabsContent value="tax-type" className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Tax calculation method</Label>
                    <div className="lg:flex-1">
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-1 lg:mt-0">
                        <p className="text-sm text-blue-800">
                          <strong>Average Year-to-Date Tax Calculation</strong>
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          The system uses average year-to-date tax calculations by default. This provides accurate payroll tax calculations based on accumulated earnings throughout the year.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="payslips-settings" className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Loan Management</Label>
                    <div className="lg:flex-1">
                      <div className="flex items-center space-x-2 mt-1 lg:mt-0">
                        <Checkbox
                          id="enableEmployeeLoanManagement"
                          checked={watch("enableEmployeeLoanManagement") || false}
                          onCheckedChange={(checked) => setValue("enableEmployeeLoanManagement", !!checked)}
                          data-testid="checkbox-enable-employee-loan-management"
                        />
                        <Label htmlFor="enableEmployeeLoanManagement" className="text-sm">Allow employee loan management on payslips</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Bank Details</Label>
                    <div className="lg:flex-1">
                      <div className="flex items-center space-x-2 mt-1 lg:mt-0">
                        <Checkbox
                          id="displayBankDetailsOnPayslips"
                          checked={watch("displayBankDetailsOnPayslips") || false}
                          onCheckedChange={(checked) => setValue("displayBankDetailsOnPayslips", !!checked)}
                          data-testid="checkbox-display-bank-details"
                        />
                        <Label htmlFor="displayBankDetailsOnPayslips" className="text-sm">Show employee bank details on payslips</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Zero-Value Items</Label>
                    <div className="lg:flex-1">
                      <div className="flex items-center space-x-2 mt-1 lg:mt-0">
                        <Checkbox
                          id="hideZeroValueItems"
                          checked={watch("hideZeroValueItems") || false}
                          onCheckedChange={(checked) => setValue("hideZeroValueItems", !!checked)}
                          data-testid="checkbox-hide-zero-value-items"
                        />
                        <Label htmlFor="hideZeroValueItems" className="text-sm">Hide items with zero values from payslips</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="sickLeaveAccrualCycle" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Sick Leave Accrual Cycle</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="sickLeaveAccrualCycle"
                        type="number"
                        step="0.1"
                        {...register("sickLeaveAccrualCycle", { valueAsNumber: true })}
                        placeholder="30"
                        data-testid="input-sick-leave-accrual-cycle"
                        className="bg-white mt-1 lg:mt-0"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Days per 36-month cycle</p>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="annualLeaveAccrualRate" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Annual Leave Accrual Rate</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="annualLeaveAccrualRate"
                        type="number"
                        step="0.01"
                        {...register("annualLeaveAccrualRate", { valueAsNumber: true })}
                        placeholder="1.25"
                        data-testid="input-annual-leave-accrual-rate"
                        className="bg-white mt-1 lg:mt-0"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Days per month (1.25 = 15 annual work days per year)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Leave Balance</Label>
                    <div className="lg:flex-1">
                      <div className="flex items-center space-x-2 mt-1 lg:mt-0">
                        <Checkbox
                          id="showLeaveBalanceOnPayslips"
                          checked={watch("showLeaveBalanceOnPayslips") || false}
                          onCheckedChange={(checked) => setValue("showLeaveBalanceOnPayslips", !!checked)}
                          data-testid="checkbox-show-leave-balance"
                        />
                        <Label htmlFor="showLeaveBalanceOnPayslips" className="text-sm">Display annual leave balance on payslips</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Sick Balance</Label>
                    <div className="lg:flex-1">
                      <div className="flex items-center space-x-2 mt-1 lg:mt-0">
                        <Checkbox
                          id="showSickBalanceOnPayslips"
                          checked={watch("showSickBalanceOnPayslips") || false}
                          onCheckedChange={(checked) => setValue("showSickBalanceOnPayslips", !!checked)}
                          data-testid="checkbox-show-sick-balance"
                        />
                        <Label htmlFor="showSickBalanceOnPayslips" className="text-sm">Display sick leave balance on payslips</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Company Contributions</Label>
                    <div className="lg:flex-1">
                      <div className="flex items-center space-x-2 mt-1 lg:mt-0">
                        <Checkbox
                          id="showCompanyContributions"
                          checked={watch("showCompanyContributions") || false}
                          onCheckedChange={(checked) => setValue("showCompanyContributions", !!checked)}
                          data-testid="checkbox-show-company-contributions"
                        />
                        <Label htmlFor="showCompanyContributions" className="text-sm">Display UIF and SDL contributions on payslips</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>


              {/* Contact Person Tab */}
              <TabsContent value="contact-person" className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="contactPersonFirstName" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">First name <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonFirstName"
                        {...register("contactPersonFirstName", { required: "First name is required" })}
                        data-testid="input-contact-person-first-name"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="contactPersonSurname" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Surname <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonSurname"
                        {...register("contactPersonSurname", { required: "Surname is required" })}
                        data-testid="input-contact-person-surname"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="contactPersonBusinessPhone" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Business phone <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonBusinessPhone"
                        {...register("contactPersonBusinessPhone", { required: "Business phone is required" })}
                        data-testid="input-contact-person-business-phone"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="contactPersonBusinessEmail" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Business email <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonBusinessEmail"
                        {...register("contactPersonBusinessEmail", { required: "Business email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" } })}
                        data-testid="input-contact-person-business-email"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="contactPersonUnitNumber" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Unit number</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonUnitNumber"
                        {...register("contactPersonUnitNumber")}
                        data-testid="input-contact-person-unit-number"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="contactPersonComplex" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Complex</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonComplex"
                        {...register("contactPersonComplex")}
                        data-testid="input-contact-person-complex"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="contactPersonStreetNumber" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Street number</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonStreetNumber"
                        {...register("contactPersonStreetNumber")}
                        data-testid="input-contact-person-street-number"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="contactPersonStreetName" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Street name</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonStreetName"
                        {...register("contactPersonStreetName")}
                        data-testid="input-contact-person-street-name"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="contactPersonSuburb" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Suburb</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonSuburb"
                        {...register("contactPersonSuburb")}
                        data-testid="input-contact-person-suburb"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="contactPersonCityTown" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">City/Town</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonCityTown"
                        {...register("contactPersonCityTown")}
                        data-testid="input-contact-person-city-town"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="contactPersonPostalCode" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Postal code</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonPostalCode"
                        {...register("contactPersonPostalCode")}
                        data-testid="input-contact-person-postal-code"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="contactPersonCountry" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Country</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonCountry"
                        {...register("contactPersonCountry")}
                        placeholder="South Africa"
                        data-testid="input-contact-person-country"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Declarant Tab */}
              <TabsContent value="declarant" className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="declarantFirstName" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">First name <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantFirstName"
                        {...register("declarantFirstName", { required: "First name is required" })}
                        data-testid="input-declarant-first-name"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="declarantSurname" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Surname <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantSurname"
                        {...register("declarantSurname", { required: "Surname is required" })}
                        data-testid="input-declarant-surname"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="declarantIdNumber" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">ID number</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantIdNumber"
                        {...register("declarantIdNumber")}
                        data-testid="input-declarant-id-number"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="declarantContactEmail" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Contact email <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantContactEmail"
                        {...register("declarantContactEmail", { required: "Contact email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" } })}
                        data-testid="input-declarant-contact-email"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="declarantInitials" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Initials</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantInitials"
                        {...register("declarantInitials")}
                        data-testid="input-declarant-initials"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="declarantPosition" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Position</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantPosition"
                        {...register("declarantPosition")}
                        data-testid="input-declarant-position"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="declarantBusinessPhone" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Business phone <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantBusinessPhone"
                        {...register("declarantBusinessPhone", { required: "Business phone is required" })}
                        data-testid="input-declarant-business-phone"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="declarantCellNumber" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Cell number</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantCellNumber"
                        {...register("declarantCellNumber")}
                        data-testid="input-declarant-cell-number"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="declarantDateOfBirth" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Date of birth</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantDateOfBirth"
                        type="date"
                        {...register("declarantDateOfBirth")}
                        data-testid="input-declarant-date-of-birth"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Payslips Type Tab */}
              <TabsContent value="payslips-type" className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="payslipType" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Payslip type <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Select 
                        value={watch("payslipType") || undefined} 
                        onValueChange={(value) => setValue("payslipType", value)}
                      >
                        <SelectTrigger className="bg-white mt-1 lg:mt-0">
                          <SelectValue placeholder="Select payslip type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Layout 1">Layout 1</SelectItem>
                          <SelectItem value="Layout 2">Layout 2</SelectItem>
                          <SelectItem value="Layout 3">Layout 3</SelectItem>
                          <SelectItem value="Layout 4">Layout 4</SelectItem>
                          <SelectItem value="Layout 5">Layout 5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Custom pay period</Label>
                    <div className="lg:flex-1">
                      <div className="flex items-center space-x-2 mt-1 lg:mt-0">
                        <Checkbox
                          id="customPayperiod"
                          checked={watch("customPayperiod") || false}
                          onCheckedChange={(checked) => setValue("customPayperiod", !!checked)}
                        />
                        <Label htmlFor="customPayperiod" className="text-sm">Enable custom pay period</Label>
                      </div>
                    </div>
                  </div>

                  {watch("customPayperiod") && (
                    <>
                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                        <Label htmlFor="customPayperiodName" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Custom pay period name</Label>
                        <div className="lg:flex-1">
                          <Input
                            id="customPayperiodName"
                            {...register("customPayperiodName")}
                            placeholder="Enter custom pay period name"
                            data-testid="input-custom-payperiod-name"
                            className="bg-white mt-1 lg:mt-0"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                        <Label htmlFor="customPayperiodDays" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Number of days</Label>
                        <div className="lg:flex-1">
                          <Input
                            id="customPayperiodDays"
                            type="number"
                            {...register("customPayperiodDays", { valueAsNumber: true })}
                            placeholder="Enter number of days"
                            data-testid="input-custom-payperiod-days"
                            className="bg-white mt-1 lg:mt-0"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                        <Label htmlFor="customPayperiodFirstDay" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">First day of pay period</Label>
                        <div className="lg:flex-1">
                          <Select 
                            value={watch("customPayperiodFirstDay") || undefined} 
                            onValueChange={(value) => setValue("customPayperiodFirstDay", value)}
                          >
                            <SelectTrigger className="bg-white mt-1 lg:mt-0">
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
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Archive Tab */}
              <TabsContent value="archive" className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                    <Label htmlFor="status" className="text-sm font-bold lg:w-48 lg:flex-shrink-0">Archive status <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Select 
                        value={watch("status") || undefined} 
                        onValueChange={(value) => setValue("status", value)}
                      >
                        <SelectTrigger className="bg-white mt-1 lg:mt-0">
                          <SelectValue placeholder="Select archive status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="ARCHIVED">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Archive and Delete Actions - only for existing companies */}
                  {company && (
                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onArchive?.(company.id)}
                        className={`hover-elevate ${
                          company.status === 'ARCHIVED' 
                            ? 'text-green-700' 
                            : 'text-orange-700'
                        }`}
                        data-testid="button-archive-company"
                      >
                        {company.status === 'ARCHIVED' ? (
                          <>
                            <Undo2 className="h-3 w-3 mr-1" />
                            Restore
                          </>
                        ) : (
                          <>
                            <Archive className="h-3 w-3 mr-1" />
                            Archive
                          </>
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-700 hover-elevate"
                        data-testid="button-delete-company"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Company</DialogTitle>
            <DialogDescription className="text-gray-700">
              Are you sure you want to permanently delete <strong>{company?.name}</strong>? 
              This action cannot be undone and will remove all associated data including employees, payslips, and records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              data-testid="button-cancel-delete"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete?.(company!.id);
                setShowDeleteDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700"
              data-testid="button-confirm-delete"
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}