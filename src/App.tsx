import React, { useState, useEffect } from 'react';
import { SAMPLE_MOVIES } from './data/movies';
import { Movie, WatchlistItem, FilterState, Review } from './types';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { MovieGrid } from './components/MovieGrid';
import { MovieDetailModal } from './components/MovieDetailModal';
import { TrailerModal } from './components/TrailerModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { AiVibeMatcherModal } from './components/AiVibeMatcherModal';
import { TriviaModal } from './components/TriviaModal';
import { AuthAndProfileModal, UserProfile } from './components/AuthAndProfileModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AdminCmsModal } from './components/AdminCmsModal';
import { AdminApp } from './components/AdminApp';
import { Footer } from './components/Footer';

export default function App() {
  const [pathMode, setPathMode] = useState<'user' | 'admin'>(() => {
    return window.location.pathname.startsWith('/admin') ? 'admin' : 'user';
  });

  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('cinephile_ott_movies');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SAMPLE_MOVIES;
  });

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem('cinephile_ott_watchlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      { movieId: 'dune-part-two', addedAt: new Date().toISOString(), status: 'plan_to_watch' },
      { movieId: 'interstellar', addedAt: new Date().toISOString(), status: 'completed' }
    ];
  });

  // User Profile & Subscription States
  const [currentProfile, setCurrentProfile] = useState<UserProfile>({
    id: 'p1',
    name: 'Alex (Master)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
    isKids: false,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentPlan, setCurrentPlan] = useState('Premium 4K');

  // Filters State
  const [filter, setFilter] = useState<FilterState>({
    searchQuery: '',
    selectedGenre: 'All',
    minRating: 0,
    yearRange: [1970, 2026],
    sortBy: 'popularity',
    category: 'all',
  });

  // Modal States
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<Movie | null>(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isAiMatcherOpen, setIsAiMatcherOpen] = useState(false);
  const [isTriviaOpen, setIsTriviaOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isAdminCmsOpen, setIsAdminCmsOpen] = useState(false);

  // Fetch live movies catalog from backend API & keep in sync with CMS uploads
  const loadMoviesFromApi = async () => {
    try {
      const res = await fetch('/api/v1/user/movies');
      if (res.ok) {
        const data = await res.json();
        if (data.movies && Array.isArray(data.movies) && data.movies.length > 0) {
          setMovies(data.movies);
          localStorage.setItem('cinephile_ott_movies', JSON.stringify(data.movies));
        }
      }
    } catch (e) {
      console.error('Failed to sync movies from API:', e);
    }
  };

  useEffect(() => {
    loadMoviesFromApi();

    const handlePopState = () => {
      setPathMode(window.location.pathname.startsWith('/admin') ? 'admin' : 'user');
    };

    const handleCatalogUpdate = () => {
      loadMoviesFromApi();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('cineverse_movies_updated', handleCatalogUpdate);
    window.addEventListener('storage', handleCatalogUpdate);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('cineverse_movies_updated', handleCatalogUpdate);
      window.removeEventListener('storage', handleCatalogUpdate);
    };
  }, [pathMode]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('cinephile_ott_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('cinephile_ott_movies', JSON.stringify(movies));
  }, [movies]);

  const navigateTo = (mode: 'user' | 'admin') => {
    setPathMode(mode);
    const targetUrl = mode === 'admin' ? '/admin' : '/';
    window.history.pushState({}, '', targetUrl);
  };

  if (pathMode === 'admin') {
    return <AdminApp onReturnToUserSite={() => navigateTo('user')} />;
  }

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...updated }));
  };

  const isWatchlisted = (movieId: string) => {
    return watchlist.some((item) => item.movieId === movieId);
  };

  const handleToggleWatchlist = (movieId: string) => {
    if (isWatchlisted(movieId)) {
      setWatchlist((prev) => prev.filter((item) => item.movieId !== movieId));
    } else {
      setWatchlist((prev) => [
        ...prev,
        { movieId, addedAt: new Date().toISOString(), status: 'plan_to_watch' },
      ]);
    }
  };

  const handleUpdateWatchlistItem = (movieId: string, updated: Partial<WatchlistItem>) => {
    setWatchlist((prev) =>
      prev.map((item) => (item.movieId === movieId ? { ...item, ...updated } : item))
    );
  };

  const handleClearWatchlist = () => {
    setWatchlist([]);
  };

  const handleAddReview = (movieId: string, review: Review) => {
    setMovies((prev) =>
      prev.map((m) => {
        if (m.id === movieId) {
          return { ...m, reviews: [review, ...m.reviews] };
        }
        return m;
      })
    );
    if (selectedMovie && selectedMovie.id === movieId) {
      setSelectedMovie((prev) => (prev ? { ...prev, reviews: [review, ...prev.reviews] } : null));
    }
  };

  // Admin CMS handlers
  const handleAddMovie = (newMovie: Movie) => {
    setMovies((prev) => [newMovie, ...prev]);
  };

  const handleUpdateMovie = (updatedMovie: Movie) => {
    setMovies((prev) => prev.map((m) => (m.id === updatedMovie.id ? updatedMovie : m)));
    if (selectedMovie?.id === updatedMovie.id) {
      setSelectedMovie(updatedMovie);
    }
  };

  const handleDeleteMovie = (movieId: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
    setWatchlist((prev) => prev.filter((w) => w.movieId !== movieId));
    if (selectedMovie?.id === movieId) {
      setSelectedMovie(null);
    }
  };

  // Featured movies for hero slider
  const featuredMovies = movies.filter((m) => m.featured);

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 font-sans selection:bg-red-600 selection:text-white antialiased flex flex-col">
      
      {/* Header Navigation */}
      <Navbar
        filter={filter}
        onFilterChange={handleFilterChange}
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenAiMatcher={() => setIsAiMatcherOpen(true)}
        onOpenTrivia={() => setIsTriviaOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        currentProfile={currentProfile}
      />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Featured Hero Banner */}
        {!filter.searchQuery && filter.category === 'all' && filter.selectedGenre === 'All' && (
          <HeroCarousel
            featuredMovies={featuredMovies}
            onSelectMovie={(movie) => setSelectedMovie(movie)}
            onPlayTrailer={(movie) => setActiveTrailerMovie(movie)}
            isWatchlisted={isWatchlisted}
            onToggleWatchlist={handleToggleWatchlist}
          />
        )}

        {/* Movie Explorer Grid */}
        <MovieGrid
          movies={movies}
          filter={filter}
          onFilterChange={handleFilterChange}
          onSelectMovie={(movie) => setSelectedMovie(movie)}
          onPlayTrailer={(movie) => setActiveTrailerMovie(movie)}
          isWatchlisted={isWatchlisted}
          onToggleWatchlist={handleToggleWatchlist}
        />

      </main>

      {/* Footer */}
      <Footer
        onFilterChange={handleFilterChange}
        onOpenAiMatcher={() => setIsAiMatcherOpen(true)}
        onOpenTrivia={() => setIsTriviaOpen(true)}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        onNavigateToAdmin={() => navigateTo('admin')}
      />

      {/* Modals & Drawers */}
      <MovieDetailModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onPlayTrailer={(movie) => setActiveTrailerMovie(movie)}
        isWatchlisted={isWatchlisted}
        onToggleWatchlist={handleToggleWatchlist}
        onAddReview={handleAddReview}
        allMovies={movies}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
      />

      <TrailerModal
        movie={activeTrailerMovie}
        onClose={() => setActiveTrailerMovie(null)}
      />

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        allMovies={movies}
        onRemoveFromWatchlist={handleToggleWatchlist}
        onUpdateWatchlistItem={handleUpdateWatchlistItem}
        onClearWatchlist={handleClearWatchlist}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
        onPlayTrailer={(movie) => setActiveTrailerMovie(movie)}
      />

      <AiVibeMatcherModal
        isOpen={isAiMatcherOpen}
        onClose={() => setIsAiMatcherOpen(false)}
        allMovies={movies}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
        onPlayTrailer={(movie) => setActiveTrailerMovie(movie)}
        isWatchlisted={isWatchlisted}
        onToggleWatchlist={handleToggleWatchlist}
      />

      <TriviaModal
        isOpen={isTriviaOpen}
        onClose={() => setIsTriviaOpen(false)}
      />

      <AuthAndProfileModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentProfile={currentProfile}
        onSelectProfile={(p) => setCurrentProfile(p)}
        isLoggedIn={isLoggedIn}
        onToggleLogin={(status) => setIsLoggedIn(status)}
      />

      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        currentPlan={currentPlan}
        onUpdatePlan={(p) => setCurrentPlan(p)}
      />

    </div>
  );
}

