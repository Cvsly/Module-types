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
