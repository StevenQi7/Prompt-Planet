-- 删除 reviews 表的外键约束
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_reviewer_id_fkey;

-- 修改 reviews 表的外键引用，指向 auth.users
ALTER TABLE reviews ADD CONSTRAINT reviews_reviewer_id_fkey 
  FOREIGN KEY (reviewer_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE; 