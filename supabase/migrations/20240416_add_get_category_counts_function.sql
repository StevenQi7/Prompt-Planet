-- 创建函数用于获取分类提示词数量
CREATE OR REPLACE FUNCTION get_category_counts()
RETURNS TABLE (
  category_id UUID,
  count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    prompts.category_id,
    COUNT(prompts.id)::BIGINT
  FROM 
    prompts
  WHERE 
    prompts.status = 'published' AND
    prompts.is_public = true
  GROUP BY 
    prompts.category_id;
END;
$$; 