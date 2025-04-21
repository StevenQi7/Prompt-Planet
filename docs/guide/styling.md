# 样式指南

本文档提供了 Prompt Planet 项目的样式使用规范和最佳实践，确保整个应用的UI风格一致。

## 样式技术栈

Prompt Planet 使用以下技术实现样式：

- **[Tailwind CSS](https://tailwindcss.com/)**: 主要的样式框架，提供原子化的CSS类
- **全局CSS**: 用于自定义组件样式和覆盖Tailwind默认值
- **CSS变量**: 定义主题颜色和尺寸

## 设计系统

### 颜色系统

项目使用以下颜色体系：

#### 品牌色

- **主色**: `indigo-600` (#4f46e5) - 用于主要按钮、强调元素
- **次要色**: `cyan-500` (#06b6d4) - 用于次要按钮、链接
- **强调色**: `amber-500` (#f59e0b) - 用于提醒、通知

#### 功能色

- **成功**: `green-500` (#10b981)
- **警告**: `yellow-500` (#f59e0b)
- **错误**: `red-500` (#ef4444)
- **信息**: `blue-500` (#3b82f6)

#### 中性色

- **前景色**: `gray-900` (#111827) - 主要文本
- **次要前景色**: `gray-600` (#4b5563) - 次要文本
- **轻前景色**: `gray-400` (#9ca3af) - 描述文本
- **背景色**: `white` (#ffffff) - 主要背景
- **次要背景色**: `gray-50` (#f9fafb) - 卡片、面板背景
- **分隔线**: `gray-200` (#e5e7eb) - 边框、分隔线

### 字体系统

- **主要字体**: 系统默认无衬线字体，通过 `font-sans` 类使用
- **等宽字体**: 用于代码块，通过 `font-mono` 类使用

### 字体大小

- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)

### 间距系统

项目使用Tailwind的间距系统，基础单位为0.25rem (4px)：

- **0**: 0
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)

### 阴影系统

- **sm**: 轻微阴影，用于卡片
- **md**: 中等阴影，用于弹出层
- **lg**: 较大阴影，用于模态框
- **xl**: 特大阴影，用于侧边栏

## 常用样式类

### 布局类

```html
<!-- 容器 -->
<div class="container mx-auto px-4">...</div>

<!-- 弹性布局 -->
<div class="flex items-center justify-between">...</div>

<!-- 网格布局 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">...</div>

<!-- 响应式隐藏/显示 -->
<div class="hidden md:block">仅在中等及以上屏幕显示</div>
<div class="block md:hidden">仅在小屏幕显示</div>
```

### 组件样式类

#### 按钮

```html
<!-- 主要按钮 -->
<button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
  主要按钮
</button>

<!-- 次要按钮 -->
<button class="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
  次要按钮
</button>

<!-- 危险按钮 -->
<button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
  危险操作
</button>

<!-- 禁用按钮 -->
<button disabled class="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
  禁用按钮
</button>
```

#### 卡片

```html
<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
  <div class="p-4">
    <h3 class="text-lg font-medium text-gray-900">卡片标题</h3>
    <p class="mt-2 text-gray-600">卡片内容描述</p>
  </div>
  <div class="px-4 py-3 bg-gray-50 border-t border-gray-100">
    <button class="text-indigo-600 hover:text-indigo-800">查看更多</button>
  </div>
</div>
```

#### 表单元素

```html
<!-- 输入框 -->
<div class="mb-4">
  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
  <input type="email" id="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
</div>

<!-- 选择框 -->
<div class="mb-4">
  <label for="category" class="block text-sm font-medium text-gray-700 mb-1">分类</label>
  <select id="category" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
    <option value="">选择分类</option>
    <option value="1">分类一</option>
    <option value="2">分类二</option>
  </select>
</div>

<!-- 复选框 -->
<div class="flex items-center mb-4">
  <input type="checkbox" id="remember" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
  <label for="remember" class="ml-2 block text-sm text-gray-700">记住我</label>
</div>
```

## 响应式设计

项目采用移动优先的响应式设计原则，使用Tailwind的断点系统：

- **sm**: 640px及以上
- **md**: 768px及以上
- **lg**: 1024px及以上
- **xl**: 1280px及以上
- **2xl**: 1536px及以上

示例：

```html
<!-- 在小屏幕上单列，中等屏幕上双列，大屏幕上三列 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>项目1</div>
  <div>项目2</div>
  <div>项目3</div>
</div>

<!-- 响应式内边距 -->
<div class="p-4 md:p-6 lg:p-8">
  内容
</div>

<!-- 响应式字体大小 -->
<h1 class="text-2xl md:text-3xl lg:text-4xl">
  响应式标题
</h1>
```

## 自定义样式

如果Tailwind不能满足特定需求，可以使用以下方法添加自定义样式：

### 1. 使用@apply指令

在`src/styles/globals.css`中：

```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors;
  }
}
```

### 2. 扩展Tailwind配置

在`tailwind.config.js`中：

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-primary': '#4f46e5',
        'brand-secondary': '#06b6d4',
      },
      spacing: {
        '18': '4.5rem',
      },
    }
  }
}
```

## 样式最佳实践

1. **使用Tailwind类优先于自定义CSS**
   - 尽量使用Tailwind提供的原子类
   - 只在必要时编写自定义CSS

2. **保持一致性**
   - 使用文档中定义的颜色、间距和字体大小
   - 在类似的组件中使用类似的样式模式

3. **遵循移动优先原则**
   - 先为移动设备定义样式，再添加响应式变体
   - 确保所有页面在各种屏幕尺寸上都能正常显示

4. **避免内联样式**
   - 使用Tailwind类代替内联样式
   - 内联样式难以维护且不支持响应式设计

5. **组件样式抽象**
   - 将常用的样式组合封装为组件
   - 使用@apply或React组件封装重复的样式模式

6. **保持代码整洁**
   - 按照逻辑顺序组织Tailwind类
   - 将较长的类列表分成多行，提高可读性

## 图标使用

项目使用[React Icons](https://react-icons.github.io/react-icons/)库提供图标：

```jsx
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

function UserMenu() {
  return (
    <div>
      <button className="flex items-center">
        <FiUser className="mr-2" />
        个人资料
      </button>
      <button className="flex items-center">
        <FiSettings className="mr-2" />
        设置
      </button>
      <button className="flex items-center">
        <FiLogOut className="mr-2" />
        退出
      </button>
    </div>
  );
}
```

## 深色模式

项目支持深色模式，使用Tailwind的深色模式变体：

```html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  深色模式适配的内容
</div>
```

## 可访问性考虑

1. **使用足够的对比度**
   - 文本和背景之间保持足够的对比度
   - 使用Tailwind的文本颜色类确保可读性

2. **不仅依赖颜色传达信息**
   - 结合图标和文本，不仅仅使用颜色
   - 为图标添加适当的替代文本

3. **提供焦点状态**
   - 使用`:focus`和`:focus-visible`样式
   - 确保键盘导航用户可以看到当前焦点

4. **适当的文本大小**
   - 使用相对单位（rem）而非固定像素值
   - 确保文本在所有设备上都清晰可读 