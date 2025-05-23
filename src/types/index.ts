import { ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export interface TerminalProps {
  onExit: () => void;
}

export interface TerminalCommand {
  name: string;
  description: string;
  execute: (args?: string[]) => void;
}

export interface Log {
  id: string;
  message: string;
  timestamp: string;
}

export interface UseTypingSoundReturn {
  playTypingSound: () => void;
  stopTypingSound: () => void;
} 