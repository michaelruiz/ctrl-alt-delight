import React, { useEffect, useState } from "react";

interface WindowsLoadingScreenProps {
  onFinish: () => void;
  duration?: number; // ms
}

const WindowsLoadingScreen: React.FC<WindowsLoadingScreenProps> = ({ onFinish, duration = 3000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p < 100) return p + 2;
        clearInterval(interval);
        setTimeout(onFinish, 400);
        return 100;
      });
    }, duration / 50);
    return () => clearInterval(interval);
  }, [duration, onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black">
      <div className="mb-10 flex flex-col items-center">
        <img
          src="/windowsxp_logo.png"
          alt="Windows XP Logo"
          className="w-80 mb-6 drop-shadow-xl"
          style={{ filter: 'drop-shadow(0 2px 12px #0af)' }}
        />
        <div className="w-64 h-4 bg-[#222] rounded-full border border-[#444] shadow-inner overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#5bc0f7] via-[#3a97d3] to-[#043c6c] rounded-full animate-pulse"
            style={{ width: `${progress}%`, transition: 'width 0.2s linear' }}
          />
        </div>
        <div className="text-sm text-white mt-4 font-mono tracking-wider opacity-80">
          Loading Windows XP - Michael Ruiz Edition...
        </div>
      </div>
    </div>
  );
};

export default WindowsLoadingScreen;
