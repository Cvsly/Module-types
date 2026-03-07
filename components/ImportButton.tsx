'use client';
import { Download } from 'lucide-react';
import { WidgetConfig } from '@/types/widget';
interface ImportButtonProps {
  widget: WidgetConfig;
  className?: string;
}
export function ImportButton({ widget, className = '' }: ImportButtonProps) {
  const handleImport = () => {
    // 所有模块都直接使用自己的sourceUrl导入
    const url = `forward://widget?url=${encodeURIComponent(widget.sourceUrl)}`;
    
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
      <span>添加</span>
    </button>
  );
}
