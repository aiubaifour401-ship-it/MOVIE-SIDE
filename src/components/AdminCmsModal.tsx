import React, { useState } from 'react';
import {
  X, Database, Film, Users, TrendingUp, Plus, Trash2, Edit3, ShieldAlert,
  HardDrive, Server, Activity, CheckCircle, RefreshCw, Upload, Eye, Search, Layers
} from 'lucide-react';
import { Movie } from '../types';

interface AdminCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movies: Movie[];
  onAddMovie: (movie: Movie) => void;
  onUpdateMovie: (movie: Movie) => void;
  onDeleteMovie: (movieId: string) => void;
}

export const AdminCmsModal: React.FC<AdminCmsModalProps> = ({
  isOpen,
  onClose,
  movies,
  onAddMovie,
  onUpdateMovie,
  onDeleteMovie,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'movies' | 'users' | 'cdn'>('analytics');
  const [editingMovie, setEditingMovie] = useState<Partial<Movie> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // Form states for add/edit movie
  const [formTitle, setFormTitle] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formSynopsis, setFormSynopsis] = useState('');
  const [formPosterUrl, setFormPosterUrl] = useState('');
  const [formBackdropUrl, setFormBackdropUrl] = useState('');
  const [formTrailerYoutubeId, setFormTrailerYoutubeId] = useState('');
  const [formStreamUrl, setFormStreamUrl] = useState('');
  const [formDirector, setFormDirector] = useState('');
  const [formReleaseYear, setFormReleaseYear] = useState(2026);
  const [formImdbRating, setFormImdbRating] = useState(8.5);
  const [formGenres, setFormGenres] = useState('Sci-Fi, Action');

  if (!isOpen) return null;

  const handleOpenEdit = (m: Movie) => {
    setEditingMovie(m);
    setIsCreating(false);
    setFormTitle(m.title);
    setFormTagline(m.tagline);
    setFormSynopsis(m.synopsis);
    setFormPosterUrl(m.posterUrl);
    setFormBackdropUrl(m.backdropUrl);
    setFormTrailerYoutubeId(m.trailerYoutubeId);
    setFormStreamUrl(m.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
    setFormDirector(m.director);
    setFormReleaseYear(m.releaseYear);
    setFormImdbRating(m.imdbRating);
    setFormGenres(m.genres.join(', '));
  };

  const handleOpenCreate = () => {
    setEditingMovie(null);
    setIsCreating(true);
    setFormTitle('');
    setFormTagline('');
    setFormSynopsis('');
    setFormPosterUrl('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop');
    setFormBackdropUrl('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop');
    setFormTrailerYoutubeId('Way9Dexny3w');
    setFormStreamUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
    setFormDirector('Director Name');
    setFormReleaseYear(2026);
    setFormImdbRating(8.0);
    setFormGenres('Action, Drama');
  };

  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    const genreArray = formGenres.split(',').map((g) => g.trim()).filter(Boolean);

    if (isCreating) {
      const newM: Movie = {
        id: `movie-${Date.now()}`,
        title: formTitle,
        tagline: formTagline || 'Experience the epic saga.',
        synopsis: formSynopsis || 'A breathtaking cinematic masterpiece.',
        posterUrl: formPosterUrl,
        backdropUrl: formBackdropUrl,
        trailerYoutubeId: formTrailerYoutubeId,
        streamUrl: formStreamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        releaseYear: Number(formReleaseYear),
        imdbRating: Number(formImdbRating),
        rottenTomatoesScore: 90,
        runtimeMinutes: 120,
        director: formDirector,
        genres: genreArray,
        contentRating: 'PG-13',
        language: 'English',
        cast: [],
        reviews: [],
        featured: true,
      };
      onAddMovie(newM);
      setNotice(`Added "${newM.title}" to catalog successfully!`);
    } else if (editingMovie) {
      const updatedM: Movie = {
        ...(editingMovie as Movie),
        title: formTitle,
        tagline: formTagline,
        synopsis: formSynopsis,
        posterUrl: formPosterUrl,
        backdropUrl: formBackdropUrl,
        trailerYoutubeId: formTrailerYoutubeId,
        streamUrl: formStreamUrl,
        releaseYear: Number(formReleaseYear),
        imdbRating: Number(formImdbRating),
        director: formDirector,
        genres: genreArray,
      };
      onUpdateMovie(updatedM);
      setNotice(`Updated "${updatedM.title}" successfully!`);
    }

    setEditingMovie(null);
    setIsCreating(false);
    setTimeout(() => setNotice(null), 2500);
  };

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.director.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0b0c10] rounded-3xl border border-red-600/30 shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#12141a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-600 text-white font-black shadow-lg shadow-red-600/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black uppercase tracking-tight text-white">CINEPHILE Enterprise CMS</h2>
                <span className="px-2 py-0.5 bg-red-600/20 border border-red-600/40 text-red-400 text-[10px] font-black rounded-full uppercase">
                  v2.4.0-PRO
                </span>
              </div>
              <p className="text-xs text-neutral-400">Content Management, Real-Time Streaming Analytics & CDN Controller</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 transition"
            id="cms-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 bg-[#0f1117] px-4 text-xs font-bold uppercase tracking-wider overflow-x-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'analytics' ? 'border-red-600 text-white font-black' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
            id="tab-cms-analytics"
          >
            <TrendingUp className="w-4 h-4 text-red-500" />
            <span>Platform Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('movies')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'movies' ? 'border-red-600 text-white font-black' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
            id="tab-cms-movies"
          >
            <Film className="w-4 h-4 text-red-500" />
            <span>Movie & TV Catalog ({movies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'users' ? 'border-red-600 text-white font-black' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
            id="tab-cms-users"
          >
            <Users className="w-4 h-4 text-red-500" />
            <span>Subscribers & Devices</span>
          </button>

          <button
            onClick={() => setActiveTab('cdn')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'cdn' ? 'border-red-600 text-white font-black' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
            id="tab-cms-cdn"
          >
            <Server className="w-4 h-4 text-red-500" />
            <span>CDN & 4K Ingestion</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {notice && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>{notice}</span>
            </div>
          )}

          {/* TAB 1: REALTIME ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#12141c] border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Monthly Revenue</span>
                  <p className="text-2xl font-black text-white">$148,290</p>
                  <p className="text-[10px] font-bold text-emerald-400">↑ +14.2% from last month</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#12141c] border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Active Subscribers</span>
                  <p className="text-2xl font-black text-white">34,210</p>
                  <p className="text-[10px] font-bold text-emerald-400">● 4,120 active right now</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#12141c] border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">CDN Storage</span>
                  <p className="text-2xl font-black text-white">18.4 TB</p>
                  <p className="text-[10px] font-bold text-amber-400">36.8% of 50 TB quota</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#12141c] border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400">Streaming Uptime</span>
                  <p className="text-2xl font-black text-emerald-400">99.99%</p>
                  <p className="text-[10px] font-bold text-neutral-400">Dolby Atmos Ready</p>
                </div>
              </div>

              {/* Bandwidth & Popularity Graph Mock */}
              <div className="p-5 rounded-2xl bg-[#12141c] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Streaming Bandwidth (Gbps)</h3>
                  <span className="text-xs text-red-500 font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 animate-pulse" /> LIVE REGIONAL METRICS
                  </span>
                </div>

                <div className="h-32 flex items-end gap-1.5 pt-4">
                  {[35, 45, 60, 50, 75, 80, 95, 110, 90, 85, 120, 140, 130, 150, 165, 180, 175, 190, 210, 225, 240, 230, 260].map((val, idx) => (
                    <div key={idx} className="flex-1 bg-gradient-to-t from-red-900/40 to-red-600 rounded-t hover:bg-red-500 transition group relative" style={{ height: `${(val / 260) * 100}%` }}>
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black px-1.5 py-0.5 rounded text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap border border-white/20">
                        {val} Gbps
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MOVIE & TV CATALOG MANAGER */}
          {activeTab === 'movies' && (
            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search catalog titles or directors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleOpenCreate}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition shrink-0"
                  id="add-movie-cms-btn"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Movie / Series</span>
                </button>
              </div>

              {/* Add / Edit Form Modal inside CMS */}
              {(isCreating || editingMovie) && (
                <form onSubmit={handleSaveMovie} className="p-4 rounded-2xl bg-[#141620] border border-red-600/40 space-y-3 animate-in fade-in">
                  <h3 className="text-sm font-black text-red-400 uppercase">
                    {isCreating ? '➕ Upload New Movie Title' : `✏️ Edit: ${editingMovie?.title}`}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Director</label>
                      <input
                        type="text"
                        required
                        value={formDirector}
                        onChange={(e) => setFormDirector(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-red-400 block mb-1">Movie Play / Video Stream Link (.mp4 / .m3u8 / CDN URL)</label>
                      <input
                        type="url"
                        value={formStreamUrl}
                        onChange={(e) => setFormStreamUrl(e.target.value)}
                        placeholder="https://commondatastorage.googleapis.com/..."
                        className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">YouTube Trailer ID</label>
                      <input
                        type="text"
                        value={formTrailerYoutubeId}
                        onChange={(e) => setFormTrailerYoutubeId(e.target.value)}
                        placeholder="e.g. Way9Dexny3w"
                        className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Release Year</label>
                      <input
                        type="number"
                        required
                        value={formReleaseYear}
                        onChange={(e) => setFormReleaseYear(Number(e.target.value))}
                        className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">IMDb Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={formImdbRating}
                        onChange={(e) => setFormImdbRating(Number(e.target.value))}
                        className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Genres (comma separated)</label>
                      <input
                        type="text"
                        required
                        value={formGenres}
                        onChange={(e) => setFormGenres(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Synopsis</label>
                    <textarea
                      rows={2}
                      value={formSynopsis}
                      onChange={(e) => setFormSynopsis(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsCreating(false); setEditingMovie(null); }}
                      className="px-3 py-1.5 bg-white/10 text-xs font-bold rounded-lg hover:bg-white/20"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 shadow-md shadow-red-600/30"
                      id="save-movie-submit-btn"
                    >
                      Save Title
                    </button>
                  </div>
                </form>
              )}

              {/* Movie List Table */}
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#12141c]">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-[#181a26] text-white font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Title</th>
                      <th className="p-3">Director</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Genres</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredMovies.map((m) => (
                      <tr key={m.id} className="hover:bg-white/5 transition">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <img src={m.posterUrl} alt="" className="w-8 h-12 object-cover rounded border border-white/10" />
                          <div>
                            <p>{m.title}</p>
                            <span className="text-[10px] text-neutral-400">{m.releaseYear}</span>
                          </div>
                        </td>
                        <td className="p-3">{m.director}</td>
                        <td className="p-3 font-bold text-amber-400">⭐ {m.imdbRating}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {m.genres.slice(0, 2).map((g) => (
                              <span key={g} className="px-1.5 py-0.5 rounded bg-white/10 text-[9px]">
                                {g}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(m)}
                              className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white"
                              title="Edit Title"
                              id={`edit-movie-${m.id}`}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                onDeleteMovie(m.id);
                                setNotice(`Deleted "${m.title}" from database.`);
                                setTimeout(() => setNotice(null), 2000);
                              }}
                              className="p-1.5 rounded bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white"
                              title="Delete Title"
                              id={`delete-movie-${m.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: USER MANAGER */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#12141c] border border-white/10 space-y-3 text-xs">
                <h3 className="font-bold text-white uppercase">Subscriber Management</h3>
                <div className="space-y-2">
                  {[
                    { email: 'alex.cinephile@example.com', plan: 'Premium 4K', status: 'Active', devices: '3 Connected' },
                    { email: 'sarah.j@moviehub.com', plan: 'Standard HD', status: 'Active', devices: '1 Connected' },
                    { email: 'kaito.cinema@tokyo.jp', plan: 'Premium 4K', status: 'Active', devices: '4 Connected' },
                  ].map((usr, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{usr.email}</p>
                        <p className="text-[10px] text-neutral-400">Plan: {usr.plan} • {usr.devices}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        {usr.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CDN & INGESTION */}
          {activeTab === 'cdn' && (
            <div className="space-y-4 text-xs">
              <div className="p-5 rounded-2xl bg-[#12141c] border border-white/10 space-y-3">
                <h3 className="font-bold text-white uppercase">Cloudinary & AWS S3 Edge Endpoints</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <p className="font-bold text-red-400">Primary US-East CDN (Cloudflare)</p>
                    <p className="text-[10px] text-neutral-400">Latency: 12ms • Status: Operational</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <p className="font-bold text-red-400">Secondary EU-Central CDN (AWS CloudFront)</p>
                    <p className="text-[10px] text-neutral-400">Latency: 18ms • Status: Operational</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
