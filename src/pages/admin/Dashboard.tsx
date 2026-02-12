import { useEffect, useState } from 'react';
import { Calendar, ShoppingBag, Users, Coins } from 'lucide-react';
import { dataManager } from '../../services/DataManager';

export default function Dashboard() {
  const [stats, setStats] = useState({
    activityCount: 0,
    productCount: 0,
    userBeans: 0,
    orderCount: 0
  });

  useEffect(() => {
    setStats({
      activityCount: dataManager.getActivities().length,
      productCount: dataManager.getShopProducts().length,
      userBeans: dataManager.getUserBeans(),
      orderCount: dataManager.getOrders().length
    });
  }, []);

  const cards = [
    { label: '已创建活动', value: stats.activityCount, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '商城商品', value: stats.productCount, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: '用户持有豆', value: stats.userBeans, icon: Coins, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: '兑换订单', value: stats.orderCount, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-lg ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">系统状态</h3>
        <p className="text-sm text-gray-500">
          当前系统运行正常。数据存储在本地 LocalStorage 中。
        </p>
      </div>
    </div>
  );
}
