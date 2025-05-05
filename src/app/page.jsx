"use client";

import './globals.css';
import { useEffect, useState, useRef } from 'react';
import { Button } from '../components/ui/Button';
import Terminal from '../components/ui/Terminal';
import { useSound } from 'use-sound'; // Add sound effect library

export default function Home() {
  const [logs, setLogs] = useState([]);
  const endRef = useRef(null);
  const timeoutsRef = useRef([]);
  const [terminalActive, setTerminalActive] = useState(false);
  const [logsComplete, setLogsComplete] = useState(false); // New state to track log completion
  const [playTypingSound] = useSound('/sounds/typing.mp3', { volume: 1.0 }); // Increased volume to maximum

  useEffect(() => {
    const newLogs = [
      '> Initializing Michael.ini ...',
      '> Michael.exe booted',
      '> CoffeeAddict_Protocol engaged',
      '> Deploying: Michael_Ruiz_Resume_2025.pdf'
    ];

    // Schedule each log with a timeout
    newLogs.forEach((log, index) => {
      const id = setTimeout(() => {
        setLogs((prev) => {
          if (!prev.includes(log)) { // Ensure the log is not already added
            return [...prev, log];
          }
          return prev;
        });
        console.log('Playing sound for log:', log); // Debug log to confirm sound trigger
        playTypingSound(); // Play typing sound for each log
        if (index === newLogs.length - 1) {
          setLogsComplete(true); // Mark logs as complete after the last log
        }
      }, index * 1000);
      timeoutsRef.current.push(id);
    });

    return () => {
      // Clear timeouts on unmount or StrictMode remount
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, [playTypingSound]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleEnterClick = () => {
    if (logsComplete) {
      setTerminalActive(true);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-green-400 font-mono p-6 flex flex-col items-center">
        <h1 className="text-4xl text-hot-magnetic mb-8 animate-pulse">CTRL + ALT + DELIGHT</h1>
        <div className="bg-gray-900 p-4 rounded-lg w-full max-w-2xl shadow-lg h-64 overflow-y-auto mb-6">
          {logs.map((log, idx) => (
            <p key={idx} className="whitespace-pre animate-fade-in">{log}</p>
          ))}
          <div ref={endRef} />
        </div>
        <div className="flex space-x-4"> {/* Group buttons together */}
          <Button
            type="button"
            onClick={handleEnterClick}
            className={`hover:glitch ${logsComplete ? '' : 'opacity-50 cursor-not-allowed animate-pulse'}`}
            disabled={!logsComplete} // Disable button until logs are complete
            aria-disabled={!logsComplete} // Accessibility improvement
            title={!logsComplete ? 'Please wait for logs to finish loading' : ''} // Tooltip for disabled button
          >
            Enter The Terminal
          </Button>
          <Button
            type="button"
            onClick={() => window.location.reload()} // Reload the page
            className="hover:glitch bg-hot-magnetic text-black px-4 py-2 rounded-md shadow-md"
          >
            Reload
          </Button>
        </div>
      </div>
      {terminalActive && <Terminal onExit={() => setTerminalActive(false)} />}
    </>
  );
}