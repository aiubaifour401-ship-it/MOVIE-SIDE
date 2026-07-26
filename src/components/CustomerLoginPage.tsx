import React, { useState } from 'react';
import { Lock, Shield, User, Key, AlertCircle, Play, Sparkles, CheckCircle2 } from 'lucide-react';

interface CustomerLoginPageProps {
  onLoginSuccess: (userData: any, token: string) => void;
  onShowExpiredScreen: (expiryInfo: any) => void;
  onOpenAdminPortal?: () => void;
}

export const CustomerLoginPage: React.FC<CustomerLoginPageProps> = ({
  onLoginSuccess,
  onShowExpiredScreen,
  onOpenAdminPortal,
}) => {
  const [username, setUsername] = useState('user001');
  const [password, setPassword] = useState('Password123!');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/user-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          deviceName: navigator.userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop Browser (Chrome)',
        }),
      });

      const data = await res.json();

      if (res.status === 403 && data.expired) {
        onShowExpiredScreen({
          username: data.username || username,
          subscriptionExpiryDate: data.subscriptionExpiryDate,
          message: data.message,
        });
        return;
      }

      if (!res.ok) {
        setErrorMsg(data.error || data.message || 'Authentication failed. Check credentials.');
        return;
      }

      // Login success!
      localStorage.setItem('cineverse_user_token', data.token);
      localStorage.setItem('cineverse_user_data', JSON.stringify(data.user));
      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setErrorMsg('Network error connecting to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoUser = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between py-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white font-black flex items-center justify-center text-xl shadow-lg shadow-red-600/40 border border-red-500/30">
            C
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest uppercase text-white flex items-center gap-2">
              <span>CINEVERSE</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">ULTRA 4K</span>
            </h1>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Subscriber Streaming Portal</p>
          </div>
        </div>

        {onOpenAdminPortal && (
          <button
            onClick={onOpenAdminPortal}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-600/20 text-neutral-300 hover:text-white border border-white/10 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-red-500" />
            <span>Admin Portal</span>
          </button>
        )}
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-[#0d0e12]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto relative z-10">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600/20 to-red-900/30 border border-red-600/40 text-red-500 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Subscriber Sign In</h2>
          <p className="text-xs text-neutral-400">
            Enter your admin-provided credentials to access streaming catalog
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-600/15 border border-red-600/40 text-red-300 text-xs font-medium flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase text-neutral-300 tracking-wider flex items-center justify-between">
              <span>Username or Account Email</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. user001"
                className="w-full bg-black/70 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase text-neutral-300 tracking-wider flex items-center justify-between">
              <span>Account Password</span>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black/70 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl transition shadow-lg shadow-red-600/30 uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Start Streaming</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Account Shortcuts for Fast Testing */}
        <div className="pt-3 border-t border-white/10 space-y-2 text-center">
          <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Admin Demo Account Credentials</span>
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => fillDemoUser('user001', 'Password123!')}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/60 text-neutral-300 hover:text-white font-bold transition text-left space-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-extrabold">Active Sub</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="text-white">user001</div>
              <div className="text-[9px] text-neutral-400">Pass: Password123!</div>
              <div className="text-[9px] text-neutral-500">Expires: 25 Aug 2026</div>
            </button>

            <button
              type="button"
              onClick={() => fillDemoUser('expired_user', 'Password123!')}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/60 text-neutral-300 hover:text-white font-bold transition text-left space-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-red-400 font-extrabold">Expired Sub</span>
                <Lock className="w-3 h-3 text-red-400" />
              </div>
              <div className="text-white">expired_user</div>
              <div className="text-[9px] text-neutral-400">Pass: Password123!</div>
              <div className="text-[9px] text-neutral-500">Expired Demo</div>
            </button>
          </div>
        </div>

      </div>

      {/* Footer copyright */}
      <div className="text-center text-[11px] text-neutral-500 relative z-10">
        © 2026 CINEVERSE ENTERPRISE OTT • PROTECTED SINGLE DEVICE SESSION STREAMING
      </div>
    </div>
  );
};
