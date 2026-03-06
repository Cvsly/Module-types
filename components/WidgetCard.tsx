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
  FileJson,
  ExternalLink
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

  const categoryColors: Record<string, string> = {
    douban: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    trakt: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    tv: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    danmu: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
    ai: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    tool: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    custom: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  };

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
              {widget.name}
            </h3>
            <span className={`px-2 py-0.5 rounded text-xs ${categoryColors[widget.category] || categoryColors.custom}`}>
              {widget.category}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs ${
              widget.type === 'fwd' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
            }`}>
              {widget.type === 'fwd' ? '合集' : 'JS'}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {widget.description}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
            <span className="font-mono">{widget.filename}</span>
            <span>v{widget.version}</span>
            <span>{widget.author}</span>
          </div>
        </div>

        {/* 操作 */}
        <div className="flex items-center gap-2">
          <ImportButton widget={widget} className="px-4 py-2 text-sm" />
          <a
            href={widget.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
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
          {widget.type === 'fwd' ? '模块合集' : 'JS 脚本'}
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
            {widget.name}
          </h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 h-10">
          {widget.description}
        </p>

        {/* 元数据 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded-md text-xs ${categoryColors[widget.category] || categoryColors.custom}`}>
            {widget.category}
          </span>
          {widget.tags.slice(0, 2).map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 文件信息 */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <span className="font-mono truncate max-w-[120px]">{widget.filename}</span>
          <span>v{widget.version}</span>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <ImportButton widget={widget} className="flex-1 justify-center" />
          <a
            href={widget.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title="查看源代码"
          >
            <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
