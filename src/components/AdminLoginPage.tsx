import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  MessageCircle,
  Send,
  BookOpen,
  Video,
  Globe,
  Activity,
  ArrowRight,
  ChevronRight,
  Copy,
  Check,
  Settings,
  Sparkles,
  Smartphone,
  Server
} from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: (userRole: string, email: string) => void;
  onReturnToUserSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onReturnToUserSite
}) => {
  // Login Form States
  const [email, setEmail] = useState('admin@cineverse.com');
  const [password, setPassword] = useState('••••••••••••');
  const [masterKey, setMasterKey] = useState('MASTER_KEY_2026');
  const [otp2FA, setOtp2FA] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'Owner' | 'Super Admin' | 'Admin' | 'Content Manager' | 'Movie Manager' | 'Series Manager' | 'Moderator' | 'Support' | 'Analytics Manager'>('Super Admin');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Configurable Support Settings
  const [supportConfig, setSupportConfig] = useState({
    whatsappUrl: 'https://wa.me/18005550199?text=Hello%20Cineverse%20Admin%20Support',
    telegramUrl: 'https://t.me/cineverse_admin_support',
    supportEmail: 'support@cineverse.com',
    officialWebsiteUrl: 'https://cineverse.io',
    docsUrl: 'https://docs.cineverse.io/cms',
    tutorialsUrl: 'https://tutorials.cineverse.io',
    versionNumber: 'v2026.7.25-Enterprise-v2.5',
    lastUpdate: 'July 25, 2026 (Build #88201)',
  });

  const [isEditingSettings, setIsEditingSettings] = useState(false);

  // Fetch Admin Settings if available
  useEffect(() => {
    const saved = localStorage.getItem('cineverse_admin_support_config');
    if (saved) {
      try {
        setSupportConfig(JSON.parse(saved));
      } catch (e) {
        /* fallback to default */
      }
    }
  }, []);

  const handleSaveSupportConfig = () => {
    localStorage.setItem('cineverse_admin_support_config', JSON.stringify(supportConfig));
    setIsEditingSettings(false);
    setSuccessMsg('Support contact links updated successfully!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter your corporate admin email and password.');
      return;
    }

    if (enable2FA && (!otp2FA || otp2FA.length < 6)) {
      setErrorMsg('Please enter a valid 6-digit 2FA authenticator code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, adminKey: masterKey, role: selectedRole, otp2FA })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('cineverse_admin_token', data.token);
        if (rememberMe) {
          localStorage.setItem('cineverse_admin_email', email);
        }
        setSuccessMsg(`🔐 CMS Access Granted as ${selectedRole}!`);
        setTimeout(() => {
          onLoginSuccess(selectedRole, email);
        }, 800);
      } else {
        setErrorMsg(data.error || 'Authentication failed. Invalid admin credentials.');
      }
    } catch (err) {
      setErrorMsg('Network error connecting to Admin Authentication Server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoQuickLogin = (role: typeof selectedRole, demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword('demo_pass_2026');
    setMasterKey('MASTER_KEY_2026');
    localStorage.setItem('cineverse_admin_token', `token_demo_${Date.now()}`);
    setSuccessMsg(`Authorized instantly as ${role}`);
    setTimeout(() => {
      onLoginSuccess(role, demoEmail);
    }, 500);
  };

  const copySupportEmail = () => {
    navigator.clipboard.writeText(supportConfig.supportEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-white flex flex-col justify-between font-sans relative overflow-x-hidden selection:bg-red-600 selection:text-white">
      
      {/* Background Animated Ambient Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white font-black flex items-center justify-center text-xl shadow-lg shadow-red-600/40 ring-1 ring-white/20">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wider uppercase bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                CINEVERSE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-[10px] font-black tracking-widest uppercase shadow-inner">
                ENTERPRISE CMS
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 tracking-wide">Internal Content & Infrastructure Management Console</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* SSL Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SSL TLS 1.3 Protected</span>
          </div>

          <button
            onClick={onReturnToUserSite}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-bold transition flex items-center gap-2 group backdrop-blur-md"
          >
            <span>Exit to Streaming App</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Main Container - 2 Column Split Layout */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* ==================================================================== */}
        {/* LEFT COLUMN: AUTHENTICATION FORM                                     */}
        {/* ==================================================================== */}
        <div className="lg:col-span-7 bg-[#0d0f16]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600" />
          
          <div className="space-y-6">
            
            {/* Header Title */}
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-extrabold uppercase tracking-widest mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                  <span>Restricted Access Console</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Welcome Back, Admin
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Enter your enterprise identity credentials to access the internal CMS portal.
                </p>
              </div>

              <div className="hidden sm:block p-3 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 text-center">
                <Lock className="w-6 h-6 text-red-500 mx-auto" />
                <span className="text-[9px] font-bold uppercase tracking-wider block mt-1 text-neutral-400">
                  AES-256
                </span>
              </div>
            </div>

            {/* Notification Messages */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-600/15 border border-red-600/30 text-red-300 text-xs font-bold flex items-center gap-3 animate-shake">
                <Shield className="w-5 h-5 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-600/15 border border-emerald-600/30 text-emerald-300 text-xs font-bold flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Role Switcher Pill Bar */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-neutral-300 block">
                Select CMS Personnel Role:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(['Owner', 'Super Admin', 'Admin', 'Movie Manager', 'Content Manager', 'Moderator', 'Support', 'Analytics Manager'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                      selectedRole === role
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Admin Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase text-neutral-300 tracking-wider flex items-center justify-between">
                  <span>Corporate Email Address</span>
                  <span className="text-[10px] text-neutral-400 font-normal">SSO Enabled</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@cineverse.com"
                    className="w-full bg-black/60 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-extrabold uppercase text-neutral-300 tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset instructions have been dispatched to your corporate email.')}
                    className="text-[11px] font-bold text-red-400 hover:text-red-300 transition hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black/60 border border-white/15 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-neutral-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Master Security Key */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase text-neutral-300 tracking-wider flex items-center justify-between">
                  <span>Master Security Key / Token</span>
                  <span className="text-[10px] text-emerald-400 font-bold">256-bit Key</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={masterKey}
                    onChange={(e) => setMasterKey(e.target.value)}
                    placeholder="MASTER_KEY_2026"
                    className="w-full bg-black/60 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* 2FA Authenticator Section Toggle */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-neutral-200">2-Factor Authentication (2FA)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnable2FA(!enable2FA)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                      enable2FA ? 'bg-indigo-600' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        enable2FA ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {enable2FA && (
                  <div className="space-y-1 pt-1 animate-fadeIn">
                    <label className="text-[10px] font-bold uppercase text-neutral-400">
                      Enter 6-Digit Authenticator Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp2FA}
                      onChange={(e) => setOtp2FA(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 882019"
                      className="w-full bg-black/80 border border-indigo-500/40 rounded-xl px-4 py-2 text-center text-sm font-mono tracking-widest text-indigo-300 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Remember Me & SSL Protection Label */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-black text-red-600 focus:ring-red-600"
                  />
                  <span>Remember Session token</span>
                </label>

                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  SSL Encrypted
                </span>
              </div>

              {/* Primary Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition shadow-xl shadow-red-600/30 uppercase tracking-widest flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Login to CMS Console ({selectedRole})</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Social / OAuth SSO Login Buttons */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider text-center">
                Enterprise Single Sign-On (SSO)
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDemoQuickLogin(selectedRole, `${selectedRole.toLowerCase().replace(/\s+/g, '')}@cineverse.com`)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/50 text-neutral-200 text-xs font-bold transition flex items-center justify-center gap-2 group"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google Workspace</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoQuickLogin(selectedRole, `ms.${selectedRole.toLowerCase().replace(/\s+/g, '')}@cineverse.com`)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 text-neutral-200 text-xs font-bold transition flex items-center justify-center gap-2 group"
                >
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  <span>Microsoft Entra ID</span>
                </button>
              </div>
            </div>

            {/* Quick Role Preset Access Bar */}
            <div className="pt-2">
              <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider mb-2 text-center">
                Fast Demo Login Presets
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoQuickLogin('Super Admin', 'admin@cineverse.com')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500 text-[10px] font-bold text-neutral-300 transition text-center"
                >
                  👑 Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoQuickLogin('Movie Manager', 'movies@cineverse.com')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500 text-[10px] font-bold text-neutral-300 transition text-center"
                >
                  🎬 Movie Mgr
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoQuickLogin('Content Manager', 'content@cineverse.com')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500 text-[10px] font-bold text-neutral-300 transition text-center"
                >
                  📺 Series Mgr
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoQuickLogin('Analytics Manager', 'analytics@cineverse.com')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500 text-[10px] font-bold text-neutral-300 transition text-center"
                >
                  📊 Analytics
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN: SUPPORT CENTER (GLASSMORPHISM PANEL)                    */}
        {/* ==================================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
          
          {/* Glowing Glass Corner Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Title & Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>24/7 Operations Duty</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-red-500" />
                Need Help?
              </h2>
              <p className="text-xs text-neutral-400">
                Enterprise Support & CMS Technical Operations
              </p>
            </div>

            <button
              onClick={() => setIsEditingSettings(!isEditingSettings)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition"
              title="Configure Support Links"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Configurable Links Editor Modal/Drawer inline */}
          {isEditingSettings && (
            <div className="p-4 rounded-2xl bg-black/90 border border-red-500/40 space-y-3 animate-fadeIn text-xs">
              <h3 className="font-extrabold text-white uppercase text-[11px] tracking-wider text-red-400">
                Configure Support Links (Admin Settings)
              </h3>
              
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400">WhatsApp Support URL:</label>
                  <input
                    type="text"
                    value={supportConfig.whatsappUrl}
                    onChange={(e) => setSupportConfig({ ...supportConfig, whatsappUrl: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400">Telegram Channel URL:</label>
                  <input
                    type="text"
                    value={supportConfig.telegramUrl}
                    onChange={(e) => setSupportConfig({ ...supportConfig, telegramUrl: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400">Support Email Address:</label>
                  <input
                    type="text"
                    value={supportConfig.supportEmail}
                    onChange={(e) => setSupportConfig({ ...supportConfig, supportEmail: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingSettings(false)}
                  className="px-3 py-1 rounded-lg bg-white/10 text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSupportConfig}
                  className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          )}

          {/* Support Channel Cards */}
          <div className="space-y-3">
            
            {/* 🟢 WhatsApp Support Card */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-500/50 transition-all group flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                  <MessageCircle className="w-5 h-5 fill-emerald-500/20" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white tracking-wide flex items-center gap-1.5">
                    WhatsApp Support
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h4>
                  <p className="text-[11px] text-emerald-200/70">Chat with Admin Support directly</p>
                </div>
              </div>

              <a
                href={supportConfig.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-1 shrink-0"
              >
                <span>Open WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 🔵 Telegram Support Card */}
            <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/20 hover:border-sky-500/50 transition-all group flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center shrink-0 shadow-inner">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white tracking-wide flex items-center gap-1.5">
                    Telegram Channel
                  </h4>
                  <p className="text-[11px] text-sky-200/70">Join Telegram Support Broadcast</p>
                </div>
              </div>

              <a
                href={supportConfig.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-black font-extrabold text-xs transition shadow-lg shadow-sky-500/20 flex items-center gap-1 shrink-0"
              >
                <span>Open Telegram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 📧 Email Support Card */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Email Operations Desk</h5>
                  <p className="text-[11px] font-mono text-neutral-300">{supportConfig.supportEmail}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={copySupportEmail}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-bold transition flex items-center gap-1"
                title="Copy Email"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Quick Resource Grid: Docs & Tutorials & Website */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={supportConfig.officialWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition flex items-center gap-2 text-neutral-200 font-bold"
              >
                <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate">Official Website</span>
              </a>

              <a
                href={supportConfig.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition flex items-center gap-2 text-neutral-200 font-bold"
              >
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">CMS Guide</span>
              </a>
            </div>

            <a
              href={supportConfig.tutorialsUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition flex items-center justify-between text-xs text-neutral-200 font-bold"
            >
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-red-400 shrink-0" />
                <span>Video Tutorials & Training Sessions</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </a>

          </div>

          {/* System Operational Badge & Footer Info */}
          <div className="pt-4 border-t border-white/10 space-y-2 text-[11px]">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>Live System Status</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-300 font-black uppercase">
                99.99% Uptime
              </span>
            </div>

            <div className="text-neutral-400 space-y-1 text-[10px] pt-1">
              <div className="flex justify-between">
                <span>Version Number:</span>
                <span className="font-mono text-neutral-300 font-bold">{supportConfig.versionNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Update:</span>
                <span className="text-neutral-300">{supportConfig.lastUpdate}</span>
              </div>
              <div className="text-center text-neutral-400 pt-2 font-mono">
                © 2026 CINEVERSE ENTERPRISE CMS • SECURE REGION US-EAST-1
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Footer System Strip */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 py-4 text-center text-[11px] text-neutral-400 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-neutral-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
          <span>Restricted Portal • Authorized Personnel Only • IP Logged & Monitored</span>
        </div>

        <div className="flex items-center gap-4 text-neutral-400 text-[10px]">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition">Security Protocols</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition">Terms of Service</a>
        </div>
      </footer>

    </div>
  );
};
