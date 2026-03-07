'use client';
import { useState, useMemo } from 'react';
import { WidgetConfig } from '@/types/widget';
import { WidgetCard } from './WidgetCard';
import { Search, Grid3X3, List, Filter, FileJson, Code } from 'lucide-react';

interface WidgetGridProps {
  widgets: WidgetConfig[];
}

export function WidgetGrid({ widgets }: WidgetGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 动态生成分类：全部 + 各个合集分类 + 模块
  const categories = useMemo(() => {
    // 提取所有fwd模块的合集title，去重并断言为字符串数组
    const fwdCategories = (Array.from(new Set(widgets.filter(w => w.type === 'fwd').map(w => w.collectionTitle)))
      .filter(Boolean)) as string[];
    // 统计每个分类的数量
    const categoryCounts = widgets.reduce((acc, widget) => {
      if (widget.type === 'fwd') {
        const key = widget.collectionTitle || widget.category;
        acc[key] = (acc[key] || 0) + 1;
      } else if (widget.type === 'js') {
        acc['js'] = (acc['js'] || 0) + 1;
      }
      acc['all'] = (acc['all'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 构建分类数组
    return [
      { id: 'all', name: '全部', count: categoryCounts['all'] || 0 },
      ...fwdCategories.map(cat => ({
        id: cat,
        name: cat,
        count: categoryCounts[cat] || 0
      })),
      { id: 'js', name: '模块', count: categoryCounts['js'] || 0 }
    ];
  }, [widgets]);

  const filteredWidgets = useMemo(() => {
    return widgets.filter((widget) => {
      const matchesSearch =
        widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        widget.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        widget.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        widget.filename.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesCategory = true;
      if (selectedCategory === 'all') {
        matchesCategory = true;
      } else if (selectedCategory === 'js') {
        matchesCategory = widget.type === 'js';
      } else {
        // 匹配对应的合集分类
        matchesCategory = widget.collectionTitle === selectedCategory;
      }

      return matchesSearch && matchesCategory;
    });
  }, [widgets, searchQuery, selectedCategory]);

  // 统计
  const stats = useMemo(() => ({
    total: widgets.length,
    fwd: widgets.filter(w => w.type === 'fwd').length,
    js: widgets.filter(w => w.type === 'js').length
  }), [widgets]);

  return (
    <div className="space-y-6">
      {/* 搜索和筛选栏 */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* 搜索框 */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索模块名称、描述、标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
          />
        </div>
        {/* 分类筛选 */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {cat.name}
              <span className="ml-1 text-xs opacity-60">({cat.count})</span>
            </button>
          ))}
        </div>
        {/* 视图切换 */}
        <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* 结果统计 */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          找到 <span className="font-medium text-gray-900 dark:text-white">{filteredWidgets.length}</span> 个模块
        </span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <FileJson className="w-4 h-4 text-indigo-500" />
            合集 {stats.fwd}
          </span>
          <span className="flex items-center gap-1">
            <Code className="w-4 h-4 text-emerald-500" />
            模块 {stats.js}
          </span>
        </div>
      </div>
      {/* 网格布局 */}
      <div className={`grid gap-6 ${
        viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
      }`}>
        {filteredWidgets.map((widget) => (
          <WidgetCard key={widget.id} widget={widget} viewMode={viewMode} />
        ))}
      </div>
      {/* 空状态 */}
      {filteredWidgets.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            没有找到相关模块
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            尝试使用其他关键词或清除筛选条件
          </p>
          <button
            onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}
            className="mt-4 px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            清除所有筛选
          </button>
        </div>
      )}
    </div>
  );
}
