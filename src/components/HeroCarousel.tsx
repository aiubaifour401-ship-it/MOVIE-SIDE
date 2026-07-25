import React, { useState, useEffect } from 'react';
import { Play, Info, Plus, Check, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Movie } from '../types';

interface HeroCarouselProps {
  featuredMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
  isWatchlisted: (movieId: string) => boolean;
  onToggleWatchlist: (movieId: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  featuredMovies,
  onSelectMovie,
  onPlayTrailer,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!featuredMovies.length) return null;

  const movie = featuredMovies[currentIndex];
  const inWatchlist = isWatchlisted(movie.id);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredMovies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  return (
    <div className="relative h-[480px] sm:h-[520px] w-full overflow-hidden bg-[#050505] flex items-end px-6 sm:px-12 pb-10 sm:pb-12 border-b border-white/5">
      
      {/* Background Image & Vignette Overlays */}
      <div className="absolute inset-0 bg-[#050505]">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center opacity-65 transition-all duration-700 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-2xl space-y-4 animate-in fade-in duration-500">
        
        {/* Eyebrow & Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-black tracking-widest uppercase">
            FEATURED ORIGINAL
          </span>
          <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-[10px] font-bold tracking-widest uppercase text-white">
            4K ULTRA HD
          </span>
          <span className="text-xs text-white/60 font-semibold">
            • {movie.runtimeMinutes}m • {movie.releaseYear} • ⭐ {movie.imdbRating}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95] text-white uppercase drop-shadow-md">
          {movie.title}
        </h1>

        {/* Synopsis */}
        <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-lg line-clamp-3">
          {movie.synopsis}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onPlayTrailer(movie)}
            className="px-6 sm:px-8 py-3 bg-white text-black font-extrabold rounded-lg hover:bg-neutral-200 transition flex items-center gap-2 shadow-xl"
            id={`hero-play-${movie.id}`}
          >
            <Play className="w-5 h-5 fill-black" />
            <span>Watch Now</span>
          </button>

          <button
            onClick={() => onSelectMovie(movie)}
            className="px-6 sm:px-8 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-lg backdrop-blur-md hover:bg-white/20 transition flex items-center gap-2"
            id={`hero-info-${movie.id}`}
          >
            <Info className="w-5 h-5" />
            <span>More Info</span>
          </button>

          <button
            onClick={() => onToggleWatchlist(movie.id)}
            className={`p-3 rounded-lg border backdrop-blur-md transition ${
              inWatchlist
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
            title="Watchlist"
            id={`hero-watchlist-${movie.id}`}
          >
            {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Slide Navigation Controls */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-10 right-6 sm:right-12 z-20 flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition"
            id="hero-prev-btn"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition"
            id="hero-next-btn"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

    </div>
  );
};
