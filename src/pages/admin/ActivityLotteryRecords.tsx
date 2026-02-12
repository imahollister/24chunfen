import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Download } from 'lucide-react';
import { dataManager } from '../../services/DataManager';
import { Order, Activity } from '../../types';
import { DataTable } from '../../components/admin/DataTable';

export default function ActivityLotteryRecords() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [lotteryRecords, setLotteryRecords] = useState<Order[]>([]);

  useEffect(() => {
    if (id) {
      const act = dataManager.getActivity(id);
      if (act) {
        setActivity(act);
        // In a real app, you might filter orders by activity ID. 
        // Here we just show all lottery records as they are currently global.
        // To make it specific, we would need to add activityId to Order interface.
        // For this demo, we assume all lottery records belong to the current activity context or show all.
        const allOrders = dataManager.getOrders();
        setLotteryRecords(allOrders.filter(o => o.type === 'lottery'));
      }
    }
  }, [id]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "订单ID,奖品名称,中奖用户,收货人,电话,地址,中奖时间\n"
      + lotteryRecords.map(item => 
          `${item.id},${item.productName},User_1,${item.address?.name},${item.address?.phone},${item.address?.address},${item.time}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lottery_records_${activity?.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      header: '记录ID',
      accessor: (item: Order) => <span className="text-gray-500 font-mono text-xs">{item.id}</span>
    },
    {
      header: '奖品名称',
      accessor: (item: Order) => (
        <div className="font-bold text-gray-800 flex items-center gap-2">
          <Gift className="w-4 h-4 text-red-500" />
          {item.productName}
        </div>
      )
    },
    {
      header: '中奖用户',
      accessor: () => <span className="text-gray-600">User_1</span>
    },
    {
      header: '收货信息',
      accessor: (item: Order) => (
        <div>
          <div>{item.address?.name}</div>
          <div className="text-xs text-gray-400">{item.address?.phone}</div>
          <div className="text-xs text-gray-400 line-clamp-1" title={item.address?.address}>{item.address?.address}</div>
        </div>
      )
    },
    {
      header: '中奖时间',
      accessor: 'time' as keyof Order
    }
  ];

  if (!activity) return <div>加载中...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/activities')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {activity.name}
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">中奖记录</span>
            </h1>
          </div>
        </div>
        
        <button 
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700 shadow-sm"
        >
          <Download className="w-4 h-4" />
          导出记录
        </button>
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center gap-3 text-orange-800 text-sm">
        <Gift className="w-5 h-5" />
        <p>这里显示该活动下所有用户的抽奖中奖记录（实物奖品）。您可以在此导出数据进行发货。</p>
      </div>

      <DataTable 
        data={lotteryRecords}
        columns={columns}
        searchPlaceholder="搜索奖品或用户..."
      />
    </div>
  );
}
