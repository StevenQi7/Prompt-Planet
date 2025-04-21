import { useLanguage } from '@/contexts/LanguageContext';

interface SearchHeaderProps {
  searchKeyword: string;
  totalResults: number;
}

export default function SearchHeader({
  searchKeyword,
  totalResults
}: SearchHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 border-b border-gray-100">
      <h1 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 shadow-sm">
          <i className="fas fa-search text-indigo-600"></i>
        </div>
        {t('searchResults.title')}: "<span className="text-indigo-600">{searchKeyword}</span>"
      </h1>
      <p className="text-gray-600 ml-11 text-sm">
        {t('searchResults.resultsFound').replace('{count}', String(totalResults))}
      </p>
    </div>
  );
} 