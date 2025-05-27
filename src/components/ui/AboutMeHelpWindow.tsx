import React from 'react';
import Window from './Window';

interface AboutMeHelpWindowProps {
  onClose: () => void;
}

const AboutMeHelpWindow: React.FC<AboutMeHelpWindowProps> = ({ onClose }) => {
  return (
    <Window
      title={"About Michael Ruiz"}
      onClose={onClose}
      onMinimize={() => {}}
      onMaximize={() => {}}
      onFocus={() => {}}
      x={320}
      y={120}
      width={440}
      height={420}
      zIndex={1000}
      focused={true}
      minimized={false}
      isMaximized={false}
      onDrag={() => {}}
    >
      <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 p-0 rounded-b-xl border-t border-blue-200">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-200 bg-blue-100/70 rounded-t-xl">
          <span className="text-2xl text-blue-700">❓</span>
          <span className="font-bold text-lg text-blue-900">Welcome to MichaelRuiz.dev - My Personal Site</span>
        </div>
        <div className="flex-1 overflow-auto px-6 py-4 text-blue-900 text-base leading-relaxed">
          <h2 className="font-bold text-xl mb-2">About Michael Ruiz</h2>
          <p className="mb-3">Hi! I'm Michael Ruiz, a passionate software engineer and designer. I love building delightful digital experiences that blend nostalgia, usability, and modern web technologies.</p>
          <ul className="list-disc ml-6 mb-3">
            <li>🌐 Full-stack developer (React, TypeScript, Node.js, Next.js)</li>
            <li>🎨 UI/UX enthusiast with a love for Windows XP retro aesthetics</li>
            <li>🛠️ Maker of creative tools, games, and interactive apps</li>
            <li>📚 Lifelong learner and open source contributor</li>
          </ul>
          <h3 className="font-semibold mt-4 mb-1">Contact & Links</h3>
          <ul className="list-none ml-0">
            <li><strong>Website:</strong> <a href="https://michaelruiz.dev" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline hover:text-blue-900">michaelruiz.dev</a></li>
            <li><strong>Email:</strong> <a href="mailto:hello@michaelruiz.dev" className="text-blue-700 underline hover:text-blue-900">hello@michaelruiz.dev</a></li>
            <li><strong>GitHub:</strong> <a href="https://github.com/michaelruiz" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline hover:text-blue-900">github.com/michaelruiz</a></li>
          </ul>
          <div className="mt-6 text-xs text-blue-700 opacity-70">Thanks for visiting my site. Please contact me for automation or other software engineering jobs or requests. </div>
        </div>
      </div>
    </Window>
  );
};

export default AboutMeHelpWindow;
