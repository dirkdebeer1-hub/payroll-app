import { Eye, Edit, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Company } from "@shared/schema";

interface CompanyTableProps {
  companies: Company[];
  onEdit: (id: string) => void;
  onPayslips: (id: string) => void;
  onSelectCompany?: (company: Company) => void;
  showArchived?: boolean;
}

export default function CompanyTable({ 
  companies, 
  onEdit,
  onPayslips,
  onSelectCompany,
  showArchived = false
}: CompanyTableProps) {
  return (
    <div className="bg-white border border-gray-200 overflow-hidden mb-2 flex-1 flex flex-col font-['Roboto']">
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-white border-b border-gray-200">
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wide px-3 py-1">
                COMPANY NAME
              </th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wide px-3 py-1">
                EMPLOYEES
              </th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wide px-3 py-1">
                PAYSLIPS
              </th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wide px-3 py-1">
                STATUS
              </th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wide px-3 py-1">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr 
                key={company.id} 
                className={`border-b border-gray-100 hover:bg-blue-50 hover:cursor-pointer transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}
                onClick={() => onSelectCompany?.(company)}
                data-testid={`row-company-${index}`}
              >
                <td className="px-3 py-1 text-xs font-medium text-gray-900">
                  <span 
                    className="font-medium"
                    data-testid={`text-company-name-${company.id}`}
                    title="Click row to select, use Edit button to edit"
                  >
                    {company.name}
                  </span>
                </td>
                <td className="px-3 py-1 text-xs text-gray-600">
                  {company.employees}
                </td>
                <td className="px-3 py-1 text-xs text-gray-600">
                  {company.payslips}
                </td>
                <td className="px-3 py-1">
                  <Badge 
                    variant={company.status === 'ACTIVE' ? 'default' : 'secondary'}
                    className={`text-xs font-bold ${
                      company.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                        : 'bg-red-100 text-red-800 hover:bg-red-100'
                    }`}
                  >
                    {company.status}
                  </Badge>
                </td>
                <td className="px-3 py-1">
                  <div className="flex gap-0.5">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPayslips(company.id);
                      }}
                      variant="secondary"
                      size="icon"
                      className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      data-testid={`button-payslips-${company.id}`}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(company.id);
                      }}
                      variant="secondary"
                      size="icon"
                      className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      data-testid={`button-edit-${company.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <Button

            className="bg-[#465193] text-white hover:bg-[#384080]"
            data-testid="button-pagination-first"
          >
            First
          </Button>
          <Button

            className="bg-[#465193] text-white hover:bg-[#384080]"
            data-testid="button-pagination-previous"
          >
            Previous
          </Button>
        </div>
        
        <span className="text-xs text-gray-600">
          Page 1 of 1 ({companies.length} companies)
        </span>
        
        <div className="flex gap-2">
          <Button

            className="bg-[#465193] text-white hover:bg-[#384080]"
            data-testid="button-pagination-next"
          >
            Next
          </Button>
          <Button

            className="bg-[#465193] text-white hover:bg-[#384080]"
            data-testid="button-pagination-last"
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}