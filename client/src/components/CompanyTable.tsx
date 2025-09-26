import { Eye, Edit, Archive, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Company } from "@shared/schema";

interface CompanyTableProps {
  companies: Company[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  showArchived?: boolean;
}

export default function CompanyTable({ 
  companies, 
  onView, 
  onEdit, 
  onArchive, 
  onDelete,
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
                COUNTRY
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
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}
                data-testid={`row-company-${index}`}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  <span 
                    className="cursor-pointer hover:text-blue-600 hover:underline transition-colors"
                    onDoubleClick={() => onEdit(company.id)}
                    data-testid={`text-company-name-${company.id}`}
                    title="Double-click to edit"
                  >
                    {company.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {company.country}
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
                      onClick={() => onView(company.id)}
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                      data-testid={`button-view-${company.id}`}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={() => onEdit(company.id)}
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs border-green-300 text-green-700 hover:bg-green-50"
                      data-testid={`button-edit-${company.id}`}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => onArchive(company.id)}
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs border-orange-300 text-orange-700 hover:bg-orange-50"
                      data-testid={`button-archive-${company.id}`}
                    >
                      <Archive className="h-3 w-3 mr-1" />
                      Archive
                    </Button>
                    <Button
                      onClick={() => onDelete(company.id)}
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs border-red-300 text-red-700 hover:bg-red-50"
                      data-testid={`button-delete-${company.id}`}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
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