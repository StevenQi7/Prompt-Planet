import { createClient } from '@/lib/supabase-server';
import { Database } from '@/types/supabase';

// 类型定义
type PromptTag = {
  tag_id: string;
};

type TagId = string;

// 获取推荐提示词（首页展示用）
export async function getFeaturedPrompts(limit = 8, page = 1, language?: string) {
  try {
    // 获取 Supabase 客户端
    const supabase = createClient();
    
    // 计算跳过的数量
    const from = (page - 1) * limit;
    
    // 构建基本查询，按浏览量排序
    let query = supabase
      .from('prompts')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .eq('is_public', true)
      .order('view_count', { ascending: false });
      
    // 如果指定了语言，添加语言筛选条件
    if (language) {
      // 如果language为zh或未设置时，允许查询language为null的提示词
      if (language === 'zh') {
        query = query.or(`language.eq.${language},language.is.null`);
      } else {
        query = query.eq('language', language);
      }
    }
    
    // 应用分页
    query = query.range(from, from + limit - 1);
    
    // 执行查询
    const { data: basicData, error: basicError, count: basicCount } = await query;
    
    if (basicError) {
      throw basicError;
    }
    
    if (!basicData || basicData.length === 0) {
      return {
        prompts: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }
    
    // 收集所有作者ID
    const authorIds = [...new Set(basicData.map(prompt => prompt.author_id))];
    
    // 获取所有作者的资料
    const { data: authorProfiles, error: authorError } = await supabase
      .from('profiles')
      .select('id, username, nickname, avatar')
      .in('id', authorIds);
    
    if (authorError) {
      throw authorError;
    }
    
    // 创建作者ID到资料的映射
    const authorMap = new Map();
    if (authorProfiles) {
      authorProfiles.forEach(profile => {
        authorMap.set(profile.id, profile);
      });
    }
    
    // 为每个提示词查询分类和标签
    const prompts = await Promise.all(basicData.map(async (prompt: Database['public']['Tables']['prompts']['Row']) => {
      // 获取分类
      const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('id', prompt.category_id)
        .single();
        
      // 获取标签
      const { data: promptTags } = await supabase
        .from('prompt_tags')
        .select('tag_id')
        .eq('prompt_id', prompt.id);
        
      let tags = [];
      if (promptTags && promptTags.length > 0) {
        const tagIds = promptTags.map((pt: { tag_id: string }) => pt.tag_id);
        const { data: tagsData } = await supabase
          .from('tags')
          .select('*')
          .in('id', tagIds);
          
        tags = tagsData || [];
      }
      
      // 获取作者资料
      const authorProfile = authorMap.get(prompt.author_id);
      
      // 确保字段名称与前端组件中定义的接口匹配
      return {
        ...prompt,
        viewCount: prompt.view_count,
        favoriteCount: prompt.favorite_count,
        createdAt: prompt.created_at,
        updatedAt: prompt.updated_at,
        categoryId: prompt.category_id,
        authorId: prompt.author_id,
        isPublic: prompt.is_public,
        usageGuide: prompt.usage_guide,
        images: prompt.images ? JSON.parse(prompt.images) : [],
        category: {
          ...category,
          displayName: category.display_name
        },
        tags: tags.map((tag: any) => ({ 
          tag: {
            ...tag,
            displayName: tag.display_name
          } 
        })),
        author: {
          id: prompt.author_id,
          username: authorProfile?.username || '',
          nickname: authorProfile?.nickname || '',
          avatar: authorProfile?.avatar || ''
        }
      };
    }));
    
    // 计算总页数
    const total = basicCount || 0;
    const totalPages = Math.ceil(total / limit);
    
    return {
      prompts,
      total,
      page,
      limit,
      totalPages
    };
  } catch (error) {
    throw error;
  }
}

// 获取最新提示词
export async function getLatestPrompts(limit = 8, page = 1, language?: string) {
  try {
    // 获取 Supabase 客户端
    const supabase = createClient();
    
    // 计算分页参数
    const from = (page - 1) * limit;
    
    // 构建基本查询
    let query = supabase
      .from('prompts')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .eq('is_public', true)
      .order('created_at', { ascending: false });
      
    // 如果指定了语言，添加语言筛选条件
    if (language) {
      // 如果language为zh或未设置时，允许查询language为null的提示词
      if (language === 'zh') {
        query = query.or(`language.eq.${language},language.is.null`);
      } else {
        query = query.eq('language', language);
      }
    }
    
    // 应用分页
    query = query.range(from, from + limit - 1);
    
    // 执行查询
    const { data: basicData, error: basicError, count: basicCount } = await query;
    
    if (basicError) {
      throw basicError;
    }
    
    if (!basicData || basicData.length === 0) {
      return {
        prompts: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }
    
    // 收集所有作者ID
    const authorIds = [...new Set(basicData.map(prompt => prompt.author_id))];
    
    // 获取所有作者的资料
    const { data: authorProfiles, error: authorError } = await supabase
      .from('profiles')
      .select('id, username, nickname, avatar')
      .in('id', authorIds);
    
    if (authorError) {
      throw authorError;
    }
    
    // 创建作者ID到资料的映射
    const authorMap = new Map();
    if (authorProfiles) {
      authorProfiles.forEach(profile => {
        authorMap.set(profile.id, profile);
      });
    }
    
    // 为每个提示词查询分类和标签
    const prompts = await Promise.all(basicData.map(async (prompt: Database['public']['Tables']['prompts']['Row']) => {
      // 获取分类
      const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('id', prompt.category_id)
        .single();
        
      // 获取标签
      const { data: promptTags } = await supabase
        .from('prompt_tags')
        .select('tag_id')
        .eq('prompt_id', prompt.id);
        
      let tags = [];
      if (promptTags && promptTags.length > 0) {
        const tagIds = promptTags.map((pt: { tag_id: string }) => pt.tag_id);
        const { data: tagsData } = await supabase
          .from('tags')
          .select('*')
          .in('id', tagIds);
          
        tags = tagsData || [];
      }
      
      // 获取作者资料
      const authorProfile = authorMap.get(prompt.author_id);
      
      // 确保字段名称与前端组件中定义的接口匹配
      return {
        ...prompt,
        viewCount: prompt.view_count,
        favoriteCount: prompt.favorite_count,
        createdAt: prompt.created_at,
        updatedAt: prompt.updated_at,
        categoryId: prompt.category_id,
        authorId: prompt.author_id,
        isPublic: prompt.is_public,
        usageGuide: prompt.usage_guide,
        images: prompt.images ? JSON.parse(prompt.images) : [],
        category: {
          ...category,
          displayName: category.display_name
        },
        tags: tags.map((tag: any) => ({ 
          tag: {
            ...tag,
            displayName: tag.display_name
          } 
        })),
        author: {
          id: prompt.author_id,
          username: authorProfile?.username || '',
          nickname: authorProfile?.nickname || '',
          avatar: authorProfile?.avatar || ''
        }
      };
    }));
    
    // 计算总页数
    const total = basicCount || 0;
    const totalPages = Math.ceil(total / limit);
    
    return {
      prompts,
      total,
      page,
      limit,
      totalPages
    };
  } catch (error) {
    throw error;
  }
}

// 根据ID获取提示词
export async function getPromptById(id: string) {
  try {
    const supabase = createClient();
    
    // 查询提示词
    const { data: prompt, error } = await supabase
      .from('prompts')
      .select(`
        *,
        category:categories(*),
        tags:prompt_tags(
          tag:tags(*)
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    if (!prompt) {
      return null;
    }
    
    // 如果提示词已发布，更新浏览量
    if (prompt.status === 'published') {
      const { error: updateError } = await supabase
        .from('prompts')
        .update({ view_count: prompt.view_count + 1 })
        .eq('id', id);
        
      if (updateError) {
        throw updateError;
      }
    }
    
    // 获取作者信息从 profiles 表
    const { data: authorProfile, error: authorError } = await supabase
      .from('profiles')
      .select('id, username, nickname, avatar')
      .eq('id', prompt.author_id)
      .single();
    
    if (authorError) {
      throw authorError;
    }
    
    // 处理提示词数据
    const result = {
      ...prompt,
      viewCount: prompt.view_count,
      favoriteCount: prompt.favorite_count,
      createdAt: prompt.created_at,
      updatedAt: prompt.updated_at,
      categoryId: prompt.category_id,
      authorId: prompt.author_id,
      isPublic: prompt.is_public,
      usageGuide: prompt.usage_guide,
      images: prompt.images ? JSON.parse(prompt.images) : [],
      category: prompt.category ? {
        ...prompt.category,
        displayName: prompt.category?.display_name || ''
      } : null,
      tags: prompt.tags ? prompt.tags.map((tag: any) => ({
        tag: tag.tag ? {
          ...tag.tag,
          displayName: tag.tag?.display_name || ''
        } : null
      })) : [],
      author: {
        id: prompt.author_id,
        username: authorProfile?.username || '',
        nickname: authorProfile?.nickname || '',
        avatar: authorProfile?.avatar || '',
        email: '' // 不返回邮箱信息
      }
    };
    
    return result;
  } catch (error) {
    throw error;
  }
}

// 搜索提示词
export async function searchPrompts(params: {
  query?: string;
  categoryId?: string;
  categoryIds?: string[];
  tagId?: string;
  tagIds?: string[];
  lang?: string;
  page?: number;
  limit?: number;
  sortBy?: 'latest' | 'popular' | 'relevance';
  status?: string;
  exclude?: string;
}) {
  try {
    const supabase = createClient();
    
    // 计算分页
    const page = params.page || 1;
    const limit = params.limit || 9;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // 如果有标签筛选，需要先获取符合条件的提示词ID
    let filteredPromptIds: string[] | null = null;
    if (params.tagId || (params.tagIds && params.tagIds.length > 0)) {
      // 确定需要过滤的标签ID
      const tagsToFilter: string[] = params.tagId 
        ? [params.tagId] 
        : (params.tagIds || []);
      
      // 第一步：获取包含指定标签的提示词ID
      const { data: promptTagsData, error: promptTagsError } = await supabase
        .from('prompt_tags')
        .select('prompt_id')
        .in('tag_id', tagsToFilter);
        
      if (promptTagsError) throw promptTagsError;
      
      if (!promptTagsData || promptTagsData.length === 0) {
        // 如果没有找到匹配的提示词，直接返回空结果
        return {
          prompts: [],
          total: 0,
          page,
          limit,
          totalPages: 0
        };
      }
      
      // 获取所有匹配的提示词ID
      filteredPromptIds = [...new Set(promptTagsData.map(item => item.prompt_id))];
    }
    
    // 构建查询
    let query = supabase
      .from('prompts')
      .select(`
        *,
        category:categories(*),
        tags:prompt_tags(
          tag:tags(*)
        )
      `, { count: 'exact' })
      .eq('is_public', true)
      .range(from, to);

    // 如果有标签过滤条件，添加ID筛选
    if (filteredPromptIds) {
      query = query.in('id', filteredPromptIds);
    }

    // 根据排序参数设置排序方式
    switch (params.sortBy) {
      case 'latest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popular':
        query = query.order('view_count', { ascending: false });
        break;
      case 'relevance':
      default:
        if (params.query) {
          // 如果有搜索词，正确实现多列LIKE查询
          const searchPattern = `%${params.query}%`;
          
          // 使用Supabase的标准模式构建OR查询
          query = query.or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
            .order('view_count', { ascending: false }); // 次要排序依据：浏览量
        } else {
          // 没有搜索词时，默认按创建时间排序
          query = query.order('created_at', { ascending: false });
        }
        break;
    }
    
    // 排除特定提示词
    if (params.exclude) {
      query = query.neq('id', params.exclude);
    }
    
    // 根据状态筛选
    if (params.status) {
      query = query.eq('status', params.status);
    }
    
    // 根据分类筛选
    if (params.categoryId) {
      query = query.eq('category_id', params.categoryId);
    }
    
    // 根据多个分类筛选
    if (params.categoryIds && params.categoryIds.length > 0) {
      query = query.in('category_id', params.categoryIds);
    }
    
    // 根据语言筛选
    if (params.lang) {
      // 如果language为zh或未设置时，允许查询language为null的提示词
      if (params.lang === 'zh') {
        query = query.or(`language.eq.${params.lang},language.is.null`);
      } else {
        query = query.eq('language', params.lang);
      }
    }
    
    // 执行查询
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    if (!data) {
      return {
        prompts: [],
        total: 0,
        page,
        limit
      };
    }
    
    // 收集所有作者ID
    const authorIds = [...new Set(data.map(prompt => prompt.author_id))];
    
    // 获取所有作者的资料
    const { data: authorProfiles, error: authorError } = await supabase
      .from('profiles')
      .select('id, username, nickname, avatar')
      .in('id', authorIds);
    
    if (authorError) {
      throw authorError;
    }
    
    // 创建作者ID到资料的映射
    const authorMap = new Map();
    if (authorProfiles) {
      authorProfiles.forEach(profile => {
        authorMap.set(profile.id, profile);
      });
    }
    
    // 处理提示词数据
    const prompts = data.map(prompt => {
      const authorProfile = authorMap.get(prompt.author_id);
      
      return {
        ...prompt,
        viewCount: prompt.view_count,
        favoriteCount: prompt.favorite_count,
        createdAt: prompt.created_at,
        updatedAt: prompt.updated_at,
        categoryId: prompt.category_id,
        authorId: prompt.author_id,
        isPublic: prompt.is_public,
        usageGuide: prompt.usage_guide,
        images: prompt.images ? JSON.parse(prompt.images) : [],
        category: {
          ...prompt.category,
          displayName: prompt.category.display_name
        },
        tags: prompt.tags.map((tag: any) => ({
          tag: {
            ...tag.tag,
            displayName: tag.tag.display_name
          }
        })),
        author: {
          id: prompt.author_id,
          username: authorProfile?.username || '',
          nickname: authorProfile?.nickname || '',
          avatar: authorProfile?.avatar || ''
        }
      };
    });
    
    // 计算总页数
    const total = count || 0;
    const totalPages = Math.ceil(total / limit);
    
    return {
      prompts,
      total,
      page,
      limit,
      totalPages
    };
  } catch (error) {
    console.error('searchPrompts 执行失败:', error);
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      if (error.stack) {
        console.error('堆栈跟踪:', error.stack);
      }
    }
    throw error;
  }
}

// 创建提示词
export async function createPrompt(promptData: {
  title: string;
  description: string;
  content: string;
  usageGuide?: string;
  categoryId: string;
  authorId: string;
  tags?: string[];
  images?: string[];
  language?: string;
  isPublic?: boolean;
}) {
  try {
    const { tags, images, ...data } = promptData;
    const supabase = createClient();
    
    // 验证图片URL数组
    let imageUrls: string[] | null = null;
    if (images && Array.isArray(images) && images.length > 0) {
      // 过滤掉无效URL
      imageUrls = images.filter(url => typeof url === 'string' && url.trim().length > 0);
      
      // 如果没有有效URL，则设为null
      if (imageUrls.length === 0) {
        imageUrls = null;
      }
    }
    
    // 非公开提示词直接设置为published状态，无需审核
    // 公开提示词设置为reviewing状态，需要管理员审核
    const status = data.isPublic ? 'reviewing' : 'published';
    
    // 创建提示词
    const { data: prompt, error } = await supabase
      .from('prompts')
      .insert({
        title: data.title,
        description: data.description,
        content: data.content,
        usage_guide: data.usageGuide || null,
        category_id: data.categoryId,
        author_id: data.authorId,
        language: data.language || 'zh',
        is_public: data.isPublic !== undefined ? data.isPublic : true,
        images: imageUrls ? JSON.stringify(imageUrls) : null,
        status: status
      })
      .select('*')
      .single();

    if (error) throw error;
    if (!prompt) throw new Error('创建提示词失败');

    // 关联标签
    if (tags && tags.length > 0) {
      const promptTagInserts = tags.map((tagId: string) => ({
        prompt_id: prompt.id,
        tag_id: tagId
      }));
      
      const { error: tagsError } = await supabase
        .from('prompt_tags')
        .insert(promptTagInserts);
        
      if (tagsError) {
        throw tagsError;
      }

      // 只有当状态为published时才更新标签计数
      if (status === 'published') {
        for (const tagId of tags) {
          // 先获取当前计数
          const { data: tagData, error: getTagError } = await supabase
            .from('tags')
            .select('count')
            .eq('id', tagId)
            .single();
            
          if (!getTagError && tagData) {
            // 更新计数
            const { error: updateTagError } = await supabase
              .from('tags')
              .update({ count: tagData.count + 1 })
              .eq('id', tagId);
              
            if (updateTagError) {
              throw updateTagError;
            }
          }
        }
      }
    }

    // 只有当状态为published时才更新分类计数
    if (status === 'published') {
      // 先获取当前计数
      const { data: categoryData, error: getCategoryError } = await supabase
        .from('categories')
        .select('count')
        .eq('id', data.categoryId)
        .single();
        
      if (!getCategoryError && categoryData) {
        // 更新计数
        const { error: updateCategoryError } = await supabase
          .from('categories')
          .update({ count: categoryData.count + 1 })
          .eq('id', data.categoryId);
          
        if (updateCategoryError) {
          throw updateCategoryError;
        }
      }
    }

    return {
      ...prompt,
      images: imageUrls || []
    };
  } catch (error) {
    throw error;
  }
}

// 更新提示词
export async function updatePrompt(
  id: string,
  promptData: {
    title?: string;
    description?: string;
    content?: string;
    usageGuide?: string;
    categoryId?: string;
    tags?: string[];
    images?: string[];
    language?: string;
    isPublic?: boolean;
    status?: string;
  },
  userId: string
) {
  try {
    const supabase = createClient();
    
    // 检查提示词是否存在，以及当前用户是否有权限修改
    const { data: existingPrompt, error: getPromptError } = await supabase
      .from('prompts')
      .select(`
        *,
        tags:prompt_tags(tag_id)
      `)
      .eq('id', id)
      .single();

    if (getPromptError || !existingPrompt) {
      throw new Error('提示词不存在');
    }

    // 检查用户权限
    if (existingPrompt.author_id !== userId) {
      throw new Error('无权修改此提示词');
    }

    const { tags, images, categoryId, isPublic, ...updateData } = promptData;
    
    // 处理图片URL数组
    let imageUrls = existingPrompt.images;
    if (images !== undefined) {
      if (images && Array.isArray(images) && images.length > 0) {
        // 过滤掉无效URL
        const validUrls = images.filter(url => typeof url === 'string' && url.trim().length > 0);
        imageUrls = validUrls.length > 0 ? JSON.stringify(validUrls) : null;
      } else {
        imageUrls = null;
      }
    }
    
    // 保存原状态和更新后的状态，用于计数逻辑
    const oldStatus = existingPrompt.status;
    const newStatus = updateData.status || oldStatus;
    
    // 准备更新数据
    const updateFields: any = {
      ...updateData,
      images: imageUrls
    };
    
    // 如果提供了 isPublic 字段
    if (isPublic !== undefined) {
      updateFields.is_public = isPublic;
    }
    
    // 如果更新了分类
    if (categoryId && categoryId !== existingPrompt.category_id) {
      updateFields.category_id = categoryId;
      
      // 处理原分类计数
      if (oldStatus === 'published') {
        // 如果原来是已发布状态，减少原分类计数
        const { data: oldCategory } = await supabase
          .from('categories')
          .select('count')
          .eq('id', existingPrompt.category_id)
          .single();
          
        if (oldCategory) {
          await supabase
            .from('categories')
            .update({ count: Math.max(0, oldCategory.count - 1) })
            .eq('id', existingPrompt.category_id);
        }
      }

      // 处理新分类计数
      if (newStatus === 'published') {
        // 如果新状态是已发布状态，增加新分类计数
        const { data: newCategory } = await supabase
          .from('categories')
          .select('count')
          .eq('id', categoryId)
          .single();
          
        if (newCategory) {
          await supabase
            .from('categories')
            .update({ count: newCategory.count + 1 })
            .eq('id', categoryId);
        }
      }
    } else if (oldStatus !== newStatus) {
      // 如果只是状态变化了，但分类没变
      if (oldStatus !== 'published' && newStatus === 'published') {
        // 从未发布变为已发布，增加分类计数
        const { data: category } = await supabase
          .from('categories')
          .select('count')
          .eq('id', existingPrompt.category_id)
          .single();
          
        if (category) {
          await supabase
            .from('categories')
            .update({ count: category.count + 1 })
            .eq('id', existingPrompt.category_id);
        }
      } else if (oldStatus === 'published' && newStatus !== 'published') {
        // 从已发布变为未发布，减少分类计数
        const { data: category } = await supabase
          .from('categories')
          .select('count')
          .eq('id', existingPrompt.category_id)
          .single();
          
        if (category) {
          await supabase
            .from('categories')
            .update({ count: Math.max(0, category.count - 1) })
            .eq('id', existingPrompt.category_id);
        }
      }
    }

    // 更新提示词
    const { data: updatedPrompt, error: updateError } = await supabase
      .from('prompts')
      .update(updateFields)
      .eq('id', id)
      .select('*')
      .single();
      
    if (updateError) throw updateError;
    if (!updatedPrompt) throw new Error('更新提示词失败');

    // 如果更新了标签
    if (tags) {
      // 获取当前标签ID列表
      const currentTagIds = existingPrompt.tags.map((pt: PromptTag) => pt.tag_id);
      
      // 需要移除的标签
      const tagIdsToRemove = currentTagIds.filter((tagId: string) => !tags.includes(tagId));
      
      // 需要添加的标签
      const tagIdsToAdd = tags.filter((tagId: string) => !currentTagIds.includes(tagId));

      // 删除已移除的标签关联
      if (tagIdsToRemove.length > 0) {
        const { error: deleteTagsError } = await supabase
          .from('prompt_tags')
          .delete()
          .eq('prompt_id', id)
          .in('tag_id', tagIdsToRemove);
          
        if (deleteTagsError) {
          throw deleteTagsError;
        }

        // 更新标签计数 - 只有在原状态为published时才减少
        if (oldStatus === 'published') {
          for (const tagId of tagIdsToRemove) {
            const { data: tag } = await supabase
              .from('tags')
              .select('count')
              .eq('id', tagId)
              .single();
              
            if (tag) {
              await supabase
                .from('tags')
                .update({ count: Math.max(0, tag.count - 1) })
                .eq('id', tagId);
            }
          }
        }
      }

      // 添加新标签关联
      if (tagIdsToAdd.length > 0) {
        const newTagRelations = tagIdsToAdd.map((tagId: string) => ({
          prompt_id: id,
          tag_id: tagId
        }));
        
        const { error: addTagsError } = await supabase
          .from('prompt_tags')
          .insert(newTagRelations);
          
        if (addTagsError) {
          throw addTagsError;
        }

        // 更新标签计数 - 只有在新状态为published时才增加
        if (newStatus === 'published') {
          for (const tagId of tagIdsToAdd) {
            const { data: tag } = await supabase
              .from('tags')
              .select('count')
              .eq('id', tagId)
              .single();
              
            if (tag) {
              await supabase
                .from('tags')
                .update({ count: tag.count + 1 })
                .eq('id', tagId);
            }
          }
        }
      }
    } else if (oldStatus !== newStatus) {
      // 如果只是状态变化了，但标签没变
      const { data: promptTags } = await supabase
        .from('prompt_tags')
        .select('tag_id')
        .eq('prompt_id', id);
        
      if (promptTags && promptTags.length > 0) {
        const existingTagIds = promptTags.map((pt: {tag_id: string}) => pt.tag_id);
        
        if (oldStatus !== 'published' && newStatus === 'published') {
          // 从未发布变为已发布，增加所有标签计数
          for (const tagId of existingTagIds) {
            const { data: tag } = await supabase
              .from('tags')
              .select('count')
              .eq('id', tagId)
              .single();
              
            if (tag) {
              await supabase
                .from('tags')
                .update({ count: tag.count + 1 })
                .eq('id', tagId);
            }
          }
        } else if (oldStatus === 'published' && newStatus !== 'published') {
          // 从已发布变为未发布，减少所有标签计数
          for (const tagId of existingTagIds) {
            const { data: tag } = await supabase
              .from('tags')
              .select('count')
              .eq('id', tagId)
              .single();
              
            if (tag) {
              await supabase
                .from('tags')
                .update({ count: Math.max(0, tag.count - 1) })
                .eq('id', tagId);
            }
          }
        }
      }
    }

    // 确保返回的images是数组
    let parsedImages: string[] = [];
    if (updatedPrompt.images) {
      try {
        parsedImages = JSON.parse(updatedPrompt.images);
        if (!Array.isArray(parsedImages)) {
          parsedImages = [];
        }
      } catch (error) {
        throw error;
      }
    }

    return {
      ...updatedPrompt,
      images: parsedImages
    };
  } catch (error) {
    throw error;
  }
}

// 获取用户创建的提示词
export async function getUserPrompts(
  userId: string, 
  status?: string, 
  page = 1, 
  limit = 5,
  isPrivate?: boolean,
  includeReviews: boolean = true  // 默认包含审核信息
) {
  try {
    const supabase = createClient();
    
    // 计算跳过的数量
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // 构建查询
    let query = supabase
      .from('prompts')
      .select(`
        *,
        category:categories(*),
        tags:prompt_tags(
          tag:tags(*)
        )
      `, { count: 'exact' })
      .eq('author_id', userId);

    // 专门处理私密提示词筛选
    if (isPrivate === true) {
      query = query.eq('is_public', false);
    } 
    // 专门处理特定状态的筛选，只用于公开提示词
    else if (status) {
      query = query.eq('status', status)
                  .eq('is_public', true);
    }
    
    // 添加排序和分页
    query = query.order('created_at', { ascending: false })
                .range(from, to);
    
    // 执行查询
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    if (!data) {
      return {
        prompts: [],
        total: 0,
        page,
        limit
      };
    }
    
    // 获取作者资料
    const { data: authorProfile, error: authorError } = await supabase
      .from('profiles')
      .select('id, username, nickname, avatar')
      .eq('id', userId)
      .single();
    
    if (authorError) {
      throw authorError;
    }
    
    // 处理提示词数据
    const prompts = data.map(prompt => {
      return {
        ...prompt,
        images: prompt.images ? JSON.parse(prompt.images) : [],
        category: prompt.category ? {
          ...prompt.category,
          displayName: prompt.category?.display_name || ''
        } : null,
        tags: prompt.tags ? prompt.tags.map((tag: any) => ({
          tag: tag.tag ? {
            ...tag.tag,
            displayName: tag.tag?.display_name || ''
          } : null
        })) : [],
        author: {
          id: userId,
          username: authorProfile?.username || '',
          nickname: authorProfile?.nickname || '',
          avatar: authorProfile?.avatar || ''
        },
        _count: {
          favorites: 0 // 暂时不获取收藏数
        }
      };
    });
    
    return {
      prompts,
      total: count || 0,
      page,
      limit
    };
  } catch (error) {
    throw error;
  }
}

// 收藏提示词
export async function favoritePrompt(userId: string, promptId: string) {
  try {
    const supabase = createClient();
    
    // 查询现有收藏
    const { data: existingFavorite, error: queryError } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('prompt_id', promptId)
      .maybeSingle();
    
    if (queryError) throw queryError;
    
    // 查询当前提示词的收藏数
    const { data: prompt, error: promptError } = await supabase
      .from('prompts')
      .select('favorite_count')
      .eq('id', promptId)
      .single();
      
    if (promptError) throw promptError;
    
    if (existingFavorite) {
      // 已收藏，取消收藏
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('prompt_id', promptId);
      
      if (deleteError) throw deleteError;
      
      // 直接减少收藏计数
      const { error: updateError } = await supabase
        .from('prompts')
        .update({ favorite_count: Math.max(0, prompt.favorite_count - 1) })
        .eq('id', promptId);
      
      if (updateError) throw updateError;
      
      return { favorited: false };
    } else {
      // 未收藏，添加收藏
      const { error: insertError } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          prompt_id: promptId
        });
      
      if (insertError) throw insertError;
      
      // 直接增加收藏计数
      const { error: updateError } = await supabase
        .from('prompts')
        .update({ favorite_count: prompt.favorite_count + 1 })
        .eq('id', promptId);
      
      if (updateError) throw updateError;
      
      return { favorited: true };
    }
  } catch (error) {
    throw error;
  }
}

// 获取用户收藏的提示词
export async function getUserFavorites(userId: string) {
  try {
    const supabase = createClient();
    
    // 查询收藏记录
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        prompt:prompts!inner(
          *,
          category:categories(*),
          tags:prompt_tags!inner(
            tag:tags(*)
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // 处理收藏记录
    return data.map(favorite => {
      const { prompt, ...rest } = favorite;
      return {
        ...rest,
        prompt: {
          ...prompt,
          images: prompt.images ? JSON.parse(prompt.images) : [],
          author: {
            id: prompt.author_id,
            username: '',
            nickname: '',
            avatar: ''
          }
        }
      };
    });
  } catch (error) {
    throw error;
  }
}

// 获取管理员审核提示词列表
export async function getAdminReviewPrompts({
  status = 'reviewing',
  page = 1,
  limit = 10,
  categoryId,
}: {
  status: string;
  page: number;
  limit: number;
  categoryId?: string;
}) {
  try {
    const supabase = createClient();
    
    // 计算分页
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // 构建查询
    let query = supabase
      .from('prompts')
      .select(`
        *,
        category:categories(*),
        tags:prompt_tags(
          tag:tags(*)
        ),
        reviews(*)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    
    // 根据状态筛选
    if (status !== 'all') {
      query = query.eq('status', status);
    }
    
    // 根据分类筛选
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    // 执行查询
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    if (!data) {
      return {
        prompts: [],
        total: 0,
        page,
        limit
      };
    }
    
    // 收集所有作者ID
    const authorIds = [...new Set(data.map(prompt => prompt.author_id))];
    
    // 获取所有作者的资料
    const { data: authors, error: authorError } = await supabase
      .from('profiles')
      .select('id, username, nickname, avatar')
      .in('id', authorIds);
    
    if (authorError) {
      throw authorError;
    }
    
    // 创建作者ID到资料的映射
    const authorMap = new Map();
    if (authors) {
      authors.forEach(profile => {
        authorMap.set(profile.id, profile);
      });
    }
    
    // 处理数据
    const prompts = data.map(prompt => {
      // 获取作者信息
      const author = authorMap.get(prompt.author_id) || {
        id: prompt.author_id,
        username: '',
        nickname: '',
        avatar: ''
      };
      
      // 确保 prompt 对象上存在我们需要的属性
      return {
        ...prompt,
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        content: prompt.content,
        status: prompt.status,
        viewCount: prompt.view_count,
        favoriteCount: prompt.favorite_count,
        createdAt: prompt.created_at,
        updatedAt: prompt.updated_at,
        categoryId: prompt.category_id,
        authorId: prompt.author_id,
        isPublic: prompt.is_public,
        usageGuide: prompt.usage_guide,
        category: prompt.category ? {
          ...prompt.category,
          displayName: prompt.category?.display_name || ''
        } : null,
        tags: prompt.tags?.map((tag: any) => ({
          tag: tag.tag ? {
            ...tag.tag,
            displayName: tag.tag?.display_name || ''
          } : null
        })) || [],
        reviews: prompt.reviews || [],
        images: prompt.images ? JSON.parse(prompt.images) : [],
        author: {
          id: prompt.author_id,
          username: author.username || '',
          nickname: author.nickname || '',
          avatar: author.avatar || ''
        }
      };
    });
    
    return {
      prompts,
      total: count || 0,
      page,
      limit
    };
  } catch (error) {
    throw error;
  }
}

// 更新提示词审核状态
export async function updatePromptStatus({
  promptId,
  reviewerId,
  status,
  notes = ''
}: {
  promptId: string;
  reviewerId: string;
  status: string;
  notes: string;
}) {
  try {
    const supabase = createClient();
    
    // 获取提示词
    const { data: prompt, error: getPromptError } = await supabase
      .from('prompts')
      .select(`
        *,
        tags:prompt_tags(tag_id)
      `)
      .eq('id', promptId)
      .single();
    
    if (getPromptError || !prompt) {
      throw new Error('提示词不存在');
    }
    
    // 保存原来的状态
    const oldStatus = prompt.status;
    
    // 使用数据库函数添加审核记录和更新提示词状态
    const { error: updateError } = await supabase.rpc('add_review', {
      p_prompt_id: promptId,
      p_reviewer_id: reviewerId,
      p_status: status,
      p_notes: notes
    });
    
    if (updateError) {
      // 如果函数不可用，尝试直接更新
      
      
      // 直接更新提示词状态
      const { data: updatedPrompt, error: updatePromptError } = await supabase
        .from('prompts')
        .update({ status })
        .eq('id', promptId)
        .select('*')
        .single();
        
      if (updatePromptError) {
        throw updatePromptError;
      }
      
      // 尝试创建审核记录，忽略错误
      try {
        await supabase
          .from('reviews')
          .insert({
            prompt_id: promptId,
            reviewer_id: reviewerId,
            status,
            notes
          });
      } catch (error) {
        
      }
    }
    
    // 获取更新后的提示词
    const { data: updatedPrompt, error: getUpdatedPromptError } = await supabase
      .from('prompts')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', promptId)
      .single();
      
    if (getUpdatedPromptError || !updatedPrompt) {
      throw getUpdatedPromptError || new Error('获取更新后的提示词失败');
    }
    
    // 如果状态由非published变为published，或者由published变为非published，需要更新计数
    if ((oldStatus !== 'published' && status === 'published') || (oldStatus === 'published' && status !== 'published')) {
      // 如果从非published变为published，增加计数
      if (oldStatus !== 'published' && status === 'published') {
        // 更新分类计数
        const { data: category } = await supabase
          .from('categories')
          .select('count')
          .eq('id', prompt.category_id)
          .single();
          
        if (category) {
          await supabase
            .from('categories')
            .update({ count: category.count + 1 })
            .eq('id', prompt.category_id);
        }
        
        // 更新标签计数
        const { data: promptTags } = await supabase
          .from('prompt_tags')
          .select('tag_id')
          .eq('prompt_id', promptId);
          
        if (promptTags && promptTags.length > 0) {
          const tagIds = promptTags.map((pt: {tag_id: string}) => pt.tag_id);
          for (const tagId of tagIds) {
            const { data: tag } = await supabase
              .from('tags')
              .select('count')
              .eq('id', tagId)
              .single();
              
            if (tag) {
              await supabase
                .from('tags')
                .update({ count: tag.count + 1 })
                .eq('id', tagId);
            }
          }
        }
      } 
      // 如果从published变为非published，减少计数
      else if (oldStatus === 'published' && status !== 'published') {
        // 更新分类计数
        const { data: category } = await supabase
          .from('categories')
          .select('count')
          .eq('id', prompt.category_id)
          .single();
          
        if (category) {
          await supabase
            .from('categories')
            .update({ count: Math.max(0, category.count - 1) })
            .eq('id', prompt.category_id);
        }
        
        // 更新标签计数
        const { data: promptTags } = await supabase
          .from('prompt_tags')
          .select('tag_id')
          .eq('prompt_id', promptId);
          
        if (promptTags && promptTags.length > 0) {
          const tagIds = promptTags.map((pt: {tag_id: string}) => pt.tag_id);
          for (const tagId of tagIds) {
            const { data: tag } = await supabase
              .from('tags')
              .select('count')
              .eq('id', tagId)
              .single();
              
            if (tag) {
              await supabase
                .from('tags')
                .update({ count: Math.max(0, tag.count - 1) })
                .eq('id', tagId);
            }
          }
        }
      }
    }
    
    return updatedPrompt;
  } catch (error) {
    throw error;
  }
}

export async function deletePrompt(promptId: string, userId: string) {
  try {
    const supabase = createClient();

    // 检查提示词是否存在
    const { data: prompt, error: promptError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', promptId)
      .single();

    if (promptError || !prompt) {
      throw new Error('提示词不存在');
    }

    // 检查用户是否有权限删除
    if (prompt.author_id !== userId) {
      throw new Error('无权删除此提示词');
    }

    // 获取提示词关联的标签
    const { data: promptTags } = await supabase
      .from('prompt_tags')
      .select('tag_id')
      .eq('prompt_id', promptId);
      
    const tagIds = promptTags ? promptTags.map((pt: { tag_id: string }) => pt.tag_id) : [];

    // 删除相关数据并更新计数
    try {
      // 删除提示词相关数据
      await supabase.from('prompt_tags').delete().eq('prompt_id', promptId);
      await supabase.from('favorites').delete().eq('prompt_id', promptId);
      await supabase.from('reviews').delete().eq('prompt_id', promptId);

      // 删除提示词
      await supabase.from('prompts').delete().eq('id', promptId);
      
      // 如果提示词是已发布状态，减少分类和标签计数
      if (prompt.status === 'published') {
        // 更新分类计数
        const { data: category } = await supabase
          .from('categories')
          .select('count')
          .eq('id', prompt.category_id)
          .single();
          
        if (category) {
          await supabase
            .from('categories')
            .update({ count: Math.max(0, category.count - 1) })
            .eq('id', prompt.category_id);
        }
        
        // 更新标签计数
        if (tagIds.length > 0) {
          for (const tagId of tagIds) {
            const { data: tag } = await supabase
              .from('tags')
              .select('count')
              .eq('id', tagId)
              .single();
              
            if (tag) {
              await supabase
                .from('tags')
                .update({ count: Math.max(0, tag.count - 1) })
                .eq('id', tagId);
            }
          }
        }
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

// 更新提示词浏览量
export async function updatePromptViews(promptId: string) {
  try {
    const supabase = createClient();
    
    // 获取当前浏览量
    const { data: prompt, error } = await supabase
      .from('prompts')
      .select('view_count')
      .eq('id', promptId)
      .single();
    
    if (error) throw error;
    
    // 更新浏览量 (+1)
    const { error: updateError } = await supabase
      .from('prompts')
      .update({ view_count: (prompt.view_count || 0) + 1 })
      .eq('id', promptId);
    
    if (updateError) {
      throw updateError;
    }
    
    return true;
  } catch (error) {
    throw error;
  }
} 