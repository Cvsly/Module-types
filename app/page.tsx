import { Header } from '@/components/Header';
import { WidgetGrid } from '@/components/WidgetGrid';
import { loadAllWidgets } from '@/lib/github-loader';
import { WidgetConfig } from '@/types/widget';
import { ArrowRight, RefreshCw, Github, AlertCircle } from 'lucide-react';

// SSR 模式支持 force-dynamic
export const dynamic = 'force-dynamic';

export default async function Home() {
  let widgets: WidgetConfig[] = [];
  let error: string | null = null;
  
  try {
    widgets = await loadAllWidgets();
  } catch (err) {
    error = err instanceof Error ? err.message : '加载失败';
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-6">
            <RefreshCw className="w-4 h-4" />
            <span>自动同步 GitHub 仓库</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Forward 模块中心
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            直接从 GitHub 仓库加载 .fwd 合集和 .js 脚本，一键导入 Forward App
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Github className="w-4 h-4" />
              Cvsly/Module-widgets
            </span>
            <span>•</span>
            <span>实时同步仓库更新</span>
          </div>
        </section>

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5" />
              <span>加载模块失败: {error}</span>
            </div>
          </div>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              可用模块
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-lg">
                {widgets.length}
              </span>
            </h2>
            
            <a
              href="https://github.com/Cvsly/Module-widgets/tree/main/widgets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              浏览仓库
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          
          {widgets.length > 0 ? (
            <WidgetGrid widgets={widgets} />
          ) : !error ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              暂无可用模块
            </div>
          ) : null}
        </section>

        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm">1</span>
              .fwd 模块合集
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              JSON 格式的模块集合文件，包含多个小组件配置。适合批量导入相关功能的模块。
            </p>
          </div>
          
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm">2</span>
              .js 脚本模块
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              单个 JavaScript 脚本文件，通过头部注释定义元数据。适合独立功能的自定义脚本。
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20 py-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>数据源: github.com/Cvsly/Module-widgets</p>
          <p className="mt-1">自动同步 · 实时加载</p>
        </div>
      </footer>
    </div>
  );
}
