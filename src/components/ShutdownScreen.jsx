import React, { useState, useEffect } from 'react';
import { Power } from 'lucide-react';

const ShutdownScreen = ({ isVisible, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      return;
    }

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary via-primary/90 to-black flex items-center justify-center">
      <div className="text-center space-y-8 animate-fadeIn">
        {/* Logo/Icon */}
        <div className="relative">
          <div className="w-24 h-24 bg-danger rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Power className="w-12 h-12 text-white" />
          </div>
          
          {/* Progress Circle */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#f21212"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${progress * 2.51} 251`}
                className="transition-all duration-300 ease-out"
              />
            </svg>
            
            {/* Progress Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white">Putting on standby...</h2>
          <p className="text-xl text-gray-200">
            Shutting down all systems and devices
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto">
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-danger h-3 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShutdownScreen;