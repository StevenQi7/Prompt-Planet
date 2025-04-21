-- 这个迁移文件会临时移除外键约束，以修复审核功能

-- 1. 移除 reviews 表的外键约束
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_reviewer_id_fkey;

-- 2. 添加注释
COMMENT ON TABLE reviews IS 'Reviewer_id foreign key constraint removed temporarily to fix review functionality';

-- 审核相关视图和函数
CREATE OR REPLACE FUNCTION add_review(
  p_prompt_id UUID,
  p_reviewer_id UUID,
  p_status TEXT,
  p_notes TEXT DEFAULT ''
) RETURNS VOID AS $$
BEGIN
  INSERT INTO reviews (prompt_id, reviewer_id, status, notes)
  VALUES (p_prompt_id, p_reviewer_id, p_status, p_notes);
  
  UPDATE prompts
  SET status = p_status,
      updated_at = NOW()
  WHERE id = p_prompt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 