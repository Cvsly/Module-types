export interface WidgetConfig {
  id: string;
  name: string;
  description: string;
  category: 'douban' | 'trakt' | 'tv' | 'calendar' | 'danmu' | 'custom' | 'ai' | 'tool';
  icon: string;
  author: string;
  version: string;
  config: Record<string, any>;
  size: 'small' | 'medium' | 'large';
  tags: string[];
  downloads: number;
  createdAt: string;
  sourceUrl: string;      // GitHub raw 链接
  type: 'fwd' | 'js';     // 文件类型
  filename: string;        // 原始文件名
}

export interface FwdCollection {
  name: string;
  version: string;
  author: string;
  description: string;
  widgets: WidgetConfig[];
}
