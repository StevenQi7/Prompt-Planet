import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '172.23.6.114',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'resource.prymtix.com',
        pathname: '/prompt-images/**',
      }
    ],
    domains: ['localhost', '172.23.6.114'],
  },
  // 添加静态文件服务配置
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/public/uploads/:path*',
      },
    ];
  },
  // 添加输出配置
  output: 'standalone',
  // 添加性能优化配置
  experimental: {
    optimizeCss: true, // 启用 CSS 优化
    turbo: {
      loaders: {
        '.js': ['babel-loader'],
        '.ts': ['ts-loader'],
        '.tsx': ['ts-loader'],
      },
    },
  },
  // 添加静态文件处理
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/images/',
            outputPath: 'static/images/',
          },
        },
      ],
    });
    // 添加 gzip 压缩
    config.optimization = {
      ...config.optimization,
      minimize: true,
    };
    return config;
  },
  // 添加压缩配置
  compress: true,
  // 添加缓存配置
  onDemandEntries: {
    // 页面缓存时间（毫秒）
    maxInactiveAge: 25 * 1000,
    // 同时缓存的页面数
    pagesBufferLength: 2,
  },
  // 添加静态页面生成配置
  generateEtags: true,
  poweredByHeader: false,
};

export default nextConfig;
