const zh = {
  // 通用
  appName: 'Prompt星球',
  
  // 公共元素
  reset: '重置筛选',
  clearAll: '清除全部',
  language: '语言',
  english: '英文',
  chinese: '中文',
  category: '分类',
  sort: '排序',
  popular: '热门',
  latest: '最新',
  resetFilters: '重置筛选',
  filters: '筛选条件',
  currentlyShowing: '当前显示 {count} 个项目',
  
  // 常用操作
  common: {
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    view: '查看',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    submit: '提交',
    search: '搜索'
  },
  
  // 首页
  homePage: {
    tagline: '在AI时代探索无限创意',
    title1: '发现、收藏、创造',
    title2: '释放',
    titleHighlight: 'AI潜能',
    description: '探索数千个精选提示词，让AI为您的创意、工作和学习赋能，释放无限可能',
    exploreBtnText: '探索提示词',
    createBtnText: '创建提示词',
    copyButton: '复制',
    copied: '已复制',
    loadMore: '加载更多提示词',
    createYourPrompt: '创建您自己的提示词',
    shareCreativity: '分享您的创意，让更多人从中受益',
  },
  
  // 页脚
  footer: {
    slogan: '探索、收藏和分享AI提示词的最佳平台',
    quickLinks: '快速链接',
    home: '首页',
    browse: '浏览提示词',
    create: '创建提示词',
    help: '帮助中心',
    about: '关于我们',
    aboutUs: '关于Prompt星球',
    contact: '联系我们',
    terms: '使用条款',
    privacy: '隐私政策',
    followUs: '关注我们',
    copyright: '© 2023 Prompt星球 - 提示词收录与管理平台. 保留所有权利.',
    login: '登录',
    register: '注册',
    profile: '个人主页',
    settings: '账户设置',
    adminReview: '审核管理',
  },
  
  // 搜索结果页面
  searchResults: {
    title: '搜索结果',
    subtitle: '查找与您的搜索相关的提示词',
    resultsFound: '找到 {count} 个相关结果',
    noResults: '没有找到相关结果',
    searchFor: '搜索： ',
    tryAgain: '请尝试其他关键词或浏览我们的分类',
    browseCategories: '浏览分类',
    filterBy: '筛选',
    sortBy: '排序',
    newest: '最新',
    oldest: '最早',
    mostPopular: '最热门',
    loadMore: '加载更多结果',
    relevance: '相关性',
    tryAnotherSearch: '请尝试使用其他关键词或减少筛选条件',
    searchTip: '想要找到更精准的提示词？尝试在搜索中使用更具体的关键词，如"SEO优化博客文章写作"、"学术论文写作助手"或"营销内容创作"，以获得更符合您需求的结果。',
    youMightAlsoLike: '您可能也对这些感兴趣',
    weeksAgo: '周前',
    loading: '加载中...',
    clearAll: '清除所有',
    allCategories: '全部分类',
    allLanguages: '全部语言',
    otherLanguages: '其他语言',
    pagination: {
      prev: '上一页',
      next: '下一页',
      page: '第 {page} 页',
      of: '共 {total} 页',
      showing: '显示 {start}-{end} 条，共 {total} 条'
    }
  },
  
  // 提示词详情页
  promptDetail: {
    title: '提示词详情',
    subtitle: '查看提示词的详细内容、使用方法和示例',
    by: '作者：',
    published: '发布于：',
    category: '分类',
    views: '浏览',
    favorites: '收藏',
    copyPrompt: '复制提示词',
    copied: '已复制',
    addToFavorites: '收藏',
    removeFromFavorites: '取消收藏',
    promptContent: '提示词内容',
    usageGuide: '使用指南',
    usageEffect: '使用效果',
    relatedPrompts: '相关提示词',
    viewAll: '查看全部',
    comments: '评论',
    writeComment: '写评论',
    submitComment: '提交评论',
    reportPrompt: '举报提示词',
    sharePrompt: '分享提示词',
    favorite: '收藏',
    loginRequired: '请先登录后再收藏',
    invalidPromptId: '提示词ID无效',
    operationFailed: '操作失败',
    addedToFavorites: '已添加到收藏',
    removedFromFavorites: '已从收藏中移除',
    favoriteOperationFailed: '收藏操作失败，请稍后重试',
    fetchFailed: '获取提示词失败',
    parseImagesError: '解析图片数据失败:',
    checkFavoriteError: '检查收藏状态失败:',
    fetchDetailError: '获取提示词详情失败',
    errorOccurred: '发生错误',
    returnToHome: '返回首页',
    notFound: '提示词未找到',
    promptNotExist: '您查找的提示词不存在或已被删除。',
    promptIdRequired: '提示词ID是必需的',
    example: '示例',
    shareSuccess: '分享成功',
    shareError: '分享失败:',
    linkCopied: '链接已复制到剪贴板',
    usageCount: '使用次数',
    favoriteCount: '收藏次数',
    createdAt: '创建于',
    createdBy: '由',
    user: '用户',
    statistics: '统计信息',
    creationDate: '创建日期',
    lastUpdated: '最后更新',
    processing: '处理中...',
    viewMore: '查看更多',
    noRelatedPrompts: '没有相关提示词',
    unnamedTag: '未命名标签',
    clickToView: '点击放大查看'
  },
  
  // 浏览页面
  browse: {
    title: '浏览提示词',
    subtitle: '发现各类AI提示词，提升您的工作和创造力',
    filterByCategory: '按分类筛选',
    allCategories: '全部分类',
    sortBy: '排序方式',
    sortByNewest: '最新',
    sortByPopular: '最热门',
    sortByName: 'A-Z',
    search: '搜索',
    searchPlaceholder: '搜索提示词...',
    resultsFound: '找到 {count} 个提示词',
    noResults: '没有找到相关提示词',
    loadMore: '加载更多',
    filterActive: '已选筛选',
    viewAll: '查看全部',
    
    // 新增国际化文本
    categories: '分类',
    tags: '标签',
    view: '查看方式',
    totalPrompts: '提示词总数',
    page: '第 {page} 页，共 {total} 页',
    pagination: {
      prev: '上一页',
      next: '下一页',
      page: '第 {page} 页',
      of: '共 {total} 页',
      showing: '显示 {start}-{end} 条，共 {total} 条'
    }
  },
  
  // 用户见证
  testimonials: {
    title: '用户心声',
    subtitle: '来自不同领域用户的真实体验分享，看看他们如何通过提示词提升工作效率',
    items: {
      0: {
        quote: 'Prompt星球上的提示词让我的设计工作效率提高了至少40%，尤其是AI绘画方面的提示词模板非常实用。',
        name: '李明',
        role: 'UI设计师'
      },
      1: {
        quote: '作为一名内容创作者，这里的写作提示词帮我解决了创作瓶颈，特别是在需要快速产出高质量内容的时候。',
        name: '王芳',
        role: '自媒体作者'
      },
      2: {
        quote: '平台上的代码优化提示词让我的编程工作事半功倍，特别是调试复杂问题时能够给出精准的解决思路。',
        name: '张伟',
        role: '软件工程师'
      },
      3: {
        quote: '平台上的提示词分类清晰，质量有保证，帮助我更有效地使用AI工具进行产品规划和设计。',
        name: '刘婧萱',
        role: '产品经理'
      }
    }
  },
  
  // 分类导航
  categoryNav: {
    title: '按分类浏览',
    allCategories: '全部分类',
    promptCount: '{count} 提示词',
  },
  
  // 提示词和标签
  promptsAndTags: {
    featuredPrompts: '精选提示词',
    viewAll: '查看全部',
    popularTags: '热门标签',
    moreTags: '更多标签',
    promptList: '提示词列表',
    hotTab: '热门',
    newTab: '最新',
    details: '详情',
    oneDayAgo: '1天前',
    twoDaysAgo: '2天前',
    today: '今天',
    daysAgo: '天前',
    loading: '加载中...',
    hot: '热门',
  },
  
  // 标签
  tags: {
    creativeWriting: '创意写作',
    dataAnalysis: '数据分析',
    programming: '编程',
    imageGeneration: '图像生成',
    creative: '创意构思',
    business: '商业规划',
    learning: '学习计划',
    roleplay: '角色扮演',
    multimodal: '多模态',
    aiDrawing: 'AI绘画',
    techDocs: '技术文档',
    thinking: '思维模型',
    seo: 'SEO优化',
    contentMarketing: '内容营销'
  },
  
  // 提示词分类
  categories: {
    creative_writing: '创意写作',
    coding: '代码开发',
    image_generation: '图像生成',
    education: '教育学习',
    marketing: '市场营销',
    ai_assistant: 'AI助手',
    productivity: '生产力工具',
    thinking: '思维方式',
    translation: '语言翻译',
    document: '文档处理',
  },
  
  // 导航栏
  nav: {
    browse: '浏览',
    myPrompts: '我的提示词',
    createPrompt: '提示词创作',
    favorites: '收藏',
    help: '帮助中心',
    searchPlaceholder: '搜索提示词...',
    profile: '个人主页',
    settings: '账户设置',
    logout: '退出登录',
    admin: '管理员',
    adminReview: '审核管理',
    adminUsers: '用户管理',
    adminSettings: '系统设置'
  },
  
  // 创建提示词页面
  createPromptPage: {
    title: '创建优质提示词',
    subtitle: '一个好的提示词可以激发AI创造力，帮助他人更高效地使用AI',
    tagline: '分享你的创意提示词',
    returnToHome: '返回首页',
    createPrompt: '创建提示词',
    expandAll: '展开全部',
    collapseAll: '收起全部',
    editorLoading: '编辑器加载中...',
    step: '步骤',
    
    // 步骤
    step1: '基本信息',
    step1Desc: '设置提示词的基本属性',
    step2: '提示词内容',
    step2Desc: '编写高质量的提示词内容',
    step3: '使用说明',
    step3Desc: '帮助他人理解如何使用你的提示词',
    step4: '效果展示',
    step4Desc: '通过图片展示提示词的实际效果',
    step5: '发布设置',
    step5Desc: '设置提示词的可见性',
    
    // 表单字段
    promptTitle: '提示词标题',
    promptTitleDesc: '一个好的标题能够更好地吸引用户的注意力',
    promptTitlePlaceholder: '输入一个简洁明了的标题（最多50字符）',
    category: '分类',
    selectCategory: '选择分类',
    tags: '标签',
    tagsDesc: '标签有助于其他用户更快地找到您的提示词',
    tagsPlaceholder: '输入标签，用逗号分隔（最多5个标签）',
    tagsUsed: '已使用标签',
    language: '语言',
    languageDesc: '选择你的提示词语言。这将决定你的提示词在搜索结果中的显示位置。',
    promptContent: '提示词内容',
    content: '内容',
    promptContentPlaceholder: '输入提示词内容，支持Markdown格式...',
    usageGuide: '使用说明',
    usageGuidePlaceholder: '解释如何使用这个提示词，可以包含示例...',
    usageGuideDesc: '详细的使用说明可以帮助其他用户更好地使用您的提示词',
    uploadImages: '添加效果图片（可选）',
    uploadImagesDesc: 'PNG, JPG, GIF 最大 5MB，最多4张图片',
    uploadImagesPlaceholder: '点击上传或拖拽图片到此处',
    uploadImagesDropping: '放开以添加文件',
    publicShare: '公开分享',
    publicShareDesc: '允许其他用户查看和使用此提示词',
    description: '提示词描述',
    descriptionPlaceholder: '简要描述这个提示词的功能和使用场景（最多200字符）',
    descriptionDesc: '清晰的描述有助于用户快速了解提示词的用途',
    searchTags: '搜索标签...',
    popularTags: '热门标签',
    
    // 发布说明
    publicReviewNotice: '公开提示词审核说明',
    publicReviewDesc: '您创建的公开提示词将进入审核队列，审核通过后将对所有用户可见。审核通常在24-48小时内完成。',
    privateNotice: '私密提示词说明',
    privateDesc: '您创建的私密提示词将立即发布，但仅对您可见，无需审核。您可以随时将私密提示词改为公开，但需要经过审核。',
    
    // 按钮
    prevStep: '上一步',
    nextStep: '下一步',
    publish: '发布提示词',
    submitting: '提交中...',
    confirmPublish: '确认发布提示词',
    confirmPublishDesc: '提示词发布后将进入审核队列，审核通过后将公开显示。确定要发布吗？',
    cancel: '取消',
    confirm: '确认发布',
    preview: '预览效果',
    previewTitle: '提示词预览',
    closePreview: '关闭预览',
    previewImages: '效果展示图片',
    previewImage: '效果图',
    noTitle: '(未设置标题)',
    noCategory: '(未选择分类)',
    noDescription: '(未设置描述)',
    noContent: '(未填写提示词内容)',
    
    // 提示词编写技巧
    writingTips: '提示词编写技巧',
    tip1: '使用明确的指令和清晰的格式，避免模糊的表述',
    tip2: '指定AI应该扮演的角色或采用的语气，赋予AI明确的身份',
    tip3: '使用方括号 [变量] 标注用户需要替换的部分',
    tip4: '提供输出的格式和结构要求，使结果更加规范',
    tip5: '添加示例可以帮助AI更好地理解你的意图',
    
    // 错误信息和提示
    titleRequired: '请输入提示词标题',
    categoryRequired: '请选择提示词分类',
    contentRequired: '请输入提示词内容',
    descriptionRequired: '请输入提示词描述',
    maxTagsReached: '最多只能选择5个标签',
    maxImagesReached: '最多只能上传{count}张图片',
    fetchCategoriesFailed: '获取分类列表失败',
    fetchCategoriesError: '获取分类失败，请稍后重试',
    fetchTagsFailed: '获取热门标签失败',
    fetchTagsError: '获取热门标签失败，请稍后重试',
    searchTagsFailed: '搜索标签失败',
    searchTagsError: '搜索标签失败，请稍后重试',
    createFailed: '创建提示词失败',
    createSuccess: '提示词创建成功',
    createSuccessReviewing: '提示词创建成功，正在等待审核',
    createError: '创建提示词失败',
    createErrorTryAgain: '创建提示词失败，请稍后重试',
    completeRequiredFields: '请完成所有必填字段后再提交',
    uploading: '正在上传图片...',
    uploadSuccess: '上传成功',
    uploadFailed: '上传失败',
    uploadError: '上传图片出错',
    privateSubmitConfirm: '您创建的私密提示词将仅对您可见，无需审核即可发布。确定要发布吗？',
    publicSubmitConfirm: '提示词发布后将进入审核队列，审核通过后将公开显示。确定要发布吗？',
  },
  
  // 设置页面
  settings: {
    title: '账户设置',
    subtitle: '管理您的基本账户信息和密码',
    basicInfo: '基本信息',
    username: '用户名',
    nickname: '昵称',
    email: '电子邮箱',
    phone: '手机号码',
    changePassword: '修改密码',
    currentPassword: '当前密码',
    newPassword: '新密码',
    confirmPassword: '确认新密码',
    cancel: '取消',
    saveChanges: '保存更改',
    passwordMismatch: '两次输入的密码不一致！',
    saveSuccess: '设置已保存！',
    confirmCancel: '确定要取消更改吗？未保存的修改将会丢失。',
    nicknameTooLong: '昵称长度不能超过30个字符',
    currentPasswordRequired: '请输入当前密码',
    newPasswordRequired: '请输入新密码',
    nicknamePlaceholder: '输入您的昵称',
    passwordPlaceholder: '••••••••',
    saving: '保存中...'
  },
  
  // 个人资料页面
  profile: {
    title: '个人中心',
    subtitle: '管理您的提示词和个人信息',
    createNew: '创建新提示词',
    refresh: '刷新数据',
    createdPrompts: '创建的提示词',
    favoritedPrompts: '收藏的提示词',
    view: '查看',
    all: '全部',
    published: '已发布',
    reviewing: '审核中',
    rejected: '未通过',
    private: '私密',
    publishedStatus: '已发布',
    reviewingStatus: '审核中',
    rejectedStatus: '未通过',
    rejectionReason: '拒绝原因',
    noRejectionReason: '未提供拒绝原因',
    privateStatus: '私密',
    usageCount: '使用次数',
    favoriteCount: '收藏次数',
    submittedOn: '提交于',
    viewDetails: '查看详情',
    totalPrompts: '提示词总数',
    confirmDelete: '确认删除',
    deletePromptConfirm: '您确定要删除这个提示词吗？此操作无法撤销。',
    cancel: '取消',
    deleting: '删除中...',
    confirmDeleteBtn: '确认删除',
    noPrompts: '暂无提示词',
    createFirstPrompt: '创建第一个提示词',
    copied: '已复制到剪贴板',
    copyPrompt: '复制提示词',
    promptDeleted: '提示词已删除',
    deleteError: '删除提示词失败，请稍后重试',
    deletePromptWarning: '删除操作无法撤销，删除后所有提示词数据将永久丢失。',
    pagination: {
      prev: '上一页',
      next: '下一页',
      page: '第 {page} 页',
      of: '共 {total} 页',
      showing: '显示 {start}-{end} 条，共 {total} 条'
    }
  },
  
  // 收藏页面
  favorites: {
    title: '我的收藏',
    subtitle: '管理、组织和使用您珍藏的提示词',
    tagline: '我收藏的创意提示词',
    totalCountPrefix: '共',
    totalCountSuffix: '个收藏',
    filterByCategory: '分类筛选',
    sortBy: '排序方式',
    viewMode: '显示方式',
    gridView: '网格视图',
    listView: '列表视图',
    allCategories: '全部分类',
    sortByNewest: '收藏时间 (新→旧)',
    sortByOldest: '收藏时间 (旧→新)',
    sortByMostUsed: '使用次数 (多→少)',
    sortByName: '按名称 (A→Z)',
    favoritedOn: '收藏',
    viewDetails: '查看详情',
    removeFromFavorites: '取消收藏',
    confirmRemove: '确定要取消收藏这个提示词吗？',
    confirmRemoveTitle: '取消收藏',
    confirmRemoveMessage: '您确定要取消收藏这个提示词吗？此操作无法撤销。',
    confirm: '移除',
    noFavoritesTitle: '您还没有收藏任何提示词',
    noFavoritesDescription: '浏览提示词库并收藏您喜欢的提示词，它们将会显示在这里',
    browseTips: '浏览提示词',
    favorite: '收藏',
    copied: '已复制',
    fetchError: '获取收藏列表失败，请稍后重试',
    fetchCategoriesError: '获取分类列表失败，请稍后重试',
    removeError: '取消收藏失败，请稍后重试',
    removeSuccess: '已从收藏中移除',
    removing: '正在取消收藏...',
    noFilteredResultsTitle: '没有符合条件的提示词',
    noFilteredResultsDescription: '当前筛选条件下没有找到任何提示词，请尝试其他筛选条件或重置筛选',
    resetFilters: '重置筛选',
    pagination: {
      prev: '上一页',
      next: '下一页',
      page: '第 {page} 页',
      of: '共 {total} 页',
      showing: '显示 {start}-{end} 条，共 {total} 条',
      perPage: '每页显示'
    }
  },
  
  // 管理员相关
  admin: {
    reviewTitle: '提示词审核',
    filter: '筛选',
    refresh: '刷新',
    category: '分类',
    submissionTime: '提交时间',
    allTime: '所有时间',
    today: '今天',
    thisWeek: '本周',
    thisMonth: '本月',
    applyFilter: '应用筛选',
    pending: '待审核',
    all: '全部',
    approved: '已通过',
    rejected: '已拒绝',
    noPromptsToReview: '没有待审核的提示词',
    approve: '通过',
    reject: '拒绝',
    promptContent: '提示词内容',
    tags: '标签',
    previewImages: '预览图片',
    reviewNotes: '审核备注',
    reviewNotesPlaceholder: '输入审核备注...',
    processing: '处理中...',
    approveSuccess: '审核通过成功',
    approveError: '审核通过失败',
    rejectSuccess: '审核拒绝成功',
    rejectError: '审核拒绝失败',
    reviewedBy: '审核人',
    submittedAt: '提交于',
    previous: '上一页',
    next: '下一页',
    unknownReviewer: '未知审核人',
    adminRole: '管理员',
    normalUser: '普通用户'
  },
  
  // 注册和登录页面
  auth: {
    title: '登录',
    subtitle: '欢迎来到 Prompt Planet，请登录您的账号',
    registerTitle: '注册',
    registerSubtitle: '创建您的 Prompt Planet 账号，开始分享和管理提示词',
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    username: '用户名',
    nickname: '昵称',
    login: '登录',
    register: '注册',
    loggingIn: '登录中...',
    registering: '注册中...',
    forgetPassword: '忘记密码？',
    noAccount: '还没有账号？',
    hasAccount: '已有账号？',
    createAccount: '创建账号',
    goToLogin: '去登录',
    passwordMismatch: '两次输入的密码不一致',
    registerSuccess: '注册成功！请登录您的账号',
    loginSuccess: '登录成功！',
    logoutSuccess: '已退出登录',
    logoutError: '退出登录失败',
    passwordRequirements: '密码必须包含至少8个字符，包括大写字母、小写字母和数字',
    usernameRequirements: '用户名只能包含字母、数字和下划线',
    emailFormat: '请输入有效的电子邮箱',
    loginWithGithub: '使用 GitHub 登录',
    loginWithGoogle: '使用 Google 登录',
    orUseEmail: '或者使用邮箱',
    loginWithEmail: '使用邮箱登录',
    emailPlaceholder: 'your-email@example.com',
    passwordPlaceholder: '请输入密码',
    backToOtherMethods: '返回其他登录方式',
    emailPasswordRequired: '请输入邮箱和密码',
    loginError: '登录失败，请重试',
    registerError: '注册失败，请重试',
    verificationEmailSent: '验证邮件已发送，请查收邮箱完成注册',
    githubLoginError: 'GitHub 登录失败',
    googleLoginError: 'Google 登录失败',
    emailRequired: '请输入邮箱',
    passwordRequired: '请输入密码',
    usernameRequired: '请输入用户名',
    confirmPasswordRequired: '请再次输入密码',
    // 新增 Supabase 错误消息国际化
    invalidCredentials: '邮箱或密码错误，请重试',
    emailNotConfirmed: '此邮箱尚未验证，请先验证邮箱',
    userNotFound: '用户不存在',
    emailAlreadyInUse: '该邮箱已被注册',
    passwordTooShort: '密码长度至少需要6个字符',
    invalidEmailFormat: '无法验证邮箱格式，请检查输入'
  },
  
  // 编辑提示词页面
  editPromptPage: {
    title: '编辑提示词',
    subtitle: '完善您的提示词内容并发布',
    basicInfo: '基本信息',
    promptTitle: '提示词标题',
    promptTitlePlaceholder: '输入简洁的标题（最多50个字符）',
    promptContent: '提示词内容',
    content: '内容',
    contentPlaceholder: '输入提示词内容，支持Markdown格式...',
    category: '分类',
    selectCategory: '选择分类',
    description: '提示词描述',
    descriptionPlaceholder: '简要描述此提示词的功能和使用场景（最多500个字符）',
    searchTags: '搜索标签...',
    tags: '标签',
    maxTagsReached: '最多可选择5个标签',
    usageGuide: '使用指南',
    usageGuidePlaceholder: '解释如何使用此提示词，可以包含示例...',
    isPublic: '公开分享',
    isPublicDesc: '允许其他用户查看和使用此提示词，设为公开时需要重新审核',
    cancel: '取消',
    update: '更新提示词',
    updating: '更新中...',
    editorLoading: '编辑器加载中...',
    loading: '加载中...',
    settings: '设置',
    popularTags: '热门标签',
    addTags: '添加标签',
    previewImages: '预览图片',
    addImages: '添加图片',
    imageLimit: '最多可上传{count}张图片',
    deleteConfirm: '确定要删除这张图片吗？',
    saveAsDraft: '保存为草稿',
    readMore: '显示更多',
    readLess: '收起',
    rejectionReason: '拒绝原因',
    noSpecificReason: '未提供具体原因',
    imageGallery: '图片库',
    
    // 错误信息和提示
    titleRequired: '请输入提示词标题',
    categoryRequired: '请选择提示词分类',
    contentRequired: '请输入提示词内容',
    descriptionRequired: '请输入提示词描述',
    descriptionTooLong: '描述不能超过{max}个字符',
    fetchError: '获取提示词数据失败',
    fetchCategoriesError: '获取分类失败，请稍后重试',
    searchTagsFailed: '搜索标签失败',
    updateFailed: '更新提示词失败',
    updateSuccess: '提示词更新成功',
    updateErrorTryAgain: '更新提示词失败，请稍后重试',
    processing: '处理中...',
    deleteImageSuccess: '图片已删除',
    deleteImageError: '删除图片失败',
    
    // 上传提示
    uploading: '上传图片中...',
    uploadSuccess: '上传成功',
    uploadFailed: '上传失败',
    uploadError: '上传图片失败',
    maxImagesReached: '最多可上传{count}张图片',
    charactersRemaining: '还可输入{count}个字符'
  },
  
  // 关于页面
  about: {
    title: '关于Prompt星球',
    subtitle: '探索、收藏和分享AI提示词的最佳平台',
    ourStory: {
      title: '我们的故事',
      content1: 'Prompt星球成立于2023年，是由一群AI爱好者和创意工作者共同创建的平台。在AI技术迅猛发展的时代，我们发现优质的提示词（Prompts）能够显著提升AI工具的效用，但这些提示词往往散落在各处，难以查找和管理。',
      content2: '我们的使命是建立一个集中、开放、高效的提示词分享社区，让每个人都能更轻松地找到、创建和分享高质量的AI提示词，充分释放AI的创造力和生产力。',
      content3: '无论您是创意工作者、技术开发者、教育工作者还是AI爱好者，我们希望Prompt星球能成为您的创意助手和灵感源泉。'
    },
    ourValues: {
      title: '我们的价值观',
      community: {
        title: '社区共创',
        description: '我们相信集体智慧的力量。通过建立开放、包容的社区，每个成员都能贡献自己的创意，共同成长。'
      },
      quality: {
        title: '优质导向',
        description: '我们追求高质量的内容和用户体验，通过精心设计的审核机制确保平台提示词的实用性和创新性。'
      },
      innovation: {
        title: '持续创新',
        description: '我们不断探索AI技术的新边界，持续改进平台功能，为用户提供更好的工具和服务。'
      },
      sharing: {
        title: '知识共享',
        description: '我们鼓励知识的自由流动，让每一个创意提示词都能启发更多可能性，产生更大的社会价值。'
      }
    },
    joinUs: {
      title: '加入我们',
      subtitle: '共同打造AI提示词的未来',
      description: '如果您对AI充满热情，希望为创新社区贡献力量，我们诚邀您加入Prompt星球团队！',
      contactButton: '联系我们'
    }
  },
  
  // 联系我们页面
  contact: {
    title: '联系我们',
    subtitle: '我们期待听到您的声音',
    description: '无论您有任何问题、建议或合作意向，都欢迎与我们联系。我们会在2个工作日内回复您。',
    form: {
      name: '您的姓名',
      email: '电子邮箱',
      subject: '主题',
      message: '消息内容',
      submit: '发送消息',
      namePlaceholder: '请输入您的姓名',
      emailPlaceholder: '请输入您的电子邮箱',
      subjectPlaceholder: '请输入主题',
      messagePlaceholder: '请输入您想告诉我们的内容',
      success: '消息已发送，我们会尽快回复您',
      error: '发送失败，请稍后重试'
    },
    otherChannels: {
      title: '其他联系方式',
      email: '电子邮箱',
      social: '社交媒体'
    }
  },

  // 使用条款页面
  terms: {
    title: '使用条款',
    lastUpdated: '最后更新：2024年3月',
    sections: {
      introduction: {
        title: '简介',
        content: '欢迎使用Prompt星球。通过访问或使用我们的网站，您同意遵守这些条款和条件。请仔细阅读以下内容。'
      },
      definitions: {
        title: '定义',
        content: '在本使用条款中，"我们"、"我们的"和"Prompt星球"指代Prompt星球平台；"您"和"用户"指代使用我们平台的个人或实体。'
      },
      account: {
        title: '账户责任',
        content: '您负责维护您账户的保密性，并对发生在您账户下的所有活动负责。如发现任何未经授权的使用，请立即通知我们。'
      },
      content: {
        title: '内容规范',
        content: '用户创建和分享的所有提示词内容必须遵守我们的内容政策。我们保留删除任何违规内容的权利。'
      },
      intellectual: {
        title: '知识产权',
        content: '用户保留其创作内容的知识产权，但授予平台展示、分发和推广的权利。'
      },
      liability: {
        title: '责任限制',
        content: '在法律允许的最大范围内，我们对使用本平台造成的任何直接或间接损失不承担责任。'
      },
      changes: {
        title: '条款变更',
        content: '我们保留随时修改这些条款的权利。重大变更将通过电子邮件或网站通知发布。'
      }
    }
  },

  // 隐私政策页面
  privacy: {
    title: '隐私政策',
    lastUpdated: '最后更新：2024年3月',
    sections: {
      introduction: {
        title: '隐私保护承诺',
        content: 'Prompt星球重视并保护您的隐私。本隐私政策说明了我们如何收集、使用和保护您的个人信息。'
      },
      collection: {
        title: '信息收集',
        content: '我们收集的信息包括但不限于：账户信息（如电子邮箱、用户名）、使用数据（如浏览历史、搜索记录）和设备信息。'
      },
      usage: {
        title: '信息使用',
        content: '我们使用收集的信息来：提供和改进服务、个性化用户体验、发送重要通知和更新。'
      },
      sharing: {
        title: '信息共享',
        content: '除非得到您的明确同意，我们不会与第三方共享您的个人信息。但我们可能共享匿名的统计数据。'
      },
      security: {
        title: '数据安全',
        content: '我们采用行业标准的安全措施保护您的信息，包括数据加密、安全存储和访问控制。'
      },
      cookies: {
        title: 'Cookie使用',
        content: '我们使用cookies来改善用户体验、分析网站使用情况和个性化内容。您可以通过浏览器设置控制cookies。'
      },
      rights: {
        title: '用户权利',
        content: '您有权访问、更正或删除您的个人信息。如需行使这些权利，请通过联系方式与我们联系。'
      },
      contact: {
        title: '隐私问题联系',
        content: '如果您对我们的隐私政策有任何疑问，请随时联系我们的隐私保护团队。'
      }
    }
  },

  // Help Page 帮助中心
  help: {
    title: '帮助中心',
    subtitle: '欢迎来到Prompt星球帮助中心，这里有您需要的所有指南和教程',
    searchPlaceholder: '搜索帮助文章...',
    faqTitle: '常见问题',
    categoriesTitle: '帮助内容分类',
    
    // FAQ cards
    whatIsPrompt: {
      title: '什么是提示词？',
      description: '了解AI提示词的概念、用途以及它如何帮助您提高工作效率。',
      viewDetails: '查看详情'
    },
    howToCreate: {
      title: '如何创建提示词？',
      description: '学习如何创建高质量的提示词，以及提示词审核的流程和标准。',
      viewDetails: '查看详情'
    },
    accountManagement: {
      title: '账户管理',
      description: '如何注册、登录、找回密码，以及管理您的个人资料和偏好设置。',
      viewDetails: '查看详情'
    },
    privacySecurity: {
      title: '隐私与安全',
      description: '了解我们如何保护您的数据，以及您可以采取哪些措施保护您的账户安全。',
      viewDetails: '查看详情'
    },
    
    // Help categories
    beginnerGuide: {
      title: '新手指南',
      platformIntro: '平台功能介绍',
      registration: '注册与登录指南',
      profileSetup: '个人资料设置',
      browse: '浏览与搜索提示词'
    },
    promptCreationGuide: {
      title: '提示词创作指南',
      promptBasics: '提示词基础知识',
      createPrompts: '创建高质量提示词',
      reviewProcess: '提示词审核流程',
      bestPractices: '提示词编写最佳实践'
    },
    
    // Content sections
    whatIsPromptContent: {
      title: '什么是提示词？',
      definition: '<strong>提示词（Prompt）</strong>是给AI（人工智能）系统的一组指令或问题，用来引导AI生成特定类型的内容或执行特定任务。好的提示词能够帮助AI更准确地理解您的需求，从而产生更符合期望的输出。',
      importance: '提示词的重要性',
      importanceText: '提示词是人类与AI交流的桥梁。AI系统如ChatGPT、DALL-E等都是通过提示词来理解用户意图的。提示词的质量直接影响AI输出的质量，一个精心设计的提示词可以：',
      importanceList1: '获得更准确、相关的回答',
      importanceList2: '引导AI生成更具创意和实用性的内容',
      importanceList3: '提高工作效率，减少沟通成本',
      importanceList4: '最大化AI工具的价值和潜力',
      types: '提示词的类型',
      typesText: '提示词根据用途和目标可以分为多种类型：',
      typesList1: '<strong>创意写作类</strong>：用于生成创意内容，如故事、诗歌、广告文案等',
      typesList2: '<strong>代码开发类</strong>：用于生成代码、调试程序、解释技术概念',
      typesList3: '<strong>图像生成类</strong>：用于引导AI生成特定风格、主题的图像',
      typesList4: '<strong>思维方式类</strong>：指导AI以特定的思维模式回答问题，如科学家、哲学家视角',
      typesList5: '<strong>教育学习类</strong>：用于生成学习资料、解释概念或辅导特定学科',
      nextArticle: '下一篇：如何创建提示词'
    },
    
    contactSupport: {
      title: '没有找到您需要的帮助？',
      description: '如果您的问题没有在帮助中心得到解答，请联系我们的支持团队，我们将尽快回复您。',
      contactButton: '联系支持团队'
    }
  },

  // 分页相关
  pagination: {
    showing: '显示 {start}-{end} 条，共 {total} 条',
    previous: '上一页',
    next: '下一页'
  },
};

export default zh; 