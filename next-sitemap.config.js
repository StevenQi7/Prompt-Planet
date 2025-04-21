/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/*',
          '/admin/*',
          '/login',
          '/register',
          '/settings',
          '/profile',
          '/_next/*',
          '/*.js',
          '/*.css',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/*', '/admin/*'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/*.jpg', '/*.jpeg', '/*.png', '/*.svg', '/*.webp', '/*.gif'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/*', '/admin/*'],
      },
      {
        userAgent: 'Slurp', // Yahoo Bot
        allow: '/',
        disallow: ['/api/*', '/admin/*'],
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: ['/api/*', '/admin/*'],
      },
      {
        userAgent: 'Baiduspider',
        allow: '/',
        disallow: ['/api/*', '/admin/*'],
      },
      {
        userAgent: 'YandexBot',
        allow: '/',
        disallow: ['/api/*', '/admin/*'],
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'http://localhost:3000'}/server-sitemap.xml`,
    ],
  },
  exclude: ['/admin/*', '/api/*', '/login', '/register', '/settings', '/profile'],
  // 改变默认的sitemap.xml的优先级
  defaultSitemapTransformer: async (config, sitemap) => {
    return sitemap;
  },
  // 添加额外的变换器
  transform: async (config, path) => {
    // 自定义优先级和更新频率
    const defaultPriority = 0.7;
    const defaultChangefreq = 'weekly';

    // 首页和浏览页的权重更高
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    if (path === '/browse') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }

    // 对于提示词详情页，如果能识别的话
    if (path.match(/^\/prompt-detail\/[\w-]+$/)) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }

    return {
      loc: path,
      changefreq: defaultChangefreq,
      priority: defaultPriority,
      lastmod: new Date().toISOString(),
    };
  },
} 