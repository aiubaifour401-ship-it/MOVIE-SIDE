import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Lock,
  ShieldCheck,
  Smartphone,
  Key,
  Mail,
  Check,
  LogOut,
  Sparkles,
  AlertCircle,
  Phone,
  Clock,
  HardDrive,
  Trash2,
  Shield,
  RefreshCw,
  Copy,
  Download,
  CheckCircle2,
  Globe,
  Tv,
  Tablet,
  Laptop,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  Sliders,
  Bell
} from 'lucide-react';
import { UserProfile, UserDevice, UserSecurityLog, DownloadItem } from '../types';
export type { UserProfile };

interface AuthAndProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSelectProfile: (profile: UserProfile) => void;
  isLoggedIn: boolean;
  onToggleLogin: (status: boolean) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop',
];

const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'p1',
    name: 'Alex (Master)',
    nickname: 'CineMaster',
    bio: 'Sci-Fi & Nolan enthusiast. 4K Ultra HD streamer.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
    isKids: false,
    preferredLanguage: 'English',
    preferredAudioLanguage: 'English Dolby Atmos',
    preferredSubtitleLanguage: 'English CC',
    autoplayTrailers: true,
    autoplayNextEpisode: true,
  },
  {
    id: 'p2',
    name: 'Elena (Kids)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop',
    isKids: true,
    pinRequired: true,
    pinCode: '1234',
    preferredLanguage: 'English',
    autoplayTrailers: false,
    autoplayNextEpisode: true,
  },
  {
    id: 'p3',
    name: 'Cinema Fan',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
    isKids: false,
    preferredLanguage: 'English',
    autoplayTrailers: true,
    autoplayNextEpisode: true,
  },
];

const INITIAL_DOWNLOADS: DownloadItem[] = [
  {
    id: 'dl_1',
    movieId: 'dune-part-two',
    title: 'Dune: Part Two (2024)',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop',
    fileSizeMb: 6800,
    downloadedAt: 'Yesterday, 10:14 PM',
    quality: '4K HDR',
  },
  {
    id: 'dl_2',
    movieId: 'interstellar',
    title: 'Interstellar (2014)',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop',
    fileSizeMb: 4200,
    downloadedAt: '3 days ago',
    quality: '1080p',
  },
];

export const AuthAndProfileModal: React.FC<AuthAndProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSelectProfile,
  isLoggedIn,
  onToggleLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'auth' | 'profiles' | 'sessions' | 'security' | 'downloads'>('auth');
  const [authMode, setAuthMode] = useState<'signin' | 'register' | 'otp' | 'forgot' | 'verify_email'>('signin');

  // Registration Form States
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+1 (555) 019-2831');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCountry, setRegCountry] = useState('United States');
  const [regDob, setRegDob] = useState('1998-04-12');
  const [regGender, setRegGender] = useState('Prefer not to say');
  const [regLanguage, setRegLanguage] = useState('English');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [acceptPrivacy, setAcceptPrivacy] = useState(true);
  const [newsletter, setNewsletter] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In States
  const [loginEmail, setLoginEmail] = useState('alex.cinephile@example.com');
  const [loginPassword, setLoginPassword] = useState('SuperSecret123!');
  const [rememberMe, setRememberMe] = useState(true);

  // Verification & Phone OTP States
  const [emailCodeInput, setEmailCodeInput] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [phoneOtpInput, setPhoneOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);

  // Profiles State
  const [profilesList, setProfilesList] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileIsKids, setNewProfileIsKids] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [pinInput, setPinInput] = useState('');
  const [pendingKidProfile, setPendingKidProfile] = useState<UserProfile | null>(null);
  const [pinError, setPinError] = useState(false);

  // Sessions & Security
  const [devices, setDevices] = useState<UserDevice[]>([]);
  const [securityLogs, setSecurityLogs] = useState<UserSecurityLog[]>([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([
    'A8X9-2910', 'B7C1-8842', 'E4F2-9012', 'G9H0-1123',
    'K3M4-7712', 'P8Q9-3341', 'R2S3-5590', 'V1W2-8810'
  ]);
  const [copiedRecovery, setCopiedRecovery] = useState(false);

  // Downloads State
  const [downloads, setDownloads] = useState<DownloadItem[]>(INITIAL_DOWNLOADS);

  // General Notification
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password strength criteria
  const hasLength = regPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(regPassword);
  const hasLower = /[a-z]/.test(regPassword);
  const hasNumber = /[0-9]/.test(regPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(regPassword);
  const strengthScore = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
      fetchSecurityLogs();
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/v1/auth/sessions');
      if (res.ok) {
        const data = await res.json();
        setDevices(data.sessions);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSecurityLogs = async () => {
    try {
      const res = await fetch('/api/v1/user/security-logs');
      if (res.ok) {
        const data = await res.json();
        setSecurityLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  // Auth Submit Handlers
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      showToast('❌ Passwords do not match!');
      return;
    }
    if (strengthScore < 3) {
      showToast('❌ Please choose a stronger password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: regFirstName,
          lastName: regLastName,
          username: regUsername,
          email: regEmail,
          phone: regPhone,
          password: regPassword,
          country: regCountry,
          dateOfBirth: regDob,
          gender: regGender,
          language: regLanguage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onToggleLogin(true);
        showToast('🎉 Account registered successfully! Verification code sent.');
        setAuthMode('verify_email');
      } else {
        showToast(`❌ ${data.error || 'Registration failed'}`);
      }
    } catch (err: any) {
      showToast('❌ Error connecting to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      if (res.ok) {
        onToggleLogin(true);
        showToast('🔑 Logged in successfully!');
      } else {
        showToast('❌ Invalid email or password credentials.');
      }
    } catch (err) {
      showToast('❌ Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      if (res.ok) {
        onToggleLogin(true);
        showToast(`✅ Authenticated via ${provider} OAuth!`);
      }
    } catch (err) {
      showToast(`❌ OAuth failed for ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: regPhone }),
      });
      if (res.ok) {
        setOtpSent(true);
        setOtpTimer(60);
        showToast('📲 6-digit SMS OTP sent to mobile device! (Demo code: 882910)');
      }
    } catch (err) {
      showToast('❌ Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    try {
      const res = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: phoneOtpInput }),
      });
      if (res.ok) {
        onToggleLogin(true);
        showToast('✅ Mobile phone verified & authenticated!');
      } else {
        showToast('❌ Incorrect OTP code. Try 882910.');
      }
    } catch (err) {
      showToast('❌ Verification error.');
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const res = await fetch('/api/v1/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: emailCodeInput }),
      });
      if (res.ok) {
        setIsEmailVerified(true);
        showToast('🎉 Email address verified successfully!');
        setAuthMode('signin');
      } else {
        showToast('❌ Invalid verification code. Try 771923.');
      }
    } catch (err) {
      showToast('❌ Email verification error.');
    }
  };

  const handleRevokeDevice = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/auth/sessions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setDevices(data.sessions);
        showToast('📱 Device session revoked.');
      }
    } catch (e) {
      showToast('❌ Failed to revoke session.');
    }
  };

  const handleLogoutAllOtherDevices = async () => {
    try {
      const res = await fetch('/api/v1/auth/sessions-all', { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setDevices(data.sessions);
        showToast('🔒 All other device sessions logged out.');
      }
    } catch (e) {
      showToast('❌ Failed to revoke sessions.');
    }
  };

  const handleProfileClick = (profile: UserProfile) => {
    if (profile.pinRequired) {
      setPendingKidProfile(profile);
      setPinInput('');
      setPinError(false);
    } else {
      onSelectProfile(profile);
      showToast(`Switched active profile to ${profile.name}`);
    }
  };

  const handleVerifyKidsPin = () => {
    if (pinInput === '1234' || pinInput === pendingKidProfile?.pinCode) {
      onSelectProfile(pendingKidProfile!);
      setPendingKidProfile(null);
      showToast('🧒 Kids Profile unlocked successfully!');
    } else {
      setPinError(true);
    }
  };

  const handleCreateProfile = () => {
    if (!newProfileName) return;
    const newProf: UserProfile = {
      id: `p_${Date.now()}`,
      name: newProfileName,
      avatarUrl: selectedAvatar,
      isKids: newProfileIsKids,
      pinRequired: newProfileIsKids,
      pinCode: '1234',
      autoplayTrailers: true,
      autoplayNextEpisode: true,
    };
    setProfilesList([...profilesList, newProf]);
    setNewProfileName('');
    showToast(`Profile "${newProfileName}" created!`);
  };

  const handleDeleteDownload = (id: string) => {
    setDownloads(downloads.filter((d) => d.id !== id));
    showToast('Download removed from local storage.');
  };

  const totalDownloadedMb = downloads.reduce((acc, d) => acc + d.fileSizeMb, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Outer Shell */}
      <div className="relative w-full max-w-4xl bg-[#0d0e12] rounded-3xl border border-red-600/30 shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-[#12141a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black shadow-lg shadow-red-600/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black uppercase text-white tracking-tight">Enterprise Account Center</h2>
                {isEmailVerified && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400">Manage login credentials, multi-profiles, active sessions, and security</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 transition"
            id="auth-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Sub-Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#0f1117] px-4 text-xs font-bold uppercase tracking-wider overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('auth')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'auth' ? 'border-red-600 text-white font-black' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
            id="tab-auth"
          >
            <Key className="w-4 h-4 text-red-500" />
            <span>Auth & SSO</span>
          </button>

          <button
            onClick={() => setActiveTab('profiles')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'profiles' ? 'border-red-600 text-white font-black' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
            id="tab-profiles"
          >
            <User className="w-4 h-4 text-red-500" />
            <span>Viewer Profiles</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'sessions' ? 'border-red-600 text-white font-black' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
            id="tab-sessions"
          >
            <Smartphone className="w-4 h-4 text-red-500" />
            <span>Devices ({devices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'security' ? 'border-red-600 text-white font-black' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
            id="tab-security"
          >
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span>Security & 2FA</span>
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'downloads' ? 'border-red-600 text-white font-black' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
            id="tab-downloads"
          >
            <HardDrive className="w-4 h-4 text-red-500" />
            <span>Downloads</span>
          </button>
        </div>

        {/* Modal Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Toast Notification Banner */}
          {notice && (
            <div className="p-3.5 rounded-2xl bg-red-600/10 border border-red-600/30 text-red-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-red-400 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          {/* TAB 1: AUTHENTICATION & SINGLE SIGN-ON */}
          {activeTab === 'auth' && (
            <div className="space-y-6">
              
              {/* Auth Mode Toggle Bar */}
              <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 text-xs font-bold">
                <button
                  onClick={() => setAuthMode('signin')}
                  className={`flex-1 py-2 rounded-xl transition ${authMode === 'signin' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'}`}
                  id="subtab-signin"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 rounded-xl transition ${authMode === 'register' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'}`}
                  id="subtab-register"
                >
                  Create Account
                </button>
                <button
                  onClick={() => setAuthMode('otp')}
                  className={`flex-1 py-2 rounded-xl transition ${authMode === 'otp' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'}`}
                  id="subtab-otp"
                >
                  SMS OTP Login
                </button>
                <button
                  onClick={() => setAuthMode('forgot')}
                  className={`flex-1 py-2 rounded-xl transition ${authMode === 'forgot' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'}`}
                  id="subtab-forgot"
                >
                  Reset Password
                </button>
              </div>

              {/* SOCIAL OAUTH QUICK MATRIX */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase text-red-500 tracking-wider block">
                  Enterprise SSO Options
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  <button
                    onClick={() => handleSocialLogin('Google')}
                    className="p-2.5 bg-white/5 border border-white/10 hover:border-red-600/50 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition"
                    id="oauth-google-btn"
                  >
                    <span className="text-red-400 text-base font-black">G</span>
                    <span className="text-[10px]">Google</span>
                  </button>

                  <button
                    onClick={() => handleSocialLogin('Apple')}
                    className="p-2.5 bg-white/5 border border-white/10 hover:border-red-600/50 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition"
                    id="oauth-apple-btn"
                  >
                    <span className="text-base"></span>
                    <span className="text-[10px]">Apple</span>
                  </button>

                  <button
                    onClick={() => handleSocialLogin('Facebook')}
                    className="p-2.5 bg-white/5 border border-white/10 hover:border-red-600/50 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition"
                    id="oauth-facebook-btn"
                  >
                    <span className="text-blue-400 text-base font-bold">f</span>
                    <span className="text-[10px]">Facebook</span>
                  </button>

                  <button
                    onClick={() => handleSocialLogin('GitHub')}
                    className="p-2.5 bg-white/5 border border-white/10 hover:border-red-600/50 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition"
                    id="oauth-github-btn"
                  >
                    <span className="text-base">🐙</span>
                    <span className="text-[10px]">GitHub</span>
                  </button>

                  <button
                    onClick={() => handleSocialLogin('Microsoft')}
                    className="p-2.5 bg-white/5 border border-white/10 hover:border-red-600/50 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition"
                    id="oauth-microsoft-btn"
                  >
                    <span className="text-cyan-400 text-base font-bold">田</span>
                    <span className="text-[10px]">Microsoft</span>
                  </button>

                  <button
                    onClick={() => {
                      onToggleLogin(true);
                      showToast('👤 Entered as Anonymous Guest Session');
                    }}
                    className="p-2.5 bg-white/5 border border-white/10 hover:border-amber-500/50 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition"
                    id="oauth-guest-btn"
                  >
                    <span className="text-amber-400 text-base">🕵️</span>
                    <span className="text-[10px]">Guest Session</span>
                  </button>
                </div>
              </div>

              {/* MODE A: SIGN IN FORM */}
              {authMode === 'signin' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-lg mx-auto pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300 uppercase">Email or Username</label>
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="alex.cinephile@example.com"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                      id="input-login-email"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-neutral-300 uppercase">Password</label>
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-[11px] text-red-400 hover:underline font-semibold"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none pr-10"
                        id="input-login-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-neutral-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded accent-red-600"
                      />
                      <span>Remember this device (30 days)</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition shadow-lg shadow-red-600/30 uppercase tracking-wider disabled:opacity-50"
                    id="submit-signin-btn"
                  >
                    {loading ? 'Authenticating...' : 'Sign In to Account'}
                  </button>
                </form>
              )}

              {/* MODE B: CREATE ACCOUNT (REGISTRATION FORM) */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-300 uppercase">First Name</label>
                      <input
                        type="text"
                        required
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        placeholder="Alex"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                        id="reg-first-name"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-300 uppercase">Last Name</label>
                      <input
                        type="text"
                        required
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        placeholder="Mercer"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                        id="reg-last-name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-300 uppercase">Username</label>
                      <input
                        type="text"
                        required
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="alex_cinephile"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                        id="reg-username"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-300 uppercase">Email Address</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="alex@cineverse.pro"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                        id="reg-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-300 uppercase">Phone Number</label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                        id="reg-phone"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-300 uppercase">Country</label>
                      <select
                        value={regCountry}
                        onChange={(e) => setRegCountry(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                        id="reg-country"
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-300 uppercase">Date of Birth</label>
                      <input
                        type="date"
                        value={regDob}
                        onChange={(e) => setRegDob(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                        id="reg-dob"
                      />
                    </div>
                  </div>

                  {/* Password & Real-Time Strength Meter */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-300 uppercase">Password</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                          id="reg-password"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-300 uppercase">Confirm Password</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                          id="reg-confirm-password"
                        />
                      </div>
                    </div>

                    {/* Password Security Criteria */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-neutral-400">PASSWORD SECURITY STRENGTH</span>
                        <span className={strengthScore >= 4 ? 'text-emerald-400' : strengthScore >= 2 ? 'text-amber-400' : 'text-red-400'}>
                          {strengthScore >= 4 ? 'STRONG' : strengthScore >= 2 ? 'MEDIUM' : 'WEAK'}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full transition-all duration-300 ${
                            strengthScore >= 4 ? 'bg-emerald-500 w-full' : strengthScore >= 2 ? 'bg-amber-500 w-3/5' : 'bg-red-500 w-1/5'
                          }`}
                        />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 text-[10px] pt-1">
                        <span className={hasLength ? 'text-emerald-400 font-bold' : 'text-neutral-500'}>✓ 8+ Chars</span>
                        <span className={hasUpper ? 'text-emerald-400 font-bold' : 'text-neutral-500'}>✓ Uppercase</span>
                        <span className={hasLower ? 'text-emerald-400 font-bold' : 'text-neutral-500'}>✓ Lowercase</span>
                        <span className={hasNumber ? 'text-emerald-400 font-bold' : 'text-neutral-500'}>✓ Number</span>
                        <span className={hasSpecial ? 'text-emerald-400 font-bold' : 'text-neutral-500'}>✓ Special</span>
                      </div>
                    </div>
                  </div>

                  {/* Consents */}
                  <div className="space-y-2 text-xs text-neutral-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="rounded accent-red-600" />
                      <span>I accept CINEVERSE PRO Terms of Service</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.checked)} className="rounded accent-red-600" />
                      <span>I acknowledge Privacy Policy & Cookies Policy</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="rounded accent-red-600" />
                      <span>Subscribe to 4K Ultra HD Release Digest</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !acceptTerms}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition shadow-lg shadow-red-600/30 uppercase tracking-wider disabled:opacity-50"
                    id="submit-register-btn"
                  >
                    {loading ? 'Creating Account...' : 'Complete Enterprise Registration'}
                  </button>
                </form>
              )}

              {/* MODE C: PHONE OTP LOGIN */}
              {authMode === 'otp' && (
                <div className="space-y-4 max-w-md mx-auto pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300 uppercase">Registered Mobile Phone</label>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                        id="otp-phone-input"
                      />
                      <button
                        onClick={handleSendPhoneOtp}
                        disabled={loading || (otpSent && otpTimer > 0)}
                        className="px-4 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition shrink-0 disabled:opacity-50"
                        id="send-otp-btn"
                      >
                        {otpSent && otpTimer > 0 ? `Resend (${otpTimer}s)` : 'Send OTP'}
                      </button>
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10 animate-in fade-in">
                      <label className="text-xs font-bold text-red-400 uppercase tracking-wider block">Enter 6-Digit SMS Verification Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={phoneOtpInput}
                        onChange={(e) => setPhoneOtpInput(e.target.value)}
                        placeholder="882910"
                        className="w-full text-center tracking-widest text-lg font-black bg-black/80 border border-white/20 rounded-xl py-2.5 text-white focus:border-red-600 focus:outline-none"
                        id="otp-code-input"
                      />
                      <button
                        onClick={handleVerifyPhoneOtp}
                        className="w-full py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-600/30 uppercase"
                        id="verify-otp-btn"
                      >
                        Verify OTP Code & Sign In
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MODE D: FORGOT PASSWORD */}
              {authMode === 'forgot' && (
                <div className="space-y-4 max-w-md mx-auto pt-2">
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-bold text-white">Reset Account Password</h3>
                    <p className="text-xs text-neutral-400">Enter your registered email address to receive password reset tokens.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300 uppercase">Registered Email</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="alex@cineverse.pro"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                      id="forgot-email-input"
                    />
                  </div>

                  <button
                    onClick={async () => {
                      setLoading(true);
                      await fetch('/api/v1/auth/forgot-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: regEmail }),
                      });
                      setLoading(false);
                      showToast(`📩 Password reset instructions sent to ${regEmail || 'your email'}`);
                      setAuthMode('signin');
                    }}
                    className="w-full py-3 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition uppercase tracking-wider shadow-lg shadow-red-600/30"
                    id="send-reset-link-btn"
                  >
                    Send Password Reset Token
                  </button>
                </div>
              )}

              {/* MODE E: EMAIL VERIFICATION */}
              {authMode === 'verify_email' && (
                <div className="space-y-4 max-w-md mx-auto pt-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-600/40 text-red-500 flex items-center justify-center mx-auto">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Verify Your Email Address</h3>
                  <p className="text-xs text-neutral-400">Enter the 6-digit confirmation code sent to {regEmail || 'your email'} (Demo code: 771923)</p>

                  <input
                    type="text"
                    maxLength={6}
                    value={emailCodeInput}
                    onChange={(e) => setEmailCodeInput(e.target.value)}
                    placeholder="771923"
                    className="w-full text-center tracking-widest text-lg font-black bg-black/80 border border-white/20 rounded-xl py-2.5 text-white focus:border-red-600 focus:outline-none"
                    id="email-code-input"
                  />

                  <button
                    onClick={handleVerifyEmail}
                    className="w-full py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-600/30 uppercase"
                    id="verify-email-code-btn"
                  >
                    Confirm Email Verification
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: VIEWER PROFILES HUB */}
          {activeTab === 'profiles' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white uppercase">Who is Watching?</h3>
                  <p className="text-xs text-neutral-400">Switch or configure family profiles, kids filters & playback settings</p>
                </div>
                <button
                  onClick={() => setEditingProfile({
                    id: '',
                    name: '',
                    avatarUrl: PRESET_AVATARS[0],
                    isKids: false,
                  })}
                  className="px-3 py-1.5 rounded-xl bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600 hover:text-white transition text-xs font-bold flex items-center gap-1.5"
                  id="add-profile-trigger"
                >
                  <Plus className="w-4 h-4" /> Add Profile
                </button>
              </div>

              {/* Profiles Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {profilesList.map((prof) => {
                  const isActive = currentProfile.id === prof.id;
                  return (
                    <button
                      key={prof.id}
                      onClick={() => handleProfileClick(prof)}
                      className={`group flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition ${
                        isActive
                          ? 'bg-red-600/10 border-red-600 text-white ring-2 ring-red-600/40'
                          : 'bg-white/5 border-white/10 hover:border-white/30 text-neutral-300'
                      }`}
                      id={`profile-card-${prof.id}`}
                    >
                      <div className="relative">
                        <img
                          src={prof.avatarUrl}
                          alt={prof.name}
                          className="w-20 h-20 rounded-2xl object-cover border border-white/20 shadow-xl group-hover:scale-105 transition"
                        />
                        {prof.isKids && (
                          <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                            Kids
                          </span>
                        )}
                        {prof.pinRequired && (
                          <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <Lock className="w-6 h-6 text-amber-400" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold truncate max-w-full">{prof.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* KIDS PIN PROMPT OVERLAY */}
              {pendingKidProfile && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3 max-w-sm mx-auto">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Enter Kids Parental PIN</h4>
                  <p className="text-xs text-neutral-300">Default PIN: 1234</p>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-32 mx-auto text-center tracking-widest text-lg font-black bg-black/80 border border-white/20 rounded-xl py-2 text-white focus:border-red-600 focus:outline-none"
                    id="kids-pin-code-input"
                  />
                  {pinError && <p className="text-xs text-red-400 font-bold">Incorrect PIN. Try 1234.</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPendingKidProfile(null)}
                      className="flex-1 py-1.5 bg-white/10 text-neutral-300 rounded-xl text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleVerifyKidsPin}
                      className="flex-1 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold"
                    >
                      Unlock
                    </button>
                  </div>
                </div>
              )}

              {/* ACTIVE PROFILE PREFERENCES */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h4 className="text-xs font-bold uppercase text-red-500 tracking-wider">
                  Active Profile Preferences ({currentProfile.name})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-medium">Preferred Audio Language</label>
                    <select className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-bold focus:outline-none">
                      <option>English (Dolby Atmos 7.1)</option>
                      <option>French (5.1 Surround)</option>
                      <option>Spanish (Castilian)</option>
                      <option>Japanese (Original Audio)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 font-medium">Preferred Subtitles</label>
                    <select className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-bold focus:outline-none">
                      <option>English [CC]</option>
                      <option>Spanish [Subtítulos]</option>
                      <option>French [Sous-titres]</option>
                      <option>Off</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
                  <span className="text-neutral-300 font-medium">Autoplay Next Episode Automatically</span>
                  <input type="checkbox" defaultChecked className="rounded accent-red-600 w-4 h-4" />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-neutral-300 font-medium">Autoplay Video Trailers While Browsing</span>
                  <input type="checkbox" defaultChecked className="rounded accent-red-600 w-4 h-4" />
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: DEVICES & ACTIVE SESSIONS */}
          {activeTab === 'sessions' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white uppercase">Active Logged-In Devices</h3>
                  <p className="text-xs text-neutral-400">Monitor and manage streaming sessions authorized on your account</p>
                </div>

                <button
                  onClick={handleLogoutAllOtherDevices}
                  className="px-3 py-1.5 bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600 hover:text-white transition text-xs font-bold rounded-xl"
                  id="revoke-all-sessions-btn"
                >
                  Sign Out All Other Devices
                </button>
              </div>

              <div className="space-y-3">
                {devices.map((dev) => (
                  <div
                    key={dev.id}
                    className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-red-600/20 border border-red-600/30 text-red-500">
                        {dev.deviceType === 'desktop' && <Laptop className="w-5 h-5" />}
                        {dev.deviceType === 'mobile' && <Smartphone className="w-5 h-5" />}
                        {dev.deviceType === 'tv' && <Tv className="w-5 h-5" />}
                        {dev.deviceType === 'tablet' && <Tablet className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{dev.deviceName}</h4>
                          {dev.currentSession && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase">
                              Current Device
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {dev.browser} • {dev.os} • IP: {dev.ipAddress}
                        </p>
                        <p className="text-[10px] text-neutral-500">
                          Location: {dev.location} • Last active: {dev.lastActive}
                        </p>
                      </div>
                    </div>

                    {!dev.currentSession && (
                      <button
                        onClick={() => handleRevokeDevice(dev.id)}
                        className="px-3 py-1 bg-white/5 border border-white/10 hover:bg-red-600 hover:text-white text-neutral-300 rounded-lg text-xs transition self-end sm:self-center"
                        id={`revoke-dev-${dev.id}`}
                      >
                        Revoke Access
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & 2FA & AUDIT LOGS */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              
              {/* 2FA Toggle */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Two-Factor Authentication (2FA)</h4>
                      <p className="text-xs text-neutral-400">Require an authenticator app token or SMS OTP code for new logins</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      showToast(`2FA Status changed to ${!twoFactorEnabled ? 'ENABLED' : 'DISABLED'}`);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                      twoFactorEnabled ? 'bg-emerald-500 text-black' : 'bg-white/10 text-neutral-300'
                    }`}
                    id="toggle-2fa-main"
                  >
                    {twoFactorEnabled ? '2FA Active' : 'Enable 2FA'}
                  </button>
                </div>

                {twoFactorEnabled && (
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <span className="text-xs font-bold text-neutral-300 uppercase block">Emergency Recovery Backup Codes</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                      {recoveryCodes.map((code, idx) => (
                        <div key={idx} className="p-2 rounded bg-black/60 border border-white/10 text-amber-400 text-center font-bold">
                          {code}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(recoveryCodes.join('\n'));
                          setCopiedRecovery(true);
                          setTimeout(() => setCopiedRecovery(false), 2000);
                        }
                      }}
                      className="text-xs text-red-400 font-bold hover:underline flex items-center gap-1 pt-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedRecovery ? 'Recovery Codes Copied!' : 'Copy Backup Codes'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* SECURITY LOGS AUDIT TRAIL */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase text-white tracking-wider">Account Security Audit Trail</h4>
                <div className="space-y-2">
                  {securityLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <div>
                          <p className="font-bold text-white">{log.event}</p>
                          <p className="text-[10px] text-neutral-400">IP: {log.ipAddress} • {log.location}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: OFFLINE DOWNLOADS & STORAGE */}
          {activeTab === 'downloads' && (
            <div className="space-y-5">
              
              {/* Storage Usage Header */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white">Offline Storage Usage</span>
                  <span className="text-red-400">{(totalDownloadedMb / 1000).toFixed(2)} GB / 64 GB</span>
                </div>

                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-600 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (totalDownloadedMb / 64000) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Downloads List */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Downloaded Titles</h4>
                {downloads.length > 0 ? (
                  downloads.map((item) => (
                    <div key={item.id} className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.posterUrl} alt={item.title} className="w-12 h-16 object-cover rounded-xl shrink-0" />
                        <div>
                          <h5 className="font-bold text-white text-sm">{item.title}</h5>
                          <p className="text-[11px] text-neutral-400">{item.quality} • {(item.fileSizeMb / 1000).toFixed(2)} GB</p>
                          <p className="text-[10px] text-neutral-500">Downloaded: {item.downloadedAt}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteDownload(item.id)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-red-600 text-neutral-400 hover:text-white transition"
                        title="Delete Download"
                        id={`delete-dl-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-neutral-400 text-xs">
                    No offline downloads saved currently.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-white/10 bg-[#12141a] flex items-center justify-between text-xs text-neutral-400">
          <span>Signed in as <strong className="text-white">{regEmail || loginEmail}</strong></span>
          <button
            onClick={() => {
              onToggleLogin(false);
              showToast('Signed out from current session.');
            }}
            className="flex items-center gap-1.5 text-red-400 font-bold hover:underline"
            id="auth-signout-btn"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
