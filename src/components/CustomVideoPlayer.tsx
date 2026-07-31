import React, { useState, useEffect, useRef } from 'react';
import {
  X, Play, Pause, FastForward, Volume2, VolumeX, Maximize2, RotateCcw,
  Settings, Check, Film, SkipForward, Radio, Eye, Lock
} from 'lucide-react';
import { Movie, Episode } from '../types';

interface CustomVideoPlayerProps {
  movie: Movie | null;
  episode?: Episode;
  onClose: () => void;
  onUpdateProgress?: (movieId: string, progressSeconds: number, durationSeconds: number) => void;
  initialTimeSeconds?: number;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  movie,
  episode,
  onClose,
  onUpdateProgress,
  initialTimeSeconds = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [quality, setQuality] = useState('1080p');
  const [subtitle, setSubtitle] = useState('English');
  const [audioTrack, setAudioTrack] = useState('English Dolby 5.1');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const [showSettings, setShowSettings] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!movie) return null;

  const displayTitle = episode ? `${movie.title} - S${episode.seasonNumber}:E${episode.episodeNumber} "${episode.title}"` : movie.title;
  const videoSrc = episode?.streamUrl || movie.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (videoRef.current && initialTimeSeconds > 0) {
      videoRef.current.currentTime = initialTimeSeconds;
    }
  }, [initialTimeSeconds]);

  // Save progress periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && onUpdateProgress && movie) {
        const cur = videoRef.current.currentTime;
        const dur = videoRef.current.duration || movie.runtimeMinutes * 60;
        if (cur > 2) {
          onUpdateProgress(movie.id, Math.floor(cur), Math.floor(dur));
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [movie, onUpdateProgress]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    }
  };

  const handleSkipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 85; // Skip 1m 25s
      showToast('⏩ Skipped Intro (01:25)');
    }
  };

  const changeSpeed = (spd: number) => {
    setPlaybackSpeed(spd);
    if (videoRef.current) {
      videoRef.current.playbackRate = spd;
    }
    showToast(`Speed set to ${spd}x`);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none text-white overflow-hidden animate-in fade-in"
    >
      {/* Toast Banner */}
      {toastMessage && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-black/85 border border-red-600/50 px-5 py-2.5 rounded-2xl text-xs font-bold shadow-2xl backdrop-blur-md">
          {toastMessage}
        </div>
      )}

      {/* Top Overlay Bar */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/40 to-transparent p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-red-600 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase text-white tracking-wide line-clamp-1">
              {displayTitle}
            </h2>
            <p className="text-xs text-neutral-400 font-semibold">
              {quality} • {subtitle} • {audioTrack}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSkipIntro}
            className="px-4 py-2 bg-black/70 border border-white/20 hover:border-red-600 rounded-xl text-xs font-extrabold flex items-center gap-2 transition"
          >
            <FastForward className="w-4 h-4 text-red-500" />
            <span>Skip Intro</span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition"
            title="Video Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Settings Popup */}
      {showSettings && (
        <div className="absolute top-20 right-8 z-50 w-72 bg-[#0c0d12] border border-white/20 rounded-2xl p-4 shadow-2xl space-y-4 text-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-extrabold uppercase text-red-500 tracking-wider">Player Settings</span>
            <button onClick={() => setShowSettings(false)} className="text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase font-bold">Video Quality</span>
            <div className="grid grid-cols-2 gap-1.5">
              {['4K Ultra HD', '1080p 60fps', '720p HD', '480p SD'].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setQuality(q);
                    showToast(`Quality: ${q}`);
                  }}
                  className={`py-1.5 rounded-lg text-[10px] font-bold border transition ${
                    quality === q ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/10 text-neutral-300'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase font-bold">Subtitles</span>
            <select
              value={subtitle}
              onChange={(e) => {
                setSubtitle(e.target.value);
                showToast(`Subtitles: ${e.target.value}`);
              }}
              className="w-full bg-black/60 border border-white/15 rounded-xl p-2 text-white"
            >
              <option value="English">English [CC]</option>
              <option value="Bengali">Bengali (বাংলা)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="Off">Off</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase font-bold">Playback Speed</span>
            <div className="flex gap-1">
              {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => changeSpeed(s)}
                  className={`flex-1 py-1 rounded text-[10px] font-bold ${
                    playbackSpeed === s ? 'bg-red-600 text-white' : 'bg-white/10 text-neutral-300'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main HTML5 Video Tag */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        playsInline
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setDuration(videoRef.current.duration || 0);
          }
        }}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/80 to-transparent p-6 space-y-3">
        {/* Progress Bar & Seek */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-neutral-300 w-12 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 accent-red-600 h-1.5 rounded-lg bg-neutral-700 cursor-pointer"
          />
          <span className="text-xs font-mono text-neutral-300 w-12">{formatTime(duration)}</span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="p-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 transition">
              {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black" />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime -= 10;
                }
              }}
              className="p-2 text-neutral-300 hover:text-white transition"
              title="Rewind 10s"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime += 10;
                }
              }}
              className="p-2 text-neutral-300 hover:text-white transition"
              title="Forward 10s"
            >
              <FastForward className="w-5 h-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    const next = !isMuted;
                    setIsMuted(next);
                    videoRef.current.muted = next;
                  }
                }}
                className="p-2 text-neutral-300 hover:text-white transition"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 accent-red-600 h-1 rounded bg-neutral-700 cursor-pointer hidden sm:block"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-neutral-300 hover:text-white transition"
              title="Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
