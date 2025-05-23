import { useState, useEffect, useRef, useCallback } from 'react';
import { TerminalProps, TerminalCommand } from '@/types';
import { Button } from './Button';
import SnakeGame from './SnakeGame';

const STORAGE_KEY = 'terminal_history';
const MAX_HISTORY_LENGTH = 1000; // Maximum number of lines to store

const Terminal: React.FC<TerminalProps> = ({ onExit }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(() => {
    // Initialize history from localStorage if available
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      return savedHistory ? JSON.parse(savedHistory) : [];
    }
    return [];
  });
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(true);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showSnakeGame, setShowSnakeGame] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  const maxWidth = 60;
  const border = '═'.repeat(maxWidth);

  const welcomeMessage = [
    '',
    '██╗  ██╗███████╗██╗     ██╗      ██████╗ ',
    '██║  ██║██╔════╝██║     ██║     ██╔═══██╗',
    '███████║█████╗  ██║     ██║     ██║   ██║',
    '██╔══██║██╔══╝  ██║     ██║     ██║   ██║',
    '██║  ██║███████╗███████╗███████╗╚██████╔╝',
    '╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝ ',
    '',
    'Welcome to MichaelRuiz.dev!',
    'Type "help" to see available commands.',
  ];

  const scrollToBottom = useCallback(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Focus input on mount and after each command
  useEffect(() => {
    inputRef.current?.focus();
  }, [history]); // Refocus after each command is executed

  // Handle click anywhere in terminal to focus input
  const handleTerminalClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Handle welcome message typing effect
  useEffect(() => {
    if (isTyping && currentLineIndex < welcomeMessage.length) {
      const timer = setTimeout(() => {
        setHistory(prev => [...prev, welcomeMessage[currentLineIndex]]);
        setCurrentLineIndex(prev => prev + 1);
        scrollToBottom();
      }, 200);

      return () => clearTimeout(timer);
    } else if (currentLineIndex >= welcomeMessage.length) {
      setIsTyping(false);
    }
  }, [isTyping, currentLineIndex, scrollToBottom]);

  // Scroll after each line is added
  useEffect(() => {
    if (history.length > 0) {
      scrollToBottom();
    }
  }, [history, scrollToBottom]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && history.length > 0) {
      // Only store the last MAX_HISTORY_LENGTH lines
      const historyToStore = history.slice(-MAX_HISTORY_LENGTH);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(historyToStore));
    }
  }, [history]);

  // Clear history from localStorage when terminal is closed
  const handleExit = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    onExit();
  }, [onExit]);

  const commands: Record<string, TerminalCommand> = {
    help: {
      name: 'help',
      description: 'Show this help message',
      execute: () => {
        const helpText = [
          '',
          `╔${border}╗`,
          `║${'Available commands'.padStart((maxWidth + 'Available commands'.length) / 2).padEnd(maxWidth)}║`,
          `╠${border}╣`,
          `║ • help            – show this help message       `.padEnd(maxWidth) +  ' ║',
          `║ • resume          – display my résumé            `.padEnd(maxWidth) +  ' ║',
          `║ • download resume – download my résumé           `.padEnd(maxWidth) +  ' ║',
          `║ • clear           – clear the screen             `.padEnd(maxWidth) +  ' ║',
          `║ • about           – show information             `.padEnd(maxWidth) +  ' ║',
          `║ • skills          – show technical skills        `.padEnd(maxWidth) +  ' ║',
          `║ • projects        – show featured projects       `.padEnd(maxWidth) +  ' ║',
          `║ • snake           – play the snake game          `.padEnd(maxWidth) +  ' ║',
          `║ • exit            – exit the terminal            `.padEnd(maxWidth) +  ' ║',
          `╚${border}╝`,
        ];
        typeLines(helpText);
      }
    },
    clear: {
      name: 'clear',
      description: 'Clear the terminal',
      execute: () => {
        setHistory([]);
        localStorage.removeItem(STORAGE_KEY);
      }
    },
    exit: {
      name: 'exit',
      description: 'Exit the terminal',
      execute: () => handleExit()
    },
    about: {
      name: 'about',
      description: 'Show information about me',
      execute: () => {
        const aboutText = [
          '',
          `╔${border}╗`,
          `║${'Ctrl + Alt + Delight v1.0'.padStart((maxWidth + 'Ctrl + Alt + Delight v1.0'.length) / 2).padEnd(maxWidth)}║`,
          `║${'A retro-futuristic terminal experience by'.padStart((maxWidth + 'A retro-futuristic terminal experience by'.length) / 2).padEnd(maxWidth)}║`,
          `║${'Michael Ruiz.'.padStart((maxWidth + 'Michael Ruiz.'.length) / 2).padEnd(maxWidth)}║`,
          `╠${border}╣`,
          `║ Thanks for visiting my site at: https://michaelruiz.dev    `.padEnd(maxWidth - 1) + '║',
          `╚${border}╝`,
        ];
        typeLines(aboutText);
      }
    },
    resume: {
      name: 'resume',
      description: 'View or download my resume',
      execute: (args?: string[]) => {
        if (args?.includes('--download')) {
          typeLines([
            'Downloading resume...',
            'Resume is now being downloaded. Thanks for viewing. :)'
          ]);
          try {
            const link = document.createElement('a');
            link.href = '/resume.pdf';
            link.download = 'Michael_Ruiz_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (error) {
            typeLines(['Error downloading resume. Please try again.']);
            console.error('Download error:', error);
          }
        } else {
          const resumeText = [
            '',     
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
            '',
            'To download the resume, use: resume --download'
          ];
          typeLines(resumeText);
        }
      }
    },
    'download resume': {
      name: 'download resume',
      description: 'Download my resume',
      execute: () => {
        typeLines([
          'Downloading resume...',
          'Resume is now being downloaded. Thanks for viewing. :)'
        ]);
        try {
          const link = document.createElement('a');
          link.href = '/resume.pdf';
          link.download = 'Michael_Ruiz_Resume.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          typeLines(['Error downloading resume. Please try again.']);
          console.error('Download error:', error);
        }
      }
    },
    skills: {
      name: 'skills',
      description: 'Show my technical skills',
      execute: () => {
        const skills = [
          '',
          `╔${border}╗`,
          `║${'Technical Skills'.padStart((maxWidth + 'Technical Skills'.length) / 2).padEnd(maxWidth)}║`,
          `╠${border}╣`,
          `║ Languages:                                    `.padEnd(maxWidth - 1) + '  ║',
          `║ • JavaScript/TypeScript                       `.padEnd(maxWidth - 1) + '  ║',
          `║ • Python                                      `.padEnd(maxWidth - 1) + '  ║',
          `║ • Java                                        `.padEnd(maxWidth - 1) + '  ║',
          `║ • SQL                                         `.padEnd(maxWidth - 1) + '  ║',
          `║                                              `.padEnd(maxWidth - 1) + '  ║',
          `║ Frontend:                                     `.padEnd(maxWidth - 1) + '  ║',
          `║ • React                                       `.padEnd(maxWidth - 1) + '  ║',
          `║ • Next.js                                     `.padEnd(maxWidth - 1) + '  ║',
          `║ • Tailwind CSS                                `.padEnd(maxWidth - 1) + '  ║',
          `║ • Redux                                       `.padEnd(maxWidth - 1) + '  ║',
          `║                                              `.padEnd(maxWidth - 1) + '  ║',
          `║ Backend:                                      `.padEnd(maxWidth - 1) + '  ║',
          `║ • Node.js                                     `.padEnd(maxWidth - 1) + '  ║',
          `║ • Express                                     `.padEnd(maxWidth - 1) + '  ║',
          `║ • Django                                      `.padEnd(maxWidth - 1) + '  ║',
          `║ • FastAPI                                     `.padEnd(maxWidth - 1) + '  ║',
          `║                                              `.padEnd(maxWidth - 1) + '  ║',
          `║ Database:                                     `.padEnd(maxWidth - 1) + '  ║',
          `║ • PostgreSQL                                  `.padEnd(maxWidth - 1) + '  ║',
          `║ • MongoDB                                     `.padEnd(maxWidth - 1) + '  ║',
          `║ • Redis                                       `.padEnd(maxWidth - 1) + '  ║',
          `║                                              `.padEnd(maxWidth - 1) + '  ║',
          `║ DevOps:                                       `.padEnd(maxWidth - 1) + '  ║',
          `║ • Docker                                      `.padEnd(maxWidth - 1) + '  ║',
          `║ • AWS                                         `.padEnd(maxWidth - 1) + '  ║',
          `║ • CI/CD                                       `.padEnd(maxWidth - 1) + '  ║',
          `║ • Git                                         `.padEnd(maxWidth - 1) + '  ║',
          `╚${border}╝`,
        ];
        typeLines(skills);
      }
    },
    projects: {
      name: 'projects',
      description: 'Show my projects',
      execute: () => {
        const projects = [
          '',
          `╔${border}╗`,
          `║${'Featured Projects'.padStart((maxWidth + 'Featured Projects'.length) / 2).padEnd(maxWidth)}║`,
          `╠${border}╣`,
          `║ 1. E-commerce Platform                        `.padEnd(maxWidth - 1) + '  ║',
          `║    • Full-stack application with React        `.padEnd(maxWidth - 1) + '  ║',
          `║    • Features: Real-time inventory,           `.padEnd(maxWidth - 1) + '  ║',
          `║      payment processing                       `.padEnd(maxWidth - 1) + '  ║',
          `║                                              `.padEnd(maxWidth - 1) + '  ║',
          `║ 2. Task Management System                     `.padEnd(maxWidth - 1) + '  ║',
          `║    • Built with Next.js and TypeScript        `.padEnd(maxWidth - 1) + '  ║',
          `║    • Features: Real-time updates,             `.padEnd(maxWidth - 1) + '  ║',
          `║      team collaboration                       `.padEnd(maxWidth - 1) + '  ║',
          `║                                              `.padEnd(maxWidth - 1) + '  ║',
          `║ 3. AI-Powered Chat Application                `.padEnd(maxWidth - 1) + '  ║',
          `║    • Python backend with React frontend       `.padEnd(maxWidth - 1) + '  ║',
          `║    • Features: Natural language processing,   `.padEnd(maxWidth - 1) + '  ║',
          `║      sentiment analysis                       `.padEnd(maxWidth - 1) + '  ║',
          `║                                              `.padEnd(maxWidth - 1) + '  ║',
          `║ View more projects on my GitHub:              `.padEnd(maxWidth - 1) + '  ║',
          `║ github.com/michaelruiz                        `.padEnd(maxWidth - 1) + '  ║',
          `╚${border}╝`,
        ];
        typeLines(projects);
      }
    },
    snake: {
      name: 'snake',
      description: 'Play the snake game',
      execute: () => {
        const loadingMessages = [
          'Starting Snake Game...',
          'Loading game assets...',
          'Initializing game engine...',
          'Setting up game environment...',
          'Loading game controls...',
          'Preparing game interface...',
          'Game ready!',
          'Use arrow keys to control the snake.',
          'Collect food to grow and earn points.',
          'Avoid walls and don\'t hit yourself!',
          'Good luck! ;)'
        ];

        let currentIndex = 0;
        const typeNextLine = () => {
          if (currentIndex < loadingMessages.length) {
            setHistory(prev => [...prev, loadingMessages[currentIndex]]);
            currentIndex++;
            setTimeout(typeNextLine, 150);
          } else {
            // Wait a bit after the last message before starting the game
            setTimeout(() => {
              setShowSnakeGame(true);
            }, 500);
          }
        };
        typeNextLine();
      }
    }
  };

  const typeLines = (lines: string[]) => {
    let currentIndex = 0;
    const typeNextLine = () => {
      if (currentIndex < lines.length) {
        setHistory(prev => [...prev, lines[currentIndex]]);
        currentIndex++;
        setTimeout(typeNextLine, 150);
      }
    };
    typeNextLine();
  };

  const handleCommand = (command: string) => {
    // First try to match the full command
    const fullCommand = command.toLowerCase();
    if (commands[fullCommand]) {
      setHistory(prev => [...prev, `> ${command}`]);
      if (command.trim()) {
        setCommandHistory(prev => [...prev, command]);
        setHistoryIndex(-1);
      }
      commands[fullCommand].execute([]);
      setInput('');
      return;
    }

    // If no full match, try splitting the command
    const [cmd, ...args] = command.toLowerCase().split(' ');
    setHistory(prev => [...prev, `> ${command}`]);
    
    if (command.trim()) {
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
    }

    const commandHandler = commands[cmd];
    if (commandHandler) {
      commandHandler.execute(args);
    } else {
      setHistory(prev => [...prev, `Command not found: ${cmd}`]);
    }
    
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input.trim());
    }
  };

  if (showSnakeGame) {
    return <SnakeGame onExit={() => setShowSnakeGame(false)} />;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4"
      onClick={handleTerminalClick}
    >
      <div className="bg-gray-900 w-full max-w-3xl h-[80vh] rounded-lg shadow-xl flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-green-400 font-mono">Terminal</h2>
          <Button onClick={handleExit} className="text-red-400 hover:text-red-300">
            ×
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 font-mono text-green-400">
          {history.map((line, i) => (
            <p key={i} className="whitespace-pre-wrap mb-1">{line}</p>
          ))}
          <div ref={historyEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <span className="text-green-400 mr-2">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-green-400 outline-none font-mono"
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Terminal; 