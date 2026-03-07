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

// 生成更明显的iOS风格彩色半透明背景，适配浅色页面
const getRandomIosGlassColor = () => {
  const hue = Math.floor(Math.random() * 360);
  // 提高饱和度，降低亮度，让彩色更明显，在浅色背景上清晰可见
  return `hsl(${hue}, 65%, 75%)`;
};

export function WidgetCard({ widget, viewMode = 'grid' }: WidgetCardProps) {
  const Icon = iconMap[widget.icon] || (widget.type === 'fwd' ? Box : Code);
  const randomIosColor = getRandomIosGlassColor();

  // 列表视图
  if (viewMode === 'list') {
    return (
      <div 
        className="group flex items-center gap-4 p-4 rounded-xl hover:shadow-lg hover:shadow-current/25 transition-all border border-gray-200/60"
        style={{
          backgroundColor: `${randomIosColor}85`, // 85%透明度，让颜色更明显
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* 图标 */}
        <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-sm">
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 truncate">
              {widget.name} <span className="text-sm font-normal text-gray-600">v{widget.version}</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-xs bg-white/80 text-gray-700 shadow-xs">
              {widget.type === 'fwd' ? '合集' : '模块'}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate">
            {widget.description}
          </p>
        </div>
        {/* 导入按钮 - 蓝色渐变 */}
        <ImportButton 
          widget={widget} 
          className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
        />
      </div>
    );
  }

  // 网格视图
  return (
    <div 
      className="group relative rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-current/25 transition-all duration-300 border border-gray-200/60"
      style={{
        backgroundColor: `${randomIosColor}85`, // 85%透明度，让彩色更明显
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* 预览区域 */}
      <div className="relative h-48 flex items-center justify-center overflow-hidden">
        {/* 深色网格纹理，在浅色背景上更明显 */}
        <div className="absolute inset-0"
             style={{
               backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`,
               backgroundSize: '24px 24px',
             }}
        />
        {/* 动态背景效果 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 animate-gradient" />
        </div>
        {/* 图标 */}
        <div className="relative z-10 w-20 h-20 bg-white/80 rounded-2xl shadow-md flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
          <Icon className="w-10 h-10 text-gray-700" />
        </div>
        {/* 类型标签 */}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-white/80 text-gray-700 backdrop-blur-xs shadow-xs">
          {widget.type === 'fwd' ? '模块合集' : '模块'}
        </span>
        {/* 文件类型图标 */}
        <span className="absolute top-4 right-4 w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-xs">
          {widget.type === 'fwd' ? (
            <FileJson className="w-4 h-4 text-gray-700" />
          ) : (
            <Code className="w-4 h-4 text-gray-700" />
          )}
        </span>
      </div>
      {/* 内容 */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
            {widget.name} <span className="text-sm font-normal text-gray-600">v{widget.version}</span>
          </h3>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {widget.description}
        </p>
        {/* 导入按钮 - 蓝色渐变，增强视觉效果 */}
        <ImportButton 
          widget={widget} 
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
        />
      </div>
    </div>
  );
}
