interface StatsCardsProps {
  totalCompanies: number;
  activeCompanies: number;
}

export default function StatsCards({ totalCompanies, activeCompanies }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white border border-gray-200 p-4 text-center">
        <div className="font-bold text-gray-900 mb-1" style={{ fontSize: '22px' }}>
          {totalCompanies}
        </div>
        <div className="text-xs-13 font-medium text-gray-600 uppercase tracking-wide">
          Total Companies
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 p-4 text-center">
        <div className="font-bold text-gray-900 mb-1" style={{ fontSize: '22px' }}>
          {activeCompanies}
        </div>
        <div className="text-xs-13 font-medium text-gray-600 uppercase tracking-wide">
          Active Companies
        </div>
      </div>
    </div>
  );
}