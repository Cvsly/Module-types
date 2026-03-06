'use client';

import { Sparkles, Github, RefreshCw } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 dark:text-white">
                Forward Hub
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                模块资源中心
              </p>
            </div>
          </div>

          {/* 导航链接 */}
          <nav className="flex items-center gap-3">

            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">刷新</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
