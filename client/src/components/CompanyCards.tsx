import { Eye, Edit, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Company } from "@shared/schema";

interface CompanyCardsProps {
  companies: Company[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  showArchived?: boolean;
}

export default function CompanyCards({ 
  companies, 
  onView, 
  onEdit, 
  onArchive, 
  onDelete,
  showArchived = false
}: CompanyCardsProps) {
  return (
    <div className="h-full overflow-auto pr-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {companies.map((company, index) => (
          <Card 
            key={company.id} 
            className="hover-elevate border-card-border"
            data-testid={`card-company-${index}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <h3 
                  className="text-sm font-medium text-foreground leading-tight line-clamp-2 cursor-pointer px-2 py-1 rounded-md transition-colors hover:bg-blue-50 hover:text-blue-700"
                  onDoubleClick={() => onEdit(company.id)}
                  data-testid={`text-company-name-${company.id}`}
                  title="Double-click to edit"
                >
                  {company.name}
                </h3>
                <Badge 
                  variant={company.status === 'ACTIVE' ? 'default' : 'secondary'}
                  className={`text-xs shrink-0 ${
                    company.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                      : 'bg-red-100 text-red-800 hover:bg-red-100'
                  }`}
                >
                  {company.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Country:</span>
                    <span>{company.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employees:</span>
                    <span>{company.employees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payslips:</span>
                    <span>{company.payslips}</span>
                  </div>
                </div>
                
                <div className="flex gap-1 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(company.id)}
                    className="px-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 flex-1"
                    data-testid={`button-view-${company.id}`}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(company.id)}
                    className="px-1.5 text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100 dark:hover:bg-yellow-800 flex-1"
                    data-testid={`button-edit-${company.id}`}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onArchive(company.id)}
                    className={`px-1.5 text-xs ${showArchived ? 'flex-1' : 'w-full'} ${
                      showArchived 
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                    data-testid={`button-archive-${company.id}`}
                  >
                    <Archive className="h-3 w-3 mr-1" />
                    {showArchived ? 'Restore' : 'Archive'}
                  </Button>
                  {showArchived && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(company.id)}
                      className="px-1.5 text-xs bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800 flex-1"
                      data-testid={`button-delete-${company.id}`}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}