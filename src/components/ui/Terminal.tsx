import { useState, useEffect, useRef, useCallback } from 'react';
import { useTypingSound } from '@/lib/hooks/useTypingSound';
import { TerminalProps, TerminalCommand } from '@/types';

interface TerminalPropsWithVirtualOS extends TerminalProps {
  onShowVirtualOS?: () => void;
}
import { Button } from './Button';
import SnakeGame from './SnakeGame';
import VirtualOS from './VirtualOS';

const STORAGE_KEY = 'terminal_history';
const MAX_HISTORY_LENGTH = 1000; // Maximum number of lines to store

const Terminal: React.FC<TerminalPropsWithVirtualOS> = ({ onExit, theme = 'dark', onShowVirtualOS }) => {
  const [showVirtualOS, setShowVirtualOS] = useState(false);
  const { playTypingSound, stopTypingSound } = useTypingSound();
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
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
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

  useEffect(() => {
    inputRef.current?.focus();
  }, [history]);

  const handleTerminalClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isTyping && currentLineIndex < welcomeMessage.length) {
      const timer = setTimeout(() => {
        setHistory(prev => [...prev, welcomeMessage[currentLineIndex]]);
        setCurrentLineIndex(prev => prev + 1);
        scrollToBottom();
      }, 200);

      return () => {
        clearTimeout(timer);
        stopTypingSound();
      };
    } else if (currentLineIndex >= welcomeMessage.length) {
      setIsTyping(false);
      if (!hasPlayedSound) {
        playTypingSound();
        setHasPlayedSound(true);
      }
    }
  }, [isTyping, currentLineIndex, scrollToBottom, playTypingSound, stopTypingSound, hasPlayedSound]);

  useEffect(() => {
    return () => {
      stopTypingSound();
    };
  }, [stopTypingSound]);

  useEffect(() => {
    if (history.length > 0) {
      scrollToBottom();
    }
  }, [history, scrollToBottom]);

  useEffect(() => {
    if (typeof window !== 'undefined' && history.length > 0) {
      const historyToStore = history.slice(-MAX_HISTORY_LENGTH);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(historyToStore));
    }
  }, [history]);

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
          '',
          'Starting Snake Game...'
        ];

        let currentIndex = 0;
        const typeNextLine = () => {
          if (currentIndex < loadingMessages.length) {
            setHistory(prev => [...prev, loadingMessages[currentIndex]]);
            currentIndex++;
            setTimeout(typeNextLine, 150);
          } else {
            setTimeout(() => {
              setShowSnakeGame(true);
            }, 500);
          }
        };
        typeNextLine();
      }
    },
    win: {
      name: 'win',
      description: 'Load Windows-like OS',
      execute: () => {
        if (onShowVirtualOS) {
          onShowVirtualOS();
        } else {
          setShowVirtualOS(true);
        }
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

  if (showVirtualOS) {
    return <VirtualOS onExit={() => setShowVirtualOS(false)} />;
  }
  if (showSnakeGame) {
    return <SnakeGame onExit={() => setShowSnakeGame(false)} />;
  }

  return (
    <div 
      className={`fixed inset-0 ${theme === 'dark' ? 'bg-black bg-opacity-90' : 'bg-gray-100 bg-opacity-95'} flex items-center justify-center p-4 z-50 transition-colors duration-300`}
      onClick={handleTerminalClick}
    >
      <div className={`w-full max-w-4xl h-[80vh] ${theme === 'dark' ? 'bg-gray-900 border border-green-500' : 'bg-white border border-blue-400'} rounded-lg overflow-hidden shadow-2xl flex flex-col transition-colors duration-300`}>
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-green-500' : 'bg-blue-600 border-blue-400'} p-2 border-b flex justify-between items-center transition-colors duration-300`}>
          <div className={`${theme === 'dark' ? 'text-green-400' : 'text-white'} font-bold transition-colors duration-300`}>Terminal v1.0</div>
          <Button onClick={handleExit} className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 transition-transform hover:scale-105 active:scale-95">
            ×
          </Button>
        </div>
        <div className={`flex-1 p-4 overflow-y-auto ${theme === 'dark' ? 'bg-black text-green-400' : 'bg-white text-gray-800'} font-mono transition-colors duration-300`}>
          {history.map((line, i) => (
            <p key={i} className="whitespace-pre-wrap mb-1">{line}</p>
          ))}
          <div ref={historyEndRef} />
        </div>
        <form onSubmit={handleSubmit} className={`p-2 border-t ${theme === 'dark' ? 'border-green-500 bg-gray-900' : 'border-blue-400 bg-gray-100'} flex transition-colors duration-300`}>
          <div className="flex items-center w-full">
            <span className={`${theme === 'dark' ? 'text-green-400' : 'text-blue-600'} mr-2 transition-colors duration-300`}>$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-1 bg-transparent ${theme === 'dark' ? 'text-green-400' : 'text-gray-800'} outline-none font-mono transition-colors duration-300`}
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