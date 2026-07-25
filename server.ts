import { GoogleGenAI, Type } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Mock Database for Auth Sessions & Devices
let activeSessions = [
  { id: 'sess_1', deviceName: 'MacBook Pro 16" (Current)', deviceType: 'desktop', browser: 'Chrome 126.0', os: 'macOS Sonoma', ipAddress: '192.168.1.104', location: 'San Francisco, CA, USA', lastActive: 'Just now', currentSession: true, trusted: true },
  { id: 'sess_2', deviceName: 'iPhone 15 Pro Max', deviceType: 'mobile', browser: 'Cineverse iOS App', os: 'iOS 17.5', ipAddress: '172.56.21.99', location: 'San Jose, CA, USA', lastActive: '12 mins ago', currentSession: false, trusted: true },
  { id: 'sess_3', deviceName: 'Apple TV 4K - Living Room', deviceType: 'tv', browser: 'Cineverse tvOS App', os: 'tvOS 17.4', ipAddress: '192.168.1.188', location: 'San Francisco, CA, USA', lastActive: '2 hours ago', currentSession: false, trusted: true },
  { id: 'sess_4', deviceName: 'LG OLED G3 65"', deviceType: 'tv', browser: 'webOS 23', ipAddress: '192.168.1.201', location: 'San Francisco, CA, USA', lastActive: 'Yesterday', currentSession: false, trusted: true }
];

let securityLogs = [
  { id: 'log_1', event: 'Google OAuth Single Sign-On Success', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), ipAddress: '192.168.1.104', location: 'San Francisco, USA', status: 'success' },
  { id: 'log_2', event: '2FA Verification Code Verified', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), ipAddress: '192.168.1.104', location: 'San Francisco, USA', status: 'success' },
  { id: 'log_3', event: 'New Device Registered (Apple TV 4K)', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), ipAddress: '192.168.1.188', location: 'San Francisco, USA', status: 'warning' },
];

// AUTH REST API ROUTES (/api/v1/auth)

// 1. User Registration
app.post("/api/v1/auth/register", (req, res) => {
  const { firstName, lastName, username, email, phone, password, country, dateOfBirth, gender, language } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: "Username, email, and password are required." });
  }

  // Validate password rules
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long." });
  }

  const token = `jwt_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const newUser = {
    id: `usr_${Date.now()}`,
    firstName: firstName || 'Cinephile',
    lastName: lastName || 'User',
    username,
    email,
    phone: phone || '+1 (555) 019-2831',
    country: country || 'United States',
    dateOfBirth: dateOfBirth || '1995-06-15',
    gender: gender || 'Unspecified',
    language: language || 'English',
    emailVerified: false,
    phoneVerified: false,
    twoFactorEnabled: false,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
  };

  securityLogs.unshift({
    id: `log_${Date.now()}`,
    event: `Account registered for ${email}`,
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.104',
    location: 'San Francisco, USA',
    status: 'success',
  });

  res.json({
    message: "User registered successfully! Verification email sent.",
    user: newUser,
    token,
    refreshToken: `ref_${Date.now()}_token`,
  });
});

// 2. Login Endpoint
app.post("/api/v1/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const token = `jwt_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  securityLogs.unshift({
    id: `log_${Date.now()}`,
    event: `Password login successful for ${email}`,
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.104',
    location: 'San Francisco, USA',
    status: 'success',
  });

  res.json({
    message: "Login successful.",
    token,
    user: {
      id: 'usr_main_101',
      name: 'Alex Cinephile',
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
    },
  });
});

// 3. Google & Social OAuth Endpoint
app.post("/api/v1/auth/google", (req, res) => {
  const { provider = 'Google' } = req.body;
  const token = `oauth_${provider.toLowerCase()}_${Date.now()}`;

  securityLogs.unshift({
    id: `log_${Date.now()}`,
    event: `${provider} OAuth sign-in verified`,
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.104',
    location: 'San Francisco, USA',
    status: 'success',
  });

  res.json({
    message: `Authenticated via ${provider} OAuth.`,
    token,
    user: {
      id: `usr_${provider.toLowerCase()}_123`,
      name: 'Alex (Master)',
      email: 'alex.cineverse@google.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
    }
  });
});

// 4. Send Phone OTP
app.post("/api/v1/auth/send-otp", (req, res) => {
  const { phone } = req.body;
  res.json({
    message: `6-digit OTP sent to ${phone || 'registered phone'}. Valid for 5 minutes.`,
    otpSessionId: `otp_sess_${Date.now()}`,
    expiresInSeconds: 300,
    demoCode: "882910"
  });
});

// 5. Verify Phone OTP
app.post("/api/v1/auth/verify-otp", (req, res) => {
  const { otp } = req.body;
  if (otp === "882910" || otp === "123456" || otp?.length === 6) {
    securityLogs.unshift({
      id: `log_${Date.now()}`,
      event: `Phone OTP verification passed`,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.104',
      location: 'San Francisco, USA',
      status: 'success',
    });
    return res.json({ verified: true, message: "Phone OTP verified successfully!" });
  }
  res.status(400).json({ verified: false, error: "Invalid OTP code provided." });
});

// 6. Send Email Verification
app.post("/api/v1/auth/send-email-verification", (req, res) => {
  const { email } = req.body;
  res.json({
    message: `Verification link & 6-digit code sent to ${email || 'your email'}.`,
    token: `verify_${Date.now()}`,
    code: "771923",
  });
});

// 7. Verify Email Code
app.post("/api/v1/auth/verify-email", (req, res) => {
  const { code } = req.body;
  if (code === "771923" || code === "123456" || code?.length === 6) {
    return res.json({ verified: true, message: "Email address verified!" });
  }
  res.status(400).json({ verified: false, error: "Invalid verification token." });
});

// 8. Forgot Password
app.post("/api/v1/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  res.json({
    message: `Password reset instructions sent to ${email}. Check inbox or spam.`,
  });
});

// 9. Get Active Sessions / Devices
app.get("/api/v1/auth/sessions", (_req, res) => {
  res.json({ sessions: activeSessions });
});

// 10. Revoke Device Session
app.delete("/api/v1/auth/sessions/:id", (req, res) => {
  const { id } = req.params;
  activeSessions = activeSessions.filter((s) => s.id !== id);
  res.json({ message: "Device session revoked successfully.", sessions: activeSessions });
});

// 11. Revoke All Other Sessions
app.delete("/api/v1/auth/sessions-all", (_req, res) => {
  activeSessions = activeSessions.filter((s) => s.currentSession);
  res.json({ message: "All other active sessions have been logged out.", sessions: activeSessions });
});

// 12. Security Audit Logs
app.get("/api/v1/user/security-logs", (_req, res) => {
  res.json({ logs: securityLogs });
});

// ==========================================
// USER REST API ENDPOINTS (/api/v1/user/*)
// ==========================================

// Initial Movie Catalog Data Store
let catalogMovies = [
  {
    id: "dune-part-two",
    title: "Dune: Part Two",
    tagline: "Long live the fighters.",
    synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
    trailerYoutubeId: "Way9Dexny3w",
    releaseYear: 2024,
    imdbRating: 8.6,
    rottenTomatoesScore: 93,
    runtimeMinutes: 166,
    director: "Denis Villeneuve",
    genres: ["Sci-Fi", "Adventure", "Action"],
    contentRating: "PG-13",
    language: "English",
    audioLanguages: ["English Dolby Atmos", "Spanish 5.1", "French 5.1", "Bengali Stereo"],
    subtitles: ["English CC", "Spanish", "French", "Bengali"],
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop" },
      { name: "Zendaya", role: "Chani", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop" }
    ],
    reviews: [
      { id: "r1", userName: "Marcus Vance", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop", rating: 5, date: "March 2024", comment: "A generational sci-fi masterpiece. Villeneuve's vision is unmatched." }
    ],
    featured: true,
    trendingOrder: 1,
    recommendedOrder: 1,
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
  {
    id: "interstellar",
    title: "Interstellar",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    synopsis: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop",
    trailerYoutubeId: "zSWdZVtXT7E",
    releaseYear: 2014,
    imdbRating: 8.7,
    rottenTomatoesScore: 73,
    runtimeMinutes: 169,
    director: "Christopher Nolan",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    contentRating: "PG-13",
    language: "English",
    audioLanguages: ["English Dolby Atmos", "Spanish 5.1"],
    subtitles: ["English CC", "Spanish"],
    cast: [
      { name: "Matthew McConaughey", role: "Cooper", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop" }
    ],
    reviews: [],
    featured: true,
    trendingOrder: 2,
    recommendedOrder: 2,
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    tagline: "The world forever changes.",
    synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop",
    trailerYoutubeId: "uYPbbksJxIg",
    releaseYear: 2023,
    imdbRating: 8.9,
    rottenTomatoesScore: 93,
    runtimeMinutes: 180,
    director: "Christopher Nolan",
    genres: ["Biography", "Drama", "History"],
    contentRating: "R",
    language: "English",
    audioLanguages: ["English 5.1"],
    subtitles: ["English CC"],
    cast: [],
    reviews: [],
    featured: false,
    trendingOrder: 3,
    recommendedOrder: 3,
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  }
];

// Admin Users Store
let adminUsersList = [
  { id: "usr_super_1", name: "Elena Vance", email: "admin@cineverse.com", role: "Super Admin", status: "Active", lastLogin: "Just now", country: "USA" },
  { id: "usr_mod_2", name: "Marcus Thorne", email: "marcus.content@cineverse.com", role: "Movie Manager", status: "Active", lastLogin: "2 hours ago", country: "UK" },
  { id: "usr_editor_3", name: "Sophia Chen", email: "sophia.editor@cineverse.com", role: "Content Editor", status: "Active", lastLogin: "1 day ago", country: "Canada" },
  { id: "usr_sup_4", name: "David Kim", email: "david.support@cineverse.com", role: "Support", status: "Active", lastLogin: "3 days ago", country: "Germany" }
];

// Live TV Channels Store
let liveTvChannels = [
  { id: "ch_1", name: "CINEVERSE 4K PREMIER", category: "Movies 24/7", status: "Live", viewersCount: 14200, logoUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=200&auto=format&fit=crop" },
  { id: "ch_2", name: "SCI-FI & CYBERPUNK TV", category: "Sci-Fi", status: "Live", viewersCount: 8900, logoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop" },
  { id: "ch_3", name: "ACTION BLOCKBUSTER NETWORK", category: "Action", status: "Live", viewersCount: 22100, logoUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&auto=format&fit=crop" }
];

// Ad Campaigns Store
let adCampaigns = [
  { id: "ad_1", title: "Sony Bravia OLED 4K TV Spot", client: "Sony Electronics", impressions: 489200, clickRate: "3.4%", status: "Active", budget: "$15,000" },
  { id: "ad_2", title: "Sennheiser Ambeo Soundbar", client: "Sennheiser", impressions: 210400, clickRate: "2.8%", status: "Active", budget: "$8,500" }
];

// User Catalog Endpoint
app.get("/api/v1/user/movies", (_req, res) => {
  res.json({ movies: catalogMovies });
});

app.get("/api/v1/user/movies/:id", (req, res) => {
  const movie = catalogMovies.find((m) => m.id === req.params.id);
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  res.json({ movie });
});

// ==========================================
// ADMIN REST API ENDPOINTS (/api/v1/admin/*)
// ==========================================

// 1. Admin Authentication
app.post("/api/v1/auth/admin-login", (req, res) => {
  const { email, password, adminKey } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Admin email and security key/password required." });
  }

  // Accept any valid admin format or demo credentials
  const foundUser = adminUsersList.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
    id: `adm_${Date.now()}`,
    name: "Cineverse Administrator",
    email: email,
    role: "Super Admin",
    status: "Active",
    lastLogin: "Just now",
    country: "United States"
  };

  const adminToken = `admin_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  securityLogs.unshift({
    id: `log_${Date.now()}`,
    event: `ADMIN CMS LOGIN SUCCESSFUL: ${email} (${foundUser.role})`,
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.104',
    location: 'San Francisco, USA (Admin Terminal)',
    status: 'success',
  });

  res.json({
    message: "Admin CMS Authentication Granted.",
    token: adminToken,
    adminUser: foundUser,
  });
});

// 2. Admin Dashboard Overview Metrics
app.get("/api/v1/admin/dashboard", (_req, res) => {
  res.json({
    metrics: {
      totalSubscribers: 148920,
      monthlyRevenue: "$482,900",
      activeConcurrentStreams: 34210,
      cdnBandwidthGbps: "184.2 Gbps",
      bufferHealthPercent: 99.8,
      totalMovies: catalogMovies.length,
      totalTvSeries: 48,
      serverUptime: "99.99%",
    },
    recentAdminLogs: securityLogs.slice(0, 10),
  });
});

// 3. Admin Movie Catalog CRUD
app.get("/api/v1/admin/movies", (_req, res) => {
  res.json({ movies: catalogMovies });
});

app.post("/api/v1/admin/movies", (req, res) => {
  const newM = req.body;
  if (!newM.title) {
    return res.status(400).json({ error: "Title is required for CMS movie creation." });
  }

  const createdMovie = {
    id: newM.id || `movie-${Date.now()}`,
    title: newM.title,
    tagline: newM.tagline || "Experience the epic cinematic journey.",
    synopsis: newM.synopsis || "A masterfully crafted narrative.",
    posterUrl: newM.posterUrl || "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop",
    backdropUrl: newM.backdropUrl || "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop",
    trailerYoutubeId: newM.trailerYoutubeId || "Way9Dexny3w",
    releaseYear: Number(newM.releaseYear) || 2026,
    imdbRating: Number(newM.imdbRating) || 8.0,
    rottenTomatoesScore: Number(newM.rottenTomatoesScore) || 85,
    runtimeMinutes: Number(newM.runtimeMinutes) || 120,
    director: newM.director || "Unknown Director",
    genres: Array.isArray(newM.genres) ? newM.genres : (newM.genres ? newM.genres.split(',') : ["Drama"]),
    contentRating: newM.contentRating || "PG-13",
    language: newM.language || "English",
    audioLanguages: newM.audioLanguages || ["English Dolby Atmos"],
    subtitles: newM.subtitles || ["English CC"],
    cast: newM.cast || [],
    reviews: [],
    featured: newM.featured || false,
    trendingOrder: catalogMovies.length + 1,
    recommendedOrder: catalogMovies.length + 1,
    streamUrl: newM.streamUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  };

  catalogMovies.unshift(createdMovie);

  securityLogs.unshift({
    id: `log_${Date.now()}`,
    event: `CMS: Created new content entry "${createdMovie.title}"`,
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.104',
    location: 'San Francisco, USA',
    status: 'success',
  });

  res.json({ message: "Movie created in CMS database.", movie: createdMovie, catalog: catalogMovies });
});

app.put("/api/v1/admin/movies/:id", (req, res) => {
  const { id } = req.params;
  const index = catalogMovies.findIndex((m) => m.id === id);
  if (index === -1) return res.status(404).json({ error: "Movie not found" });

  catalogMovies[index] = { ...catalogMovies[index], ...req.body };
  res.json({ message: "Movie updated in CMS.", movie: catalogMovies[index], catalog: catalogMovies });
});

app.delete("/api/v1/admin/movies/:id", (req, res) => {
  const { id } = req.params;
  const target = catalogMovies.find((m) => m.id === id);
  catalogMovies = catalogMovies.filter((m) => m.id !== id);

  securityLogs.unshift({
    id: `log_${Date.now()}`,
    event: `CMS: Deleted content entry "${target?.title || id}"`,
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.104',
    location: 'San Francisco, USA',
    status: 'warning',
  });

  res.json({ message: "Movie deleted from CMS catalog.", catalog: catalogMovies });
});

// 4. Admin Users & Permissions
app.get("/api/v1/admin/users", (_req, res) => {
  res.json({ users: adminUsersList });
});

app.put("/api/v1/admin/users/:id/role", (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = adminUsersList.find((u) => u.id === id);
  if (user) {
    user.role = role;
  }
  res.json({ message: "User role updated.", users: adminUsersList });
});

app.put("/api/v1/admin/users/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = adminUsersList.find((u) => u.id === id);
  if (user) {
    user.status = status;
  }
  res.json({ message: "User status updated.", users: adminUsersList });
});

// 5. Admin Live TV & Ad Campaigns
app.get("/api/v1/admin/live-tv", (_req, res) => {
  res.json({ channels: liveTvChannels });
});

app.post("/api/v1/admin/live-tv", (req, res) => {
  const newCh = { id: `ch_${Date.now()}`, viewersCount: 1200, status: 'Live', ...req.body };
  liveTvChannels.push(newCh);
  res.json({ message: "Live TV Channel added.", channels: liveTvChannels });
});

app.get("/api/v1/admin/ads", (_req, res) => {
  res.json({ campaigns: adCampaigns });
});

app.post("/api/v1/admin/ads", (req, res) => {
  const newAd = { id: `ad_${Date.now()}`, impressions: 0, clickRate: '0.0%', status: 'Active', ...req.body };
  adCampaigns.push(newAd);
  res.json({ message: "Ad Campaign initialized.", campaigns: adCampaigns });
});

// ============================================================================
// STREAMING INFRASTRUCTURE & MEDIA PROCESSING PIPELINE BACKEND ENGINE
// ============================================================================

// 1. DATABASE TABLES (In-Memory Enterprise Architecture Stores)
let media_files = [
  {
    fileId: "mf_dune2_orig",
    movieId: "dune-part-two",
    originalFilename: "Dune_Part_Two_4K_ProRes_Master.mov",
    fileSizeBytes: 148200000000, // 148.2 GB
    format: "MOV",
    codec: "ProRes 422 HQ",
    durationSeconds: 9960,
    status: "PROCESSED",
    storageLocationId: "stor_s3_us_east",
    uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    fileId: "mf_interstellar_orig",
    movieId: "interstellar",
    originalFilename: "Interstellar_IMAX_Master_DNxHR.mkv",
    fileSizeBytes: 182400000000, // 182.4 GB
    format: "MKV",
    codec: "DNxHR HQX",
    durationSeconds: 10140,
    status: "PROCESSED",
    storageLocationId: "stor_gcp_central",
    uploadedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  }
];

let video_versions = [
  { versionId: "vv_dune2_4320p", mediaFileId: "mf_dune2_orig", movieId: "dune-part-two", resolution: "4320p (8K)", bitrateKbps: 48000, fps: 60, codec: "AV1 / HEVC", fileSizeGB: 35.8, m3u8Path: "/api/stream/dune-part-two/8k/playlist.m3u8" },
  { versionId: "vv_dune2_2160p", mediaFileId: "mf_dune2_orig", movieId: "dune-part-two", resolution: "2160p (4K)", bitrateKbps: 22000, fps: 60, codec: "H.265 (HEVC)", fileSizeGB: 16.4, m3u8Path: "/api/stream/dune-part-two/4k/playlist.m3u8" },
  { versionId: "vv_dune2_1080p", mediaFileId: "mf_dune2_orig", movieId: "dune-part-two", resolution: "1080p", bitrateKbps: 8500, fps: 60, codec: "H.264 (AVC)", fileSizeGB: 6.2, m3u8Path: "/api/stream/dune-part-two/1080p/playlist.m3u8" },
  { versionId: "vv_dune2_720p",  mediaFileId: "mf_dune2_orig", movieId: "dune-part-two", resolution: "720p", bitrateKbps: 4500, fps: 60, codec: "H.264 (AVC)", fileSizeGB: 3.3, m3u8Path: "/api/stream/dune-part-two/720p/playlist.m3u8" },
  { versionId: "vv_dune2_480p",  mediaFileId: "mf_dune2_orig", movieId: "dune-part-two", resolution: "480p", bitrateKbps: 2100, fps: 30, codec: "H.264 (AVC)", fileSizeGB: 1.5, m3u8Path: "/api/stream/dune-part-two/480p/playlist.m3u8" },
  { versionId: "vv_dune2_360p",  mediaFileId: "mf_dune2_orig", movieId: "dune-part-two", resolution: "360p", bitrateKbps: 1100, fps: 30, codec: "H.264 (AVC)", fileSizeGB: 0.8, m3u8Path: "/api/stream/dune-part-two/360p/playlist.m3u8" },
  { versionId: "vv_dune2_240p",  mediaFileId: "mf_dune2_orig", movieId: "dune-part-two", resolution: "240p", bitrateKbps: 600,  fps: 24, codec: "H.264 (AVC)", fileSizeGB: 0.4, m3u8Path: "/api/stream/dune-part-two/240p/playlist.m3u8" },
];

let stream_variants = [
  { variantId: "var_dune2_8k", movieId: "dune-part-two", resolution: "7680x4320", bandwidth: 48000000, codecs: "av01.0.12M.08,mp4a.40.2", audioGroupId: "audio-main", subtitleGroupId: "sub-main" },
  { variantId: "var_dune2_4k", movieId: "dune-part-two", resolution: "3840x2160", bandwidth: 22000000, codecs: "hvc1.1.6.L150.B0,mp4a.40.2", audioGroupId: "audio-main", subtitleGroupId: "sub-main" },
  { variantId: "var_dune2_1080p", movieId: "dune-part-two", resolution: "1920x1080", bandwidth: 8500000, codecs: "avc1.64002a,mp4a.40.2", audioGroupId: "audio-main", subtitleGroupId: "sub-main" },
  { variantId: "var_dune2_720p", movieId: "dune-part-two", resolution: "1280x720", bandwidth: 4500000, codecs: "avc1.4d401f,mp4a.40.2", audioGroupId: "audio-main", subtitleGroupId: "sub-main" },
  { variantId: "var_dune2_480p", movieId: "dune-part-two", resolution: "854x480", bandwidth: 2100000, codecs: "avc1.4d401e,mp4a.40.2", audioGroupId: "audio-main", subtitleGroupId: "sub-main" },
  { variantId: "var_dune2_360p", movieId: "dune-part-two", resolution: "640x360", bandwidth: 1100000, codecs: "avc1.42c01e,mp4a.40.2", audioGroupId: "audio-main", subtitleGroupId: "sub-main" },
  { variantId: "var_dune2_240p", movieId: "dune-part-two", resolution: "426x240", bandwidth: 600000, codecs: "avc1.42c015,mp4a.40.2", audioGroupId: "audio-main", subtitleGroupId: "sub-main" },
];

let subtitles = [
  { id: "sub_dune2_en", movieId: "dune-part-two", language: "en", label: "English (CC)", fileFormat: "vtt", isDefault: true, url: "/api/subtitles/dune-part-two/en.vtt" },
  { id: "sub_dune2_es", movieId: "dune-part-two", language: "es", label: "Spanish (Español)", fileFormat: "vtt", isDefault: false, url: "/api/subtitles/dune-part-two/es.vtt" },
  { id: "sub_dune2_fr", movieId: "dune-part-two", language: "fr", label: "French (Français)", fileFormat: "vtt", isDefault: false, url: "/api/subtitles/dune-part-two/fr.vtt" },
  { id: "sub_dune2_bn", movieId: "dune-part-two", language: "bn", label: "Bengali (বাংলা)", fileFormat: "vtt", isDefault: false, url: "/api/subtitles/dune-part-two/bn.vtt" },
  { id: "sub_dune2_ja", movieId: "dune-part-two", language: "ja", label: "Japanese (日本語)", fileFormat: "vtt", isDefault: false, url: "/api/subtitles/dune-part-two/ja.vtt" },
];

let audio_tracks = [
  { id: "aud_dune2_en_atmos", movieId: "dune-part-two", language: "en", label: "English Dolby Atmos 7.1", channels: "7.1", codec: "E-AC-3 JOC", isDefault: true, url: "/api/audio/dune-part-two/en.m3u8" },
  { id: "aud_dune2_es_51", movieId: "dune-part-two", language: "es", label: "Spanish (Español) 5.1 Surround", channels: "5.1", codec: "AAC-LC", isDefault: false, url: "/api/audio/dune-part-two/es.m3u8" },
  { id: "aud_dune2_fr_51", movieId: "dune-part-two", language: "fr", label: "French (Français) 5.1 Surround", channels: "5.1", codec: "AAC-LC", isDefault: false, url: "/api/audio/dune-part-two/fr.m3u8" },
  { id: "aud_dune2_bn_20", movieId: "dune-part-two", language: "bn", label: "Bengali (বাংলা) Stereo", channels: "2.0", codec: "AAC-LC", isDefault: false, url: "/api/audio/dune-part-two/bn.m3u8" },
];

let upload_jobs = [
  { jobId: "job_up_99201", filename: "Oppenheimer_IMAX_4K_Master.mov", fileSizeBytes: 125000000000, format: "MOV", progressPercent: 100, status: "COMPLETED", createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), updatedAt: new Date().toISOString() },
  { jobId: "job_up_99202", filename: "The_Matrix_4K_HDR_Remaster.mkv", fileSizeBytes: 98000000000, format: "MKV", progressPercent: 100, status: "COMPLETED", createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), updatedAt: new Date().toISOString() },
];

let processing_jobs = [
  { jobId: "job_tc_1001", mediaFileId: "mf_dune2_orig", movieId: "dune-part-two", presetQualities: ["240p", "360p", "480p", "720p", "1080p", "2160p (4K)", "4320p (8K)"], status: "COMPLETED", progressPercent: 100, currentStep: "HLS Master Manifest Finalized & Signed CDN Ingestion Complete", logMessages: ["FFmpeg job spawned", "Extracted keyframes & wave audio", "Rendered 240p-8K ABR ladder", "Packaged HLS .ts segments", "Generated WebVTT sprite sheet", "CDN Sync Done"], priority: "HIGH", createdAt: new Date(Date.now() - 3600000 * 3).toISOString(), completedAt: new Date(Date.now() - 3600000 * 2.8).toISOString() },
];

let thumbnails = [
  { id: "thumb_dune2_poster", movieId: "dune-part-two", type: "poster", url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop", width: 1000, height: 1500 },
  { id: "thumb_dune2_backdrop", movieId: "dune-part-two", type: "backdrop", url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop", width: 1920, height: 1080 },
  { id: "thumb_dune2_sprite", movieId: "dune-part-two", type: "sprite", url: "/api/thumbnails/dune-part-two/sprite.vtt", width: 160, height: 90 },
  { id: "thumb_dune2_clip", movieId: "dune-part-two", type: "preview_clip", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", width: 1280, height: 720 },
];

let storage_locations = [
  { id: "stor_s3_us_east", provider: "AWS S3", region: "us-east-1 (N. Virginia)", bucket: "cineverse-media-master-primary", status: "HEALTHY", storageUsedGB: 4280.5, storageLimitGB: 50000 },
  { id: "stor_gcp_central", provider: "Google Cloud Storage", region: "us-central1 (Iowa)", bucket: "cineverse-4k-ingestion-bucket", status: "HEALTHY", storageUsedGB: 3120.2, storageLimitGB: 50000 },
  { id: "stor_backblaze_b2", provider: "Backblaze B2", region: "us-west-002", bucket: "cineverse-cold-archive-mkv", status: "HEALTHY", storageUsedGB: 18450.0, storageLimitGB: 100000 },
  { id: "stor_cloudinary", provider: "Cloudinary Dynamic CDN", region: "Global Edge", bucket: "cineverse-poster-transformations", status: "HEALTHY", storageUsedGB: 140.0, storageLimitGB: 2000 },
];

let cdn_assets = [
  { id: "cdn_cf_global", cdnProvider: "Cloudflare Stream", edgeDomain: "cdn-stream.cineverse.io", cacheHitRatio: "99.4%", bandwidthDeliveredGB: 148902, status: "ONLINE" },
  { id: "cdn_cloudfront_us", cdnProvider: "AWS CloudFront", edgeDomain: "d111111abcdef8.cloudfront.net", cacheHitRatio: "98.7%", bandwidthDeliveredGB: 98410, status: "ONLINE" },
  { id: "cdn_bunny_eu", cdnProvider: "BunnyCDN Europe", edgeDomain: "cineverse-eu.b-cdn.net", cacheHitRatio: "99.1%", bandwidthDeliveredGB: 64200, status: "ONLINE" },
  { id: "cdn_fastly_asia", cdnProvider: "Fastly Asia-Pacific", edgeDomain: "asia.cineverse-cdn.com", cacheHitRatio: "98.2%", bandwidthDeliveredGB: 41200, status: "ONLINE" },
];

// Helper: Simulate Transcoding Background Worker Job Execution
function startSimulatedTranscodingJob(jobId: string, mediaFileId: string, movieId: string) {
  let progress = 5;
  const steps = [
    "Validating Container Format & Audio/Video Codecs...",
    "Extracting Keyframes & Audio Waveform Analysis...",
    "Encoding 240p & 360p Low-Bandwidth MP4/H.264 Streams...",
    "Encoding 480p & 720p HD MP4/H.264 Streams...",
    "Encoding 1080p Full-HD 60fps Master Streams...",
    "Encoding 2160p (4K) & 4320p (8K) HEVC/AV1 HDR Streams...",
    "Segmenting TS/M4S Video Chunks (6.0s GOP interval)...",
    "Generating HLS Master (.m3u8) & MPEG-DASH (.mpd) Manifests...",
    "Generating WebVTT Thumbnail Sprite Maps & Animated Preview Clips...",
    "Distributing Assets across AWS S3 & Cloudflare CDN Edge Nodes...",
    "FFmpeg Processing Pipeline Completed Successfully."
  ];

  let stepIdx = 0;
  const interval = setInterval(() => {
    progress += 10;
    if (stepIdx < steps.length - 1) stepIdx++;
    
    const job = processing_jobs.find(j => j.jobId === jobId);
    if (job) {
      if (job.status === "PAUSED") return; // Paused execution
      if (job.status === "CANCELLED") {
        clearInterval(interval);
        return;
      }

      job.progressPercent = Math.min(progress, 100);
      job.currentStep = steps[stepIdx];
      job.logMessages.push(`[${new Date().toLocaleTimeString()}] ${steps[stepIdx]}`);

      if (progress >= 100) {
        job.status = "COMPLETED";
        job.completedAt = new Date().toISOString();
        
        // Update corresponding media file status
        const mf = media_files.find(m => m.fileId === mediaFileId);
        if (mf) mf.status = "PROCESSED";

        clearInterval(interval);
      }
    } else {
      clearInterval(interval);
    }
  }, 2500);
}


// 2. VIDEO UPLOAD PIPELINE ENDPOINTS
app.post("/api/admin/upload", (req, res) => {
  const { title, originalFilename, fileSizeBytes, format, movieId, customQualityPresets } = req.body;

  const allowedFormats = ["MP4", "MOV", "MKV", "AVI", "WEBM", "MPEG"];
  const fileExt = (format || originalFilename?.split('.').pop() || "MP4").toUpperCase();

  if (!allowedFormats.includes(fileExt)) {
    return res.status(400).json({
      error: `Unsupported media format: '${fileExt}'. Allowed formats: ${allowedFormats.join(", ")}`
    });
  }

  const generatedMovieId = movieId || title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `movie-${Date.now()}`;
  const mediaFileId = `mf_${Date.now()}`;
  const uploadJobId = `job_up_${Math.floor(10000 + Math.random() * 90000)}`;
  const transcodeJobId = `job_tc_${Math.floor(10000 + Math.random() * 90000)}`;

  // 1. Create Media File entry
  const newMediaFile = {
    fileId: mediaFileId,
    movieId: generatedMovieId,
    originalFilename: originalFilename || `${title || 'Uploaded_Movie'}.${fileExt.toLowerCase()}`,
    fileSizeBytes: Number(fileSizeBytes) || 45000000000,
    format: fileExt,
    codec: fileExt === "MOV" ? "ProRes 422" : "H.264 / AAC",
    durationSeconds: 7200,
    status: "PROCESSING",
    storageLocationId: "stor_s3_us_east",
    uploadedAt: new Date().toISOString(),
  };
  media_files.unshift(newMediaFile);

  // 2. Create Upload Job entry
  const newUploadJob = {
    jobId: uploadJobId,
    filename: newMediaFile.originalFilename,
    fileSizeBytes: newMediaFile.fileSizeBytes,
    format: fileExt,
    progressPercent: 100,
    status: "COMPLETED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  upload_jobs.unshift(newUploadJob);

  // 3. Create FFmpeg Processing Transcode Job entry
  const presets = customQualityPresets || ["240p", "360p", "480p", "720p", "1080p", "2160p (4K)"];
  const newTranscodeJob = {
    jobId: transcodeJobId,
    mediaFileId: mediaFileId,
    movieId: generatedMovieId,
    presetQualities: presets,
    status: "PROCESSING",
    progressPercent: 10,
    currentStep: "Initializing FFmpeg parallel encoding cluster...",
    logMessages: [
      `[${new Date().toLocaleTimeString()}] Master file uploaded successfully (${(newMediaFile.fileSizeBytes / 1e9).toFixed(2)} GB)`,
      `[${new Date().toLocaleTimeString()}] Created transcode job ${transcodeJobId}`
    ],
    priority: "HIGH",
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  processing_jobs.unshift(newTranscodeJob);

  // 4. Register HLS & DASH Stream Variants
  presets.forEach((resLabel: string) => {
    let resPx = "1920x1080";
    let bw = 8500000;
    if (resLabel.includes("240p")) { resPx = "426x240"; bw = 600000; }
    else if (resLabel.includes("360p")) { resPx = "640x360"; bw = 1100000; }
    else if (resLabel.includes("480p")) { resPx = "854x480"; bw = 2100000; }
    else if (resLabel.includes("720p")) { resPx = "1280x720"; bw = 4500000; }
    else if (resLabel.includes("4K")) { resPx = "3840x2160"; bw = 22000000; }
    else if (resLabel.includes("8K")) { resPx = "7680x4320"; bw = 48000000; }

    stream_variants.push({
      variantId: `var_${generatedMovieId}_${resLabel.replace(/[^a-z0-9]/gi, '')}`,
      movieId: generatedMovieId,
      resolution: resPx,
      bandwidth: bw,
      codecs: "avc1.64002a,mp4a.40.2",
      audioGroupId: "audio-main",
      subtitleGroupId: "sub-main",
    });

    video_versions.push({
      versionId: `vv_${generatedMovieId}_${resLabel.replace(/[^a-z0-9]/gi, '')}`,
      mediaFileId: mediaFileId,
      movieId: generatedMovieId,
      resolution: resLabel,
      bitrateKbps: Math.round(bw / 1000),
      fps: resLabel.includes("4K") ? 60 : 30,
      codec: resLabel.includes("4K") ? "HEVC" : "H.264",
      fileSizeGB: Number(((bw * 7200) / 8e9).toFixed(2)),
      m3u8Path: `/api/stream/${generatedMovieId}/${resLabel.toLowerCase().replace(/[^a-z0-9]/g, '')}/playlist.m3u8`
    });
  });

  // 5. Trigger Async Background Worker
  startSimulatedTranscodingJob(transcodeJobId, mediaFileId, generatedMovieId);

  res.json({
    message: "Master file uploaded & FFmpeg Transcoding Queue job spawned successfully!",
    uploadJob: newUploadJob,
    transcodeJob: newTranscodeJob,
    masterStreamUrl: `/api/stream/${generatedMovieId}/master.m3u8`,
    dashManifestUrl: `/api/stream/${generatedMovieId}/manifest.mpd`,
  });
});

app.get("/api/admin/upload/status", (_req, res) => {
  res.json({
    uploadJobs: upload_jobs,
    processingJobs: processing_jobs,
    activeTranscodingCount: processing_jobs.filter(j => j.status === "PROCESSING").length,
  });
});

app.get("/api/admin/upload/status/:jobId", (req, res) => {
  const { jobId } = req.params;
  const job = processing_jobs.find(j => j.jobId === jobId) || upload_jobs.find(j => j.jobId === jobId);
  if (!job) {
    return res.status(404).json({ error: `Job '${jobId}' not found.` });
  }
  res.json({ job });
});


// 3. FFMPEG TRANSCODING QUEUE MANAGEMENT ENDPOINTS
app.post("/api/admin/transcode", (req, res) => {
  const { movieId, mediaFileId, presets } = req.body;
  const jobId = `job_tc_${Math.floor(10000 + Math.random() * 90000)}`;

  const newTranscodeJob = {
    jobId: jobId,
    mediaFileId: mediaFileId || `mf_${Date.now()}`,
    movieId: movieId || "dune-part-two",
    presetQualities: presets || ["240p", "360p", "480p", "720p", "1080p", "2160p (4K)"],
    status: "PROCESSING",
    progressPercent: 5,
    currentStep: "Spawning FFmpeg worker instances...",
    logMessages: [`[${new Date().toLocaleTimeString()}] Manual transcode triggered`],
    priority: "HIGH",
    createdAt: new Date().toISOString(),
    completedAt: null,
  };

  processing_jobs.unshift(newTranscodeJob);
  startSimulatedTranscodingJob(jobId, newTranscodeJob.mediaFileId, newTranscodeJob.movieId);

  res.json({ message: "Transcoding job enqueued.", job: newTranscodeJob });
});

app.get("/api/admin/transcode/jobs", (_req, res) => {
  res.json({ jobs: processing_jobs });
});

app.post("/api/admin/transcode/jobs/:jobId/retry", (req, res) => {
  const { jobId } = req.params;
  const job = processing_jobs.find(j => j.jobId === jobId);
  if (!job) return res.status(404).json({ error: "Job not found." });

  job.status = "PROCESSING";
  job.progressPercent = 10;
  job.currentStep = "Retrying job execution...";
  job.logMessages.push(`[${new Date().toLocaleTimeString()}] Job re-queued by admin retry command`);
  startSimulatedTranscodingJob(job.jobId, job.mediaFileId, job.movieId);

  res.json({ message: `Job ${jobId} re-enqueued for encoding.`, job });
});

app.post("/api/admin/transcode/jobs/:jobId/pause", (req, res) => {
  const { jobId } = req.params;
  const job = processing_jobs.find(j => j.jobId === jobId);
  if (job) {
    job.status = "PAUSED";
    job.currentStep = "Transcoding paused by admin command";
  }
  res.json({ message: `Job ${jobId} paused.`, job });
});

app.post("/api/admin/transcode/jobs/:jobId/resume", (req, res) => {
  const { jobId } = req.params;
  const job = processing_jobs.find(j => j.jobId === jobId);
  if (job) {
    job.status = "PROCESSING";
    startSimulatedTranscodingJob(job.jobId, job.mediaFileId, job.movieId);
  }
  res.json({ message: `Job ${jobId} resumed.`, job });
});

app.delete("/api/admin/transcode/jobs/:jobId", (req, res) => {
  const { jobId } = req.params;
  const job = processing_jobs.find(j => j.jobId === jobId);
  if (job) {
    job.status = "CANCELLED";
  }
  res.json({ message: `Job ${jobId} cancelled.`, jobs: processing_jobs });
});


// 4. PRODUCTION HLS ADAPTIVE BITRATE STREAMING MANIFEST ENDPOINTS
app.get("/api/stream/:movieId/master.m3u8", (req, res) => {
  const { movieId } = req.params;
  
  // Real HLS Master Playlist Header & Spec Output
  let m3u8 = `#EXTM3U\n`;
  m3u8 += `#EXT-X-VERSION:6\n`;
  m3u8 += `#EXT-X-INDEPENDENT-SEGMENTS\n\n`;

  // Multi-Audio Tracks Definition
  m3u8 += `# AUDIO TRACKS\n`;
  audio_tracks.forEach((a) => {
    m3u8 += `#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio-main",NAME="${a.label}",DEFAULT=${a.isDefault ? "YES" : "NO"},AUTOSELECT=YES,LANGUAGE="${a.language}",URI="${a.url}"\n`;
  });
  m3u8 += `\n`;

  // Subtitles Tracks Definition
  m3u8 += `# SUBTITLE TRACKS\n`;
  subtitles.forEach((s) => {
    m3u8 += `#EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="sub-main",NAME="${s.label}",DEFAULT=${s.isDefault ? "YES" : "NO"},AUTOSELECT=YES,LANGUAGE="${s.language}",URI="${s.url}"\n`;
  });
  m3u8 += `\n`;

  // Stream Variants
  m3u8 += `# STREAM VARIANTS (ADAPTIVE BITRATE LADDER)\n`;
  const variants = stream_variants.filter(v => v.movieId === movieId || movieId === "dune-part-two");
  if (variants.length === 0) {
    // Default fallback ladder
    m3u8 += `#EXT-X-STREAM-INF:BANDWIDTH=22000000,RESOLUTION=3840x2160,CODECS="hvc1.1.6.L150.B0,mp4a.40.2",AUDIO="audio-main",SUBTITLES="sub-main"\n/api/stream/${movieId}/4k/playlist.m3u8\n`;
    m3u8 += `#EXT-X-STREAM-INF:BANDWIDTH=8500000,RESOLUTION=1920x1080,CODECS="avc1.64002a,mp4a.40.2",AUDIO="audio-main",SUBTITLES="sub-main"\n/api/stream/${movieId}/1080p/playlist.m3u8\n`;
    m3u8 += `#EXT-X-STREAM-INF:BANDWIDTH=4500000,RESOLUTION=1280x720,CODECS="avc1.4d401f,mp4a.40.2",AUDIO="audio-main",SUBTITLES="sub-main"\n/api/stream/${movieId}/720p/playlist.m3u8\n`;
  } else {
    variants.forEach((v) => {
      const tag = v.variantId.split('_').pop() || '1080p';
      m3u8 += `#EXT-X-STREAM-INF:BANDWIDTH=${v.bandwidth},RESOLUTION=${v.resolution},CODECS="${v.codecs}",AUDIO="${v.audioGroupId}",SUBTITLES="${v.subtitleGroupId}"\n/api/stream/${movieId}/${tag}/playlist.m3u8\n`;
    });
  }

  res.setHeader("Content-Type", "application/x-mpegURL");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(m3u8);
});

// Quality Variant Playlist Generator (e.g. 1080p playlist)
app.get("/api/stream/:movieId/:variant/playlist.m3u8", (req, res) => {
  const { movieId, variant } = req.params;

  let m3u8 = `#EXTM3U\n`;
  m3u8 += `#EXT-X-VERSION:3\n`;
  m3u8 += `#EXT-X-TARGETDURATION:6\n`;
  m3u8 += `#EXT-X-MEDIA-SEQUENCE:0\n`;
  m3u8 += `#EXT-X-PLAYLIST-TYPE:VOD\n\n`;

  // Generate 20 video segments (6 seconds each = 120 seconds sample chunk sequence)
  for (let i = 0; i < 20; i++) {
    m3u8 += `#EXTINF:6.000,\n`;
    m3u8 += `/api/stream/${movieId}/${variant}/segment-${i + 1}.ts?token=signed_exp_${Date.now() + 3600}\n`;
  }
  m3u8 += `#EXT-X-ENDLIST\n`;

  res.setHeader("Content-Type", "application/x-mpegURL");
  res.setHeader("Cache-Control", "no-cache");
  res.send(m3u8);
});

// Video Segment Streaming Endpoint
app.get("/api/stream/:movieId/:variant/segment-:segmentNum.ts", (_req, res) => {
  // Redirect or serve actual video stream chunk
  res.redirect("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4");
});


// 5. MPEG-DASH STREAMING MANIFEST ENDPOINT
app.get("/api/stream/:movieId/manifest.mpd", (req, res) => {
  const { movieId } = req.params;

  const mpdXml = `<?xml version="1.0" encoding="UTF-8"?>
<MPD xmlns="urn:mpeg:dash:schema:mpd:2011" profiles="urn:mpeg:dash:profile:isoff-on-demand:2011" type="static" mediaPresentationDuration="PT2H46M00S" minBufferTime="PT2.0S">
  <Period id="0" start="PT0S">
    <!-- Video Adaptation Set -->
    <AdaptationSet contentType="video" mimeType="video/mp4" codecs="avc1.64002a" subsegmentAlignment="true" subsegmentStartsWithSAP="1">
      <Representation id="2160p" bandwidth="22000000" width="3840" height="2160" frameRate="60">
        <BaseURL>/api/stream/${movieId}/4k/segment-0.ts</BaseURL>
      </Representation>
      <Representation id="1080p" bandwidth="8500000" width="1920" height="1080" frameRate="60">
        <BaseURL>/api/stream/${movieId}/1080p/segment-0.ts</BaseURL>
      </Representation>
      <Representation id="720p" bandwidth="4500000" width="1280" height="720" frameRate="60">
        <BaseURL>/api/stream/${movieId}/720p/segment-0.ts</BaseURL>
      </Representation>
    </AdaptationSet>
    <!-- Audio Adaptation Set -->
    <AdaptationSet contentType="audio" mimeType="audio/mp4" codecs="mp4a.40.2" lang="en">
      <Representation id="audio_en" bandwidth="320000" audioSamplingRate="48000">
        <AudioChannelConfiguration schemeIdUri="urn:mpeg:dash:23001:23001:channel_configuration:2011" value="6"/>
        <BaseURL>/api/audio/${movieId}/en.m3u8</BaseURL>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>`;

  res.setHeader("Content-Type", "application/dash+xml");
  res.send(mpdXml);
});


// 6. SUBTITLE & MULTI-AUDIO TRACK ENDPOINTS
app.get("/api/subtitles/:movieId/:lang.vtt", (req, res) => {
  const { movieId, lang } = req.params;

  const vttText = `WEBVTT - Cineverse Ultra HD Subtitle Stream [Movie: ${movieId}, Lang: ${lang.toUpperCase()}]

00:00:01.000 --> 00:00:04.500
[Deep cinematic synth swell playing in 7.1 Surround]

00:00:05.000 --> 00:00:09.200
Paul Atreides: "Power over spice is power over all."

00:00:10.000 --> 00:00:14.800
Chani: "Your journey has only just begun."

00:00:15.500 --> 00:00:20.000
[Fremen chanting in the desert sands]`;

  res.setHeader("Content-Type", "text/vtt");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(vttText);
});

app.get("/api/subtitles/:id", (req, res) => {
  const { id } = req.params;
  const sub = subtitles.find(s => s.id === id);
  if (!sub) return res.status(404).json({ error: "Subtitle track not found." });
  res.json({ subtitle: sub });
});

app.get("/api/audio/:id", (req, res) => {
  const { id } = req.params;
  const audio = audio_tracks.find(a => a.id === id);
  if (!audio) return res.status(404).json({ error: "Audio track not found." });
  res.json({ audioTrack: audio });
});


// 7. THUMBNAIL & IMAGE PROCESSING ENDPOINTS
app.get("/api/thumbnails/:id", (req, res) => {
  const { id } = req.params;
  const thumb = thumbnails.find(t => t.id === id || t.movieId === id);
  res.json({ thumbnail: thumb || thumbnails[0] });
});

app.post("/api/admin/thumbnails/generate", (req, res) => {
  const { movieId, posterUrl, backdropUrl } = req.body;

  const newPoster = { id: `thumb_${movieId}_poster`, movieId, type: "poster", url: posterUrl || "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop", width: 1000, height: 1500 };
  const newBackdrop = { id: `thumb_${movieId}_backdrop`, movieId, type: "backdrop", url: backdropUrl || "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop", width: 1920, height: 1080 };

  thumbnails.push(newPoster, newBackdrop);
  res.json({ message: "Automated thumbnails, sprite maps, and 10s preview clips generated.", thumbnails });
});


// 8. STREAMING SECURITY & SIGNED TOKEN ENDPOINTS
app.post("/api/stream/signed-token", (req, res) => {
  const { movieId, userId, clientIp, expiresMinutes = 120 } = req.body;

  const expiresTimestamp = Date.now() + expiresMinutes * 60 * 1000;
  const signedToken = `token_hmac_${Math.random().toString(36).substring(2, 12)}_${expiresTimestamp}`;

  res.json({
    movieId: movieId || "dune-part-two",
    signedToken,
    expiresAt: new Date(expiresTimestamp).toISOString(),
    protectedStreamUrl: `/api/stream/${movieId || 'dune-part-two'}/master.m3u8?token=${signedToken}`,
  });
});

app.get("/api/admin/cdn-config", (_req, res) => {
  res.json({
    storageLocations: storage_locations,
    cdnAssets: cdn_assets,
    activeCdnProvider: "Cloudflare Stream / AWS CloudFront",
  });
});

app.post("/api/admin/cdn-config", (req, res) => {
  const { provider, bucket, region } = req.body;
  if (provider) {
    storage_locations.unshift({
      id: `stor_${Date.now()}`,
      provider: provider,
      region: region || "us-east-1",
      bucket: bucket || "cineverse-custom-bucket",
      status: "HEALTHY",
      storageUsedGB: 0,
      storageLimitGB: 50000,
    });
  }
  res.json({ message: "CDN & Storage Location configuration updated.", storageLocations: storage_locations });
});


// 9. DATABASE EXPOSURE ENDPOINT (Inspect all 10 Streaming Infrastructure Tables)
app.get("/api/admin/media-tables", (_req, res) => {
  res.json({
    media_files,
    video_versions,
    stream_variants,
    subtitles,
    audio_tracks,
    upload_jobs,
    processing_jobs,
    thumbnails,
    storage_locations,
    cdn_assets,
  });
});




// AI Recommendation / Vibe Match Endpoint
app.post("/api/gemini/recommend", async (req, res) => {
  try {
    const { prompt, genres, mood, catalogSummary } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    const systemInstruction = `You are CineBot, an expert cinematic advisor and film critic. 
Your goal is to recommend the best movies based on user's prompt, mood, or genre preferences.
You can match movies from the provided catalog or recommend iconic external films if no perfect match exists in catalog.

Format response as JSON with:
- recommendationReason: string (A passionate 2-3 sentence pitch on why these fit)
- matchedCatalogIds: array of strings (IDs of movies from catalog if relevant)
- externalRecommendations: array of objects { title, year, director, genre, plot, whyWatch }
- vibeKeywords: array of strings (3-5 aesthetic tags describing the recommendation)`;

    const userQuery = `User Prompt: "${prompt || 'Suggest great movies'}"
Selected Mood: ${mood || 'Any'}
Preferred Genres: ${genres ? genres.join(', ') : 'Any'}

Available Catalog Summary:
${catalogSummary ? JSON.stringify(catalogSummary) : 'Standard movie database'}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userQuery,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendationReason: { type: Type.STRING },
            matchedCatalogIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            externalRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  year: { type: Type.NUMBER },
                  director: { type: Type.STRING },
                  genre: { type: Type.STRING },
                  plot: { type: Type.STRING },
                  whyWatch: { type: Type.STRING }
                },
                required: ["title", "year", "plot", "whyWatch"]
              }
            },
            vibeKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["recommendationReason", "matchedCatalogIds", "externalRecommendations", "vibeKeywords"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini recommendation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate recommendations" });
  }
});

// AI Deep Dive Review / Consensus Generator Endpoint
app.post("/api/gemini/review-summary", async (req, res) => {
  try {
    const { movieTitle, director, year, plot } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    const prompt = `Provide an insightful film analysis and consensus summary for the movie "${movieTitle}" (${year}), directed by ${director}.
Plot: ${plot}

Return JSON with:
- criticConsensus: string (Summary of critical reception)
- audienceVibe: string (How audience members feel about it)
- keyThemes: array of strings (Main thematic elements)
- standOutElements: array of strings (e.g. Cinematography, Score, Acting, Plot Twist)
- triviaFact: string (An interesting fun fact about the production or cast)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            criticConsensus: { type: Type.STRING },
            audienceVibe: { type: Type.STRING },
            keyThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
            standOutElements: { type: Type.ARRAY, items: { type: Type.STRING } },
            triviaFact: { type: Type.STRING }
          },
          required: ["criticConsensus", "audienceVibe", "keyThemes", "standOutElements", "triviaFact"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Gemini review error:", error);
    res.status(500).json({ error: error.message || "Failed to generate review analysis" });
  }
});

// AI Movie Trivia Generator Endpoint
app.post("/api/gemini/trivia", async (req, res) => {
  try {
    const { genre, difficulty } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    const prompt = `Generate 5 entertaining movie trivia questions for genre: "${genre || 'General Cinema'}", difficulty level: "${difficulty || 'medium'}".
Return JSON array of questions, each with:
- id: string
- question: string
- options: array of 4 strings
- correctIndex: number (0-3)
- explanation: string (Why the answer is correct and interesting trivia context)
- movieRelated: string`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  movieRelated: { type: Type.STRING }
                },
                required: ["id", "question", "options", "correctIndex", "explanation", "movieRelated"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Gemini trivia error:", error);
    res.status(500).json({ error: error.message || "Failed to generate trivia" });
  }
});

// ============================================================================
// ENTERPRISE SUBSCRIPTION & PAYMENT PLATFORM BACKEND ENGINE
// ============================================================================

// 1. DATABASE TABLES (In-Memory Enterprise Billing Data Stores)
let plans = [
  {
    id: "plan_guest",
    name: "Guest",
    tagline: "Explore free trailers & public content",
    priceUSD: 0,
    priceEUR: 0,
    priceGBP: 0,
    priceBDT: 0,
    priceINR: 0,
    billingInterval: "forever",
    isPopular: false,
  },
  {
    id: "plan_free",
    name: "Free Ad-Supported",
    tagline: "Watch select movies with occasional ads",
    priceUSD: 0,
    priceEUR: 0,
    priceGBP: 0,
    priceBDT: 0,
    priceINR: 0,
    billingInterval: "monthly",
    isPopular: false,
  },
  {
    id: "plan_basic",
    name: "Basic HD",
    tagline: "Standard HD streaming for 1 device",
    priceUSD: 8.99,
    priceEUR: 7.99,
    priceGBP: 6.99,
    priceBDT: 950,
    priceINR: 499,
    billingInterval: "monthly",
    isPopular: false,
  },
  {
    id: "plan_standard",
    name: "Standard Full HD",
    tagline: "1080p Full HD on 2 simultaneous devices",
    priceUSD: 13.99,
    priceEUR: 12.49,
    priceGBP: 10.99,
    priceBDT: 1450,
    priceINR: 799,
    billingInterval: "monthly",
    isPopular: true,
  },
  {
    id: "plan_premium",
    name: "Premium 4K HDR",
    tagline: "4K Ultra HD + Dolby Atmos on 4 devices + Offline Downloads",
    priceUSD: 19.99,
    priceEUR: 17.99,
    priceGBP: 15.99,
    priceBDT: 2100,
    priceINR: 1199,
    billingInterval: "monthly",
    isPopular: false,
  },
  {
    id: "plan_family",
    name: "Family Master Pass",
    tagline: "6 Individual Profiles + Kids Controls + Unlimited Downloads",
    priceUSD: 24.99,
    priceEUR: 22.99,
    priceGBP: 19.99,
    priceBDT: 2600,
    priceINR: 1499,
    billingInterval: "monthly",
    isPopular: false,
  },
  {
    id: "plan_enterprise",
    name: "Enterprise Broadcaster Pass",
    tagline: "Commercial license for public venues, hotels & multi-screen cinema hubs",
    priceUSD: 99.99,
    priceEUR: 89.99,
    priceGBP: 79.99,
    priceBDT: 10500,
    priceINR: 5999,
    billingInterval: "monthly",
    isPopular: false,
  }
];

let plan_features = [
  { planId: "plan_guest", maxDevices: 1, maxProfiles: 1, videoQuality: "480p", downloads: false, offlineViewing: false, adsEnabled: true, simultaneousStreams: 1, kidsProfile: false, dolbyAtmos: false, hdr: false, k4: false, k8: false, prioritySupport: false },
  { planId: "plan_free", maxDevices: 1, maxProfiles: 1, videoQuality: "720p", downloads: false, offlineViewing: false, adsEnabled: true, simultaneousStreams: 1, kidsProfile: true, dolbyAtmos: false, hdr: false, k4: false, k8: false, prioritySupport: false },
  { planId: "plan_basic", maxDevices: 1, maxProfiles: 2, videoQuality: "720p HD", downloads: true, offlineViewing: true, adsEnabled: false, simultaneousStreams: 1, kidsProfile: true, dolbyAtmos: false, hdr: false, k4: false, k8: false, prioritySupport: false },
  { planId: "plan_standard", maxDevices: 2, maxProfiles: 4, videoQuality: "1080p Full HD", downloads: true, offlineViewing: true, adsEnabled: false, simultaneousStreams: 2, kidsProfile: true, dolbyAtmos: true, hdr: false, k4: false, k8: false, prioritySupport: false },
  { planId: "plan_premium", maxDevices: 4, maxProfiles: 5, videoQuality: "4K Ultra HD + 8K", downloads: true, offlineViewing: true, adsEnabled: false, simultaneousStreams: 4, kidsProfile: true, dolbyAtmos: true, hdr: true, k4: true, k8: true, prioritySupport: true },
  { planId: "plan_family", maxDevices: 6, maxProfiles: 6, videoQuality: "4K Ultra HD", downloads: true, offlineViewing: true, adsEnabled: false, simultaneousStreams: 6, kidsProfile: true, dolbyAtmos: true, hdr: true, k4: true, k8: false, prioritySupport: true },
  { planId: "plan_enterprise", maxDevices: 25, maxProfiles: 25, videoQuality: "4K / 8K Uncompressed", downloads: true, offlineViewing: true, adsEnabled: false, simultaneousStreams: 25, kidsProfile: true, dolbyAtmos: true, hdr: true, k4: true, k8: true, prioritySupport: true },
];

let subscriptions = [
  {
    id: "sub_1001",
    userId: "user_demo_01",
    userEmail: "vip.subscriber@cineverse.com",
    planId: "plan_premium",
    status: "ACTIVE", // ACTIVE, CANCELED, PAST_DUE, EXPIRED, IN_TRIAL
    currency: "USD",
    amount: 19.99,
    billingInterval: "monthly",
    startDate: new Date(Date.now() - 86400000 * 15).toISOString(),
    nextBillingDate: new Date(Date.now() + 86400000 * 15).toISOString(),
    autoRenew: true,
    gracePeriodDays: 3,
    paymentGateway: "Stripe",
  },
  {
    id: "sub_1002",
    userId: "user_demo_02",
    userEmail: "alex.viewer@gmail.com",
    planId: "plan_standard",
    status: "IN_TRIAL",
    currency: "USD",
    amount: 13.99,
    billingInterval: "monthly",
    startDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    nextBillingDate: new Date(Date.now() + 86400000 * 9).toISOString(),
    autoRenew: true,
    gracePeriodDays: 3,
    paymentGateway: "bKash",
  }
];

let subscription_history = [
  { id: "sh_01", subscriptionId: "sub_1001", action: "PLAN_UPGRADED", fromPlan: "plan_standard", toPlan: "plan_premium", amountChargedUSD: 6.00, timestamp: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: "sh_02", subscriptionId: "sub_1002", action: "TRIAL_STARTED", fromPlan: "plan_free", toPlan: "plan_standard", amountChargedUSD: 0, timestamp: new Date(Date.now() - 86400000 * 5).toISOString() }
];

let payments = [
  { intentId: "pi_stripe_99201", userId: "user_demo_01", amount: 19.99, currency: "USD", gateway: "Stripe", status: "SUCCEEDED", customerEmail: "vip.subscriber@cineverse.com", createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
  { intentId: "pi_bkash_88102", userId: "user_demo_02", amount: 0.00, currency: "USD", gateway: "bKash", status: "TRIAL_AUTHORIZED", customerEmail: "alex.viewer@gmail.com", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() }
];

let payment_methods = [
  { id: "pm_card_4242", userId: "user_demo_01", gateway: "Stripe", type: "credit_card", brand: "Visa", last4: "4242", expiry: "12/28", isDefault: true },
  { id: "pm_bkash_01711", userId: "user_demo_02", gateway: "bKash", type: "mobile_wallet", accountNumber: "+8801711***920", isDefault: true }
];

let transactions = [
  { transactionId: "txn_8819201", intentId: "pi_stripe_99201", amount: 19.99, gatewayFeeUSD: 0.88, netAmountUSD: 19.11, status: "SETTLED", timestamp: new Date(Date.now() - 86400000 * 15).toISOString() }
];

let refunds = [
  { refundId: "ref_55102", transactionId: "txn_8819201", amountUSD: 5.00, reason: "Prorated downgrade adjustment", status: "APPROVED", adminApprovedBy: "Super Admin", createdAt: new Date(Date.now() - 86400000 * 10).toISOString() }
];

let coupons = [
  { code: "CINEVERSE2026", discountType: "PERCENTAGE", discountValue: 30, freeTrialDays: 0, minPurchaseUSD: 10, maxUses: 1000, usedCount: 142, isExpired: false, expiresAt: "2026-12-31" },
  { code: "TRIAL30DAYS", discountType: "FREE_TRIAL", discountValue: 100, freeTrialDays: 30, minPurchaseUSD: 0, maxUses: 5000, usedCount: 920, isExpired: false, expiresAt: "2026-12-31" },
  { code: "FLAT5OFF", discountType: "FIXED_AMOUNT", discountValue: 5.00, freeTrialDays: 0, minPurchaseUSD: 12, maxUses: 500, usedCount: 88, isExpired: false, expiresAt: "2026-12-31" }
];

let coupon_usage = [
  { id: "cu_01", code: "CINEVERSE2026", userId: "user_demo_01", appliedAt: new Date(Date.now() - 86400000 * 15).toISOString() }
];

let invoices = [
  {
    invoiceNumber: "INV-2026-8801",
    subscriptionId: "sub_1001",
    userEmail: "vip.subscriber@cineverse.com",
    planName: "Premium 4K HDR",
    subtotalUSD: 19.99,
    taxUSD: 1.60,
    discountUSD: 0.00,
    totalUSD: 21.59,
    currency: "USD",
    status: "PAID",
    gateway: "Stripe",
    transactionId: "txn_8819201",
    issueDate: new Date(Date.now() - 86400000 * 15).toISOString(),
    pdfDownloadUrl: "/api/invoices/INV-2026-8801/download"
  }
];

let invoice_items = [
  { id: "ii_01", invoiceNumber: "INV-2026-8801", description: "Cineverse Premium 4K HDR Monthly Subscription", qty: 1, unitPriceUSD: 19.99, totalUSD: 19.99 }
];

let billing_addresses = [
  { userId: "user_demo_01", country: "US", state: "NY", zip: "10001", street: "742 Evergreen Terrace", taxId: "US-8820192" }
];

let tax_rules = [
  { country: "US", taxName: "Sales Tax", ratePercentage: 8.0 },
  { country: "GB", taxName: "VAT", ratePercentage: 20.0 },
  { country: "BD", taxName: "VAT", ratePercentage: 15.0 },
  { country: "IN", taxName: "GST", ratePercentage: 18.0 },
  { country: "DE", taxName: "MwSt", ratePercentage: 19.0 }
];


// 2. SUBSCRIPTION & BILLING APIS

// GET /api/plans (Fetch All Plans & Features with Currency Exchange)
app.get("/api/plans", (_req, res) => {
  const mergedPlans = plans.map((p) => {
    const features = plan_features.find((f) => f.planId === p.id);
    return {
      ...p,
      features: features || {},
    };
  });

  res.json({
    plans: mergedPlans,
    supportedCurrencies: ["USD", "EUR", "GBP", "BDT", "INR", "JPY", "CAD", "AUD"],
    supportedGateways: [
      { id: "stripe", name: "Stripe (Credit / Debit Card)", icon: "credit-card" },
      { id: "paypal", name: "PayPal Express Checkout", icon: "paypal" },
      { id: "google_pay", name: "Google Pay", icon: "google" },
      { id: "apple_pay", name: "Apple Pay", icon: "apple" },
      { id: "razorpay", name: "Razorpay (India UPI / NetBanking)", icon: "razorpay" },
      { id: "sslcommerz", name: "SSLCommerz (Bangladesh Cards/NetBanking)", icon: "sslcommerz" },
      { id: "bkash", name: "bKash Direct Mobile Wallet", icon: "bkash" },
      { id: "nagad", name: "Nagad Mobile Banking", icon: "nagad" },
      { id: "rocket", name: "DBBL Rocket Wallet", icon: "rocket" }
    ]
  });
});

// GET /api/subscriptions/current
app.get("/api/subscriptions/current", (req, res) => {
  const userEmail = (req.query.userEmail as string) || "vip.subscriber@cineverse.com";
  const sub = subscriptions.find(s => s.userEmail === userEmail) || subscriptions[0];
  const plan = plans.find(p => p.id === sub.planId);
  const features = plan_features.find(f => f.planId === sub.planId);

  res.json({
    subscription: sub,
    plan,
    features,
    activeInvoices: invoices.filter(i => i.subscriptionId === sub.id)
  });
});

// POST /api/subscriptions (Create / Upgrade Subscription)
app.post("/api/subscriptions", (req, res) => {
  const { userId, userEmail, planId, billingInterval, couponCode, paymentGateway = "Stripe" } = req.body;

  const plan = plans.find(p => p.id === planId);
  if (!plan) return res.status(404).json({ error: `Plan '${planId}' not found.` });

  let finalAmount = plan.priceUSD;
  let appliedCoupon = null;

  // Validate coupon if provided
  if (couponCode) {
    const c = coupons.find(cp => cp.code === couponCode && !cp.isExpired);
    if (c) {
      if (c.discountType === "PERCENTAGE") {
        finalAmount = Number((finalAmount * (1 - c.discountValue / 100)).toFixed(2));
      } else if (c.discountType === "FIXED_AMOUNT") {
        finalAmount = Math.max(0, Number((finalAmount - c.discountValue).toFixed(2)));
      }
      appliedCoupon = c;
      c.usedCount++;
      coupon_usage.push({ id: `cu_${Date.now()}`, code: c.code, userId: userId || "user_demo", appliedAt: new Date().toISOString() });
    }
  }

  const subId = `sub_${Math.floor(1000 + Math.random() * 9000)}`;
  const newSub = {
    id: subId,
    userId: userId || "user_demo_01",
    userEmail: userEmail || "subscriber@cineverse.com",
    planId: plan.id,
    status: appliedCoupon?.discountType === "FREE_TRIAL" ? "IN_TRIAL" : "ACTIVE",
    currency: "USD",
    amount: finalAmount,
    billingInterval: billingInterval || "monthly",
    startDate: new Date().toISOString(),
    nextBillingDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    autoRenew: true,
    gracePeriodDays: 3,
    paymentGateway
  };

  subscriptions.unshift(newSub);
  subscription_history.unshift({
    id: `sh_${Date.now()}`,
    subscriptionId: subId,
    action: "PLAN_ACTIVATED",
    fromPlan: "plan_free",
    toPlan: plan.id,
    amountChargedUSD: finalAmount,
    timestamp: new Date().toISOString()
  });

  res.json({
    message: "Subscription initialized & pending payment verification.",
    subscription: newSub,
    amountDueUSD: finalAmount,
    appliedCoupon
  });
});

// POST /api/payments/create-intent
app.post("/api/payments/create-intent", (req, res) => {
  const { planId, amount, currency = "USD", gateway = "Stripe", userEmail = "subscriber@cineverse.com" } = req.body;

  const intentId = `pi_${gateway.toLowerCase()}_${Math.floor(100000 + Math.random() * 900000)}`;
  const clientSecret = `sec_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;

  const paymentRecord = {
    intentId,
    userId: "user_demo_01",
    amount: Number(amount) || 19.99,
    currency,
    gateway,
    status: "REQUIRES_PAYMENT_METHOD",
    customerEmail: userEmail,
    createdAt: new Date().toISOString()
  };

  payments.unshift(paymentRecord);

  res.json({
    message: "Payment intent initialized successfully.",
    intentId,
    clientSecret,
    amount: paymentRecord.amount,
    currency,
    gateway,
    checkoutRedirectUrl: `/api/payments/checkout/${intentId}`
  });
});

// POST /api/payments/verify
app.post("/api/payments/verify", (req, res) => {
  const { intentId, gatewayToken, userEmail = "vip.subscriber@cineverse.com", planId = "plan_premium" } = req.body;

  const payment = payments.find(p => p.intentId === intentId) || payments[0];
  if (payment) {
    payment.status = "SUCCEEDED";
  }

  // Create Transaction Ledger record
  const txnId = `txn_${Math.floor(1000000 + Math.random() * 9000000)}`;
  transactions.unshift({
    transactionId: txnId,
    intentId: intentId || "pi_verified_99",
    amount: payment ? payment.amount : 19.99,
    gatewayFeeUSD: Number(((payment ? payment.amount : 19.99) * 0.029 + 0.30).toFixed(2)),
    netAmountUSD: Number(((payment ? payment.amount : 19.99) * 0.971 - 0.30).toFixed(2)),
    status: "SETTLED",
    timestamp: new Date().toISOString()
  });

  // Activate / Refresh User Subscription
  let sub = subscriptions.find(s => s.userEmail === userEmail);
  if (!sub) {
    sub = {
      id: `sub_${Math.floor(1000 + Math.random() * 9000)}`,
      userId: "user_demo_01",
      userEmail,
      planId,
      status: "ACTIVE",
      currency: "USD",
      amount: payment ? payment.amount : 19.99,
      billingInterval: "monthly",
      startDate: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      autoRenew: true,
      gracePeriodDays: 3,
      paymentGateway: payment ? payment.gateway : "Stripe"
    };
    subscriptions.unshift(sub);
  } else {
    sub.status = "ACTIVE";
    sub.planId = planId;
    sub.nextBillingDate = new Date(Date.now() + 86400000 * 30).toISOString();
  }

  // Generate Official PDF Invoice Record
  const invNum = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const newInvoice = {
    invoiceNumber: invNum,
    subscriptionId: sub.id,
    userEmail: userEmail,
    planName: plans.find(p => p.id === planId)?.name || "Premium 4K HDR",
    subtotalUSD: sub.amount,
    taxUSD: Number((sub.amount * 0.08).toFixed(2)),
    discountUSD: 0.00,
    totalUSD: Number((sub.amount * 1.08).toFixed(2)),
    currency: "USD",
    status: "PAID",
    gateway: sub.paymentGateway,
    transactionId: txnId,
    issueDate: new Date().toISOString(),
    pdfDownloadUrl: `/api/invoices/${invNum}/download`
  };
  invoices.unshift(newInvoice);

  res.json({
    message: "Payment verified successfully. Subscription activated & Invoice generated!",
    status: "VERIFIED",
    subscription: sub,
    transactionId: txnId,
    invoice: newInvoice,
    unlockedFeatures: plan_features.find(f => f.planId === planId)
  });
});

// POST /api/payments/webhook
app.post("/api/payments/webhook", (req, res) => {
  const { eventType, intentId } = req.body;
  const p = payments.find(pay => pay.intentId === intentId);
  if (p) {
    p.status = eventType === "payment_intent.succeeded" ? "SUCCEEDED" : "FAILED";
  }
  res.json({ received: true, eventType, timestamp: new Date().toISOString() });
});

// POST /api/subscriptions/cancel
app.post("/api/subscriptions/cancel", (req, res) => {
  const { subscriptionId, cancelImmediately = false, reason = "User requested cancellation" } = req.body;

  const sub = subscriptions.find(s => s.id === subscriptionId) || subscriptions[0];
  if (!sub) return res.status(404).json({ error: "Subscription not found." });

  sub.autoRenew = false;
  if (cancelImmediately) {
    sub.status = "CANCELED";
  }

  subscription_history.unshift({
    id: `sh_${Date.now()}`,
    subscriptionId: sub.id,
    action: cancelImmediately ? "IMMEDIATE_CANCELLATION" : "CANCELLED_AT_PERIOD_END",
    fromPlan: sub.planId,
    toPlan: "plan_free",
    amountChargedUSD: 0,
    timestamp: new Date().toISOString()
  });

  res.json({
    message: cancelImmediately ? "Subscription canceled immediately." : "Subscription set to cancel at end of current billing cycle.",
    subscription: sub,
    reasonRecorded: reason
  });
});

// POST /api/subscriptions/renew
app.post("/api/subscriptions/renew", (req, res) => {
  const { subscriptionId } = req.body;
  const sub = subscriptions.find(s => s.id === subscriptionId) || subscriptions[0];
  if (sub) {
    sub.status = "ACTIVE";
    sub.autoRenew = true;
    sub.nextBillingDate = new Date(Date.now() + 86400000 * 30).toISOString();

    subscription_history.unshift({
      id: `sh_${Date.now()}`,
      subscriptionId: sub.id,
      action: "AUTO_RENEWED",
      fromPlan: sub.planId,
      toPlan: sub.planId,
      amountChargedUSD: sub.amount,
      timestamp: new Date().toISOString()
    });
  }

  res.json({ message: "Subscription renewed for another 30-day billing cycle.", subscription: sub });
});

// POST /api/coupons/validate
app.post("/api/coupons/validate", (req, res) => {
  const { code, planPriceUSD = 19.99 } = req.body;
  const c = coupons.find(cp => cp.code?.toUpperCase() === code?.toUpperCase() && !cp.isExpired);

  if (!c) {
    return res.status(404).json({ valid: false, error: "Invalid or expired promo code." });
  }

  let discountedPrice = planPriceUSD;
  if (c.discountType === "PERCENTAGE") {
    discountedPrice = Number((planPriceUSD * (1 - c.discountValue / 100)).toFixed(2));
  } else if (c.discountType === "FIXED_AMOUNT") {
    discountedPrice = Math.max(0, Number((planPriceUSD - c.discountValue).toFixed(2)));
  } else if (c.discountType === "FREE_TRIAL") {
    discountedPrice = 0;
  }

  res.json({
    valid: true,
    code: c.code,
    discountType: c.discountType,
    discountValue: c.discountValue,
    freeTrialDays: c.freeTrialDays,
    originalPriceUSD: planPriceUSD,
    discountedPriceUSD: discountedPrice,
    savingsUSD: Number((planPriceUSD - discountedPrice).toFixed(2))
  });
});

// GET /api/invoices
app.get("/api/invoices", (_req, res) => {
  res.json({ invoices });
});

// GET /api/invoices/:id
app.get("/api/invoices/:id", (req, res) => {
  const { id } = req.params;
  const inv = invoices.find(i => i.invoiceNumber === id || i.subscriptionId === id);
  if (!inv) return res.status(404).json({ error: "Invoice not found." });

  res.json({
    invoice: inv,
    items: invoice_items.filter(item => item.invoiceNumber === inv.invoiceNumber),
    companyDetails: {
      name: "Cineverse Enterprise Media LLC",
      address: "100 Hollywood Blvd, Suite 400, Los Angeles, CA 90028",
      taxRegistrationNumber: "US-EIN-99201827",
      supportEmail: "billing@cineverse.com"
    }
  });
});

// POST /api/refunds/request
app.post("/api/refunds/request", (req, res) => {
  const { transactionId, amountUSD, reason } = req.body;

  const refId = `ref_${Math.floor(10000 + Math.random() * 90000)}`;
  const newRefund = {
    refundId: refId,
    transactionId: transactionId || "txn_8819201",
    amountUSD: Number(amountUSD) || 19.99,
    reason: reason || "User dissatisfaction within 7-day money-back window",
    status: "PENDING_ADMIN_APPROVAL",
    adminApprovedBy: "Pending Review",
    createdAt: new Date().toISOString()
  };

  refunds.unshift(newRefund);
  res.json({ message: "Refund request submitted to Admin Billing Operations.", refund: newRefund });
});

// GET /api/admin/billing-tables (Expose all 14 Database Tables)
app.get("/api/admin/billing-tables", (_req, res) => {
  res.json({
    plans,
    plan_features,
    subscriptions,
    subscription_history,
    payments,
    payment_methods,
    transactions,
    refunds,
    coupons,
    coupon_usage,
    invoices,
    invoice_items,
    billing_addresses,
    tax_rules
  });
});

// GET /api/admin/revenue-analytics
app.get("/api/admin/revenue-analytics", (_req, res) => {
  const totalSubscribers = subscriptions.length;
  const activeSubscribers = subscriptions.filter(s => s.status === "ACTIVE").length;
  const mrr = subscriptions.filter(s => s.status === "ACTIVE").reduce((sum, s) => sum + s.amount, 0);
  const arr = mrr * 12;

  res.json({
    totalSubscribers,
    activeSubscribers,
    trialSubscribers: subscriptions.filter(s => s.status === "IN_TRIAL").length,
    mrrUSD: Number(mrr.toFixed(2)),
    arrUSD: Number(arr.toFixed(2)),
    conversionRatePercent: 84.5,
    churnRatePercent: 1.8,
    refundRatePercent: 0.4,
    topSellingPlans: [
      { planName: "Standard Full HD", share: "45%" },
      { planName: "Premium 4K HDR", share: "38%" },
      { planName: "Family Master Pass", share: "17%" }
    ],
    gatewayDistribution: [
      { gateway: "Stripe", percentage: 52 },
      { gateway: "bKash / Nagad", percentage: 24 },
      { gateway: "PayPal", percentage: 14 },
      { gateway: "Google / Apple Pay", percentage: 10 }
    ]
  });
});

// ============================================================================
// AI & SMART FEATURES ENGINE (RECOMMENDATIONS, SEARCH, CONCIERGE, WATCH PARTY)
// ============================================================================

// 1. DATABASE TABLES (12 In-Memory AI Data Stores)
let recommendations = [
  { id: "rec_101", userId: "user_demo_01", movieId: "dune-part-two", title: "Dune: Part Two", score: 0.98, reason: "Because you loved Interstellar & Sci-Fi Epics", category: "Because You Watched", generatedAt: new Date().toISOString() },
  { id: "rec_102", userId: "user_demo_01", movieId: "oppenheimer", title: "Oppenheimer", score: 0.95, reason: "Top Drama in United States by Christopher Nolan", category: "Recommended For You", generatedAt: new Date().toISOString() },
  { id: "rec_103", userId: "user_demo_01", movieId: "blade-runner-2049", title: "Blade Runner 2049", score: 0.92, reason: "Matches your preference for Denis Villeneuve", category: "Similar Movies", generatedAt: new Date().toISOString() },
  { id: "rec_104", userId: "user_demo_01", movieId: "spider-man-across-the-spider-verse", title: "Spider-Man: Across the Spider-Verse", score: 0.89, reason: "Trending #1 in Animation & High Completion Rate", category: "Trending Near You", generatedAt: new Date().toISOString() }
];

let ai_profiles = [
  {
    userId: "user_demo_01",
    preferredGenres: ["Sci-Fi", "Action", "Drama", "Thriller"],
    favoriteDirectors: ["Christopher Nolan", "Denis Villeneuve", "Quentin Tarantino"],
    favoriteActors: ["Timothée Chalamet", "Cillian Murphy", "Zendaya"],
    preferredLanguages: ["English", "Japanese", "French"],
    affinityScores: { "Sci-Fi": 0.96, "Action": 0.88, "Drama": 0.82, "Comedy": 0.35, "Horror": 0.20 },
    avgWatchCompletionRate: 0.92,
    totalWatchTimeHours: 148.5,
    lastActiveMood: "Epic / Sci-Fi",
    updatedAt: new Date().toISOString()
  }
];

let watch_events = [
  { eventId: "we_9001", userId: "user_demo_01", movieId: "dune-part-two", watchDurationSeconds: 7200, totalDurationSeconds: 9960, completionPercentage: 72.3, deviceType: "TV", timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { eventId: "we_9002", userId: "user_demo_01", movieId: "interstellar", watchDurationSeconds: 10140, totalDurationSeconds: 10140, completionPercentage: 100.0, deviceType: "Desktop", timestamp: new Date(Date.now() - 86400000 * 2).toISOString() }
];

let search_history = [
  { id: "sh_101", userId: "user_demo_01", query: "Best sci-fi movies directed by Christopher Nolan", resultCount: 8, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "sh_102", userId: "user_demo_01", query: "Oscar winning drama 2023", resultCount: 12, timestamp: new Date(Date.now() - 86400000).toISOString() }
];

let voice_search_logs = [
  { id: "vsl_501", userId: "user_demo_01", transcript: "Play funny Korean comedy movies with English subtitles", languageDetected: "en-US", confidence: 0.97, status: "PROCESSED", timestamp: new Date().toISOString() }
];

let user_preferences = [
  { userId: "user_demo_01", autoPlayNext: true, preferredAudioTrack: "en", preferredSubtitleTrack: "en", defaultStreamQuality: "4K", contentRatingLimit: "PG-13 / R", kidsMode: false }
];

let watch_parties = [
  { partyId: "wp_alpha", hostUserId: "user_demo_01", hostUsername: "CinephileKing", movieId: "dune-part-two", currentPlaybackTimeSeconds: 3420, isPaused: false, accessCode: "DUNE2026", createdAt: new Date().toISOString() }
];

let party_members = [
  { partyId: "wp_alpha", userId: "user_demo_01", username: "CinephileKing", role: "HOST", joinedAt: new Date().toISOString() },
  { partyId: "wp_alpha", userId: "user_demo_02", username: "AlexStreamer", role: "MEMBER", joinedAt: new Date().toISOString() }
];

let reviews = [
  { id: "rev_301", movieId: "dune-part-two", userId: "user_demo_01", username: "CinephileKing", rating: 5.0, title: "A masterpiece of modern sci-fi cinema!", comment: "The sound design, visuals, and performances are unmatched. Hans Zimmer's score gives chills.", containsSpoilers: false, moderationStatus: "APPROVED", upvotes: 42, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "rev_302", movieId: "oppenheimer", userId: "user_demo_02", username: "AlexStreamer", rating: 4.8, title: "A terrifyingly intimate biopic", comment: "Cillian Murphy delivers the performance of a lifetime. The Trinity test sequence was breathtaking.", containsSpoilers: false, moderationStatus: "APPROVED", upvotes: 29, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() }
];

let ratings = [
  { id: "rat_1", movieId: "dune-part-two", userId: "user_demo_01", ratingValue: 5, likeState: "LIKE", timestamp: new Date().toISOString() },
  { id: "rat_2", movieId: "interstellar", userId: "user_demo_01", ratingValue: 5, likeState: "LIKE", timestamp: new Date().toISOString() }
];

let followers = [
  { id: "fol_1", followerUserId: "user_demo_02", followingUserId: "user_demo_01", followerUsername: "AlexStreamer", followingUsername: "CinephileKing", timestamp: new Date().toISOString() }
];

let notifications = [
  { id: "notif_1", userId: "user_demo_01", title: "New Release In Your Favorite Genre", message: "Dune: Part Two is now streaming in 4K HDR & Dolby Atmos!", type: "RECOMMENDATION", isRead: false, timestamp: new Date().toISOString() },
  { id: "notif_2", userId: "user_demo_01", title: "Watch Party Invitation", message: "AlexStreamer invited you to watch Interstellar together", type: "WATCH_PARTY", isRead: true, timestamp: new Date(Date.now() - 3600000).toISOString() }
];

// Sample Catalog for Recommendation Engines & Search Indexing
const sampleCatalog = [
  { id: "dune-part-two", title: "Dune: Part Two", year: 2024, genre: ["Sci-Fi", "Adventure", "Action"], director: "Denis Villeneuve", cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"], rating: 8.6, tags: ["Epic", "Spice", "Desert", "Oscars", "Masterpiece"], mood: ["Epic", "Action", "Mind Bending"] },
  { id: "oppenheimer", title: "Oppenheimer", year: 2023, genre: ["Biography", "Drama", "History"], director: "Christopher Nolan", cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon"], rating: 8.9, tags: ["Oscar Winner", "Atomic", "Biopic", "Intense"], mood: ["Late Night", "Sad", "Relax"] },
  { id: "interstellar", title: "Interstellar", year: 2014, genre: ["Sci-Fi", "Drama", "Adventure"], director: "Christopher Nolan", cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"], rating: 8.7, tags: ["Space", "Black Hole", "Time Travel", "Masterpiece"], mood: ["Mind Bending", "Epic", "Romantic"] },
  { id: "spider-man-across-the-spider-verse", title: "Spider-Man: Across the Spider-Verse", year: 2023, genre: ["Animation", "Action", "Adventure"], director: "Joaquim Dos Santos", cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac"], rating: 8.7, tags: ["Multiverse", "Animation", "Superhero", "Family"], mood: ["Happy", "Action", "Family"] },
  { id: "blade-runner-2049", title: "Blade Runner 2049", year: 2017, genre: ["Sci-Fi", "Mystery", "Drama"], director: "Denis Villeneuve", cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas"], rating: 8.0, tags: ["Cyberpunk", "Neo-Noir", "Visually Stunning"], mood: ["Late Night", "Relax", "Sad"] },
  { id: "parasite", title: "Parasite", year: 2019, genre: ["Thriller", "Drama", "Comedy"], director: "Bong Joon-ho", cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"], rating: 8.5, tags: ["Oscar Winner", "Korean", "Social Satire", "Masterpiece"], mood: ["Scary", "Mind Bending", "Date Night"] }
];


// 2. AI RECOMMENDATION ENGINE ENDPOINTS

// GET /api/recommendations
app.get("/api/recommendations", (req, res) => {
  const userId = (req.query.userId as string) || "user_demo_01";
  const userProfile = ai_profiles.find(p => p.userId === userId) || ai_profiles[0];

  res.json({
    userId,
    profileSummary: userProfile,
    continueWatching: [
      { movieId: "dune-part-two", title: "Dune: Part Two", progressSeconds: 7200, totalSeconds: 9960, percent: 72.3, lastWatchedDevice: "Apple TV 4K", poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop" },
      { movieId: "blade-runner-2049", title: "Blade Runner 2049", progressSeconds: 2400, totalSeconds: 9800, percent: 24.5, lastWatchedDevice: "MacBook Pro", poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop" }
    ],
    recommendedForYou: sampleCatalog,
    becauseYouWatched: {
      sourceMovie: "Interstellar",
      similarMovies: sampleCatalog.filter(m => m.genre.includes("Sci-Fi") || m.director === "Christopher Nolan")
    },
    popularInCountry: sampleCatalog.slice(0, 4),
    trendingNearYou: sampleCatalog.slice(1, 5),
    moodCategories: ["Happy", "Sad", "Romantic", "Action", "Relax", "Scary", "Family", "Late Night", "Date Night"],
    analytics: {
      recommendationAccuracyPercent: 94.8,
      ctrPercent: 19.2,
      watchCompletionRatePercent: 88.6,
      topRecommendedGenre: "Sci-Fi / Epic Drama"
    }
  });
});

// GET /api/trending
app.get("/api/trending", (_req, res) => {
  res.json({
    mostWatched: sampleCatalog.slice(0, 3),
    mostLiked: sampleCatalog.slice(1, 4),
    fastestGrowing: [sampleCatalog[0], sampleCatalog[3]],
    mostShared: [sampleCatalog[1], sampleCatalog[2]],
    mostDownloaded: [sampleCatalog[0], sampleCatalog[2]],
    trendingToday: sampleCatalog,
    trendingThisWeek: sampleCatalog,
    trendingThisMonth: sampleCatalog,
    updatedAt: new Date().toISOString()
  });
});

// GET /api/continue-watching
app.get("/api/continue-watching", (req, res) => {
  const userId = (req.query.userId as string) || "user_demo_01";
  const events = watch_events.filter(e => e.userId === userId);

  const items = events.map(e => {
    const m = sampleCatalog.find(c => c.id === e.movieId);
    return {
      ...e,
      movieTitle: m ? m.title : e.movieId,
      streamUrl: `/api/stream/${e.movieId}/master.m3u8`
    };
  });

  res.json({ userId, continueWatchingList: items });
});

// POST /api/continue-watching/progress
app.post("/api/continue-watching/progress", (req, res) => {
  const { userId = "user_demo_01", movieId, watchDurationSeconds, totalDurationSeconds, deviceType = "Web" } = req.body;

  let event = watch_events.find(e => e.userId === userId && e.movieId === movieId);
  const completionPercentage = Number(((watchDurationSeconds / totalDurationSeconds) * 100).toFixed(1));

  if (event) {
    event.watchDurationSeconds = watchDurationSeconds;
    event.totalDurationSeconds = totalDurationSeconds;
    event.completionPercentage = completionPercentage;
    event.deviceType = deviceType;
    event.timestamp = new Date().toISOString();
  } else {
    event = {
      eventId: `we_${Date.now()}`,
      userId,
      movieId: movieId || "dune-part-two",
      watchDurationSeconds: Number(watchDurationSeconds) || 300,
      totalDurationSeconds: Number(totalDurationSeconds) || 7200,
      completionPercentage,
      deviceType,
      timestamp: new Date().toISOString()
    };
    watch_events.unshift(event);
  }

  res.json({ message: "Playback progress synced to cloud.", watchEvent: event });
});


// 3. SMART & NATURAL LANGUAGE SEARCH ENDPOINTS

// POST /api/search
app.post("/api/search", async (req, res) => {
  const { query, userId = "user_demo_01" } = req.body;
  if (!query) return res.status(400).json({ error: "Search query is required." });

  // Log to search history
  search_history.unshift({
    id: `sh_${Date.now()}`,
    userId,
    query,
    resultCount: sampleCatalog.length,
    timestamp: new Date().toISOString()
  });

  const qLower = query.toLowerCase();

  // Try natural language / semantic search filtering
  let matchedMovies = sampleCatalog.filter(m => {
    return (
      m.title.toLowerCase().includes(qLower) ||
      m.director.toLowerCase().includes(qLower) ||
      m.genre.some(g => g.toLowerCase().includes(qLower)) ||
      m.cast.some(c => c.toLowerCase().includes(qLower)) ||
      m.tags.some(t => t.toLowerCase().includes(qLower)) ||
      m.mood.some(md => md.toLowerCase().includes(qLower)) ||
      (qLower.includes("oscar") && m.tags.includes("Oscar Winner")) ||
      (qLower.includes("sci-fi") && m.genre.includes("Sci-Fi")) ||
      (qLower.includes("korean") && m.tags.includes("Korean"))
    );
  });

  if (matchedMovies.length === 0) {
    matchedMovies = sampleCatalog.slice(0, 3); // Smart fallback
  }

  // Generate AI query interpretation
  let aiQueryInterpretation = `Identified semantic intent: Searching for titles matching '${query}' filtered by genre, director, and audience affinity.`;

  const ai = getAiClient();
  if (ai) {
    try {
      const prompt = `Analyze this movie streaming search query: "${query}". Return a 1-sentence explanation of what the user is looking for and key genres or themes.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      if (response.text) {
        aiQueryInterpretation = response.text.trim();
      }
    } catch {
      // Graceful fallback to static interpretation
    }
  }

  res.json({
    query,
    aiQueryInterpretation,
    totalResults: matchedMovies.length,
    results: matchedMovies
  });
});

// POST /api/voice-search
app.post("/api/voice-search", (req, res) => {
  const { audioBase64, sampleTranscript = "Play funny comedy movies from 2023", userId = "user_demo_01" } = req.body;

  const transcript = sampleTranscript || "Recommend mind bending sci-fi movies like Interstellar";
  const logId = `vsl_${Date.now()}`;

  voice_search_logs.unshift({
    id: logId,
    userId,
    transcript,
    languageDetected: "en-US",
    confidence: 0.98,
    status: "PROCESSED",
    timestamp: new Date().toISOString()
  });

  const qLower = transcript.toLowerCase();
  const matched = sampleCatalog.filter(m =>
    m.title.toLowerCase().includes(qLower) ||
    m.genre.some(g => qLower.includes(g.toLowerCase())) ||
    m.tags.some(t => qLower.includes(t.toLowerCase()))
  );

  res.json({
    logId,
    transcribedText: transcript,
    confidence: 0.98,
    results: matched.length > 0 ? matched : sampleCatalog.slice(0, 3)
  });
});


// 4. AI CHAT CONCIERGE & MOOD RECOMMENDATIONS

// POST /api/ai/concierge
app.post("/api/ai/concierge", async (req, res) => {
  const { message, mood, userId = "user_demo_01" } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required for AI Concierge." });

  let replyText = "";
  const ai = getAiClient();

  if (ai) {
    try {
      const prompt = `You are Cineverse AI Concierge, a world-class cinema expert and recommendation engine. 
User asks: "${message}". 
Available movies in catalog: ${JSON.stringify(sampleCatalog.map(m => ({ title: m.title, genre: m.genre, director: m.director, mood: m.mood })))}.
Provide a helpful, friendly, and enthusiastic 2-3 paragraph response recommending specific movies from the catalog or explaining plot endings/cast details as requested. Keep the tone sophisticated and cinematic.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      if (response.text) {
        replyText = response.text.trim();
      }
    } catch {
      // Fallback
    }
  }

  if (!replyText) {
    replyText = `Hello! As your Cineverse AI Concierge, I highly recommend checking out **Dune: Part Two** or **Oppenheimer**. Both offer grand cinematic scope, groundbreaking audio design, and stunning 4K visuals tailored for your preferences. Let me know if you'd like a breakdown of the cast, behind-the-scenes trivia, or similar sci-fi epics!`;
  }

  res.json({
    query: message,
    aiConciergeReply: replyText,
    suggestedMovies: sampleCatalog.slice(0, 3),
    timestamp: new Date().toISOString()
  });
});

// GET /api/ai/mood-recommendations
app.get("/api/ai/mood-recommendations", (req, res) => {
  const mood = ((req.query.mood as string) || "Epic").toLowerCase();

  const filtered = sampleCatalog.filter(m => m.mood.some(md => md.toLowerCase() === mood));
  const results = filtered.length > 0 ? filtered : sampleCatalog.slice(0, 3);

  res.json({
    moodRequested: mood,
    aiExplanation: `Selected ${results.length} titles matching the '${mood}' atmosphere based on pacing, soundtrack resonance, and visual aesthetic.`,
    movies: results
  });
});


// 5. SOCIAL, WATCH PARTY, REVIEWS & RATINGS

// POST /api/review
app.post("/api/review", (req, res) => {
  const { movieId, rating, title, comment, containsSpoilers = false, userId = "user_demo_01", username = "CinephileKing" } = req.body;

  if (!movieId || !comment) {
    return res.status(400).json({ error: "Movie ID and review comment are required." });
  }

  // AI Moderation Engine check
  const abusiveTerms = ["hate", "scam", "spam"];
  const isAbusive = abusiveTerms.some(term => comment.toLowerCase().includes(term));

  const newReview = {
    id: `rev_${Date.now()}`,
    movieId,
    userId,
    username,
    rating: Number(rating) || 5.0,
    title: title || "Spectacular Watch",
    comment,
    containsSpoilers: Boolean(containsSpoilers),
    moderationStatus: isAbusive ? "FLAGGED_FOR_REVIEW" : "APPROVED",
    upvotes: 0,
    createdAt: new Date().toISOString()
  };

  reviews.unshift(newReview);
  res.json({
    message: isAbusive ? "Review submitted and flagged for automated moderation check." : "Review published successfully!",
    review: newReview
  });
});

// POST /api/rating
app.post("/api/rating", (req, res) => {
  const { movieId, ratingValue, likeState, userId = "user_demo_01" } = req.body;

  let r = ratings.find(rat => rat.userId === userId && rat.movieId === movieId);
  if (r) {
    r.ratingValue = ratingValue || r.ratingValue;
    r.likeState = likeState || r.likeState;
    r.timestamp = new Date().toISOString();
  } else {
    r = {
      id: `rat_${Date.now()}`,
      movieId: movieId || "dune-part-two",
      userId,
      ratingValue: Number(ratingValue) || 5,
      likeState: likeState || "LIKE",
      timestamp: new Date().toISOString()
    };
    ratings.unshift(r);
  }

  res.json({ message: "Rating recorded.", rating: r });
});

// POST /api/watch-party
app.post("/api/watch-party", (req, res) => {
  const { movieId = "dune-part-two", hostUserId = "user_demo_01", hostUsername = "CinephileKing" } = req.body;

  const partyId = `wp_${Math.random().toString(36).substring(2, 8)}`;
  const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const party = {
    partyId,
    hostUserId,
    hostUsername,
    movieId,
    currentPlaybackTimeSeconds: 0,
    isPaused: false,
    accessCode,
    createdAt: new Date().toISOString()
  };

  watch_parties.unshift(party);
  party_members.push({ partyId, userId: hostUserId, username: hostUsername, role: "HOST", joinedAt: new Date().toISOString() });

  res.json({
    message: "Watch Party created successfully!",
    party,
    inviteLink: `/watch-party/${partyId}?code=${accessCode}`
  });
});

// GET /api/followers
app.get("/api/followers", (req, res) => {
  const userId = (req.query.userId as string) || "user_demo_01";
  res.json({
    userId,
    followers: followers.filter(f => f.followingUserId === userId),
    following: followers.filter(f => f.followerUserId === userId),
    notifications: notifications.filter(n => n.userId === userId)
  });
});

// POST /api/followers/follow
app.post("/api/followers/follow", (req, res) => {
  const { followerUserId = "user_demo_01", followingUserId, followingUsername = "AlexStreamer" } = req.body;

  const newFol = {
    id: `fol_${Date.now()}`,
    followerUserId,
    followingUserId: followingUserId || "user_demo_02",
    followerUsername: "CinephileKing",
    followingUsername,
    timestamp: new Date().toISOString()
  };

  followers.unshift(newFol);
  res.json({ message: `Now following ${followingUsername}!`, follower: newFol });
});


// 6. ADMIN EXPOSURE ENDPOINTS (12 AI TABLES & ANALYTICS)

app.get("/api/admin/ai-tables", (_req, res) => {
  res.json({
    recommendations,
    ai_profiles,
    watch_events,
    search_history,
    voice_search_logs,
    user_preferences,
    watch_parties,
    party_members,
    reviews,
    ratings,
    followers,
    notifications
  });
});

app.get("/api/admin/ai-analytics", (_req, res) => {
  res.json({
    recommendationAccuracyPercent: 94.8,
    ctrPercent: 19.2,
    watchCompletionRatePercent: 88.6,
    mostRecommendedMovies: sampleCatalog.slice(0, 3).map(m => m.title),
    mostIgnoredRecommendations: ["B-Grade Thriller", "Low Budget Short"],
    mostActiveUsers: ["user_demo_01", "user_demo_02"],
    mostSharedMovies: ["Dune: Part Two", "Spider-Man: Across the Spider-Verse"],
    vectorDatabaseStatus: "Pinecone / Qdrant Hybrid Index Online",
    geminiAiEngineStatus: "ACTIVE (Gemini 2.5 Flash)"
  });
});






// ============================================================================
// PRODUCTION DEPLOYMENT & INFRASTRUCTURE MONITORING ENGINE
// ============================================================================

// GET /api/health
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "cineverse-enterprise-ott-platform",
    environment: process.env.NODE_ENV || "production",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// GET /api/health/liveness
app.get("/api/health/liveness", (_req, res) => {
  res.status(200).send("LIVE");
});

// GET /api/health/readiness
app.get("/api/health/readiness", (_req, res) => {
  res.status(200).json({
    status: "READY",
    database: "CONNECTED",
    redis: "CONNECTED",
    minioObjectStorage: "ONLINE",
    ffmpegWorkers: "3 ACTIVE"
  });
});

// GET /api/admin/system-metrics
app.get("/api/admin/system-metrics", (_req, res) => {
  res.json({
    cpuUtilizationPercent: 24.5,
    memoryUsageMB: 482.6,
    activeConnections: 1420,
    apiResponseTimeAvgMs: 42,
    streamingBandwidthGbps: 18.4,
    ffmpegEncodingQueueLength: 2,
    activeWatchPartiesCount: watch_parties.length,
    activeSubscriptionsCount: subscriptions.filter(s => s.status === "ACTIVE").length,
    redisCacheHitRatioPercent: 98.4,
    timestamp: new Date().toISOString()
  });
});

// GET /api/admin/deployment-status
app.get("/api/admin/deployment-status", (_req, res) => {
  res.json({
    clusterName: "cineverse-prod-us-east1",
    kubernetesPods: [
      { name: "cineverse-backend-deployment-991a-x821", status: "Running", restarts: 0, age: "4d21h" },
      { name: "cineverse-backend-deployment-991a-b012", status: "Running", restarts: 0, age: "4d21h" },
      { name: "cineverse-backend-deployment-991a-k992", status: "Running", restarts: 0, age: "4d21h" },
      { name: "cineverse-ffmpeg-worker-8812-p1", status: "Running", restarts: 0, age: "12d" },
      { name: "cineverse-ffmpeg-worker-8812-p2", status: "Running", restarts: 0, age: "12d" }
    ],
    ingressController: "NGINX Ingress v1.9.4 (HTTP/2, TLS 1.3)",
    cdnDistribution: "Cloudflare Enterprise Edge (Global CDN)",
    hpaStatus: {
      minReplicas: 3,
      maxReplicas: 50,
      currentReplicas: 5,
      targetCPUUtilizationPercentage: 75,
      currentCPUUtilizationPercentage: 24
    },
    versionTag: "v2026.7.25-enterprise-build",
    lastDeploymentTimestamp: new Date().toISOString()
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Movie Website Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
