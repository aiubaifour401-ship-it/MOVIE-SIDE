export interface CastMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface Review {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number; // 1-10
  date: string;
  comment: string;
  verifiedWatch?: boolean;
  likes: number;
}

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  trailerYoutubeId: string;
  releaseYear: number;
  imdbRating: number; // e.g., 8.8
  rottenTomatoesScore: number; // e.g., 94 (% )
  runtimeMinutes: number;
  director: string;
  writer?: string;
  genres: string[];
  contentRating: string; // PG-13, R, PG, TV-MA
  cast: CastMember[];
  featured?: boolean;
  isNew?: boolean;
  createdAt?: string;
  trending?: boolean;
  topRated?: boolean;
  upcoming?: boolean;
  oscarWinner?: boolean;
  budget?: string;
  boxOffice?: string;
  language: string;
  quotes?: string[];
  streamUrl?: string;
  downloadUrl?: string;
  audioLanguages?: string[];
  subtitles?: string[];
  reviews: Review[];
  similarMovieIds?: string[];
  isKidsFriendly?: boolean;
  isSports?: boolean;
  sportsLeague?: string;
  liveStatus?: 'LIVE' | 'UPCOMING' | 'HIGHLIGHTS';
  top10Rank?: number; // 1 to 10
  isPopularInBangladesh?: boolean;
  country?: string;
  isSeries?: boolean;
  seasonsCount?: number;
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  synopsis: string;
  durationMinutes: number;
  thumbnailUrl: string;
  streamUrl?: string;
}

export interface ContinueWatchingItem {
  movieId: string;
  movieTitle: string;
  posterUrl: string;
  backdropUrl: string;
  progressSeconds: number;
  durationSeconds: number;
  lastWatchedAt: string;
  profileId?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'movie' | 'subscription' | 'payment' | 'notice';
  linkMovieId?: string;
}

export interface BannerSlide {
  id: string;
  movieId?: string;
  title: string;
  tagline: string;
  synopsis: string;
  backdropUrl: string;
  posterUrl: string;
  badge?: string;
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number;
  bonusDays?: number;
  expiresAt: string;
  active: boolean;
}

export type WatchStatus = 'plan_to_watch' | 'watching' | 'completed';

export interface WatchlistItem {
  movieId: string;
  addedAt: string;
  status: WatchStatus;
  userRating?: number;
  notes?: string;
}

export interface FilterState {
  searchQuery: string;
  selectedGenre: string;
  minRating: number;
  yearRange: [number, number];
  sortBy: 'popularity' | 'rating' | 'releaseDate' | 'title';
  category: 'all' | 'trending' | 'top_rated' | 'oscar_winners' | 'upcoming';
}

export interface ExternalRecommendation {
  title: string;
  year: number;
  director?: string;
  genre: string;
  plot: string;
  whyWatch: string;
}

export interface AIRecommendationResult {
  recommendationReason: string;
  matchedCatalogIds: string[];
  externalRecommendations: ExternalRecommendation[];
  vibeKeywords: string[];
}

export interface AIDeepDiveReview {
  criticConsensus: string;
  audienceVibe: string;
  keyThemes: string[];
  standOutElements: string[];
  triviaFact: string;
}

export interface UserDevice {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tv' | 'tablet';
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  currentSession: boolean;
  trusted: boolean;
}

export interface UserSecurityLog {
  id: string;
  event: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  status: 'success' | 'warning' | 'failed';
}

export interface DownloadItem {
  id: string;
  movieId: string;
  title: string;
  posterUrl: string;
  fileSizeMb: number;
  downloadedAt: string;
  quality: '1080p' | '4K HDR' | '720p';
}

export interface UserProfile {
  id: string;
  name: string;
  nickname?: string;
  bio?: string;
  avatarUrl: string;
  isKids: boolean;
  pinRequired?: boolean;
  pinCode?: string;
  preferredLanguage?: string;
  preferredGenres?: string[];
  preferredAudioLanguage?: string;
  preferredSubtitleLanguage?: string;
  autoplayTrailers?: boolean;
  autoplayNextEpisode?: boolean;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  movieRelated: string;
}
