import { Edit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Company } from "@shared/schema";

interface CompanyCardsProps {
  companies: Company[];
  onEdit: (id: string) => void;
  onPayslips: (id: string) => void;
  onSelectCompany?: (company: Company) => void;
  showArchived?: boolean;
}

export default function CompanyCards({ 
  companies, 
  onEdit,
  onPayslips,
  onSelectCompany,
  showArchived = false
}: CompanyCardsProps) {
  return (
    <div className="h-full overflow-auto pr-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
        {companies.map((company, index) => (
          <Card 
            key={company.id} 
            className="hover:bg-blue-50 hover:cursor-pointer transition-colors border-card-border"
            onClick={() => onSelectCompany?.(company)}
            data-testid={`card-company-${index}`}
          >
            <CardHeader className="pb-0.5 pt-2 px-2">
              <div className="flex items-start justify-between gap-2">
                <h3 
                  className="text-xs-13 font-medium text-foreground leading-tight line-clamp-2"
                  data-testid={`text-company-name-${company.id}`}
                  title="Double-click to view payslips"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onPayslips(company.id);
                  }}
                >
                  {company.name}
                </h3>
                <Badge 
                  variant={company.status === 'ACTIVE' ? 'default' : 'secondary'}
                  className={`text-xs-13 shrink-0 ${
                    company.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                      : 'bg-red-100 text-red-800 hover:bg-red-100'
                  }`}
                >
                  {company.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-2 pb-2">
              <div className="space-y-0.5">
                <div className="text-xs-13 text-muted-foreground">
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
                
                <div className="flex gap-0.5 pt-0.5">
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPayslips(company.id);
                    }}
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 text-xs-13"
                    data-testid={`button-payslips-${company.id}`}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Payslips
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(company.id);
                    }}
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                    data-testid={`button-edit-${company.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}