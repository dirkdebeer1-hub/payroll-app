import CompanyCards from '../CompanyCards';
import type { Company } from '@shared/schema';

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Actum Innovations (Pty) Ltd',
    country: 'South Africa',
    employees: 1,
    payslips: 31,
    status: 'ACTIVE'
  },
  {
    id: '2',
    name: 'AE South Africa (Pty) Ltd',
    country: 'South Africa',
    employees: 3,
    payslips: 89,
    status: 'ACTIVE'
  },
  {
    id: '3',
    name: 'Almeria 240 ICHAF (Pty) Ltd',
    country: 'South Africa',
    employees: 7,
    payslips: 203,
    status: 'ACTIVE'
  }
];

export default function CompanyCardsExample() {
  return (
    <CompanyCards
      companies={mockCompanies}
      onView={(id) => console.log('View company:', id)}
      onEdit={(id) => console.log('Edit company:', id)}
      onArchive={(id) => console.log('Archive company:', id)}
      onDelete={(id) => console.log('Delete company:', id)}
    />
  );
}