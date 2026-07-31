import React, { useState } from 'react';
import { Film, Search, Sparkles, Bookmark, HelpCircle, Menu, X, Flame, User, Shield, Crown, Settings, Bell, ChevronDown } from 'lucide-react';
import { FilterState, NotificationItem, UserProfile } from '../types';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  filter: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  watchlistCount: number;
  onOpenWatchlist: () => void;
  onOpenAiMatcher: () => void;
  onOpenTrivia: () => void;
  onOpenAuth: () => void;
  onOpenSubscription: () => void;
  currentProfile: UserProfile;
  onOpenSearchModal?: () => void;
  onOpenProfiles?: () => void;
  onOpenSettings?: () => void;
  onOpenNewAndHot?: () => void;
  activeView?: 'home' | 'new_hot' | 'watchlist';
  setActiveView?: (view: 'home' | 'new_hot' | 'watchlist') => void;
  notifications?: NotificationItem[];
  onMarkNotificationRead?: (id: string) => void;
  onClearNotifications?: () => void;
  onSelectMovieById?: (movieId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  filter,
  onFilterChange,
  watchlistCount,
  onOpenWatchlist,
  onOpenAiMatcher,
  onOpenTrivia,
  onOpenAuth,
  onOpenSubscription,
  currentProfile,
  onOpenSearchModal,
  onOpenProfiles,
  onOpenSettings,
  onOpenNewAndHot,
  activeView = 'home',
  setActiveView,
  notifications = [],
  onMarkNotificationRead = () => {},
  onClearNotifications = () => {},
  onSelectMovieById,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        
        {/* Brand & Category Quick Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (setActiveView) setActiveView('home');
              onFilterChange({ category: 'all', searchQuery: '', selectedGenre: 'All' });
            }}
            className="flex items-center gap-2 group"
            id="brand-logo"
          >
            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-red-600 group-hover:text-red-500 transition">
              CINEVERSE
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 text-[9px] font-extrabold uppercase border border-red-600/30">
              PRO
            </span>
          </a>

          {/* Desktop Netflix-style Nav Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-bold text-neutral-300 uppercase tracking-wider">
            <button
              onClick={() => {
                if (setActiveView) setActiveView('home');
                onFilterChange({ category: 'all', selectedGenre: 'All' });
              }}
              className={`hover:text-white transition ${activeView === 'home' && filter.category === 'all' ? 'text-white font-black underline underline-offset-8 decoration-red-600 decoration-2' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => {
                if (setActiveView) setActiveView('home');
                onFilterChange({ category: 'trending' });
              }}
              className={`hover:text-white transition ${filter.category === 'trending' ? 'text-white font-black underline underline-offset-8 decoration-red-600 decoration-2' : ''}`}
            >
              TV Shows & Series
            </button>
            <button
              onClick={() => {
                if (setActiveView) setActiveView('home');
                onFilterChange({ category: 'all', selectedGenre: 'Sports' });
              }}
              className={`hover:text-white transition flex items-center gap-1 ${filter.selectedGenre === 'Sports' ? 'text-emerald-400 font-black underline underline-offset-8 decoration-emerald-500 decoration-2' : 'text-emerald-400/90 hover:text-emerald-300'}`}
            >
              <span className="animate-pulse">⚽</span> Sports Live
            </button>
            <button
              onClick={() => {
                if (onOpenNewAndHot) onOpenNewAndHot();
                else if (setActiveView) setActiveView('new_hot');
              }}
              className={`hover:text-white transition ${activeView === 'new_hot' ? 'text-white font-black underline underline-offset-8 decoration-red-600 decoration-2 text-amber-400' : ''}`}
            >
              🔥 New & Hot
            </button>
            <button
              onClick={onOpenWatchlist}
              className="hover:text-white transition relative flex items-center gap-1"
            >
              <span>My List</span>
              {watchlistCount > 0 && (
                <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  {watchlistCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Global Search Bar Trigger (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xs relative items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search movies, series, actors..."
            value={filter.searchQuery}
            onClick={() => {
              if (onOpenSearchModal) onOpenSearchModal();
            }}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full bg-white/10 border border-white/10 rounded-full pl-9 pr-8 py-1.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition cursor-pointer"
            id="desktop-search-input"
          />
          {filter.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 text-neutral-400 hover:text-white text-xs"
              id="clear-search-btn"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Action Controls, Notifications & Profile Avatar */}
        <div className="hidden lg:flex items-center gap-3">
          {/* AI Concierge */}
          <button
            onClick={onOpenAiMatcher}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition backdrop-blur-sm"
            id="nav-ai-concierge-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>AI Matcher</span>
          </button>

          {/* Notifications Dropdown */}
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={onMarkNotificationRead}
            onClearAll={onClearNotifications}
            onSelectMovieById={onSelectMovieById}
          />

          {/* Settings Trigger */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* Upgrade Pass */}
          <button
            onClick={onOpenSubscription}
            className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition shadow-lg shadow-red-600/30"
            title="Subscription Pass"
            id="nav-subscription-btn"
          >
            <Crown className="w-4 h-4 fill-white" />
          </button>

          {/* Profile Switcher & Auth Button */}
          <div className="flex items-center gap-2 pl-1 border-l border-white/10">
            {onOpenProfiles ? (
              <button
                onClick={onOpenProfiles}
                className="flex items-center gap-2 p-1 pr-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition"
                title="Switch Profile"
              >
                <img
                  src={currentProfile.avatarUrl}
                  alt={currentProfile.name}
                  className="w-7 h-7 rounded-full object-cover border border-red-600"
                />
                <span className="text-xs font-extrabold text-neutral-200 truncate max-w-[80px]">
                  {currentProfile.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>
            ) : null}

            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition shadow-lg shadow-red-600/30"
              id="nav-profile-btn"
              title="Sign In / Account"
            >
              <User className="w-4 h-4 inline sm:hidden md:inline" />
              <span className="hidden xl:inline ml-1">Account</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenSubscription}
            className="p-2 rounded-lg bg-red-600 text-white"
            id="mobile-sub-btn"
          >
            <Crown className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/10 text-white"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Tray */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#050505] px-4 py-4 space-y-3">
          <div
            onClick={() => {
              if (onOpenSearchModal) onOpenSearchModal();
              setMobileMenuOpen(false);
            }}
            className="relative cursor-pointer"
          >
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              readOnly
              placeholder="Search movies & TV..."
              className="w-full bg-white/10 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-bold">
            <button
              onClick={() => {
                if (setActiveView) setActiveView('home');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-white/10 text-white text-center"
            >
              Home Catalog
            </button>
            <button
              onClick={() => {
                if (setActiveView) setActiveView('home');
                onFilterChange({ category: 'all', selectedGenre: 'Sports' });
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-center font-bold"
            >
              ⚽ Sports Live
            </button>
            <button
              onClick={() => {
                if (onOpenNewAndHot) onOpenNewAndHot();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 text-center font-bold"
            >
              🔥 New & Hot
            </button>
            <button
              onClick={() => {
                if (onOpenProfiles) onOpenProfiles();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-200 flex items-center justify-center gap-1.5"
            >
              <User className="w-4 h-4" /> Switch Profile
            </button>
            <button
              onClick={() => {
                onOpenWatchlist();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-200 flex items-center justify-center gap-1.5"
            >
              <Bookmark className="w-4 h-4 text-red-500" /> Library ({watchlistCount})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
