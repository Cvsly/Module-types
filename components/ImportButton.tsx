'use client';

import { Download } from 'lucide-react';
import { WidgetConfig } from '@/types/widget';

interface ImportButtonProps {
  widget: WidgetConfig;
  className?: string;
}

export function ImportButton({ widget, className = '' }: ImportButtonProps) {
  const handleImport = () => {
    // 构建 Forward App 导入 URL
    // 尝试多种可能的 URL Scheme 格式
    let url: string;
    
    if (widget.type === 'fwd') {
      // .fwd 合集 - 直接传递下载链接
      const params = new URLSearchParams({
        url: widget.sourceUrl,
        name: widget.name,
        type: 'collection'
      });
      url = `forward://import?${params.toString()}`;
    } else {
      // .js 脚本 - 传递代码或链接
      const params = new URLSearchParams({
        url: widget.sourceUrl,
        name: widget.name,
        type: 'script'
      });
      url = `forward://import?${params.toString()}`;
    }
    
    // 直接跳转
    window.location.href = url;
    
    // 备用方案：延迟尝试其他格式
    setTimeout(() => {
      // 尝试 forwardwidgets://
      const backupUrl = url.replace('forward://', 'forwardwidgets://');
      window.location.href = backupUrl;
    }, 500);
  };

  return (
    <button
      onClick={handleImport}
      className={`group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 ${className}`}
    >
      <Download className="w-5 h-5 group-hover:animate-bounce" />
      <span>导入 Forward</span>
      <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs">
        {widget.type === 'fwd' ? '合集' : '脚本'}
      </span>
    </button>
  );
}
