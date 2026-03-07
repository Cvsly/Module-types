'use client';
import { Download } from 'lucide-react';
import { WidgetConfig } from '@/types/widget';

interface ImportButtonProps {
  widget: WidgetConfig;
  className?: string;
}

export function ImportButton({ widget, className = '' }: ImportButtonProps) {
  const handleImport = () => {
    let url: string;
    
    if (widget.type === 'fwd' && widget.isCollection) {
      // 合集中的单个模块 - 直接使用原sourceUrl
      url = `forward://widget?url=${encodeURIComponent(widget.sourceUrl)}`;
    } else if (widget.type === 'fwd') {
      // .fwd 合集 - 直接传递下载链接
      url = `forward://widget?url=${encodeURIComponent(widget.sourceUrl)}`;
    } else {
      // .js 脚本 - 直接使用URL方式导入
      url = `forward://widget?url=${encodeURIComponent(widget.sourceUrl)}`;
    }
    
    // 创建a标签来唤起App
    const link = document.createElement('a');
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // 模拟点击
    link.click();
    
    // 移除a标签
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleImport}
      className={`group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 ${className}`}
    >
      <Download className="w-5 h-5 group-hover:animate-bounce" />
      <span>导入 Forward</span>
      <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs">
        {widget.isCollection ? '合集模块' : widget.type === 'fwd' ? '合集' : '模块'}
      </span>
    </button>
  );
}
