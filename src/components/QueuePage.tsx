import { IcMusic, IcTrash, IcPlay, IcQueue } from './Icons';
import { Track, formatDuration } from '../store';

interface Props {
  queue: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onRemove: (index: number) => void;
  onClear: () => void;
  onPlayIndex: (index: number) => void;
}

export default function QueuePage({ queue, currentTrack, isPlaying, onRemove, onClear, onPlayIndex }: Props) {
  const totalDuration = queue.reduce((s, t) => s + t.duration, 0);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Queue</h1>
          <p className="text-sm text-white/20 mt-2 flex items-center gap-3">
            <span>{queue.length} tracks</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>{formatDuration(totalDuration)}</span>
          </p>
        </div>
        {queue.length > 0 && (
          <button onClick={onClear} className="btn-danger">
            <IcTrash className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <div className="glass-md rounded-2xl overflow-hidden glow-indigo">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
          <div className="p-6">
            <div className="text-[10px] text-indigo-300/50 font-bold uppercase tracking-[.15em] mb-4">Now Playing</div>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-600/15 border border-white/[.06] flex items-center justify-center flex-shrink-0">
                {isPlaying ? (
                  <div className="flex items-end gap-[2px] h-5">
                    {[12, 18, 8, 16, 14].map((h, i) => (
                      <div key={i} className="waveform-bar" style={{ '--h': `${h}px`, '--d': `${0.35 + i * 0.1}s`, '--delay': `${i * 0.05}s` } as React.CSSProperties} />
                    ))}
                  </div>
                ) : (
                  <IcMusic className="w-6 h-6 text-indigo-400/30" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-bold text-white truncate">{currentTrack.title}</div>
                <div className="text-sm text-white/20 mt-0.5">{currentTrack.artist} / {formatDuration(currentTrack.duration)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queue list */}
      {queue.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl glass mx-auto mb-5 flex items-center justify-center">
            <IcQueue className="w-7 h-7 text-white/6" />
          </div>
          <p className="text-sm text-white/15 font-medium">Queue is empty</p>
          <p className="text-xs text-white/8 mt-2">Add tracks from Library or use /play in Discord</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {queue.map((track, i) => (
            <div key={`${track.id}-${i}`} className="glass rounded-xl px-5 py-3.5 flex items-center gap-4 hover:bg-white/[.02] transition-all group">
              <span className="text-[11px] text-white/10 mono w-5 text-right font-bold">{i + 1}</span>
              <button onClick={() => onPlayIndex(i)} className="w-9 h-9 rounded-xl bg-white/[.02] border border-white/[.04] flex items-center justify-center opacity-30 group-hover:opacity-100 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/15 transition-all flex-shrink-0">
                <IcPlay className="w-3 h-3 text-white/60 group-hover:text-indigo-300" />
              </button>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-white/60 truncate group-hover:text-white/80 transition-colors font-medium">{track.title}</div>
                <div className="text-[11px] text-white/15 truncate">{track.artist}</div>
              </div>
              <span className="text-[11px] text-white/10 mono hidden sm:block">{formatDuration(track.duration)}</span>
              <button onClick={() => onRemove(i)} className="p-2 text-white/8 hover:text-rose-400/60 transition-colors rounded-lg hover:bg-white/[.02]">
                <IcTrash className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
