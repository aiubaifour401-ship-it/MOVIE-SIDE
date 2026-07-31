import React, { useState } from 'react';
import { Settings, X, Tv, Smartphone, Plus, Monitor, Shield, Trash2, Check, RefreshCw, Cpu, Wifi, Key } from 'lucide-react';
import { UserDevice } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearWatchHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onClearWatchHistory,
}) => {
  const [quality, setQuality] = useState('4K Ultra HD');
  const [fpsMode, setFpsMode] = useState('60 FPS Sports Sync');
  const [audioFormat, setAudioFormat] = useState('Dolby Atmos Spatial');
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [subtitleLang, setSubtitleLang] = useState('English');
  const [dataSaver, setDataSaver] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Device Add System state
  const [devices, setDevices] = useState<UserDevice[]>([
    {
      id: 'd1',
      deviceName: 'Chrome Browser (MacBook Pro M3)',
      deviceType: 'desktop',
      browser: 'Chrome 126',
      os: 'macOS Sonoma',
      ipAddress: '103.112.44.12',
      location: 'Dhaka, Bangladesh',
      lastActive: 'Active Now',
      currentSession: true,
      trusted: true,
    },
    {
      id: 'd2',
      deviceName: 'Samsung Galaxy S24 Ultra',
      deviceType: 'mobile',
      browser: 'Cineverse App v4.2',
      os: 'Android 14',
      ipAddress: '103.112.44.89',
      location: 'Dhaka, Bangladesh',
      lastActive: '15 mins ago',
      currentSession: false,
      trusted: true,
    },
    {
      id: 'd3',
      deviceName: 'LG OLED 4K Smart TV',
      deviceType: 'tv',
      browser: 'webOS TV 6.0',
      os: 'webOS',
      ipAddress: '103.112.44.201',
      location: 'Living Room TV',
      lastActive: 'Yesterday',
      currentSession: false,
      trusted: true,
    }
  ]);

  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState<'tv' | 'mobile' | 'desktop' | 'tablet'>('tv');
  const [pairingCode, setPairingCode] = useState('');
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleGeneratePairingCode = () => {
    const code = 'CV-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    setPairingCode(code);
    showToast(`Device Pairing Code Generated: ${code}`);
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;

    const newDev: UserDevice = {
      id: 'dev_' + Date.now(),
      deviceName: newDeviceName.trim(),
      deviceType: newDeviceType,
      browser: 'Cineverse App v4.5',
      os: newDeviceType === 'tv' ? 'Android TV 13' : newDeviceType === 'mobile' ? 'iOS 18 / Android' : 'Windows 11 / macOS',
      ipAddress: `103.112.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}`,
      location: 'Registered Device',
      lastActive: 'Just Now',
      currentSession: false,
      trusted: true,
    };

    setDevices([newDev, ...devices]);
    setNewDeviceName('');
    setShowAddDeviceModal(false);
    showToast(`🎉 "${newDev.deviceName}" added to your device registry!`);
  };

  const handleRemoveDevice = (id: string, name: string) => {
    setDevices(devices.filter(d => d.id !== id));
    showToast(`Device "${name}" logged out and removed.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0b0c10] rounded-3xl border border-red-600/30 shadow-2xl p-5 sm:p-8 text-white space-y-6 max-h-[92vh] overflow-y-auto">
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-2xl border border-emerald-400/30 animate-in fade-in">
            {toast}
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600/20 rounded-2xl border border-red-500/30 text-red-500">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Quality & Device Control Center</h2>
              <p className="text-xs text-neutral-400">Configure playback bitrates, frame rates, and manage connected streaming screens</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. QUALITY SYSTEM CONTROL PANEL */}
        <div className="bg-[#12141c] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-red-500" />
              <h3 className="text-sm font-black uppercase tracking-wider text-white">Video Quality & Streaming System</h3>
            </div>
            <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
              Active Mode: {quality}
            </span>
          </div>

          {/* Quality Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: '4K Ultra HD', spec: '2160p • 25 Mbps', tag: 'Best Quality' },
              { label: '1080p Full HD', spec: '1080p • 8 Mbps', tag: 'Recommended' },
              { label: '720p HD', spec: '720p • 3.5 Mbps', tag: 'Standard' },
              { label: '480p SD', spec: '480p • 1.5 Mbps', tag: 'Data Saver' },
            ].map((q) => (
              <button
                key={q.label}
                onClick={() => {
                  setQuality(q.label);
                  showToast(`Default stream quality updated to ${q.label}`);
                }}
                className={`p-3 rounded-2xl text-left border transition flex flex-col justify-between space-y-1 ${
                  quality === q.label
                    ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20'
                    : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                }`}
              >
                <div>
                  <span className="text-xs font-black block">{q.label}</span>
                  <span className="text-[10px] text-neutral-400 block">{q.spec}</span>
                </div>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded w-fit ${
                  quality === q.label ? 'bg-white text-red-600' : 'bg-white/10 text-neutral-400'
                }`}>
                  {q.tag}
                </span>
              </button>
            ))}
          </div>

          {/* Audio & Frame Rate Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">Audio System</span>
                <span className="text-[11px] text-neutral-400">Spatial Audio output format</span>
              </div>
              <select
                value={audioFormat}
                onChange={(e) => {
                  setAudioFormat(e.target.value);
                  showToast(`Audio format set to ${e.target.value}`);
                }}
                className="bg-[#1a1c26] border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white"
              >
                <option value="Dolby Atmos Spatial">Dolby Atmos Spatial</option>
                <option value="5.1 Surround Sound">5.1 Surround</option>
                <option value="Stereo Lossless">Stereo Lossless</option>
              </select>
            </div>

            <div className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">Sports & Film Frame Rate</span>
                <span className="text-[11px] text-neutral-400">Sync with display Hz</span>
              </div>
              <select
                value={fpsMode}
                onChange={(e) => {
                  setFpsMode(e.target.value);
                  showToast(`Frame rate set to ${e.target.value}`);
                }}
                className="bg-[#1a1c26] border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white"
              >
                <option value="60 FPS Sports Sync">60 FPS Live Sports</option>
                <option value="24 FPS Cinema Sync">24 FPS Cinema Film</option>
                <option value="Auto Adaptive FPS">Auto Adaptive</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. DEVICE ADD & MANAGEMENT SYSTEM */}
        <div className="bg-[#12141c] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Device Add & Screen Management</h3>
                <p className="text-[11px] text-neutral-400">Registered Screens: {devices.length} / 6 Active Slots</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGeneratePairingCode}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/10 flex items-center gap-1.5 transition"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>TV Code</span>
              </button>

              <button
                onClick={() => setShowAddDeviceModal(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Device</span>
              </button>
            </div>
          </div>

          {/* Pairing Code Banner */}
          {pairingCode && (
            <div className="p-3 bg-amber-500/15 border border-amber-500/40 rounded-xl flex items-center justify-between text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Enter this code on your Smart TV to instant link: <strong>{pairingCode}</strong></span>
              </div>
              <button onClick={() => setPairingCode('')} className="text-amber-400 hover:underline text-[10px] font-bold">
                Dismiss
              </button>
            </div>
          )}

          {/* Devices List */}
          <div className="space-y-2">
            {devices.map((dev) => (
              <div key={dev.id} className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/10 text-white">
                    {dev.deviceType === 'tv' ? <Tv className="w-5 h-5 text-red-400" /> : dev.deviceType === 'mobile' ? <Smartphone className="w-5 h-5 text-emerald-400" /> : <Monitor className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white flex items-center gap-2">
                      {dev.deviceName}
                      {dev.currentSession && <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold uppercase">This Device</span>}
                    </h4>
                    <p className="text-[10px] text-neutral-400">{dev.os} • {dev.browser} • IP: {dev.ipAddress}</p>
                  </div>
                </div>

                {!dev.currentSession && (
                  <button
                    onClick={() => handleRemoveDevice(dev.id, dev.deviceName)}
                    className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                    title="Logout device"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ADD NEW DEVICE POPUP FORM */}
        {showAddDeviceModal && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <form onSubmit={handleAddDevice} className="w-full max-w-md bg-[#161822] border border-white/20 rounded-3xl p-6 space-y-4 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="font-black text-sm uppercase tracking-wide flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" /> Add New Streaming Device
                </h4>
                <button type="button" onClick={() => setShowAddDeviceModal(false)} className="p-1 rounded-full bg-white/10">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Device Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Living Room Sony Bravia 4K TV"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    className="w-full bg-black/60 border border-white/20 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Device Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'tv', label: 'Smart TV' },
                      { id: 'mobile', label: 'Mobile' },
                      { id: 'tablet', label: 'Tablet' },
                      { id: 'desktop', label: 'PC / Mac' },
                    ].map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setNewDeviceType(t.id as any)}
                        className={`p-2 rounded-xl border text-[11px] font-bold text-center ${
                          newDeviceType === t.id ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-neutral-300'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDeviceModal(false)}
                  className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-black uppercase tracking-wider text-white"
                >
                  Register Device
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Clear Watch History & Footer */}
        <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClearWatchHistory();
              showToast('Watch history cleared successfully');
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Watch History</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-black text-xs uppercase tracking-wider transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

