/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除 output: 'export'，使用默认 SSR 模式
  // output: 'export',
  // distDir: 'dist',  // 也移除，使用默认 .next

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  // 配置静态资源目录
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/widgets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 配置输出目录，确保widgets目录被复制到输出目录
  async exportPathMap() {
    const pathMap = {};
    pathMap['/'] = { page: '/' };
    
    // 读取widgets目录下的所有文件，添加到静态资源路径
    const fs = require('fs');
    const path = require('path');
    const widgetsDir = path.join(process.cwd(), 'widgets');
    if (fs.existsSync(widgetsDir)) {
      const files = fs.readdirSync(widgetsDir);
      for (const file of files) {
        if (fs.statSync(path.join(widgetsDir, file)).isFile()) {
          pathMap[`/widgets/${file}`] = { 
            page: '/widgets/[file]', 
            query: { file: file } 
          };
        }
      }
    }
    
    return pathMap;
  },
};

module.exports = nextConfig;
