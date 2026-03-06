export interface WidgetConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  author: string;
  version: string;
  config: any;
  size: string;
  tags: string[];
  downloads: number;
  createdAt: string;
  sourceUrl: string;
  type: WidgetType;
  filename: string;
  // 新增字段：标识是否是合集中的模块
  isCollection?: boolean;
  // 新增字段：模块在合集中的索引
  collectionIndex?: number;
}

export type WidgetType = 'fwd' | 'js';
