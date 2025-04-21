import { Suspense } from 'react';
import SearchResults from '@/components/SearchResults';

interface SearchParams {
  q?: string;
  category?: string;
  tag?: string;
  lang?: string;
  sort?: string;
  page?: string;
  'tags[]'?: string[];
}

function SearchResultsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = searchParams?.q || '';
  
  return (
    <main className="bg-gray-50 min-h-screen pb-10">
      <SearchResults query={query} />
    </main>
  );
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultsContent searchParams={params} />
    </Suspense>
  );
} 