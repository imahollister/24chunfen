import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Coins, ShoppingBag, History, Truck, CheckCircle } from 'lucide-react';
import { ModalOverlay } from '../components/ModalOverlay';
import { AddressModal } from '../components/AddressModal';

// 商品数据
const PRODUCTS = [
  {
    id: 1,
    name: '春分限定帆布袋',
    price: 500,
    stock: 20,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=canvas%20tote%20bag%20with%20spring%20equinox%20illustration%20minimalist%20mockup&image_size=square'
  },
  {
    id: 2,
    name: '非遗手工风筝',
    price: 800,
    stock: 5,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=traditional%20chinese%20kite%20swallow%20design%20colorful%20handcrafted&image_size=square'
  },
  {
    id: 3,
    name: '有机绿茶礼盒',
    price: 1200,
    stock: 10,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=premium%20green%20tea%20gift%20box%20elegant%20packaging%20spring%20tea&image_size=square'
  },
  {
    id: 4,
    name: '立蛋挑战纪念章',
    price: 300,
    stock: 50,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=metal%20badge%20pin%20egg%20balancing%20design%20gold%20finish&image_size=square'
  }
];

export default function BeansShop() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'shop' | 'history'>('shop');
  const [beans, setBeans] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // 初始化数据 (模拟从 localStorage 获取)
  useEffect(() => {
    // 简单模拟：如果 localStorage 没有数据，初始化一些
    const savedBeans = localStorage.getItem('user_beans');
    if (savedBeans) {
      setBeans(parseInt(savedBeans));
    } else {
      setBeans(100); // 默认给点豆子测试
    }

    // 模拟历史记录
    const mockHistory = [
      { id: 1, type: 'income', source: '活动签到', amount: 10, time: '2024-03-20 09:00' },
      { id: 2, type: 'income', source: '幸运抽奖', amount: 50, time: '2024-03-20 10:30' },
    ];
    setHistory(mockHistory);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2000);
  };

  const handleRedeemClick = (product: any) => {
    if (beans < product.price) {
      showToast('节气豆不足，快去活动页赚豆吧！');
      return;
    }
    setSelectedProduct(product);
    setShowAddressModal(true);
  };

  const handleConfirmRedeem = (address: any) => {
    // 扣除豆子
    const newBeans = beans - selectedProduct.price;
    setBeans(newBeans);
    localStorage.setItem('user_beans', newBeans.toString());

    // 添加记录
    const newRecord = {
      id: Date.now(),
      type: 'expense',
      source: `兑换-${selectedProduct.name}`,
      amount: selectedProduct.price,
      time: new Date().toLocaleString()
    };
    setHistory([newRecord, ...history]);

    setShowAddressModal(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 overflow-y-auto">
      {/* 手机外框 */}
      <div className="relative w-[375px] h-[812px] my-auto shrink-0 bg-[#F2F7F5] shadow-2xl overflow-hidden rounded-[30px] border-[8px] border-gray-900 font-sans text-[#1a3c26] flex flex-col">
        
        {/* 顶部导航 */}
        <div className="bg-[#F2F7F5]/80 backdrop-blur px-4 h-14 flex items-center justify-between z-20 shrink-0 sticky top-0">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-[#1a3c26] active:scale-95 transition-transform hover:bg-black/5 rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg tracking-wide">节气豆商城</span>
          <div className="w-6" /> {/* 占位 */}
        </div>

        {/* 余额卡片 */}
        <div className="px-4 pb-4 pt-2 shrink-0">
          <div className="bg-gradient-to-br from-[#1a3c26] to-[#2c4c38] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-[#3a5c49]">
            {/* 装饰纹理 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400 opacity-10 rounded-full -ml-10 -mb-10 blur-xl" />
            
            <div className="relative z-10 flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                <Coins className="w-5 h-5 text-yellow-300" />
              </div>
              <span className="text-sm font-medium text-gray-200">当前余额</span>
            </div>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-4xl font-bold tracking-tight text-yellow-50">{beans}</span>
              <span className="text-sm text-yellow-200/80">豆</span>
            </div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="mx-4 mb-4 bg-white/60 backdrop-blur rounded-xl p-1 flex shadow-sm border border-white/40 shrink-0">
          <button 
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'shop' 
                ? 'bg-white text-[#1a3c26] shadow-sm' 
                : 'text-gray-500 hover:text-[#1a3c26]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            好物兑换
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'history' 
                ? 'bg-white text-[#1a3c26] shadow-sm' 
                : 'text-gray-500 hover:text-[#1a3c26]'
            }`}
          >
            <History className="w-4 h-4" />
            收支明细
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
          {activeTab === 'shop' ? (
            <div className="grid grid-cols-2 gap-3">
              {PRODUCTS.map(product => (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group">
                  <div className="aspect-square bg-gray-50 relative overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {product.stock < 10 && (
                      <span className="absolute top-2 left-2 bg-red-500/90 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                        仅剩{product.stock}件
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-[#1a3c26] mb-1 line-clamp-1">{product.name}</h3>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Coins className="w-3 h-3" />
                        <span className="font-bold text-sm">{product.price}</span>
                      </div>
                      <button 
                        onClick={() => handleRedeemClick(product)}
                        className="bg-[#1a3c26] text-white px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition-all shadow-md shadow-[#1a3c26]/20 hover:bg-[#2c4c38]"
                      >
                        兑换
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(record => (
                <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      record.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {record.type === 'income' ? <Coins className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1a3c26] text-sm mb-0.5">{record.source}</h4>
                      <p className="text-xs text-gray-400">{record.time}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-lg ${record.type === 'income' ? 'text-green-600' : 'text-orange-600'}`}>
                    {record.type === 'income' ? '+' : '-'}{record.amount}
                  </span>
                </div>
              ))}
              {history.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <History className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-sm">暂无记录</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 兑换成功弹窗 */}
        {showSuccessModal && (
          <ModalOverlay onClose={() => setShowSuccessModal(false)}>
            <div className="bg-white rounded-2xl p-6 w-full text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">兑换成功！</h3>
              <p className="text-sm text-gray-500 mb-6">我们将尽快为您发货，请留意短信通知。</p>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 active:scale-95 transition-all"
              >
                知道了
              </button>
            </div>
          </ModalOverlay>
        )}

        {/* 地址填写弹窗 */}
        {showAddressModal && (
          <AddressModal 
            onClose={() => setShowAddressModal(false)}
            onSubmit={handleConfirmRedeem}
            title={`兑换 - ${selectedProduct?.name}`}
          />
        )}

        {/* Toast */}
        {toastMsg && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-5 py-2.5 rounded-full text-sm font-medium animate-in fade-in zoom-in duration-200 z-[60]">
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
}
