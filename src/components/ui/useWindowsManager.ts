import { useState } from 'react';

export type AppWindowType = 'notepad' | 'browser' | 'mycomputer' | 'recyclebin' | 'aboutme';

export interface AppWindow {
  id: string;
  type: AppWindowType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized?: boolean;
  zIndex: number;
  focused: boolean;
}

function getNextZIndex(windows: AppWindow[]) {
  return (windows.length ? Math.max(...windows.map(w => w.zIndex)) : 0) + 1;
}

export function useWindowsManager(initialWindows: AppWindow[] = []) {
  const [windows, setWindows] = useState<AppWindow[]>(initialWindows);

  const focusWindow = (id: string) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, focused: true, zIndex: getNextZIndex(ws) } : { ...w, focused: false }));
  };

  const openWindow = (window: AppWindow) => {
    setWindows(ws => [
      ...ws.map(w => ({ ...w, focused: false })),
      { ...window, zIndex: getNextZIndex(ws), focused: true }
    ]);
  };

  const closeWindow = (id: string) => {
    setWindows(ws => ws.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, minimized: true, focused: false } : w));
  };

  const restoreWindow = (id: string) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, minimized: false, focused: true, zIndex: getNextZIndex(ws) } : { ...w, focused: false }));
  };

  const maximizeWindow = (id: string) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, maximized: true, minimized: false, focused: true, zIndex: getNextZIndex(ws) } : { ...w, focused: false }));
  };

  const restoreFromMaximize = (id: string) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, maximized: false, focused: true, zIndex: getNextZIndex(ws) } : { ...w, focused: false }));
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, x, y } : w));
  };

  // Window snapping to edges (basic)
  const snapWindow = (id: string, x: number, y: number, screenW: number, screenH: number, snapDist = 32) => {
    let snappedX = x;
    let snappedY = y;
    const w = windows.find(win => win.id === id)?.width || 400;
    const h = windows.find(win => win.id === id)?.height || 300;
    if (x < snapDist) snappedX = 0;
    if (y < snapDist) snappedY = 0;
    if (x + w > screenW - snapDist) snappedX = screenW - w;
    if (y + h > screenH - snapDist) snappedY = screenH - h;
    moveWindow(id, snappedX, snappedY);
  };

  return {
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
  };
}
