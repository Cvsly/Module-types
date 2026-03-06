import { WidgetConfig, FwdCollection, GitHubContentItem } from '@/types/widget';

const GITHUB_API_BASE = 'https://api.github.com/repos/Cvsly/Module-widgets';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/Cvsly/Module-widgets/main/widgets';

/**
 * 获取目录下所有文件列表
 */
export async function getWidgetFiles(): Promise<GitHubContentItem[]> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/contents/widgets?ref=main`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Forward-Hub-App'
      },
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data: GitHubContentItem[] = await response.json();
    return data.filter((item) => 
      item.type === 'file' && 
      (item.name.endsWith('.fwd') || item.name.endsWith('.js')) &&
      item.download_url
    );
  } catch (error) {
    console.error('Error fetching widget files:', error);
    // 备用：直接返回已知文件
    return [
      {
        name: 'AllInOne.fwd',
        path: 'widgets/AllInOne.fwd',
        sha: '',
        size: 0,
        url: '',
        html_url: '',
        git_url: '',
        download_url: `${GITHUB_RAW_BASE}/AllInOne.fwd`,
        type: 'file'
      },
      {
        name: 'ai.js',
        path: 'widgets/ai.js',
        sha: '',
        size: 0,
        url: '',
        html_url: '',
        git_url: '',
        download_url: `${GITHUB_RAW_BASE}/ai.js`,
        type: 'file'
      }
    ] as GitHubContentItem[];
  }
}

/**
 * 加载 .fwd 合集文件
 */
export async function loadFwdCollection(url: string, filename: string): Promise<WidgetConfig[]> {
  try {
    const response = await fetch(url, { 
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const collection: FwdCollection = await response.json();
    
    return collection.widgets.map((widget, index) => ({
      id: `fwd-${filename.replace('.fwd', '')}-${index}`,
      name: widget.name,
      description: widget.description,
      category: widget.category,
      icon: widget.icon,
      author: widget.author,
      version: widget.version,
      config: widget.config,
      size: widget.size,
      tags: widget.tags,
      downloads: 0,
      createdAt: new Date().toISOString(),
      sourceUrl: url,
      type: 'fwd',
      filename: filename
    }));
  } catch (error) {
    console.error(`Error parsing .fwd file ${filename}:`, error);
    return [];
  }
}

/**
 * 加载单个 .js 文件
 */
export async function loadJsModule(url: string, filename: string): Promise<WidgetConfig | null> {
  try {
    const response = await fetch(url, { 
      next: { revalidate: 3600 },
      headers: { 'Accept': 'text/plain' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const code = await response.text();
    const meta = parseJsMeta(code, filename);
    
    return {
      id: `js-${filename.replace('.js', '')}-${Date.now()}`,
      name: meta.name || filename.replace('.js', ''),
      description: meta.description || 'Forward JavaScript 模块',
      category: meta.category || 'custom',
      icon: meta.icon || 'Code',
      author: meta.author || 'Unknown',
      version: meta.version || '1.0.0',
      config: {
        type: 'script',
        code: code,
        language: 'javascript',
        filename: filename
      },
      size: meta.size || 'medium',
      tags: meta.tags || ['脚本', 'JS'],
      downloads: 0,
      createdAt: meta.createdAt || new Date().toISOString(),
      sourceUrl: url,
      type: 'js',
      filename: filename
    };
  } catch (error) {
    console.error(`Error loading JS module ${filename}:`, error);
    return null;
  }
}

/**
 * 解析 JS 文件头部的元数据注释
 */
function parseJsMeta(code: string, filename: string): Partial<WidgetConfig> {
  const meta: Partial<WidgetConfig> & { [key: string]: any } = {};
  
  // 匹配多行注释 /** ... */
  const commentMatch = code.match(/\/\*\*([\s\S]*?)\*\//);
  if (!commentMatch) return meta;
  
  const comment = commentMatch[1];
  
  // 提取 @key value 格式
  const regex = /@(\w+)\s+(.+)/g;
  let match;
  
  while ((match = regex.exec(comment)) !== null) {
    const [, key, value] = match;
    
    if (key === 'tags') {
      meta[key] = value.split(',').map(t => t.trim()).filter(Boolean);
    } else if (key === 'size') {
      meta[key] = value as any;
    } else {
      meta[key] = value.trim();
    }
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
    if (!file.download_url) continue;
    
    if (file.name.endsWith('.fwd')) {
      const collection = await loadFwdCollection(file.download_url, file.name);
      widgets.push(...collection);
    } else if (file.name.endsWith('.js')) {
      const module = await loadJsModule(file.download_url, file.name);
      if (module) widgets.push(module);
    }
  }
  
  // 排序：合集在前，然后按名称
  return widgets.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'fwd' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * 根据 ID 获取单个模块
 */
export async function getWidgetById(id: string): Promise<WidgetConfig | null> {
  const widgets = await loadAllWidgets();
  return widgets.find(w => w.id === id) || null;
}
