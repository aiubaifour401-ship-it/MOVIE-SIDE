import React from 'react';
import { ALL_GENRES } from '../data/movies';
import { FilterState, Movie } from '../types';
import { MovieCard } from './MovieCard';
import { Flame, Star, Award, Clock, Sparkles } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  filter: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onSelectMovie: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
  isWatchlisted: (movieId: string) => boolean;
  onToggleWatchlist: (movieId: string) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  filter,
  onFilterChange,
  onSelectMovie,
  onPlayTrailer,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  // Filter movies based on filter state
  const filteredMovies = movies.filter((m) => {
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchDirector = m.director.toLowerCase().includes(q);
      const matchGenre = m.genres.some((g) => g.toLowerCase().includes(q));
      if (!matchTitle && !matchDirector && !matchGenre) return false;
    }

    if (filter.selectedGenre !== 'All' && !m.genres.includes(filter.selectedGenre)) {
      return false;
    }

    if (filter.category === 'trending' && !m.trending) return false;
    if (filter.category === 'top_rated' && !m.topRated) return false;
    if (filter.category === 'oscar_winners' && !m.oscarWinner) return false;

    if (m.imdbRating < filter.minRating) return false;

    return true;
  });

  // Sort movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (filter.sortBy === 'rating') return b.imdbRating - a.imdbRating;
    if (filter.sortBy === 'releaseDate') return b.releaseYear - a.releaseYear;
    if (filter.sortBy === 'title') return a.title.localeCompare(b.title);
    return 0; // popularity default
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 bg-[#050505]">
      
      {/* Category Bar & Genre Pills */}
      <div className="space-y-4">
        
        {/* Curated Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => onFilterChange({ category: 'all' })}
            className={`px-4 py-2 rounded-xl transition border shrink-0 ${
              filter.category === 'all'
                ? 'bg-red-600 border-red-600 text-white font-black shadow-lg shadow-red-600/30'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
            id="cat-all"
          >
            All Catalog
          </button>

          <button
            onClick={() => onFilterChange({ category: 'trending' })}
            className={`px-4 py-2 rounded-xl transition border flex items-center gap-1.5 shrink-0 ${
              filter.category === 'trending'
                ? 'bg-red-600 border-red-600 text-white font-black shadow-lg shadow-red-600/30'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
            id="cat-trending"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Trending This Week</span>
          </button>

          <button
            onClick={() => onFilterChange({ category: 'top_rated' })}
            className={`px-4 py-2 rounded-xl transition border flex items-center gap-1.5 shrink-0 ${
              filter.category === 'top_rated'
                ? 'bg-red-600 border-red-600 text-white font-black shadow-lg shadow-red-600/30'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
            id="cat-top-rated"
          >
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>Top Rated (8.5+)</span>
          </button>

          <button
            onClick={() => onFilterChange({ category: 'oscar_winners' })}
            className={`px-4 py-2 rounded-xl transition border flex items-center gap-1.5 shrink-0 ${
              filter.category === 'oscar_winners'
                ? 'bg-red-600 border-red-600 text-white font-black shadow-lg shadow-red-600/30'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
            id="cat-oscar"
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Oscar Winners</span>
          </button>
        </div>

        {/* Genre Pill Filter Bar */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {ALL_GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => onFilterChange({ selectedGenre: genre })}
              className={`px-3 py-1 rounded-full border transition font-medium ${
                filter.selectedGenre === genre
                  ? 'bg-white text-black font-extrabold border-white'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
              }`}
              id={`genre-pill-${genre.toLowerCase()}`}
            >
              {genre}
            </button>
          ))}
        </div>

      </div>

      {/* Grid Section Title */}
      <div className="flex justify-between items-end pb-2 border-b border-white/5">
        <h2 className="text-xl font-black tracking-tight uppercase border-l-4 border-red-600 pl-4 text-white">
          {filter.searchQuery
            ? `Search Results for "${filter.searchQuery}"`
            : filter.selectedGenre !== 'All'
            ? `${filter.selectedGenre} Movies & TV`
            : filter.category === 'trending'
            ? 'Trending Blockbusters'
            : filter.category === 'top_rated'
            ? 'Top Rated Masterpieces'
            : 'Popular Releases'}
        </h2>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400 uppercase font-bold text-[10px] hidden sm:inline">Sort By:</span>
          <select
            value={filter.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="bg-[#12141c] border border-white/10 rounded-lg px-2.5 py-1 text-white text-xs font-semibold focus:outline-none focus:border-red-600"
            id="sort-select"
          >
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="releaseDate">Newest First</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Movie Grid */}
      {sortedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {sortedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelectMovie={onSelectMovie}
              onPlayTrailer={onPlayTrailer}
              isWatchlisted={isWatchlisted(movie.id)}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 space-y-3 bg-[#12141c] rounded-3xl border border-white/5">
          <Sparkles className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Movies Found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search terms, changing genre filters, or clearing the filter settings.
          </p>
          <button
            onClick={() => onFilterChange({ searchQuery: '', selectedGenre: 'All', category: 'all' })}
            className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-600/20"
            id="clear-filters-btn"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </section>
  );
};
