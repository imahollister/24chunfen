import { useState } from 'react';
import { Monitor, Smartphone, RefreshCw, ExternalLink } from 'lucide-react';

export default function Portal() {
  const [currentSystem, setCurrentSystem] = useState({
    url: '/admin',
    name: '平台管理后台',
    type: 'O端',
    color: 'bg-blue-100 text-blue-700'
  });

  const [iframeKey, setIframeKey] = useState(0);

  const switchSystem = (url: string, name: string, type: string, color: string) => {
    setCurrentSystem({ url, name, type, color });
    setIframeKey(prev => prev + 1);
  };

  const refreshIframe = () => setIframeKey(prev => prev + 1);

  return (
    <div className="h-screen flex bg-gray-100 font-sans overflow-hidden">
      {/* Main Content Area (Left) */}
      <main className="flex-1 h-full relative bg-gray-100 overflow-hidden flex flex-col">
         {/* Header */}
         <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
            <div className="flex items-center gap-4">
               <span className="text-lg font-semibold text-gray-800">{currentSystem.name}</span>
               <span className={`text-xs px-2 py-0.5 rounded ${currentSystem.color}`}>{currentSystem.type}</span>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={refreshIframe} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors" title="刷新页面">
                  <RefreshCw className="w-4 h-4" />
               </button>
               <a href={currentSystem.url} target="_blank" className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors" title="新窗口打开">
                  <ExternalLink className="w-4 h-4" />
               </a>
            </div>
         </header>

         {/* Iframe Container */}
         <div className="flex-1 relative w-full h-full bg-gray-50">
             <iframe 
                key={iframeKey}
                src={currentSystem.url} 
                className="w-full h-full border-none" 
                title="System View"
             />
         </div>
      </main>

      {/* Right Sidebar (Fixed) */}
      <aside className="w-64 bg-white border-l border-gray-200 h-full flex flex-col shadow-xl z-20 shrink-0">
         {/* Logo Area */}
         <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
             <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a3c26] to-[#2c4c38] flex items-center justify-center text-white font-bold text-xl">苏</div>
                 <span className="font-bold text-gray-800 text-sm tracking-wide">苏周到二十四节气</span>
             </div>
         </div>

         {/* Menu */}
         <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            {/* O-End */}
            <div>
               <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">平台运营 (O端)</div>
               <button 
                  onClick={() => switchSystem('/admin', '平台管理后台', 'O端', 'bg-blue-100 text-blue-700')}
                  className={`w-full flex items-center px-3 py-3 rounded-lg transition-all group ${currentSystem.type === 'O端' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}
               >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 transition-colors ${currentSystem.type === 'O端' ? 'bg-blue-100 text-blue-600' : 'bg-blue-50 text-blue-500 group-hover:bg-blue-100'}`}>
                     <Monitor className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                     <div className="font-medium">平台管理后台</div>
                     <div className="text-xs text-gray-400 mt-0.5">资源/订单/系统配置</div>
                  </div>
               </button>
            </div>

            {/* C-End */}
            <div>
               <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">移动客户端 (C端)</div>
               <button 
                  onClick={() => switchSystem('/mobile/activity', '移动端预览', 'C端', 'bg-green-100 text-green-700')}
                  className={`w-full flex items-center px-3 py-3 rounded-lg transition-all group ${currentSystem.type === 'C端' ? 'bg-green-50 text-green-600 border-r-4 border-green-500' : 'text-gray-600 hover:bg-gray-50'}`}
               >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 transition-colors ${currentSystem.type === 'C端' ? 'bg-green-100 text-green-600' : 'bg-green-50 text-green-500 group-hover:bg-green-100'}`}>
                     <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                     <div className="font-medium">移动端预览</div>
                     <div className="text-xs text-gray-400 mt-0.5">用户/互动/商城</div>
                  </div>
               </button>
            </div>
         </div>

         {/* Footer */}
         <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
             <div className="text-xs text-center text-gray-400">
                 <p>苏州市二十四节气活动系统 v2.0</p>
                 <p className="mt-1">© 2026 TechDemo</p>
             </div>
         </div>
      </aside>
    </div>
  );
}
