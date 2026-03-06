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
  isCollection?: boolean;
  collectionIndex?: number;
}

export type WidgetType = 'fwd' | 'js';
