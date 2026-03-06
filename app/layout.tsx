import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Forward Hub - 模块资源中心',
  description: '自动同步 GitHub 仓库的 Forward 模块资源，支持 .fwd 合集和 .js 脚本一键导入',
  keywords: ['Forward', 'iOS小组件', '模块', '脚本', '豆瓣', 'Trakt', '直播'],
  authors: [{ name: 'Forward Community' }],
  openGraph: {
    title: 'Forward Hub',
    description: 'Forward 模块资源分享平台',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forward Hub',
    description: 'Forward 模块资源分享平台',
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-gray-50 dark:bg-gray-950`}>
        {children}
      </body>
    </html>
  );
}
