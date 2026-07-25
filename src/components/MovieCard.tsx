import React from 'react';
import { Play, Plus, Check, Star, Info } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movieId: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelectMovie,
  onPlayTrailer,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  return (
    <div className="group flex flex-col cursor-pointer select-none">
      
      {/* Poster Container */}
      <div className="aspect-[2/3] bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden mb-2.5 relative shadow-2xl shadow-black group-hover:border-red-600/50 transition-all duration-300">
        
        {/* NEW Badge */}
        {(movie.isNew || movie.releaseYear >= 2026) && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-white font-black px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-red-600/50 animate-pulse border border-red-400">
            <span>🔥 NEW</span>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-2.5 right-2.5 z-10 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-yellow-500 flex items-center gap-1 border border-white/10">
          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
          <span>{movie.imdbRating}</span>
        </div>

        {/* Poster Image */}
        <img
          src={movie.posterUrl}
          alt={movie.title}
          onClick={() => onSelectMovie(movie)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover Overlay Controls */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 flex flex-col justify-between z-20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20 text-white uppercase">
              {movie.contentRating}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(movie.id);
              }}
              className={`p-1.5 rounded-full border transition ${
                isWatchlisted ? 'bg-red-600 text-white border-red-500' : 'bg-black/60 border-white/30 text-white hover:bg-white/20'
              }`}
              title="Watchlist"
              id={`card-watchlist-${movie.id}`}
            >
              {isWatchlisted ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] text-neutral-300 line-clamp-2 leading-tight font-medium">
              {movie.synopsis}
            </p>

            <div className="flex gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayTrailer(movie);
                }}
                className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white font-black text-[11px] rounded-lg flex items-center justify-center gap-1 shadow-md shadow-red-600/30 transition uppercase tracking-wider"
                id={`card-play-${movie.id}`}
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Play Movie</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMovie(movie);
                }}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                title="Movie Details & Play Links"
                id={`card-details-${movie.id}`}
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Meta Text */}
      <div onClick={() => onSelectMovie(movie)}>
        <h3 className="font-bold text-sm text-white group-hover:text-red-400 transition truncate">
          {movie.title}
        </h3>
        <p className="text-xs text-white/40 mt-0.5">
          {movie.genres[0]} • {movie.releaseYear}
        </p>
      </div>

    </div>
  );
};
