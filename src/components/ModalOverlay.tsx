import React from 'react';

// 弹窗遮罩
export const ModalOverlay = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
    <div className="relative z-10 w-full max-w-[320px] animate-in fade-in zoom-in duration-200">
      {children}
    </div>
  </div>
);
