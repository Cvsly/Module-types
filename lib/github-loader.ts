cat > /home/user/.super_doubao/super-doubao-runtime/workspace/Module-types/lib/github-loader.ts << 'EOF'
import { WidgetConfig } from '@/types/widget';

const GITHUB_API_BASE = 'https://api.github.com/repos/Cvsly/Module-widgets';

/**
 * 获取目录下所有文件列表
 */
export async function getWidgetFiles(): Promise<any[]> {
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
 * 支持多种格式:
 * 1. {widgets: [...]} - 标准格式
 * 2. [...] - 直接是数组
 * 3. {name, modules: [...]} - 其他变体
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

    const data = await response.json();
    let widgetsArray: any[] = [];

    // 处理不同格式
    if (Array.isArray(data)) {
      // 直接是数组
      widgetsArray = data;
    } else if (data.widgets && Array.isArray(data.widgets)) {
      // 标准格式 {widgets: [...]}
      widgetsArray = data.widgets;
    } else if (data.modules && Array.isArray(data.modules)) {
      // 变体 {modules: [...]}
      widgetsArray = data.modules;
    } else {
      console.error(`Unknown .fwd file structure in ${filename}:`, Object.keys(data));
      return [];
    }

    return widgetsArray.map((widget, index) => ({
      id: `fwd-${filename.replace('.fwd', '')}-${index}`,
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

  return widgets.sort((a, b) => {
    const nameA = a.name || '';
    const nameB = b.name || '';
    if (a.type !== b.type) return a.type === 'fwd' ? -1 : 1;
    return nameA.localeCompare(nameB);
  });
}

export async function getWidgetById(id: string): Promise<WidgetConfig | null> {
  const widgets = await loadAllWidgets();
  return widgets.find(w => w.id === id) || null;
}
EOF
