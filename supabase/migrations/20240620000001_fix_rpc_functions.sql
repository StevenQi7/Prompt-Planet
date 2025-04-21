-- 修复获取热门提示词的存储过程，将 display_name 修改为 displayName
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
      'displayName', c.display_name,  -- 修改这里，使用前端期望的键名
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
          'displayName', t.display_name,  -- 修改这里，使用前端期望的键名
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

-- 修复获取最新提示词的存储过程，将 display_name 修改为 displayName
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
      'displayName', c.display_name,  -- 修改这里，使用前端期望的键名
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
          'displayName', t.display_name,  -- 修改这里，使用前端期望的键名
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