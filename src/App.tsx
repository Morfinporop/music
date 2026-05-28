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
  getInitialData, saveData, createLog,
} from './store';

type Page = 'dashboard' | 'library' | 'queue' | 'upload' | 'settings' | 'logs';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [mobileMenu, setMobileMenu] = useState(false);

  const initial = getInitialData();
  const [config, setConfig] = useState<BotConfig>(initial.config);
  // Убрали демо-треки — пустая библиотека по умолчанию
  const [tracks, setTracks] = useState<Track[]>(initial.tracks);
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

  useEffect(() => { saveData(config, tracks, logs); }, [config, tracks, logs]);

  const skipRef = useRef(() => {});

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

  const [uptimeDisplay, setUptimeDisplay] = useState(0);
  useEffect(() => {
    if (!botOnline) { setUptimeDisplay(0); return; }
    startTimeRef.current = Date.now();
    const i = setInterval(() => setUptimeDisplay(Math.floor((Date.now() - startTimeRef.current) / 1000)), 1000);
    return () => clearInterval(i);
  }, [botOnline]);

  const toggleBot = () => {
    if (botOnline) {
      setBotOnline(false); setIsPlaying(false); setCurrentTrack(null); setQueue([]); setProgress(0);
      addLog('warn', 'Бот остановлен');
    } else {
      if (!config.token) {
        addLog('error', 'Токен не указан — перейди в Настройки');
        setPage('settings');
        return;
      }
      setBotOnline(true);
      addLog('success', `Бот запущен — ID: ${config.clientId || '???'}`);
      addLog('info', 'Подключение к Discord Gateway...');
      addLog('info', 'Загружены экстракторы: SoundCloud, Spotify, AppleMusic');
      addLog('info', 'Зарегистрировано 6 slash-команд');
    }
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track); setIsPlaying(true); setProgress(0);
    addLog('info', `Воспроизводится: ${track.title} — ${track.artist}`);
  };

  const handlePlay = () => {
    if (currentTrack) { setIsPlaying(true); addLog('info', `Продолжено: ${currentTrack.title}`); }
    else if (queue.length > 0) {
      const next = queue[0]; setQueue(prev => prev.slice(1)); playTrack(next);
    } else if (tracks.length > 0) {
      playTrack(shuffle ? tracks[Math.floor(Math.random() * tracks.length)] : tracks[0]);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (currentTrack) addLog('info', `Пауза: ${currentTrack.title}`);
  };

  const handleStop = () => {
    setIsPlaying(false); setCurrentTrack(null); setQueue([]); setProgress(0);
    addLog('warn', 'Остановлено — очередь очищена');
  };

  const handleSkip = () => {
    if (queue.length > 0) {
      const idx = shuffle ? Math.floor(Math.random() * queue.length) : 0;
      const next = queue[idx];
      setQueue(prev => prev.filter((_, i) => i !== idx));
      playTrack(next);
      addLog('info', `Пропущено → ${next.title}`);
    } else if (repeat && currentTrack) {
      setProgress(0);
      addLog('info', `Повтор: ${currentTrack.title}`);
    } else {
      setIsPlaying(false); setCurrentTrack(null); setProgress(0);
      addLog('info', 'Очередь закончилась');
    }
  };
  skipRef.current = handleSkip;

  const handlePrev = () => {
    if (currentTrack) { setProgress(0); addLog('info', `Сначала: ${currentTrack.title}`); }
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
    addLog('info', `В очередь: ${track.title}`);
  };

  const removeFromQueue = (index: number) => setQueue(prev => prev.filter((_, i) => i !== index));

  const playQueueIndex = (index: number) => {
    const track = queue[index];
    setQueue(prev => prev.filter((_, i) => i !== index));
    playTrack(track);
  };

  const addTrackToLibrary = (track: Track) => {
    setTracks(prev => [...prev, track]);
    addLog('success', `Добавлено: ${track.title}`);
  };

  const deleteTrack = (id: string) => {
    const t = tracks.find(t => t.id === id);
    setTracks(prev => prev.filter(t => t.id !== id));
    if (t) addLog('warn', `Удалено: ${t.title}`);
  };

  const botStatus: BotStatus = {
    online: botOnline, uptime: uptimeDisplay,
    guilds: botOnline ? 1 : 0, voiceConnections: isPlaying ? 1 : 0,
    currentTrack, queue, isPlaying, progress, volume,
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar
        page={page} setPage={setPage}
        botOnline={botOnline} mobileOpen={mobileMenu}
        closeMobile={() => setMobileMenu(false)}
        queueCount={queue.length}
      />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <div className="lg:hidden flex items-center justify-between px-5 h-[60px] glass-solid sticky top-0 z-30">
          <button onClick={() => setMobileMenu(true)} className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
            <IcMenu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <IcBot className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-700">SoundForge</span>
          </div>
          <div className={botOnline ? 'status-online' : 'status-offline'} />
        </div>

        <main className="flex-1 px-5 lg:px-10 py-8 lg:py-10 pb-28 overflow-y-auto">
          {page === 'dashboard' && <DashboardPage status={botStatus} tracks={tracks} onToggleBot={toggleBot} />}
          {page === 'library' && <LibraryPage tracks={tracks} onDelete={deleteTrack} onPlayTrack={playTrack} onAddToQueue={addToQueue} goUpload={() => setPage('upload')} />}
          {page === 'queue' && <QueuePage queue={queue} currentTrack={currentTrack} isPlaying={isPlaying} onRemove={removeFromQueue} onClear={() => { setQueue([]); addLog('warn', 'Очередь очищена'); }} onPlayIndex={playQueueIndex} />}
          {page === 'upload' && <UploadPage onAdd={addTrackToLibrary} />}
          {page === 'settings' && <SettingsPage config={config} onSave={(c) => { setConfig(c); setVolume(c.volume); addLog('success', 'Настройки сохранены'); }} />}
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
        onShuffle={() => { setShuffle(p => !p); addLog('info', `Перемешка: ${!shuffle ? 'ВКЛ' : 'ВЫКЛ'}`); }}
        onRepeat={() => { setRepeat(p => !p); addLog('info', `Повтор: ${!repeat ? 'ВКЛ' : 'ВЫКЛ'}`); }}
      />
    </div>
  );
}
