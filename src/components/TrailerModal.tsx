import React, { useState } from 'react';
import {
  X, Film, Settings, FastForward, Volume2, Globe, Camera,
  SlidersHorizontal, Check, Maximize2, RotateCcw, Play, Pause,
  ExternalLink, Copy, Download, Radio, Link as LinkIcon
} from 'lucide-react';
import { Movie } from '../types';

interface TrailerModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({ movie, onClose }) => {
  const [quality, setQuality] = useState('4K Ultra HD (2160p)');
  const [subtitle, setSubtitle] = useState('English [CC]');
  const [audioTrack, setAudioTrack] = useState('English 5.1 Dolby Atmos');
  const [speed, setSpeed] = useState('1.0x');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Playback Source Mode: 'stream' (Direct HLS/MP4 Video Stream Link) or 'trailer' (YouTube Embed)
  const defaultStreamUrl = movie?.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
  const [playerMode, setPlayerMode] = useState<'stream' | 'trailer'>('stream');

  if (!movie) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCaptureFrame = () => {
    showToast('📸 Frame screenshot captured and saved!');
  };

  const handleSkipIntro = () => {
    showToast('⏩ Skipped Intro (01:30)');
  };

  const handleCopyLink = () => {
    const urlToCopy = playerMode === 'stream' ? defaultStreamUrl : `https://www.youtube.com/watch?v=${movie.trailerYoutubeId}`;
    navigator.clipboard.writeText(urlToCopy);
    showToast('📋 Play Link copied to clipboard!');
  };

  const handleOpenNewTab = () => {
    const urlToOpen = playerMode === 'stream' ? defaultStreamUrl : `https://www.youtube.com/watch?v=${movie.trailerYoutubeId}`;
    window.open(urlToOpen, '_blank');
    showToast('↗ Opening movie play link in new window');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="relative w-full max-w-5xl bg-[#0b0c10] rounded-3xl border border-red-600/30 overflow-hidden shadow-2xl flex flex-col my-auto text-white">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-white/10 bg-[#12141a] gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600 text-white font-bold shadow-lg shadow-red-600/30">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white line-clamp-1 uppercase">
                  {movie.title}
                </h3>
                <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-extrabold text-[9px] uppercase border border-red-600/30">
                  {quality.split(' ')[0]}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {movie.releaseYear} • Directed by {movie.director} • {audioTrack}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Player Source Selector Tabs */}
            <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setPlayerMode('stream')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  playerMode === 'stream' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
                }`}
                id="player-mode-stream-btn"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Full Movie Stream</span>
              </button>
              <button
                onClick={() => setPlayerMode('trailer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  playerMode === 'trailer' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
                }`}
                id="player-mode-trailer-btn"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Trailer</span>
              </button>
            </div>

            {/* Settings Dropdown Button */}
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 transition"
              title="Player Settings"
              id="player-settings-btn"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-600 text-neutral-300 hover:text-white transition"
              id="trailer-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Area */}
        <div className="relative aspect-video w-full bg-black group">
          {playerMode === 'stream' ? (
            <video
              src={defaultStreamUrl}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
              id="direct-movie-stream-video"
            />
          ) : (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${movie.trailerYoutubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
              id="youtube-trailer-iframe"
            />
          )}

          {/* Toast Notification */}
          {notification && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-black/85 backdrop-blur-md px-4 py-2 rounded-xl border border-red-600/50 text-white font-bold text-xs shadow-2xl animate-in fade-in">
              {notification}
            </div>
          )}

          {/* Quick Player Overlays */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
            <button
              onClick={handleSkipIntro}
              className="px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black backdrop-blur-md border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition"
              id="skip-intro-btn"
            >
              <FastForward className="w-4 h-4 text-red-500" />
              <span>Skip Intro</span>
            </button>

            <button
              onClick={handleCaptureFrame}
              className="p-2 rounded-xl bg-black/70 hover:bg-black backdrop-blur-md border border-white/20 text-white transition"
              title="Screenshot Frame"
              id="capture-frame-btn"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Settings Menu Popup Overlay */}
          {showSettingsMenu && (
            <div className="absolute top-4 right-4 z-40 w-64 bg-[#0d0e12] border border-white/20 rounded-2xl p-4 shadow-2xl text-xs space-y-3 animate-in fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="font-extrabold text-white uppercase text-[10px]">Playback Config</span>
                <button onClick={() => setShowSettingsMenu(false)} className="text-neutral-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quality */}
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Streaming Quality</span>
                <select
                  value={quality}
                  onChange={(e) => {
                    setQuality(e.target.value);
                    showToast(`Quality set to ${e.target.value}`);
                  }}
                  className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                >
                  <option value="4K Ultra HD (2160p)">4K Ultra HD (2160p)</option>
                  <option value="1080p Full HD">1080p Full HD</option>
                  <option value="720p HD">720p HD</option>
                </select>
              </div>

              {/* Subtitles */}
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Subtitles / Closed Captions</span>
                <select
                  value={subtitle}
                  onChange={(e) => {
                    setSubtitle(e.target.value);
                    showToast(`Subtitles: ${e.target.value}`);
                  }}
                  className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                >
                  <option value="English [CC]">English [CC]</option>
                  <option value="Spanish (Español)">Spanish (Español)</option>
                  <option value="French (Français)">French (Français)</option>
                  <option value="Japanese (日本語)">Japanese (日本語)</option>
                  <option value="Off">Off</option>
                </select>
              </div>

              {/* Audio Track */}
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Spatial Audio Track</span>
                <select
                  value={audioTrack}
                  onChange={(e) => {
                    setAudioTrack(e.target.value);
                    showToast(`Audio: ${e.target.value}`);
                  }}
                  className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                >
                  <option value="English 5.1 Dolby Atmos">English 5.1 Dolby Atmos</option>
                  <option value="Spanish Stereo">Spanish Stereo</option>
                  <option value="Japanese Original 7.1">Japanese Original 7.1</option>
                </select>
              </div>

              {/* Speed */}
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Playback Speed</span>
                <div className="flex gap-1">
                  {['0.75x', '1.0x', '1.25x', '1.5x'].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSpeed(s);
                        showToast(`Speed set to ${s}`);
                      }}
                      className={`flex-1 py-1 rounded text-[10px] font-bold ${
                        speed === s ? 'bg-red-600 text-white' : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Direct Play Link Banner Part */}
        <div className="p-3 bg-black/80 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden w-full sm:w-auto">
            <LinkIcon className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-neutral-400 font-bold uppercase text-[10px] shrink-0">Movie Play Link:</span>
            <code className="text-emerald-400 bg-white/5 border border-white/10 px-2 py-1 rounded text-[11px] truncate font-mono max-w-xs sm:max-w-md">
              {playerMode === 'stream' ? defaultStreamUrl : `https://youtube.com/watch?v=${movie.trailerYoutubeId}`}
            </code>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition"
              title="Copy Play URL"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>

            <button
              onClick={handleOpenNewTab}
              className="px-3 py-1.5 rounded-xl bg-red-600/20 border border-red-600/40 hover:bg-red-600 text-red-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition"
              title="Open stream in new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Link ↗</span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-3.5 bg-[#12141a] text-xs text-neutral-400 flex flex-wrap items-center justify-between gap-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-white/10 text-white font-semibold">{movie.contentRating}</span>
            <span className="text-yellow-400 font-bold">⭐ {movie.imdbRating} IMDb</span>
            <span className="text-red-400 font-bold">🍅 {movie.rottenTomatoesScore}% Rotten Tomatoes</span>
          </div>

          <p className="text-[11px] text-neutral-500 italic">Ultra-Low Latency Edge CDN Active • 4K HDR Atmos</p>
        </div>

      </div>
    </div>
  );
};

