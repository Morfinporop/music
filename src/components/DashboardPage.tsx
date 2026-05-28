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
      {/* Background orbs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-30" style={{ zIndex: 0 }}>
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-indigo-600/8 blur-[100px]" style={{ animation: 'orbFloat 8s ease-in-out infinite' }} />
        <div className="absolute top-40 right-60 w-48 h-48 rounded-full bg-purple-600/6 blur-[80px]" style={{ animation: 'orbFloat 12s ease-in-out infinite reverse' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-white/25 mt-2">Real-time bot monitoring & controls</p>
        </div>
        <button onClick={onToggleBot} className={status.online ? 'btn-danger' : 'btn-primary'}>
          <IcPower className="w-4 h-4" />
          {status.online ? 'Stop Bot' : 'Launch Bot'}
        </button>
      </div>

      {/* Stats grid */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          gradient="from-emerald-500/10 to-emerald-500/[.02]"
          borderColor={status.online ? 'border-emerald-500/10' : undefined}
          icon={<div className={status.online ? 'status-online' : 'status-offline'} />}
          label="Status"
          value={status.online ? 'Online' : 'Offline'}
          accent={status.online ? 'text-emerald-300' : 'text-white/25'}
        />
        <StatCard
          gradient="from-indigo-500/8 to-indigo-500/[.02]"
          icon={<IcActivity className="w-4 h-4 text-indigo-400/70" />}
          label="Uptime"
          value={status.online ? `${uptimeH}h ${uptimeM}m ${uptimeS}s` : '--'}
          accent="text-indigo-200/80"
        />
        <StatCard
          gradient="from-purple-500/8 to-purple-500/[.02]"
          icon={<IcServer className="w-4 h-4 text-purple-400/70" />}
          label="Guilds"
          value={status.online ? String(status.guilds) : '0'}
          accent="text-purple-200/80"
        />
        <StatCard
          gradient="from-amber-500/8 to-amber-500/[.02]"
          icon={<IcMusic className="w-4 h-4 text-amber-400/70" />}
          label="Library"
          value={`${tracks.length}`}
          sub="tracks"
          accent="text-amber-200/80"
        />
      </div>

      {/* Now Playing — large hero card */}
      <div className="relative z-10 glass-md rounded-2xl overflow-hidden">
        {/* Gradient accent top border */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        <div className="p-7">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-indigo-500/50" />
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-[.15em]">Now Playing</h2>
          </div>

          {status.currentTrack ? (
            <div className="flex items-center gap-6 flex-wrap sm:flex-nowrap">
              {/* Album art placeholder with animated ring */}
              <div className="relative flex-shrink-0">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-fuchsia-500/15 border border-white/[.06] flex items-center justify-center ${status.isPlaying ? 'glow-indigo' : ''}`}>
                  <div className={status.isPlaying ? 'disc-spin' : ''}>
                    <IcMusic className="w-8 h-8 text-indigo-400/40" />
                  </div>
                </div>
                {status.isPlaying && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xl font-bold text-white tracking-tight truncate">{status.currentTrack.title}</div>
                <div className="text-sm text-white/25 mt-1">{status.currentTrack.artist}</div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${status.progress * 100}%` }} />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[11px] text-white/15 mono">{formatDuration(status.currentTrack.duration * status.progress)}</span>
                    <span className="text-[11px] text-white/15 mono">{formatDuration(status.currentTrack.duration)}</span>
                  </div>
                </div>
              </div>

              {/* Waveform */}
              {status.isPlaying && (
                <div className="hidden md:flex items-end gap-[3px] h-12 opacity-60">
                  {[14, 24, 10, 30, 16, 28, 12, 22, 18, 32, 8, 26, 14, 20, 28, 12, 24].map((h, i) => (
                    <div
                      key={i}
                      className="waveform-bar"
                      style={{ '--h': `${h}px`, '--d': `${0.5 + (i % 5) * 0.12}s`, '--delay': `${i * 0.06}s` } as React.CSSProperties}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl glass mx-auto mb-4 flex items-center justify-center">
                <IcMusic className="w-7 h-7 text-white/8" />
              </div>
              <p className="text-sm text-white/15 font-medium">No track playing</p>
              <p className="text-xs text-white/8 mt-1">Use /play in Discord or play from Library</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row — Commands + Connection */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Commands */}
        <div className="glass-md rounded-2xl overflow-hidden card-shine">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
          <div className="p-6">
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-[.15em] mb-5">Slash Commands</h2>
            <div className="space-y-2.5">
              {[
                { cmd: '/play', args: '<query>', desc: 'Play a track' },
                { cmd: '/skip', args: '', desc: 'Skip current' },
                { cmd: '/stop', args: '', desc: 'Stop & clear' },
                { cmd: '/queue', args: '', desc: 'View queue' },
                { cmd: '/nowplaying', args: '', desc: 'Current info' },
                { cmd: '/volume', args: '<1-100>', desc: 'Set volume' },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <code className="text-[12px] mono font-semibold text-indigo-300/70 bg-indigo-500/[.06] px-2.5 py-1 rounded-lg min-w-[110px] transition-colors group-hover:text-indigo-300 group-hover:bg-indigo-500/10">
                    {c.cmd} <span className="text-indigo-300/30">{c.args}</span>
                  </code>
                  <span className="text-[12px] text-white/20 group-hover:text-white/35 transition-colors">{c.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Connection */}
        <div className="glass-md rounded-2xl overflow-hidden card-shine">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
          <div className="p-6">
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-[.15em] mb-5">Connection</h2>
            <div className="space-y-4">
              <InfoRow icon={<IcGlobe className="w-3.5 h-3.5" />} label="Gateway" value={status.online ? 'Connected' : 'Disconnected'} ok={status.online} />
              <InfoRow icon={<IcVolume className="w-3.5 h-3.5" />} label="Voice" value={status.voiceConnections > 0 ? `${status.voiceConnections} active` : 'None'} ok={status.voiceConnections > 0} />
              <InfoRow icon={<IcActivity className="w-3.5 h-3.5" />} label="Latency" value={status.online ? `${Math.floor(30 + Math.random() * 40)}ms` : '--'} ok={status.online} />
              <InfoRow icon={<IcQueue className="w-3.5 h-3.5" />} label="Queue" value={`${status.queue.length} tracks`} ok={status.queue.length > 0} />
            </div>

            <div className="divider my-5" />

            <div className="flex items-center gap-2 text-[10px] text-white/10">
              <IcServer className="w-3 h-3" />
              <span className="mono">discord.js v14.16 / discord-player v7.2 / Node 22</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent, gradient, borderColor, sub }: {
  icon: React.ReactNode; label: string; value: string; accent?: string;
  gradient?: string; borderColor?: string; sub?: string;
}) {
  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br ${gradient || 'from-white/[.02] to-transparent'} border ${borderColor || 'border-white/[.04]'} card-shine transition-all`}>
      <div className="flex items-center gap-2 mb-4">{icon}</div>
      <div className="flex items-baseline gap-1.5">
        <div className={`text-2xl font-extrabold tracking-tight ${accent || 'text-white/80'}`}>{value}</div>
        {sub && <span className="text-[11px] text-white/15">{sub}</span>}
      </div>
      <div className="text-[11px] text-white/15 mt-1.5 font-medium">{label}</div>
    </div>
  );
}

function InfoRow({ icon, label, value, ok }: { icon: React.ReactNode; label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-2.5">
        <span className="text-white/10 group-hover:text-white/20 transition-colors">{icon}</span>
        <span className="text-xs text-white/25">{label}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-xs text-white/45 mono">{value}</span>
        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${ok ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,.5)]' : 'bg-white/8'}`} />
      </div>
    </div>
  );
}
