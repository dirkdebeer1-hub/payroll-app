import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Companies from "@/pages/Companies";
import Employees from "@/pages/Employees";
import NotFound from "@/pages/not-found";
import type { Company } from "@shared/schema";

interface RouterProps {
  selectedCompany: Company | null;
  onSelectCompany: (company: Company | null) => void;
}

function Router({ selectedCompany, onSelectCompany }: RouterProps) {
  return (
    <Switch>
      <Route path="/" component={(props) => <Companies {...props} selectedCompany={selectedCompany} onSelectCompany={onSelectCompany} />} />
      <Route path="/companies" component={(props) => <Companies {...props} selectedCompany={selectedCompany} onSelectCompany={onSelectCompany} />} />
      <Route path="/employees" component={(props) => <Employees {...props} selectedCompany={selectedCompany} />} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleSelectCompany = (company: Company | null) => {
    setSelectedCompany(company);
  };

  return (
    <div className="h-screen w-full overflow-hidden">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router selectedCompany={selectedCompany} onSelectCompany={handleSelectCompany} />
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
