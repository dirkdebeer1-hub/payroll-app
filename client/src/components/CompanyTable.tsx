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
}

export default function CompanyTable({ 
  companies, 
  onView, 
  onEdit, 
  onArchive, 
  onDelete 
}: CompanyTableProps) {
  return (
    <div className="bg-card border border-card-border rounded-md overflow-hidden">
      <div className="max-h-80 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-2">
                Company Name
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-2">
                Country
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-2">
                Employees
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-2">
                Payslips
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-2">
                Status
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr 
                key={company.id} 
                className="border-b border-muted hover:bg-muted/30 transition-colors"
                data-testid={`row-company-${index}`}
              >
                <td className="px-2 py-2 text-xs font-medium text-foreground">
                  {company.name}
                </td>
                <td className="px-2 py-2 text-xs text-muted-foreground">
                  {company.country}
                </td>
                <td className="px-2 py-2 text-xs text-muted-foreground">
                  {company.employees}
                </td>
                <td className="px-2 py-2 text-xs text-muted-foreground">
                  {company.payslips}
                </td>
                <td className="px-2 py-2">
                  <Badge 
                    variant={company.status === 'ACTIVE' ? 'default' : 'secondary'}
                    className={`text-xs ${
                      company.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                        : 'bg-red-100 text-red-800 hover:bg-red-100'
                    }`}
                  >
                    {company.status}
                  </Badge>
                </td>
                <td className="px-2 py-2">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(company.id)}
                      className="h-4 px-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                      data-testid={`button-view-${company.id}`}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(company.id)}
                      className="h-4 px-1.5 text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                      data-testid={`button-edit-${company.id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onArchive(company.id)}
                      className="h-4 px-1.5 text-xs bg-gray-50 text-gray-700 hover:bg-gray-100"
                      data-testid={`button-archive-${company.id}`}
                    >
                      Archive
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(company.id)}
                      className="h-4 px-1.5 text-xs bg-red-50 text-red-700 hover:bg-red-100"
                      data-testid={`button-delete-${company.id}`}
                    >
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
      <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-muted/20">
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="text-xs h-4 px-1.5" data-testid="button-pagination-first">
            First
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-4 px-1.5" data-testid="button-pagination-previous">
            Previous
          </Button>
        </div>
        
        <span className="text-xs text-muted-foreground">
          Page 1 of 2 | Total: 45 | Per page: 25
        </span>
        
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="text-xs h-4 px-1.5" data-testid="button-pagination-next">
            Next
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-4 px-1.5" data-testid="button-pagination-last">
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}