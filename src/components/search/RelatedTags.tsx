import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCount } from '@/utils/formatUtils';

// 标签类型接口
interface Tag {
  id: string;
  name: string;
  displayName: string;
  color: string;
  count: number;
}

interface RelatedTagsProps {
  relatedTags: Tag[];
  getCategoryColorClasses: (color: string) => any;
}

export default function RelatedTags({
  relatedTags,
  getCategoryColorClasses
}: RelatedTagsProps) {
  const { t, language } = useLanguage();
  
  if (relatedTags.length === 0) return null;
  
  return (
    <div className="mt-6">
      <h2 className="text-base font-semibold text-gray-800 mb-3">{t('searchResults.youMightAlsoLike')}:</h2>
      <div className="flex flex-wrap gap-3">
        {relatedTags.map((tag) => {
          const colorClasses = getCategoryColorClasses(tag.color || 'indigo');
          return (
            <Link 
              href={`/search-results?q=${encodeURIComponent(language === 'zh' ? (tag.displayName || tag.name) : tag.name)}&page=1`} 
              key={tag.id} 
              className={`${colorClasses.bg} ${colorClasses.text} text-sm font-medium px-3 py-1.5 rounded-lg flex items-center shadow-sm border ${colorClasses.border} hover:shadow-md transition-all duration-300`}
            >
              {language === 'zh' ? (tag.displayName || tag.name) : tag.name}
              <span className="ml-2 bg-white px-1.5 py-0.5 rounded-md text-xs">
                {formatCount(tag.count)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 