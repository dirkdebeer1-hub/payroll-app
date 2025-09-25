import { type Company } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CompanyA4ViewProps {
  company: Company;
}

export default function CompanyA4View({ company }: CompanyA4ViewProps) {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black print:p-4 print:shadow-none print:max-w-none print:mx-0" data-pdf-content>
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold text-black">{company.name}</h1>
        <p className="text-lg text-gray-700 mt-2">Company Information Profile</p>
      </div>

      {/* Basic Company Information */}
      <Card className="mb-6 border-black">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-xl font-bold text-black">Company Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="font-bold text-black">Company Name:</span>
              <span className="ml-2">{company.name}</span>
            </div>
            <div>
              <span className="font-bold text-black">Country:</span>
              <span className="ml-2">{company.country}</span>
            </div>
            <div>
              <span className="font-bold text-black">Registration Number:</span>
              <span className="ml-2">{company.registration || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Status:</span>
              <span className="ml-2">{company.status}</span>
            </div>
            <div>
              <span className="font-bold text-black">Number of Employees:</span>
              <span className="ml-2">{company.employees}</span>
            </div>
            <div>
              <span className="font-bold text-black">Payslips Processed:</span>
              <span className="ml-2">{company.payslips}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="mb-6 border-black">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-xl font-bold text-black">Address Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="font-bold text-black">Physical Address:</span>
              <span className="ml-2">{company.physicalAddress || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Postal Address:</span>
              <span className="ml-2">{company.postalAddress || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">City:</span>
              <span className="ml-2">{company.city || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Province:</span>
              <span className="ml-2">{company.province || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Postal Code:</span>
              <span className="ml-2">{company.postalCode || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Timezone:</span>
              <span className="ml-2">{company.timezone || "N/A"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="mb-6 border-black">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-xl font-bold text-black">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="font-bold text-black">Telephone:</span>
              <span className="ml-2">{company.telephone || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Fax:</span>
              <span className="ml-2">{company.fax || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Email:</span>
              <span className="ml-2">{company.email || "N/A"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Numbers */}
      <Card className="mb-6 border-black">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-xl font-bold text-black">Tax Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="font-bold text-black">VAT Number:</span>
              <span className="ml-2">{company.vatNumber || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">PAYE Number:</span>
              <span className="ml-2">{company.payeNumber || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">SDL Number:</span>
              <span className="ml-2">{company.sdlNumber || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">UIF Number:</span>
              <span className="ml-2">{company.uifNumber || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">UIF Employer Reference:</span>
              <span className="ml-2">{company.uifEmployerReference || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Tax Type:</span>
              <span className="ml-2">{company.taxType}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rates */}
      <Card className="mb-6 border-black">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-xl font-bold text-black">Working Time Rates</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="font-bold text-black">Extratime Rate:</span>
              <span className="ml-2">{company.extratimeRate}x</span>
            </div>
            <div>
              <span className="font-bold text-black">Overtime Rate:</span>
              <span className="ml-2">{company.overtimeRate}x</span>
            </div>
            <div>
              <span className="font-bold text-black">Doubletime Rate:</span>
              <span className="ml-2">{company.doubletimeRate}x</span>
            </div>
            <div>
              <span className="font-bold text-black">Last Day of Week:</span>
              <span className="ml-2">{company.lastDayOfWeek}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* South Africa Specific Settings */}
      <Card className="mb-6 border-black">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-xl font-bold text-black">South Africa Compliance</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="font-bold text-black">Eligible for ETI:</span>
              <span className="ml-2">{company.eligibleForETI ? "Yes" : "No"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Monthly Minimum Wage (ETI):</span>
              <span className="ml-2">R{company.monthlyMinimumWage?.toFixed(2) || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Trade Classification:</span>
              <span className="ml-2">{company.tradeClassification || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Industry Classification Code:</span>
              <span className="ml-2">{company.industryClassificationCode || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">SDL Contribution:</span>
              <span className="ml-2">{company.sdlContribution ? "Yes" : "No"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card className="mb-6 border-black">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-xl font-bold text-black">Banking Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="font-bold text-black">Branch Code:</span>
              <span className="ml-2">{company.branchCode || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Account Number:</span>
              <span className="ml-2">{company.bankAccountNumber || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Account Holder Name:</span>
              <span className="ml-2">{company.bankAccountHolderName || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Banking Reference:</span>
              <span className="ml-2">{company.bankingReference || "N/A"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Person */}
      <Card className="mb-6 border-black">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-xl font-bold text-black">Contact Person</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="font-bold text-black">Name:</span>
              <span className="ml-2">{[company.contactPersonFirstName, company.contactPersonSurname].filter(Boolean).join(" ") || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Business Phone:</span>
              <span className="ml-2">{company.contactPersonBusinessPhone || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Business Email:</span>
              <span className="ml-2">{company.contactPersonBusinessEmail || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Address:</span>
              <span className="ml-2">
                {[
                  company.contactPersonUnitNumber,
                  company.contactPersonComplex,
                  company.contactPersonStreetNumber,
                  company.contactPersonStreetName,
                  company.contactPersonSuburb,
                  company.contactPersonCityTown,
                  company.contactPersonPostalCode,
                  company.contactPersonCountry
                ].filter(Boolean).join(", ") || "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Declarant Information */}
      <Card className="mb-6 border-black">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-xl font-bold text-black">Declarant Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="font-bold text-black">Name:</span>
              <span className="ml-2">{[company.declarantFirstName, company.declarantSurname].filter(Boolean).join(" ") || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">ID Number:</span>
              <span className="ml-2">{company.declarantIdNumber || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Initials:</span>
              <span className="ml-2">{company.declarantInitials || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Position:</span>
              <span className="ml-2">{company.declarantPosition || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Contact Email:</span>
              <span className="ml-2">{company.declarantContactEmail || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Business Phone:</span>
              <span className="ml-2">{company.declarantBusinessPhone || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Cell Number:</span>
              <span className="ml-2">{company.declarantCellNumber || "N/A"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Date of Birth:</span>
              <span className="ml-2">{company.declarantDateOfBirth || "N/A"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="mb-6 border-black">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-xl font-bold text-black">System Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="font-bold text-black">Disable Shading on Reports:</span>
              <span className="ml-2">{company.disableShading ? "Yes" : "No"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Enable Timekeeping:</span>
              <span className="ml-2">{company.enableTimekeeping ? "Yes" : "No"}</span>
            </div>
            <div>
              <span className="font-bold text-black">Payslip Type:</span>
              <span className="ml-2">{company.payslipType}</span>
            </div>
            <div>
              <span className="font-bold text-black">Custom Payperiod:</span>
              <span className="ml-2">{company.customPayperiod ? "Yes" : "No"}</span>
            </div>
            {company.customPayperiod && (
              <>
                <div>
                  <span className="font-bold text-black">Custom Payperiod Name:</span>
                  <span className="ml-2">{company.customPayperiodName || "N/A"}</span>
                </div>
                <div>
                  <span className="font-bold text-black">Custom Payperiod Days:</span>
                  <span className="ml-2">{company.customPayperiodDays || "N/A"}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8 pt-4 border-t-2 border-black">
        <p className="text-sm text-gray-600">
          Document generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          This document contains confidential company information
        </p>
      </div>
    </div>
  );
}