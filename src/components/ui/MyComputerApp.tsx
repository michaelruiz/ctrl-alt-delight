import React from 'react';

const DRIVES = [
  {
    id: 'c',
    icon: '💾',
    label: 'Local Disk (C:)',
    total: '120 GB',
    free: '64 GB',
  },
  {
    id: 'd',
    icon: '📀',
    label: 'DVD Drive (D:)',
    total: '4.7 GB',
    free: '0 GB',
  },
  {
    id: 'usb',
    icon: '🔌',
    label: 'USB (E:)',
    total: '32 GB',
    free: '28 GB',
  },
  {
    id: 'net',
    icon: '🌐',
    label: 'Network Drive (Z:)',
    total: '1 TB',
    free: '850 GB',
  },
];

const FOLDERS = [
  { id: 'docs', icon: '📄', label: 'Documents' },
  { id: 'pics', icon: '🖼️', label: 'Pictures' },
  { id: 'music', icon: '🎵', label: 'Music' },
  { id: 'dl', icon: '⬇️', label: 'Downloads' },
  { id: 'vid', icon: '🎬', label: 'Videos' },
];

const MyComputerApp: React.FC = () => {
  const [selectedDrive, setSelectedDrive] = React.useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = React.useState<string | null>(null);

  return (
    <div className="h-full flex flex-col text-blue-900 bg-blue-50/40">
      {/* Toolbar */}
      <div className="flex gap-2 px-2 py-1 border-b border-blue-200 bg-gradient-to-r from-blue-100/70 to-blue-200/40 text-sm">
        <button className="font-bold hover:bg-blue-200 px-2 py-1 rounded">File</button>
        <button className="font-bold hover:bg-blue-200 px-2 py-1 rounded">Edit</button>
        <button className="font-bold hover:bg-blue-200 px-2 py-1 rounded">View</button>
        <button className="font-bold hover:bg-blue-200 px-2 py-1 rounded">Go</button>
        <button className="font-bold hover:bg-blue-200 px-2 py-1 rounded">Help</button>
      </div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 px-4 py-2 bg-blue-100/60 border-b border-blue-200 text-xs font-mono">
        <span className="font-bold text-blue-800">My Computer</span>
        {selectedDrive && (
          <>
            <span className="mx-1">/</span>
            <span>{DRIVES.find(d => d.id === selectedDrive)?.label}</span>
          </>
        )}
        {selectedFolder && (
          <>
            <span className="mx-1">/</span>
            <span>{FOLDERS.find(f => f.id === selectedFolder)?.label}</span>
          </>
        )}
      </div>
      {/* Content */}
      <div className="flex-1 flex flex-col items-center p-6 gap-8 bg-gradient-to-br from-blue-100/40 to-blue-50/80 border border-blue-100 rounded-b-xl shadow-inner overflow-auto">
        {/* Drives panel */}
        <div className="w-full max-w-2xl flex flex-col bg-white/80 border border-blue-200 rounded-lg shadow px-4 py-3 justify-start my-0 overflow-y-auto min-h-[260px] max-h-[calc(100vh-12rem)]">
          <div className="font-bold mb-2 text-blue-800 text-sm border-b border-blue-100 pb-1">Drives</div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {DRIVES.map(drive => (
              <div
                key={drive.id}
                className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all duration-100 shadow-sm
                  ${selectedDrive === drive.id ? 'border-blue-500 bg-blue-100/80 ring-2 ring-blue-300' : 'border-blue-200 bg-white hover:bg-blue-100/60'}`}
                onClick={() => { setSelectedDrive(drive.id); setSelectedFolder(null); }}
                tabIndex={0}
                aria-label={drive.label}
              >
                <span className="text-3xl">{drive.icon}</span>
                <div>
                  <div className="font-bold text-blue-900 text-sm leading-tight">{drive.label}</div>
                  <div className="text-xs text-blue-700 leading-tight">Free: {drive.free} / {drive.total}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Folders panel */}
        <div className="w-full max-w-2xl flex flex-col bg-white/80 border border-blue-200 rounded-lg shadow px-4 py-3 mt-8">
          <div className="font-bold mb-2 text-blue-800 text-sm border-b border-blue-100 pb-1">Folders</div>
          <div className="flex flex-col gap-2">
            {FOLDERS.map(folder => (
              <div
                key={folder.id}
                className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all duration-100 shadow-sm
                  ${selectedFolder === folder.id ? 'border-blue-500 bg-blue-100/80 ring-2 ring-blue-300' : 'border-blue-200 bg-white hover:bg-blue-100/60'}`}
                onClick={() => { setSelectedFolder(folder.id); setSelectedDrive(null); }}
                tabIndex={0}
                aria-label={folder.label}
              >
                <span className="text-2xl">{folder.icon}</span>
                <span className="font-medium text-blue-900 text-sm">{folder.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComputerApp;
