import React, { useState } from 'react';
import { Film, Search, Sparkles, Bookmark, HelpCircle, Menu, X, Flame, User, Shield, Crown } from 'lucide-react';
import { FilterState } from '../types';
import { UserProfile } from './AuthAndProfileModal';

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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        
        {/* Brand & Category Quick Links */}
        <div className="flex items-center gap-8">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
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

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
            <button
              onClick={() => onFilterChange({ category: 'all', selectedGenre: 'All' })}
              className={`hover:text-white transition ${filter.category === 'all' ? 'text-white font-bold' : ''}`}
            >
              Movies
            </button>
            <button
              onClick={() => onFilterChange({ category: 'trending' })}
              className={`hover:text-white transition ${filter.category === 'trending' ? 'text-white font-bold' : ''}`}
            >
              TV Shows
            </button>
            <button
              onClick={() => onFilterChange({ category: 'oscar_winners' })}
              className={`hover:text-white transition ${filter.category === 'oscar_winners' ? 'text-white font-bold' : ''}`}
            >
              Originals
            </button>
            <button
              onClick={onOpenWatchlist}
              className="hover:text-white transition relative"
            >
              My Library
              {watchlistCount > 0 && (
                <span className="ml-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {watchlistCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xs relative items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search titles, actors, genres..."
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full bg-white/10 border border-white/10 rounded-full pl-9 pr-8 py-1.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
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

        {/* Action Controls & Profile Avatar */}
        <div className="hidden lg:flex items-center gap-3">
          {/* AI Vibe Matcher */}
          <button
            onClick={onOpenAiMatcher}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition backdrop-blur-sm"
            id="nav-ai-concierge-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>AI Concierge</span>
          </button>

          {/* Trivia Quiz */}
          <button
            onClick={onOpenTrivia}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition"
            id="nav-trivia-btn"
          >
            <HelpCircle className="w-3.5 h-3.5 text-red-400" />
            <span>Trivia</span>
          </button>

          {/* Upgrade Pass */}
          <button
            onClick={onOpenSubscription}
            className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition shadow-lg shadow-red-600/30"
            title="Subscription Pass"
            id="nav-subscription-btn"
          >
            <Crown className="w-4 h-4 fill-white" />
          </button>

          {/* Profile Switcher */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1 rounded-full border border-white/20 hover:border-red-600 transition"
            id="nav-profile-btn"
            title="Profile & Settings"
          >
            <img
              src={currentProfile.avatarUrl}
              alt={currentProfile.name}
              className="w-7 h-7 rounded-full object-cover"
            />
          </button>
        </div>

        {/* Mobile menu button */}
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
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              placeholder="Search movies & TV..."
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              className="w-full bg-white/10 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <button
              onClick={() => { onOpenAiMatcher(); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-red-600 font-bold text-white flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> AI Concierge
            </button>
            <button
              onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-200 flex items-center justify-center gap-1.5"
            >
              <User className="w-4 h-4" /> Account
            </button>
            <button
              onClick={() => { onOpenWatchlist(); setMobileMenuOpen(false); }}
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
