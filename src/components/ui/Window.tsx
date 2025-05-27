import React, { ReactNode, useRef } from 'react';

interface WindowProps {
  title: string;
  children: ReactNode;
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex: number;
  focused: boolean;
  minimized?: boolean;
  isMaximized?: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onDrag: (x: number, y: number, dragging?: boolean) => void;
}

const Window: React.FC<WindowProps> = ({
  title,
  children,
  x,
  y,
  width = 400,
  height = 300,
  zIndex,
  focused,
  minimized = false,
  isMaximized = false,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onDrag
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  let offsetX = 0;
  let offsetY = 0;
  
  // Resize logic
  const handleResize = (e: React.MouseEvent, direction: 'n'|'s'|'e'|'w'|'ne'|'nw'|'se'|'sw') => {
    e.stopPropagation();
    e.preventDefault();
    if (!windowRef.current) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startRect = windowRef.current.getBoundingClientRect();
    const startWidth = startRect.width;
    const startHeight = startRect.height;
    const startLeft = startRect.left;
    const startTop = startRect.top;
    const minWidth = 240;
    const minHeight = 120;
    function onMove(moveEvent: MouseEvent) {
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = x;
      let newY = y;
      if (direction.includes('e')) {
        newWidth = Math.max(minWidth, startWidth + (moveEvent.clientX - startX));
      }
      if (direction.includes('s')) {
        newHeight = Math.max(minHeight, startHeight + (moveEvent.clientY - startY));
      }
      if (direction.includes('w')) {
        newWidth = Math.max(minWidth, startWidth - (moveEvent.clientX - startX));
        newX = x + (moveEvent.clientX - startX);
      }
      if (direction.includes('n')) {
        newHeight = Math.max(minHeight, startHeight - (moveEvent.clientY - startY));
        newY = y + (moveEvent.clientY - startY);
      }
      onDrag(newX, newY, true);
      if (windowRef.current) {
        windowRef.current.style.width = `${newWidth}px`;
        windowRef.current.style.height = `${newHeight}px`;
        windowRef.current.style.left = `${newX}px`;
        windowRef.current.style.top = `${newY}px`;
      }
    }
    function onUp(moveEvent: MouseEvent) {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = x;
      let newY = y;
      if (direction.includes('e')) {
        newWidth = Math.max(minWidth, startWidth + (moveEvent.clientX - startX));
      }
      if (direction.includes('s')) {
        newHeight = Math.max(minHeight, startHeight + (moveEvent.clientY - startY));
      }
      if (direction.includes('w')) {
        newWidth = Math.max(minWidth, startWidth - (moveEvent.clientX - startX));
        newX = x + (moveEvent.clientX - startX);
      }
      if (direction.includes('n')) {
        newHeight = Math.max(minHeight, startHeight - (moveEvent.clientY - startY));
        newY = y + (moveEvent.clientY - startY);
      }
      onDrag(newX, newY, false);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return; 
    if (windowRef.current) {
      offsetX = e.clientX - x;
      offsetY = e.clientY - y;
      onDrag(x, y, true); 
      const handleMouseMove = (moveEvent: MouseEvent) => {
        onDrag(moveEvent.clientX - offsetX, moveEvent.clientY - offsetY, true);
      };
      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        onDrag(x, y, false); // Notify drag end
      };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    onFocus();
  };


  return (
    <div
      ref={windowRef}
      className={`fixed shadow-xl border border-blue-800 rounded bg-gray-50 ${focused ? 'ring-4 ring-blue-400' : ''}`}
      style={{
        left: x,
        top: y,
        width,
        height,
        zIndex,
        boxShadow: focused ? '0 0 0 4px #4f8ef7' : undefined,
        resize: isMaximized ? undefined : undefined // let us control resize manually
      }}
      onMouseDown={onFocus}
    >
      {/* Resize handles - only if not maximized */}
      {!isMaximized && (
        <>
          {/* Corners */}
          <div className="absolute z-50 w-3 h-3 left-0 top-0 cursor-nwse-resize" onMouseDown={e => handleResize(e, 'nw')} />
          <div className="absolute z-50 w-3 h-3 right-0 top-0 cursor-nesw-resize" onMouseDown={e => handleResize(e, 'ne')} />
          <div className="absolute z-50 w-3 h-3 left-0 bottom-0 cursor-nesw-resize" onMouseDown={e => handleResize(e, 'sw')} />
          <div className="absolute z-50 w-3 h-3 right-0 bottom-0 cursor-nwse-resize" onMouseDown={e => handleResize(e, 'se')} />
          {/* Sides */}
          <div className="absolute z-40 h-full w-1 left-0 top-0 cursor-ew-resize" onMouseDown={e => handleResize(e, 'w')} />
          <div className="absolute z-40 h-full w-1 right-0 top-0 cursor-ew-resize" onMouseDown={e => handleResize(e, 'e')} />
          <div className="absolute z-40 w-full h-1 left-0 top-0 cursor-ns-resize" onMouseDown={e => handleResize(e, 'n')} />
          <div className="absolute z-40 w-full h-1 left-0 bottom-0 cursor-ns-resize" onMouseDown={e => handleResize(e, 's')} />
        </>
      )}

      <div
        className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-blue-700 to-blue-500 text-white cursor-move rounded-t"
        style={{height: 28, fontFamily: 'Tahoma, Verdana, Segoe UI, Arial'}}
        onMouseDown={handleMouseDown}
      >
        <span className="font-bold text-sm">{title}</span>
        <div className="flex space-x-1">
          <button
            className="w-6 h-6 bg-blue-300 hover:bg-blue-400 rounded text-blue-900 font-bold flex items-center justify-center"
            onClick={e => { e.stopPropagation(); onMinimize(); }}
            title="Minimize"
          >
            <span className="-mt-1">_</span>
          </button>
          <button
            className="w-6 h-6 bg-blue-300 hover:bg-blue-400 rounded text-blue-900 font-bold flex items-center justify-center"
            onClick={e => { e.stopPropagation(); onMaximize(); }}
            title={isMaximized ? "Restore Down" : "Maximize"}
          >
            {isMaximized ? <span style={{fontWeight:'bold'}}>🗗</span> : <span style={{fontWeight:'bold'}}>🗖</span>}
          </button>
          <button
            className="w-6 h-6 bg-red-400 hover:bg-red-600 rounded text-white font-bold flex items-center justify-center"
            onClick={e => { e.stopPropagation(); onClose(); }}
            title="Close"
          >
            ×
          </button>
        </div>
      </div>
      <div className="p-2 bg-white h-full overflow-auto" style={{height: `calc(100% - 28px)`}}>
        {children}
      </div>
    </div>
  );
};

export default Window;
