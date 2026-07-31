import React, { useState } from 'react';
import { Search, X, Star, Play, Plus, Check, Film, User, Tag, Globe } from 'lucide-react';
import { Movie } from '../types';

interface NetflixSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
  isWatchlisted: (movieId: string) => boolean;
  onToggleWatchlist: (movieId: string) => void;
}

export const NetflixSearchModal: React.FC<NetflixSearchModalProps> = ({
  isOpen,
  onClose,
  movies,
  onSelectMovie,
  onPlayTrailer,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  if (!isOpen) return null;

  const filtered = movies.filter((m) => {
    if (selectedGenre !== 'All' && !m.genres.includes(selectedGenre)) return false;
    if (!query.trim()) return true;

    const q = query.toLowerCase();
    const titleMatch = m.title.toLowerCase().includes(q);
    const directorMatch = m.director.toLowerCase().includes(q);
    const castMatch = m.cast.some((c) => c.name.toLowerCase().includes(q));
    const genreMatch = m.genres.some((g) => g.toLowerCase().includes(q));
    const langMatch = m.language.toLowerCase().includes(q);

    return titleMatch || directorMatch || castMatch || genreMatch || langMatch;
  });

  const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Thriller', 'Animation', 'Comedy', 'Horror', 'Romance'];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-3xl flex flex-col p-4 sm:p-8 animate-in fade-in duration-200 overflow-y-auto">
      {/* Header Search Input */}
      <div className="max-w-5xl mx-auto w-full space-y-6 pt-4">
        <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-4">
          <div className="flex-1 relative flex items-center">
            <Search className="w-7 h-7 text-red-600 absolute left-2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Search movies, series, actors, directors, genres, languages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent pl-12 pr-10 text-xl sm:text-3xl font-black text-white placeholder-neutral-500 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2 p-1 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-red-600 font-bold text-xs text-white transition uppercase"
          >
            Close ESC
          </button>
        </div>

        {/* Genre Pill Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          <span className="text-neutral-400 font-bold uppercase text-[10px] shrink-0">Filter Genre:</span>
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-full font-bold transition border shrink-0 ${
                selectedGenre === g
                  ? 'bg-red-600 border-red-500 text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Search Results Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-white/5 pb-2">
            <span>
              {query ? `Search Results for "${query}"` : 'Top Trending Suggestions'} ({filtered.length} titles)
            </span>
            <span className="font-mono text-[11px] text-neutral-500">CINEVERSE SEARCH ENGINE</span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filtered.map((movie) => {
                const inList = isWatchlisted(movie.id);

                return (
                  <div
                    key={movie.id}
                    onClick={() => {
                      onSelectMovie(movie);
                      onClose();
                    }}
                    className="group relative bg-[#12141a] rounded-2xl overflow-hidden border border-white/10 hover:border-red-600/60 transition-all duration-300 cursor-pointer shadow-xl flex flex-col"
                  >
                    <div className="aspect-[2/3] w-full relative overflow-hidden bg-neutral-900">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-yellow-400 font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <span>{movie.imdbRating}</span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end gap-2">
                        <p className="text-[10px] text-neutral-300 line-clamp-3">{movie.synopsis}</p>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onPlayTrailer(movie);
                              onClose();
                            }}
                            className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] rounded-lg flex items-center justify-center gap-1 uppercase"
                          >
                            <Play className="w-3 h-3 fill-white" /> Play
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleWatchlist(movie.id);
                            }}
                            className="p-1.5 bg-white/10 border border-white/20 rounded-lg text-white"
                          >
                            {inList ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 space-y-0.5">
                      <h4 className="text-xs font-extrabold text-white truncate group-hover:text-red-400 transition">
                        {movie.title}
                      </h4>
                      <p className="text-[10px] text-neutral-400">
                        {movie.genres[0]} • {movie.releaseYear} • {movie.language}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-neutral-400 space-y-2">
              <Film className="w-12 h-12 text-neutral-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No titles matching "{query}"</h3>
              <p className="text-xs">Try searching for popular terms like "Dune", "Action", "Nolan", or "Sci-Fi".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
