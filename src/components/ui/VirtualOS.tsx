import React, { useState } from 'react';
import { useWindowsManager, AppWindow } from './useWindowsManager';
import WindowsLoadingScreen from './WindowsLoadingScreen';
import Window from './Window';
import NotepadApp from './NotepadApp';
import BrowserApp from './BrowserApp';
import MyComputerApp from './MyComputerApp';
import RecycleBinApp from './RecycleBinApp';
import SystemTray, { TrayIcon } from './SystemTray';
import AboutMeHelpWindow from './AboutMeHelpWindow';

interface VirtualOSProps {
  onExit: () => void;
}

const apps = [
  { name: 'My Computer', icon: '💻' },
  { name: 'Notepad', icon: '📝' },
  { name: 'Browser', icon: '🌐' },
  { name: 'Recycle Bin', icon: '🗑️' }
];

// AppWindow type comes from useWindowsManager
const INITIAL_WINDOWS: AppWindow[] = [];

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const DEFAULT_ICONS = [
  { name: 'My Computer', icon: '💻', type: 'system' },
  { name: 'Notepad', icon: '📝', type: 'app' },
  { name: 'Browser', icon: '🌐', type: 'app' },
  { name: 'Recycle Bin', icon: '🗑️', type: 'system' },
];

const VirtualOS: React.FC<VirtualOSProps> = ({ onExit }) => {
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const [icons, setIcons] = useState(DEFAULT_ICONS);
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<{ icon: any; action: 'copy' | 'cut' } | null>(null);
  const [showProperties, setShowProperties] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [loading, setLoading] = useState(true);
  const [showStart, setShowStart] = useState(false);
  const [showAboutMeHelp, setShowAboutMeHelp] = useState(false);
  const {
    windows,
    setWindows,
    focusWindow,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    maximizeWindow,
    restoreFromMaximize,
    moveWindow,
    snapWindow
  } = useWindowsManager(INITIAL_WINDOWS);
  const [clock, setClock] = useState(getCurrentTime());

  // System tray icons
  const [trayIcons] = useState<TrayIcon[]>([
    {
      icon: <span>📶</span>,
      title: 'Network',
    },
    {
      icon: <span>🔊</span>,
      title: 'Volume',
    },
    {
      icon: <span>🔋</span>,
      title: 'Battery',
    },
  ]);


  // Band select state
  const [bandSelect, setBandSelect] = useState<{start: {x: number, y: number} | null, end: {x: number, y: number} | null, visible: boolean}>({start: null, end: null, visible: false});
  const iconRefs = React.useRef<Record<string, HTMLDivElement | null>>({});


  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => setClock(getCurrentTime()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);



  const openNotepad = () => {
    const existing = windows.find(w => w.type === 'notepad');
    if (existing) {
      restoreWindow(existing.id);
      return setShowStart(false);
    }
    openWindow({
      id: 'notepad',
      type: 'notepad',
      title: 'Notepad',
      x: 160,
      y: 120,
      width: 420,
      height: 320,
      minimized: false,
      maximized: false,
      zIndex: 1,
      focused: true,
    });
    setShowStart(false);
  };

  const openBrowser = () => {
    const existing = windows.find(w => w.type === 'browser');
    if (existing) {
      restoreWindow(existing.id);
      return setShowStart(false);
    }
    openWindow({
      id: 'browser',
      type: 'browser',
      title: 'Browser',
      x: 200,
      y: 140,
      width: 600,
      height: 400,
      minimized: false,
      maximized: false,
      zIndex: 1,
      focused: true,
    });
    setShowStart(false);
  };

  const openMyComputer = () => {
    const existing = windows.find(w => w.type === 'mycomputer');
    if (existing) {
      restoreWindow(existing.id);
      return setShowStart(false);
    }
    openWindow({
      id: 'mycomputer',
      type: 'mycomputer',
      title: 'My Computer',
      x: 180,
      y: 100,
      width: 500,
      height: 350,
      minimized: false,
      maximized: false,
      zIndex: 1,
      focused: true,
    });
    setShowStart(false);
  };

  const openRecycleBin = () => {
    const existing = windows.find(w => w.type === 'recyclebin');
    if (existing) {
      restoreWindow(existing.id);
      return setShowStart(false);
    }
    openWindow({
      id: 'recyclebin',
      type: 'recyclebin',
      title: 'Recycle Bin',
      x: 220,
      y: 180,
      width: 400,
      height: 320,
      minimized: false,
      maximized: false,
      zIndex: 1,
      focused: true,
    });
    setShowStart(false);
  };

  const dragWindow = (id: string, x: number, y: number, dragging?: boolean) => {
    if (dragging !== undefined) setIsDraggingWindow(dragging);
    if (dragging === false) return;
    snapWindow(id, x, y, window.innerWidth, window.innerHeight - 48);
  };



  const handleDesktopIcon = (name: string) => {
    if (name === 'Notepad') openNotepad();
    if (name === 'Browser') openBrowser();
    if (name === 'My Computer') openMyComputer();
    if (name === 'Recycle Bin') openRecycleBin();
  };

  const handleStartMenu = (item: string) => {
    if (item === 'Notepad') openNotepad();
    if (item === 'Browser') openBrowser();
    if (item === 'My Computer') openMyComputer();
    if (item === 'Recycle Bin') openRecycleBin();
    if (item === 'Programs') openNotepad();
    if (item === 'Shut Down') onExit();
    setShowStart(false);
  };

  const handleTaskbarButton = (id: string) => {
    restoreWindow(id);
  };

  const handleNewFolder = () => {
    let base = 'New Folder';
    let name = base;
    let i = 1;
    while (icons.some(ic => ic.name === name)) {
      name = `${base} (${i++})`;
    }
    setIcons(prev => [...prev, { name, icon: '📁', type: 'folder' }]);
    setSelectedIcons([name]);
  };

  const handlePaste = () => {
    if (!clipboard) return;
    let name = clipboard.icon.name;
    let i = 1;
    while (icons.some(ic => ic.name === name)) {
      name = `${clipboard.icon.name} (${i++})`;
    }
    setIcons(prev => [...prev, { ...clipboard.icon, name }]);
    setClipboard(null);
  };

  const handleSelectAll = () => {
    setSelectedIcons(icons.map(ic => ic.name));
  };

  const handleArrangeIcons = () => {
    setIcons(prev => [...[...prev].sort((a, b) => a.name.localeCompare(b.name))]);
  };

  const handleRefresh = () => {
    setIcons(prev => [...prev]);
  };

  if (loading) {
    return <WindowsLoadingScreen onFinish={() => setLoading(false)} duration={3000} />;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        fontFamily: 'Tahoma, Verdana, Segoe UI, Arial',
        backgroundImage: 'url(/bliss.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Desktop icons */}
      <div
        className="flex-1 relative select-none"
        onMouseDown={e => {
           if (e.button !== 0) return; 
        if ((e.target as HTMLElement).closest('.desktop-icon')) return;
        if (isDraggingWindow) return;
        setBandSelect({ start: { x: e.clientX, y: e.clientY }, end: { x: e.clientX, y: e.clientY }, visible: true });
        setSelectedIcons([]);
        setContextMenu(c => c.visible ? { ...c, visible: false } : c);
        }}
        onMouseMove={e => {
        if (!bandSelect.visible) return;
        if (isDraggingWindow) return; 
        setBandSelect(bs => bs.visible && bs.start ? { ...bs, end: { x: e.clientX, y: e.clientY } } : bs);
        }}
        onMouseUp={e => {
          if (!bandSelect.visible || !bandSelect.start || !bandSelect.end) return;
          const x1 = Math.min(bandSelect.start.x, bandSelect.end.x);
          const y1 = Math.min(bandSelect.start.y, bandSelect.end.y);
          const x2 = Math.max(bandSelect.start.x, bandSelect.end.x);
          const y2 = Math.max(bandSelect.start.y, bandSelect.end.y);
          const selected: string[] = [];
          icons.forEach(icon => {
            const ref = iconRefs.current[icon.name];
            if (ref) {
              const rect = ref.getBoundingClientRect();
              if (!(rect.right < x1 || rect.left > x2 || rect.bottom < y1 || rect.top > y2)) {
                selected.push(icon.name);
              }
            }
          });
          setSelectedIcons(prev => {
            if (e.ctrlKey) {
              return Array.from(new Set([...prev, ...selected]));
            } else {
              return selected;
            }
          });
          setBandSelect({ start: null, end: null, visible: false });
        }}
        onClick={e => {
          setSelectedIcons([]);
          setContextMenu(c => c.visible ? { ...c, visible: false } : c);
        }}
        onContextMenu={e => {
          e.preventDefault();
          setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
          setShowStart(false);
        }}
        style={{ userSelect: bandSelect.visible ? 'none' : undefined }}
      >
        {contextMenu.visible && (
          <div
            className="fixed z-[9999] min-w-[185px] rounded-xl border border-blue-300 shadow-2xl animate-fade-in"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
              background: 'linear-gradient(180deg, #fafdff 85%, #c3e0fa 100%)',
              boxShadow: '0 8px 32px 0 rgba(36,94,219,0.18)',
              border: '2px solid #245edb',
              padding: '7px 0',
              fontFamily: 'Tahoma, Verdana, Segoe UI, Arial',
            }}
          >
            <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-blue-900 hover:bg-blue-100 active:bg-blue-200 text-[15px] transition rounded-none" onClick={() => { handleNewFolder(); setContextMenu(c => ({ ...c, visible: false })); }}>
              <span className="text-base">📁</span> New &gt; Folder
            </button>
            <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-blue-900 hover:bg-blue-100 active:bg-blue-200 text-[15px] transition rounded-none" onClick={() => { handlePaste(); setContextMenu(c => ({ ...c, visible: false })); }} disabled={!clipboard}>
              <span className="text-base">📋</span> Paste
            </button>
            <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-blue-900 hover:bg-blue-100 active:bg-blue-200 text-[15px] transition rounded-none" onClick={() => { handleSelectAll(); setContextMenu(c => ({ ...c, visible: false })); }}>
              <span className="text-base">🔲</span> Select All
            </button>
            <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-blue-900 hover:bg-blue-100 active:bg-blue-200 text-[15px] transition rounded-none" onClick={() => { handleArrangeIcons(); setContextMenu(c => ({ ...c, visible: false })); }}>
              <span className="text-base">🔀</span> Arrange Icons
            </button>
            <div className="my-1 h-[1px] bg-blue-200 mx-2 rounded-full" />
            <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-blue-900 hover:bg-blue-100 active:bg-blue-200 text-[15px] transition rounded-none" onClick={() => { handleRefresh(); setContextMenu(c => ({ ...c, visible: false })); }}>
              <span className="text-base">🔄</span> Refresh
            </button>
            <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-blue-900 hover:bg-blue-100 active:bg-blue-200 text-[15px] transition rounded-none" onClick={() => { setShowProperties(true); setContextMenu(c => ({ ...c, visible: false })); }}>
              <span className="text-base">⚙️</span> Properties
            </button>
          </div>
        )}
        {/* App windows */}
        {windows.map(w => (
          !w.minimized && (
            <Window
              key={w.id}
              title={w.title}
              x={w.x}
              y={w.y}
              width={w.width}
              height={w.height}
              zIndex={w.zIndex}
              focused={w.focused}
              minimized={w.minimized}
              isMaximized={!!w.maximized}
              onClose={() => closeWindow(w.id)}
              onMinimize={() => minimizeWindow(w.id)}
              onMaximize={() => (w.maximized ? restoreFromMaximize(w.id) : maximizeWindow(w.id))}
              onFocus={() => focusWindow(w.id)}
              onDrag={(x: number, y: number, dragging?: boolean) => dragWindow(w.id, x, y, dragging)}
            >
              {w.type === 'notepad' && <NotepadApp />}
              {w.type === 'browser' && <BrowserApp />}
              {w.type === 'mycomputer' && <MyComputerApp />}
              {w.type === 'recyclebin' && <RecycleBinApp />}
              {w.type === 'aboutme' && <AboutMeHelpWindow onClose={() => closeWindow(w.id)} />}

            </Window>
          )
        ))}
        {/* Desktop icons */}
        <div className="absolute left-6 top-6 flex flex-col space-y-6">
          {icons.map(icon => (
            <div
              key={icon.name}
              ref={el => { if (icon && icon.name) iconRefs.current[icon.name] = el; }}
              className={`desktop-icon flex flex-col items-center cursor-pointer select-none group
                ${selectedIcons.includes(icon.name)
                  ? 'ring-2 ring-blue-600 bg-gradient-to-b from-blue-400/90 to-blue-700/90 shadow-xl border border-blue-300 animate-pulse-fast'
                  : 'hover:ring-2 hover:ring-blue-300 hover:bg-blue-100/70'}
                active:ring-4 active:ring-blue-400 transition-all duration-100`}
              onClick={e => {
                e.stopPropagation();
                if (e.ctrlKey) {
                  setSelectedIcons(sel => sel.includes(icon.name) ? sel.filter(n => n !== icon.name) : [...sel, icon.name]);
                } else {
                  setSelectedIcons([icon.name]);
                }
              }}
              onDoubleClick={() => handleDesktopIcon(icon.name)}
              onContextMenu={e => {
                e.stopPropagation();
                setSelectedIcons([icon.name]);
                setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
              }}
            >
              <div className="text-3xl mb-1 group-hover:scale-110 transition-transform duration-150 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                {icon.icon}
              </div>
              <div
                className="text-xs px-2 rounded shadow mt-1"
                style={{
                  color: '#fff',
                  background: selectedIcons.includes(icon.name)
                    ? 'linear-gradient(180deg, #245edb 80%, #4f94ef 100%)'
                    : 'rgba(0,0,64,0.60)',
                  textShadow: '1px 1px 2px #000, 0 0 2px #fff',
                  border: selectedIcons.includes(icon.name) ? '1.5px solid #fff' : '1px solid #a3c1e6',
                  boxShadow: selectedIcons.includes(icon.name)
                    ? '0 2px 8px 0 #245edb55, 0 0 0 3px #fff7 inset'
                    : '0 1px 3px rgba(0,0,0,0.3)',
                  padding: '2px 8px',
                  transition: 'background 0.15s, color 0.15s, border 0.15s, box-shadow 0.15s',
                }}
              >
                {icon.name}
              </div>
            </div>
          ))}
        </div>
        {/* Band select rectangle */}
        {bandSelect.visible && bandSelect.start && bandSelect.end && !isDraggingWindow && (
          <div
            className="absolute z-[9999] pointer-events-none border-2 border-blue-400 bg-blue-200/30 rounded"
            style={{
              left: Math.min(bandSelect.start.x, bandSelect.end.x),
              top: Math.min(bandSelect.start.y, bandSelect.end.y),
              width: Math.abs(bandSelect.end.x - bandSelect.start.x),
              height: Math.abs(bandSelect.end.y - bandSelect.start.y),
            }}
          />
        )}
        {/* Properties Modal */}
        {showProperties && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-2xl border-2 border-blue-400 p-6 min-w-[320px] max-w-[90vw] animate-fade-in">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">⚙️</span>
                <span className="font-bold text-blue-900 text-lg">Desktop Properties</span>
              </div>
              <div className="mb-6 text-blue-900">
                <div>Total Icons: {icons.length}</div>
                <div>Selected: {selectedIcons.length > 0 ? selectedIcons.join(', ') : 'None'}</div>
                <div>Folders: {icons.filter(i => i.type === 'folder').length}</div>
                <div>System Icons: {icons.filter(i => i.type === 'system').length}</div>
              </div>
              <div className="flex justify-end gap-2">
                <button className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600" onClick={() => setShowProperties(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Taskbar */}
      <div
        className="h-12 flex items-center px-4 relative shadow-xl"
        style={{
          background: 'linear-gradient(to top, #245edb 80%, #4f94ef 100%)',
          borderTop: '2px solid #1a458a',
          boxShadow: '0 0 10px 2px rgba(0,0,0,0.25)',
        }}
      >
        <button
          className="flex items-center space-x-2 px-5 py-1 rounded-full shadow-xl font-bold text-white border-2 border-blue-300 bg-gradient-to-b from-[#64baff] to-[#245edb] hover:from-[#7ec9ff] hover:to-[#357ae8] focus:ring-2 focus:ring-yellow-200 outline-none text-lg"
          style={{
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)',
            fontFamily: 'Tahoma, Verdana, Segoe UI, Arial',
            letterSpacing: '0.5px',
            textShadow: '1px 1px 2px #245edb',
          }}
          onClick={() => setShowStart(v => !v)}
        >
          <span className="text-lg" style={{ filter: 'drop-shadow(0 1px 1px #fff)' }}>🪟</span>
          <span className="ml-1 font-bold" style={{ fontSize: 18 }}>Start</span>
        </button>
        {/* Taskbar running apps */}
        <div className="flex space-x-2 ml-4">
          {windows.map(w => (
            <button
              key={w.id}
              className={`px-3 py-1 rounded text-xs font-bold shadow border border-blue-200 ${w.focused && !w.minimized ? 'bg-gradient-to-b from-[#eaf6fd] to-[#b4d6fa] text-blue-900 border-blue-400' : 'bg-gradient-to-b from-[#dbefff] to-[#a4c7ef] text-blue-800 hover:from-[#eaf6fd] hover:to-[#b4d6fa] border-blue-200'} ${w.minimized ? 'opacity-60' : ''}`}
              style={{ boxShadow: w.focused && !w.minimized ? '0 0 8px #4f94ef' : undefined, transition: 'all 0.15s' }}
              onClick={() => handleTaskbarButton(w.id)}
            >
              {w.title}
            </button>
          ))}
        </div>
        <div className="mx-2 h-8 w-[2px] bg-blue-200 rounded-full opacity-60" />
        {/* System Tray */}
        <div className="ml-auto flex items-center">
          <span
            className="ml-2 text-white text-sm opacity-70 cursor-pointer hover:underline hover:text-blue-200 transition"
            style={{
              textShadow: '1px 1px 2px #245edb',
              padding: '9px',
              borderRadius: '2px'
            }}
            onClick={() => {
              const existing = windows.find(w => w.type === 'aboutme');
              if (!existing) {
                openWindow({
                  id: 'aboutme',
                  type: 'aboutme',
                  title: 'Help and Support: About Michael Ruiz',
                  x: 320,
                  y: 120,
                  width: 440,
                  height: 420,
                  minimized: false,
                  maximized: false,
                  zIndex: 1,
                  focused: true
                });
              }
            }}
            tabIndex={0}
            aria-label="About Michael Ruiz"
          >
            MichaelRuizOS
          </span>
          <SystemTray clock={clock} trayIcons={trayIcons} />
        </div>
        <button
          className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow"
          onClick={onExit}
        >
          Exit
        </button>
        {/* Start Menu */}
        {showStart && (
          <div
            className="absolute left-4 bottom-14 w-[380px] h-[350px] rounded-2xl shadow-2xl border border-blue-900 z-50 animate-fade-in"
            style={{
              background: 'linear-gradient(90deg, #f1f6fa 70%, #c9e2f6 100%)',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.28)',
              border: '2px solid #245edb',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            {/* Left pane: App shortcuts */}
            <div
              className="flex flex-col flex-1 px-3 py-3"
              style={{ background: 'linear-gradient(180deg, #e6f0fa 90%, #b3d4fa 100%)', minWidth: 170 }}
            >
              <div className="font-bold text-blue-900 mb-2 ml-1 text-[15px]">Cascade XP</div>
              <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-200 active:bg-blue-300 text-blue-900 font-medium mb-1" onClick={() => handleStartMenu('Notepad')}>
                <span className="text-lg">📝</span> Notepad
              </button>
              <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-200 active:bg-blue-300 text-blue-900 font-medium mb-1" onClick={() => handleStartMenu('My Computer')}>
                <span className="text-lg">💻</span> My Computer
              </button>
              <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-200 active:bg-blue-300 text-blue-900 font-medium mb-1" onClick={() => handleStartMenu('Browser')}>
                <span className="text-lg">🌐</span> Browser
              </button>
              <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-200 active:bg-blue-300 text-blue-900 font-medium mb-1" onClick={() => handleStartMenu('Recycle Bin')}>
                <span className="text-lg">🗑️</span> Recycle Bin
              </button>
              <div className="h-[1px] bg-blue-200 my-2 rounded-full" />
              <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-200 active:bg-blue-300 text-blue-900 font-semibold" onClick={() => handleStartMenu('Programs')}>
                <span className="text-base">📂</span> All Programs
              </button>
            </div>
            {/* Right pane: User info and system links */}
            <div
              className="flex flex-col justify-between w-[140px] py-3 px-2"
              style={{ background: 'linear-gradient(180deg, #eaf1fc 80%, #d1e3fb 100%)', borderLeft: '1.5px solid #b3d4fa' }}
            >
              <div className="flex flex-col items-center">
                <img
                  src="/user_avatar.png"
                  alt="User avatar"
                  className="w-14 h-14 rounded-full border-2 border-blue-300 shadow mb-2"
                  style={{ background: '#e0eaf6' }}
                />
                <div className="text-xs text-blue-900 font-semibold mb-2">Michael Ruiz</div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-100 active:bg-blue-200 text-blue-900 text-sm" onClick={() => handleStartMenu('Documents')}>
                  <span className="text-base">📄</span> Documents
                </button>
                <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-100 active:bg-blue-200 text-blue-900 text-sm" onClick={() => handleStartMenu('Settings')}>
                  <span className="text-base">⚙️</span> Settings
                </button>
                <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-100 active:bg-blue-200 text-blue-900 text-sm" onClick={() => handleStartMenu('Run')}>
                  <span className="text-base">▶️</span> Run...
                </button>
                <div className="h-[1px] bg-blue-200 my-1 rounded-full" />
                <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-red-100 active:bg-red-200 text-red-700 text-sm font-bold" onClick={() => handleStartMenu('Shut Down')}>
                  <span className="text-base">⏻</span> Shut Down
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualOS;
