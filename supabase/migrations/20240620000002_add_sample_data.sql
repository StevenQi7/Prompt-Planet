-- 添加示例数据到数据库

-- 添加分类数据
INSERT INTO categories (id, name, display_name, slug, icon, color, count, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'creative_writing', '创意写作', 'creative-writing', 'fa-paint-brush', 'indigo', 0, NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'coding', '代码开发', 'coding', 'fa-code', 'green', 0, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'image_generation', '图像生成', 'image-generation', 'fa-image', 'purple', 0, NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'education', '教育学习', 'education', 'fa-graduation-cap', 'yellow', 0, NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'marketing', '市场营销', 'marketing', 'fa-chart-line', 'red', 0, NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'ai_assistant', 'AI助手', 'ai-assistant', 'fa-robot', 'blue', 0, NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777', 'productivity', '生产力工具', 'productivity', 'fa-tasks', 'teal', 0, NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888', 'thinking', '思维方式', 'thinking', 'fa-brain', 'cyan', 0, NOW(), NOW());

-- 添加标签数据
INSERT INTO tags (id, name, display_name, slug, color, count, created_at, updated_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'gpt4', 'GPT-4', 'gpt4', 'green', 0, NOW(), NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'midjourney', 'Midjourney', 'midjourney', 'purple', 0, NOW(), NOW()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'chatgpt', 'ChatGPT', 'chatgpt', 'blue', 0, NOW(), NOW()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'coding', '编程', 'coding', 'indigo', 0, NOW(), NOW()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'writing', '写作', 'writing', 'pink', 0, NOW(), NOW()),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'marketing', '营销', 'marketing', 'red', 0, NOW(), NOW()),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', 'learning', '学习', 'learning', 'yellow', 0, NOW(), NOW()),
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'productivity', '效率', 'productivity', 'teal', 0, NOW(), NOW());

-- 添加提示词数据 (假设author_id来自auth.users表，这里使用占位符)
-- 注意：请替换作者ID和其他根据实际情况需要修改的内容
INSERT INTO prompts (id, title, description, content, usage_guide, category_id, author_id, status, view_count, favorite_count, images, language, is_public, created_at, updated_at)
VALUES 
  (
    'abcdef12-abcd-abcd-abcd-abcdef123456', 
    '高效的代码审查提示词', 
    '帮助开发人员进行高质量的代码审查，发现潜在的问题和改进机会。', 
    '我希望你作为一个专业的代码审查者，审查以下代码。请关注几个关键方面：\n1. 代码质量和可读性\n2. 潜在的错误和异常处理\n3. 性能优化机会\n4. 安全漏洞\n5. 测试覆盖率建议\n\n请为每个问题提供具体的改进建议，并按照严重程度（高、中、低）标记。', 
    '使用此提示词时，请粘贴您需要审查的代码。您可以指定编程语言和特定关注点，以获得更精确的反馈。', 
    '22222222-2222-2222-2222-222222222222', 
    'abb95f3a-eb14-4c19-9147-6a6544ca7a3b',  -- 替换为实际作者ID
    'published', 
    120, 
    15, 
    '[]', 
    'zh', 
    true, 
    NOW() - INTERVAL '10 days', 
    NOW() - INTERVAL '10 days'
  ),
  (
    'bcdef123-bcde-bcde-bcde-bcdef1234567', 
    'AI生成艺术风格指南', 
    '使用详细的风格描述和参考来引导AI图像生成工具创建特定风格的艺术作品。', 
    '我想要你作为一位专业艺术指导，帮助我创建下面描述的风格图像：\n\n[在此插入风格描述，如"水彩风格的山川风景"]\n\n请提供以下内容：\n1. 详细的视觉描述，包括构图、颜色、光影、纹理等要素\n2. 3-5个关键词，以增强风格特点\n3. 建议的艺术家参考，如果适用\n4. 技术参数建议（如宽高比、风格权重等）', 
    '使用此提示词时，请替换方括号中的内容，描述您想要的图像风格。您可以指定更多细节，如主题、情绪、特定元素等。', 
    '33333333-3333-3333-3333-333333333333', 
    'abb95f3a-eb14-4c19-9147-6a6544ca7a3b',  -- 替换为实际作者ID
    'published', 
    230, 
    42, 
    '[]', 
    'zh', 
    true, 
    NOW() - INTERVAL '8 days', 
    NOW() - INTERVAL '8 days'
  ),
  (
    'cdef1234-cdef-cdef-cdef-cdef12345678', 
    '学习计划生成器', 
    '根据您的目标、当前水平和可用时间，创建个性化的学习计划。', 
    '作为一位专业的学习教练，请帮我创建一个个性化的学习计划，基于以下信息：\n\n1. 学习目标：[填写您的学习目标]\n2. 当前水平：[初学者/中级/高级]\n3. 可用时间：[每天/每周可投入的小时数]\n4. 截止日期：[如果有的话]\n5. 学习风格偏好：[视觉/听觉/实践等]\n\n请提供：\n- 分阶段的详细学习路线图\n- 每个阶段的具体资源建议（书籍、课程、视频等）\n- 进度跟踪和评估方法\n- 应对挑战和倦怠的策略', 
    '使用此提示词时，请填写方括号中的信息，以获得完全个性化的学习计划。您提供的细节越多，计划就越适合您的需求。', 
    '44444444-4444-4444-4444-444444444444', 
    'abb95f3a-eb14-4c19-9147-6a6544ca7a3b',  -- 替换为实际作者ID
    'published', 
    175, 
    28, 
    '[]', 
    'zh', 
    true, 
    NOW() - INTERVAL '5 days', 
    NOW() - INTERVAL '5 days'
  ),
  (
    'def12345-def1-def1-def1-def123456789', 
    '创意写作结构模板', 
    '提供故事结构指导，帮助作家构建引人入胜的叙事。', 
    '我希望你作为一名专业的写作教练，帮助我构建一个故事。请根据以下信息提供结构化的指导：\n\n故事类型：[小说/短篇故事/剧本etc]\n故事主题：[主要主题]\n目标读者：[目标受众]\n故事长度：[预期字数]\n\n请提供：\n1. 三幕结构的详细分解，包括每幕的关键事件\n2. 主角的成长弧线\n3. 各场景之间的转换建议\n4. 适合这类故事的节奏控制技巧\n5. 5-7个可能的关键情节点\n\n还请提供一个简短的开场段落示例，展示有效的叙事声音。', 
    '使用此提示词时，请在方括号中提供您的具体信息。您也可以添加任何特定的需求，如特定的故事元素、写作风格偏好等。', 
    '11111111-1111-1111-1111-111111111111', 
    'abb95f3a-eb14-4c19-9147-6a6544ca7a3b',  -- 替换为实际作者ID 
    'published', 
    310, 
    65, 
    '[]', 
    'zh', 
    true, 
    NOW() - INTERVAL '15 days', 
    NOW() - INTERVAL '7 days'
  ),
  (
    'ef123456-ef12-ef12-ef12-ef1234567890', 
    '营销活动策划助手', 
    '帮助营销人员策划全方位的营销活动，从目标设定到执行计划和评估。', 
    '请作为一位经验丰富的营销策略顾问，帮助我设计一个全面的营销活动。基于以下信息：\n\n产品/服务：[描述]\n目标受众：[描述]\n营销目标：[提高品牌知名度/增加销售/客户留存等]\n预算范围：[预算]\n时间段：[活动持续时间]\n\n请提供：\n1. 活动概念和核心信息\n2. 针对不同渠道的内容策略（社交媒体、邮件、网站等）\n3. 时间表和里程碑\n4. 资源分配建议\n5. KPI和成功衡量标准\n6. 潜在风险和缓解策略\n\n请确保建议既有创意又切实可行。', 
    '使用此提示词时，请填写方括号中的信息，并指明您可能遇到的任何特殊限制或机会。如果有以往的营销活动数据，也可包括在内以获得更相关的建议。', 
    '55555555-5555-5555-5555-555555555555', 
    'abb95f3a-eb14-4c19-9147-6a6544ca7a3b',  -- 替换为实际作者ID
    'published', 
    145, 
    23, 
    '[]', 
    'zh', 
    true, 
    NOW() - INTERVAL '6 days', 
    NOW() - INTERVAL '6 days'
  ),
  (
    'f1234567-f123-f123-f123-f12345678901', 
    '个人AI助手设置指南', 
    '帮助用户设置个性化的AI助手，指定助手的专业领域、个性和交互风格。', 
    '我希望你帮我设计一个个性化的AI助手。请按照以下格式提供详细的设定：\n\n名称：[助手名称]\n专业领域：[助手的专业知识领域]\n个性特点：[描述助手的性格、语气和互动风格]\n背景故事：[可选，为助手提供一个简短的背景]\n\n具体能力：\n- [能力1]：[详细描述]\n- [能力2]：[详细描述]\n- [更多能力]\n\n交互规则：\n- [规则1]：[详细描述]\n- [规则2]：[详细描述]\n- [更多规则]\n\n最后，请提供一个介绍文本，这个AI助手可以用它来介绍自己，以及一个示例对话展示这个助手的专业知识和个性。', 
    '使用此提示词时，请替换方括号中的内容，描述您理想中AI助手的特质。您可以指定任何专业领域，从烹饪到量子物理，以及任何个性特点，从幽默到严肃专业。', 
    '66666666-6666-6666-6666-666666666666', 
    'abb95f3a-eb14-4c19-9147-6a6544ca7a3b',  -- 替换为实际作者ID
    'published', 
    420, 
    87, 
    '[]', 
    'zh', 
    true, 
    NOW() - INTERVAL '20 days', 
    NOW() - INTERVAL '18 days'
  ),
  (
    'a1234567-a123-a123-a123-a12345678901', 
    '工作效率优化分析师', 
    '分析您的工作流程并提供优化建议，提高效率和生产力。', 
    '作为一位工作效率优化专家，我将帮助您分析并改进工作流程。请提供以下信息：\n\n1. 当前工作流程描述：[详细描述]\n2. 主要工作任务类型：[如写作/编程/设计/管理等]\n3. 当前面临的效率瓶颈：[描述您的主要障碍]\n4. 工作环境：[远程/办公室/混合]\n5. 已使用的工具和系统：[列出关键工具]\n6. 优化目标：[节省时间/减少压力/提高产出质量等]\n\n基于您的信息，我将提供：\n- 流程改进建议\n- 推荐的工具和技术\n- 时间管理策略\n- 自动化机会\n- 可行的实施步骤和优先级排序', 
    '使用此提示词时，请详细描述您的工作模式和面临的具体挑战。越具体的信息会带来越有针对性的建议。适用于各种职业的专业人士。', 
    '77777777-7777-7777-7777-777777777777', 
    'abb95f3a-eb14-4c19-9147-6a6544ca7a3b',  -- 替换为实际作者ID
    'published', 
    265, 
    41, 
    '[]', 
    'zh', 
    true, 
    NOW() - INTERVAL '12 days', 
    NOW() - INTERVAL '12 days'
  ),
  (
    'b1234567-b123-b123-b123-b12345678901', 
    '结构化思考模板', 
    '帮助您运用逻辑思维和框架来分析复杂问题并得出清晰的结论。', 
    '作为一位结构化思考专家，我将指导您使用系统方法分析问题。请描述您需要分析的问题或决策：\n\n[问题描述]\n\n我会帮您运用以下框架进行分析：\n\n1. **问题分解**\n   - 将复杂问题拆分为较小的可管理部分\n   - 确定关键问题和子问题\n\n2. **MECE原则分析**（相互独立，完全穷尽）\n   - 创建不重叠的分析类别\n   - 确保考虑了所有可能性\n\n3. **逻辑树展开**\n   - 构建分析的逻辑结构\n   - 确定因果关系\n\n4. **假设检验**\n   - 列出核心假设\n   - 设计验证方法\n\n5. **结论与行动建议**\n   - 基于分析的明确结论\n   - 优先级排序的行动步骤\n\n针对不同类型的问题，我还可以应用其他特定框架，如SWOT分析、决策矩阵、五力分析等。', 
    '使用此提示词时，请清晰描述您需要分析的具体问题或决策。您也可以指定您特别感兴趣的思考框架或分析角度。', 
    '88888888-8888-8888-8888-888888888888', 
    'abb95f3a-eb14-4c19-9147-6a6544ca7a3b',  -- 替换为实际作者ID
    'published', 
    190, 
    32, 
    '[]', 
    'zh', 
    true, 
    NOW() - INTERVAL '9 days', 
    NOW() - INTERVAL '9 days'
  );

-- 添加提示词-标签关联
INSERT INTO prompt_tags (id, prompt_id, tag_id)
VALUES
  (uuid_generate_v4(), 'abcdef12-abcd-abcd-abcd-abcdef123456', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  (uuid_generate_v4(), 'abcdef12-abcd-abcd-abcd-abcdef123456', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  (uuid_generate_v4(), 'bcdef123-bcde-bcde-bcde-bcdef1234567', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  (uuid_generate_v4(), 'cdef1234-cdef-cdef-cdef-cdef12345678', 'gggggggg-gggg-gggg-gggg-gggggggggggg'),
  (uuid_generate_v4(), 'def12345-def1-def1-def1-def123456789', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
  (uuid_generate_v4(), 'ef123456-ef12-ef12-ef12-ef1234567890', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
  (uuid_generate_v4(), 'f1234567-f123-f123-f123-f12345678901', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  (uuid_generate_v4(), 'a1234567-a123-a123-a123-a12345678901', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh'),
  (uuid_generate_v4(), 'b1234567-b123-b123-b123-b12345678901', 'gggggggg-gggg-gggg-gggg-gggggggggggg');

-- 更新分类和标签的计数 
-- 分类计数更新
UPDATE categories
SET count = (
  SELECT COUNT(*) 
  FROM prompts 
  WHERE prompts.category_id = categories.id 
  AND prompts.status = 'published' 
  AND prompts.is_public = true
);

-- 标签计数更新
UPDATE tags
SET count = (
  SELECT COUNT(*) 
  FROM prompt_tags 
  JOIN prompts ON prompt_tags.prompt_id = prompts.id
  WHERE prompt_tags.tag_id = tags.id 
  AND prompts.status = 'published' 
  AND prompts.is_public = true
); 