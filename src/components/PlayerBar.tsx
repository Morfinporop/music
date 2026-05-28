import { IcPlay, IcPause, IcSkip, IcPrev, IcStop, IcVolume, IcShuffle, IcRepeat, IcMusic } from './Icons';
import { Track, formatDuration } from '../store';

interface Props {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  shuffle: boolean;
  repeat: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSkip: () => void;
  onPrev: () => void;
  onVolume: (v: number) => void;
  onSeek: (p: number) => void;
  onShuffle: () => void;
  onRepeat: () => void;
}

export default function PlayerBar({ currentTrack, isPlaying, progress, volume, shuffle, repeat, onPlay, onPause, onStop, onSkip, onPrev, onVolume, onSeek, onShuffle, onRepeat }: Props) {
  const dur = currentTrack?.duration || 0;
  const elapsed = dur * progress;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-60" />
      <div className="glass-solid">
        <div className="h-[80px] flex items-center px-5 lg:px-8 gap-5">
          {/* Track */}
          <div className="flex items-center gap-4 min-w-0 w-[180px] lg:w-[280px]">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all ${
              currentTrack
                ? 'bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-200/50'
                : 'bg-slate-50 border-slate-200'
            } ${isPlaying ? 'disc-spin shadow-lg shadow-indigo-200/50' : ''}`}>
              <IcMusic className={`w-5 h-5 ${currentTrack ? 'text-indigo-500' : 'text-slate-300'}`} />
            </div>
            <div className="min-w-0">
              <div className={`text-sm font-bold truncate ${currentTrack ? 'text-slate-800' : 'text-slate-300'}`}>
                {currentTrack?.title || 'Нет трека'}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {currentTrack?.artist || '—'}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 flex flex-col items-center gap-1.5 max-w-[560px] mx-auto">
            <div className="flex items-center gap-1">
              <button onClick={onShuffle} className={`p-2 rounded-lg transition-all hidden sm:block ${shuffle ? 'text-indigo-500 bg-indigo-50' : 'text-slate-300 hover:text-slate-500'}`}>
                <IcShuffle className="w-3.5 h-3.5" />
              </button>
              <button onClick={onPrev} className="p-2.5 text-slate-400 hover:text-slate-700 transition-colors">
                <IcPrev className="w-4 h-4" />
              </button>
              <button
                onClick={isPlaying ? onPause : onPlay}
                disabled={!currentTrack}
                className="w-11 h-11 rounded-full flex items-center justify-center mx-1 transition-all disabled:opacity-30 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-300/50 hover:shadow-indigo-400/60"
              >
                {isPlaying ? <IcPause className="w-4 h-4" /> : <IcPlay className="w-4 h-4 ml-0.5" />}
              </button>
              <button onClick={onSkip} className="p-2.5 text-slate-400 hover:text-slate-700 transition-colors">
                <IcSkip className="w-4 h-4" />
              </button>
              <button onClick={onStop} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                <IcStop className="w-3.5 h-3.5" />
              </button>
              <button onClick={onRepeat} className={`p-2 rounded-lg transition-all hidden sm:block ${repeat ? 'text-indigo-500 bg-indigo-50' : 'text-slate-300 hover:text-slate-500'}`}>
                <IcRepeat className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-full flex items-center gap-3">
              <span className="text-[10px] text-slate-400 mono w-9 text-right">{formatDuration(elapsed)}</span>
              <div
                className="flex-1 h-[5px] rounded-full bg-slate-100 cursor-pointer group relative"
                onClick={(e) => {
                  if (!currentTrack) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
                }}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 relative transition-[width] duration-200"
                  style={{ width: `${progress * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg border-2 border-indigo-500 opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                </div>
              </div>
              <span className="text-[10px] text-slate-400 mono w-9">{formatDuration(dur)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-3 w-[150px] justify-end">
            <IcVolume className="w-4 h-4 text-slate-400" />
            <div className="w-20 h-[5px] rounded-full bg-slate-100 cursor-pointer group relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                onVolume(Math.round(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))));
              }}
            >
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" style={{ width: `${volume}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow border border-indigo-300 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </div>
            <span className="text-[10px] text-slate-400 mono w-6 text-right">{volume}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
