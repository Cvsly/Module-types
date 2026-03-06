'use client';
import { Download } from 'lucide-react';
import { WidgetConfig } from '@/types/widget';
import { useState } from 'react';

interface ImportButtonProps {
  widget: WidgetConfig;
  className?: string;
}

export function ImportButton({ widget, className = '' }: ImportButtonProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleImport = async () => {
    let url: string;

    if (widget.type === 'fwd') {
      // .fwd 合集 - 使用正确的URL Scheme格式
      url = `forward://import?url=${encodeURIComponent(widget.sourceUrl)}&type=collection&name=${encodeURIComponent(widget.name)}`;
    } else {
      // .js 脚本 - 直接使用URL方式导入，不使用base64编码
      url = `forward://import?url=${encodeURIComponent(widget.sourceUrl)}&type=script&name=${encodeURIComponent(widget.name)}`;
    }

    // 创建a标签来唤起App
    const link = document.createElement('a');
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);

    // 设置超时，处理唤起失败的情况
    const timeout = setTimeout(() => {
      document.body.removeChild(link);
      // 显示提示，告诉用户唤起失败，可以复制链接
      setToastMessage('未检测到 Forward 应用，链接已复制到剪贴板');
      setShowToast(true);
      // 复制链接到剪贴板
      navigator.clipboard.writeText(url).catch(err => {
        console.error('复制链接失败:', err);
        setToastMessage('未检测到 Forward 应用，唤起失败，请手动复制链接');
      });
      // 3秒后隐藏提示
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);

    // 监听点击事件，当唤起成功时清除超时
    const handleClick = () => {
      clearTimeout(timeout);
      document.body.removeChild(link);
    };

    link.addEventListener('click', handleClick);
    // 模拟点击
    link.click();
  };

  return (
    <>
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
      {/* 提示框 */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-4 shadow-lg z-50 max-w-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">提示</h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>{toastMessage}</p>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <button onClick={() => setShowToast(false)} className="inline-flex text-yellow-400 hover:text-yellow-500">
                <span className="sr-only">关闭</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
