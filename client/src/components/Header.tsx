import { Menu, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Company } from "@shared/schema";

interface HeaderProps {
  onToggleSidebar?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
  selectedCompany?: Company | null;
}

export default function Header({ onToggleSidebar, showBackButton, onBack, title = "Payroll", selectedCompany }: HeaderProps) {
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
          <span className="text-sm font-bold text-foreground">
            {selectedCompany ? selectedCompany.name : "No Company Selected"}
          </span>
          <span className="text-muted-foreground text-sm">|</span>
          <span className="text-sm text-muted-foreground font-medium">
            Dirk de Beer
          </span>
        </div>
        <div className="sm:hidden">
          <span className="text-xs font-bold text-foreground">
            {selectedCompany ? selectedCompany.name.substring(0, 12) + '...' : 'No Company'}
          </span>
        </div>
      </div>
    </header>
  );
}