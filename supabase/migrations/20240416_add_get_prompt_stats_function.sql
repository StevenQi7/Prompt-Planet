-- 创建函数用于获取提示词统计数据
CREATE OR REPLACE FUNCTION get_prompt_stats()
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  reviewing_count INTEGER;
  published_count INTEGER;
  rejected_count INTEGER;
  total_count INTEGER;
BEGIN
  -- 计算各个状态的提示词数量
  SELECT COUNT(*) INTO reviewing_count FROM prompts WHERE status = 'reviewing';
  SELECT COUNT(*) INTO published_count FROM prompts WHERE status = 'published';
  SELECT COUNT(*) INTO rejected_count FROM prompts WHERE status = 'rejected';
  
  -- 计算总数
  total_count := reviewing_count + published_count + rejected_count;
  
  -- 返回 JSON 格式的统计数据
  RETURN json_build_object(
    'reviewing', reviewing_count,
    'published', published_count,
    'rejected', rejected_count,
    'total', total_count
  );
END;
$$; 