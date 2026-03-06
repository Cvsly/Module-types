'use client';
import { Download } from 'lucide-react';
import { WidgetConfig } from '@/types/widget';
interface ImportButtonProps {
  widget: WidgetConfig;
  className?: string;
}
export function ImportButton({ widget, className = '' }: ImportButtonProps) {
  const handleImport = async () => {
    let url: string;
    
    if (widget.type === 'fwd') {
      // .fwd 合集 - 直接传递下载链接，使用和原始代码一致的参数格式
      const params = new URLSearchParams({
        url: widget.sourceUrl,
        name: widget.name,
        type: 'collection'
      });
      url = `forward://import?${params.toString()}`;
    } else {
      // .js 脚本 - 尝试传递base64编码的代码
      try {
        const response = await fetch(widget.sourceUrl);
        const code = await response.text();
        // 将代码转换为base64编码
        const base64Code = btoa(unescape(encodeURIComponent(code)));
        const params = new URLSearchParams({
          code: base64Code,
          name: widget.name,
          type: 'script'
        });
        url = `forward://import?${params.toString()}`;
      } catch (error) {
        console.error('获取模块代码失败:', error);
        // 如果获取失败，使用原来的URL方式
        const params = new URLSearchParams({
          url: widget.sourceUrl,
          name: widget.name,
          type: 'script'
        });
        url = `forward://import?${params.toString()}`;
      }
    }
    
    // 直接跳转，使用原始代码的方式
    window.location.href = url;
    
    // 备用方案：延迟尝试其他格式，使用原始代码的forwardwidgets://格式
    setTimeout(() => {
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
        {widget.type === 'fwd' ? '合集' : '模块'}
      </span>
    </button>
  );
}
