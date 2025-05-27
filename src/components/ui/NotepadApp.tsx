import React, { useState } from "react";

interface NotepadAppProps {
  initialText?: string;
}

const NotepadApp: React.FC<NotepadAppProps> = ({ initialText = "" }) => {
  const [text, setText] = useState(initialText);
  const [filename, setFilename] = useState<string | null>(null);
  const [wordWrap, setWordWrap] = useState(true);
  const [font, setFont] = useState('monospace');
  const [status, setStatus] = useState('Ready');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleNew = () => {
    if (text.length > 0 && !window.confirm('Discard current changes?')) return;
    setText('');
    setFilename(null);
    setStatus('New file');
  };

  const handleOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.log,.json,.js,.ts,.tsx,.html,.css,.csv';
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = evt => {
          setText(evt.target?.result as string);
          setFilename(file.name);
          setStatus(`Opened ${file.name}`);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSave = (as: boolean = false) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = as || !filename ? 'untitled.txt' : filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    setStatus(`Saved ${link.download}`);
  };

  const handleUndo = () => document.execCommand('undo');
  const handleRedo = () => document.execCommand('redo');
  const handleCut = () => document.execCommand('cut');
  const handleCopy = () => document.execCommand('copy');
  const handlePaste = () => document.execCommand('paste');
  const handleSelectAll = () => textareaRef.current?.select();
  const handleWordWrap = () => setWordWrap(w => !w);
  const handleFont = (f: string) => setFont(f);

  const updateSelection = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelection({ start: target.selectionStart, end: target.selectionEnd });
  };
  const getCursorPos = () => {
    const lines = text.substr(0, selection.start).split('\n');
    const row = lines.length;
    const col = lines[lines.length - 1].length + 1;
    return `Ln ${row}, Col ${col}`;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 border border-blue-300 rounded-xl shadow-lg overflow-hidden">
      {/* Menu Bar */}
      <div className="flex gap-2 px-2 py-1 bg-gradient-to-r from-blue-200/80 via-white/70 to-blue-100/80 border-b border-blue-200 text-xs select-none backdrop-blur-md rounded-t-xl shadow-sm">
        <div className="relative group">
          <button className="px-2 py-1 font-semibold text-blue-900 hover:bg-blue-300/60 hover:text-blue-800 rounded transition-colors duration-100 focus:outline-none focus:bg-blue-300/70">File</button>
          <div className="absolute left-0 top-full bg-white/95 border border-blue-200 shadow-xl rounded w-36 hidden group-hover:block z-50">
            <button className="block w-full text-left px-3 py-1 text-blue-800 hover:bg-blue-100/90 hover:text-blue-900 rounded" onClick={handleNew}>New</button>
            <button className="block w-full text-left px-3 py-1 text-blue-800 hover:bg-blue-100/90 hover:text-blue-900 rounded" onClick={handleOpen}>Open...</button>
            <button className="block w-full text-left px-3 py-1 text-blue-800 hover:bg-blue-100/90 hover:text-blue-900 rounded" onClick={()=>handleSave(false)}>Save</button>
            <button className="block w-full text-left px-3 py-1 text-blue-800 hover:bg-blue-100/90 hover:text-blue-900 rounded" onClick={()=>handleSave(true)}>Save As...</button>
          </div>
        </div>
        <div className="relative group">
          <button className="px-2 py-1 font-semibold text-blue-900 hover:bg-blue-300/60 hover:text-blue-800 rounded transition-colors duration-100 focus:outline-none focus:bg-blue-300/70">Edit</button>
          <div className="absolute left-0 top-full bg-white/95 border border-blue-200 shadow-xl rounded w-36 hidden group-hover:block z-50">
            <button className="block w-full text-left px-3 py-1 text-blue-800 hover:bg-blue-100/90 hover:text-blue-900 rounded" onClick={handleUndo}>Undo</button>
            <button className="block w-full text-left px-3 py-1 text-blue-800 hover:bg-blue-100/90 hover:text-blue-900 rounded" onClick={handleRedo}>Redo</button>
            <button className="block w-full text-left px-3 py-1 text-blue-800 hover:bg-blue-100/90 hover:text-blue-900 rounded" onClick={handleCut}>Cut</button>
            <button className="block w-full text-left px-3 py-1 text-blue-800 hover:bg-blue-100/90 hover:text-blue-900 rounded" onClick={handleCopy}>Copy</button>
            <button className="block w-full text-left px-3 py-1 text-blue-800 hover:bg-blue-100/90 hover:text-blue-900 rounded" onClick={handlePaste}>Paste</button>
            <button className="block w-full text-left px-3 py-1 text-blue-800 hover:bg-blue-100/90 hover:text-blue-900 rounded" onClick={handleSelectAll}>Select All</button>
          </div>
        </div>
        <div className="relative group">
          <button className="px-2 py-1 font-semibold text-blue-900 hover:bg-blue-300/60 hover:text-blue-800 rounded transition-colors duration-100 focus:outline-none focus:bg-blue-300/70">Format</button>
          <div className="absolute left-0 top-full bg-white/95 border border-blue-200 shadow-xl rounded w-44 hidden group-hover:block z-50">
            <button className="block w-full text-left px-3 py-1 text-blue-800 hover:bg-blue-100/90 hover:text-blue-900 rounded" onClick={handleWordWrap}>{wordWrap ? 'Disable' : 'Enable'} Word Wrap</button>
            <div className="px-3 py-1 text-xs text-blue-700">Font</div>
            <button className="block w-full text-left px-3 py-1 text-blue-800 hover:bg-blue-100/90 hover:text-blue-900 rounded" onClick={()=>handleFont('monospace')}>Monospace</button>
            <button className="block w-full text-left px-3 py-1 text-blue-800 hover:bg-blue-100/90 hover:text-blue-900 rounded" onClick={()=>handleFont('serif')}>Serif</button>
            <button className="block w-full text-left px-3 py-1 text-blue-800 hover:bg-blue-100/90 hover:text-blue-900 rounded" onClick={()=>handleFont('sans-serif')}>Sans-Serif</button>
          </div>
        </div>
        <div className="relative group">
          <button className="px-2 py-1 font-semibold text-blue-900 hover:bg-blue-300/60 hover:text-blue-800 rounded transition-colors duration-100 focus:outline-none focus:bg-blue-300/70">View</button>
          <div className="absolute left-0 top-full bg-white/95 border border-blue-200 shadow-xl rounded w-36 hidden group-hover:block z-50">
            <span className="block w-full text-left px-3 py-1 text-blue-400 cursor-not-allowed">Status Bar</span>
          </div>
        </div>
        <div className="relative group">
          <button className="px-2 py-1 font-semibold text-blue-900 hover:bg-blue-300/60 hover:text-blue-800 rounded transition-colors duration-100 focus:outline-none focus:bg-blue-300/70">Help</button>
          <div className="absolute left-0 top-full bg-white/95 border border-blue-200 shadow-xl rounded w-36 hidden group-hover:block z-50">
            <span className="block w-full text-left px-3 py-1 text-blue-400 cursor-not-allowed">About Notepad</span>
          </div>
        </div>
      </div>
      {/* Editor */}
      <textarea
        ref={textareaRef}
        className="flex-1 w-full border-0 rounded-none p-3 font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 text-blue-900 resize-none shadow-inner transition-all duration-150"
        style={{ minHeight: 200, fontFamily: font, whiteSpace: wordWrap ? 'pre-wrap' : 'pre', overflowWrap: wordWrap ? 'break-word' : 'normal', borderRadius: '0 0 0.75rem 0.75rem' }}
        value={text}
        onChange={e => setText(e.target.value)}
        onSelect={updateSelection}
        spellCheck={false}
      />
      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-gradient-to-r from-blue-100/60 via-white/70 to-blue-50/80 border-t border-blue-200 text-xs font-mono text-blue-700 shadow-inner rounded-b-xl">
        <span>{getCursorPos()}</span>
        <span>{wordWrap ? 'Word Wrap: On' : 'Word Wrap: Off'}</span>
        <span>{status}</span>
      </div>
    </div>
  );
};

export default NotepadApp;
