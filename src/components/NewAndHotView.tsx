import React, { useState } from 'react';
import { Flame, Calendar, Sparkles, Play, Plus, Check, Star, Bell } from 'lucide-react';
import { Movie } from '../types';

interface NewAndHotViewProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
  isWatchlisted: (movieId: string) => boolean;
  onToggleWatchlist: (movieId: string) => void;
}

export const NewAndHotView: React.FC<NewAndHotViewProps> = ({
  movies,
  onSelectMovie,
  onPlayTrailer,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'trending' | 'coming_soon' | 'top10'>('trending');
  const [reminders, setReminders] = useState<{ [id: string]: boolean }>({});

  const toggleReminder = (id: string) => {
    setReminders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const trendingMovies = movies.filter((m) => m.trending || m.imdbRating >= 8.5);
  const top10Movies = movies.slice(0, 10);
  const upcomingMovies = movies.filter((m) => m.upcoming || m.releaseYear >= 2024);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#050505] text-white">
      {/* Subtab navigation */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveSubTab('trending')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${
            activeSubTab === 'trending' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-white/5 border border-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Everyone's Watching</span>
        </button>

        <button
          onClick={() => setActiveSubTab('coming_soon')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${
            activeSubTab === 'coming_soon' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-white/5 border border-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>Coming Soon & Exclusives</span>
        </button>

        <button
          onClick={() => setActiveSubTab('top10')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${
            activeSubTab === 'top10' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-white/5 border border-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>Top 10 Today</span>
        </button>
      </div>

      {/* Content Rendering */}
      {activeSubTab === 'trending' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-red-600 rounded" />
              <span>Trending Worldwide Right Now</span>
            </h2>
            <span className="text-xs text-neutral-400">Updated every hour</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingMovies.map((movie) => {
              const inList = isWatchlisted(movie.id);

              return (
                <div
                  key={movie.id}
                  className="bg-[#12141a] rounded-3xl border border-white/10 overflow-hidden flex flex-col sm:flex-row hover:border-red-600/50 transition-all shadow-xl group"
                >
                  <div className="sm:w-2/5 aspect-[2/3] sm:aspect-auto relative overflow-hidden bg-neutral-900 shrink-0">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-red-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider shadow">
                      #1 TRENDING
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between space-y-4 flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-yellow-400 font-bold">
                        <span>⭐ {movie.imdbRating} IMDb</span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-neutral-300">{movie.releaseYear}</span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-red-400">{movie.genres[0]}</span>
                      </div>

                      <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-red-400 transition">
                        {movie.title}
                      </h3>

                      <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed">
                        {movie.synopsis}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <button
                        onClick={() => onPlayTrailer(movie)}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl flex items-center gap-1.5 uppercase shadow-lg shadow-red-600/30 transition"
                      >
                        <Play className="w-4 h-4 fill-white" /> Play Now
                      </button>

                      <button
                        onClick={() => onToggleWatchlist(movie.id)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                          inList ? 'bg-red-600/20 text-red-400 border-red-500' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                        }`}
                      >
                        {inList ? <Check className="w-4 h-4 text-red-500" /> : <Plus className="w-4 h-4" />}
                        <span className="hidden sm:inline">{inList ? 'In List' : 'My List'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === 'coming_soon' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-purple-600 rounded" />
              <span>Upcoming & Exclusive Premieres</span>
            </h2>
            <span className="text-xs text-neutral-400">Set reminders for premiere alerts</span>
          </div>

          <div className="space-y-6 max-w-4xl">
            {upcomingMovies.map((movie, idx) => {
              const hasReminder = !!reminders[movie.id];

              return (
                <div
                  key={movie.id}
                  className="bg-[#12141a] rounded-3xl border border-white/10 p-6 flex flex-col md:flex-row gap-6 hover:border-purple-500/50 transition-all shadow-xl"
                >
                  <div className="w-full md:w-64 aspect-video rounded-2xl overflow-hidden bg-neutral-900 shrink-0 relative">
                    <img src={movie.backdropUrl} alt={movie.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        onClick={() => onPlayTrailer(movie)}
                        className="p-3 rounded-full bg-red-600 text-white shadow-2xl hover:scale-110 transition"
                      >
                        <Play className="w-6 h-6 fill-white" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 font-extrabold text-[10px] uppercase border border-purple-500/30">
                        COMING FRIDAY • 2026 PREMIERE
                      </span>

                      <button
                        onClick={() => toggleReminder(movie.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          hasReminder
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-white/10 hover:bg-white/20 border border-white/15 text-white'
                        }`}
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>{hasReminder ? 'Reminder Set ✓' : 'Remind Me'}</span>
                      </button>
                    </div>

                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{movie.title}</h3>
                    <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">{movie.synopsis}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === 'top10' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-yellow-500 rounded" />
              <span>Top 10 Today in Bangladesh</span>
            </h2>
            <span className="text-xs text-yellow-400 font-bold">#1 Streaming Index</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {top10Movies.map((movie, idx) => (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                className="group cursor-pointer bg-[#12141a] rounded-2xl border border-white/10 p-3 hover:border-red-600 transition flex flex-col justify-between"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2">
                  <span className="absolute top-2 left-2 z-10 w-8 h-8 rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-lg">
                    #{idx + 1}
                  </span>
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white truncate group-hover:text-red-400">{movie.title}</h4>
                  <span className="text-[10px] text-neutral-400">⭐ {movie.imdbRating} • {movie.genres[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
