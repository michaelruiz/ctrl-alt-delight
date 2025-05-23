import { Log } from '@/types';

export const INITIAL_LOGS: Omit<Log, 'timestamp'>[] = [
  {
    id: 'init',
    message: 'System initializing...'
  },
  {
    id: 'boot',
    message: 'Loading core modules...'
  },
  {
    id: 'connect',
    message: 'Establishing secure connection...'
  },
  {
    id: 'welcome',
    message: 'Welcome to CTRL + ALT + DELIGHT'
  },
  {
    id: 'ready',
    message: 'Terminal ready for input'
  }
]; 