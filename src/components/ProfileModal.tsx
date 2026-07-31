import React, { useState } from 'react';
import { X, Plus, Shield, Check, Lock, Sparkles, Edit3 } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  currentProfile: UserProfile;
  onSelectProfile: (profile: UserProfile) => void;
  onCreateProfile: (profile: UserProfile) => void;
}

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&auto=format&fit=crop',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profiles,
  currentProfile,
  onSelectProfile,
  onCreateProfile,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [isKids, setIsKids] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    const newProf: UserProfile = {
      id: `prof-${Date.now()}`,
      name: newProfileName.trim(),
      avatarUrl: selectedAvatar,
      isKids: isKids,
    };

    onCreateProfile(newProf);
    onSelectProfile(newProf);
    setNewProfileName('');
    setIsAdding(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0b0c10] rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-10 text-white space-y-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAdding ? (
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded-full font-black text-xs uppercase tracking-widest">
                CINEVERSE PROFILES
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">Who's Watching?</h2>
              <p className="text-xs text-neutral-400">Switch profiles to customize recommendations, My List & Continue Watching</p>
            </div>

            {/* Profile Cards Grid */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              {profiles.map((prof) => {
                const isSelected = prof.id === currentProfile.id;

                return (
                  <div
                    key={prof.id}
                    onClick={() => {
                      onSelectProfile(prof);
                      onClose();
                    }}
                    className="group cursor-pointer space-y-3 flex flex-col items-center"
                  >
                    <div
                      className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 transition-all duration-300 group-hover:scale-105 group-hover:border-red-600 shadow-2xl ${
                        isSelected ? 'border-red-600 ring-4 ring-red-600/30' : 'border-white/10'
                      }`}
                    >
                      <img src={prof.avatarUrl} alt={prof.name} className="w-full h-full object-cover" />
                      {prof.isKids && (
                        <div className="absolute top-2 right-2 bg-purple-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded uppercase">
                          KIDS
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute bottom-2 right-2 bg-red-600 text-white p-1 rounded-full shadow">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <h3 className={`text-sm sm:text-base font-bold transition ${isSelected ? 'text-red-400 font-extrabold' : 'text-neutral-300 group-hover:text-white'}`}>
                        {prof.name}
                      </h3>
                      {prof.isKids && <span className="text-[10px] text-purple-400 block font-semibold">Kids Safe Mode</span>}
                    </div>
                  </div>
                );
              })}

              {/* Add Profile Button */}
              <div
                onClick={() => setIsAdding(true)}
                className="group cursor-pointer space-y-3 flex flex-col items-center"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-red-600 group-hover:bg-red-600/10 transition-all duration-300">
                  <Plus className="w-10 h-10" />
                </div>
                <span className="text-sm font-bold text-neutral-400 group-hover:text-white">Add Profile</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-6 max-w-lg mx-auto">
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-black text-white uppercase">Create New Profile</h3>
              <p className="text-xs text-neutral-400">Add a profile for another viewer in your household.</p>
            </div>

            {/* Avatar Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-neutral-300 uppercase">Choose Avatar</span>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {AVATARS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Avatar ${idx}`}
                    onClick={() => setSelectedAvatar(url)}
                    className={`w-14 h-14 rounded-xl object-cover cursor-pointer border-2 transition ${
                      selectedAvatar === url ? 'border-red-600 ring-2 ring-red-600/50 scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Profile Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300 uppercase">Profile Name</label>
              <input
                type="text"
                placeholder="e.g. John / Sarah"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                required
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
              />
            </div>

            {/* Kids Mode Toggle */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-purple-400 uppercase block">Kids Mode</span>
                <p className="text-[11px] text-neutral-400">Restricts titles to age PG-13 & below.</p>
              </div>
              <input
                type="checkbox"
                checked={isKids}
                onChange={(e) => setIsKids(e.target.checked)}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-neutral-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-black text-white uppercase shadow-lg shadow-red-600/30"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
