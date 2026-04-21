import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "DATA_CORRUPTION.WAV", artist: "NULL_ROUTINE", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { id: 2, title: "CYBER_OVERDRIVE.MP3", artist: "PROXY_BOT", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" },
  { id: 3, title: "GRID_COLLAPSE.FLAC", artist: "SYS_ADMIN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3" }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleNext = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const handlePrev = () => setCurrentTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-sm bg-black border-4 border-cyan-400 p-6 shadow-[10px_10px_0_0_#ff00ff] relative screen-tear font-digital uppercase">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
      
      {/* Raw AV Deck Data Display */}
      <div className="w-full h-32 border-4 border-fuchsia-500 bg-[#0a0a0a] mb-6 relative overflow-hidden flex items-end justify-between px-2 pb-0 pt-8">
        <div className="absolute top-2 left-2 text-cyan-400 glitch-heavy text-3xl leading-none" data-text="A/V_DECK: ONLINE">
          A/V_DECK: {isPlaying ? 'ACTIVE' : 'IDLE'}
        </div>
        {[...Array(14)].map((_, i) => (
          <div 
            key={i} 
            className={`w-4 bg-cyan-400 border-t-2 border-white transition-all duration-75`}
            style={{ 
              height: isPlaying ? `${Math.random() * 80 + 20}%` : '5%',
              opacity: isPlaying ? 1 : 0.3
            }}
          />
        ))}
      </div>

      {/* Track Info */}
      <div className="mb-6 border-b-2 border-cyan-400 pb-4">
        <h3 className="text-fuchsia-500 font-bold text-3xl truncate glitch-heavy block" data-text={currentTrack.title}>
          {currentTrack.title}
        </h3>
        <p className="text-cyan-400 text-xl font-mono truncate mt-1 bg-fuchsia-500/20 inline-block px-1">
          AUTHOR_ {currentTrack.artist}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 relative">
        <input 
          type="range" 
          min="0" 
          max={duration || 100} 
          value={progress} 
          onChange={handleProgressChange}
          className="w-full relative z-10"
        />
        <div className="flex justify-between text-lg text-fuchsia-500 mt-2 font-mono font-bold">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls Container */}
      <div className="flex flex-col gap-6">
        
        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={handlePrev} className="p-3 border-2 border-cyan-400 bg-black text-cyan-400 hover:bg-fuchsia-500 hover:text-black hover:border-fuchsia-500 transition-none shadow-[2px_2px_0_0_#f0f] active:shadow-none active:translate-y-0.5 active:translate-x-0.5">
            <SkipBack className="w-8 h-8" fill="currentColor" />
          </button>
          
          <button onClick={togglePlay} className="p-4 border-4 border-fuchsia-500 bg-cyan-400 text-black hover:bg-black hover:text-fuchsia-500 transition-none shadow-[4px_4px_0_0_#fff] active:shadow-none active:translate-y-1 active:translate-x-1">
            {isPlaying ? (
              <Pause className="w-10 h-10" fill="currentColor" />
            ) : (
              <Play className="w-10 h-10 ml-1" fill="currentColor" />
            )}
          </button>

          <button onClick={handleNext} className="p-3 border-2 border-cyan-400 bg-black text-cyan-400 hover:bg-fuchsia-500 hover:text-black hover:border-fuchsia-500 transition-none shadow-[2px_2px_0_0_#f0f] active:shadow-none active:translate-y-0.5 active:translate-x-0.5">
            <SkipForward className="w-8 h-8" fill="currentColor" />
          </button>
        </div>

        {/* Volume Rocker */}
        <div className="flex items-center gap-4 border-2 border-fuchsia-500 p-2 bg-black">
          <button onClick={toggleMute} className="text-cyan-400 hover:text-fuchsia-500">
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1"
          />
        </div>

      </div>
    </div>
  );
}
