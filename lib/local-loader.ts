import { WidgetConfig, WidgetType } from '@/types/widget';
import fs from 'fs';
import path from 'path';

/**
 * 加载本地widgets目录下的所有模块
 */
export async function loadLocalWidgets(): Promise<WidgetConfig[]> {
  const widgetsDir = path.join(process.cwd(), 'public', 'widgets');
  const widgets: WidgetConfig[] = [];
  // 获取部署的基础URL，默认是本地开发地址
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    // 读取目录下的所有文件
    const files = fs.readdirSync(widgetsDir);
    for (const file of files) {
      const filePath = path.join(widgetsDir, file);
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) continue;

      // 使用部署域名+文件路径作为sourceUrl
      const sourceUrl = `${baseUrl}/widgets/${file}`;

      if (file.endsWith('.fwd')) {
        // 加载.fwd合集
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        let widgetsArray: any[] = [];
        // 处理不同格式
        if (Array.isArray(data)) {
          widgetsArray = data;
        } else if (data.widgets && Array.isArray(data.widgets)) {
          widgetsArray = data.widgets;
        } else if (data.modules && Array.isArray(data.modules)) {
          widgetsArray = data.modules;
        } else {
          console.error(`Unknown .fwd file structure in ${file}:`, Object.keys(data));
          continue;
        }
        const collectionWidgets = widgetsArray.map((widget, index) => ({
          id: `fwd-${file.replace('.fwd', '')}-${index}`,
          name: widget.name || widget.title || `模块${index + 1}`,
          description: widget.description || widget.desc || '',
          category: widget.category || widget.type || 'custom',
          icon: widget.icon || widget.iconName || 'Box',
          author: widget.author || widget.creator || 'Unknown',
          version: widget.version || widget.ver || '1.0.0',
          config: widget.config || widget.data || widget,
          size: widget.size || 'medium',
          tags: Array.isArray(widget.tags) ? widget.tags :
                Array.isArray(widget.tag) ? widget.tag : [],
          downloads: 0,
          createdAt: stats.birthtime.toISOString(),
          sourceUrl: sourceUrl,
          type: 'fwd' as WidgetType,
          filename: file
        }));
        widgets.push(...collectionWidgets);
      } else if (file.endsWith('.js')) {
        // 加载.js模块
        const content = fs.readFileSync(filePath, 'utf-8');
        const meta = parseJsMeta(content, file);
        const widget: WidgetConfig = {
          id: `js-${file.replace('.js', '')}-${stats.mtime.getTime()}`,
          name: meta.name || file.replace('.js', ''),
          description: meta.description || 'Forward JavaScript 模块',
          category: meta.category || 'custom',
          icon: meta.icon || 'Code',
          author: meta.author || 'Unknown',
          version: meta.version || '1.0.0',
          config: {
            type: 'script',
            code: content,
            language: 'javascript',
            filename: file
          },
          size: meta.size || 'medium',
          tags: Array.isArray(meta.tags) ? meta.tags : ['脚本', 'JS'],
          downloads: 0,
          createdAt: stats.birthtime.toISOString(),
          sourceUrl: sourceUrl,
          type: 'js' as WidgetType,
          filename: file
        };
        widgets.push(widget);
      }
    }
  } catch (error) {
    console.error('Error loading local widgets:', error);
  }
  return widgets.sort((a, b) => {
    const nameA = a.name || '';
    const nameB = b.name || '';
    if (a.type !== b.type) return a.type === 'fwd' ? -1 : 1;
    return nameA.localeCompare(nameB);
  });
}

/**
 * 解析 JS 文件头部的元数据注释
 */
function parseJsMeta(code: string, filename: string): Partial<WidgetConfig> & { [key: string]: any } {
  const meta: Partial<WidgetConfig> & { [key: string]: any } = {};

  const commentMatch = code.match(/\/\*\*([\s\S]*?)\*\//);
  if (!commentMatch) return meta;

  const comment = commentMatch[1];
  const regex = /@(\w+)\s+(.+)/g;
  let match;

  while ((match = regex.exec(comment)) !== null) {
    const [, key, value] = match;

    if (key === 'tags') {
      meta[key] = value.split(',').map((t: string) => t.trim()).filter(Boolean);
    } else if (key === 'size') {
      meta[key] = value.trim() as any;
    } else {
      meta[key] = value.trim();
    }
  }

  return meta;
}
