import { Eye, Edit, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Company } from "@shared/schema";

interface CompanyTableProps {
  companies: Company[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onPayslips: (id: string) => void;
  onSelectCompany?: (company: Company) => void;
  showArchived?: boolean;
}

export default function CompanyTable({ 
  companies, 
  onView, 
  onEdit,
  onPayslips,
  onSelectCompany,
  showArchived = false
}: CompanyTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-4 flex-1 flex flex-col font-['Roboto']">
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-white border-b border-gray-200">
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wide px-4 py-3">
                COMPANY NAME
              </th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wide px-4 py-3">
                EMPLOYEES
              </th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wide px-4 py-3">
                PAYSLIPS
              </th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wide px-4 py-3">
                STATUS
              </th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wide px-4 py-3">
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
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  <span 
                    className="font-medium"
                    data-testid={`text-company-name-${company.id}`}
                    title="Click row to select, use Edit button to edit"
                  >
                    {company.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {company.employees}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {company.payslips}
                </td>
                <td className="px-4 py-3">
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
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPayslips(company.id);
                      }}
                      variant="secondary"
                      size="sm"
                      className="h-7 px-2 text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                      data-testid={`button-payslips-${company.id}`}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Payslips
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(company.id);
                      }}
                      variant="secondary"
                      size="sm"
                      className="h-7 px-2 text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      data-testid={`button-view-${company.id}`}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(company.id);
                      }}
                      variant="secondary"
                      size="sm"
                      className="h-7 px-2 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                      data-testid={`button-edit-${company.id}`}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <button className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors" data-testid="button-pagination-first">
            First
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors" data-testid="button-pagination-previous">
            Previous
          </button>
        </div>
        
        <span className="text-sm text-gray-600">
          Page 1 of 1 ({companies.length} companies)
        </span>
        
        <div className="flex gap-2">
          <button className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors" data-testid="button-pagination-next">
            Next
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors" data-testid="button-pagination-last">
            Last
          </button>
        </div>
      </div>
    </div>
  );
}