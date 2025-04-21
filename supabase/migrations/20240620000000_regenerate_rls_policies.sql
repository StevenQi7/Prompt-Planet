-- 先禁用所有现有的RLS策略
DROP POLICY IF EXISTS "Public prompts are viewable by everyone" ON prompts;
DROP POLICY IF EXISTS "Users can view their own prompts" ON prompts;
DROP POLICY IF EXISTS "Users can create prompts" ON prompts;
DROP POLICY IF EXISTS "Users can update their own prompts" ON prompts;
DROP POLICY IF EXISTS "Users can delete their own prompts" ON prompts;
DROP POLICY IF EXISTS "Users can view prompt tags" ON prompt_tags;
DROP POLICY IF EXISTS "Users can create prompt tags" ON prompt_tags;
DROP POLICY IF EXISTS "Users can delete prompt tags" ON prompt_tags;
DROP POLICY IF EXISTS "Users can view their favorites" ON favorites;
DROP POLICY IF EXISTS "Users can create favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete their favorites" ON favorites;
DROP POLICY IF EXISTS "Users can view their prompt reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can create reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view public categories" ON categories;
DROP POLICY IF EXISTS "Users can view public tags" ON tags;

-- 确保所有表都启用了RLS
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

----------------------
-- Prompts 表策略 --
----------------------

-- 1. 所有人都可以查看已发布且公开的提示词
CREATE POLICY "Public prompts are viewable by everyone"
  ON prompts FOR SELECT
  USING (status = 'published' AND is_public = true);

-- 2. 用户可以查看自己的所有提示词（无论状态如何）
CREATE POLICY "Users can view their own prompts"
  ON prompts FOR SELECT
  USING (auth.uid() = author_id);

-- 3. 管理员可以查看所有提示词
CREATE POLICY "Admins can view all prompts"
  ON prompts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- 4. 用户可以创建提示词（并指定自己为作者）
CREATE POLICY "Users can create prompts"
  ON prompts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- 5. 用户可以更新自己的提示词
CREATE POLICY "Users can update their own prompts"
  ON prompts FOR UPDATE
  USING (auth.uid() = author_id);

-- 6. 管理员可以更新任何提示词
CREATE POLICY "Admins can update any prompt"
  ON prompts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- 7. 用户可以删除自己的提示词
CREATE POLICY "Users can delete their own prompts"
  ON prompts FOR DELETE
  USING (auth.uid() = author_id);

-- 8. 管理员可以删除任何提示词
CREATE POLICY "Admins can delete any prompt"
  ON prompts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

----------------------
-- Categories 表策略 --
----------------------

-- 1. 所有人都可以查看分类
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- 2. 只有管理员可以创建分类
CREATE POLICY "Admins can create categories"
  ON categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- 3. 只有管理员可以更新分类
CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- 4. 只有管理员可以删除分类
CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

------------------
-- Tags 表策略 --
------------------

-- 1. 所有人都可以查看标签
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  USING (true);

-- 2. 只有管理员可以创建标签
CREATE POLICY "Admins can create tags"
  ON tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- 3. 只有管理员可以更新标签
CREATE POLICY "Admins can update tags"
  ON tags FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- 4. 只有管理员可以删除标签
CREATE POLICY "Admins can delete tags"
  ON tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

------------------------
-- Prompt_Tags 表策略 --
------------------------

-- 1. 用户可以查看任何公开提示词的标签关联，以及自己提示词的标签关联
CREATE POLICY "Users can view prompt tags"
  ON prompt_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM prompts
      WHERE prompts.id = prompt_tags.prompt_id
      AND (prompts.is_public = true AND prompts.status = 'published' OR prompts.author_id = auth.uid())
    )
  );

-- 2. 用户可以为自己的提示词创建标签关联
CREATE POLICY "Users can create prompt tags"
  ON prompt_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM prompts
      WHERE prompts.id = prompt_tags.prompt_id
      AND prompts.author_id = auth.uid()
    )
  );

-- 3. 管理员可以为任何提示词创建标签关联
CREATE POLICY "Admins can create any prompt tags"
  ON prompt_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- 4. 用户可以删除自己提示词的标签关联
CREATE POLICY "Users can delete prompt tags"
  ON prompt_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM prompts
      WHERE prompts.id = prompt_tags.prompt_id
      AND prompts.author_id = auth.uid()
    )
  );

-- 5. 管理员可以删除任何提示词的标签关联
CREATE POLICY "Admins can delete any prompt tags"
  ON prompt_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

---------------------
-- Favorites 表策略 --
---------------------

-- 1. 用户可以查看自己的收藏
CREATE POLICY "Users can view their favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- 2. 管理员可以查看所有收藏
CREATE POLICY "Admins can view all favorites"
  ON favorites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- 3. 用户可以创建自己的收藏
CREATE POLICY "Users can create favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. 用户可以删除自己的收藏
CREATE POLICY "Users can delete favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- 5. 管理员可以删除任何收藏
CREATE POLICY "Admins can delete any favorite"
  ON favorites FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-------------------
-- Reviews 表策略 --
-------------------

-- 1. 用户可以查看自己提示词的审核记录
CREATE POLICY "Users can view their prompt reviews"
  ON reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM prompts
      WHERE prompts.id = reviews.prompt_id
      AND prompts.author_id = auth.uid()
    )
  );

-- 2. 管理员可以查看所有审核记录
CREATE POLICY "Admins can view all reviews"
  ON reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- 3. 管理员可以创建审核记录
CREATE POLICY "Admins can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- 4. 管理员可以更新审核记录
CREATE POLICY "Admins can update reviews"
  ON reviews FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- 5. 管理员可以删除审核记录
CREATE POLICY "Admins can delete reviews"
  ON reviews FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  ); 