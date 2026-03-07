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

// 生成随机明亮纯色，适配深色背景的卡片样式
const getRandomCardColor = () => {
  // 预设的明亮纯色，和示例风格一致
  const colors = [
    '#22c55e', // 绿色
    '#10b981', // 青绿色
    '#3b82f6', // 蓝色
    '#8b5cf6', // 紫色
    '#ec4899', // 粉色
    '#f59e0b', // 黄色
    '#ef4444'  // 红色
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export function WidgetCard({ widget, viewMode = 'grid' }: WidgetCardProps) {
  const Icon = iconMap[widget.icon] || (widget.type === 'fwd' ? Box : Code);
  const randomCardColor = getRandomCardColor();

  // 列表视图
  if (viewMode === 'list') {
    return (
      <div 
        className="group flex items-center gap-4 p-4 rounded-xl hover:shadow-lg hover:shadow-current/20 transition-all"
        style={{
          backgroundColor: randomCardColor,
        }}
      >
        {/* 图标 */}
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: `${randomCardColor}20`, // 20%透明度的卡片颜色作为图标背景
          }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white truncate">
              {widget.name} <span className="text-sm font-normal text-white/80">v{widget.version}</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-xs bg-white/20 text-white">
              {widget.type === 'fwd' ? '合集' : '模块'}
            </span>
          </div>
          <p className="text-sm text-white/80 truncate">
            {widget.description}
          </p>
        </div>
        {/* 导入按钮 */}
        <ImportButton 
          widget={widget} 
          className="px-4 py-2 text-sm bg-white/20 hover:bg-white/30 text-white border border-white/30"
        />
      </div>
    );
  }

  // 网格视图
  return (
    <div 
      className="group relative rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-current/20 transition-all duration-300"
      style={{
        backgroundColor: randomCardColor,
      }}
    >
      {/* 预览区域 */}
      <div className="relative h-48 flex items-center justify-center overflow-hidden">
        {/* 网格纹理，增加质感 */}
        <div className="absolute inset-0 bg-grid-gray-200 dark:bg-grid-gray-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-10" />
        {/* 动态背景效果 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 animate-gradient" />
        </div>
        {/* 图标 */}
        <div 
          className="relative z-10 w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300"
          style={{
            backgroundColor: `${randomCardColor}20`, // 20%透明度的卡片颜色作为图标背景
          }}
        >
          <Icon className="w-10 h-10 text-white" />
        </div>
        {/* 类型标签 */}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
          {widget.type === 'fwd' ? '模块合集' : '模块'}
        </span>
        {/* 文件类型图标 */}
        <span className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          {widget.type === 'fwd' ? (
            <FileJson className="w-4 h-4 text-white" />
          ) : (
            <Code className="w-4 h-4 text-white" />
          )}
        </span>
      </div>
      {/* 内容 */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-white line-clamp-1">
            {widget.name} <span className="text-sm font-normal text-white/80">v{widget.version}</span>
          </h3>
        </div>
        <p className="text-white/80 text-sm mb-4 line-clamp-2 h-10">
          {widget.description}
        </p>
        {/* 导入按钮 - 全宽，半透明白色样式 */}
        <ImportButton 
          widget={widget} 
          className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
        />
      </div>
    </div>
  );
}
