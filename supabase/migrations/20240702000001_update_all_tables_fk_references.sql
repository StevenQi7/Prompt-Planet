-- 删除现有的外键约束
ALTER TABLE prompts DROP CONSTRAINT IF EXISTS prompts_author_id_fkey;
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_reviewer_id_fkey;

-- 重新添加外键约束，指向 auth.users 表
ALTER TABLE prompts ADD CONSTRAINT prompts_author_id_fkey 
  FOREIGN KEY (author_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;
  
ALTER TABLE favorites ADD CONSTRAINT favorites_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;
  
ALTER TABLE reviews ADD CONSTRAINT reviews_reviewer_id_fkey 
  FOREIGN KEY (reviewer_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- 记录迁移信息
COMMENT ON TABLE prompts IS 'Updated to use auth.users for author_id - Migration 20240702000001';
COMMENT ON TABLE favorites IS 'Updated to use auth.users for user_id - Migration 20240702000001';
COMMENT ON TABLE reviews IS 'Updated to use auth.users for reviewer_id - Migration 20240702000001'; 