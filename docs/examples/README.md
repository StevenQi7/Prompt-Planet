# Prompt Planet 示例代码

本文档提供了 Prompt Planet 项目的代码示例，帮助开发者理解和使用项目中的各种功能。

## 目录

- [搜索功能实现](./search.md)
- [提示词创建与编辑](./prompt-edit.md)
- [认证流程](./authentication.md)
- [国际化实现](./i18n.md)
- [文件上传](./file-upload.md)
- [状态管理](./state-management.md)

## 示例索引

### 搜索组件集成示例

以下是 SearchResults 组件的完整使用示例，展示了如何集成搜索相关的子组件：

```tsx
// src/components/SearchResults.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

// 导入子组件
import {
  SearchHeader,
  SearchFilters,
  SearchResultsList,
  RelatedTags
} from './search';
import Pagination from './common/Pagination';

// 导入工具函数
import { getColorClasses } from '@/utils/styleUtils';
import { getTimeAgo } from '@/utils/formatUtils';

// ...组件定义

export default function SearchResults({ query, initialParams }: SearchResultsProps) {
  // ...状态和逻辑

  return (
    <div className="container mx-auto px-2 sm:px-4 py-5">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-5 border border-gray-100 hover:shadow-md transition-all duration-300">
        {/* 搜索结果头部 */}
        <SearchHeader 
          searchKeyword={searchKeyword} 
          totalResults={totalResults} 
        />
        
        {/* 筛选组件 */}
        <SearchFilters 
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSort={selectedSort}
          selectedTags={selectedTags}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onTagRemove={removeTagFilter}
          onClearFilters={clearAllFilters}
          getCategoryColorClasses={getColorClasses}
        />
        
        {/* 搜索结果列表 */}
        <div className="p-3">
          <SearchResultsList 
            searchResults={searchResults}
            isLoading={isLoading}
            error={error}
            getTimeAgo={formatDate}
          />
          
          {/* 分页 */}
          {searchResults.length > 0 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalResults}
              itemsPerPage={10}
              onPageChange={handlePageChange}
            />
          )}
          
          {/* 相关标签 */}
          <RelatedTags 
            relatedTags={relatedTags}
            getCategoryColorClasses={getColorClasses}
          />
        </div>
      </div>
    </div>
  );
}
```

### 使用提示词服务示例

下面是使用提示词服务获取热门提示词的示例：

```tsx
// 在页面组件中使用
import { getFeaturedPrompts } from '@/services/promptService';

// 在React组件中
const [featuredPrompts, setFeaturedPrompts] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const loadFeaturedPrompts = async () => {
    try {
      setIsLoading(true);
      const data = await getFeaturedPrompts(5); // 获取5条精选提示词
      setFeaturedPrompts(data);
      setError('');
    } catch (err) {
      setError('无法加载精选提示词');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  loadFeaturedPrompts();
}, []);
```

### 使用国际化示例

下面是使用国际化函数的示例：

```tsx
// 在React组件中
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t, language, changeLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('homepage.title')}</h1>
      <p>{t('homepage.description')}</p>
      
      {/* 切换语言 */}
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('zh')}>中文</button>
      
      {/* 带参数的翻译 */}
      <p>{t('search.results', { count: 10 })}</p>
    </div>
  );
}
```

## 最佳实践

1. **组件拆分**：将大型组件分解为可复用的小组件
2. **异步数据获取**：使用try-catch结构处理异步请求，确保错误处理
3. **TypeScript类型**：为所有组件和函数定义清晰的类型
4. **状态管理**：合理使用React的useState和useEffect钩子管理状态和副作用
5. **条件渲染**：使用条件渲染显示加载状态和错误信息
6. **响应式设计**：使用Tailwind的响应式类实现移动优先的设计 