# 搜索功能实现

本文档演示了如何在 Prompt Planet 项目中实现和使用搜索功能。

## 提示词搜索实现

下面是使用 `searchPrompts` 函数搜索提示词的示例代码：

```typescript
import { searchPrompts } from '@/services/promptService';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

// 搜索组件示例
function SearchComponent() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 处理搜索
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await searchPrompts({
        query: query,
        page: 1,
        limit: 10,
        sort: 'relevance',
      });
      
      setResults(searchResults.prompts);
    } catch (err) {
      setError(t('searchResults.searchFailed'));
      console.error('搜索失败:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchResults.searchPlaceholder')}
          className="search-input"
        />
        <button 
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="search-button"
        >
          {loading ? t('common.searching') : t('common.search')}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="search-results">
        {results.length > 0 ? (
          results.map((prompt) => (
            <div key={prompt.id} className="prompt-card">
              <h3>{prompt.title}</h3>
              <p>{prompt.description}</p>
              {/* 其他提示词详情 */}
            </div>
          ))
        ) : (
          query.trim() && !loading && <p>{t('searchResults.noResults')}</p>
        )}
      </div>
    </div>
  );
}
```

## 高级搜索功能

以下是实现高级搜索功能的示例，包括分类和标签筛选：

```typescript
import { searchPrompts } from '@/services/promptService';
import { getAllCategories } from '@/services/categoryService';
import { getPopularTags } from '@/services/tagService';
import { useState, useEffect } from 'react';

function AdvancedSearch() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('relevance');
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  
  // 获取分类和热门标签
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getAllCategories(),
          getPopularTags({ limit: 50 })
        ]);
        
        setCategories(categoriesData.categories);
        setTags(tagsData.tags);
      } catch (err) {
        console.error('获取筛选条件失败:', err);
      }
    };
    
    fetchFilters();
  }, []);
  
  // 执行高级搜索
  const handleSearch = async () => {
    try {
      const searchResults = await searchPrompts({
        query: query,
        category: category || undefined,
        tag: tag || undefined,
        sort: sort,
        page: 1,
        limit: 20
      });
      
      setResults(searchResults.prompts);
    } catch (err) {
      console.error('搜索失败:', err);
    }
  };
  
  return (
    <div className="advanced-search">
      {/* 搜索输入框和按钮 */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入关键词搜索..."
      />
      
      {/* 分类筛选 */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">所有分类</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.displayName}
          </option>
        ))}
      </select>
      
      {/* 标签筛选 */}
      <select value={tag} onChange={(e) => setTag(e.target.value)}>
        <option value="">所有标签</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.displayName}
          </option>
        ))}
      </select>
      
      {/* 排序方式 */}
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="relevance">相关度</option>
        <option value="latest">最新</option>
        <option value="popular">热门</option>
      </select>
      
      <button onClick={handleSearch}>搜索</button>
      
      {/* 搜索结果展示 */}
      <div className="search-results">
        {results.map((prompt) => (
          <div key={prompt.id} className="prompt-card">
            {/* 提示词卡片内容 */}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 实时搜索建议

以下代码展示了如何实现实时搜索建议功能：

```typescript
import { useState, useEffect, useRef } from 'react';
import { searchTags } from '@/services/tagService';
import { debounce } from '@/utils/helpers';

function SearchSuggestions() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // 使用debounce减少API调用频率
  const debouncedSearch = useRef(
    debounce(async (searchTerm) => {
      if (!searchTerm.trim() || searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }
      
      try {
        const result = await searchTags(searchTerm);
        setSuggestions(result.tags.slice(0, 5));
      } catch (err) {
        console.error('获取搜索建议失败:', err);
      }
    }, 300)
  ).current;
  
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);
  
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };
  
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.displayName);
    setShowSuggestions(false);
    // 可以在此执行搜索操作
  };
  
  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="搜索提示词..."
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## 搜索历史记录

以下是实现搜索历史记录功能的示例代码：

```typescript
import { useState, useEffect } from 'react';

function SearchWithHistory() {
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  
  // 从本地存储加载搜索历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('解析搜索历史失败:', err);
        setSearchHistory([]);
      }
    }
  }, []);
  
  // 保存搜索历史到本地存储
  const saveSearchHistory = (history) => {
    localStorage.setItem('searchHistory', JSON.stringify(history));
  };
  
  const handleSearch = () => {
    if (!query.trim()) return;
    
    // 将当前搜索词添加到历史记录
    const newHistory = [
      query,
      ...searchHistory.filter(item => item !== query)
    ].slice(0, 10); // 只保留最近10条
    
    setSearchHistory(newHistory);
    saveSearchHistory(newHistory);
    
    // 执行搜索操作...
  };
  
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };
  
  return (
    <div className="search-with-history">
      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索提示词..."
        />
        <button onClick={handleSearch}>搜索</button>
      </div>
      
      {searchHistory.length > 0 && (
        <div className="search-history">
          <div className="history-header">
            <h4>搜索历史</h4>
            <button onClick={clearHistory}>清除历史</button>
          </div>
          <ul className="history-list">
            {searchHistory.map((item, index) => (
              <li key={index} onClick={() => setQuery(item)}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

以上示例展示了从基本搜索到高级搜索、实时建议和搜索历史记录的实现方法，可以根据项目需求选择和组合这些功能。 