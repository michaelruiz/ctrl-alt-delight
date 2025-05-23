"use client";

import './globals.css';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import Terminal from '@/components/ui/Terminal';
import { INITIAL_LOGS } from '@/constants/logs';
import { useTypingSound } from '@/lib/hooks/useTypingSound';
import { Log } from '@/types';

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

      // Add a delay between logs
      const timeoutId = setTimeout(addNextLog, 800);
      timeoutsRef.current.push(timeoutId);
    };

    // Add initial delay before starting
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

  // Scroll after each log is added
  useEffect(() => {
    if (logs.length > 0) {
      scrollToBottom();
    }
  }, [logs, scrollToBottom]);

  const handleEnterClick = () => {
    setShowTerminal(true);
  };

  const handleReload = () => {
    // Clear all timeouts
    timeoutsRef.current.forEach(id => clearTimeout(id));
    timeoutsRef.current = [];
    stopTypingSound();

    // Reset states
    setLogs([]);
    setIsLoading(true);

    // Start the sequence again
    const cleanup = startLogSequence();
    return cleanup;
  };

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-red-400 font-mono p-6 flex flex-col items-center">
        <h1 className="text-4xl mb-8">Error</h1>
        <p className="mb-4">{error}</p>
        <Button onClick={handleReload} className="bg-red-500 text-white">
          Try Again
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl text-hot-magnetic mb-8 animate-pulse text-center">CTRL + ALT + DELIGHT</h1>
        <div className="max-w-4xl mx-auto">
          <div 
            ref={logContainerRef}
            className="bg-gray-900 rounded-lg p-6 h-[60vh] overflow-y-auto font-mono text-sm"
          >
            {isLoading && logs.length === 0 ? (
              <div className="text-green-400 animate-pulse">Initializing...</div>
            ) : (
              renderedLogs
            )}
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={handleEnterClick}
              className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded transition-colors"
            >
              Enter the Terminal
            </button>
            <Button
              onClick={handleReload}
              className="bg-hot-magnetic hover:bg-hot-magnetic/90 text-black font-bold py-2 px-4 rounded transition-colors"
            >
              Replay
            </Button>
          </div>
        </div>
      </div>

      {showTerminal && (
        <Terminal onExit={() => setShowTerminal(false)} />
      )}
    </main>
  );
} 