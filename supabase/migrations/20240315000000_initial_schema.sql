-- 启用必要的扩展
create extension if not exists "uuid-ossp";

-- 创建用户表
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  nickname text,
  email text unique not null,
  phone text,
  avatar text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 创建分类表
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  display_name text not null,
  slug text unique not null,
  icon text not null,
  color text not null,
  count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 创建标签表
create table if not exists tags (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  display_name text not null,
  slug text unique not null,
  color text not null,
  count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 创建 Prompt 表
create table if not exists prompts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  content text not null,
  usage_guide text,
  category_id uuid references categories(id) on delete cascade,
  author_id uuid references users(id) on delete cascade,
  status text default 'draft',
  view_count integer default 0,
  favorite_count integer default 0,
  images text,
  language text default '',
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 创建 Prompt-Tag 关联表
create table if not exists prompt_tags (
  id uuid primary key default uuid_generate_v4(),
  prompt_id uuid references prompts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  unique(prompt_id, tag_id)
);

-- 创建收藏表
create table if not exists favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  prompt_id uuid references prompts(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, prompt_id)
);

-- 创建评论表
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  prompt_id uuid references prompts(id) on delete cascade,
  reviewer_id uuid references users(id) on delete cascade,
  status text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 创建索引
create index if not exists prompts_category_id_idx on prompts(category_id);
create index if not exists prompts_author_id_idx on prompts(author_id);
create index if not exists prompt_tags_tag_id_idx on prompt_tags(tag_id);
create index if not exists favorites_prompt_id_idx on favorites(prompt_id);
create index if not exists reviews_prompt_id_idx on reviews(prompt_id);
create index if not exists reviews_reviewer_id_idx on reviews(reviewer_id);

-- 启用 Row Level Security
alter table users enable row level security;
alter table categories enable row level security;
alter table tags enable row level security;
alter table prompts enable row level security;
alter table prompt_tags enable row level security;
alter table favorites enable row level security;
alter table reviews enable row level security;

-- 创建策略
create policy "Users can view their own data"
  on users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on users for update
  using (auth.uid() = id);

create policy "Public prompts are viewable by everyone"
  on prompts for select
  using (is_public = true);

create policy "Users can view their own prompts"
  on prompts for select
  using (auth.uid() = author_id);

create policy "Users can create prompts"
  on prompts for insert
  with check (auth.uid() = author_id);

create policy "Users can update their own prompts"
  on prompts for update
  using (auth.uid() = author_id);

create policy "Users can delete their own prompts"
  on prompts for delete
  using (auth.uid() = author_id);

create policy "Users can manage their own favorites"
  on favorites for all
  using (auth.uid() = user_id);

create policy "Users can view public categories"
  on categories for select
  using (true);

create policy "Users can view public tags"
  on tags for select
  using (true); 