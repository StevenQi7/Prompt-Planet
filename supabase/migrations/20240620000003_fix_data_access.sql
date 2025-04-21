-- 确保数据库中的RPC函数存在并可访问

-- 1. 重新创建获取热门提示词的函数
DROP FUNCTION IF EXISTS get_featured_prompts;
CREATE OR REPLACE FUNCTION get_featured_prompts(p_limit integer, p_offset integer)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  content text,
  usage_guide text,
  category_id uuid,
  author_id uuid,
  status text,
  view_count integer,
  favorite_count integer,
  images text,
  language text,
  is_public boolean,
  created_at timestamptz,
  updated_at timestamptz,
  category jsonb,
  tags jsonb[]
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  WITH prompt_data AS (
    SELECT p.*
    FROM prompts p
    WHERE p.status = 'published' AND p.is_public = true
    ORDER BY p.view_count DESC
    LIMIT p_limit
    OFFSET p_offset
  ),
  category_data AS (
    SELECT c.id, json_build_object(
      'id', c.id,
      'name', c.name,
      'displayName', c.display_name,
      'slug', c.slug,
      'icon', c.icon,
      'color', c.color
    ) AS category_json
    FROM categories c
  ),
  tag_data AS (
    SELECT pt.prompt_id, array_agg(
      json_build_object(
        'tag', json_build_object(
          'id', t.id,
          'name', t.name,
          'displayName', t.display_name,
          'slug', t.slug,
          'color', t.color
        )
      )
    ) AS tags_json
    FROM prompt_tags pt
    JOIN tags t ON pt.tag_id = t.id
    GROUP BY pt.prompt_id
  )
  SELECT 
    p.id,
    p.title,
    p.description,
    p.content,
    p.usage_guide,
    p.category_id,
    p.author_id,
    p.status,
    p.view_count,
    p.favorite_count,
    p.images,
    p.language,
    p.is_public,
    p.created_at,
    p.updated_at,
    c.category_json AS category,
    COALESCE(t.tags_json, array[]::jsonb[]) AS tags
  FROM prompt_data p
  LEFT JOIN category_data c ON c.id = p.category_id
  LEFT JOIN tag_data t ON t.prompt_id = p.id;
END; $$;

-- 2. 重新创建获取最新提示词的函数
DROP FUNCTION IF EXISTS get_latest_prompts;
CREATE OR REPLACE FUNCTION get_latest_prompts(p_limit integer, p_offset integer)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  content text,
  usage_guide text,
  category_id uuid,
  author_id uuid,
  status text,
  view_count integer,
  favorite_count integer,
  images text,
  language text,
  is_public boolean,
  created_at timestamptz,
  updated_at timestamptz,
  category jsonb,
  tags jsonb[]
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  WITH prompt_data AS (
    SELECT p.*
    FROM prompts p
    WHERE p.status = 'published' AND p.is_public = true
    ORDER BY p.created_at DESC
    LIMIT p_limit
    OFFSET p_offset
  ),
  category_data AS (
    SELECT c.id, json_build_object(
      'id', c.id,
      'name', c.name,
      'displayName', c.display_name,
      'slug', c.slug,
      'icon', c.icon,
      'color', c.color
    ) AS category_json
    FROM categories c
  ),
  tag_data AS (
    SELECT pt.prompt_id, array_agg(
      json_build_object(
        'tag', json_build_object(
          'id', t.id,
          'name', t.name,
          'displayName', t.display_name,
          'slug', t.slug,
          'color', t.color
        )
      )
    ) AS tags_json
    FROM prompt_tags pt
    JOIN tags t ON pt.tag_id = t.id
    GROUP BY pt.prompt_id
  )
  SELECT 
    p.id,
    p.title,
    p.description,
    p.content,
    p.usage_guide,
    p.category_id,
    p.author_id,
    p.status,
    p.view_count,
    p.favorite_count,
    p.images,
    p.language,
    p.is_public,
    p.created_at,
    p.updated_at,
    c.category_json AS category,
    COALESCE(t.tags_json, array[]::jsonb[]) AS tags
  FROM prompt_data p
  LEFT JOIN category_data c ON c.id = p.category_id
  LEFT JOIN tag_data t ON t.prompt_id = p.id;
END; $$;

-- 3. 为这些函数授予公共访问权限
GRANT EXECUTE ON FUNCTION get_featured_prompts TO PUBLIC;
GRANT EXECUTE ON FUNCTION get_latest_prompts TO PUBLIC;

-- 4. 确认提示词数据的状态是否正确，并修复可能的问题
UPDATE prompts SET is_public = true WHERE is_public IS NULL;
UPDATE prompts SET status = 'published' WHERE status IS NULL;

-- 5. 确保行级安全策略正确应用
-- 检查并重新应用行级安全策略
ALTER TABLE prompts DISABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- 重新创建可能缺失的RLS策略
DROP POLICY IF EXISTS "Public prompts are viewable by everyone" ON prompts;
CREATE POLICY "Public prompts are viewable by everyone"
  ON prompts FOR SELECT
  USING (is_public = true AND status = 'published');

-- 6. 确保数据库中至少有一些可访问的提示词记录
-- 这会确保有一个完全公开的提示词记录可用于测试
INSERT INTO prompts (
  id, 
  title, 
  description, 
  content, 
  category_id, 
  author_id, 
  status, 
  is_public
)
SELECT 
  '00000000-0000-0000-0000-000000000001', 
  '测试提示词', 
  '这是一个用于测试的提示词', 
  '这是提示词的内容', 
  (SELECT id FROM categories LIMIT 1), 
  'abb95f3a-eb14-4c19-9147-6a6544ca7a3b', 
  'published', 
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM prompts WHERE status = 'published' AND is_public = TRUE
); 