import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchPlaceholder?: string;
  filterOptions?: { label: string; value: string }[];
  onFilterChange?: (value: string) => void;
  actions?: React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  pageSize = 10,
  searchPlaceholder = '搜索...',
  filterOptions,
  onFilterChange,
  actions
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSize, setCurrentSize] = useState(pageSize);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');

  // Filter and Search Logic
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (filterValue !== 'all' && onFilterChange) {
         // Parent handles logic if onFilterChange is provided, 
         // but here we might need to filter if parent doesn't handle "data" prop update
         // For this simple component, we assume 'onFilterChange' just notifies parent
         // OR we implement simple local filtering if needed. 
         // BUT, looking at usage, parent passes ALL data.
         // Let's assume for now filterValue is handled by parent pre-filtering data OR
         // we add a simple local check: if the item has a 'status' field matching filterValue.
         if ('status' in item && (item as any).status !== filterValue) {
             return false;
         }
      }
      
      return matchesSearch;
    });
  }, [data, searchTerm, filterValue]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / currentSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * currentSize,
    currentPage * currentSize
  );

  const handleFilterClick = (value: string) => {
    setFilterValue(value);
    if (onFilterChange) onFilterChange(value);
    setCurrentPage(1); 
  };
  
  // Generate Page Numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Max buttons to show
    
    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
    }
    return pages;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          {/* Filters */}
          {filterOptions && (
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {filterOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleFilterClick(opt.value)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    filterValue === opt.value 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom Actions (e.g. Add Button) */}
        {actions && <div>{actions}</div>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`p-4 font-medium ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                {columns.map((col, idx) => (
                  <td key={idx} className={`p-4 ${col.className || ''}`}>
                    {typeof col.accessor === 'function' 
                      ? col.accessor(item)
                      : (item[col.accessor] as React.ReactNode)
                    }
                  </td>
                ))}
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="p-10 text-center text-gray-400">
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
             <div className="text-xs text-gray-500">
                共 {filteredData.length} 条
             </div>
             <select 
                value={currentSize} 
                onChange={e => { setCurrentSize(Number(e.target.value)); setCurrentPage(1); }}
                className="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
             >
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
             </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
                {getPageNumbers().map((p, i) => (
                    <button
                        key={i}
                        onClick={() => typeof p === 'number' && setCurrentPage(p)}
                        disabled={typeof p !== 'number'}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all ${
                            p === currentPage 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : typeof p === 'number' 
                                    ? 'hover:bg-gray-200 text-gray-600'
                                    : 'text-gray-400 cursor-default'
                        }`}
                    >
                        {p}
                    </button>
                ))}
            </div>

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
