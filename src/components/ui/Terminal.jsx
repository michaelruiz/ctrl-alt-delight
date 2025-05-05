"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import Doom from './Doom';

export default function Terminal({ onExit }) {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [isDoomActive, setIsDoomActive] = useState(false); // Track if DOOM is active
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isDoomActive) {
      inputRef.current?.focus();
      setLines([]); // Clear lines to ensure no duplicates

      // Use a timeout to ensure the state is cleared before starting the scroll
      const timeout = setTimeout(() => {
        scrollAsciiArt(); // Trigger the scrolling ASCII art on terminal load
      }, 0);

      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [isDoomActive]);

  const commands = {
    help: [
      'Available commands:',
      ' • help        – show this help message',
      ' • resume      – display my résumé',
      ' • clear       – clear the screen',
      ' • about       – show information about Michael',
      ' • exit        – exit the terminal',
    ],
    resume: [
      'Michael Ruiz',
      'Software Engineer',
      '',
      'Experience:',
      ' • 2023–Present  Crypto Café Dev  – Opened a coffee shop in the metaverse',
      ' • 2015–2025  QA Automation Engineer  – Designed Playwright automation frameworks',
      '',
      'Skills: JavaScript, Java, SQL, AWS, ETL, React, Playwright, Tailwind, Node.js',
      'Education: Computer Science, McLennan College',
    ],
    about: [
      'Ctrl + Alt + Delight v1.0',
      'A retro-futuristic terminal experience by Michael Ruiz.',
      'Visit my site at: https://michaelruiz.dev',
    ],
    doom: [
      'Launching DOOM...'
    ],
  };

  const scrollAsciiArt = () => {
    const asciiArt = [
      '',
      '██╗  ██╗███████╗██╗     ██╗      ██████╗ ',
      '██║  ██║██╔════╝██║     ██║     ██╔═══██╗',
      '███████║█████╗  ██║     ██║     ██║   ██║',
      '██╔══██║██╔══╝  ██║     ██║     ██║   ██║',
      '██║  ██║███████╗███████╗███████╗╚██████╔╝',
      '╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝ ',
      '',
      'Welcome to MichaelRuiz.dev!',
      '',
    ];

    let index = 0; // Start from the first line
    const interval = setInterval(() => {
      if (index < asciiArt.length) {
        setLines((prev) => {
          const newLines = [...prev, asciiArt[index]];
          // Verify the last line added matches the expected line
          if (newLines[newLines.length - 1] !== asciiArt[index]) {
            console.error(`Line mismatch: Expected "${asciiArt[index]}", but got "${newLines[newLines.length - 1]}"`);
          }
          return newLines;
        });
        index++;
      } else {
        clearInterval(interval);
        // Display help commands after the ASCII art finishes scrolling
        setLines((prev) => [...prev, ...commands.help]);
      }
    }, 300); // Adjust the speed of scrolling here
  };

  useEffect(() => {
    if (!isDoomActive) {
      const timeout = setTimeout(() => {
        const terminalInput = document.querySelector('input');
        if (terminalInput) {
          terminalInput.classList.add('cyberpunk-effect');
        }
      }, 3000); // Trigger effect after help commands print

      return () => clearTimeout(timeout);
    }
  }, [lines, isDoomActive]);

  const handleInputChange = (e) => setInput(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    const cmd = input.trim().toLowerCase();
    setLines((prev) => [...prev, `> ${cmd}`]);
    setInput('');

    if (cmd === 'exit') {
      onExit();
      return;
    }
    if (cmd === 'clear') {
      setLines([]);
      return;
    }
    // if (cmd === 'doom') {
    //   setIsDoomActive(true); // Activate DOOM mode
    //   return;
    // }

    const output = commands[cmd] ? commands[cmd] : [`Unknown command: ${cmd}`, "Type 'help' for commands."];
    setLines((prev) => [...prev, ...output]);
  };

  if (isDoomActive) {
    return <Doom/>; // Render DOOM component directly
  }

  return (
    <>
      <div className="fixed inset-0 bg-black text-green-400 font-mono p-6 flex flex-col z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl">Terminal</h2>
          <Button type="button" onClick={onExit}>Exit</Button>
        </div>
        <div className="flex-1 overflow-y-auto mb-4">
          {lines.map((line, idx) => (
            <p key={idx} className="whitespace-pre">{line}</p>
          ))}
        </div>
        <div className="flex">
          <span>&gt; </span>
          <input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none flex-1"
          />
        </div>
      </div>
    </>
  );
}