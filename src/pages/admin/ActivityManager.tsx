import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Calendar, Eye, Gift } from 'lucide-react';
import { dataManager } from '../../services/DataManager';
import { Activity } from '../../types';
import { DataTable } from '../../components/admin/DataTable';

export default function ActivityManager() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setActivities([...dataManager.getActivities()]);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个活动吗？')) {
      dataManager.deleteActivity(id);
      setActivities([...dataManager.getActivities()]);
    }
  };

  const columns = [
    {
      header: '活动名称',
      accessor: (item: Activity) => (
        <div>
          <div className="font-bold text-gray-800 text-base">{item.name}</div>
          <div className="text-xs text-gray-400">ID: {item.id}</div>
        </div>
      )
    },
    {
      header: '节气类型',
      accessor: (item: Activity) => (
        <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold border border-green-100">
          {item.termType}
        </span>
      )
    },
    {
      header: '互动形式',
      accessor: (item: Activity) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-medium">
            {item.interaction.type === 'vote' ? '投票PK' : '趣味答题'}
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
            {item.interaction.type === 'vote' ? `${item.interaction.voteOptions?.length || 0}选项` : `${item.interaction.questions?.length || 0}题`}
          </span>
        </div>
      )
    },
    {
      header: '时间段',
      accessor: (item: Activity) => (
        <span className="text-gray-500">
          {item.startTime} ~ {item.endTime}
        </span>
      )
    },
    {
      header: '状态',
      accessor: (item: Activity) => (
        item.isActive ? (
          <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            进行中
          </span>
        ) : (
          <span className="text-gray-400 text-xs font-medium">已结束</span>
        )
      )
    },
    {
      header: '操作',
      accessor: (item: Activity) => (
        <div className="flex items-center justify-end gap-2">
          <Link 
            to={`/admin/activities/${item.id}`}
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
            title="编辑"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => handleDelete(item.id)}
            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Link
            to={`/mobile/activity?activityId=${item.id}`}
            target="_blank"
            className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
            title="预览"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
             to={`/admin/activities/${item.id}/lottery`}
             className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition-colors"
             title="中奖记录"
          >
             <Gift className="w-4 h-4" />
          </Link>
        </div>
      ),
      className: 'text-right'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">节气活动管理</h1>
        <Link
          to="/admin/activities/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          创建新活动
        </Link>
      </div>

      <DataTable 
        data={activities}
        columns={columns}
        searchPlaceholder="搜索活动名称..."
      />
    </div>
  );
}
