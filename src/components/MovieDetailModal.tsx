import React, { useState } from 'react';
import { X, Play, Plus, Check, Star, Award, Film, Sparkles, Quote, MessageSquare, Send, RefreshCw, User, Link as LinkIcon, Copy, ExternalLink, Download } from 'lucide-react';
import { Movie, Review, AIDeepDiveReview } from '../types';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onPlayTrailer: (movie: Movie) => void;
  isWatchlisted: (movieId: string) => boolean;
  onToggleWatchlist: (movieId: string) => void;
  onAddReview: (movieId: string, review: Review) => void;
  allMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  onPlayTrailer,
  isWatchlisted,
  onToggleWatchlist,
  onAddReview,
  allMovies,
  onSelectMovie,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'reviews' | 'ai_analysis'>('overview');
  
  // Review form state
  const [authorName, setAuthorName] = useState('');
  const [userRating, setUserRating] = useState(9);
  const [userComment, setUserComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<AIDeepDiveReview | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  if (!movie) return null;

  const inWatchlist = isWatchlisted(movie.id);

  const handleFetchAiAnalysis = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/gemini/review-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieTitle: movie.title,
          director: movie.director,
          year: movie.releaseYear,
          plot: movie.synopsis,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate AI deep dive review.');
      }

      const data = await res.json();
      setAiAnalysis(data);
    } catch (err: any) {
      setAiError(err.message || 'Something went wrong while consulting AI.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !userComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: authorName,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop`,
      rating: userRating,
      date: new Date().toISOString().split('T')[0],
      comment: userComment,
      verifiedWatch: true,
      likes: 1,
    };

    onAddReview(movie.id, newRev);
    setAuthorName('');
    setUserComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  // Find similar movies
  const similarMovies = allMovies.filter(
    (m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-[#0d0e12] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto text-white max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/70 border border-white/20 text-white hover:bg-red-600 transition"
          id="detail-modal-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Backdrop Banner Header */}
        <div className="relative h-64 sm:h-80 w-full shrink-0 overflow-hidden bg-black">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-center opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/40 to-transparent" />

          {/* Header Content Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex items-end gap-4">
            {/* Poster thumbnail */}
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-24 sm:w-32 aspect-[2/3] object-cover rounded-xl border-2 border-white/20 shadow-2xl shrink-0 hidden xs:block"
            />

            <div className="space-y-1 sm:space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {movie.oscarWinner && (
                  <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-bold border border-red-600/30">
                    🏆 Oscar Winner
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-white/10 text-neutral-200 font-semibold">{movie.contentRating}</span>
                <span className="text-neutral-300">{movie.releaseYear} • {movie.runtimeMinutes} min</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight uppercase tracking-tight">
                {movie.title}
              </h2>

              <div className="flex items-center gap-3 text-xs text-yellow-400 font-bold">
                <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" /> {movie.imdbRating} / 10
                </span>
                <span className="text-red-400 bg-black/60 px-2 py-0.5 rounded border border-red-500/30">
                  🍅 {movie.rottenTomatoesScore}%
                </span>
                <span className="text-neutral-300 font-normal">Directed by {movie.director}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons & Tabs Bar */}
        <div className="bg-[#12141a] border-y border-white/10 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Main Action Triggers */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPlayTrailer(movie)}
              className="px-5 py-2 rounded-xl bg-red-600 text-white font-black text-xs flex items-center gap-1.5 hover:bg-red-700 shadow-lg shadow-red-600/30 transition uppercase tracking-wider"
              id="detail-modal-play-trailer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Now</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(movie.id)}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition ${
                inWatchlist
                  ? 'bg-red-600/20 border-red-600/40 text-red-400'
                  : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
              }`}
              id="detail-modal-watchlist-toggle"
            >
              {inWatchlist ? <Check className="w-4 h-4 text-red-500" /> : <Plus className="w-4 h-4" />}
              <span>{inWatchlist ? 'In Watchlist' : 'Add to Library'}</span>
            </button>
          </div>

          {/* Tab Selection */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'overview' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              id="tab-overview"
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('cast')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'cast' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              id="tab-cast"
            >
              Cast
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'reviews' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              id="tab-reviews"
            >
              Reviews ({movie.reviews.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('ai_analysis');
                if (!aiAnalysis) handleFetchAiAnalysis();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                activeTab === 'ai_analysis' ? 'bg-red-600 text-white' : 'bg-white/10 text-neutral-300 hover:bg-white/20'
              }`}
              id="tab-ai-analysis"
            >
              <Sparkles className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              <span>AI Deep Dive</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Synopsis */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-red-500">Plot Synopsis</h3>
                <p className="text-neutral-200 text-sm leading-relaxed">{movie.synopsis}</p>
              </div>

              {/* Direct Movie Play Stream Links Box */}
              <div className="bg-[#12141c] border border-red-600/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-white uppercase tracking-wider">
                    <LinkIcon className="w-4 h-4 text-red-500" />
                    <span>Direct Movie Play & Stream Links</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase">
                    Active 4K Stream
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-3 text-xs">
                  <div className="overflow-hidden space-y-0.5">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">4K HLS Stream Link</span>
                    <code className="text-emerald-400 font-mono text-[11px] truncate block">
                      {movie.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'}
                    </code>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        const url = movie.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
                        navigator.clipboard.writeText(url);
                      }}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                      title="Copy Stream URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onPlayTrailer(movie)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-md shadow-red-600/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Now</span>
                    </button>
                    <a
                      href={movie.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                      title="Open Direct Stream URL in New Window"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Movie Quotes */}
              {movie.quotes && movie.quotes.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                    <Quote className="w-4 h-4" />
                    <span>Iconic Lines</span>
                  </div>
                  <div className="space-y-1">
                    {movie.quotes.map((q, idx) => (
                      <p key={idx} className="text-xs italic text-neutral-300">
                        "{q}"
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs & Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs space-y-1">
                  <span className="text-neutral-400 block font-medium">Director</span>
                  <span className="text-white font-bold block">{movie.director}</span>
                </div>
                {movie.writer && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs space-y-1">
                    <span className="text-neutral-400 block font-medium">Writers</span>
                    <span className="text-white font-bold block line-clamp-1">{movie.writer}</span>
                  </div>
                )}
                {movie.budget && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs space-y-1">
                    <span className="text-neutral-400 block font-medium">Production Budget</span>
                    <span className="text-white font-bold block">{movie.budget}</span>
                  </div>
                )}
                {movie.boxOffice && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs space-y-1">
                    <span className="text-neutral-400 block font-medium">Worldwide Gross</span>
                    <span className="text-white font-bold block">{movie.boxOffice}</span>
                  </div>
                )}
              </div>

              {/* Similar Movies */}
              {similarMovies.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-extrabold text-neutral-300 uppercase tracking-wider">More Like This</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {similarMovies.slice(0, 4).map((m) => (
                      <div
                        key={m.id}
                        onClick={() => onSelectMovie(m)}
                        className="group bg-white/5 border border-white/10 rounded-xl p-2 cursor-pointer hover:border-red-600/50 transition flex items-center gap-2.5"
                      >
                        <img src={m.posterUrl} alt={m.title} className="w-10 h-14 object-cover rounded-lg shrink-0" />
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-white group-hover:text-red-400 truncate">{m.title}</h4>
                          <span className="text-[10px] text-neutral-400">{m.releaseYear} • ⭐ {m.imdbRating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: CAST */}
          {activeTab === 'cast' && (
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-red-500 uppercase tracking-wider">Lead Ensemble</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {movie.cast.map((c) => (
                  <div key={c.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                    <img src={c.avatarUrl} alt={c.name} className="w-12 h-12 rounded-full object-cover border border-red-600/40 shrink-0" />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-white truncate">{c.name}</h4>
                      <p className="text-[11px] text-neutral-400 truncate">{c.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Review List */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-red-500 uppercase tracking-wider">Audience & Critic Reviews</h3>
                {movie.reviews.length > 0 ? (
                  movie.reviews.map((rev) => (
                    <div key={rev.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img src={rev.avatarUrl} alt={rev.author} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <span className="text-xs font-bold text-white block">{rev.author}</span>
                            <span className="text-[10px] text-neutral-400">{rev.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-red-600/20 px-2 py-0.5 rounded text-red-300 font-bold text-xs border border-red-600/30">
                          <Star className="w-3 h-3 fill-yellow-400" />
                          <span>{rev.rating} / 10</span>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-400 italic">No reviews written yet. Be the first to share your thoughts!</p>
                )}
              </div>

              {/* Add Review Form */}
              <div className="bg-[#12141a] border border-white/10 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-red-500" />
                  <span>Write Your Review</span>
                </h4>

                {reviewSubmitted && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    ✓ Your review has been submitted successfully!
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name / Handle"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      required
                      className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-red-600"
                      id="review-name-input"
                    />

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-300">Rating:</span>
                      <select
                        value={userRating}
                        onChange={(e) => setUserRating(Number(e.target.value))}
                        className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-yellow-400 font-bold focus:outline-none"
                        id="review-rating-select"
                      >
                        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            ⭐ {r} / 10
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <textarea
                    placeholder="Write your movie critique or impression..."
                    rows={3}
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-red-600"
                    id="review-comment-textarea"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition flex items-center gap-1.5 shadow-lg shadow-red-600/30"
                    id="review-submit-btn"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 4: AI DEEP DIVE */}
          {activeTab === 'ai_analysis' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-red-500 fill-red-500" />
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">AI Film Analysis & Consensus</h3>
                </div>
                <button
                  onClick={handleFetchAiAnalysis}
                  disabled={aiLoading}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-neutral-200 flex items-center gap-1 border border-white/10 transition"
                  id="refresh-ai-analysis-btn"
                >
                  <RefreshCw className={`w-3 h-3 ${aiLoading ? 'animate-spin text-red-400' : ''}`} />
                  <span>Refresh Analysis</span>
                </button>
              </div>

              {aiLoading && (
                <div className="p-8 text-center space-y-3 bg-red-600/10 border border-red-600/20 rounded-2xl">
                  <RefreshCw className="w-6 h-6 animate-spin text-red-500 mx-auto" />
                  <p className="text-xs text-red-300 font-semibold">Consulting Gemini Film Critic Engine...</p>
                </div>
              )}

              {aiError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl">
                  {aiError}
                </div>
              )}

              {aiAnalysis && !aiLoading && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {/* Consensus Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Critical Consensus</span>
                      <p className="text-xs text-neutral-200 leading-relaxed">{aiAnalysis.criticConsensus}</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider">Audience Vibe</span>
                      <p className="text-xs text-neutral-200 leading-relaxed">{aiAnalysis.audienceVibe}</p>
                    </div>
                  </div>

                  {/* Key Themes & Standouts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Core Thematic Elements</span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiAnalysis.keyThemes.map((t, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Standout Highlights</span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiAnalysis.standOutElements.map((s, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Trivia Fact */}
                  <div className="bg-red-600/10 border border-red-600/30 rounded-2xl p-4 text-xs space-y-1">
                    <span className="font-bold text-red-400 block uppercase tracking-wider">💡 Production Fun Fact</span>
                    <p className="text-neutral-200 italic">{aiAnalysis.triviaFact}</p>
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
