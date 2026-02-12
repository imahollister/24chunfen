import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { dataManager } from '../../services/DataManager';
import { Activity, VoteOption, Product } from '../../types';

export default function ActivityEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'basic' | 'interaction' | 'content'>('basic');
  const [formData, setFormData] = useState<Partial<Activity>>({
    name: '',
    termType: 'chunfen',
    startTime: '',
    endTime: '',
    theme: 'ink',
    isActive: true,
    interaction: { type: 'vote', voteOptions: [] },
    recommendedFoods: [],
    recommendedProducts: [],
    recommendedSpots: []
  });

  useEffect(() => {
    if (id && id !== 'new') {
      const activity = dataManager.getActivity(id);
      if (activity) {
        setFormData(JSON.parse(JSON.stringify(activity)));
      }
    } else {
      // Defaults for new activity
      setFormData({
        id: `activity_${Date.now()}`,
        name: '新活动',
        termType: 'chunfen',
        startTime: new Date().toISOString().split('T')[0],
        endTime: new Date().toISOString().split('T')[0],
        theme: 'ink',
        isActive: true,
        interaction: { type: 'vote', voteOptions: [] },
        recommendedFoods: [],
        recommendedProducts: [],
        recommendedSpots: []
      });
    }
  }, [id]);

  const handleSave = () => {
    if (!formData.name || !formData.id) return;
    dataManager.saveActivity(formData as Activity);
    navigate('/admin/activities');
  };

  // --- Helper Components for List Management ---

  const ProductListEditor = ({ 
    items, 
    onChange, 
    type,
    title 
  }: { 
    items: Product[], 
    onChange: (items: Product[]) => void, 
    type: 'food' | 'merchandise' | 'spot',
    title: string 
  }) => {
    const add = () => {
      onChange([...items, {
        id: Date.now().toString(),
        type,
        name: '新项目',
        description: '',
        price: 0,
        currency: 'cny',
        images: [''],
        displayOrder: items.length + 1,
        isActive: true,
        createdAt: new Date().toISOString()
      }]);
    };

    const update = (index: number, field: keyof Product, value: any) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      onChange(newItems);
    };

    const updateImage = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], images: [value] };
        onChange(newItems);
    }

    const remove = (index: number) => {
      onChange(items.filter((_, i) => i !== index));
    };

    return (
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button onClick={add} className="text-sm text-blue-600 font-bold flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded">
            <Plus className="w-3 h-3" /> 添加
          </button>
        </div>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={item.id || idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 group">
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0 relative">
                {item.images[0] ? (
                   <img src={item.images[0]} className="w-full h-full object-cover" />
                ) : (
                   <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon className="w-6 h-6"/></div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input 
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm font-bold" 
                    value={item.name} 
                    onChange={e => update(idx, 'name', e.target.value)}
                    placeholder="名称"
                  />
                  <input 
                    className="w-24 border border-gray-300 rounded px-2 py-1 text-sm" 
                    value={item.price} 
                    type="number"
                    onChange={e => update(idx, 'price', Number(e.target.value))}
                    placeholder="价格"
                  />
                </div>
                <input 
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-600" 
                  value={item.description} 
                  onChange={e => update(idx, 'description', e.target.value)}
                  placeholder="描述"
                />
                <input 
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-gray-400 font-mono" 
                  value={item.images[0] || ''} 
                  onChange={e => updateImage(idx, e.target.value)}
                  placeholder="图片URL"
                />
              </div>
              <button onClick={() => remove(idx)} className="text-gray-400 hover:text-red-500 self-start">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {items.length === 0 && <div className="text-center text-gray-400 text-sm py-4">暂无配置</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-gray-50 pt-4 pb-4 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/activities')} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {id === 'new' ? '创建新活动' : '编辑活动'}
          </h1>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" />
          保存配置
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4">
        {[
          { id: 'basic', label: '基础信息' },
          { id: 'interaction', label: '互动配置' },
          { id: 'content', label: '推荐内容' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 font-bold text-sm border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        
        {/* Tab: Basic Info */}
        {activeTab === 'basic' && (
          <div className="bg-white p-8 rounded-b-xl shadow-sm border border-t-0 border-gray-200 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">活动名称</label>
                <input 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="例如：春分·竖蛋"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">节气标识 (ID)</label>
                <input 
                  value={formData.termType}
                  onChange={e => setFormData({...formData, termType: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  placeholder="chunfen"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">开始时间</label>
                <input 
                  type="date"
                  value={formData.startTime}
                  onChange={e => setFormData({...formData, startTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">结束时间</label>
                <input 
                  type="date"
                  value={formData.endTime}
                  onChange={e => setFormData({...formData, endTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">视觉主题</label>
                <select 
                  value={formData.theme}
                  onChange={e => setFormData({...formData, theme: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white"
                >
                  <option value="ink">水墨中国风 (Ink)</option>
                  <option value="festive">节日庆典 (Festive)</option>
                  <option value="minimalist">现代简约 (Minimalist)</option>
                </select>
              </div>
              <div className="flex items-center pt-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded" 
                  />
                  <span className="font-bold text-gray-700">活动启用中</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Interaction */}
        {activeTab === 'interaction' && (
          <div className="bg-white p-8 rounded-b-xl shadow-sm border border-t-0 border-gray-200">
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">互动类型</label>
              <div className="flex gap-4">
                <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${formData.interaction?.type === 'vote' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="interactionType" 
                    className="hidden" 
                    checked={formData.interaction?.type === 'vote'}
                    onChange={() => setFormData({...formData, interaction: { ...formData.interaction!, type: 'vote' }})}
                  />
                  <div className="font-bold text-lg mb-1">投票 PK</div>
                  <div className="text-sm text-gray-500">用户选择支持的选项，实时显示票数比例。</div>
                </label>
                <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${formData.interaction?.type === 'quiz' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="interactionType" 
                    className="hidden"
                    checked={formData.interaction?.type === 'quiz'}
                    onChange={() => setFormData({...formData, interaction: { ...formData.interaction!, type: 'quiz' }})}
                  />
                  <div className="font-bold text-lg mb-1">趣味答题</div>
                  <div className="text-sm text-gray-500">用户回答问题，答对获得奖励。</div>
                </label>
              </div>
            </div>

            {formData.interaction?.type === 'vote' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">投票选项配置</h3>
                  <button 
                    onClick={() => {
                      const newOpts = [...(formData.interaction?.voteOptions || [])];
                      newOpts.push({
                        id: Date.now().toString(),
                        name: '新选项',
                        votes: 0,
                        imageUrl: ''
                      });
                      setFormData({...formData, interaction: { ...formData.interaction!, voteOptions: newOpts }});
                    }}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100"
                  >
                    + 添加选项
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.interaction?.voteOptions?.map((opt, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 items-start">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                         {opt.imageUrl ? <img src={opt.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">无图</div>}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex gap-3">
                          <input 
                            value={opt.name}
                            onChange={e => {
                                const newOpts = [...formData.interaction!.voteOptions!];
                                newOpts[idx].name = e.target.value;
                                setFormData({...formData, interaction: { ...formData.interaction!, voteOptions: newOpts }});
                            }}
                            className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm font-bold"
                            placeholder="选项名称"
                          />
                          <input 
                             value={opt.votes}
                             type="number"
                             onChange={e => {
                                const newOpts = [...formData.interaction!.voteOptions!];
                                newOpts[idx].votes = Number(e.target.value);
                                setFormData({...formData, interaction: { ...formData.interaction!, voteOptions: newOpts }});
                            }}
                             className="w-24 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-500"
                             placeholder="初始票数"
                          />
                        </div>
                        <input 
                            value={opt.imageUrl}
                            onChange={e => {
                                const newOpts = [...formData.interaction!.voteOptions!];
                                newOpts[idx].imageUrl = e.target.value;
                                setFormData({...formData, interaction: { ...formData.interaction!, voteOptions: newOpts }});
                            }}
                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-500 font-mono"
                            placeholder="图片URL"
                        />
                      </div>
                      <button 
                        onClick={() => {
                            const newOpts = formData.interaction!.voteOptions!.filter((_, i) => i !== idx);
                            setFormData({...formData, interaction: { ...formData.interaction!, voteOptions: newOpts }});
                        }}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {formData.interaction?.type === 'quiz' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">题目配置</h3>
                  <button 
                    onClick={() => {
                      const newQuestions = [...(formData.interaction?.questions || [])];
                      newQuestions.push({
                        id: Date.now().toString(),
                        title: '新题目',
                        options: ['选项A', '选项B', '选项C'],
                        correctIndex: 0
                      });
                      setFormData({...formData, interaction: { ...formData.interaction!, questions: newQuestions }});
                    }}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100"
                  >
                    + 添加题目
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.interaction?.questions?.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
                      <div className="mb-3 pr-8">
                        <label className="block text-xs font-bold text-gray-500 mb-1">题目描述</label>
                        <input 
                          value={q.title}
                          onChange={e => {
                              const newQs = [...formData.interaction!.questions!];
                              newQs[qIdx].title = e.target.value;
                              setFormData({...formData, interaction: { ...formData.interaction!, questions: newQs }});
                          }}
                          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm font-bold"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name={`correct-${qIdx}`}
                              checked={q.correctIndex === optIdx}
                              onChange={() => {
                                  const newQs = [...formData.interaction!.questions!];
                                  newQs[qIdx].correctIndex = optIdx;
                                  setFormData({...formData, interaction: { ...formData.interaction!, questions: newQs }});
                              }}
                              className="w-4 h-4 text-green-600 cursor-pointer"
                            />
                            <input 
                              value={opt}
                              onChange={e => {
                                  const newQs = [...formData.interaction!.questions!];
                                  newQs[qIdx].options[optIdx] = e.target.value;
                                  setFormData({...formData, interaction: { ...formData.interaction!, questions: newQs }});
                              }}
                              className={`flex-1 border rounded px-3 py-1.5 text-sm ${q.correctIndex === optIdx ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300'}`}
                            />
                            <button 
                              onClick={() => {
                                  const newQs = [...formData.interaction!.questions!];
                                  newQs[qIdx].options = newQs[qIdx].options.filter((_, i) => i !== optIdx);
                                  // Adjust correct index if needed
                                  if (q.correctIndex === optIdx) newQs[qIdx].correctIndex = 0;
                                  else if (q.correctIndex > optIdx) newQs[qIdx].correctIndex--;
                                  
                                  setFormData({...formData, interaction: { ...formData.interaction!, questions: newQs }});
                              }}
                              className="text-gray-400 hover:text-red-500"
                              disabled={q.options.length <= 2}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => {
                              const newQs = [...formData.interaction!.questions!];
                              newQs[qIdx].options.push(`新选项`);
                              setFormData({...formData, interaction: { ...formData.interaction!, questions: newQs }});
                          }}
                          className="text-xs text-blue-500 font-bold hover:underline pl-6"
                        >
                          + 添加选项
                        </button>
                      </div>

                      <button 
                        onClick={() => {
                            const newQs = formData.interaction!.questions!.filter((_, i) => i !== qIdx);
                            setFormData({...formData, interaction: { ...formData.interaction!, questions: newQs }});
                        }}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(!formData.interaction?.questions || formData.interaction.questions.length === 0) && (
                      <div className="text-center text-gray-400 text-sm py-4">点击上方按钮添加题目</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Content */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <ProductListEditor 
              title="推荐美食 (Recommended Foods)" 
              type="food" 
              items={formData.recommendedFoods || []} 
              onChange={items => setFormData({...formData, recommendedFoods: items})}
            />
            <ProductListEditor 
              title="推荐商品 (Recommended Products)" 
              type="merchandise" 
              items={formData.recommendedProducts || []} 
              onChange={items => setFormData({...formData, recommendedProducts: items})}
            />
            <ProductListEditor 
              title="推荐景点 (Travel Spots)" 
              type="spot" 
              items={formData.recommendedSpots || []} 
              onChange={items => setFormData({...formData, recommendedSpots: items})}
            />
          </div>
        )}

      </div>
    </div>
  );
}
