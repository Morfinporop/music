import { IcServer, IcMusic, IcActivity, IcPower, IcGlobe, IcQueue, IcVolume } from './Icons';
import { Track, BotStatus, formatDuration } from '../store';

interface Props {
  status: BotStatus;
  tracks: Track[];
  onToggleBot: () => void;
}

export default function DashboardPage({ status, tracks, onToggleBot }: Props) {
  const uptimeH = Math.floor(status.uptime / 3600);
  const uptimeM = Math.floor((status.uptime % 3600) / 60);
  const uptimeS = status.uptime % 60;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Панель управления</h1>
          <p className="text-sm text-slate-400 mt-2">Статус бота и управление</p>
        </div>
        <button onClick={onToggleBot} className={status.online ? 'btn-danger' : 'btn-primary'}>
          <IcPower className="w-4 h-4" />
          {status.online ? 'Остановить' : 'Запустить'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          color="emerald"
          icon={<div className={status.online ? 'status-online' : 'status-offline'} />}
          label="Статус"
          value={status.online ? 'Онлайн' : 'Оффлайн'}
        />
        <StatCard
          color="indigo"
          icon={<IcActivity className="w-4 h-4 text-indigo-500" />}
          label="Время работы"
          value={status.online ? `${uptimeH}ч ${uptimeM}м ${uptimeS}с` : '—'}
        />
        <StatCard
          color="purple"
          icon={<IcServer className="w-4 h-4 text-purple-500" />}
          label="Серверов"
          value={status.online ? String(status.guilds) : '0'}
        />
        <StatCard
          color="amber"
          icon={<IcMusic className="w-4 h-4 text-amber-500" />}
          label="Треков"
          value={String(tracks.length)}
        />
      </div>

      {/* Now Playing */}
      <div className="glass-md rounded-3xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500" />
        <div className="p-7">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[.15em]">Сейчас играет</h2>
          </div>

          {status.currentTrack ? (
            <div className="flex items-center gap-6 flex-wrap">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200/50 flex items-center justify-center ${status.isPlaying ? 'glow-indigo' : ''}`}>
                <div className={status.isPlaying ? 'disc-spin' : ''}>
                  <IcMusic className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xl font-bold text-slate-800 truncate">{status.currentTrack.title}</div>
                <div className="text-sm text-slate-400 mt-1">{status.currentTrack.artist}</div>
                <div className="mt-4 progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${status.progress * 100}%` }} />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[11px] text-slate-300 mono">{formatDuration(status.currentTrack.duration * status.progress)}</span>
                  <span className="text-[11px] text-slate-300 mono">{formatDuration(status.currentTrack.duration)}</span>
                </div>
              </div>
              {status.isPlaying && (
                <div className="hidden md:flex items-end gap-[3px] h-12">
                  {[14, 24, 10, 30, 16, 28, 12, 22, 18, 32, 8, 26, 14, 20].map((h, i) => (
                    <div key={i} className="waveform-bar" style={{ '--h': `${h}px`, '--d': `${0.5 + (i % 5) * 0.1}s`, '--delay': `${i * 0.05}s` } as React.CSSProperties} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl glass mx-auto mb-4 flex items-center justify-center">
                <IcMusic className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-sm text-slate-400 font-medium">Ничего не играет</p>
              <p className="text-xs text-slate-300 mt-1">Используй /play в Discord</p>
            </div>
          )}
        </div>
      </div>

      {/* Commands + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-md rounded-3xl p-7">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[.15em] mb-5">Команды бота</h2>
          <div className="space-y-3">
            {[
              { cmd: '/play', args: '<запрос>', desc: 'Воспроизвести трек' },
              { cmd: '/skip', args: '', desc: 'Пропустить' },
              { cmd: '/stop', args: '', desc: 'Остановить' },
              { cmd: '/queue', args: '', desc: 'Очередь' },
              { cmd: '/np', args: '', desc: 'Текущий трек' },
              { cmd: '/volume', args: '<1-100>', desc: 'Громкость' },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <code className="text-[12px] mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl min-w-[120px]">
                  {c.cmd} <span className="text-indigo-300">{c.args}</span>
                </code>
                <span className="text-[12px] text-slate-400">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-md rounded-3xl p-7">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[.15em] mb-5">Соединение</h2>
          <div className="space-y-4">
            <InfoRow icon={<IcGlobe className="w-3.5 h-3.5" />} label="Gateway" value={status.online ? 'Подключен' : 'Отключен'} ok={status.online} />
            <InfoRow icon={<IcVolume className="w-3.5 h-3.5" />} label="Голос" value={status.voiceConnections > 0 ? `${status.voiceConnections} канал` : 'Нет'} ok={status.voiceConnections > 0} />
            <InfoRow icon={<IcActivity className="w-3.5 h-3.5" />} label="Пинг" value={status.online ? `${Math.floor(30 + Math.random() * 40)}мс` : '—'} ok={status.online} />
            <InfoRow icon={<IcQueue className="w-3.5 h-3.5" />} label="Очередь" value={`${status.queue.length} треков`} ok={status.queue.length > 0} />
          </div>
          <div className="divider my-5" />
          <div className="text-[10px] text-slate-300 mono">
            discord.js v14 / discord-player v7
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'from-emerald-50 to-emerald-50/30 border-emerald-200/50',
    indigo: 'from-indigo-50 to-indigo-50/30 border-indigo-200/50',
    purple: 'from-purple-50 to-purple-50/30 border-purple-200/50',
    amber: 'from-amber-50 to-amber-50/30 border-amber-200/50',
  };
  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br ${colors[color]} border`}>
      <div className="mb-4">{icon}</div>
      <div className="text-2xl font-extrabold text-slate-800">{value}</div>
      <div className="text-[11px] text-slate-400 mt-1 font-semibold">{label}</div>
    </div>
  );
}

function InfoRow({ icon, label, value, ok }: { icon: React.ReactNode; label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="text-slate-300">{icon}</span>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-xs text-slate-600 mono font-medium">{value}</span>
        <div className={`w-2 h-2 rounded-full ${ok ? 'bg-emerald-400' : 'bg-slate-200'}`} />
      </div>
    </div>
  );
}
