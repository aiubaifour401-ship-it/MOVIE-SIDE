import React, { useState, useEffect } from 'react';
import { SAMPLE_MOVIES } from './data/movies';
import { Movie, WatchlistItem, FilterState, Review, NotificationItem } from './types';
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
import { AdminApp } from './components/AdminApp';
import { CustomerLoginPage } from './components/CustomerLoginPage';
import { SubscriptionExpiredScreen } from './components/SubscriptionExpiredScreen';
import { Footer } from './components/Footer';

// Netflix OTT Extended Components
import { NetflixRow } from './components/NetflixRow';
import { ProfileModal } from './components/ProfileModal';
import { CustomVideoPlayer } from './components/CustomVideoPlayer';
import { NetflixSearchModal } from './components/NetflixSearchModal';
import { NewAndHotView } from './components/NewAndHotView';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [pathMode, setPathMode] = useState<'user' | 'admin'>(() => {
    return window.location.pathname.startsWith('/admin') ? 'admin' : 'user';
  });

  // User Auth & Subscription session state
  const [userSession, setUserSession] = useState<{
    id: string;
    username: string;
    name: string;
    email: string;
    subscriptionStartDate: string;
    subscriptionExpiryDate: string;
    daysRemaining: number;
  } | null>(null);

  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated' | 'expired'>('loading');
  const [expiredInfo, setExpiredInfo] = useState<{ username?: string; subscriptionExpiryDate?: string; message?: string } | undefined>(undefined);

  const [activeView, setActiveView] = useState<'home' | 'new_hot' | 'watchlist'>('home');

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

  // Profiles State
  const [profiles, setProfiles] = useState<UserProfile[]>([
    {
      id: 'p1',
      name: 'Alex (Master)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
      isKids: false,
    },
    {
      id: 'p2',
      name: 'Kids Club',
      avatarUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&auto=format&fit=crop',
      isKids: true,
    },
    {
      id: 'p3',
      name: 'Family',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
      isKids: false,
    }
  ]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(profiles[0]);
  const [currentPlan, setCurrentPlan] = useState('Premium 4K Ultra');

  // Continue Watching Progress
  const [continueWatching, setContinueWatching] = useState<{
    [movieId: string]: { progressPercent: number; lastTime: string; seconds: number; totalSeconds: number };
  }>(() => {
    const saved = localStorage.getItem('cineverse_continue_watching');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      'dune-part-two': { progressPercent: 45, lastTime: '48m remaining', seconds: 2880, totalSeconds: 6400 },
      'interstellar': { progressPercent: 80, lastTime: '20m remaining', seconds: 7200, totalSeconds: 9000 }
    };
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: '🔥 Dune: Part Two is now streaming in 4K!',
      message: 'Experience Denis Villeneuve’s masterpiece with spatial Dolby Atmos sound.',
      timestamp: '10m ago',
      read: false,
      type: 'movie',
      linkMovieId: 'dune-part-two'
    },
    {
      id: 'n2',
      title: '⏰ Subscription Plan Active',
      message: 'Your Premium 4K Ultra plan is active. Next renewal in 28 days.',
      timestamp: '2h ago',
      read: false,
      type: 'subscription'
    }
  ]);

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
  const [activePlayerMovie, setActivePlayerMovie] = useState<Movie | null>(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isAiMatcherOpen, setIsAiMatcherOpen] = useState(false);
  const [isTriviaOpen, setIsTriviaOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Validate session on mount
  const checkUserSession = async () => {
    let token = localStorage.getItem('cineverse_user_token');

    if (!token) {
      setUserSession(null);
      setAuthStatus('unauthenticated');
      return;
    }

    try {
      const res = await fetch('/api/v1/auth/user-me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.status === 200) {
        setUserSession(data.user);
        setAuthStatus('authenticated');
      } else if (res.status === 402 || res.status === 403 || data.expired) {
        setExpiredInfo({
          username: data.username,
          subscriptionExpiryDate: data.subscriptionExpiryDate,
          message: data.error || data.message,
        });
        setAuthStatus('expired');
      } else {
        localStorage.removeItem('cineverse_user_token');
        setUserSession(null);
        setAuthStatus('unauthenticated');
      }
    } catch (e) {
      console.error('Session check failed:', e);
      setAuthStatus('unauthenticated');
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const handleLoginSuccess = (user: any, token: string) => {
    localStorage.setItem('cineverse_user_token', token);
    setUserSession(user);
    setAuthStatus('authenticated');
    window.history.pushState({}, '', '/');
  };

  const handleLogout = () => {
    localStorage.removeItem('cineverse_user_token');
    setUserSession(null);
    setAuthStatus('unauthenticated');
    window.history.pushState({}, '', '/login');
  };

  // Sync movies from backend API
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

  // Save continue watching state
  useEffect(() => {
    localStorage.setItem('cineverse_continue_watching', JSON.stringify(continueWatching));
  }, [continueWatching]);

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

  // Enforce customer login requirement
  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <div className="text-xs uppercase tracking-widest font-black text-neutral-400">Verifying Cineverse Subscription Session...</div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return (
      <CustomerLoginPage
        onLoginSuccess={handleLoginSuccess}
        onShowExpiredScreen={(info) => {
          setExpiredInfo(info);
          setAuthStatus('expired');
        }}
        onOpenAdminPortal={() => navigateTo('admin')}
      />
    );
  }

  if (authStatus === 'expired') {
    return (
      <SubscriptionExpiredScreen
        expiredInfo={expiredInfo}
        onLogOut={handleLogout}
        onOpenAdminPortal={() => navigateTo('admin')}
      />
    );
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

  const handleUpdateProgress = (movieId: string, seconds: number, totalSeconds: number) => {
    if (!totalSeconds) return;
    const pct = Math.floor((seconds / totalSeconds) * 100);
    setContinueWatching((prev) => ({
      ...prev,
      [movieId]: {
        progressPercent: pct,
        lastTime: `${Math.floor((totalSeconds - seconds) / 60)}m remaining`,
        seconds,
        totalSeconds,
      }
    }));
  };

  // Filter movies for current profile (e.g. Kids mode)
  const displayMovies = movies.filter((m) => {
    if (currentProfile.isKids) {
      return m.contentRating === 'G' || m.contentRating === 'PG' || m.genres.includes('Animation') || m.isKidsFriendly;
    }
    return true;
  });

  const featuredMovies = displayMovies.filter((m) => m.featured);
  const continueWatchingMovies = displayMovies.filter((m) => !!continueWatching[m.id]);
  const top10Movies = displayMovies.slice(0, 10);
  const sportsMovies = displayMovies.filter((m) => m.genres.includes('Sports') || m.isSports);
  const actionMovies = displayMovies.filter((m) => m.genres.includes('Action') || m.genres.includes('Sci-Fi'));
  const dramaMovies = displayMovies.filter((m) => m.genres.includes('Drama') || m.genres.includes('Thriller'));
  const animationMovies = displayMovies.filter((m) => m.genres.includes('Animation') || m.isKidsFriendly);

  const requireAuthAndRun = (action: () => void) => {
    if (authStatus !== 'authenticated') {
      handleLogout();
      return;
    }
    action();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 font-sans selection:bg-red-600 selection:text-white antialiased flex flex-col">
      
      {/* Header Navigation */}
      <Navbar
        filter={filter}
        onFilterChange={handleFilterChange}
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => requireAuthAndRun(() => setIsWatchlistOpen(true))}
        onOpenAiMatcher={() => requireAuthAndRun(() => setIsAiMatcherOpen(true))}
        onOpenTrivia={() => requireAuthAndRun(() => setIsTriviaOpen(true))}
        onOpenAuth={() => {
          if (authStatus !== 'authenticated') {
            handleLogout();
          } else {
            setIsAuthOpen(true);
          }
        }}
        onOpenSubscription={() => requireAuthAndRun(() => setIsSubscriptionOpen(true))}
        currentProfile={currentProfile}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenProfiles={() => setIsProfileModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenNewAndHot={() => setActiveView('new_hot')}
        activeView={activeView}
        setActiveView={setActiveView}
        notifications={notifications}
        onMarkNotificationRead={(id) => {
          setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
        }}
        onClearNotifications={() => setNotifications([])}
        onSelectMovieById={(id) => {
          const found = movies.find((m) => m.id === id);
          if (found) setSelectedMovie(found);
        }}
      />

      {/* Main Content */}
      <main className="flex-1">
        {activeView === 'new_hot' ? (
          <NewAndHotView
            movies={displayMovies}
            onSelectMovie={(movie) => requireAuthAndRun(() => setSelectedMovie(movie))}
            onPlayTrailer={(movie) => requireAuthAndRun(() => setActivePlayerMovie(movie))}
            isWatchlisted={isWatchlisted}
            onToggleWatchlist={(movieId) => requireAuthAndRun(() => handleToggleWatchlist(movieId))}
          />
        ) : (
          <>
            {/* Featured Hero Banner Slider */}
            {!filter.searchQuery && filter.category === 'all' && filter.selectedGenre === 'All' && (
              <HeroCarousel
                featuredMovies={featuredMovies}
                onSelectMovie={(movie) => requireAuthAndRun(() => setSelectedMovie(movie))}
                onPlayTrailer={(movie) => requireAuthAndRun(() => setActivePlayerMovie(movie))}
                isWatchlisted={isWatchlisted}
                onToggleWatchlist={(movieId) => requireAuthAndRun(() => handleToggleWatchlist(movieId))}
              />
            )}

            {/* Horizontal Netflix Rows (Home Screen Default) */}
            {!filter.searchQuery && filter.category === 'all' && filter.selectedGenre === 'All' && (
              <div className="space-y-4 -mt-10 sm:-mt-20 relative z-20 pb-8">
                {/* Continue Watching Row */}
                {continueWatchingMovies.length > 0 && (
                  <NetflixRow
                    title={`Continue Watching for ${currentProfile.name}`}
                    movies={continueWatchingMovies}
                    onSelectMovie={(m) => setSelectedMovie(m)}
                    onPlayTrailer={(m) => setActivePlayerMovie(m)}
                    isWatchlisted={isWatchlisted}
                    onToggleWatchlist={handleToggleWatchlist}
                    continueWatchingProgress={continueWatching}
                  />
                )}

                {/* Top 10 in Bangladesh Today */}
                <NetflixRow
                  title="Top 10 Today in Bangladesh"
                  subtitle="Most watched movies and series in your region"
                  movies={top10Movies}
                  onSelectMovie={(m) => setSelectedMovie(m)}
                  onPlayTrailer={(m) => setActivePlayerMovie(m)}
                  isWatchlisted={isWatchlisted}
                  onToggleWatchlist={handleToggleWatchlist}
                  isTop10Row={true}
                />

                {/* Live Sports & Championship Events Row */}
                {sportsMovies.length > 0 && (
                  <NetflixRow
                    title="⚽ Live Sports & World Championships"
                    subtitle="4K 60FPS Ultra Low Latency Matches & Highlights"
                    movies={sportsMovies}
                    onSelectMovie={(m) => setSelectedMovie(m)}
                    onPlayTrailer={(m) => setActivePlayerMovie(m)}
                    isWatchlisted={isWatchlisted}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                )}

                {/* Action & Sci-Fi Row */}
                <NetflixRow
                  title="Blockbuster Action & Sci-Fi"
                  movies={actionMovies}
                  onSelectMovie={(m) => setSelectedMovie(m)}
                  onPlayTrailer={(m) => setActivePlayerMovie(m)}
                  isWatchlisted={isWatchlisted}
                  onToggleWatchlist={handleToggleWatchlist}
                />

                {/* Drama & Suspense Row */}
                <NetflixRow
                  title="Critically Acclaimed Drama & Thrillers"
                  movies={dramaMovies}
                  onSelectMovie={(m) => setSelectedMovie(m)}
                  onPlayTrailer={(m) => setActivePlayerMovie(m)}
                  isWatchlisted={isWatchlisted}
                  onToggleWatchlist={handleToggleWatchlist}
                />

                {/* Kids & Family Animation Row */}
                <NetflixRow
                  title="Family & Animation Hits"
                  movies={animationMovies}
                  onSelectMovie={(m) => setSelectedMovie(m)}
                  onPlayTrailer={(m) => setActivePlayerMovie(m)}
                  isWatchlisted={isWatchlisted}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              </div>
            )}

            {/* Movie Explorer Grid */}
            <MovieGrid
              movies={displayMovies}
              filter={filter}
              onFilterChange={handleFilterChange}
              onSelectMovie={(movie) => requireAuthAndRun(() => setSelectedMovie(movie))}
              onPlayTrailer={(movie) => requireAuthAndRun(() => setActivePlayerMovie(movie))}
              isWatchlisted={isWatchlisted}
              onToggleWatchlist={(movieId) => requireAuthAndRun(() => handleToggleWatchlist(movieId))}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onFilterChange={handleFilterChange}
        onOpenAiMatcher={() => setIsAiMatcherOpen(true)}
        onOpenTrivia={() => setIsTriviaOpen(true)}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        onNavigateToAdmin={() => navigateTo('admin')}
      />

      {/* Custom Video Player Overlay */}
      {activePlayerMovie && (
        <CustomVideoPlayer
          movie={activePlayerMovie}
          onClose={() => setActivePlayerMovie(null)}
          onUpdateProgress={handleUpdateProgress}
          initialTimeSeconds={continueWatching[activePlayerMovie.id]?.seconds || 0}
        />
      )}

      {/* Netflix Search Modal */}
      <NetflixSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        movies={displayMovies}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
        onPlayTrailer={(movie) => setActivePlayerMovie(movie)}
        isWatchlisted={isWatchlisted}
        onToggleWatchlist={handleToggleWatchlist}
      />

      {/* Profile Selection Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        currentProfile={currentProfile}
        onSelectProfile={(p) => setCurrentProfile(p)}
        onCreateProfile={(p) => setProfiles((prev) => [...prev, p])}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onClearWatchhistory={() => setContinueWatching({})}
      />

      {/* Standard Modals & Drawers */}
      <MovieDetailModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onPlayTrailer={(movie) => setActivePlayerMovie(movie)}
        isWatchlisted={isWatchlisted}
        onToggleWatchlist={handleToggleWatchlist}
        onAddReview={(movieId, review) => {
          setMovies((prev) =>
            prev.map((m) => (m.id === movieId ? { ...m, reviews: [review, ...m.reviews] } : m))
          );
        }}
        allMovies={displayMovies}
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
        allMovies={displayMovies}
        onRemoveFromWatchlist={handleToggleWatchlist}
        onUpdateWatchlistItem={(id, item) => {
          setWatchlist((prev) => prev.map((w) => (w.movieId === id ? { ...w, ...item } : w)));
        }}
        onClearWatchlist={() => setWatchlist([])}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
        onPlayTrailer={(movie) => setActivePlayerMovie(movie)}
      />

      <AiVibeMatcherModal
        isOpen={isAiMatcherOpen}
        onClose={() => setIsAiMatcherOpen(false)}
        allMovies={displayMovies}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
        onPlayTrailer={(movie) => setActivePlayerMovie(movie)}
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
        isLoggedIn={authStatus === 'authenticated'}
        onToggleLogin={(status) => {
          if (!status) handleLogout();
        }}
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
