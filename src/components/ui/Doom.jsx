// import { useEffect, useRef } from 'react';
// import Dos from 'js-dos'; // Use default export

// export default function Doom() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     let dos;

//     async function loadDos() {
//       try {
//         console.log('Initializing Dos instance...');
//         dos = Dos(canvasRef.current); // Initialize Dos instance
//         console.log('Dos instance initialized successfully.');

//         const wadPath = '/doom/DOOM.WAD'; // Ensure the path is correct
//         console.log(`Running DOOM.WAD from path: ${wadPath}`);
//         try {
//           Dos.run(wadPath); // Run the WAD file
//           console.log('DOOM.WAD is running.');
//         } catch (error) {
//           console.error('Error while running DOOM.WAD:', error);
//         }
//       } catch (error) {
//         console.error('Failed to initialize Dos or run DOOM.WAD:', error);
//       }
//     }

//     loadDos();

//     return () => {
//       if (dos && typeof dos.stop === 'function') {
//         console.log('Stopping Dos instance...');
//         dos.stop();
//         console.log('Dos instance stopped.');
//       } else {
//         console.log('Dos instance was not initialized or already stopped.');
//       }
//     };
//   }, []);

//   return (
//     <div style={{ width: '100%', height: '100%' }}>
//       <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}></canvas>
//     </div>
//   );
// }