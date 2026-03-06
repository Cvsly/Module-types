export type WidgetCategory = string;
export type WidgetSize = 'small' | 'medium' | 'large';
export type WidgetType = 'fwd' | 'js';
export interface WidgetConfig {
  // 基础信息
  id: string;
  name: string;
  description: string;
  category: WidgetCategory;
  icon: string;
  
  // 版本信息
  author: string;
  version: string;
  createdAt: string;
  
  // 配置数据
  config: Record<string, any>;
  size: WidgetSize;
  tags: string[];
  downloads: number;
  
  // 来源信息
  sourceUrl: string;
  type: WidgetType;
  filename: string;
}
export interface FwdCollection {
  name: string;
  version: string;
  author: string;
  description: string;
  widgets: Array<{
    name: string;
    description: string;
    category: WidgetCategory;
    icon: string;
    author: string;
    version: string;
    config: Record<string, any>;
    size: WidgetSize;
    tags: string[];
  }>;
}
// GitHub API 响应类型
export interface GitHubContentItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir';
  content?: string;
  encoding?: string;
}
