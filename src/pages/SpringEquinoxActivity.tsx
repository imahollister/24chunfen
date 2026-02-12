import { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, Gift, MapPin, Clock, User, MessageCircle, 
  ThumbsUp, ChevronRight, X, Check, Camera, Sun, Cloud,
  Flower2, Leaf, Heart, Share2, Star, Clock3
} from 'lucide-react';

// 模拟数据
const VOTING_OPTIONS = [
  { id: '1', name: '水煮蛋', votes: 2341, emoji: '🥚' },
  { id: '2', name: '溏心蛋', votes: 1892, emoji: '🍳' },
  { id: '3', name: '鸡蛋灌饼', votes: 1567, emoji: '🫓' },
  { id: '4', name: '酱香鸡蛋', votes: 1023, emoji: '🍲' },
  { id: '5', name: '我来推荐！', votes: 876, emoji: '✍️' },
];

const COMMENTS = [
  { id: 1, user: '陈子羽', content: '潮汕牛肉粉', time: '2分钟前' },
  { id: 2, user: '李明', content: '番茄炒蛋yyds', time: '5分钟前' },
  { id: 3, user: '王芳', content: '茶叶蛋超入味', time: '8分钟前' },
  { id: 4, user: '张伟', content: '煎蛋配面包', time: '12分钟前' },
  { id: 5, user: '刘洋', content: '蛋花汤最简单', time: '15分钟前' },
];

const RECOMMENDED_FOODS = [
  { id: 1, name: '春笋', price: '¥28.8', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=fresh%20spring%20bamboo%20shoots%20green%20vegetable%20spring%20season&image_size=portrait_4_3' },
  { id: 2, name: '香椿', price: '¥38.8', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=toon%20shoots%20chinese%20toon%20sprouts%20green%20spring%20vegetable&image_size=portrait_4_3' },
  { id: 3, name: '荠菜', price: '¥18.8', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=shepherd%27s%20purse%20wild%20vegetable%20green%20spring%20grass&image_size=portrait_4_3' },
];

const RECOMMENDED_PRODUCTS = [
  { id: 1, name: '煮蛋器', price: '¥59.9', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=egg%20cooker%20kitchen%20appliance%20modern%20white&image_size=portrait_4_3' },
  { id: 2, name: '野餐垫', price: '¥89.9', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=picnic%20mat%20outdoor%20green%20grass%20spring%20picnic&image_size=portrait_4_3' },
  { id: 3, name: '鸡蛋托盘', price: '¥29.9', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=egg%20tray%20holder%20kitchen%20storage%20white%20plastic&image_size=portrait_4_3' },
];

const RECOMMENDED_SPOTS = [
  { id: 1, name: '苏州赏花路线', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=suzhou%20cherry%20blossom%20flower%20tunnel%20spring%20garden&image_size=portrait_4_3' },
  { id: 2, name: '非遗立蛋体验', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=traditional%20chinese%20egg%20balancing%20culture%20heritage%20activity&image_size=portrait_4_3' },
  { id: 3, name: '春季农耕体验', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=spring%20farming%20experience%20rural%20activity%20nature&image_size=portrait_4_3' },
];

// 抽奖状态类型
type LotteryStatus = 'idle' | 'drawing' | 'won' | 'address';

// 地址弹窗组件
function AddressModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = '请输入收货人姓名';
    if (!formData.phone.trim()) newErrors.phone = '请输入手机号码';
    else if (!/^1[3-9]\d{9}$/.test(formData.phone)) newErrors.phone = '手机号格式不正确';
    if (!formData.address.trim()) newErrors.address = '请输入详细地址';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">填写收货地址</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <input
              type="text"
              placeholder="收货人姓名"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <input
              type="tel"
              placeholder="手机号码"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          
          <div>
            <textarea
              placeholder="详细地址"
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${errors.address ? 'border-red-500' : 'border-gray-200'}`}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
          
          <div className="bg-amber-50 p-3 rounded-xl">
            <p className="text-amber-700 text-xs leading-relaxed">
              ⚠️ 地址提交后不可修改。请务必核实，若因地址错误导致派送失败，由用户自行承担后果。
            </p>
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all"
          >
            确认提交
          </button>
        </div>
      </div>
    </div>
  );
}

// 抽奖结果弹窗组件
function LotteryResultModal({ onClose, onClaim }: { onClose: () => void; onClaim: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden animate-bounce-in">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Gift className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-white font-bold text-xl">恭喜您中奖啦！</h3>
        </div>
        
        <div className="p-6 text-center">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 mb-4">
            <p className="text-gray-600 text-sm mb-2">您获得了</p>
            <p className="text-3xl">🥚</p>
            <p className="text-green-600 font-semibold mt-2">鲜鸡蛋 6枚装</p>
            <p className="text-red-500 font-bold text-lg mt-1">"立蛋成功，全年旺！"</p>
          </div>
          
          <button
            onClick={onClaim}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            填写收货地址
          </button>
        </div>
        
        <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-white/20 rounded-full">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}

// 评论组件
function CommentItem({ comment }: { comment: typeof COMMENTS[0] }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
        {comment.user.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-800">{comment.user}</span>
          <span className="text-xs text-gray-400">{comment.time}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{comment.content}</p>
      </div>
    </div>
  );
}

// 主页面组件
export default function SpringEquinoxLandingPage() {
  // 状态管理
  const [lotteryStatus, setLotteryStatus] = useState<LotteryStatus>('idle');
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [voteComment, setVoteComment] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [comments, setComments] = useState(COMMENTS);
  const [totalParticipants, setTotalParticipants] = useState(109000);

  // 投票选项处理
  const handleVote = (optionId: string) => {
    if (hasVoted || isDrawing) return;
    setSelectedVote(optionId);
  };

  // 提交投票和评论
  const submitVote = () => {
    if (!selectedVote) {
      alert('请先选择一个选项');
      return;
    }
    
    if (selectedVote === '5' && !voteComment.trim()) {
      alert('请输入您的推荐');
      return;
    }

    setIsSubmitting(true);
    
    // 模拟提交
    setTimeout(() => {
      setHasVoted(true);
      setIsSubmitting(false);
      
      // 添加评论
      if (voteComment.trim()) {
        setComments([{ id: Date.now(), user: '我', content: voteComment, time: '刚刚' }, ...comments]);
      }
      
      // 增加参与者
      setTotalParticipants(prev => prev + Math.floor(Math.random() * 100) + 50);
    }, 1000);
  };

  // 抽奖逻辑
  const startLottery = () => {
    if (isDrawing || lotteryStatus === 'won' || lotteryStatus === 'address') return;
    
    setIsDrawing(true);
    
    // 抽奖动画
    setTimeout(() => {
      setIsDrawing(false);
      setLotteryStatus('won');
    }, 2000);
  };

  // 领取奖品
  const claimPrize = () => {
    setShowAddressModal(true);
  };

  // 提交地址
  const submitAddress = (data: any) => {
    console.log('提交地址:', data);
    setShowAddressModal(false);
    setLotteryStatus('address');
    setShowSuccess(true);
  };

  // 滚动到投票区域
  const scrollToVote = () => {
    const voteSection = document.getElementById('vote-section');
    voteSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="mobile-container min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-pink-50">
      {/* 顶部主视觉区域 */}
      <div className="relative bg-gradient-to-b from-green-400 via-green-500 to-green-600 overflow-hidden" style={{ width: '100%' }}>
        {/* 装饰元素 */}
        <div className="absolute inset-0">
          <Sun className="absolute top-4 right-8 w-12 h-12 text-yellow-300 animate-pulse" fill="#fde047" />
          <Cloud className="absolute top-16 left-4 w-14 h-14 text-white/80 animate-float" fill="#ffffff" />
          <Cloud className="absolute top-20 right-16 w-16 h-16 text-white/60 animate-float-delayed" fill="#ffffff" />
          <Flower2 className="absolute bottom-0 left-0 w-24 h-24 text-pink-300/50" fill="#f9a8d4" />
          <Flower2 className="absolute bottom-0 right-0 w-20 h-20 text-yellow-300/50" fill="#fde047" />
        </div>
        
        {/* 头图内容 */}
        <div className="relative z-10 px-4 py-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm font-medium">春季限定活动</span>
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
            春分到，蛋儿俏
          </h1>
          <p className="text-white/90 text-sm max-w-xs mx-auto leading-relaxed">
            据说春分这天最容易把鸡蛋立起来，人们以此庆祝春天的来临
          </p>
          
          {/* 立蛋动画区域 */}
          <div className="mt-8 flex justify-center">
            <div className="relative">
              <div className="w-20 h-24 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 rounded-full rounded-tl-xl rounded-tr-xl shadow-xl relative overflow-hidden animate-bounce-slow">
                <div className="absolute top-2 left-3 w-4 h-5 bg-white/60 rounded-full transform -rotate-45"></div>
                <div className="absolute bottom-4 right-3 w-3 h-4 bg-orange-100 rounded-full"></div>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-gradient-to-r from-green-300 via-green-400 to-green-300 rounded-full"></div>
            </div>
          </div>
          
          {/* 提示箭头 */}
          <div className="mt-6 flex justify-center">
            <button 
              onClick={scrollToVote}
              className="animate-bounce bg-white/20 backdrop-blur-sm rounded-full p-2"
            >
              <ChevronRight className="w-6 h-6 text-white transform rotate-90" />
            </button>
          </div>
        </div>
      </div>

      {/* 宣传横幅 */}
      <div className="relative -mt-4 mx-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-2xl p-4 shadow-lg z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">春分立蛋挑战</p>
              <p className="text-white/80 text-xs">晒图立蛋，赢好礼</p>
            </div>
          </div>
          <button className="bg-white text-pink-500 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition-colors">
            立即参与
          </button>
        </div>
      </div>

      {/* 核心互动：抽奖模块 */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-white" />
              <h2 className="text-white font-semibold">🎁 幸运抽奖</h2>
            </div>
          </div>
          
          <div className="p-6 text-center">
            {lotteryStatus === 'idle' && !isDrawing && (
              <>
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-12 h-12 text-orange-500" />
                </div>
                <p className="text-gray-600 mb-4">点击按钮立即参与抽奖</p>
                <button
                  onClick={startLottery}
                  className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  🎯 立即抽奖
                </button>
              </>
            )}
            
            {isDrawing && (
              <>
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Gift className="w-12 h-12 text-orange-500" />
                </div>
                <p className="text-gray-600 mb-4 animate-pulse">抽奖中...</p>
              </>
            )}
            
            {lotteryStatus === 'won' && (
              <>
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-12 h-12 text-orange-500" />
                </div>
                <p className="text-gray-600 mb-4">恭喜您获得鸡蛋一份！</p>
                <button
                  onClick={claimPrize}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  填写收货地址
                </button>
              </>
            )}
            
            {lotteryStatus === 'address' && (
              <>
                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-12 h-12 text-green-500" />
                </div>
                <p className="text-gray-600 mb-4">地址已提交，请等待收货！</p>
                <p className="text-green-600 font-semibold">"立蛋成功，全年旺！"</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 投票评论模块 */}
      <div id="vote-section" className="px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-white" />
                <h2 className="text-white font-semibold">💬 投票互动</h2>
              </div>
              <div className="flex items-center gap-1 text-white/90 text-sm">
                <User className="w-4 h-4" />
                <span>{totalParticipants.toLocaleString()}人参与</span>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <p className="text-gray-700 font-medium mb-4">你觉得鸡蛋哪种做法最好吃？</p>
            
            {/* 投票选项 */}
            <div className="space-y-2 mb-4">
              {VOTING_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  disabled={hasVoted}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between
                    ${selectedVote === option.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-100 hover:border-green-300'
                    }
                    ${hasVoted ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{option.emoji}</span>
                    <span className="text-gray-700">{option.name}</span>
                  </div>
                  {hasVoted && (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${(option.votes / 5000) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-12 text-right">{option.votes}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {/* 评论输入 */}
            {selectedVote && !hasVoted && (
              <div className="mb-4">
                {selectedVote === '5' ? (
                  <textarea
                    placeholder="请输入你的推荐..."
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    rows={2}
                    value={voteComment}
                    onChange={(e) => setVoteComment(e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="说说你的理由..."
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={voteComment}
                    onChange={(e) => setVoteComment(e.target.value)}
                  />
                )}
              </div>
            )}
            
            {/* 提交按钮 */}
            {selectedVote && !hasVoted && (
              <button
                onClick={submitVote}
                disabled={isSubmitting || (selectedVote === '5' && !voteComment.trim())}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <ThumbsUp className="w-5 h-5" />
                    投票并评论，赢节气豆
                  </>
                )}
              </button>
            )}
            
            {/* 已投票状态 */}
            {hasVoted && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl mb-4">
                <div className="flex items-center gap-2 text-orange-600">
                  <Star className="w-5 h-5" fill="#f97316" />
                  <span className="font-medium">恭喜获得 1 个节气豆！</span>
                </div>
              </div>
            )}
            
            {/* 实时评论区 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">实时热评</span>
                <Clock3 className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-1">
                {comments.slice(0, 4).map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 推荐食物 */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">🍃 春季时令</h3>
          <span className="text-sm text-gray-500">更多</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {RECOMMENDED_FOODS.map((food) => (
            <div key={food.id} className="flex-shrink-0 w-28 bg-white rounded-xl shadow-md overflow-hidden">
              <img 
                src={food.image} 
                alt={food.name}
                className="w-full h-28 object-cover"
                loading="lazy"
              />
              <div className="p-2">
                <p className="text-sm font-medium text-gray-800 truncate">{food.name}</p>
                <p className="text-sm text-green-600 font-semibold">{food.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 推荐商品 */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">🛒 热门好物</h3>
          <span className="text-sm text-gray-500">更多</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {RECOMMENDED_PRODUCTS.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-28 bg-white rounded-xl shadow-md overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-28 object-cover"
                loading="lazy"
              />
              <div className="p-2">
                <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                <p className="text-sm text-green-600 font-semibold">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 推荐景点/资讯 */}
      <div className="px-4 py-4 pb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">🌸 春日出行</h3>
          <span className="text-sm text-gray-500">更多</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {RECOMMENDED_SPOTS.map((spot) => (
            <div key={spot.id} className="flex-shrink-0 w-40 bg-white rounded-xl shadow-md overflow-hidden">
              <img 
                src={spot.image} 
                alt={spot.name}
                className="w-full h-24 object-cover"
                loading="lazy"
              />
              <div className="p-2">
                <p className="text-sm font-medium text-gray-800 truncate">{spot.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="px-4 py-6 pb-12 text-center">
        <p className="text-green-600/80 text-sm">
          🌸 春分到，蛋儿俏，祝您立蛋成功！🌸
        </p>
      </div>

      {/* 弹窗 */}
      {showAddressModal && (
        <AddressModal onClose={() => setShowAddressModal(false)} onSubmit={submitAddress} />
      )}
      
      {lotteryStatus === 'won' && (
        <LotteryResultModal 
          onClose={() => setLotteryStatus('idle')} 
          onClaim={claimPrize} 
        />
      )}

      {/* 成功提示 */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 text-center max-w-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">提交成功！</h3>
            <p className="text-gray-600 mb-4">我们将在3-5个工作日内为您发货</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      {/* 动画样式 */}
      <style>{`
        /* 移动端容器 - 750×812 标准尺寸 */
        .mobile-container {
          width: 100%;
          max-width: 750px;
          min-height: 812px;
          margin: 0 auto;
          position: relative;
          overflow-x: hidden;
        }
        
        /* 桌面端显示提示 */
        @media (min-width: 751px) {
          .mobile-container::before {
            content: '📱 移动端预览模式 (750×812)';
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
            color: white;
            padding: 6px 16px;
            border-radius: 0 0 12px 12px;
            font-size: 12px;
            font-weight: 500;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite 1s; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
