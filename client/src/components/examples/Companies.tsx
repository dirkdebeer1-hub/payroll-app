import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Companies from '../../pages/Companies';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function CompaniesExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen">
        <Companies />
      </div>
    </QueryClientProvider>
  );
}