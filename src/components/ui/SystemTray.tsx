import React from 'react';

export interface TrayIcon {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

interface SystemTrayProps {
  clock: string;
  trayIcons: TrayIcon[];
}


const SystemTray: React.FC<SystemTrayProps> = ({ clock, trayIcons }) => {
  const [popup, setPopup] = React.useState<{title: string, x: number, y: number} | null>(null);

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded bg-blue-200/40 border border-blue-300 shadow text-xs text-blue-900 font-mono relative">
      {trayIcons.map((ti, idx) => (
        <span
          key={idx}
          title={ti.title}
          className="text-lg cursor-pointer hover:scale-110 transition-transform"
          onClick={e => {
            if (ti.onClick) ti.onClick();
            setPopup({ title: ti.title, x: e.currentTarget.offsetLeft, y: e.currentTarget.offsetTop });
            setTimeout(() => setPopup(null), 2000);
          }}
        >
          {ti.icon}
        </span>
      ))}
      <span className="ml-2 text-blue-900 font-bold">{clock}</span>
      {popup && (
        <div
          className="absolute z-50 px-3 py-1 rounded bg-white border border-blue-300 shadow text-blue-900 text-xs animate-fade-in"
          style={{
            left: popup.x,
            bottom: '2.2rem',
            minWidth: 80,
            pointerEvents: 'none',
          }}
        >
          {popup.title}
        </div>
      )}
    </div>
  );
};

export default SystemTray;
