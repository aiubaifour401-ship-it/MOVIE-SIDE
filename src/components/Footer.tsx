import React from 'react';
import { Film, Sparkles, Heart, Shield, Tv, Wifi } from 'lucide-react';
import { FilterState } from '../types';

interface FooterProps {
  onFilterChange: (updated: Partial<FilterState>) => void;
  onOpenAiMatcher: () => void;
  onOpenTrivia: () => void;
  onOpenSubscription?: () => void;
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onFilterChange,
  onOpenAiMatcher,
  onOpenTrivia,
  onOpenSubscription,
  onNavigateToAdmin,
}) => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 text-neutral-400 text-xs mt-16">
      
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <span className="text-2xl font-black text-red-600 tracking-tighter">
              CINEVERSE PRO
            </span>
            <p className="text-neutral-400 text-xs leading-relaxed">
              The premier enterprise OTT streaming platform for cinema purists. Stream iconic blockbusters, indie award-winners, and 4K Ultra HD originals with Dolby Atmos sound.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Popular Genres</h4>
            <ul className="space-y-1.5">
              {['Sci-Fi', 'Action', 'Drama', 'Thriller', 'Animation'].map((g) => (
                <li key={g}>
                  <button
                    onClick={() => onFilterChange({ selectedGenre: g, category: 'all' })}
                    className="hover:text-red-400 transition"
                  >
                    {g} Masterpieces
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Collections */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Curated Hubs</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onFilterChange({ category: 'trending' })} className="hover:text-red-400 transition">
                  Trending TV Series
                </button>
              </li>
              <li>
                <button onClick={() => onFilterChange({ category: 'top_rated' })} className="hover:text-red-400 transition">
                  Top Rated Masterpieces
                </button>
              </li>
              <li>
                <button onClick={() => onFilterChange({ category: 'oscar_winners' })} className="hover:text-red-400 transition">
                  Academy Award Winners
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: AI & Subscription */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Next-Gen Features</h4>
            <div className="space-y-2">
              <button
                onClick={onOpenAiMatcher}
                className="w-full py-2 px-3 rounded-xl bg-red-600/20 border border-red-600/40 text-red-400 font-bold hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                <span>AI Movie Concierge</span>
              </button>

              <button
                onClick={onOpenTrivia}
                className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-neutral-200 font-semibold hover:bg-white/10 transition"
              >
                Cinephile Trivia Challenge
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Sub-Footer / Activity Bar */}
      <div className="bg-[#0b0c10] border-t border-white/10 py-3.5 px-4 sm:px-8 text-[11px] text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-white font-bold">
              <Tv className="w-3.5 h-3.5 text-red-500" />
              <span>Available in 4K HDR</span>
            </span>
            <span>•</span>
            <span className="text-neutral-300 font-medium">Dolby Atmos Ready</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono font-bold">Version 2.4.0-pro</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="px-2.5 py-1 rounded bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/40 text-[11px] font-extrabold transition flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                <span>Admin Portal</span>
              </button>
            )}
            <a href="#" className="hover:text-white transition">Support</a>
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <span className="text-neutral-600">© {new Date().getFullYear()} CINEVERSE PRO OTT</span>
          </div>

        </div>
      </div>

    </footer>
  );
};
