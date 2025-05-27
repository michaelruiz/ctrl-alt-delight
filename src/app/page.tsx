"use client";

import './globals.css';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import Terminal from '@/components/ui/Terminal';
import VirtualOS from '@/components/ui/VirtualOS';
import { INITIAL_LOGS } from '@/constants/logs';
import { useTypingSound } from '@/lib/hooks/useTypingSound';
import { Log } from '@/types';

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [showVirtualOS, setShowVirtualOS] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogsComplete, setIsLogsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const { playTypingSound, stopTypingSound } = useTypingSound();

  const scrollToBottom = useCallback(() => {
    if (logContainerRef.current) {
      const container = logContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  const renderedLogs = useMemo(() => {
    return logs.map((log) => (
      <div 
        key={log.id} 
        className="mb-4 animate-fade-in"
      >
        <span className="text-gray-400">{log.timestamp}</span>
        <span className="text-green-400 ml-2">{log.message}</span>
      </div>
    ));
  }, [logs]);

  const startLogSequence = useCallback(() => {
    let currentIndex = 0;
    let isMounted = true;

    const addNextLog = () => {
      if (!isMounted || currentIndex >= INITIAL_LOGS.length) {
        setIsLoading(false);
        setIsLogsComplete(true);
        stopTypingSound();
        return;
      }

      const log = {
        ...INITIAL_LOGS[currentIndex],
        timestamp: new Date().toISOString()
      };
      
      setLogs(prev => [...prev, log]);
      playTypingSound();
      currentIndex++;

      const timeoutId = setTimeout(addNextLog, 800);
      timeoutsRef.current.push(timeoutId);
    };

    const initialTimeoutId = setTimeout(addNextLog, 500);
    timeoutsRef.current.push(initialTimeoutId);

    return () => {
      isMounted = false;
      timeoutsRef.current.forEach(id => clearTimeout(id));
      timeoutsRef.current = [];
      stopTypingSound();
    };
  }, [playTypingSound, stopTypingSound]);

  useEffect(() => {
    const cleanup = startLogSequence();
    return cleanup;
  }, [startLogSequence]);

  useEffect(() => {
    if (logs.length > 0) {
      scrollToBottom();
    }
  }, [logs, scrollToBottom]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleEnterClick = () => {
    setShowLoadingIndicator(true);
    setTimeout(() => {
      setShowLoadingIndicator(false);
      setShowTerminal(true);
    }, 800);
  };

  const handleReload = () => {
    timeoutsRef.current.forEach(id => clearTimeout(id));
    timeoutsRef.current = [];
    stopTypingSound();

    setShowLoadingIndicator(true);
    setLogs([]);
    
    setTimeout(() => {
      setShowLoadingIndicator(false);
      setIsLoading(true);
      setIsLogsComplete(false);
      
      const cleanup = startLogSequence();
      return cleanup;
    }, 600);
  };

  if (error) {
    return (
      <main className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-gradient-to-b from-gray-100 to-white'} text-red-500 font-mono p-6 flex flex-col items-center transition-colors duration-300`}>
        <h1 className="text-4xl mb-8">Error</h1>
        <p className="mb-4">{error}</p>
        <Button onClick={handleReload} className="bg-red-500 text-white hover:bg-red-600">
          Try Again
        </Button>
      </main>
    );
  }

  return (
    <main className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-b from-black to-gray-900 text-white' : 'bg-gradient-to-b from-gray-100 to-white text-gray-800'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <Button 
            onClick={toggleTheme} 
            className={`${theme === 'dark' ? 'bg-gray-700 text-yellow-300' : 'bg-blue-500 text-white'} px-3 py-1 rounded-full`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>
        </div>
        
        <h1 className={`text-5xl ${theme === 'dark' ? 'text-hot-magnetic' : 'text-blue-600'} mb-8 animate-pulse text-center font-bold tracking-wider`}>
          CTRL + ALT + DELIGHT
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <div 
            ref={logContainerRef}
            className={`${theme === 'dark' ? 'bg-gray-900 text-green-400' : 'bg-white text-gray-800 border border-gray-300'} rounded-lg p-6 h-[60vh] overflow-y-auto font-mono text-sm shadow-lg transition-colors duration-300`}
          >
            {showLoadingIndicator ? (
              <div className="flex justify-center items-center h-full">
                <div className="loader"></div>
              </div>
            ) : isLoading && logs.length === 0 ? (
              <div className={`${theme === 'dark' ? 'text-green-400' : 'text-blue-500'} animate-pulse`}>Initializing...</div>
            ) : (
              renderedLogs
            )}
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Button
              onClick={handleEnterClick}
              className={`${isLogsComplete ? 
                (theme === 'dark' ? 'bg-green-500 hover:bg-green-600 text-black' : 'bg-blue-500 hover:bg-blue-600 text-white') : 
                'bg-gray-400 text-gray-700 cursor-not-allowed'} 
                font-bold py-2 px-6 rounded-md transition-colors shadow-md transform hover:scale-105 active:scale-95`}
              disabled={!isLogsComplete}
            >
              {isLogsComplete ? 'Enter the Terminal' : 'Loading...'}
            </Button>
            <Button
              onClick={handleReload}
              className={`${theme === 'dark' ? 'bg-hot-magnetic hover:bg-hot-magnetic/90 text-black' : 'bg-purple-500 hover:bg-purple-600 text-white'} 
                font-bold py-2 px-6 rounded-md transition-colors shadow-md transform hover:scale-105 active:scale-95`}
            >
              Replay
            </Button>
          </div>
        </div>
      </div>

      {showVirtualOS && (
        <VirtualOS onExit={() => setShowVirtualOS(false)} />
      )}
      {showTerminal && !showVirtualOS && (
        <Terminal 
          onExit={() => setShowTerminal(false)} 
          theme={theme}
          onShowVirtualOS={() => setShowVirtualOS(true)}
        />
      )}
    </main>
  );
} 