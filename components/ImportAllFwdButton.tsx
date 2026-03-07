'use client';
import { Download } from 'lucide-react';

interface ImportAllFwdButtonProps {
  fwdUrls: string[];
}

export function ImportAllFwdButton({ fwdUrls }: ImportAllFwdButtonProps) {
  const handleImportAll = () => {
    fwdUrls.forEach(url => {
      // 导入合集文件，使用forward协议唤起App
      const importUrl = `forward://widget?url=${encodeURIComponent(url)}`;
      const link = document.createElement('a');
      link.href = importUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <button
      onClick={handleImportAll}
      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
    >
      <Download className="w-4 h-4" />
      <span>一键导入所有合集模块</span>
    </button>
  );
}
