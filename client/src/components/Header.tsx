import { Menu, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Company } from "@shared/schema";

interface HeaderProps {
  onToggleSidebar?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
  selectedCompany?: Company | null;
  onCompanySelect?: () => void;
}

export default function Header({ onToggleSidebar, showBackButton, onBack, title = "Payroll", selectedCompany, onCompanySelect }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border">
      <div className="flex items-center justify-between px-3 sm:px-4 py-3">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover-elevate p-2"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="md:hidden hover-elevate p-2"
            data-testid="button-toggle-sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight truncate">
            {title}
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onCompanySelect}
            className="h-7 px-3 text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 font-medium cursor-pointer"
            data-testid="button-company-selector"
          >
            {selectedCompany ? selectedCompany.name : "Select Company"}
          </Button>
          <span className="text-muted-foreground text-sm">|</span>
          <span className="text-sm text-muted-foreground font-medium">
            Dirk de Beer
          </span>
        </div>
        <div className="sm:hidden">
          <span className="text-xs text-muted-foreground">
            {selectedCompany ? selectedCompany.name.substring(0, 10) + '...' : 'Select Co.'}
          </span>
        </div>
      </div>
    </header>
  );
}