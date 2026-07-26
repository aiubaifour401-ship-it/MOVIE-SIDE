import React from 'react';
import { Lock, ShieldAlert, Calendar, RefreshCw, LogOut, Phone, Mail, HelpCircle } from 'lucide-react';

interface SubscriptionExpiredScreenProps {
  expiredInfo?: {
    username?: string;
    subscriptionExpiryDate?: string;
    message?: string;
  };
  onLogOut: () => void;
  onOpenAdminPortal?: () => void;
}

export const SubscriptionExpiredScreen: React.FC<SubscriptionExpiredScreenProps> = ({
  expiredInfo,
  onLogOut,
  onOpenAdminPortal,
}) => {
  const expiryDate = expiredInfo?.subscriptionExpiryDate || '25 August 2026';
  const username = expiredInfo?.username || 'user001';

  return (
    <div className="min-h-screen bg-[#07080b] text-white flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Red Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between py-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white font-black flex items-center justify-center text-xl shadow-lg shadow-red-600/40 border border-red-400/30">
            C
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest uppercase text-white">CINEVERSE OTT</h1>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Subscription Billing Control</p>
          </div>
        </div>

        {onOpenAdminPortal && (
          <button
            onClick={onOpenAdminPortal}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-red-500" />
            <span>Admin Portal</span>
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="max-w-lg w-full mx-auto bg-[#0d0e14]/95 backdrop-blur-2xl border border-red-600/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 my-auto text-center relative z-10">
        
        <div className="w-20 h-20 rounded-3xl bg-red-600/20 border-2 border-red-600/50 text-red-500 flex items-center justify-center mx-auto shadow-inner animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>ACCESS RESTRICTED</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Subscription Expired</h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Your Cineverse OTT streaming plan has ended and requires renewal before streaming access can resume.
          </p>
        </div>

        {/* Account Details Box */}
        <div className="bg-black/60 border border-white/10 rounded-2xl p-4 text-left space-y-3">
          <div className="flex items-center justify-between text-xs pb-2.5 border-b border-white/10">
            <span className="text-neutral-400 uppercase font-extrabold text-[10px]">Subscriber Username</span>
            <span className="text-white font-mono font-bold bg-white/5 px-2.5 py-0.5 rounded border border-white/10">{username}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 uppercase font-extrabold text-[10px] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-red-400" />
              <span>Expiry Date</span>
            </span>
            <span className="text-red-400 font-extrabold">{expiryDate}</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-red-950/20 border border-red-600/30 rounded-2xl p-4 text-xs text-neutral-300 text-left space-y-2">
          <p className="font-bold text-white flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>How to Renew Your Subscription:</span>
          </p>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-neutral-300 pl-1">
            <li>Contact your platform administrator or account provider.</li>
            <li>Request a subscription extension or new activation code.</li>
            <li>Once extended in the Admin CMS, refresh this page to resume watching.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl transition shadow-lg shadow-red-600/40 uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Check Subscription Renewal</span>
          </button>

          <button
            onClick={onLogOut}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-extrabold text-xs rounded-xl border border-white/10 transition uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-neutral-400" />
            <span>Sign In with Different Account</span>
          </button>
        </div>

      </div>

      <div className="text-center text-[11px] text-neutral-500 relative z-10">
        © 2026 CINEVERSE ENTERPRISE OTT • BILLING & SUBSCRIPTION CONTROL SYSTEM
      </div>
    </div>
  );
};
