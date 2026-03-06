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
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 确保返回数组
    if (!Array.isArray(data)) {
      console.error('GitHub API returned non-array:', data);
      return [];
    }
    
    return data.filter((item) => 
      item.type === 'file' && 
      (item.name.endsWith('.fwd') || item.name.endsWith('.js')) &&
      item.download_url
    );
  } catch (error) {
    console.error('Error fetching widget files:', error);
    return [];
  }
}

/**
 * 加载 .fwd 合集文件
 */
export async function loadFwdCollection(url: string, filename: string): Promise<WidgetConfig[]> {
  try {
    const response = await fetch(url, { 
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const collection: FwdCollection = await response.json();
    
    // 验证数据结构
    if (!collection.widgets || !Array.isArray(collection.widgets)) {
      console.error(`Invalid .fwd file ${filename}: missing widgets array`);
      return [];
    }
    
    return collection.widgets.map((widget, index) => ({
      id: `fwd-${filename.replace('.fwd', '')}-${index}`,
      name: widget.name || `未命名模块${index + 1}`,
      description: widget.description || '',
      category: widget.category || 'custom',
      icon: widget.icon || 'Box',
      author: widget.author || 'Unknown',
      version: widget.version || '1.0.0',
      config: widget.config || {},
      size: widget.size || 'medium',
      tags: Array.isArray(widget.tags) ? widget.tags : [],
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
      next: { revalidate: 60 },
      headers: { 'Accept': 'text/plain' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
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
      tags: Array.isArray(meta.tags) ? meta.tags : ['脚本', 'JS'],
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
function parseJsMeta(code: string, filename: string): Partial<WidgetConfig> & { [key: string]: any } {
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
      meta[key] = value.split(',').map((t: string) => t.trim()).filter(Boolean);
    } else if (key === 'size') {
      meta[key] = value.trim() as any;
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
  
  if (files.length === 0) {
    console.log('No widget files found');
    return [];
  }
  
  const widgets: WidgetConfig[] = [];
  
  for (const file of files) {
    if (!file.download_url) continue;
    
    try {
      if (file.name.endsWith('.fwd')) {
        const collection = await loadFwdCollection(file.download_url, file.name);
        widgets.push(...collection);
      } else if (file.name.endsWith('.js')) {
        const module = await loadJsModule(file.download_url, file.name);
        if (module) widgets.push(module);
      }
    } catch (e) {
      console.error(`Failed to load ${file.name}:`, e);
    }
  }
  
  // 安全排序，确保 name 存在
  return widgets.sort((a, b) => {
    const nameA = a.name || '';
    const nameB = b.name || '';
    if (a.type !== b.type) return a.type === 'fwd' ? -1 : 1;
    return nameA.localeCompare(nameB);
  });
}

/**
 * 根据 ID 获取单个模块
 */
export async function getWidgetById(id: string): Promise<WidgetConfig | null> {
  const widgets = await loadAllWidgets();
  return widgets.find(w => w.id === id) || null;
}
