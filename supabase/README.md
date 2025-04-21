# Supabase 数据库迁移

本目录包含 Supabase 数据库迁移文件，用于创建和更新数据库结构。

## 迁移文件

- `20240416_add_get_prompt_stats_function.sql`: 添加 `get_prompt_stats()` 函数，用于快速获取提示词的统计数据。

## 部署说明

### 手动执行 SQL 

1. 登录 Supabase 管理界面
2. 进入 SQL 编辑器
3. 复制迁移文件中的 SQL 语句
4. 执行 SQL 语句

### 使用 Supabase CLI

如果你安装了 Supabase CLI，可以使用以下命令执行迁移：

```bash
supabase db push
```

## 验证函数是否正常工作

执行以下 SQL 查询来测试函数：

```sql
SELECT get_prompt_stats();
```

正常情况下，应该返回类似这样的 JSON 结构：

```json
{
  "reviewing": 10,
  "published": 25,
  "rejected": 5,
  "total": 40
}
``` 