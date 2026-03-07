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
      try {
        const filePath = path.join(widgetsDir, file);
        const stats = fs.statSync(filePath);
        if (!stats.isFile()) continue;
        // 使用部署域名+文件路径作为sourceUrl
        const sourceUrl = `${baseUrl}/widgets/${file}`;
        if (file.endsWith('.fwd')) {
          // 加载.fwd合集，将每个模块拆分为单独的WidgetConfig
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
          // 将合集中的每个模块拆分为单独的WidgetConfig
          for (let i = 0; i < widgetsArray.length; i++) {
            const widget = widgetsArray[i];
            // 优先使用模块自己的sourceUrl，如果没有则使用合集URL+参数
            let moduleSourceUrl = widget.sourceUrl || widget.url;
            if (!moduleSourceUrl) {
              // 直接使用合集URL+参数，不转换为base64
              moduleSourceUrl = `${sourceUrl}?index=${i}`;
            }
            const widgetConfig: WidgetConfig = {
              id: `fwd-${file.replace('.fwd', '')}-${i}`,
              name: widget.name || widget.title || `模块${i + 1}`,
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
              sourceUrl: moduleSourceUrl,
              type: 'fwd' as WidgetType,
              filename: file,
              // 标识这是合集中的模块
              isCollection: true,
              // 模块在合集中的索引
              collectionIndex: i
            };
            widgets.push(widgetConfig);
          }
        } else if (file.endsWith('.js')) {
          // 加载.js模块
          console.log('Processing js file:', file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const meta = parseJsMeta(content, file);
          console.log('Parsed meta for js file:', meta);
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
          console.log('Added js widget:', widget);
          widgets.push(widget);
        }
      } catch (fileError) {
        console.error(`Error processing file ${file}:`, fileError);
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
  // 先尝试解析注释里的元数据
  const commentMatch = code.match(/\/\*\*([\s\S]*?)\*\//);
  if (commentMatch) {
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
  }
  // 如果注释里没有元数据，直接从代码中提取字段（参考.fwd的处理方式）
  if (Object.keys(meta).length === 0) {
    // 提取title/name
    const titleMatch = code.match(/(title|name)\s*:\s*["']([^"']+)["']/);
    if (titleMatch) {
      meta.name = titleMatch[2];
    }
    // 提取version
    const versionMatch = code.match(/version\s*:\s*["']([^"']+)["']/);
    if (versionMatch) {
      meta.version = versionMatch[1];
    }
    // 提取author
    const authorMatch = code.match(/author\s*:\s*["']([^"']+)["']/);
    if (authorMatch) {
      meta.author = authorMatch[1];
    }
    // 提取description
    const descMatch = code.match(/(description|desc)\s*:\s*["']([^"']+)["']/);
    if (descMatch) {
      meta.description = descMatch[2];
    }
    // 提取category/type
    const typeMatch = code.match(/(type|category)\s*:\s*["']([^"']+)["']/);
    if (typeMatch) {
      meta.category = typeMatch[2];
    }
  }
  // 兜底处理：如果还是没有元数据，使用文件名作为名称
  if (!meta.name) {
    meta.name = filename.replace('.js', '');
  }
  if (!meta.version) {
    meta.version = '1.0.0';
  }
  return meta;
}
