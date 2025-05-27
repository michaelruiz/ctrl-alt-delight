import { Log } from '@/types';

export const INITIAL_LOGS: Omit<Log, 'timestamp'>[] = [
  {
    id: 'init',
    message: 'System initializing...'
  },
  {
    id: 'boot',
    message: 'Loading michaelruiz.exe...'
  },
  {
    id: 'connect',
    message: 'Establishing secure connection to server...'
  },
  {
    id: 'welcome',
    message: 'Welcome to CTRL + ALT + DELIGHT'
  },
  {
    id: 'ready',
    message: 'Terminal is ready'
  }
]; 