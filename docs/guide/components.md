# 组件使用指南

Prompt Planet 项目中包含了多种可复用组件，本文档提供了这些组件的使用说明。

## 组件目录结构

组件按功能模块组织，主要分为以下几类：

```
src/components/
├── common/            # 通用组件
│   ├── Pagination.tsx # 分页组件
│   └── ConfirmDialog.tsx # 确认对话框
├── prompt/            # 提示词相关组件
│   ├── PromptContent.tsx # 提示词内容组件
│   └── PromptSidebar.tsx # 提示词侧边栏
├── search/            # 搜索相关组件
│   ├── SearchHeader.tsx
│   ├── SearchFilters.tsx
│   ├── SearchResultsList.tsx
│   └── RelatedTags.tsx
└── ...                # 其他功能组件
```

## 通用组件

### Pagination 分页组件

分页组件用于展示分页控制，支持页码切换、显示当前页信息等功能。

#### 使用示例

```tsx
import Pagination from '@/components/common/Pagination';

// 在组件中使用
<Pagination 
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalResults}
  itemsPerPage={10}
  onPageChange={handlePageChange}
/>
```

#### 组件属性

| 属性名 | 类型 | 必填 | 描述 |
| ------ | ---- | ---- | ---- |
| currentPage | number | 是 | 当前页码 |
| totalPages | number | 是 | 总页数 |
| totalItems | number | 是 | 总条目数 |
| itemsPerPage | number | 是 | 每页条目数 |
| onPageChange | (page: number) => void | 是 | 页码变更回调函数 |
| className | string | 否 | 自定义样式类名 |

### ConfirmDialog 确认对话框

确认对话框用于用户操作确认，支持自定义标题、内容和按钮。

#### 使用示例

```tsx
import ConfirmDialog from '@/components/common/ConfirmDialog';

// 在组件中使用
<ConfirmDialog
  isOpen={showConfirmDialog}
  title="确认删除"
  message="确定要删除此提示词吗？此操作无法撤销。"
  onConfirm={handleDelete}
  onCancel={() => setShowConfirmDialog(false)}
/>
```

#### 组件属性

| 属性名 | 类型 | 必填 | 描述 |
| ------ | ---- | ---- | ---- |
| isOpen | boolean | 是 | 是否显示对话框 |
| title | string | 否 | 对话框标题 |
| message | string | 是 | 对话框内容 |
| confirmText | string | 否 | 确认按钮文本 |
| cancelText | string | 否 | 取消按钮文本 |
| onConfirm | () => void | 是 | 确认回调函数 |
| onCancel | () => void | 是 | 取消回调函数 |
| confirmButtonClass | string | 否 | 确认按钮样式类 |
| cancelButtonClass | string | 否 | 取消按钮样式类 |
| icon | React.ReactNode | 否 | 对话框图标 |

## 搜索组件

搜索功能由多个组件组成，通过 SearchResults 组件进行集成：

### SearchHeader

显示搜索结果标题和统计信息。

#### 使用示例

```tsx
import { SearchHeader } from '@/components/search';

<SearchHeader 
  searchKeyword={searchKeyword} 
  totalResults={totalResults} 
/>
```

### SearchFilters

提供分类、排序和标签筛选功能。

#### 使用示例

```tsx
import { SearchFilters } from '@/components/search';

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
```

### SearchResultsList

显示搜索结果列表，包括加载状态和错误处理。

#### 使用示例

```tsx
import { SearchResultsList } from '@/components/search';

<SearchResultsList 
  searchResults={searchResults}
  isLoading={isLoading}
  error={error}
  getTimeAgo={formatDate}
/>
```

### RelatedTags

显示相关标签信息。

#### 使用示例

```tsx
import { RelatedTags } from '@/components/search';

<RelatedTags 
  relatedTags={relatedTags}
  getCategoryColorClasses={getColorClasses}
/>
```

## 提示词组件

### PromptContent

显示提示词内容和使用指南。

#### 使用示例

```tsx
import PromptContent from '@/components/prompt/PromptContent';

<PromptContent 
  content={promptData.content}
  usageGuide={promptData.usageGuide}
/>
```

### PromptSidebar

显示提示词相关信息，包括相关提示词、标签和统计数据。

#### 使用示例

```tsx
import PromptSidebar from '@/components/prompt/PromptSidebar';

<PromptSidebar
  relatedPrompts={relatedPrompts}
  tags={promptData.tags}
  createdAt={promptData.createdAt}
  updatedAt={promptData.updatedAt}
  viewCount={promptData.viewCount}
  favoriteCount={promptData.favoriteCount}
  categoryId={promptData.category.id}
/>
```

## 最佳实践

1. **组件复用**：尽可能复用现有组件，避免重复实现类似功能
2. **类型安全**：使用TypeScript接口定义组件props，确保类型安全
3. **国际化支持**：所有文本应使用国际化函数包装，支持多语言
4. **样式一致性**：使用项目定义的样式工具和颜色系统，保持UI一致性
5. **错误处理**：组件应包含适当的错误处理和加载状态管理
6. **响应式设计**：组件应支持不同屏幕尺寸，使用Tailwind的响应式类 