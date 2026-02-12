import React, { useState } from 'react';
import { X, AlertCircle, MapPin } from 'lucide-react';
import { ModalOverlay } from './ModalOverlay';

interface AddressModalProps {
  onClose: () => void;
  onSubmit: (address: { name: string; phone: string; address: string }) => void;
  title?: string;
}

export const AddressModal = ({ onClose, onSubmit, title = "填写收货信息" }: AddressModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-2xl p-5 w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 bg-gray-100 rounded-full">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">收货人</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors" 
              placeholder="请填写真实姓名" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">手机号</label>
            <input 
              type="tel" 
              required 
              pattern="^1[3-9]\d{9}$" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors" 
              placeholder="请填写11位手机号" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">详细地址</label>
            <textarea 
              required 
              rows={3} 
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors resize-none" 
              placeholder="街道、小区、门牌号" 
            />
          </div>
          
          <div className="bg-yellow-50 text-yellow-700 p-3 rounded-xl text-xs flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>地址提交后不可修改，请仔细核对。若因地址错误导致派送失败，需自行承担。</p>
          </div>

          <button type="submit" className="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" />
            确认提交
          </button>
        </form>
      </div>
    </ModalOverlay>
  );
};
