import React, { useRef, useState } from 'react';

interface Tab {
  id: number;
  url: string;
  title: string;
  history: string[];
  historyIndex: number;
  loading: boolean;
  error: string | null;
}

const HOME_URL = 'about:home';
const HOME_PAGE = `<div style="font-family:Segoe UI,Tahoma,Verdana,sans-serif;text-align:center;padding:2em;color:#2b426b"><h1>🌐 Welcome to Virtual Browser</h1><p>Type a URL above and press Enter to browse the web!</p></div>`;

const isValidUrl = (url: string) => {
  if (url.startsWith('about:')) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const normalizeUrl = (input: string) => {
  if (input.startsWith('about:')) return input;
  if (/^https?:\/\//.test(input)) return input;
  if (/^[\w-]+\.[\w-]+/.test(input)) return 'https://' + input;
  return input;
};

const BrowserApp: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([{
    id: 1,
    url: HOME_URL,
    title: 'Home',
    history: [HOME_URL],
    historyIndex: 0,
    loading: false,
    error: null
  }]);
  const [activeTab, setActiveTab] = useState(1);
  const [addressInput, setAddressInput] = useState(HOME_URL);
  const iframeRefs = useRef<{ [key: number]: HTMLIFrameElement | null }>({});
  const nextTabId = useRef(2);

  const getTab = (id: number) => tabs.find(t => t.id === id)!;
  const updateTab = (id: number, patch: Partial<Tab>) => setTabs(tabs => tabs.map(t => t.id === id ? { ...t, ...patch } : t));

  const goToUrl = (id: number, url: string, pushHistory = true) => {
    let normUrl = normalizeUrl(url);
    if (!isValidUrl(normUrl)) {
      updateTab(id, { error: 'Invalid URL', loading: false });
      return;
    }
    updateTab(id, { url: normUrl, loading: true, error: null });
    setAddressInput(normUrl);
    setTimeout(() => {
      setTabs(tabs => tabs.map(tab => {
        if (tab.id !== id) return tab;
        let newHistory = tab.history;
        let newIndex = tab.historyIndex;
        if (pushHistory) {
          newHistory = tab.history.slice(0, tab.historyIndex + 1).concat([normUrl]);
          newIndex = newHistory.length - 1;
        }
        return { ...tab, url: normUrl, history: newHistory, historyIndex: newIndex, loading: false, error: null };
      }));
    }, 300); 
  };
  const goBack = (id: number) => {
    const tab = getTab(id);
    if (tab.historyIndex > 0) {
      updateTab(id, { historyIndex: tab.historyIndex - 1, url: tab.history[tab.historyIndex - 1], loading: true, error: null });
      setTimeout(() => updateTab(id, { loading: false }), 200);
      setAddressInput(tab.history[tab.historyIndex - 1]);
    }
  };
  const goForward = (id: number) => {
    const tab = getTab(id);
    if (tab.historyIndex < tab.history.length - 1) {
      updateTab(id, { historyIndex: tab.historyIndex + 1, url: tab.history[tab.historyIndex + 1], loading: true, error: null });
      setTimeout(() => updateTab(id, { loading: false }), 200);
      setAddressInput(tab.history[tab.historyIndex + 1]);
    }
  };
  const reload = (id: number) => {
    updateTab(id, { loading: true, error: null });
    setTimeout(() => updateTab(id, { loading: false }), 300);
  };
  const goHome = (id: number) => goToUrl(id, HOME_URL, true);

  const addTab = () => {
    const id = nextTabId.current++;
    setTabs([...tabs, {
      id,
      url: HOME_URL,
      title: 'Home',
      history: [HOME_URL],
      historyIndex: 0,
      loading: false,
      error: null
    }]);
    setActiveTab(id);
    setAddressInput(HOME_URL);
  };
  const closeTab = (id: number) => {
    let idx = tabs.findIndex(t => t.id === id);
    let newTabs = tabs.filter(t => t.id !== id);
    if (newTabs.length === 0) {
      addTab();
    } else {
      setTabs(newTabs);
      if (activeTab === id) {
        setActiveTab(newTabs[Math.max(0, idx - 1)].id);
        setAddressInput(getTab(newTabs[Math.max(0, idx - 1)].id).url);
      }
    }
  };

  const handleIframeLoad = (id: number) => {
    const iframe = iframeRefs.current[id];
    if (!iframe) return;
    let title = 'New Tab';
    try {
      if (getTab(id).url === HOME_URL) title = 'Home';
      else if (iframe.contentDocument?.title) title = iframe.contentDocument.title;
    } catch {}
    updateTab(id, { loading: false, title });
  };
  const handleIframeError = (id: number) => {
    updateTab(id, { loading: false, error: 'Could not load page.' });
  };

  const tab = getTab(activeTab);
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 border border-blue-300 rounded-xl shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-2 pt-2 pb-1 bg-gradient-to-r from-blue-200/80 via-white/70 to-blue-100/80 rounded-t-xl">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`px-3 py-1 rounded-t-lg border-b-2 text-xs font-semibold transition-colors duration-100 shadow-sm mr-1 ${t.id === activeTab ? 'bg-white border-blue-500 text-blue-900' : 'bg-blue-100/70 border-transparent text-blue-700 hover:bg-blue-200/80'}`}
            onClick={() => { setActiveTab(t.id); setAddressInput(t.url); }}
          >
            {t.title.length > 18 ? t.title.slice(0, 16) + '…' : t.title}
            <span className="ml-2 text-blue-400 hover:text-red-500 text-lg font-bold align-middle" onClick={e => { e.stopPropagation(); closeTab(t.id); }} title="Close tab">×</span>
          </button>
        ))}
        <button className="ml-2 px-2 py-1 rounded bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold text-lg transition-colors duration-100" onClick={addTab} title="New Tab">+</button>
      </div>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-blue-100/60 border-b border-blue-200 shadow-sm">
        <button className="px-2 py-1 rounded bg-blue-200 hover:bg-blue-300 text-blue-800 transition-colors duration-100" onClick={() => goBack(tab.id)} disabled={tab.historyIndex === 0} title="Back">←</button>
        <button className="px-2 py-1 rounded bg-blue-200 hover:bg-blue-300 text-blue-800 transition-colors duration-100" onClick={() => goForward(tab.id)} disabled={tab.historyIndex === tab.history.length - 1} title="Forward">→</button>
        <button className="px-2 py-1 rounded bg-blue-200 hover:bg-blue-300 text-blue-800 transition-colors duration-100" onClick={() => reload(tab.id)} title="Reload">⟳</button>
        <button className="px-2 py-1 rounded bg-blue-200 hover:bg-blue-300 text-blue-800 transition-colors duration-100" onClick={() => goHome(tab.id)} title="Home">🏠</button>
        <form onSubmit={e => { e.preventDefault(); goToUrl(tab.id, addressInput, true); }} className="flex-1 flex mx-2">
          <input
            className="flex-1 rounded-l px-3 py-1 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 shadow-inner text-sm"
            value={addressInput}
            onChange={e => setAddressInput(e.target.value)}
            spellCheck={false}
            autoFocus
            placeholder="Enter URL or search..."
          />
          <button className="px-3 py-1 rounded-r bg-blue-400 hover:bg-blue-500 text-white font-bold transition-colors duration-100 border border-blue-200 border-l-0" type="submit">Go</button>
        </form>
        {tab.loading && <span className="ml-2 animate-spin text-blue-500">⏳</span>}
      </div>
      {/* Main display */}
      <div className="flex-1 bg-white/80 relative">
        {tab.error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-600 font-semibold">
            <span>⚠️ {tab.error}</span>
            <button className="mt-4 px-4 py-2 rounded bg-blue-200 hover:bg-blue-300 text-blue-900" onClick={() => reload(tab.id)}>Reload</button>
          </div>
        ) : tab.url === HOME_URL ? (
          <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: HOME_PAGE }} />
        ) : (
          <>
            {tab.loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <span className="animate-spin text-blue-400 text-3xl">⏳</span>
              </div>
            )}
            <iframe
              ref={el => { iframeRefs.current[tab.id] = el; }}
              key={tab.url + tab.id + tab.historyIndex}
              src={tab.url}
              className={`w-full h-full min-h-[320px] rounded-b-xl border-none bg-white ${tab.loading ? 'opacity-50' : ''}`}
              title={tab.title}
              onLoad={() => handleIframeLoad(tab.id)}
              onError={() => handleIframeError(tab.id)}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default BrowserApp;
