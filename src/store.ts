// Types
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  source: 'upload' | 'soundcloud' | 'spotify' | 'url';
  url?: string;
  addedAt: number;
  fileSize?: number;
}

export interface BotConfig {
  token: string;
  clientId: string;
  guildId: string;
  prefix: string;
  volume: number;
  autoplay: boolean;
  leaveOnEmpty: boolean;
  leaveTimeout: number;
}

export interface BotStatus {
  online: boolean;
  uptime: number;
  guilds: number;
  voiceConnections: number;
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  progress: number;
  volume: number;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

// Helpers
const STORAGE_KEY = 'soundforge_data';

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function loadData(): { config: BotConfig; tracks: Track[]; logs: LogEntry[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* empty */ }
  return {
    config: {
      token: '',
      clientId: '',
      guildId: '',
      prefix: '/',
      volume: 80,
      autoplay: false,
      leaveOnEmpty: true,
      leaveTimeout: 60,
    },
    tracks: [],
    logs: [],
  };
}

export function saveData(config: BotConfig, tracks: Track[], logs: LogEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ config, tracks, logs }));
}

export function getInitialData() {
  return loadData();
}

export function createTrack(partial: Partial<Track>): Track {
  return {
    id: uid(),
    title: partial.title || 'Unknown Track',
    artist: partial.artist || 'Unknown Artist',
    duration: partial.duration || 0,
    source: partial.source || 'upload',
    url: partial.url,
    addedAt: Date.now(),
    fileSize: partial.fileSize,
  };
}

export function createLog(level: LogEntry['level'], message: string): LogEntry {
  return { id: uid(), timestamp: Date.now(), level, message };
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

export function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function maskToken(token: string): string {
  if (!token) return '';
  if (token.length < 10) return '****';
  return token.slice(0, 6) + '...' + token.slice(-4);
}
