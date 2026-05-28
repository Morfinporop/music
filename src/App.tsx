import { useState, useEffect, useCallback, useRef } from 'react';
import { IcMenu, IcBot } from './components/Icons';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';
import DashboardPage from './components/DashboardPage';
import LibraryPage from './components/LibraryPage';
import QueuePage from './components/QueuePage';
import UploadPage from './components/UploadPage';
import SettingsPage from './components/SettingsPage';
import LogsPage from './components/LogsPage';
import {
  Track, BotConfig, BotStatus, LogEntry,
  getInitialData, saveData, createTrack, createLog,
} from './store';

type Page = 'dashboard' | 'library' | 'queue' | 'upload' | 'settings' | 'logs';

const DEMO_TRACKS: Partial<Track>[] = [
  { title: 'Midnight City', artist: 'M83', duration: 243, source: 'soundcloud' },
  { title: 'Strobe', artist: 'Deadmau5', duration: 637, source: 'soundcloud' },
  { title: 'Innerbloom', artist: 'RUFUS DU SOL', duration: 562, source: 'spotify' },
  { title: 'Ghosts n Stuff', artist: 'Deadmau5 ft. Rob Swire', duration: 208, source: 'soundcloud' },
  { title: 'The Veldt', artist: 'Deadmau5', duration: 291, source: 'spotify' },
  { title: 'Opus', artist: 'Eric Prydz', duration: 541, source: 'url' },
  { title: 'Cola', artist: 'CamelPhat & Elderbrook', duration: 236, source: 'spotify' },
  { title: 'Resonance', artist: 'HOME', duration: 213, source: 'soundcloud' },
];

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [mobileMenu, setMobileMenu] = useState(false);

  const initial = getInitialData();
  const [config, setConfig] = useState<BotConfig>(initial.config);
  const [tracks, setTracks] = useState<Track[]>(() => {
    if (initial.tracks.length > 0) return initial.tracks;
    return DEMO_TRACKS.map(t => createTrack(t));
  });
  const [logs, setLogs] = useState<LogEntry[]>(initial.logs);

  const [botOnline, setBotOnline] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(config.volume);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const startTimeRef = useRef(0);

  const addLog = useCallback((level: LogEntry['level'], message: string) => {
    setLogs(prev => [...prev, createLog(level, message)].slice(-300));
  }, []);

  // Persist
  useEffect(() => { saveData(config, tracks, logs); }, [config, tracks, logs]);

  // Skip ref for interval
  const skipRef = useRef(() => {});

  // Progress tick
  useEffect(() => {
    if (!isPlaying || !currentTrack) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (1 / currentTrack.duration);
        if (next >= 1) {
          setTimeout(() => skipRef.current(), 0);
          return 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  // Uptime display
  const [uptimeDisplay, setUptimeDisplay] = useState(0);
  useEffect(() => {
    if (!botOnline) { setUptimeDisplay(0); return; }
    startTimeRef.current = Date.now();
    const i = setInterval(() => setUptimeDisplay(Math.floor((Date.now() - startTimeRef.current) / 1000)), 1000);
    return () => clearInterval(i);
  }, [botOnline]);

  // ---- Bot toggle ----
  const toggleBot = () => {
    if (botOnline) {
      setBotOnline(false); setIsPlaying(false); setCurrentTrack(null); setQueue([]); setProgress(0);
      addLog('warn', 'Bot stopped');
    } else {
      if (!config.token) {
        addLog('error', 'No token set — go to Settings');
        setPage('settings');
        return;
      }
      setBotOnline(true);
      addLog('success', `Bot started — ID: ${config.clientId || '???'}`);
      addLog('info', 'Gateway connected');
      addLog('info', 'Extractors loaded: SoundCloud, Spotify, AppleMusic');
      addLog('info', '6 slash commands registered');
    }
  };

  // ---- Player ----
  const playTrack = (track: Track) => {
    setCurrentTrack(track); setIsPlaying(true); setProgress(0);
    addLog('info', `Playing: ${track.title} — ${track.artist}`);
  };

  const handlePlay = () => {
    if (currentTrack) { setIsPlaying(true); addLog('info', `Resumed: ${currentTrack.title}`); }
    else if (queue.length > 0) {
      const next = queue[0]; setQueue(prev => prev.slice(1)); playTrack(next);
    } else if (tracks.length > 0) {
      if (shuffle) {
        playTrack(tracks[Math.floor(Math.random() * tracks.length)]);
      } else {
        playTrack(tracks[0]);
      }
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (currentTrack) addLog('info', `Paused: ${currentTrack.title}`);
  };

  const handleStop = () => {
    setIsPlaying(false); setCurrentTrack(null); setQueue([]); setProgress(0);
    addLog('warn', 'Stopped — queue cleared');
  };

  const handleSkip = () => {
    if (queue.length > 0) {
      const idx = shuffle ? Math.floor(Math.random() * queue.length) : 0;
      const next = queue[idx];
      setQueue(prev => prev.filter((_, i) => i !== idx));
      playTrack(next);
      addLog('info', `Skipped → ${next.title}`);
    } else if (repeat && currentTrack) {
      setProgress(0);
      addLog('info', `Repeat: ${currentTrack.title}`);
    } else {
      setIsPlaying(false); setCurrentTrack(null); setProgress(0);
      addLog('info', 'Queue ended');
    }
  };
  skipRef.current = handleSkip;

  const handlePrev = () => {
    if (currentTrack) { setProgress(0); addLog('info', `Restart: ${currentTrack.title}`); }
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
    addLog('info', `Queued: ${track.title}`);
  };

  const removeFromQueue = (index: number) => setQueue(prev => prev.filter((_, i) => i !== index));

  const playQueueIndex = (index: number) => {
    const track = queue[index];
    setQueue(prev => prev.filter((_, i) => i !== index));
    playTrack(track);
  };

  const addTrackToLibrary = (track: Track) => {
    setTracks(prev => [...prev, track]);
    addLog('success', `Library + ${track.title}`);
  };

  const deleteTrack = (id: string) => {
    const t = tracks.find(t => t.id === id);
    setTracks(prev => prev.filter(t => t.id !== id));
    if (t) addLog('warn', `Removed: ${t.title}`);
  };

  const botStatus: BotStatus = {
    online: botOnline, uptime: uptimeDisplay,
    guilds: botOnline ? 1 : 0, voiceConnections: isPlaying ? 1 : 0,
    currentTrack, queue, isPlaying, progress, volume,
  };

  return (
    <div className="min-h-screen bg-[#050507] flex">
      <Sidebar
        page={page} setPage={setPage}
        botOnline={botOnline} mobileOpen={mobileMenu}
        closeMobile={() => setMobileMenu(false)}
        queueCount={queue.length}
      />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-5 h-[56px] border-b border-white/[.03] bg-[#050507]/90 backdrop-blur-xl sticky top-0 z-30">
          <button onClick={() => setMobileMenu(true)} className="p-2 -ml-2 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/[.03] transition-all">
            <IcMenu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <IcBot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white/60 tracking-tight">SoundForge</span>
          </div>
          <div className={botOnline ? 'status-online' : 'status-offline'} />
        </div>

        {/* Main content */}
        <main className="flex-1 px-5 lg:px-10 py-7 lg:py-10 pb-28 overflow-y-auto">
          {page === 'dashboard' && <DashboardPage status={botStatus} tracks={tracks} onToggleBot={toggleBot} />}
          {page === 'library' && <LibraryPage tracks={tracks} onDelete={deleteTrack} onPlayTrack={playTrack} onAddToQueue={addToQueue} goUpload={() => setPage('upload')} />}
          {page === 'queue' && <QueuePage queue={queue} currentTrack={currentTrack} isPlaying={isPlaying} onRemove={removeFromQueue} onClear={() => { setQueue([]); addLog('warn', 'Queue cleared'); }} onPlayIndex={playQueueIndex} />}
          {page === 'upload' && <UploadPage onAdd={addTrackToLibrary} />}
          {page === 'settings' && <SettingsPage config={config} onSave={(c) => { setConfig(c); setVolume(c.volume); addLog('success', 'Settings saved'); }} />}
          {page === 'logs' && <LogsPage logs={logs} onClear={() => setLogs([])} />}
        </main>
      </div>

      <PlayerBar
        currentTrack={currentTrack} isPlaying={isPlaying}
        progress={progress} volume={volume}
        shuffle={shuffle} repeat={repeat}
        onPlay={handlePlay} onPause={handlePause} onStop={handleStop}
        onSkip={handleSkip} onPrev={handlePrev}
        onVolume={setVolume} onSeek={setProgress}
        onShuffle={() => { setShuffle(p => !p); addLog('info', `Shuffle: ${!shuffle ? 'ON' : 'OFF'}`); }}
        onRepeat={() => { setRepeat(p => !p); addLog('info', `Repeat: ${!repeat ? 'ON' : 'OFF'}`); }}
      />
    </div>
  );
}
