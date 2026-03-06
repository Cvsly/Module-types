import { WidgetConfig, FwdCollection } from '@/types/widget';

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/Cvsly/Module-widgets/refs/heads/main/widgets';

/**
 * 获取目录下所有文件列表
 * 通过 GitHub API 获取目录内容
 */
export async function getWidgetFiles(): Promise<{name: string, download_url: string}[]> {
  try {
    // 使用 GitHub API 获取目录内容
    const response = await fetch('https://api.github.com/repos/Cvsly/Module-widgets/contents/widgets?ref=main', {
      next: { revalidate: 3600 } // 1小时缓存
    });
    
    if (!response.ok) throw new Error('Failed to fetch directory');
    
    const data = await response.json();
    return data.filter((item: any) => 
      item.type === 'file' && 
      (item.name.endsWith('.fwd') || item.name.endsWith('.js'))
    );
  } catch (error) {
    console.error('Error fetching widget files:', error);
    return [];
  }
}

/**
 * 加载 .fwd 合集文件
 */
export async function loadFwdCollection(url: string): Promise<WidgetConfig[]> {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Failed to load .fwd file');
    
    const collection: FwdCollection = await response.json();
    
    return collection.widgets.map((widget, index) => ({
      ...widget,
      id: `fwd-${collection.name}-${index}`,
      sourceUrl: url,
      type: 'fwd',
      filename: url.split('/').pop() || 'unknown.fwd',
      downloads: 0,
      createdAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error parsing .fwd file:', error);
    return [];
  }
}

/**
 * 加载单个 .js 文件
 * 从 JS 文件注释中提取元数据
 */
export async function loadJsModule(url: string, filename: string): Promise<WidgetConfig | null> {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Failed to load .js file');
    
    const code = await response.text();
    
    // 解析 JS 文件头部的注释元数据
    const meta = parseJsMeta(code, filename);
    
    return {
      id: `js-${filename.replace('.js', '')}`,
      name: meta.name || filename.replace('.js', ''),
      description: meta.description || 'Forward 脚本模块',
      category: meta.category || 'custom',
      icon: meta.icon || 'Code',
      author: meta.author || 'Unknown',
      version: meta.version || '1.0.0',
      config: {
        type: 'script',
        code: code,
        language: 'javascript'
      },
      size: meta.size || 'medium',
      tags: meta.tags || ['脚本'],
      downloads: 0,
      createdAt: meta.createdAt || new Date().toISOString(),
      sourceUrl: url,
      type: 'js',
      filename: filename
    };
  } catch (error) {
    console.error('Error loading JS module:', error);
    return null;
  }
}

/**
 * 解析 JS 文件头部的元数据注释
 * 格式示例：
 * /**
 *  * @name AI 助手
 *  * @description 智能 AI 对话组件
 *  * @category ai
 *  * @author Cvsly
 *  * @version 1.0.0
 *  * @icon MessageSquare
 *  * @tags AI,聊天,智能
 *  * /
 */
function parseJsMeta(code: string, filename: string): Partial<WidgetConfig> {
  const meta: Partial<WidgetConfig> = {};
  
  // 匹配多行注释
  const commentMatch = code.match(/\/\*\*([\s\S]*?)\*\//);
  if (!commentMatch) return meta;
  
  const comment = commentMatch[1];
  
  // 提取各个字段
  const fields: Record<string, keyof typeof meta> = {
    '@name': 'name',
    '@description': 'description',
    '@category': 'category',
    '@author': 'author',
    '@version': 'version',
    '@icon': 'icon',
    '@size': 'size'
  };
  
  Object.entries(fields).forEach(([tag, key]) => {
    const match = comment.match(new RegExp(`${tag}\\s+(.+)`));
    if (match) {
      (meta as any)[key] = match[1].trim();
    }
  });
  
  // 特殊处理 tags
  const tagsMatch = comment.match(/@tags\s+(.+)/);
  if (tagsMatch) {
    meta.tags = tagsMatch[1].split(',').map(t => t.trim());
  }
  
  return meta;
}

/**
 * 加载所有模块
 */
export async function loadAllWidgets(): Promise<WidgetConfig[]> {
  const files = await getWidgetFiles();
  const widgets: WidgetConfig[] = [];
  
  for (const file of files) {
    if (file.name.endsWith('.fwd')) {
      const collection = await loadFwdCollection(file.download_url);
      widgets.push(...collection);
    } else if (file.name.endsWith('.js')) {
      const module = await loadJsModule(file.download_url, file.name);
      if (module) widgets.push(module);
    }
  }
  
  return widgets.sort((a, b) => {
    // 优先显示 fwd 合集，然后按名称排序
    if (a.type !== b.type) return a.type === 'fwd' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}
