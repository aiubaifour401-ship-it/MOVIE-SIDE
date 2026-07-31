import React, { useState } from 'react';
import { Bell, Check, Film, Clock, CreditCard, Megaphone, X } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onSelectMovieById?: (movieId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onClearAll,
  onSelectMovieById,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'movie':
        return <Film className="w-4 h-4 text-red-500" />;
      case 'subscription':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      default:
        return <Megaphone className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition relative"
        title="Notifications"
        id="nav-notification-bell-btn"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-[#0c0d12] border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-150 text-white">
          <div className="p-3.5 bg-[#12141a] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-red-500" />
              <span className="text-xs font-black uppercase tracking-wider">Notification Center</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px]">
              <button onClick={onClearAll} className="text-neutral-400 hover:text-white transition">
                Clear All
              </button>
              <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onMarkAsRead(item.id);
                    if (item.linkMovieId && onSelectMovieById) {
                      onSelectMovieById(item.linkMovieId);
                    }
                  }}
                  className={`p-3.5 hover:bg-white/5 transition cursor-pointer flex gap-3 ${
                    !item.read ? 'bg-red-600/5' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 h-fit">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                      <span className="text-[9px] text-neutral-500 font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-snug">{item.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-neutral-500 space-y-1">
                <Bell className="w-8 h-8 text-neutral-600 mx-auto" />
                <p>No notifications right now.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
