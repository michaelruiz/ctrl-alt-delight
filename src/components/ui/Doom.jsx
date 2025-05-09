import { useEffect, useRef } from 'react';
import { V86Starter } from 'v86';

export default function Doom({ onExit }) {
  const emulatorRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      console.warn('v86 can only be initialized in the browser environment.');
      return;
    }

    const emulator = new V86Starter({
      wasm_path: '/node_modules/v86/build/v86.wasm',
      memory_size: 32 * 1024 * 1024, // 32 MB
      vga_memory_size: 2 * 1024 * 1024, // 2 MB
      screen_container: emulatorRef.current,
      bios: { url: '/node_modules/v86/bios/seabios.bin' },
      vga_bios: { url: '/node_modules/v86/bios/vgabios.bin' },
      fda: { url: '/doom/DOOM.WAD' },
      autostart: true,
    });

    return () => {
      emulator.stop();
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div ref={emulatorRef} style={{ width: '100%', height: '100%' }}></div>
      <button
        onClick={onExit}
        style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}
      >
        Exit
      </button>
    </div>
  );
}