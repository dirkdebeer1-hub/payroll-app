interface StatsCardsProps {
  totalCompanies: number;
  activeCompanies: number;
}

export default function StatsCards({ totalCompanies, activeCompanies }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 mb-3">
      <div className="bg-card border border-card-border rounded-md p-2 text-center">
        <div className="font-bold text-foreground mb-0" style={{ fontSize: '22px' }}>
          {totalCompanies}
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-wide font-bold">
          Total Companies
        </div>
      </div>
      
      <div className="bg-card border border-card-border rounded-md p-2 text-center">
        <div className="font-bold text-foreground mb-0" style={{ fontSize: '22px' }}>
          {activeCompanies}
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-wide font-bold">
          Active Companies
        </div>
      </div>
    </div>
  );
}