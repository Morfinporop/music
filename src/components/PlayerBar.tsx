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
      {/* Gradient line at top */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="glass-bright">
        <div className="h-[76px] flex items-center px-4 lg:pl-6 lg:pr-8 gap-4">
          {/* Track info */}
          <div className="flex items-center gap-3.5 min-w-0 w-[180px] lg:w-[280px]">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all ${
              currentTrack
                ? 'bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-fuchsia-500/15 border-white/[.06]'
                : 'bg-white/[.02] border-white/[.04]'
            } ${isPlaying ? 'disc-spin glow-indigo' : ''}`}>
              <IcMusic className={`w-5 h-5 ${currentTrack ? 'text-indigo-400/50' : 'text-white/8'}`} />
            </div>
            <div className="min-w-0">
              <div className={`text-sm font-semibold truncate ${currentTrack ? 'text-white/85' : 'text-white/15'}`}>
                {currentTrack?.title || 'No track'}
              </div>
              <div className="text-[11px] text-white/20 truncate">
                {currentTrack?.artist || '--'}
              </div>
            </div>
          </div>

          {/* Center — Controls + Progress */}
          <div className="flex-1 flex flex-col items-center gap-1 max-w-[560px] mx-auto">
            {/* Controls */}
            <div className="flex items-center gap-0.5">
              <button onClick={onShuffle} className={`p-2 transition-colors hidden sm:block ${shuffle ? 'text-indigo-400' : 'text-white/15 hover:text-white/40'}`}>
                <IcShuffle className="w-3.5 h-3.5" />
              </button>
              <button onClick={onPrev} className="p-2.5 text-white/25 hover:text-white/70 transition-colors">
                <IcPrev className="w-[15px] h-[15px]" />
              </button>

              {/* Play/Pause — main button */}
              <button
                onClick={isPlaying ? onPause : onPlay}
                disabled={!currentTrack}
                className="w-10 h-10 rounded-full flex items-center justify-center mx-1 transition-all disabled:opacity-20 disabled:cursor-not-allowed bg-gradient-to-br from-white/95 to-white/80 hover:from-white hover:to-white/90 shadow-lg shadow-white/5"
              >
                {isPlaying
                  ? <IcPause className="w-[15px] h-[15px] text-[#0a0a0f]" />
                  : <IcPlay className="w-[15px] h-[15px] text-[#0a0a0f] ml-[2px]" />
                }
              </button>

              <button onClick={onSkip} className="p-2.5 text-white/25 hover:text-white/70 transition-colors">
                <IcSkip className="w-[15px] h-[15px]" />
              </button>
              <button onClick={onStop} className="p-2 text-white/12 hover:text-rose-400/60 transition-colors">
                <IcStop className="w-3.5 h-3.5" />
              </button>
              <button onClick={onRepeat} className={`p-2 transition-colors hidden sm:block ${repeat ? 'text-indigo-400' : 'text-white/15 hover:text-white/40'}`}>
                <IcRepeat className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Progress */}
            <div className="w-full flex items-center gap-2.5">
              <span className="text-[10px] text-white/15 mono w-9 text-right">{formatDuration(elapsed)}</span>
              <div
                className="flex-1 h-[3px] rounded-full bg-white/[.04] cursor-pointer group relative"
                onClick={(e) => {
                  if (!currentTrack) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
                }}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-400 relative transition-[width] duration-300"
                  style={{ width: `${progress * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-white/20 opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                </div>
              </div>
              <span className="text-[10px] text-white/15 mono w-9">{formatDuration(dur)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2.5 w-[150px] justify-end">
            <IcVolume className="w-4 h-4 text-white/15" />
            <div className="relative w-20 h-[3px] rounded-full bg-white/[.04] cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                onVolume(Math.round(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))));
              }}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500/60 to-purple-500/60 relative"
                style={{ width: `${volume}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </div>
            <span className="text-[10px] text-white/15 mono w-6 text-right">{volume}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
