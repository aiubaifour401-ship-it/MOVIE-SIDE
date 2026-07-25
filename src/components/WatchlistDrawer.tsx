import React, { useState } from 'react';
import { X, Trash2, Bookmark, Star, Check, Play, Share2 } from 'lucide-react';
import { Movie, WatchlistItem, WatchStatus } from '../types';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: WatchlistItem[];
  allMovies: Movie[];
  onRemoveFromWatchlist: (movieId: string) => void;
  onUpdateWatchlistItem: (movieId: string, updated: Partial<WatchlistItem>) => void;
  onClearWatchlist: () => void;
  onSelectMovie: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlist,
  allMovies,
  onRemoveFromWatchlist,
  onUpdateWatchlistItem,
  onClearWatchlist,
  onSelectMovie,
  onPlayTrailer,
}) => {
  const [statusFilter, setStatusFilter] = useState<WatchStatus | 'all'>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Hydrate watchlist with movie details
  const hydratedItems = watchlist.map((item) => ({
    ...item,
    movie: allMovies.find((m) => m.id === item.movieId),
  })).filter((item) => item.movie !== undefined);

  // Filter by status
  const filteredItems = hydratedItems.filter((item) => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const handleShareWatchlist = () => {
    const textList = hydratedItems
      .map((i, idx) => `${idx + 1}. ${i.movie?.title} (${i.movie?.releaseYear}) [${i.status.replace('_', ' ')}]`)
      .join('\n');

    const shareContent = `🍿 My CINEVERSE PRO Library (${hydratedItems.length} titles):\n\n${textList}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareContent);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        
        {/* Drawer Panel */}
        <div className="w-screen max-w-md bg-[#0d0e12] border-l border-white/10 text-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 bg-[#12141a] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-600/20 border border-red-600/40 text-red-500">
                <Bookmark className="w-5 h-5 fill-red-500/20" />
              </div>
              <div>
                <h2 className="text-lg font-black uppercase text-white tracking-tight">Personal Library</h2>
                <p className="text-xs text-neutral-400">
                  {hydratedItems.length} {hydratedItems.length === 1 ? 'saved title' : 'saved titles'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 transition"
              id="watchlist-drawer-close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Tabs */}
          {hydratedItems.length > 0 && (
            <div className="p-3 border-b border-white/10 bg-[#0f1117] flex items-center gap-1.5 overflow-x-auto text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === 'all' ? 'bg-red-600 text-white font-extrabold' : 'text-neutral-400 hover:text-white'
                }`}
                id="filter-status-all"
              >
                All ({hydratedItems.length})
              </button>
              <button
                onClick={() => setStatusFilter('plan_to_watch')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === 'plan_to_watch' ? 'bg-red-600 text-white font-extrabold' : 'text-neutral-400 hover:text-white'
                }`}
                id="filter-status-plan"
              >
                Plan
              </button>
              <button
                onClick={() => setStatusFilter('watching')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === 'watching' ? 'bg-red-600 text-white font-extrabold' : 'text-neutral-400 hover:text-white'
                }`}
                id="filter-status-watching"
              >
                Watching
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === 'completed' ? 'bg-red-600 text-white font-extrabold' : 'text-neutral-400 hover:text-white'
                }`}
                id="filter-status-completed"
              >
                Finished
              </button>
            </div>
          )}

          {/* Watchlist Items */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const movie = item.movie!;
                return (
                  <div
                    key={item.movieId}
                    className="group bg-[#12141c] border border-white/10 hover:border-red-600/50 rounded-2xl p-3 flex gap-3 transition"
                  >
                    {/* Poster */}
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      onClick={() => {
                        onSelectMovie(movie);
                        onClose();
                      }}
                      className="w-16 h-24 object-cover rounded-xl border border-white/10 shrink-0 cursor-pointer"
                    />

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between overflow-hidden">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h3
                            onClick={() => {
                              onSelectMovie(movie);
                              onClose();
                            }}
                            className="font-bold text-sm text-white hover:text-red-400 transition truncate cursor-pointer uppercase"
                          >
                            {movie.title}
                          </h3>

                          <button
                            onClick={() => onRemoveFromWatchlist(movie.id)}
                            className="text-neutral-400 hover:text-red-400 p-1 transition shrink-0"
                            title="Remove Title"
                            id={`remove-watchlist-${movie.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-[11px] text-neutral-400">
                          {movie.releaseYear} • ⭐ {movie.imdbRating}
                        </p>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                        <select
                          value={item.status}
                          onChange={(e) => onUpdateWatchlistItem(movie.id, { status: e.target.value as WatchStatus })}
                          className="bg-black/60 border border-white/15 rounded-lg px-2 py-0.5 text-[11px] text-red-400 font-bold focus:outline-none"
                          id={`select-status-${movie.id}`}
                        >
                          <option value="plan_to_watch">Plan to Watch</option>
                          <option value="watching">Currently Watching</option>
                          <option value="completed">Finished Watching</option>
                        </select>

                        <button
                          onClick={() => {
                            onPlayTrailer(movie);
                            onClose();
                          }}
                          className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                          title="Stream Now"
                          id={`play-trailer-drawer-${movie.id}`}
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Empty Watchlist */
              <div className="text-center py-16 px-4 space-y-4 my-auto">
                <div className="w-14 h-14 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 flex items-center justify-center mx-auto">
                  <Bookmark className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white">Your Library is Empty</h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                  Bookmark blockbusters, save customized TV watchlists, and manage your streaming progress.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-600/30"
                  id="browse-movies-btn"
                >
                  Explore Catalog
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {hydratedItems.length > 0 && (
            <div className="p-4 border-t border-white/10 bg-[#12141a] space-y-2">
              <button
                onClick={handleShareWatchlist}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-700 transition shadow-lg shadow-red-600/30"
                id="share-watchlist-btn"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Library Copied!' : 'Export & Share Library'}</span>
              </button>

              <button
                onClick={onClearWatchlist}
                className="w-full py-2 px-4 rounded-xl bg-white/5 hover:bg-red-600/20 text-neutral-400 hover:text-red-400 font-semibold text-xs transition"
                id="clear-watchlist-btn"
              >
                Clear Entire Library
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
