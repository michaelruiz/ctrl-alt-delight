import { useSound } from 'use-sound';

export const useTypingSound = () => {
  const [playTypingSound, { stop: stopTypingSound }] = useSound('/sounds/typing.mp3', {
    volume: 1.0,
    interrupt: true,
  });

  return {
    playTypingSound,
    stopTypingSound,
  };
}; 