-- 启用 RLS
alter table prompts enable row level security;
alter table categories enable row level security;
alter table tags enable row level security;
alter table prompt_tags enable row level security;
alter table favorites enable row level security;
alter table reviews enable row level security;

-- 删除所有现有策略
drop policy if exists "Public prompts are viewable by everyone" on prompts;
drop policy if exists "Users can view their own prompts" on prompts;
drop policy if exists "Users can create prompts" on prompts;
drop policy if exists "Users can update their own prompts" on prompts;
drop policy if exists "Users can delete their own prompts" on prompts;
drop policy if exists "Users can manage their own favorites" on favorites;
drop policy if exists "Users can view public categories" on categories;
drop policy if exists "Users can view public tags" on tags;

-- Prompts 表策略
-- 1. 所有人都可以查看公开的提示词
create policy "Public prompts are viewable by everyone"
  on prompts for select
  using (is_public = true and status = 'published');

-- 2. 用户可以查看自己的所有提示词
create policy "Users can view their own prompts"
  on prompts for select
  using (auth.uid() = author_id);

-- 3. 用户可以创建提示词
create policy "Users can create prompts"
  on prompts for insert
  with check (auth.uid() = author_id);

-- 4. 用户可以更新自己的提示词
create policy "Users can update their own prompts"
  on prompts for update
  using (auth.uid() = author_id);

-- 5. 用户可以删除自己的提示词
create policy "Users can delete their own prompts"
  on prompts for delete
  using (auth.uid() = author_id);

-- Categories 表策略
-- 1. 所有人都可以查看分类
create policy "Users can view public categories"
  on categories for select
  using (true);

-- Tags 表策略
-- 1. 所有人都可以查看标签
create policy "Users can view public tags"
  on tags for select
  using (true);

-- Prompt_Tags 表策略
-- 1. 用户可以查看与自己提示词相关的标签关联
create policy "Users can view prompt tags"
  on prompt_tags for select
  using (
    exists (
      select 1 from prompts
      where prompts.id = prompt_tags.prompt_id
      and (prompts.is_public = true or prompts.author_id = auth.uid())
    )
  );

-- 2. 用户可以创建与自己提示词相关的标签关联
create policy "Users can create prompt tags"
  on prompt_tags for insert
  with check (
    exists (
      select 1 from prompts
      where prompts.id = prompt_tags.prompt_id
      and prompts.author_id = auth.uid()
    )
  );

-- 3. 用户可以删除与自己提示词相关的标签关联
create policy "Users can delete prompt tags"
  on prompt_tags for delete
  using (
    exists (
      select 1 from prompts
      where prompts.id = prompt_tags.prompt_id
      and prompts.author_id = auth.uid()
    )
  );

-- Favorites 表策略
-- 1. 用户可以查看自己的收藏
create policy "Users can view their favorites"
  on favorites for select
  using (auth.uid() = user_id);

-- 2. 用户可以创建收藏
create policy "Users can create favorites"
  on favorites for insert
  with check (auth.uid() = user_id);

-- 3. 用户可以删除自己的收藏
create policy "Users can delete their favorites"
  on favorites for delete
  using (auth.uid() = user_id);

-- Reviews 表策略
-- 1. 用户可以查看自己提示词的审核记录
create policy "Users can view their prompt reviews"
  on reviews for select
  using (
    exists (
      select 1 from prompts
      where prompts.id = reviews.prompt_id
      and prompts.author_id = auth.uid()
    )
  );

-- 2. 管理员可以创建审核记录
create policy "Admins can create reviews"
  on reviews for insert
  with check (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 3. 管理员可以更新审核记录
create policy "Admins can update reviews"
  on reviews for update
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  ); 