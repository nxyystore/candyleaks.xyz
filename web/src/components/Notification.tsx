import React, { useEffect, useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function Notification({ 
  message, 
  type, 
  duration = 3000,
  position = 'bottom-right' 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => setIsVisible(false), 300);
    }, duration - 300);

    return () => clearTimeout(timeout);
  }, [duration]);

  if (!isVisible) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 transform transition-all duration-300 ${
      isLeaving ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
    }`}>
      <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
        type === 'success' 
          ? 'bg-green-500/20 border border-green-500/30' 
          : 'bg-red-500/20 border border-red-500/30'
      }`}>
        {type === 'success' ? (
          <Check className="w-5 h-5 text-green-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-400" />
        )}
        <p className={`text-sm ${
          type === 'success' ? 'text-green-400' : 'text-red-400'
        }`}>
          {message}
        </p>
      </div>
    </div>
  );
}