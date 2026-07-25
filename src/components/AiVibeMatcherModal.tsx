import React, { useState } from 'react';
import { X, Sparkles, Film, ArrowRight, RefreshCw, Star, Check, Play, Plus, Compass } from 'lucide-react';
import { Movie, AIRecommendationResult } from '../types';
import { ALL_GENRES } from '../data/movies';

interface AiVibeMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  allMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
  isWatchlisted: (movieId: string) => boolean;
  onToggleWatchlist: (movieId: string) => void;
}

const MOOD_PRESETS = [
  { label: '🤯 Mind-Bending Twists', prompt: 'A mind-bending psychological plot twist with deep philosophical questions' },
  { label: '🚀 Deep Space Sci-Fi', prompt: 'An awe-inspiring epic set in space or futuristic worlds with high stakes' },
  { label: '🔥 Adrenaline Thriller', prompt: 'Fast-paced relentless action and suspense that keeps me on the edge of my seat' },
  { label: '🎨 Visual Masterpiece', prompt: 'Stunning cinematography, vibrant color palettes, and artistic direction' },
  { label: '🖤 Dark & Gritty Crime', prompt: 'A dark, atmospheric noir crime thriller with morally complex characters' },
  { label: '🍿 Feel Good Hits', prompt: 'Uplifting, fun, heartfelt storytelling that leaves a warm smile' }
];

export const AiVibeMatcherModal: React.FC<AiVibeMatcherModalProps> = ({
  isOpen,
  onClose,
  allMovies,
  onSelectMovie,
  onPlayTrailer,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('Any');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIRecommendationResult | null>(null);

  if (!isOpen) return null;

  const toggleGenre = (genre: string) => {
    if (genre === 'All') {
      setSelectedGenres([]);
      return;
    }
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleGenerateRecommendations = async (overridePrompt?: string) => {
    const finalPrompt = overridePrompt || promptInput;
    setLoading(true);
    setError(null);

    const catalogSummary = allMovies.map((m) => ({
      id: m.id,
      title: m.title,
      genres: m.genres,
      releaseYear: m.releaseYear,
      director: m.director,
      rating: m.imdbRating,
      synopsis: m.synopsis.slice(0, 100) + '...',
    }));

    try {
      const res = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          mood: selectedMood,
          genres: selectedGenres,
          catalogSummary,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate AI recommendations.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error communicating with AI Concierge.');
    } finally {
      setLoading(false);
    }
  };

  // Find matched catalog movie objects
  const matchedMovies = result?.matchedCatalogIds
    ? result.matchedCatalogIds.map((id) => allMovies.find((m) => m.id === id)).filter((m): m is Movie => m !== undefined)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-[#0d0e12] rounded-3xl border border-red-600/30 shadow-2xl overflow-hidden my-auto text-white max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-[#12141a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-600 text-white font-bold shadow-lg shadow-red-600/30">
              <Sparkles className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase text-white tracking-tight">
                AI Movie Concierge
              </h2>
              <p className="text-xs text-neutral-400">
                Describe your mood, favorite tropes, or desired vibe to receive custom cinematic picks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 transition"
            id="ai-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Quick Preset Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-red-500 uppercase tracking-wider block">
              Quick Mood Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOOD_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptInput(p.prompt);
                    handleGenerateRecommendations(p.prompt);
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-red-600/20 hover:border-red-600/40 border border-white/10 text-xs text-left font-medium text-neutral-200 hover:text-white transition"
                  id={`mood-preset-${idx}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Genre Filters */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
              Filter Preferred Genres (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_GENRES.slice(1).map((genre) => {
                const active = selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      active
                        ? 'bg-red-600 text-white font-extrabold'
                        : 'bg-white/5 border border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                    id={`ai-genre-${genre.toLowerCase()}`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Prompt Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
              Describe What You Want To Experience
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="e.g. A gritty detective thriller set in rainy Tokyo with synthwave score..."
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateRecommendations()}
                className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-red-600"
                id="ai-prompt-input"
              />

              <button
                onClick={() => handleGenerateRecommendations()}
                disabled={loading}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 disabled:opacity-50"
                id="ai-generate-btn"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>Match Vibe</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* RESULTS DISPLAY */}
          {result && !loading && (
            <div className="space-y-6 pt-4 border-t border-white/10 animate-in fade-in duration-300">
              
              {/* Recommendation Pitch Card */}
              <div className="bg-red-600/10 border border-red-600/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>AI Cinematic Pitch</span>
                </div>
                <p className="text-sm text-neutral-200 leading-relaxed font-medium">
                  {result.recommendationReason}
                </p>

                {/* Vibe Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {result.vibeKeywords.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-600/30 text-red-300 text-[11px] font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Matched Catalog Movies */}
              {matchedMovies.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    Catalog Matches
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {matchedMovies.map((movie) => {
                      const inWatchlist = isWatchlisted(movie.id);
                      return (
                        <div
                          key={movie.id}
                          className="bg-[#12141c] border border-white/10 hover:border-red-600/50 rounded-2xl p-2.5 flex flex-col justify-between space-y-2 group"
                        >
                          <div className="flex gap-2.5">
                            <img
                              src={movie.posterUrl}
                              alt={movie.title}
                              onClick={() => {
                                onSelectMovie(movie);
                                onClose();
                              }}
                              className="w-12 h-18 object-cover rounded-lg shrink-0 cursor-pointer"
                            />
                            <div className="overflow-hidden">
                              <h4
                                onClick={() => {
                                  onSelectMovie(movie);
                                  onClose();
                                }}
                                className="font-bold text-xs text-white group-hover:text-red-400 truncate cursor-pointer uppercase"
                              >
                                {movie.title}
                              </h4>
                              <p className="text-[10px] text-neutral-400 mt-0.5">
                                {movie.releaseYear} • ⭐ {movie.imdbRating}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {movie.genres.slice(0, 1).map((g) => (
                                  <span key={g} className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-neutral-300">
                                    {g}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 pt-1 border-t border-white/5">
                            <button
                              onClick={() => {
                                onPlayTrailer(movie);
                                onClose();
                              }}
                              className="flex-1 py-1 px-2 rounded-lg bg-red-600 text-white font-bold text-[11px] flex items-center justify-center gap-1 hover:bg-red-700 transition"
                              id={`ai-play-trailer-${movie.id}`}
                            >
                              <Play className="w-3 h-3 fill-white" />
                              <span>Trailer</span>
                            </button>

                            <button
                              onClick={() => onToggleWatchlist(movie.id)}
                              className={`p-1 rounded-lg border text-xs transition ${
                                inWatchlist ? 'bg-red-600 text-white border-red-500' : 'bg-white/10 border-white/20 text-white'
                              }`}
                              title="Watchlist"
                              id={`ai-watchlist-${movie.id}`}
                            >
                              {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* External AI Recommendations */}
              {result.externalRecommendations && result.externalRecommendations.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-extrabold text-red-500 uppercase tracking-wider">
                    Additional Recommended Classics
                  </h3>
                  <div className="space-y-2.5">
                    {result.externalRecommendations.map((ext, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-white">{ext.title} ({ext.year})</h4>
                          <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-neutral-300 font-medium">{ext.genre}</span>
                        </div>
                        <p className="text-xs text-neutral-300">{ext.plot}</p>
                        <p className="text-xs text-red-400 font-semibold italic pt-0.5">
                          💡 Why watch: {ext.whyWatch}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
