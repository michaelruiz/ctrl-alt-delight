"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import SnakeGame from './SnakeGame';

export default function Terminal({ onExit }) {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [isDoomActive, setIsDoomActive] = useState(false); // Track if DOOM is active
  const [isSnakeActive, setIsSnakeActive] = useState(false); // Track if Snake game is active
  const inputRef = useRef(null);
  const [commandHistory, setCommandHistory] = useState([]); 
  const [historyIndex, setHistoryIndex] = useState(-1); 
  const [theme, setTheme] = useState('default'); 

  const themes = {
    default: 'bg-black text-green-400',
    light: 'bg-white text-black',
    retro: 'bg-gray-800 text-yellow-300',
  };

  const toggleTheme = () => {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  };

  useEffect(() => {
    if (!isDoomActive) {
      inputRef.current?.focus();
      setLines([]); 
      
      const timeout = setTimeout(() => {
        scrollAsciiArt(); 
      }, 0);

      return () => clearTimeout(timeout); 
    }
  }, [isDoomActive]);
  const maxWidth = 60; 
  const border = '═'.repeat(maxWidth); 
  
  const commands = {
    help: [
      `╔${border}╗`,
      `║${'Available commands'.padStart((maxWidth + 'Available commands'.length) / 2).padEnd(maxWidth)}║`,
      `╠${border}╣`,
      `║ • help            – show this help message       `.padEnd(maxWidth - 1) + '  ║',
      `║ • resume          – display my résumé            `.padEnd(maxWidth - 1) + '  ║',
      `║ • download resume – download my résumé           `.padEnd(maxWidth - 1) + '  ║',
      `║ • clear           – clear the screen             `.padEnd(maxWidth - 1) + '  ║',
      `║ • about           – show information             `.padEnd(maxWidth - 1) + '  ║',
      `║ • exit            – exit the terminal            `.padEnd(maxWidth - 1) + '  ║',
      `╚${border}╝`,
    ],
    resume: [
      `╔${border}╗`,
      `║${'Michael Ruiz'.padStart((maxWidth + 'Michael Ruiz'.length) / 2).padEnd(maxWidth)}║`,
      `║${'Software Engineer'.padStart((maxWidth + 'Software Engineer'.length) / 2).padEnd(maxWidth)}║`,
      `╠${border}╣`,
      `║ Experience:                                  `.padEnd(maxWidth - 1) + '  ║',
      `║ 2022–2025                                    `.padEnd(maxWidth - 1) + '  ║',
      `║ Northwestern Mutual                          `.padEnd(maxWidth - 1) + '  ║',
      `║ QA Automation Engineer                       `.padEnd(maxWidth - 1) + '  ║',
      `║ Designed Playwright automation frameworks    `.padEnd(maxWidth - 1) + '  ║',
      `║                                              `.padEnd(maxWidth - 1) + '  ║',
      `║ 2022–2022                                    `.padEnd(maxWidth - 1) + '  ║',
      `║ Trility                                      `.padEnd(maxWidth - 1) + '  ║',
      `║ Integration Engineer                         `.padEnd(maxWidth - 1) + '  ║',
      `║ Developed integration tests for ETL          `.padEnd(maxWidth - 1) + '  ║',
      `║ pipelines                                    `.padEnd(maxWidth - 1) + '  ║',
      `║                                              `.padEnd(maxWidth - 1) + '  ║',
      `║ 2017–2022                                    `.padEnd(maxWidth - 1) + '  ║',
      `║ Texas Farm Bureau                            `.padEnd(maxWidth - 1) + '  ║',
      `║ Software Engineer                            `.padEnd(maxWidth - 1) + '  ║',
      `║ Built custom regression test automation      `.padEnd(maxWidth - 1) + '  ║',
      `║ tools                                        `.padEnd(maxWidth - 1) + '  ║',
      `╠${border}╣`,
      `║ Skills: JavaScript, Java, AWS, ETL, React,   `.padEnd(maxWidth - 1) + '  ║',
      `║ Playwright, Tailwind, Node.js, SQL           `.padEnd(maxWidth - 1) + '  ║',
      `║ Education: Computer Science, McLennan College`.padEnd(maxWidth - 1) + '  ║',
      `║ Certifications:                              `.padEnd(maxWidth - 1) + '  ║',
      `║ • Certified Tester Foundation Level (CTFL)   `.padEnd(maxWidth - 1) + '  ║',
      `║ • Java Oracle Certified Associate (OCA)      `.padEnd(maxWidth - 1) + '  ║',
      `║ • Vaadin Certified Developer                 `.padEnd(maxWidth - 1) + '  ║',
      `╚${border}╝`,
    ],
    about: [
      `╔${border}╗`,
      `║${'Ctrl + Alt + Delight v1.0'.padStart((maxWidth + 'Ctrl + Alt + Delight v1.0'.length) / 2).padEnd(maxWidth)}║`,
      `║${'A retro-futuristic terminal experience by'.padStart((maxWidth + 'A retro-futuristic terminal experience by'.length) / 2).padEnd(maxWidth)}║`,
      `║${'Michael Ruiz.'.padStart((maxWidth + 'Michael Ruiz.'.length) / 2).padEnd(maxWidth)}║`,
      `╠${border}╣`,
      `║ Thanks for visiting my site at: https://michaelruiz.dev    `.padEnd(maxWidth - 1) + '  ║',
      `╚${border}╝`,
    ],
    doom: [
      `╔${border}╗`,
      `║${'Launching DOOM...'.padStart((maxWidth + 'Doom app in progress :)'.length) / 2).padEnd(maxWidth)}║`,
      `╚${border}╝`,
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

    let index = 0; 
    const interval = setInterval(() => {
      if (index < asciiArt.length) {
        setLines((prev) => {
          const newLines = [...prev, asciiArt[index]];
          
          if (newLines[newLines.length - 1] !== asciiArt[index]) {
            console.error(`Line mismatch: Expected "${asciiArt[index]}", but got "${newLines[newLines.length - 1]}"`);
          }
          return newLines;
        });
        index++;
      } else {
        clearInterval(interval);
        
        setLines((prev) => [...prev, ...commands.help]);
      }
    }, 300); 
  };

  useEffect(() => {
    if (!isDoomActive) {
      const timeout = setTimeout(() => {
        const terminalInput = document.querySelector('input');
        if (terminalInput) {
          terminalInput.classList.add('cyberpunk-effect');
        }
      }, 3000); 

      return () => clearTimeout(timeout);
    }
  }, [lines, isDoomActive]);

  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus();
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleInputChange = (e) => setInput(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      
      if (commandHistory.length > 0 && historyIndex > 0) {
        setHistoryIndex((prevIndex) => prevIndex - 1);
        setInput(commandHistory[historyIndex - 1]);
      } else if (historyIndex === -1 && commandHistory.length > 0) {
        setHistoryIndex(commandHistory.length - 1);
        setInput(commandHistory[commandHistory.length - 1]);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      
      if (historyIndex < commandHistory.length - 1 && historyIndex !== -1) {
        setHistoryIndex((prevIndex) => prevIndex + 1);
        setInput(commandHistory[historyIndex + 1]);
      } else if (historyIndex === commandHistory.length - 1) {
        setHistoryIndex(-1);
        setInput('');
      }
      return;
    }

    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      setLines((prev) => [...prev, `> ${cmd}`]);
      setCommandHistory((prev) => [...prev, cmd]); 
      setHistoryIndex(-1); 
      setInput('');

      if (cmd === 'exit') {
        onExit();
        return;
      }
      if (cmd === 'clear') {
        setLines([]);
        return;
      }
      if (cmd === 'tacos') {
        setLines((prev) => [...prev, '🌮🌮🌮 Mmm tacos! 🌮🌮🌮']);
        return;
      } 
      if (cmd === 'download resume') {
        setLines((prev) => [...prev, 'Downloading résumé...']);
        const link = document.createElement('a');
        link.href = '/resume.pdf'; 
        link.download = 'Michael_Ruiz_Resume.pdf'; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      if (cmd === 'nibbles.bat') {
        console.log('Activating Snake game...');
        setIsSnakeActive(true);
        return;
      }


      const output = commands[cmd] ? commands[cmd] : [`Unknown command: ${cmd}`, "Type 'help' for commands."];
      setLines((prev) => {
        const updatedLines = [...prev, ...output];
        setTimeout(() => {
          const terminalDiv = document.querySelector('.flex-1.overflow-y-auto');
          if (terminalDiv) {
            terminalDiv.scrollTop = terminalDiv.scrollHeight;
          }
        }, 0);
        return updatedLines;
      });
    }
  };



  if (isSnakeActive) {
    return (
      <div className="fixed inset-0 bg-black text-green-400 font-mono p-6 flex flex-col z-50">
        <SnakeGame onExit={() => setIsSnakeActive(false)} />
      </div>
    );
  }

  return (
    <>
      <div className={`fixed inset-0 ${themes[theme]} font-mono p-6 flex flex-col z-50`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl">Terminal</h2>
          <div>
            <Button type="button" onClick={toggleTheme}>Toggle Theme</Button>
            <Button type="button" onClick={onExit}>Exit</Button>
          </div>
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