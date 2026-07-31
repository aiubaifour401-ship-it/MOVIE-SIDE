import React, { useState, useEffect } from 'react';
import {
  Lock,
  Shield,
  User,
  Key,
  AlertCircle,
  Play,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  Send,
  ExternalLink,
  Mail,
  Copy,
  Check,
  Globe,
  BookOpen,
  Video,
  ChevronRight,
  Activity,
  Settings,
  ArrowRight
} from 'lucide-react';

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
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  // Configurable Support Settings for Subscribers
  const [supportConfig, setSupportConfig] = useState({
    whatsappUrl: 'https://wa.me/18005550199?text=Hello%20Cineverse%20Subscriber%20Support',
    telegramUrl: 'https://t.me/cineverse_admin_support',
    supportEmail: 'support@cineverse.com',
    officialWebsiteUrl: 'https://cineverse.io',
    docsUrl: 'https://docs.cineverse.io/subscriber',
    tutorialsUrl: 'https://tutorials.cineverse.io',
    versionNumber: 'v2026.7.25-Enterprise-v2.5',
    lastUpdate: 'July 25, 2026 (Build #88201)',
  });

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
  };

  const loginWithCredentials = async (usr: string, pwd: string) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/user-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usr,
          password: pwd,
          deviceName: navigator.userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop Browser (Chrome)',
        }),
      });

      const data = await res.json();

      if (res.status === 403 && data.expired) {
        onShowExpiredScreen({
          username: data.username || usr,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithCredentials(username, password);
  };

  const fillDemoUser = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMsg(null);
  };

  const [activeTab, setActiveTab] = useState<'signin' | 'otp_login' | 'signup'>('signin');

  // Phone OTP States
  const [otpPhone, setOtpPhone] = useState('+1 (555) 019-2831');
  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [serverOtpInfo, setServerOtpInfo] = useState<{ code: string; message: string } | null>(null);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState<string | null>(null);

  // Profile Management States (Phone & Details)
  const [profileName, setProfileName] = useState('Alex Subscriber');
  const [profilePhone, setProfilePhone] = useState('+1 (555) 019-2831');
  const [profileEmail, setProfileEmail] = useState('alex.cineverse@example.com');
  const [profileAvatar, setProfileAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop');
  const [profileUpdatedNotice, setProfileUpdatedNotice] = useState<string | null>(null);

  const copySupportEmail = () => {
    navigator.clipboard.writeText(supportConfig.supportEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendOtpCode = async () => {
    setErrorMsg(null);
    setOtpSuccessMsg(null);
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: otpPhone }),
      });
      const data = await res.json();
      if (res.ok) {
        setServerOtpInfo({ code: data.generatedCode, message: data.message });
        setOtpSuccessMsg(`6-digit OTP code sent to ${otpPhone}! (Generated Server Code: ${data.generatedCode})`);
      } else {
        setErrorMsg(data.error || 'Failed to send OTP code.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to server for OTP request.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: otpPhone,
          otp: otpCodeInput,
          deviceName: navigator.userAgent.includes('Mobile') ? 'Mobile Device (SMS OTP)' : 'Desktop Browser (SMS OTP)',
        }),
      });

      const data = await res.json();

      if (res.status === 403 && data.expired) {
        onShowExpiredScreen({
          username: data.username || otpPhone,
          subscriptionExpiryDate: data.subscriptionExpiryDate,
          message: data.message,
        });
        return;
      }

      if (!res.ok) {
        setErrorMsg(data.error || 'OTP verification failed. Check code.');
        return;
      }

      localStorage.setItem('cineverse_user_token', data.token);
      localStorage.setItem('cineverse_user_data', JSON.stringify(data.user));
      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setErrorMsg('Network error verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfileDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/v1/user/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'user001',
          name: profileName,
          phone: profilePhone,
          email: profileEmail,
          avatarUrl: profileAvatar
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileUpdatedNotice('✅ Profile details and phone number updated successfully!');
        setTimeout(() => setProfileUpdatedNotice(null), 3000);
      }
    } catch (e) {
      setProfileUpdatedNotice('❌ Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-x-hidden">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Top Header with Sign In & Sign Up buttons */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-2 relative z-10">
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

        {/* Top Header Navigation Bar */}
        <div className="flex items-center gap-2">
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('signin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'signin' ? 'bg-red-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Password Login</span>
            </button>
            <button
              onClick={() => setActiveTab('otp_login')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'otp_login' ? 'bg-red-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>SMS OTP Login</span>
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'signup' ? 'bg-red-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
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
      </header>

      {/* Main Container - 2 Column Split Layout */}
      <main className="relative z-10 max-w-7xl w-full mx-auto py-6 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ==================================================================== */}
        {/* LEFT COLUMN: SUBSCRIBER LOGIN & SIGN UP CARD                         */}
        {/* ==================================================================== */}
        <div className="lg:col-span-7 bg-[#0d0e12]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
          
          {/* Tab Selection */}
          <div className="grid grid-cols-3 gap-2 bg-black/50 p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
                activeTab === 'signin'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('otp_login')}
              className={`py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
                activeTab === 'otp_login'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>SMS OTP Login</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
                activeTab === 'signup'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sign Up</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-600/15 border border-red-600/40 text-red-300 text-xs font-medium flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'signin' && (
            <>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600/20 to-red-900/30 border border-red-600/40 text-red-500 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Subscriber Sign In</h2>
                <p className="text-xs text-neutral-400">
                  Enter your subscriber credentials to watch movies & live stream
                </p>
              </div>

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
            </>
          )}

          {activeTab === 'otp_login' && (
            <div className="space-y-4">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white">Phone OTP Authentication</h2>
                <p className="text-xs text-neutral-300">
                  Receive a secure 6-digit OTP code on your phone to log in instantly.
                </p>
              </div>

              {/* How Server Matching Works Explanation Box */}
              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 space-y-1.5">
                <div className="font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  <span>How Server OTP Matching Works:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-200/80">
                  1. Server generates a cryptographically random 6-digit code and stores it in server memory linked to your phone number with a 5-minute expiration timestamp.<br/>
                  2. When you input the code, the server compares your input with the saved memory code. If it matches before expiry, session token is issued!
                </p>
              </div>

              {otpSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{otpSuccessMsg}</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                    Mobile Phone Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value)}
                      placeholder="+1 (555) 019-2831 or +8801700000000"
                      className="flex-1 bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtpCode}
                      disabled={loading}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition shrink-0"
                    >
                      Send OTP
                    </button>
                  </div>
                </div>

                {serverOtpInfo && (
                  <form onSubmit={handleVerifyOtpCode} className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex justify-between">
                        <span>Enter Received 6-Digit OTP Code</span>
                        <span className="text-amber-400">Sent Code: {serverOtpInfo.code}</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCodeInput}
                        onChange={(e) => setOtpCodeInput(e.target.value)}
                        placeholder="e.g. 849201"
                        className="w-full bg-black/80 border border-emerald-500/50 rounded-xl px-4 py-2.5 text-center text-lg tracking-widest font-mono text-emerald-300 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Verify Code & Stream Now</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'signup' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-900/30 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">New Subscriber Registration</h2>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-md mx-auto">
                Subscriber accounts are managed directly by Administrators to prevent account sharing and enforce device limits.
              </p>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-left">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">How to get your account:</h4>
                <ul className="text-xs text-neutral-300 space-y-2 list-disc list-inside">
                  <li>Contact support using <strong className="text-emerald-400">WhatsApp</strong> or <strong className="text-sky-400">Telegram</strong> on the right side panel.</li>
                  <li>Our support team will generate your personalized username and password instantly.</li>
                  <li>Once received, click <strong className="text-white">"Sign In"</strong> above to access 4K Ultra HD movies & live streams!</li>
                </ul>
              </div>

              <div className="pt-2">
                <a
                  href={supportConfig.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/30 uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Request Account via WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Demo Account Shortcuts for Fast Testing */}
          <div className="pt-3 border-t border-white/10 space-y-2 text-center">
            <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Instant Test Subscriber Demo Credentials</span>
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => {
                  fillDemoUser('user001', 'Password123!');
                  loginWithCredentials('user001', 'Password123!');
                }}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/60 text-neutral-300 hover:text-white font-bold transition text-left space-y-0.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-extrabold group-hover:underline">1-Click Login</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="text-white">user001 (Active)</div>
                <div className="text-[9px] text-neutral-400">Pass: Password123!</div>
                <div className="text-[9px] text-emerald-400/80">Expires: 25 Aug 2026</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  fillDemoUser('expired_user', 'Password123!');
                  loginWithCredentials('expired_user', 'Password123!');
                }}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/60 text-neutral-300 hover:text-white font-bold transition text-left space-y-0.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-red-400 font-extrabold group-hover:underline">1-Click Test</span>
                  <Lock className="w-3 h-3 text-red-400" />
                </div>
                <div className="text-white">expired_user</div>
                <div className="text-[9px] text-neutral-400">Pass: Password123!</div>
                <div className="text-[9px] text-red-400/80">Expired Screen Test</div>
              </button>
            </div>
          </div>

        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN: SUBSCRIPTION DETAILS & PROFILE PHONE MANAGEMENT         */}
        {/* ==================================================================== */}
        <div className="lg:col-span-5 space-y-6">

          {/* Active Subscription Details Card */}
          <div className="bg-gradient-to-b from-red-950/40 to-[#0d0e12] backdrop-blur-2xl border border-red-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-500" />
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Subscription Status</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ACTIVE STREAMING</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <p className="text-[10px] text-neutral-400 font-bold uppercase">Plan Type</p>
                <p className="font-extrabold text-white">4K Ultra HD VIP Plan</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <p className="text-[10px] text-neutral-400 font-bold uppercase">Expires On</p>
                <p className="font-extrabold text-emerald-400">August 25, 2026</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <p className="text-[10px] text-neutral-400 font-bold uppercase">Remaining Access</p>
                <p className="font-extrabold text-amber-400">25 Days Left</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <p className="text-[10px] text-neutral-400 font-bold uppercase">Max Active Devices</p>
                <p className="font-extrabold text-white">1 Device Screen</p>
              </div>
            </div>
          </div>

          {/* Profile Details & Phone Number Management */}
          <div className="bg-[#0d0e12]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <User className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Subscriber Profile & Phone</h3>
                <p className="text-[10px] text-neutral-400">Update your phone number and profile settings</p>
              </div>
            </div>

            {profileUpdatedNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                {profileUpdatedNotice}
              </div>
            )}

            <form onSubmit={handleUpdateProfileDetails} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-300 uppercase">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-300 uppercase">Phone Number (For OTP Login)</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none text-emerald-300 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-300 uppercase">Account Email</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-extrabold text-xs rounded-xl transition uppercase tracking-wider"
              >
                Save Profile & Phone Changes
              </button>
            </form>
          </div>

          {/* Support Channel Cards */}
          <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-red-500" />
                <span>24/7 Subscriber Support Desk</span>
              </h3>
            </div>

            <div className="space-y-2">
              <a
                href={supportConfig.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500 transition flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="font-bold text-white">WhatsApp Support</p>
                    <p className="text-[10px] text-emerald-300">Instant renewal & account support</p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </a>

              <a
                href={supportConfig.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/30 hover:border-sky-500 transition flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4 text-sky-400" />
                  <div>
                    <p className="font-bold text-white">Telegram Desk</p>
                    <p className="text-[10px] text-sky-300">Join official update channel</p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              </a>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Email Help Desk</h5>
                    <p className="text-[10px] font-mono text-neutral-300">{supportConfig.supportEmail}</p>
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
            </div>

            {/* System Operational Badge */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2 font-extrabold">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>Streaming Service Status</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-300 font-black uppercase">
                99.99% Operational
              </span>
            </div>
          </div>

        </div>

      </main>

      {/* Footer copyright */}
      <footer className="text-center text-[11px] text-neutral-500 relative z-10 py-2">
        © 2026 CINEVERSE ENTERPRISE OTT • PROTECTED SINGLE DEVICE SESSION STREAMING
      </footer>
    </div>
  );
};

