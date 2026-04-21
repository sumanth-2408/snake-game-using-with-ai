import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black font-digital text-cyan-400 crt relative flex flex-col items-center justify-center overflow-hidden uppercase tracking-widest leading-none">
      <div className="absolute inset-0 noise z-50 pointer-events-none"></div>
      
      {/* HUD Header */}
      <div className="absolute top-4 left-4 lg:top-8 lg:left-8 z-40 screen-tear">
        <h1 className="text-5xl lg:text-7xl font-bold glitch-heavy" data-text="SYS.OP // NEON_DEATH">
          SYS.OP // NEON_DEATH
        </h1>
        <p className="text-xl lg:text-3xl mt-2 text-fuchsia-500 font-mono font-bold bg-cyan-400/20 inline-block px-2">
          CRITICAL ERROR_ CODE: 404
        </p>
      </div>

      <div className="absolute bottom-4 right-4 z-40 text-right opacity-50 font-mono text-sm leading-tight text-white hidden md:block">
        V_2.0.4.9 // TERMINAL_RDY<br />
        SECURE LINK ESTABLISHED.<br />
        AWAITING INPUT...
      </div>

      {/* Main Framework */}
      <div className="w-full max-w-[1400px] flex flex-col xl:flex-row items-center justify-center gap-12 xl:gap-24 z-10 p-4 pt-48 pb-10 xl:pt-10">
        
        {/* Snake Deck */}
        <div className="w-full flex-1 flex justify-center xl:justify-end">
          <SnakeGame />
        </div>

        {/* Audio Deck */}
        <div className="w-full flex-1 flex justify-center xl:justify-start">
          <MusicPlayer />
        </div>
        
      </div>
    </div>
  );
}
