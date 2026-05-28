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
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Очередь</h1>
          <p className="text-sm text-slate-400 mt-2 flex items-center gap-3">
            <span>{queue.length} треков</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>{formatDuration(totalDuration)}</span>
          </p>
        </div>
        {queue.length > 0 && (<button onClick={onClear} className="btn-danger"><IcTrash className="w-4 h-4" />Очистить</button>)}
      </div>

      {currentTrack && (
        <div className="glass-md rounded-3xl overflow-hidden glow-cyan">
          <div className="h-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-sky-500" />
          <div className="p-6">
            <div className="text-[10px] text-cyan-500 font-bold uppercase tracking-[.15em] mb-4">Сейчас играет</div>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-100 to-sky-100 border border-cyan-200/50 flex items-center justify-center flex-shrink-0">
                {isPlaying ? (
                  <div className="flex items-end gap-[2px] h-5">
                    {[12, 18, 8, 16, 14].map((h, i) => (<div key={i} className="waveform-bar" style={{ '--h': `${h}px`, '--d': `${0.3 + i * 0.08}s`, '--delay': `${i * 0.04}s` } as React.CSSProperties} />))}
                  </div>
                ) : (<IcMusic className="w-6 h-6 text-cyan-400" />)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-bold text-slate-800 truncate">{currentTrack.title}</div>
                <div className="text-sm text-slate-400">{currentTrack.artist} / {formatDuration(currentTrack.duration)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {queue.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl glass mx-auto mb-5 flex items-center justify-center"><IcQueue className="w-7 h-7 text-slate-300" /></div>
          <p className="text-sm text-slate-400 font-medium">Очередь пуста</p>
          <p className="text-xs text-slate-300 mt-2">Добавь треки из библиотеки или используй /play</p>
        </div>
      ) : (
        <div className="space-y-2">
          {queue.map((track, i) => (
            <div key={`${track.id}-${i}`} className="glass rounded-2xl px-5 py-4 flex items-center gap-4 hover:bg-white/70 transition-all group">
              <span className="text-[11px] text-slate-300 mono w-5 text-right font-bold">{i + 1}</span>
              <button onClick={() => onPlayIndex(i)} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center opacity-50 group-hover:opacity-100 group-hover:bg-cyan-50 group-hover:border-cyan-200 transition-all flex-shrink-0">
                <IcPlay className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-600" />
              </button>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-slate-600 truncate group-hover:text-slate-800 font-medium">{track.title}</div>
                <div className="text-[11px] text-slate-300 truncate">{track.artist}</div>
              </div>
              <span className="text-[11px] text-slate-300 mono hidden sm:block">{formatDuration(track.duration)}</span>
              <button onClick={() => onRemove(i)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50"><IcTrash className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
