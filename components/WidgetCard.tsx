cat > /home/user/.super_doubao/super-doubao-runtime/workspace/Module-types/components/WidgetCard.tsx << 'EOF'
import { WidgetConfig } from '@/types/widget';
import { ImportButton } from './ImportButton';
import {
  Film,
  Tv,
  Radio,
  MessageCircle,
  TrendingUp,
  BookOpen,
  Code,
  Box,
  FileJson
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Film, Tv, Radio, MessageCircle, TrendingUp, BookOpen, Code, Box
};

interface WidgetCardProps {
  widget: WidgetConfig;
  viewMode?: 'grid' | 'list';
}

export function WidgetCard({ widget, viewMode = 'grid' }: WidgetCardProps) {
  const Icon = iconMap[widget.icon] || (widget.type === 'fwd' ? Box : Code);

  // 列表视图
  if (viewMode === 'list') {
    return (
      <div className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all">
        {/* 图标 */}
        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {widget.name} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">v{widget.version}</span>
            </h3>
            <span className={`px-2 py-0.5 rounded text-xs ${
              widget.type === 'fwd'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
            }`}>
              {widget.type === 'fwd' ? '合集' : '模块'}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {widget.description}
          </p>
        </div>

        {/* 导入按钮 */}
        <ImportButton widget={widget} className="px-4 py-2 text-sm" />
      </div>
    );
  }

  // 网格视图
  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
      {/* 预览区域 */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-200 dark:bg-grid-gray-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

        {/* 动态背景 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient" />
        </div>

        {/* 图标 */}
        <div className="relative z-10 w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-10 h-10 text-gray-700 dark:text-gray-200" />
        </div>

        {/* 类型标签 */}
        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
          widget.type === 'fwd'
            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
        }`}>
          {widget.type === 'fwd' ? '模块合集' : '模块'}
        </span>

        {/* 文件类型图标 */}
        <span className="absolute top-4 right-4 w-8 h-8 bg-black/5 dark:bg-white/10 rounded-lg flex items-center justify-center">
          {widget.type === 'fwd' ? (
            <FileJson className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <Code className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
        </span>
      </div>

      {/* 内容 */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
            {widget.name} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">v{widget.version}</span>
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 h-10">
          {widget.description}
        </p>

        {/* 导入按钮 - 全宽，无查看源码按钮 */}
        <ImportButton widget={widget} className="w-full" />
      </div>
    </div>
  );
}
EOF
