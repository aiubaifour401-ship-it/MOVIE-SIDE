import React, { useState, useEffect } from 'react';
import {
  Database,
  Film,
  Users,
  TrendingUp,
  Plus,
  Trash2,
  Edit3,
  ShieldAlert,
  HardDrive,
  Server,
  Activity,
  CheckCircle2,
  RefreshCw,
  Upload,
  Eye,
  Search,
  Layers,
  Lock,
  LogOut,
  Sliders,
  Tv,
  DollarSign,
  AlertTriangle,
  FileText,
  Key,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  BarChart3,
  ArrowUpRight,
  Radio,
  Globe,
  Settings,
  HelpCircle,
  Megaphone,
  UserCheck,
  UserX,
  Play,
  X,
  User
} from 'lucide-react';
import { Movie } from '../types';
import { AdminLoginPage } from './AdminLoginPage';

interface AdminAppProps {
  onReturnToUserSite: () => void;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Movie Manager' | 'Content Editor' | 'Moderator' | 'Support' | 'Analytics Manager';
  status: 'Active' | 'Suspended';
  lastLogin: string;
  country: string;
}

interface LiveChannel {
  id: string;
  name: string;
  category: string;
  status: 'Live' | 'Offline';
  viewersCount: number;
  logoUrl: string;
}

interface AdCampaign {
  id: string;
  title: string;
  client: string;
  impressions: number;
  clickRate: string;
  status: 'Active' | 'Paused';
  budget: string;
}

export const AdminApp: React.FC<AdminAppProps> = ({ onReturnToUserSite }) => {
  // Auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cineverse_admin_token') !== null;
  });
  const [adminEmail, setAdminEmail] = useState('admin@cineverse.com');
  const [adminPassword, setAdminPassword] = useState('••••••••••••');
  const [adminSecurityKey, setAdminSecurityKey] = useState('MASTER_KEY_2026');
  const [activeAdminRole, setActiveAdminRole] = useState<string>('Super Admin');

  // CMS Tabs
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'upload' | 'movies' | 'curator' | 'livetv' | 'ads' | 'users' | 'analytics' | 'logs' | 'settings'
  >('dashboard');

  // Movies Catalog
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // Edit / Create Form States
  const [editingMovie, setEditingMovie] = useState<Partial<Movie> | null>(null);
  const [isCreatingMovie, setIsCreatingMovie] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formSynopsis, setFormSynopsis] = useState('');
  const [formPosterUrl, setFormPosterUrl] = useState('');
  const [formBackdropUrl, setFormBackdropUrl] = useState('');
  const [formTrailerYoutubeId, setFormTrailerYoutubeId] = useState('');
  const [formDirector, setFormDirector] = useState('');
  const [formReleaseYear, setFormReleaseYear] = useState(2026);
  const [formImdbRating, setFormImdbRating] = useState(8.5);
  const [formGenres, setFormGenres] = useState('Sci-Fi, Action');
  const [formStreamUrl, setFormStreamUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
  const [formAudioLangs, setFormAudioLangs] = useState('English Dolby Atmos, Spanish 5.1');
  const [formSubtitles, setFormSubtitles] = useState('English CC, Spanish, French');

  // Admin Data Stores
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [customerUsers, setCustomerUsers] = useState<any[]>([]);
  const [userTabMode, setUserTabMode] = useState<'customers' | 'admin_team'>('customers');
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);

  // New Customer Form Fields
  const [newCustUsername, setNewCustUsername] = useState('');
  const [newCustPassword, setNewCustPassword] = useState('Password123!');
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustStartDate, setNewCustStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newCustExpiryDate, setNewCustExpiryDate] = useState('2026-08-25');

  const [liveChannels, setLiveChannels] = useState<LiveChannel[]>([]);
  const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<any>({
    totalSubscribers: 148920,
    monthlyRevenue: "$482,900",
    activeConcurrentStreams: 34210,
    cdnBandwidthGbps: "184.2 Gbps",
    bufferHealthPercent: 99.8,
    totalMovies: 12,
    totalTvSeries: 48,
    serverUptime: "99.99%",
  });

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  useEffect(() => {
    fetchAdminMovies();
    fetchDashboardMetrics();
    fetchAdminUsers();
    fetchCustomerUsers();
    fetchLiveChannels();
    fetchAdCampaigns();
  }, []);

  const getAdminHeaders = (extra: Record<string, string> = {}) => {
    const token = localStorage.getItem('cineverse_admin_token') || 'admin_jwt_demo_token';
    return {
      'Authorization': `Bearer ${token}`,
      'X-Admin-Token': token,
      ...extra,
    };
  };

  const fetchCustomerUsers = async () => {
    try {
      const res = await fetch('/api/v1/admin/platform-users', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setCustomerUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustUsername || !newCustPassword) {
      alert('Username and password are required.');
      return;
    }

    try {
      const res = await fetch('/api/v1/admin/platform-users', {
        method: 'POST',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          username: newCustUsername,
          password: newCustPassword,
          name: newCustName || newCustUsername,
          email: newCustEmail || `${newCustUsername}@cineverse.com`,
          subscriptionStartDate: newCustStartDate,
          subscriptionExpiryDate: newCustExpiryDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to create customer account');
        return;
      }

      showToast(`Created account "${newCustUsername}" with expiry ${newCustExpiryDate}!`);
      setIsAddCustomerModalOpen(false);
      setNewCustUsername('');
      setNewCustPassword('Password123!');
      setNewCustName('');
      setNewCustEmail('');
      fetchCustomerUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleExtendSubscription = async (userId: string, username: string, days: number) => {
    try {
      const res = await fetch(`/api/v1/admin/platform-users/${userId}/extend-subscription`, {
        method: 'POST',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ days }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Extended "${username}" by +${days} days! New Expiry: ${data.user.subscriptionExpiryDate}`);
        fetchCustomerUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCustomExpiryDate = async (userId: string, username: string, currentExpiry: string) => {
    const newExpiry = prompt(`Set new subscription expiry date for ${username} (YYYY-MM-DD):`, currentExpiry || '2026-08-25');
    if (!newExpiry) return;

    try {
      const res = await fetch(`/api/v1/admin/platform-users/${userId}/extend-subscription`, {
        method: 'POST',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ customExpiryDate: newExpiry }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Updated ${username}'s expiry date to ${newExpiry}`);
        fetchCustomerUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetCustomerPassword = async (userId: string, username: string) => {
    const newPass = prompt(`Enter new password for customer "${username}":`, 'Password123!');
    if (!newPass) return;

    try {
      const res = await fetch(`/api/v1/admin/platform-users/${userId}/reset-password`, {
        method: 'POST',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ newPassword: newPass }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Password for ${username} reset to "${data.newPassword}"`);
        fetchCustomerUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleCustomerStatus = async (userId: string, username: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';

    try {
      const res = await fetch(`/api/v1/admin/platform-users/${userId}`, {
        method: 'PUT',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        showToast(`Account "${username}" status set to ${nextStatus}`);
        fetchCustomerUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCustomer = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to permanently delete customer account "${username}"?`)) return;

    try {
      const res = await fetch(`/api/v1/admin/platform-users/${userId}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });

      if (res.ok) {
        showToast(`Customer "${username}" deleted`);
        fetchCustomerUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAdminMovies = async () => {
    try {
      const res = await fetch('/api/v1/admin/movies', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setMovies(data.movies);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDashboardMetrics = async () => {
    try {
      const res = await fetch('/api/v1/admin/dashboard', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardMetrics(data.metrics);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await fetch('/api/v1/admin/users', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLiveChannels = async () => {
    try {
      const res = await fetch('/api/v1/admin/live-tv', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setLiveChannels(data.channels);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAdCampaigns = async () => {
    try {
      const res = await fetch('/api/v1/admin/ads', {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setAdCampaigns(data.campaigns);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Login Handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword, adminKey: adminSecurityKey }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('cineverse_admin_token', data.token);
        setIsAdminAuthenticated(true);
        setActiveAdminRole(data.adminUser.role);
        showToast('🔐 Admin CMS Access Granted');
      } else {
        showToast(`❌ ${data.error || 'Admin login failed'}`);
      }
    } catch (err) {
      showToast('❌ Admin server authentication error');
    } finally {
      setLoading(false);
    }
  };

  // Movie Creation / Editing
  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    const genreArray = formGenres.split(',').map((g) => g.trim()).filter(Boolean);
    const audioArray = formAudioLangs.split(',').map((a) => a.trim()).filter(Boolean);
    const subtitleArray = formSubtitles.split(',').map((s) => s.trim()).filter(Boolean);

    const payload = {
      title: formTitle,
      tagline: formTagline || 'An epic cinematic creation.',
      synopsis: formSynopsis || 'High-bitrate 4K HDR stream.',
      posterUrl: formPosterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop',
      backdropUrl: formBackdropUrl || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop',
      trailerYoutubeId: formTrailerYoutubeId || 'Way9Dexny3w',
      releaseYear: Number(formReleaseYear),
      imdbRating: Number(formImdbRating),
      director: formDirector,
      genres: genreArray,
      audioLanguages: audioArray,
      subtitles: subtitleArray,
      streamUrl: formStreamUrl,
    };

    setLoading(true);
    try {
      if (isCreatingMovie) {
        const res = await fetch('/api/v1/admin/movies', {
          method: 'POST',
          headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setMovies(data.catalog);
          localStorage.setItem('cinephile_ott_movies', JSON.stringify(data.catalog));
          window.dispatchEvent(new Event('cineverse_movies_updated'));
          showToast(`✅ Created "${formTitle}" — Published to User App as NEW!`);
          setIsCreatingMovie(false);
          setActiveTab('movies');
        }
      } else if (editingMovie) {
        const res = await fetch(`/api/v1/admin/movies/${editingMovie.id}`, {
          method: 'PUT',
          headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setMovies(data.catalog);
          localStorage.setItem('cinephile_ott_movies', JSON.stringify(data.catalog));
          window.dispatchEvent(new Event('cineverse_movies_updated'));
          showToast(`✅ Updated "${formTitle}" successfully!`);
          setEditingMovie(null);
          setActiveTab('movies');
        }
      }
    } catch (e) {
      showToast('❌ Error saving movie entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (movieId: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently remove "${title}" from CMS?`)) return;
    try {
      const res = await fetch(`/api/v1/admin/movies/${movieId}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setMovies(data.catalog);
        localStorage.setItem('cinephile_ott_movies', JSON.stringify(data.catalog));
        window.dispatchEvent(new Event('cineverse_movies_updated'));
        showToast(`🗑 Deleted "${title}" from catalog.`);
      }
    } catch (e) {
      showToast('❌ Failed to delete movie');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: AdminUser['role']) => {
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data.users);
        showToast(`Updated user role to ${newRole}`);
      }
    } catch (e) {
      showToast('❌ Failed to update role');
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data.users);
        showToast(`User status set to ${nextStatus}`);
      }
    } catch (e) {
      showToast('❌ Failed to change user status');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('cineverse_admin_token');
    localStorage.removeItem('cineverse_admin_email');
    setIsAdminAuthenticated(false);
    window.history.pushState({}, '', '/admin/login');
  };

  // If not authenticated as Admin, show Admin Login Portal
  if (!isAdminAuthenticated) {
    return (
      <AdminLoginPage
        onLoginSuccess={(role, email) => {
          setIsAdminAuthenticated(true);
          setActiveAdminRole(role);
          setAdminEmail(email);
          window.history.pushState({}, '', '/admin/dashboard');
          showToast(`🔐 Admin CMS Access Granted as ${role}`);
        }}
        onReturnToUserSite={onReturnToUserSite}
      />
    );
  }

  // MAIN ADMIN CMS APPLICATION
  return (
    <div className="min-h-screen bg-[#07080b] text-white flex flex-col font-sans">
      
      {/* Top Fixed CMS Bar */}
      <header className="h-16 border-b border-white/10 bg-[#0c0d12] px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-black flex items-center justify-center text-lg shadow-lg shadow-red-600/30">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black uppercase text-white tracking-tight">CINEVERSE Enterprise CMS</h1>
              <span className="px-2 py-0.5 rounded-full bg-red-600/20 border border-red-600/40 text-red-400 text-[10px] font-black uppercase">
                v2.5-ENTERPRISE
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 hidden sm:block">Full Content Management, Live Transcoding & CDN Console</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Server Uptime & Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CDN Nodes: 100% Operational (184 Gbps)</span>
          </div>

          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-neutral-300 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
            <span>{activeAdminRole}</span>
          </div>

          <button
            onClick={onReturnToUserSite}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-neutral-300 transition"
          >
            User Website ↗
          </button>

          <button
            onClick={handleAdminLogout}
            className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition"
            title="Log out of CMS"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main CMS Layout with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-64 border-r border-white/10 bg-[#0a0b0f] p-4 flex flex-col justify-between shrink-0 hidden md:flex">
          <div className="space-y-6">
            
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-neutral-400 tracking-wider px-3">
                Core Operations
              </label>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-3 ${
                  activeTab === 'dashboard' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => {
                  setIsCreatingMovie(true);
                  setEditingMovie(null);
                  setActiveTab('upload');
                }}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-3 ${
                  activeTab === 'upload' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Upload Movie / Series</span>
              </button>

              <button
                onClick={() => setActiveTab('movies')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                  activeTab === 'movies' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Film className="w-4 h-4" />
                  <span>Content Catalog</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold">{movies.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('curator')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-3 ${
                  activeTab === 'curator' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Hero & Curator Manager</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-neutral-400 tracking-wider px-3">
                Live & Monetization
              </label>

              <button
                onClick={() => setActiveTab('livetv')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                  activeTab === 'livetv' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Tv className="w-4 h-4" />
                  <span>Live TV Manager</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">3 Live</span>
              </button>

              <button
                onClick={() => setActiveTab('ads')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-3 ${
                  activeTab === 'ads' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Megaphone className="w-4 h-4" />
                <span>Ad Campaigns</span>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                  activeTab === 'users' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>Users & Roles</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold">{adminUsers.length}</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-neutral-400 tracking-wider px-3">
                Analytics & Governance
              </label>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-3 ${
                  activeTab === 'analytics' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Revenue Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('logs')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-3 ${
                  activeTab === 'logs' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Security Audit Logs</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-3 ${
                  activeTab === 'settings' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>CMS Settings</span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-neutral-300 font-bold">
              <span>ACTIVE REGION</span>
              <span className="text-emerald-400 font-extrabold">US-WEST (ORD)</span>
            </div>
            <div className="text-[10px] text-neutral-400">Database & Transcoder latency: <span className="text-white font-bold">14ms</span></div>
          </div>
        </aside>

        {/* Center Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          
          {/* Toast Notification Banner */}
          {notice && (
            <div className="p-4 rounded-2xl bg-red-600/15 border border-red-600/40 text-red-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-400 shrink-0" />
                <span>{notice}</span>
              </div>
              <button onClick={() => setNotice(null)} className="text-neutral-400 hover:text-white font-bold text-xs">Dismiss</button>
            </div>
          )}

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">System Performance & Revenue Dashboard</h2>
                  <p className="text-xs text-neutral-400">Real-time metrics from global edge servers and payment pipelines</p>
                </div>
                <button
                  onClick={fetchDashboardMetrics}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Metrics
                </button>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#0f1118] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase">
                    <span>Total Paid Subscribers</span>
                    <Users className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="text-2xl font-black text-white">{dashboardMetrics.totalSubscribers?.toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> +14.2% this month
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0f1118] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase">
                    <span>Monthly Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400">{dashboardMetrics.monthlyRevenue}</div>
                  <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> +8.5% ARPU growth
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0f1118] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase">
                    <span>Active Streams</span>
                    <Radio className="w-4 h-4 text-amber-500 animate-pulse" />
                  </div>
                  <div className="text-2xl font-black text-white">{dashboardMetrics.activeConcurrentStreams?.toLocaleString()}</div>
                  <div className="text-[11px] text-neutral-400 font-bold">
                    Peak: 48,200 Streams
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0f1118] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase">
                    <span>CDN Throughput</span>
                    <Server className="w-4 h-4 text-cyan-500" />
                  </div>
                  <div className="text-2xl font-black text-white">{dashboardMetrics.cdnBandwidthGbps}</div>
                  <div className="text-[11px] text-cyan-400 font-bold">
                    Buffer Health: {dashboardMetrics.bufferHealthPercent}%
                  </div>
                </div>
              </div>

              {/* Edge Server Map & Transcoder Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f1118] border border-white/10 space-y-4">
                  <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
                    <Globe className="w-4 h-4 text-red-500" /> Global Streaming CDN Edge Nodes
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-black/50 border border-white/10 rounded-xl space-y-1">
                      <div className="text-neutral-400 text-[10px] font-bold uppercase">US-East (Virginia)</div>
                      <div className="text-sm font-black text-emerald-400">42 Gbps</div>
                      <div className="text-[9px] text-neutral-400">Load: 38%</div>
                    </div>
                    <div className="p-3 bg-black/50 border border-white/10 rounded-xl space-y-1">
                      <div className="text-neutral-400 text-[10px] font-bold uppercase">EU-West (Frankfurt)</div>
                      <div className="text-sm font-black text-emerald-400">58 Gbps</div>
                      <div className="text-[9px] text-neutral-400">Load: 52%</div>
                    </div>
                    <div className="p-3 bg-black/50 border border-white/10 rounded-xl space-y-1">
                      <div className="text-neutral-400 text-[10px] font-bold uppercase">AP-East (Tokyo)</div>
                      <div className="text-sm font-black text-emerald-400">31 Gbps</div>
                      <div className="text-[9px] text-neutral-400">Load: 29%</div>
                    </div>
                    <div className="p-3 bg-black/50 border border-white/10 rounded-xl space-y-1">
                      <div className="text-neutral-400 text-[10px] font-bold uppercase">SA-East (São Paulo)</div>
                      <div className="text-sm font-black text-emerald-400">18 Gbps</div>
                      <div className="text-[9px] text-neutral-400">Load: 19%</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-neutral-300">AUTOMATIC TRANSCODING CLUSTER (HLS / DASH)</span>
                      <span className="text-emerald-400">Active (4 Workers)</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-red-600 h-full w-2/3 animate-pulse" />
                    </div>
                    <p className="text-[10px] text-neutral-400">Encoding 4K Master Copy for "Dune: Part Two" into 1080p, 720p, 480p variants.</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0f1118] border border-white/10 space-y-4">
                  <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-500" /> System Quick Controls
                  </h3>

                  <button
                    onClick={() => setActiveTab('upload')}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 uppercase tracking-wider flex items-center justify-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" /> Upload New Movie Entry
                  </button>

                  <button
                    onClick={() => setActiveTab('curator')}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <Sliders className="w-4 h-4 text-red-500" /> Reorder Featured Hero Slider
                  </button>

                  <button
                    onClick={() => setActiveTab('users')}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <Users className="w-4 h-4 text-red-500" /> Manage Admin Roles
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD MOVIE / SERIES */}
          {(activeTab === 'upload' || isCreatingMovie || editingMovie) && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    {editingMovie ? `Edit Content Entry: ${editingMovie.title}` : 'Upload & Publish New Movie or Series'}
                  </h2>
                  <p className="text-xs text-neutral-400">Configure media assets, HLS video stream URL, audio tracks, and subtitles</p>
                </div>
                <button
                  onClick={() => {
                    setIsCreatingMovie(false);
                    setEditingMovie(null);
                    setActiveTab('movies');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-neutral-300"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveMovie} className="space-y-6">
                
                {/* Title & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300 uppercase">Title</label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Dune: Part Two"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300 uppercase">Tagline</label>
                    <input
                      type="text"
                      value={formTagline}
                      onChange={(e) => setFormTagline(e.target.value)}
                      placeholder="e.g. Long live the fighters."
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Synopsis */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300 uppercase">Synopsis / Plot Description</label>
                  <textarea
                    rows={3}
                    value={formSynopsis}
                    onChange={(e) => setFormSynopsis(e.target.value)}
                    placeholder="Provide detailed movie narrative..."
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                  />
                </div>

                {/* Poster & Backdrop URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300 uppercase">Poster Image URL</label>
                    <input
                      type="url"
                      required
                      value={formPosterUrl}
                      onChange={(e) => setFormPosterUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300 uppercase">Backdrop Banner URL</label>
                    <input
                      type="url"
                      required
                      value={formBackdropUrl}
                      onChange={(e) => setFormBackdropUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Video Stream & Trailer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-red-400 uppercase">HLS 4K Video Stream URL (.mp4 / .m3u8)</label>
                    <input
                      type="url"
                      value={formStreamUrl}
                      onChange={(e) => setFormStreamUrl(e.target.value)}
                      placeholder="https://commondatastorage.googleapis.com/..."
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300 uppercase">YouTube Trailer ID</label>
                    <input
                      type="text"
                      value={formTrailerYoutubeId}
                      onChange={(e) => setFormTrailerYoutubeId(e.target.value)}
                      placeholder="e.g. Way9Dexny3w"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Release, Rating, Director, Genres */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300 uppercase">Director</label>
                    <input
                      type="text"
                      value={formDirector}
                      onChange={(e) => setFormDirector(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300 uppercase">Release Year</label>
                    <input
                      type="number"
                      value={formReleaseYear}
                      onChange={(e) => setFormReleaseYear(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300 uppercase">IMDb Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formImdbRating}
                      onChange={(e) => setFormImdbRating(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300 uppercase">Genres (Comma separated)</label>
                    <input
                      type="text"
                      value={formGenres}
                      onChange={(e) => setFormGenres(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Audio Languages & Subtitles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300 uppercase">Audio Languages</label>
                    <input
                      type="text"
                      value={formAudioLangs}
                      onChange={(e) => setFormAudioLangs(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300 uppercase">Subtitle Tracks (.vtt / .srt)</label>
                    <input
                      type="text"
                      value={formSubtitles}
                      onChange={(e) => setFormSubtitles(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition shadow-lg shadow-red-600/30 uppercase tracking-wider disabled:opacity-50"
                >
                  {loading ? 'Transcoding & Indexing...' : 'Save & Publish Entry to Catalog'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: MOVIE & SERIES CATALOG MANAGEMENT */}
          {activeTab === 'movies' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Movie & Series Catalog CMS</h2>
                  <p className="text-xs text-neutral-400">Total {movies.length} published titles across 4K Ultra HD & Dolby Atmos formats</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search title, director..."
                      className="bg-black/60 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:border-red-600 focus:outline-none w-48 sm:w-64"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setEditingMovie(null);
                      setIsCreatingMovie(true);
                      setFormTitle('');
                      setFormTagline('');
                      setFormSynopsis('');
                      setFormPosterUrl('https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop');
                      setFormBackdropUrl('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop');
                      setActiveTab('upload');
                    }}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add Entry
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="border border-white/10 rounded-2xl bg-[#0d0e12] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-neutral-300">
                    <thead className="bg-[#12141c] text-[10px] uppercase font-black text-neutral-400 border-b border-white/10 tracking-wider">
                      <tr>
                        <th className="p-3.5">Poster & Title</th>
                        <th className="p-3.5">Stream Play Link</th>
                        <th className="p-3.5">Director</th>
                        <th className="p-3.5">Year</th>
                        <th className="p-3.5">IMDb</th>
                        <th className="p-3.5">Genres</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-semibold">
                      {movies
                        .filter((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.director.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((m) => {
                          const streamUrl = m.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
                          return (
                            <tr key={m.id} className="hover:bg-white/5 transition">
                              <td className="p-3.5 flex items-center gap-3">
                                <img src={m.posterUrl} alt={m.title} className="w-10 h-14 rounded-lg object-cover border border-white/10 shrink-0" />
                                <div>
                                  <div className="font-bold text-white text-sm">{m.title}</div>
                                  <div className="text-[10px] text-neutral-400 truncate max-w-xs">{m.tagline}</div>
                                </div>
                              </td>
                              <td className="p-3.5">
                                <div className="flex items-center gap-2 max-w-xs">
                                  <code className="text-[10px] text-emerald-400 font-mono bg-black/60 px-2 py-1 rounded border border-white/10 truncate">
                                    {streamUrl}
                                  </code>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(streamUrl);
                                      showToast(`📋 Copied stream link for ${m.title}`);
                                    }}
                                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-neutral-300 transition shrink-0"
                                    title="Copy Stream URL"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <a
                                    href={streamUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 rounded bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition shrink-0"
                                    title="Test Stream Link in New Tab"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                  </a>
                                </div>
                              </td>
                              <td className="p-3.5 text-neutral-300">{m.director}</td>
                              <td className="p-3.5 text-neutral-300">{m.releaseYear}</td>
                              <td className="p-3.5 text-amber-400 font-bold">★ {m.imdbRating}</td>
                              <td className="p-3.5">
                                <div className="flex flex-wrap gap-1">
                                  {m.genres.slice(0, 2).map((g) => (
                                    <span key={g} className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-bold">
                                      {g}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-3.5">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                  Live 4K HDR
                                </span>
                              </td>
                              <td className="p-3.5 text-right space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingMovie(m);
                                    setIsCreatingMovie(false);
                                    setFormTitle(m.title);
                                    setFormTagline(m.tagline);
                                    setFormSynopsis(m.synopsis);
                                    setFormPosterUrl(m.posterUrl);
                                    setFormBackdropUrl(m.backdropUrl);
                                    setFormTrailerYoutubeId(m.trailerYoutubeId);
                                    setFormDirector(m.director);
                                    setFormReleaseYear(m.releaseYear);
                                    setFormImdbRating(m.imdbRating);
                                    setFormGenres(m.genres.join(', '));
                                    setFormStreamUrl(m.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
                                    setActiveTab('upload');
                                  }}
                                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                                  title="Edit Entry"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMovie(m.id, m.title)}
                                  className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition"
                                  title="Delete Entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HERO & CURATOR MANAGER */}
          {activeTab === 'curator' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Homepage Hero & Curator Manager</h2>
                <p className="text-xs text-neutral-400">Drag or toggle titles featured on the top carousel slider and homepage shelves</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-[#0f1118] border border-white/10 space-y-4">
                  <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-red-500" /> Hero Carousel Featured Titles
                  </h3>

                  <div className="space-y-2">
                    {movies.map((m, idx) => (
                      <div key={m.id} className="p-3 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-neutral-500 text-sm">#{idx + 1}</span>
                          <img src={m.posterUrl} alt={m.title} className="w-8 h-10 rounded object-cover" />
                          <div>
                            <div className="font-bold text-white">{m.title}</div>
                            <div className="text-[10px] text-neutral-400">{m.director} ({m.releaseYear})</div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            showToast(`Toggled featured status for ${m.title}`);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            m.featured ? 'bg-red-600 text-white' : 'bg-white/10 text-neutral-400'
                          }`}
                        >
                          {m.featured ? 'Featured' : 'Standard'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0f1118] border border-white/10 space-y-4">
                  <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
                    <Layers className="w-4 h-4 text-red-500" /> Trending & Genre Shelf Order
                  </h3>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 text-xs">
                    <div className="flex items-center justify-between font-bold text-neutral-300">
                      <span>SHELF POSITION 1</span>
                      <span className="text-red-400 font-extrabold">Trending Now (Global)</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-neutral-300">
                      <span>SHELF POSITION 2</span>
                      <span className="text-amber-400 font-extrabold">4K Ultra HD Masters</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-neutral-300">
                      <span>SHELF POSITION 3</span>
                      <span className="text-cyan-400 font-extrabold">Christopher Nolan Collection</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LIVE TV MANAGER */}
          {activeTab === 'livetv' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">24/7 Live TV Channel Manager</h2>
                  <p className="text-xs text-neutral-400">Broadcast live channels, monitor viewers, and configure stream sources</p>
                </div>
                <button
                  onClick={async () => {
                    const name = prompt('Channel Name:', 'ACTION 24/7 ULTRA');
                    if (name) {
                      await fetch('/api/v1/admin/live-tv', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, category: 'Action' }),
                      });
                      fetchLiveChannels();
                      showToast('Live TV channel launched!');
                    }
                  }}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Live Stream
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {liveChannels.map((ch) => (
                  <div key={ch.id} className="p-5 rounded-2xl bg-[#0f1118] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE
                      </span>
                      <span className="text-xs text-neutral-400 font-bold">{ch.viewersCount?.toLocaleString()} Viewers</span>
                    </div>

                    <div className="text-base font-black text-white">{ch.name}</div>
                    <div className="text-xs text-neutral-400">Category: {ch.category}</div>

                    <button
                      onClick={() => showToast(`Monitoring stream health for ${ch.name}...`)}
                      className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition flex items-center justify-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5" /> Monitor Stream
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: AD CAMPAIGN MANAGER */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Advertisement & Pre-Roll Campaign Manager</h2>
                  <p className="text-xs text-neutral-400">Manage video ad spots, budgets, and click-through analytics</p>
                </div>
                <button
                  onClick={async () => {
                    const title = prompt('Campaign Title:', 'Samsung Odyssey G9 Monitor');
                    if (title) {
                      await fetch('/api/v1/admin/ads', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title, client: 'Samsung Electronics', budget: '$12,000' }),
                      });
                      fetchAdCampaigns();
                      showToast('Ad campaign created!');
                    }
                  }}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Ad Spot
                </button>
              </div>

              <div className="border border-white/10 rounded-2xl bg-[#0d0e12] overflow-hidden">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-[#12141c] text-[10px] uppercase font-black text-neutral-400 border-b border-white/10">
                    <tr>
                      <th className="p-3.5">Campaign Title</th>
                      <th className="p-3.5">Sponsor / Client</th>
                      <th className="p-3.5">Impressions</th>
                      <th className="p-3.5">Click Rate</th>
                      <th className="p-3.5">Budget</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-semibold">
                    {adCampaigns.map((ad) => (
                      <tr key={ad.id} className="hover:bg-white/5 transition">
                        <td className="p-3.5 font-bold text-white">{ad.title}</td>
                        <td className="p-3.5 text-neutral-400">{ad.client}</td>
                        <td className="p-3.5 text-white font-bold">{ad.impressions?.toLocaleString()}</td>
                        <td className="p-3.5 text-emerald-400 font-bold">{ad.clickRate}</td>
                        <td className="p-3.5 text-white">{ad.budget}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            {ad.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: USERS & SUBSCRIPTIONS MANAGER */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Customer Accounts & Subscriptions</h2>
                  <p className="text-xs text-neutral-400">Manage user accounts, passwords, subscription start/expiry dates, and access controls</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-xl bg-black/60 border border-white/10 flex items-center text-xs">
                    <button
                      onClick={() => setUserTabMode('customers')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition ${
                        userTabMode === 'customers' ? 'bg-red-600 text-white shadow' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Customers ({customerUsers.length})
                    </button>
                    <button
                      onClick={() => setUserTabMode('admin_team')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition ${
                        userTabMode === 'admin_team' ? 'bg-red-600 text-white shadow' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Admin Team ({adminUsers.length})
                    </button>
                  </div>

                  {userTabMode === 'customers' && (
                    <button
                      onClick={() => setIsAddCustomerModalOpen(true)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/30 transition"
                    >
                      <Plus className="w-4 h-4" /> Add Customer Account
                    </button>
                  )}
                </div>
              </div>

              {/* CUSTOMER ACCOUNTS TABLE */}
              {userTabMode === 'customers' && (
                <div className="border border-white/10 rounded-2xl bg-[#0d0e12] overflow-hidden">
                  <table className="w-full text-left text-xs text-neutral-300">
                    <thead className="bg-[#12141c] text-[10px] uppercase font-black text-neutral-400 border-b border-white/10">
                      <tr>
                        <th className="p-3.5">Username</th>
                        <th className="p-3.5">Customer Name & Email</th>
                        <th className="p-3.5">Password</th>
                        <th className="p-3.5">Subscription Dates</th>
                        <th className="p-3.5">Days Left</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Active Device</th>
                        <th className="p-3.5 text-right">Subscription Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-semibold">
                      {customerUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-white/5 transition">
                          <td className="p-3.5 font-bold text-white">
                            <span className="font-mono text-red-400 bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded text-[11px]">
                              {u.username}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <div className="font-bold text-white">{u.name}</div>
                            <div className="text-[10px] text-neutral-400">{u.email}</div>
                          </td>

                          <td className="p-3.5 font-mono text-neutral-300 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-black/60 px-2 py-0.5 rounded border border-white/10 text-neutral-300 font-bold">
                                {u.rawPasswordForAdmin || 'Password123!'}
                              </span>
                              <button
                                onClick={() => handleResetCustomerPassword(u.id, u.username)}
                                className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white"
                                title="Reset Password"
                              >
                                <RefreshCw className="w-3 h-3" />
                              </button>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <div className="text-[11px] text-neutral-300 font-medium">Start: <span className="text-white font-bold">{u.subscriptionStartDate}</span></div>
                            <div className="text-[11px] text-red-400 font-bold">Expiry: {u.subscriptionExpiryDate}</div>
                          </td>

                          <td className="p-3.5 font-bold">
                            {u.daysRemaining < 0 ? (
                              <span className="text-red-400">Expired</span>
                            ) : (
                              <span className="text-emerald-400">{u.daysRemaining} days</span>
                            )}
                          </td>

                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              u.status === 'Active'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : u.status === 'Expired'
                                ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {u.status}
                            </span>
                          </td>

                          <td className="p-3.5 text-neutral-400 text-[11px]">
                            {u.activeDeviceName || 'No Session'}
                          </td>

                          <td className="p-3.5 text-right space-x-1.5">
                            <button
                              onClick={() => handleExtendSubscription(u.id, u.username, 30)}
                              className="px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold transition"
                              title="Add 30 Days"
                            >
                              +30 Days
                            </button>

                            <button
                              onClick={() => handleCustomExpiryDate(u.id, u.username, u.subscriptionExpiryDate)}
                              className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-neutral-200 text-[10px] font-bold transition"
                              title="Set Custom Date"
                            >
                              Set Date
                            </button>

                            <button
                              onClick={() => handleToggleCustomerStatus(u.id, u.username, u.status)}
                              className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold transition"
                            >
                              {u.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>

                            <button
                              onClick={() => handleDeleteCustomer(u.id, u.username)}
                              className="p-1 rounded bg-red-600/20 hover:bg-red-600/40 text-red-400 text-[10px] transition"
                              title="Delete Customer Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ADMIN TEAM TABLE */}
              {userTabMode === 'admin_team' && (
                <div className="border border-white/10 rounded-2xl bg-[#0d0e12] overflow-hidden">
                  <table className="w-full text-left text-xs text-neutral-300">
                    <thead className="bg-[#12141c] text-[10px] uppercase font-black text-neutral-400 border-b border-white/10">
                      <tr>
                        <th className="p-3.5">User Name</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Assigned Role</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Last Login</th>
                        <th className="p-3.5 text-right">Role Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-semibold">
                      {adminUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-white/5 transition">
                          <td className="p-3.5 font-bold text-white flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-red-600/20 border border-red-600/40 text-red-400 flex items-center justify-center text-xs font-bold">
                              {u.name.charAt(0)}
                            </div>
                            <span>{u.name}</span>
                          </td>
                          <td className="p-3.5 text-neutral-400">{u.email}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-red-600/20 border border-red-600/40 text-red-400 text-[10px] font-black uppercase">
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-neutral-400">{u.lastLogin}</td>
                          <td className="p-3.5 text-right space-x-2">
                            <select
                              value={u.role}
                              onChange={(e) => handleUpdateUserRole(u.id, e.target.value as any)}
                              className="bg-black/60 border border-white/15 text-neutral-300 text-[11px] rounded-lg px-2 py-1 focus:outline-none"
                            >
                              <option value="Super Admin">Super Admin</option>
                              <option value="Movie Manager">Movie Manager</option>
                              <option value="Content Editor">Content Editor</option>
                              <option value="Moderator">Moderator</option>
                              <option value="Support">Support</option>
                            </select>

                            <button
                              onClick={() => handleToggleUserStatus(u.id, u.status)}
                              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 text-[10px] font-bold"
                            >
                              {u.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ADD CUSTOMER MODAL */}
          {isAddCustomerModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-[#0d0e14] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 text-left relative">
                <button
                  onClick={() => setIsAddCustomerModalOpen(false)}
                  className="absolute right-4 top-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <User className="w-5 h-5 text-red-500" /> Add Customer Account
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Create credentials and set subscription validity dates manually
                  </p>
                </div>

                <form onSubmit={handleCreateCustomer} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-neutral-300 tracking-wider">Username *</label>
                    <input
                      type="text"
                      required
                      value={newCustUsername}
                      onChange={(e) => setNewCustUsername(e.target.value)}
                      placeholder="e.g. user001"
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-neutral-300 tracking-wider">Password *</label>
                    <input
                      type="text"
                      required
                      value={newCustPassword}
                      onChange={(e) => setNewCustPassword(e.target.value)}
                      placeholder="e.g. Password123!"
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-red-600 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase text-neutral-300 tracking-wider">Customer Name</label>
                      <input
                        type="text"
                        value={newCustName}
                        onChange={(e) => setNewCustName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase text-neutral-300 tracking-wider">Email (Optional)</label>
                      <input
                        type="email"
                        value={newCustEmail}
                        onChange={(e) => setNewCustEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase text-neutral-300 tracking-wider">Start Date</label>
                      <input
                        type="date"
                        required
                        value={newCustStartDate}
                        onChange={(e) => setNewCustStartDate(e.target.value)}
                        className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase text-neutral-300 tracking-wider">Expiry Date *</label>
                      <input
                        type="date"
                        required
                        value={newCustExpiryDate}
                        onChange={(e) => setNewCustExpiryDate(e.target.value)}
                        className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none text-red-400 font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-lg shadow-red-600/30 uppercase tracking-wider transition"
                  >
                    Save & Activate Subscription
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 8: REVENUE ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Financial & Subscription Analytics</h2>
                <p className="text-xs text-neutral-400">Monthly recurring revenue (MRR), subscriber churn, and tier distribution</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#0f1118] border border-white/10 space-y-2">
                  <span className="text-xs text-neutral-400 font-bold uppercase">PREMIUM 4K ULTRA TIER</span>
                  <div className="text-2xl font-black text-white">68,400 Users</div>
                  <div className="text-xs text-emerald-400 font-bold">$1,368,000 / month</div>
                </div>
                <div className="p-5 rounded-2xl bg-[#0f1118] border border-white/10 space-y-2">
                  <span className="text-xs text-neutral-400 font-bold uppercase">STANDARD 1080P TIER</span>
                  <div className="text-2xl font-black text-white">52,100 Users</div>
                  <div className="text-xs text-emerald-400 font-bold">$781,500 / month</div>
                </div>
                <div className="p-5 rounded-2xl bg-[#0f1118] border border-white/10 space-y-2">
                  <span className="text-xs text-neutral-400 font-bold uppercase">BASIC PASS TIER</span>
                  <div className="text-2xl font-black text-white">28,420 Users</div>
                  <div className="text-xs text-emerald-400 font-bold">$255,780 / month</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SECURITY LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Security Audit & OAuth Access Logs</h2>
                <p className="text-xs text-neutral-400">Audit trail of admin sign-ins, content edits, and system security events</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0d0e12] border border-white/10 space-y-3 text-xs font-mono">
                <div className="p-3 bg-black/60 rounded-xl border border-white/10 flex items-center justify-between text-emerald-400 font-bold">
                  <span>[2026-07-25 10:14:10] ADMIN_LOGIN: admin@cineverse.com authorized from IP 192.168.1.104</span>
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">SUCCESS</span>
                </div>
                <div className="p-3 bg-black/60 rounded-xl border border-white/10 flex items-center justify-between text-neutral-300">
                  <span>[2026-07-25 09:42:18] CONTENT_CREATE: Movie "Dune: Part Two" master entry updated</span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">CMS_UPDATE</span>
                </div>
                <div className="p-3 bg-black/60 rounded-xl border border-white/10 flex items-center justify-between text-amber-300">
                  <span>[2026-07-25 08:12:04] ROLE_CHANGE: User "Sophia Chen" elevated to Content Editor</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">AUDIT</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: CMS SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">CMS Platform & Watermark Settings</h2>
                <p className="text-xs text-neutral-400">System parameters, DRM encryption flags, and video watermark overlays</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0f1118] border border-white/10 space-y-4 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <div>
                    <div className="font-bold text-white">DRM Stream Protection (Widevine L1 / FairPlay)</div>
                    <div className="text-[10px] text-neutral-400">Enforce hardware decryption for 4K streams</div>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-red-600 w-4 h-4" />
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <div>
                    <div className="font-bold text-white">Dynamic Invisible Watermarking</div>
                    <div className="text-[10px] text-neutral-400">Embed subscriber ID into video frames to prevent piracy</div>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-red-600 w-4 h-4" />
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <div>
                    <div className="font-bold text-white">Auto-Transcoding Pipeline</div>
                    <div className="text-[10px] text-neutral-400">Automatically generate 1080p and 720p HLS variants on upload</div>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-red-600 w-4 h-4" />
                </div>

                <button
                  onClick={() => showToast('CMS System settings saved successfully!')}
                  className="w-full py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition uppercase shadow-lg shadow-red-600/30"
                >
                  Save System Configuration
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
