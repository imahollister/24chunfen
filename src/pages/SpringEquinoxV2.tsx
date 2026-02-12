import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Gift, MapPin, MessageCircle, ThumbsUp, ChevronRight, X, Check, 
  Share2, ArrowRight, Send, AlertCircle, Sparkles, ScrollText, Coins, ShoppingBag
} from 'lucide-react';

import { ModalOverlay } from '../components/ModalOverlay';
import { AddressModal } from '../components/AddressModal';
import { dataManager } from '../services/DataManager';
import { Activity, VoteOption, BeanTransaction } from '../types';

// 评论数据暂时还是模拟，实际可以存在 interaction 中
const COMMENTS = [
  { id: 1, user: '陈子羽', avatar: 'C', content: '潮汕牛肉粉', time: '2分钟前', likes: 12 },
  { id: 2, user: '李明', avatar: 'L', content: '番茄炒蛋yyds', time: '5分钟前', likes: 8 },
  { id: 3, user: '王芳', avatar: 'W', content: '茶叶蛋超入味', time: '8分钟前', likes: 5 },
];

export default function SpringEquinoxV2() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 核心活动数据
  const [activity, setActivity] = useState<Activity | null>(null);
  
  // 页面状态
  const [scrollY, setScrollY] = useState(0);
  const [lotteryState, setLotteryState] = useState<'idle' | 'drawing' | 'won' | 'completed'>('idle');
  const [lotteryPrize, setLotteryPrize] = useState<'eggs' | 'beans' | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  // 投票相关状态
  const [voteId, setVoteId] = useState<string | null>(null);
  const [selectedVoteId, setSelectedVoteId] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [comments, setComments] = useState(COMMENTS);

  // 节气豆相关状态
  const [beans, setBeans] = useState(0);
  const [showBeansModal, setShowBeansModal] = useState(false);
  const [beansHistory, setBeansHistory] = useState<BeanTransaction[]>([]);

  // 规则与分享
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // 初始化数据
  useEffect(() => {
    // 1. 加载活动配置
    const activityId = searchParams.get('activityId');
    const activities = dataManager.getActivities();
    let current: Activity | undefined;

    if (activityId) {
        current = dataManager.getActivity(activityId);
    } else if (activities.length > 0) {
        current = activities[0]; // 默认第一个
    }

    if (current) {
        setActivity(current);
    }

    // 2. 加载用户数据
    refreshUserData();
  }, [searchParams]);

  const refreshUserData = () => {
    setBeans(dataManager.getUserBeans());
    setBeansHistory(dataManager.getTransactions());
  };

  // 滚动监听
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => setScrollY(container.scrollTop);
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const showToastMsg = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 抽奖逻辑
  const handleLottery = () => {
    if (lotteryState !== 'idle') return;
    setLotteryState('drawing');
    
    // 模拟抽奖结果
    const isEggs = Math.random() < 0.5;
    
    setTimeout(() => {
      setLotteryPrize(isEggs ? 'eggs' : 'beans');
      setLotteryState('won');
      
      if (!isEggs) {
        dataManager.recordLotteryWin('beans', 50);
        refreshUserData();
      }
    }, 2000);
  };

  // 提交地址
  const handleSubmitAddress = (address: { name: string; phone: string; address: string }) => {
    dataManager.recordLotteryWin('eggs', 1, address);
    setShowAddressModal(false);
    setLotteryState('completed');
    showToastMsg('提交成功，等待发货');
  };

  // 处理投票点击
  const handleVoteClick = (id: string) => {
    if (voteId) return;
    
    // 如果ID不在当前选项中（比如是特殊的推荐选项ID），特殊处理
    // 这里的逻辑假设 '5' 是特殊的 "我来推荐" ID，但在动态配置中可能不同
    // 简单起见，如果选项名称是 "我来推荐"，我们认为它是特殊的
    const option = activity?.interaction.voteOptions?.find(o => o.id === id);
    if (option && option.name === '我来推荐') {
      setSelectedVoteId(id);
      setShowInput(true);
    } else {
      setSelectedVoteId(id);
      setShowInput(false);
    }
  };

  // 确认投票
  const handleConfirmVote = () => {
    if (!selectedVoteId) return;
    setVoteId(selectedVoteId);
    
    dataManager.addBeans(20, '参与投票');
    refreshUserData();
    
    showToastMsg(`投票成功！获得20个节气豆`);
  };

  // 提交推荐
  const handleSubmitRecommendation = () => {
    if (!recommendation.trim()) {
      showToastMsg('请输入推荐内容');
      return;
    }
    setVoteId(selectedVoteId); // Lock vote
    setShowInput(false);
    
    setComments([{ 
      id: Date.now().toString(), 
      user: '我', 
      avatar: 'Me', 
      content: recommendation, 
      time: '刚刚', 
      likes: 0 
    } as any, ...comments]);
    
    dataManager.addBeans(30, '推荐美食');
    refreshUserData();

    showToastMsg(`推荐成功！获得30个节气豆`);
  };

  // 分享模拟
  const handleShare = () => {
    showToastMsg('分享链接已复制，快去邀请好友吧！');
  };

  if (!activity) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
                <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>活动加载中...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 overflow-y-auto">
      {/* 手机外框 */}
      <div className="relative w-[375px] h-[812px] my-auto shrink-0 bg-[#F2F7F5] shadow-2xl overflow-hidden rounded-[30px] border-[8px] border-gray-900 font-sans text-gray-800">
        
        {/* 顶部导航栏 */}
        <div className={`absolute top-0 left-0 right-0 z-40 h-11 flex items-center justify-center transition-all duration-300 ${scrollY > 50 ? 'bg-white/90 backdrop-blur shadow-sm' : 'bg-transparent'}`}>
          <span className={`font-medium text-lg ${scrollY > 50 ? 'text-gray-800' : 'text-[#1a3c26]'}`}>
            苏周到二十四节气 · {activity.name}
          </span>
        </div>

        {/* 顶部右侧功能区 */}
        <div className="absolute top-2 right-4 z-50 flex gap-3">
          <button onClick={handleShare} className="p-2 bg-white/80 backdrop-blur rounded-full shadow-sm">
            <Share2 className="w-4 h-4 text-gray-700" />
          </button>
          <button onClick={() => setShowRulesModal(true)} className="p-2 bg-white/80 backdrop-blur rounded-full shadow-sm">
            <ScrollText className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* 悬浮入口：我的节气豆 */}
        <div className="absolute top-32 right-0 z-40">
          <button 
            onClick={() => setShowBeansModal(true)}
            className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-l-full shadow-md flex items-center gap-1 border border-yellow-200 active:scale-95 transition-transform"
          >
            <Coins className="w-4 h-4" />
            <span className="text-xs font-bold">{beans}</span>
          </button>
        </div>

        {/* 滚动内容区域 */}
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto scrollbar-hide pb-0"
        >
          {/* 1. 沉浸式头图区域 */}
          <header className="relative h-[400px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#e6f4e8] to-[#F2F7F5] opacity-50" />
            <img 
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=spring%20equinox%20illustration%20green%20willow%20swallow%20traditional%20chinese%20painting%20style%20vertical%20light%20background&image_size=portrait_4_3" 
              alt="Spring Background" 
              className="absolute inset-0 w-full h-full object-cover animate-pulse-slow opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-[#F2F7F5]" />

            {/* SVG 柳条装饰 */}
            <svg className="absolute top-0 left-0 w-full h-[200px] pointer-events-none z-10" viewBox="0 0 375 200" fill="none">
              <path d="M-10 0 Q 20 80 10 160" stroke="#4a7c59" strokeWidth="2" fill="none" className="willow-branch-1" />
              <path d="M10 0 Q 40 60 30 140" stroke="#5a8c69" strokeWidth="1.5" fill="none" className="willow-branch-2" />
              <path d="M30 0 Q 60 90 50 180" stroke="#3a6c49" strokeWidth="2" fill="none" className="willow-branch-3" />
              <path d="M385 0 Q 355 80 365 160" stroke="#4a7c59" strokeWidth="2" fill="none" className="willow-branch-1" />
              <path d="M365 0 Q 335 60 345 140" stroke="#5a8c69" strokeWidth="1.5" fill="none" className="willow-branch-2" />
            </svg>

            <div className="absolute bottom-16 left-0 right-0 px-6 text-center z-20">
              <h1 className="text-5xl font-bold text-[#1a3c26] mb-3 tracking-wider font-serif animate-fade-in-up" style={{ textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
                {activity.name.split('').join(' ')}
              </h1>
              <p className="text-[#2c4c38] text-sm mt-4 leading-relaxed max-w-[280px] mx-auto animate-fade-in-up delay-200 font-medium" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>
                {activity.startTime} ~ {activity.endTime}
              </p>
            </div>
          </header>

          {/* 2. 核心互动：无门槛抽奖 */}
          <section id="lottery" className="mt-[-20px] relative z-10 px-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Gift className="w-5 h-5 text-red-500" />
                <span>幸运抽奖</span>
              </h2>
              <span className="text-xs text-gray-400">100%中奖机会</span>
            </div>

            <div className="bg-white rounded-2xl p-1 shadow-lg border border-gray-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-50 to-transparent rounded-bl-full opacity-60" />
              
              <div className="p-6 flex flex-col items-center text-center relative z-10">
                {lotteryState === 'idle' && (
                  <>
                    <div className="w-24 h-32 relative mb-4 group cursor-pointer" onClick={handleLottery}>
                      <div className="absolute inset-0 bg-yellow-100 rounded-full animate-ping opacity-20" />
                      <img 
                        src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=golden%20egg%20with%20red%20ribbon%20cartoon%20illustration%20festive%20lucky%20draw%20vector%20style%20white%20background&image_size=portrait_4_3" 
                        alt="立蛋挑战" 
                        className="relative z-10 w-full h-full object-contain animate-bounce-slow drop-shadow-lg"
                      />
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-1">春分好礼免费抽</h3>
                    <button 
                      onClick={handleLottery}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-200 active:scale-95 transition-all mt-4"
                    >
                      点击抽奖
                    </button>
                  </>
                )}

                {lotteryState === 'drawing' && (
                  <div className="py-8 flex flex-col items-center">
                    <div className="w-20 h-20 relative">
                      <div className="absolute inset-0 border-4 border-red-100 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      <Gift className="absolute inset-0 m-auto text-red-500 w-8 h-8 animate-pulse" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium mt-4">正在开启幸运...</p>
                  </div>
                )}

                {lotteryState === 'won' && (
                  <div className="animate-in zoom-in duration-300 w-full flex flex-col items-center">
                    {lotteryPrize === 'eggs' ? (
                      <>
                        <Sparkles className="w-12 h-12 text-orange-400 mb-3 animate-bounce" />
                        <h3 className="text-lg font-bold text-gray-800 mb-2">恭喜获得鲜鸡蛋一盒！</h3>
                        <button 
                          onClick={() => setShowAddressModal(true)}
                          className="w-full bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <MapPin className="w-4 h-4" />
                          填写收货地址
                        </button>
                      </>
                    ) : (
                      <>
                        <Coins className="w-12 h-12 text-yellow-500 mb-3 animate-bounce" />
                        <h3 className="text-lg font-bold text-gray-800 mb-2">恭喜获得50个节气豆！</h3>
                        <button 
                          onClick={() => setLotteryState('completed')}
                          className="w-full bg-yellow-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-yellow-200 active:scale-95 transition-all"
                        >
                          收入囊中
                        </button>
                      </>
                    )}
                  </div>
                )}

                {lotteryState === 'completed' && (
                  <div className="py-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-500">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-gray-800">领取成功</h3>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 3. 互动模块 (动态配置) */}
          <section className="mt-8 px-4">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <span>{activity.interaction.type === 'vote' ? '话题PK' : '趣味答题'}</span>
              </h2>
              <span className="text-xs bg-blue-50 text-blue-500 px-2 py-1 rounded">送节气豆</span>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              {activity.interaction.type === 'vote' ? (
                <>
                  <h3 className="text-base font-bold text-gray-800 mb-4 text-center">
                    你觉得哪种做法最好吃？
                  </h3>
                  <div className="space-y-3">
                    {activity.interaction.voteOptions?.map((option) => {
                      const percent = Math.round((option.votes / 8000) * 100); // 假定分母
                      const isSelected = (voteId === option.id) || (!voteId && selectedVoteId === option.id);
                      
                      return (
                        <div 
                          key={option.id}
                          onClick={() => handleVoteClick(option.id)}
                          className={`relative overflow-hidden rounded-xl border-2 transition-all cursor-pointer 
                            ${isSelected ? 'border-green-500 bg-green-50' : 'border-transparent bg-gray-50'}
                            ${voteId ? 'pointer-events-none' : ''} 
                          `}
                        >
                          {voteId && (
                            <div 
                              className={`absolute top-0 left-0 bottom-0 transition-all duration-1000 ease-out opacity-20 ${isSelected ? 'bg-green-500' : 'bg-gray-400'}`}
                              style={{ width: `${percent}%` }}
                            />
                          )}
                          <div className="relative flex items-center justify-between p-3 z-10">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
                                {option.imageUrl ? <img src={option.imageUrl} alt={option.name} className="w-full h-full object-cover" /> : <span className="text-xs">无图</span>}
                              </div>
                              <span className={`text-sm font-medium ${isSelected ? 'text-green-700' : 'text-gray-700'}`}>
                                {option.name}
                              </span>
                            </div>
                            {voteId ? (
                              <span className={`text-xs font-bold ${isSelected ? 'text-green-600' : 'text-gray-500'}`}>
                                {option.votes + (isSelected ? 1 : 0)}票
                              </span>
                            ) : (
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Vote confirmation and Input Logic remains same but simplified for brevity */}
                  {selectedVoteId && !voteId && !showInput && (
                    <div className="mt-4">
                        <button onClick={handleConfirmVote} className="w-full bg-green-500 text-white font-bold py-3 rounded-xl">确认投票</button>
                    </div>
                  )}
                  {showInput && !voteId && (
                    <div className="mt-4 flex gap-2">
                        <input value={recommendation} onChange={e => setRecommendation(e.target.value)} className="flex-1 border rounded-xl px-4 py-2" placeholder="请输入..." />
                        <button onClick={handleSubmitRecommendation} className="bg-green-500 text-white p-2 rounded-xl"><Send className="w-5 h-5"/></button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10 text-gray-400">答题活动即将开始</div>
              )}
            </div>
          </section>

          {/* 4. 商业化模块 (动态配置) */}
          <section className="mt-8 space-y-8 pb-8">
            {activity.recommendedFoods && activity.recommendedFoods.length > 0 && (
                <div className="pl-4">
                <div className="flex items-center justify-between pr-4 mb-3">
                    <h2 className="text-lg font-bold">时令美食</h2>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 pr-4 scrollbar-hide">
                    {activity.recommendedFoods.map(item => (
                    <div key={item.id} className="flex-shrink-0 w-[140px] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <div className="h-[140px] bg-gray-100 relative">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                        <h4 className="text-sm font-bold text-gray-800 truncate">{item.name}</h4>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-bold text-orange-500">¥{item.price}</span>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}

            {activity.recommendedProducts && activity.recommendedProducts.length > 0 && (
                <div className="pl-4">
                <div className="flex items-center justify-between pr-4 mb-3">
                    <h2 className="text-lg font-bold">节气好物</h2>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 pr-4 scrollbar-hide">
                    {activity.recommendedProducts.map(item => (
                    <div key={item.id} className="flex-shrink-0 w-[140px] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <div className="h-[140px] bg-gray-100 relative">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                        <h4 className="text-sm font-bold text-gray-800 truncate">{item.name}</h4>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-bold text-orange-500">¥{item.price}</span>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}

            {activity.recommendedSpots && activity.recommendedSpots.length > 0 && (
                <div className="px-4">
                <h2 className="text-lg font-bold mb-3">推荐景点</h2>
                <div className="space-y-3">
                    {activity.recommendedSpots.map(item => (
                    <div key={item.id} className="relative h-[160px] rounded-2xl overflow-hidden shadow-sm group cursor-pointer">
                        <img src={item.images[0]} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 mb-1">
                            {item.tags?.map(tag => (
                                <span key={tag} className="bg-white/20 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded">{tag}</span>
                            ))}
                        </div>
                        <h3 className="text-white font-bold text-lg">{item.name}</h3>
                        <p className="text-white/80 text-xs mt-1">{item.description}</p>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}
          </section>

          {/* 底部版权 */}
          <footer className="text-center py-8 text-gray-400">
            <p className="text-[10px]">苏周到二十四节气 · 愿你四季平安</p>
          </footer>
        </div>

        {/* 弹窗：地址填写 */}
        {showAddressModal && (
          <AddressModal 
            onClose={() => setShowAddressModal(false)}
            onSubmit={handleSubmitAddress}
          />
        )}

        {/* 弹窗：我的节气豆 */}
        {showBeansModal && (
          <ModalOverlay onClose={() => setShowBeansModal(false)}>
            <div className="bg-white rounded-2xl p-5 w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  我的节气豆
                </h3>
                <button onClick={() => setShowBeansModal(false)} className="p-1 bg-gray-100 rounded-full">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 mb-6 text-center border border-yellow-100">
                <p className="text-xs text-yellow-700 mb-1">当前余额</p>
                <h4 className="text-4xl font-bold text-yellow-600 mb-4">{beans}</h4>
                <button 
                  onClick={() => navigate('/mobile/shop')}
                  className="bg-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-md active:scale-95 transition-transform flex items-center gap-2 mx-auto"
                >
                  <ShoppingBag className="w-4 h-4" />
                  去兑换
                </button>
              </div>

              <div className="mb-2">
                <h4 className="text-sm font-bold text-gray-700 mb-3">收支明细</h4>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                  {beansHistory.map(record => (
                    <div key={record.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{record.source}</p>
                        <p className="text-[10px] text-gray-400">{record.time}</p>
                      </div>
                      <span className="text-sm font-bold text-yellow-600">+{record.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ModalOverlay>
        )}

        {/* 弹窗：活动规则 */}
        {showRulesModal && (
          <ModalOverlay onClose={() => setShowRulesModal(false)}>
            <div className="bg-white rounded-2xl p-5 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">活动规则</h3>
                <button onClick={() => setShowRulesModal(false)} className="p-1 bg-gray-100 rounded-full">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4 text-sm text-gray-600 max-h-[300px] overflow-y-auto">
                {/* 规则内容 */}
                <div><h4 className="font-bold">1. 活动时间</h4><p className="text-xs">{activity.startTime} ~ {activity.endTime}</p></div>
                <div><h4 className="font-bold">2. 参与方式</h4><p className="text-xs">用户可通过参与立蛋抽奖、话题投票等互动获取奖励。</p></div>
              </div>
            </div>
          </ModalOverlay>
        )}

        {/* Toast 提示 */}
        {showToast && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-5 py-2.5 rounded-full text-sm font-medium animate-in fade-in zoom-in duration-200 z-[60]">
            {toastMsg}
          </div>
        )}

        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
          @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
          .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
          @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    </div>
  );
}
