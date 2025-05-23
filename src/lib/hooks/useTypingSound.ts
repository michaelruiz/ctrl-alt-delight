import { useSound } from 'use-sound';
import { UseTypingSoundReturn } from '@/types';

export const useTypingSound = (): UseTypingSoundReturn => {
  const [playTypingSound, { stop: stopTypingSound }] = useSound('/sounds/typing.mp3', {
    volume: 1.0,
    interrupt: true,
  });

  return {
    playTypingSound,
    stopTypingSound,
  };
}; 