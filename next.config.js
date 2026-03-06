/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 配置静态资源目录
  staticPageGenerationTimeout: 1000,
  // 将widgets目录作为静态资源目录
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
  // 配置静态资源路径
  async headers() {
    return [
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
  // 配置静态资源目录
  images: {
    unoptimized: true,
  },
  // 配置输出目录，确保widgets目录被复制到输出目录
  async exportPathMap() {
    const pathMap = {};
    // 添加首页
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
