import { Header } from '@/components/Header';
import { WidgetGrid } from '@/components/WidgetGrid';
import { loadAllWidgets } from '@/lib/github-loader';
import { WidgetConfig } from '@/types/widget';
import { ArrowRight, RefreshCw, Github, AlertCircle } from 'lucide-react';

// 使用 ISR 替代 force-dynamic，每 60 秒重新生成
export const revalidate = 60;

export async function generateStaticParams() {
  return [{}];
}

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
        {/* Hero */}
        <section className="text-center mb-12">

          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Forward 模块中心
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            直接从 GitHub 仓库加载 .fwd 合集和 .js 脚本，一键导入 Forward App
          </p>


        </section>

        {/* 错误提示 */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5" />
              <span>加载模块失败: {error}</span>
            </div>
          </div>
        )}

        {/* 模块网格 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              可用模块
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-lg">
                {widgets.length}
              </span>
            </h2>
            

          </div>
          
          {widgets.length > 0 ? (
            <WidgetGrid widgets={widgets} />
          ) : !error ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              暂无可用模块
            </div>
          ) : null}
        </section>

        {/* 使用说明部分已删除 */}
      </main>


    </div>
  );
}
