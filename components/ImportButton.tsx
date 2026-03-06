'use client';

import { Download } from 'lucide-react';
import { WidgetConfig } from '@/types/widget';

interface ImportButtonProps {
  widget: WidgetConfig;
  className?: string;
}

export function ImportButton({ widget, className = '' }: ImportButtonProps) {
  const handleImport = () => {
    // 构建导入 payload
    let payload: any;
    
    if (widget.type === 'fwd') {
      // .fwd 合集格式
      payload = {
        type: 'collection',
        action: 'import',
        data: widget.config,
        meta: {
          name: widget.name,
          source: widget.sourceUrl
        }
      };
    } else {
      // .js 脚本格式
      payload = {
        type: 'script',
        action: 'install',
        data: {
          code: widget.config.code,
          name: widget.name,
          description: widget.description
        },
        meta: {
          filename: widget.filename,
          source: widget.sourceUrl
        }
      };
    }
    
    // Base64 编码
    const encoded = btoa(JSON.stringify(payload));
    
    // 直接跳转 Forward，不做检测
    const url = `forward://import?config=${encoded}`;
    window.location.href = url;
    
    // 备用方案：延迟后尝试备用 scheme
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        // 如果还在当前页面，尝试备用格式
        window.location.href = `forward://add?data=${encoded}`;
      }
    }, 1000);
  };

  return (
    <button
      onClick={handleImport}
      className={`group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 ${className}`}
    >
      <Download className="w-5 h-5 group-hover:animate-bounce" />
      <span>导入 Forward</span>
      <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs">
        {widget.type === 'fwd' ? '合集' : '脚本'}
      </span>
    </button>
  );
}
