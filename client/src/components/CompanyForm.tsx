import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCompanySchema } from "@shared/schema";
import type { InsertCompany, Company } from "@shared/schema";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Copy, Archive, Trash2, Undo2, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: InsertCompany) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isInline?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onView?: (companyId: string) => void;
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

export default function CompanyForm({ company, onSubmit, onCancel, isSubmitting = false, isInline = false, activeTab: externalActiveTab, onTabChange, onView, onArchive, onDelete }: CompanyFormProps) {
  const [internalActiveTab, setInternalActiveTab] = useState("company-settings");
  const activeTab = isInline ? externalActiveTab || "company-settings" : internalActiveTab;
  const setActiveTab = isInline ? (onTabChange || (() => {})) : setInternalActiveTab;
  const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo || null);
  const [copyAddress, setCopyAddress] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [incompleteTabs, setIncompleteTabs] = useState<Set<string>>(new Set());

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
    formState,
    formState: { errors },
    trigger,
    getValues
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
      uifNumberDol: company.uifNumberDol || '',
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
      uifNumberDol: 'U123456789',
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
      status: 'ACTIVE'
    }
  });

  // Define required fields for each tab
  const tabRequiredFields = {
    "company-settings": ["name", "telephone", "email", "taxNumber"],
    "address": ["physicalAddress", "province", "streetCode", "postalAddress"],
    "bank-details": [],
    "payslips-settings": [],
    "contact-person": ["contactPersonFirstName", "contactPersonSurname", "contactPersonBusinessPhone", "contactPersonBusinessEmail"],
    "declarant": ["declarantFirstName", "declarantSurname", "declarantContactEmail", "declarantBusinessPhone"],
    "logo": [],
    "payslips-type": []
  };

  // Function to validate a specific tab's required fields
  const validateTab = async (tabName: string): Promise<boolean> => {
    const requiredFields = tabRequiredFields[tabName as keyof typeof tabRequiredFields] || [];
    if (requiredFields.length === 0) return true;
    
    // Trigger validation for these fields
    const isValid = await trigger(requiredFields as any);
    
    // Also check current form state for these fields to be more accurate
    const formValues = getValues();
    const currentErrors = formState.errors;
    
    // Alternative validation: check if any required field has an error or is empty
    const hasErrors = requiredFields.some(field => {
      const fieldError = currentErrors[field as keyof typeof currentErrors];
      const fieldValue = formValues[field as keyof typeof formValues];
      const isEmpty = !fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === '');
      return fieldError || isEmpty;
    });
    
    // Return the more restrictive result (if either trigger says invalid OR we detect errors/empty fields)
    return isValid && !hasErrors;
  };

  // Function to check all tabs and update incomplete tabs
  const updateIncompleteTabsStatus = async () => {
    const newIncompleteTabs = new Set<string>();
    
    for (const [tabName, fields] of Object.entries(tabRequiredFields)) {
      if (fields.length > 0) {
        const isValid = await validateTab(tabName);
        if (!isValid) {
          newIncompleteTabs.add(tabName);
        }
      }
    }
    
    setIncompleteTabs(newIncompleteTabs);
  };

  // Function that immediately checks and marks incomplete tabs (called on form submit)
  const checkAndMarkIncompleteTabs = async () => {
    // Trigger validation for all fields first
    await trigger();
    
    const newIncompleteTabs = new Set<string>();
    
    for (const [tabName, fields] of Object.entries(tabRequiredFields)) {
      if (fields.length > 0) {
        const isValid = await validateTab(tabName);
        if (!isValid) {
          newIncompleteTabs.add(tabName);
        }
      }
    }
    
    setIncompleteTabs(newIncompleteTabs);
    
    // Navigate to first incomplete tab if any
    if (newIncompleteTabs.size > 0) {
      const tabOrder = ["company-settings", "address", "contact-person", "declarant"];
      const firstIncompleteTab = tabOrder.find(tab => newIncompleteTabs.has(tab)) || Array.from(newIncompleteTabs)[0];
      setActiveTab(firstIncompleteTab);
    }
  };

  // Handle tab change without validation
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  // Watch physical address fields for real-time copying
  const physicalAddress = watch("physicalAddress");
  const physicalAddressLine2 = watch("physicalAddressLine2");
  const physicalAddressLine3 = watch("physicalAddressLine3");
  const province = watch("province");
  const postalCode = watch("postalCode");
  const payeNumber = watch("payeNumber");

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

  // Clear incomplete tabs when form is successfully submitted or when starting fresh
  useEffect(() => {
    if (!company) {
      setIncompleteTabs(new Set());
    }
  }, [company]);

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

  // Custom submit handler to check for duplicates and incomplete tabs
  const handleFormSubmit = async (data: InsertCompany) => {
    // Final duplicate check before submission
    if (registrationError) {
      return;
    }

    // All tab validation is now handled by checkAndMarkIncompleteTabs
    // This function only runs if the form passes React Hook Form validation
    // Clear incomplete tabs on successful submission
    setIncompleteTabs(new Set());
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
      <div
        className={`w-full ${isInline ? "h-full flex flex-col" : "max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"}`}
        onClick={isInline ? undefined : (e) => e.stopPropagation()}
      >
        {!isInline && (
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              data-testid="button-close-company-form"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {!isInline && (
          <h2 id="company-form-title" className="sr-only">{company ? 'Company Settings' : 'Add New Company'}</h2>
        )}
        {/* Navigation Header Row - Only show in modal mode, not inline */}
        {!isInline && (
          <div className="sticky top-0 z-10">
            <div className="bg-white border-b border-gray-200">
              <button 
                type="button"
                onClick={() => handleTabChange("company-settings")}
                className={`text-left text-sm font-medium uppercase tracking-wide px-3 py-1 cursor-pointer hover:bg-gray-50/30 ${
                  activeTab === "company-settings" ? "text-blue-600 bg-blue-50" : "text-gray-600"
                }`}
                data-testid="tab-details"
              >
                DETAILS
              </button>
            <button 
              type="button"
              onClick={() => handleTabChange("address")}
              className={`text-left text-sm font-bold uppercase tracking-wide px-3 py-1 cursor-pointer hover:bg-gray-50/30 ${
                activeTab === "address" ? "text-blue-600 bg-blue-50" : "text-gray-600"
              }`}
              data-testid="tab-address"
            >
              ADDRESS
            </button>
            <button 
              type="button"
              onClick={() => handleTabChange("bank-details")}
              className={`text-left text-sm font-bold uppercase tracking-wide px-3 py-1 cursor-pointer hover:bg-gray-50/30 ${
                activeTab === "bank-details" ? "text-blue-600 bg-blue-50" : "text-gray-600"
              }`}
              data-testid="tab-bank-details"
            >
              BANK
            </button>
            <button 
              type="button"
              onClick={() => handleTabChange("payslips-settings")}
              className={`text-left text-sm font-bold uppercase tracking-wide px-3 py-1 cursor-pointer hover:bg-gray-50/30 ${
                activeTab === "payslips-settings" ? "text-blue-600 bg-blue-50" : "text-gray-600"
              }`}
              data-testid="tab-settings"
            >
              SETTINGS
            </button>
            <button 
              type="button"
              onClick={() => handleTabChange("contact-person")}
              className={`text-left text-sm font-bold uppercase tracking-wide px-3 py-1 cursor-pointer hover:bg-gray-50/30 ${
                activeTab === "contact-person" ? "text-blue-600 bg-blue-50" : "text-gray-600"
              }`}
              data-testid="tab-contact-person"
            >
              CONTACT
            </button>
            <button 
              type="button"
              onClick={() => handleTabChange("declarant")}
              className={`text-left text-sm font-bold uppercase tracking-wide px-3 py-1 cursor-pointer hover:bg-gray-50/30 ${
                activeTab === "declarant" ? "text-blue-600 bg-blue-50" : "text-gray-600"
              }`}
              data-testid="tab-declarant"
            >
              DECLARANT
            </button>
            <button 
              type="button"
              onClick={() => handleTabChange("logo")}
              className={`text-left text-sm font-bold uppercase tracking-wide px-3 py-1 cursor-pointer hover:bg-gray-50/30 ${
                activeTab === "logo" ? "text-blue-600 bg-blue-50" : "text-gray-600"
              }`}
              data-testid="tab-logo"
            >
              LOGO
            </button>
            <button 
              type="button"
              onClick={() => handleTabChange("payslips-type")}
              className={`text-left text-sm font-bold uppercase tracking-wide px-3 py-1 cursor-pointer hover:bg-gray-50/30 ${
                activeTab === "payslips-type" ? "text-blue-600 bg-blue-50" : "text-gray-600"
              }`}
              data-testid="tab-payslip-type"
            >
              PAYSLIP TYPE
            </button>
          </div>
        </div>
        )}
        
        {/* Content Area - Clean and minimal like company table rows */}
        <div className={`${isInline ? "flex-1 overflow-y-auto min-h-0" : ""}`}>
          <form
            id={isInline ? "company-form" : undefined}
            onSubmit={(e) => {
              checkAndMarkIncompleteTabs();
              handleSubmit(handleFormSubmit)(e);
            }}
            className="bg-white"
          >
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">

              {/* Details Tab - Consistent with table layout */}
              <TabsContent value="company-settings" className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Company Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-normal text-gray-900">Company name <span className="text-red-500">*</span></Label>
                      <Input id="name" {...register("name")} placeholder="Enter company name" data-testid="input-company-name" className="mt-1" />
                      {errors.name && (<p className="text-xs text-red-500 mt-1">{errors.name.message}</p>)}
                    </div>
                    {/* Telephone */}
                    <div className="space-y-2">
                      <Label htmlFor="telephone" className="text-sm font-normal text-gray-900">Telephone <span className="text-red-500">*</span></Label>
                      <Input id="telephone" {...register("telephone")} placeholder="Telephone number" data-testid="input-telephone" className="mt-1" />
                      {errors.telephone && (<p className="text-xs text-red-500 mt-1">{errors.telephone.message}</p>)}
                    </div>
                    {/* Company registration */}
                    <div className="space-y-2">
                      <Label htmlFor="registration" className="text-sm font-normal text-gray-900">Company registration <span className="text-red-500">*</span></Label>
                      <Input id="registration" {...register("registration")} placeholder="2006/165834/23" data-testid="input-registration" className="mt-1" onChange={(e) => {register("registration").onChange(e);checkDuplicateRegistration(e.target.value);}} />
                      {registrationError && (<p className="text-xs text-red-500 mt-1">{registrationError}</p>)}
                      {errors.registration && (<p className="text-xs text-red-500 mt-1">{errors.registration.message}</p>)}
                    </div>
                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-normal text-gray-900">Email <span className="text-red-500">*</span></Label>
                      <Input id="email" {...register("email")} placeholder="Email address" data-testid="input-email" className="mt-1" />
                      {errors.email && (<p className="text-xs text-red-500 mt-1">{errors.email.message}</p>)}
                    </div>
                    {/* Tax number */}
                    <div className="space-y-2">
                      <Label htmlFor="taxNumber" className="text-sm font-normal text-gray-900">Tax number <span className="text-red-500">*</span></Label>
                      <Input id="taxNumber" {...register("taxNumber")} placeholder="Tax number" data-testid="input-tax-number" className="mt-1" />
                      {errors.taxNumber && (<p className="text-xs text-red-500 mt-1">{errors.taxNumber.message}</p>)}
                    </div>
                    {/* VAT number */}
                    <div className="space-y-2">
                      <Label htmlFor="vatNumber" className="text-sm font-normal text-gray-900">VAT number</Label>
                      <Input id="vatNumber" {...register("vatNumber")} placeholder="VAT number" data-testid="input-vat-number" className="mt-1" />
                      {errors.vatNumber && (<p className="text-xs text-red-500 mt-1">{errors.vatNumber.message}</p>)}
                    </div>
                    {/* PAYE number */}
                    <div className="space-y-2">
                      <Label htmlFor="payeNumber" className="text-sm font-normal text-gray-900">PAYE number <span className="text-red-500">*</span></Label>
                      <Input id="payeNumber" {...register("payeNumber")} placeholder="7370773675" data-testid="input-paye-number" className="mt-1" />
                      {errors.payeNumber && (<p className="text-xs text-red-500 mt-1">{errors.payeNumber.message}</p>)}
                    </div>
                    {/* SDL number */}
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="sdlNumber" className="text-sm font-normal text-gray-900">SDL number <span className="text-red-500">*</span></Label>
                      <Input id="sdlNumber" {...register("sdlNumber")} placeholder="L370773675" data-testid="input-sdl-number" className="mt-1" />
                      {errors.sdlNumber && (<p className="text-xs text-red-500 mt-1">{errors.sdlNumber.message}</p>)}
                    </div>
                    {/* UIF number (DOL) */}
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="uifNumberDol" className="text-sm font-normal text-gray-900">UIF number (DOL)</Label>
                      <Input id="uifNumberDol" {...register("uifNumberDol")} placeholder="U370773675" data-testid="input-uif-number-dol" className="mt-1" />
                      {errors.uifNumberDol && (<p className="text-xs text-red-500 mt-1">{errors.uifNumberDol.message}</p>)}
                    </div>
                    {/* UIF number */}
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="uifNumber" className="text-sm font-normal text-gray-900">UIF number <span className="text-red-500">*</span></Label>
                      <Input id="uifNumber" {...register("uifNumber")} placeholder="U370773675" data-testid="input-uif-number" className="mt-1" />
                      {errors.uifNumber && (<p className="text-xs text-red-500 mt-1">{errors.uifNumber.message}</p>)}
                    </div>
                    {/* Empty field for grid alignment */}
                    <div></div>
                  </div>
              </TabsContent>

              <TabsContent value="address" className="p-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Company Address</h2>
                  <div className="space-y-6">
                  {/* Physical Address Section */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-4">Physical Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Address Line 1 <span className="text-red-500">*</span></Label>
                          <Input
                            {...register("physicalAddress")}
                            placeholder="123 Main Street"
                            data-testid="input-physical-address"
                            className="mt-1"
                          />
                          {errors.physicalAddress && (
                            <p className="text-xs text-red-500 mt-1">{errors.physicalAddress.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-sm font-normal text-gray-700 mb-2 block">Address Line 2</Label>
                          <Input
                            {...register("physicalAddressLine2")}
                            placeholder="Suite 456"
                            data-testid="input-physical-address-line2"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-normal text-gray-700 mb-2 block">Address Line 3</Label>
                          <Input
                            {...register("physicalAddressLine3")}
                            placeholder="Building Complex"
                            data-testid="input-physical-address-line3"
                            className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Province <span className="text-red-500">*</span></Label>
                          <Select 
                            value={watch("province") || undefined} 
                            onValueChange={(value) => setValue("province", value)}
                          >
                            <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors">
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                              <SelectItem value="Free State">Free State</SelectItem>
                              <SelectItem value="Gauteng">Gauteng</SelectItem>
                              <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                              <SelectItem value="Limpopo">Limpopo</SelectItem>
                              <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                              <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                              <SelectItem value="North West">North West</SelectItem>
                              <SelectItem value="Western Cape">Western Cape</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-normal text-gray-700 mb-2 block">Postal Code <span className="text-red-500">*</span></Label>
                          <Input
                            {...register("streetCode")}
                            placeholder="7925"
                            data-testid="input-street-code"
                            className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Postal Address Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-gray-900">Postal Address</h3>
                        <Button
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const physicalAddress = watch("physicalAddress");
                            const physicalAddressLine2 = watch("physicalAddressLine2");
                            const physicalAddressLine3 = watch("physicalAddressLine3");
                            const province = watch("province");
                            const streetCode = watch("streetCode");
                            
                            setValue("postalAddress", physicalAddress || "");
                            setValue("postalAddressLine2", physicalAddressLine2 || "");
                            setValue("postalAddressLine3", physicalAddressLine3 || "");
                            setValue("postalProvince", province || "");
                            setValue("postalPostalCode", streetCode || "");
                          }}
                          className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                          data-testid="button-copy-physical-address"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Physical
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label className="text-sm font-normal text-gray-700 mb-2 block">Address Line 1 <span className="text-red-500">*</span></Label>
                          <Input
                            {...register("postalAddress")}
                            placeholder="456 Business Park Drive"
                            data-testid="input-postal-address"
                            className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors"
                          />
                          {errors.postalAddress && (
                            <p className="text-xs text-red-500 mt-1">{errors.postalAddress.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-sm font-normal text-gray-700 mb-2 block">Address Line 2</Label>
                          <Input
                            {...register("postalAddressLine2")}
                            placeholder="Suite 201"
                            data-testid="input-postal-address-line2"
                            className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-normal text-gray-700 mb-2 block">Address Line 3</Label>
                          <Input
                            {...register("postalAddressLine3")}
                            placeholder="Tech Hub Complex"
                            data-testid="input-postal-address-line3"
                            className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Province <span className="text-red-500">*</span></Label>
                          <Select 
                            value={watch("postalProvince") || undefined} 
                            onValueChange={(value) => setValue("postalProvince", value)}
                          >
                            <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors">
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                              <SelectItem value="Free State">Free State</SelectItem>
                              <SelectItem value="Gauteng">Gauteng</SelectItem>
                              <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                              <SelectItem value="Limpopo">Limpopo</SelectItem>
                              <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                              <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                              <SelectItem value="North West">North West</SelectItem>
                              <SelectItem value="Western Cape">Western Cape</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Postal Code <span className="text-red-500">*</span></Label>
                          <Input
                            {...register("postalPostalCode")}
                            placeholder="Postal Code"
                            data-testid="input-postal-postal-code"
                            className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </TabsContent>

              <TabsContent value="bank-details" className="p-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Company Bank Details</h2>
                  <div className="space-y-4">
                  {/* Bank account holder name, Physical address, and Postal address on same line */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="bankAccountHolderName" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Bank account holder name</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="bankAccountHolderName"
                        {...register("bankAccountHolderName")}
                        data-testid="input-bank-account-holder-name"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Bank name</Label>
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

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="bankAccountNumber" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Bank account number</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="bankAccountNumber"
                        {...register("bankAccountNumber")}
                        data-testid="input-bank-account-number"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="branchName" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Branch name</Label>
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

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="branchCode" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Branch code</Label>
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

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="bankingReference" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Banking reference</Label>
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
                </div>
              </TabsContent>

              
              <TabsContent value="payslips-settings" className="p-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Company Settings</h2>
                  <div className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">Loan Management</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableEmployeeLoanManagement"
                          checked={watch("enableEmployeeLoanManagement") || false}
                          onCheckedChange={(checked) => setValue("enableEmployeeLoanManagement", !!checked)}
                          data-testid="checkbox-enable-employee-loan-management"
                        />
                        <Label htmlFor="enableEmployeeLoanManagement" className="text-xs">Allow employee loan management on payslips</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Bank Details</Label>
                    <div className="lg:flex-1">
                      <div className="flex items-center space-x-0.5 mt-1 lg:mt-0">
                        <Checkbox
                          id="displayBankDetailsOnPayslips"
                          checked={watch("displayBankDetailsOnPayslips") || false}
                          onCheckedChange={(checked) => setValue("displayBankDetailsOnPayslips", !!checked)}
                          data-testid="checkbox-display-bank-details"
                        />
                        <Label htmlFor="displayBankDetailsOnPayslips" className="text-xs">Show employee bank details on payslips</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Zero-Value Items</Label>
                    <div className="lg:flex-1">
                      <div className="flex items-center space-x-0.5 mt-1 lg:mt-0">
                        <Checkbox
                          id="hideZeroValueItems"
                          checked={watch("hideZeroValueItems") || false}
                          onCheckedChange={(checked) => setValue("hideZeroValueItems", !!checked)}
                          data-testid="checkbox-hide-zero-value-items"
                        />
                        <Label htmlFor="hideZeroValueItems" className="text-xs">Hide items with zero values from payslips</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="sickLeaveAccrualCycle" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Sick Leave Accrual Cycle</Label>
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

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="annualLeaveAccrualRate" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Annual Leave Accrual Rate</Label>
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

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Leave Balance</Label>
                    <div className="lg:flex-1">
                      <div className="flex items-center space-x-0.5 mt-1 lg:mt-0">
                        <Checkbox
                          id="showLeaveBalanceOnPayslips"
                          checked={watch("showLeaveBalanceOnPayslips") || false}
                          onCheckedChange={(checked) => setValue("showLeaveBalanceOnPayslips", !!checked)}
                          data-testid="checkbox-show-leave-balance"
                        />
                        <Label htmlFor="showLeaveBalanceOnPayslips" className="text-xs">Display annual leave balance on payslips</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Sick Balance</Label>
                    <div className="lg:flex-1">
                      <div className="flex items-center space-x-0.5 mt-1 lg:mt-0">
                        <Checkbox
                          id="showSickBalanceOnPayslips"
                          checked={watch("showSickBalanceOnPayslips") || false}
                          onCheckedChange={(checked) => setValue("showSickBalanceOnPayslips", !!checked)}
                          data-testid="checkbox-show-sick-balance"
                        />
                        <Label htmlFor="showSickBalanceOnPayslips" className="text-xs">Display sick leave balance on payslips</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Company Contributions</Label>
                    <div className="lg:flex-1">
                      <div className="flex items-center space-x-0.5 mt-1 lg:mt-0">
                        <Checkbox
                          id="showCompanyContributions"
                          checked={watch("showCompanyContributions") || false}
                          onCheckedChange={(checked) => setValue("showCompanyContributions", !!checked)}
                          data-testid="checkbox-show-company-contributions"
                        />
                        <Label htmlFor="showCompanyContributions" className="text-xs">Display UIF and SDL contributions on payslips</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Tax calculation method</Label>
                    <div className="lg:flex-1">
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-1 lg:mt-0">
                        <p className="text-xs text-blue-800">
                          <strong>Average Year-to-Date Tax Calculation</strong>
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          The system uses average year-to-date tax calculations by default. This provides accurate payroll tax calculations based on accumulated earnings throughout the year.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </TabsContent>

              
              <TabsContent value="contact-person" className="p-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Company Contact Person</h2>
                  <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPersonFirstName" className="text-sm font-medium text-gray-700">First name <span className="text-red-500">*</span></Label>
                      <Input
                        id="contactPersonFirstName"
                        {...register("contactPersonFirstName", { required: "First name is required" })}
                        placeholder="Enter first name"
                        data-testid="input-contact-person-first-name"
                        className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="contactPersonSurname" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Surname <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonSurname"
                        {...register("contactPersonSurname", { required: "Surname is required" })}
                        data-testid="input-contact-person-surname"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="contactPersonBusinessPhone" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Business phone <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonBusinessPhone"
                        {...register("contactPersonBusinessPhone", { required: "Business phone is required" })}
                        data-testid="input-contact-person-business-phone"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="contactPersonBusinessEmail" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Business email <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonBusinessEmail"
                        {...register("contactPersonBusinessEmail", { required: "Business email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" } })}
                        data-testid="input-contact-person-business-email"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="contactPersonUnitNumber" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Unit number</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonUnitNumber"
                        {...register("contactPersonUnitNumber")}
                        data-testid="input-contact-person-unit-number"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="contactPersonComplex" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Complex</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonComplex"
                        {...register("contactPersonComplex")}
                        data-testid="input-contact-person-complex"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="contactPersonStreetNumber" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Street number</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonStreetNumber"
                        {...register("contactPersonStreetNumber")}
                        data-testid="input-contact-person-street-number"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="contactPersonStreetName" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Street name</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonStreetName"
                        {...register("contactPersonStreetName")}
                        data-testid="input-contact-person-street-name"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="contactPersonSuburb" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Suburb</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonSuburb"
                        {...register("contactPersonSuburb")}
                        data-testid="input-contact-person-suburb"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="contactPersonCityTown" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">City/Town</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonCityTown"
                        {...register("contactPersonCityTown")}
                        data-testid="input-contact-person-city-town"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="contactPersonPostalCode" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Postal code</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="contactPersonPostalCode"
                        {...register("contactPersonPostalCode")}
                        data-testid="input-contact-person-postal-code"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="contactPersonCountry" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Country</Label>
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
                </div>
              </TabsContent>

              <TabsContent value="declarant" className="p-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Company Declarant</h2>
                  <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="declarantFirstName" className="text-sm font-medium text-gray-700">First name <span className="text-red-500">*</span></Label>
                      <Input
                        id="declarantFirstName"
                        {...register("declarantFirstName", { required: "First name is required" })}
                        placeholder="Enter first name"
                        data-testid="input-declarant-first-name"
                        className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors"
                      />
                      {errors.declarantFirstName && (
                        <p className="text-xs text-red-500 mt-1">{errors.declarantFirstName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="declarantSurname" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Surname <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantSurname"
                        {...register("declarantSurname", { required: "Surname is required" })}
                        data-testid="input-declarant-surname"
                        className="bg-white mt-1 lg:mt-0"
                      />
                      {errors.declarantSurname && (
                        <p className="text-xs text-red-500 mt-1">{errors.declarantSurname.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="declarantIdNumber" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">ID number</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantIdNumber"
                        {...register("declarantIdNumber")}
                        data-testid="input-declarant-id-number"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="declarantContactEmail" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Contact email <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantContactEmail"
                        {...register("declarantContactEmail", { required: "Contact email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" } })}
                        data-testid="input-declarant-contact-email"
                        className="bg-white mt-1 lg:mt-0"
                      />
                      {errors.declarantContactEmail && (
                        <p className="text-xs text-red-500 mt-1">{errors.declarantContactEmail.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="declarantInitials" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Initials</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantInitials"
                        {...register("declarantInitials")}
                        data-testid="input-declarant-initials"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="declarantPosition" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Position</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantPosition"
                        {...register("declarantPosition")}
                        data-testid="input-declarant-position"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="declarantBusinessPhone" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Business phone <span className="text-red-500">*</span></Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantBusinessPhone"
                        {...register("declarantBusinessPhone", { required: "Business phone is required" })}
                        data-testid="input-declarant-business-phone"
                        className="bg-white mt-1 lg:mt-0"
                      />
                      {errors.declarantBusinessPhone && (
                        <p className="text-xs text-red-500 mt-1">{errors.declarantBusinessPhone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="declarantCellNumber" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Cell number</Label>
                    <div className="lg:flex-1">
                      <Input
                        id="declarantCellNumber"
                        {...register("declarantCellNumber")}
                        data-testid="input-declarant-cell-number"
                        className="bg-white mt-1 lg:mt-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="declarantDateOfBirth" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Date of birth</Label>
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
                </div>
              </TabsContent>
              
              <TabsContent value="logo" className="p-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Company Logo</h2>
                  <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:gap-3">
                    <Label htmlFor="logo" className="text-xs font-bold lg:w-48 lg:flex-shrink-0 lg:pt-2 mt-[15px] mb-[15px]">Company logo</Label>
                    <div className="lg:flex-1">
                      <div className="space-y-0.5 mt-1 lg:mt-0">
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
                          className="bg-white mt-[15px] mb-[15px]"
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
                </div>
              </TabsContent>
              
              <TabsContent value="payslips-type" className="p-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Payslip Configuration</h2>
                  <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="payslipType" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Payslip type <span className="text-red-500">*</span></Label>
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

                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Custom pay period</Label>
                    <div className="lg:flex-1">
                      <div className="flex items-center space-x-0.5 mt-1 lg:mt-0">
                        <Checkbox
                          id="customPayperiod"
                          checked={watch("customPayperiod") || false}
                          onCheckedChange={(checked) => setValue("customPayperiod", !!checked)}
                        />
                        <Label htmlFor="customPayperiod" className="text-xs">Enable custom pay period</Label>
                      </div>
                    </div>
                  </div>

                  {watch("customPayperiod") && (
                    <>
                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                        <Label htmlFor="customPayperiodName" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Custom pay period name</Label>
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

                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                        <Label htmlFor="customPayperiodDays" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Number of days</Label>
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

                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                        <Label htmlFor="customPayperiodFirstDay" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">First day of pay period</Label>
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
                  
                  {/* Archive status and actions moved from Archive tab */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
                    <Label htmlFor="status" className="text-xs font-bold lg:w-48 lg:flex-shrink-0">Archive status <span className="text-red-500">*</span></Label>
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
                  
                  {/* View, Archive and Delete Actions - only for existing companies */}
                  {company && (
                    <div className="flex gap-0.5 justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onView?.(company.id)}
                        className="text-blue-700 hover-elevate"
                        data-testid="button-view-company"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      
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
                </div>
              </TabsContent>

            </Tabs>
            
            {!isInline && (
              <div className="flex justify-end space-x-0.5 pt-4">
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
        </div>
      </div>
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
          <DialogFooter className="flex gap-0.5">
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