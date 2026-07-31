import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Check, Star, Info } from 'lucide-react';
import { Movie } from '../types';

interface NetflixRowProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
  isWatchlisted: (movieId: string) => boolean;
  onToggleWatchlist: (movieId: string) => void;
  isTop10Row?: boolean;
  continueWatchingProgress?: { [movieId: string]: { progressPercent: number; lastTime: string } };
}

export const NetflixRow: React.FC<NetflixRowProps> = ({
  title,
  subtitle,
  movies,
  onSelectMovie,
  onPlayTrailer,
  isWatchlisted,
  onToggleWatchlist,
  isTop10Row,
  continueWatchingProgress,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="space-y-3 py-4 group relative">
      {/* Title Header */}
      <div className="flex items-end justify-between px-4 sm:px-8">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 bg-red-600 rounded-full inline-block" />
            <span>{title}</span>
          </h2>
          {subtitle && <p className="text-xs text-neutral-400 mt-0.5 font-medium">{subtitle}</p>}
        </div>
      </div>

      {/* Relative Carousel Container with Chevron Buttons */}
      <div className="relative px-2 sm:px-6">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-28 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border-r border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-r-2xl shadow-2xl"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Horizontal Row List */}
        <div
          ref={rowRef}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-3 px-2 transition-all"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, index) => {
            const inList = isWatchlisted(movie.id);
            const cw = continueWatchingProgress?.[movie.id];

            return (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                className={`relative shrink-0 cursor-pointer group/card transition-all duration-300 transform hover:scale-105 hover:z-20 ${
                  isTop10Row ? 'w-56 sm:w-64 flex items-end' : 'w-36 sm:w-48'
                }`}
              >
                {/* Large Top 10 Rank Number */}
                {isTop10Row && (
                  <span
                    className="text-8xl sm:text-[115px] font-black text-[#14151b] leading-none -mr-6 sm:-mr-8 select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] z-10 font-sans tracking-tighter shrink-0 transform translate-y-1 transition-transform group-hover/card:scale-110"
                    style={{
                      WebkitTextStroke: '3.5px #737373',
                      textShadow: '0 4px 10px rgba(0,0,0,0.9)'
                    }}
                  >
                    {index + 1}
                  </span>
                )}

                {/* Main Card Container */}
                <div
                  className={`relative bg-[#14151b] rounded-2xl overflow-hidden border border-white/10 shadow-xl group-hover/card:border-red-600/60 group-hover/card:shadow-red-600/20 transition-all ${
                    isTop10Row ? 'w-36 sm:w-44 aspect-[2/3]' : 'w-full aspect-[2/3]'
                  }`}
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />

                  {/* Rating / New Tag */}
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    {(movie.isNew || movie.releaseYear >= 2026) && (
                      <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-extrabold text-[8px] uppercase tracking-wider shadow">
                        NEW
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2 right-2 z-10 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-yellow-400 font-bold flex items-center gap-0.5 border border-white/10">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    <span>{movie.imdbRating}</span>
                  </div>

                  {/* Continue Watching Progress Bar */}
                  {cw && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-800">
                      <div
                        className="h-full bg-red-600 transition-all"
                        style={{ width: `${Math.min(100, Math.max(10, cw.progressPercent))}%` }}
                      />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity p-3 flex flex-col justify-end gap-2">
                    <h3 className="text-xs font-black text-white line-clamp-1 uppercase tracking-tight">
                      {movie.title}
                    </h3>
                    <p className="text-[10px] text-neutral-300 font-medium line-clamp-2 leading-tight">
                      {movie.synopsis}
                    </p>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayTrailer(movie);
                        }}
                        className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] rounded-lg flex items-center justify-center gap-1 shadow-md shadow-red-600/30 transition uppercase"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Play</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(movie.id);
                        }}
                        className={`p-1.5 rounded-lg border transition ${
                          inList ? 'bg-red-600 text-white border-red-500' : 'bg-black/60 border-white/20 text-white hover:bg-white/20'
                        }`}
                        title="Watchlist"
                      >
                        {inList ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectMovie(movie);
                        }}
                        className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                        title="Details"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Caption below card */}
                <div className="mt-1.5 px-0.5">
                  <h4 className="text-xs font-bold text-neutral-200 truncate group-hover/card:text-red-400 transition">
                    {movie.title}
                  </h4>
                  <span className="text-[10px] text-neutral-400">
                    {movie.genres[0]} • {movie.releaseYear}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-28 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border-l border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl shadow-2xl"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
