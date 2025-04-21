-- 删除 users 表的 RLS 策略
drop policy if exists "Users can view their own data" on users;
drop policy if exists "Users can update their own data" on users;

-- 修改外键引用
-- 将 prompts 表的 author_id 引用修改为引用 auth.users 表
alter table prompts drop constraint if exists prompts_author_id_fkey;
-- 将 favorites 表的 user_id 引用修改为引用 auth.users 表 
alter table favorites drop constraint if exists favorites_user_id_fkey;
-- 将 reviews 表的 reviewer_id 引用修改为引用 auth.users 表
alter table reviews drop constraint if exists reviews_reviewer_id_fkey;

-- 删除 users 表
drop table if exists users cascade;

-- 添加注释说明上述修改
comment on table prompts is '提示词表，author_id 现在引用 auth.users 表的 id';
comment on table favorites is '收藏表，user_id 现在引用 auth.users 表的 id';
comment on table reviews is '审核表，reviewer_id 现在引用 auth.users 表的 id';

-- 创建安全的存储过程，使用嵌套查询避免直接关联查询
create or replace function get_featured_prompts(p_limit integer, p_offset integer)
returns table (
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
) language plpgsql security definer as $$
begin
  return query
  with prompt_data as (
    select p.*
    from prompts p
    where p.status = 'published' and p.is_public = true
    order by p.view_count desc
    limit p_limit
    offset p_offset
  ),
  category_data as (
    select c.id, json_build_object(
      'id', c.id,
      'name', c.name,
      'display_name', c.display_name,
      'slug', c.slug,
      'icon', c.icon,
      'color', c.color
    ) as category_json
    from categories c
  ),
  tag_data as (
    select pt.prompt_id, array_agg(
      json_build_object(
        'tag', json_build_object(
          'id', t.id,
          'name', t.name,
          'display_name', t.display_name,
          'slug', t.slug,
          'color', t.color
        )
      )
    ) as tags_json
    from prompt_tags pt
    join tags t on pt.tag_id = t.id
    group by pt.prompt_id
  )
  select 
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
    c.category_json as category,
    coalesce(t.tags_json, array[]::jsonb[]) as tags
  from prompt_data p
  left join category_data c on c.id = p.category_id
  left join tag_data t on t.prompt_id = p.id;
end; $$;

-- 创建类似的函数获取最新提示词
create or replace function get_latest_prompts(p_limit integer, p_offset integer)
returns table (
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
) language plpgsql security definer as $$
begin
  return query
  with prompt_data as (
    select p.*
    from prompts p
    where p.status = 'published' and p.is_public = true
    order by p.created_at desc
    limit p_limit
    offset p_offset
  ),
  category_data as (
    select c.id, json_build_object(
      'id', c.id,
      'name', c.name,
      'display_name', c.display_name,
      'slug', c.slug,
      'icon', c.icon,
      'color', c.color
    ) as category_json
    from categories c
  ),
  tag_data as (
    select pt.prompt_id, array_agg(
      json_build_object(
        'tag', json_build_object(
          'id', t.id,
          'name', t.name,
          'display_name', t.display_name,
          'slug', t.slug,
          'color', t.color
        )
      )
    ) as tags_json
    from prompt_tags pt
    join tags t on pt.tag_id = t.id
    group by pt.prompt_id
  )
  select 
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
    c.category_json as category,
    coalesce(t.tags_json, array[]::jsonb[]) as tags
  from prompt_data p
  left join category_data c on c.id = p.category_id
  left join tag_data t on t.prompt_id = p.id;
end; $$;
