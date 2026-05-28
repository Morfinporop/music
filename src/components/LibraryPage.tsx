import { useState } from 'react';
import { IcMusic, IcTrash, IcPlay, IcSearch, IcPlus } from './Icons';
import { Track, formatDuration, formatBytes } from '../store';

interface Props {
  tracks: Track[];
  onDelete: (id: string) => void;
  onPlayTrack: (track: Track) => void;
  onAddToQueue: (track: Track) => void;
  goUpload: () => void;
}

const sourceStyles: Record<string, string> = {
  upload: 'bg-purple-500/8 text-purple-300/50 border-purple-500/10',
  soundcloud: 'bg-orange-500/8 text-orange-300/50 border-orange-500/10',
  spotify: 'bg-emerald-500/8 text-emerald-300/50 border-emerald-500/10',
  url: 'bg-sky-500/8 text-sky-300/50 border-sky-500/10',
};

export default function LibraryPage({ tracks, onDelete, onPlayTrack, onAddToQueue, goUpload }: Props) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'duration'>('date');

  let filtered = tracks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.artist.toLowerCase().includes(search.toLowerCase())
  );

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'duration') return b.duration - a.duration;
    return b.addedAt - a.addedAt;
  });

  const totalDuration = tracks.reduce((s, t) => s + t.duration, 0);
  const totalSize = tracks.reduce((s, t) => s + (t.fileSize || 0), 0);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Library</h1>
          <p className="text-sm text-white/20 mt-2 flex items-center gap-3">
            <span>{tracks.length} tracks</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>{formatDuration(totalDuration)}</span>
            {totalSize > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>{formatBytes(totalSize)}</span>
              </>
            )}
          </p>
        </div>
        <button onClick={goUpload} className="btn-primary">
          <IcPlus className="w-4 h-4" />
          Upload
        </button>
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <IcSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/12" />
          <input
            type="text"
            placeholder="Search tracks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
          />
        </div>
        <div className="flex gap-1 p-1 bg-white/[.02] rounded-xl border border-white/[.03]">
          {(['date', 'title', 'duration'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3.5 py-2 rounded-lg text-[11px] font-semibold tracking-wide transition-all ${
                sortBy === s
                  ? 'bg-white/[.06] text-white/60 shadow-sm'
                  : 'text-white/20 hover:text-white/35'
              }`}
            >
              {s === 'date' ? 'Recent' : s === 'title' ? 'A-Z' : 'Duration'}
            </button>
          ))}
        </div>
      </div>

      {/* Track list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl glass mx-auto mb-5 flex items-center justify-center">
            <IcMusic className="w-7 h-7 text-white/6" />
          </div>
          <p className="text-sm text-white/15 font-medium mb-2">
            {tracks.length === 0 ? 'Library is empty' : 'No matches'}
          </p>
          {tracks.length === 0 && (
            <button onClick={goUpload} className="btn-ghost text-xs mt-3">Upload your first track</button>
          )}
        </div>
      ) : (
        <div className="glass-md rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-[1fr_100px_80px_70px] gap-4 px-6 py-3.5 text-[10px] text-white/15 font-bold uppercase tracking-[.12em] border-b border-white/[.03]">
            <span>Title</span>
            <span>Source</span>
            <span className="text-right">Duration</span>
            <span className="text-right">Actions</span>
          </div>

          <div>
            {filtered.map((track, idx) => (
              <div
                key={track.id}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_100px_80px_70px] gap-4 px-6 py-3.5 items-center hover:bg-white/[.015] transition-all group border-b border-white/[.02] last:border-b-0"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button onClick={() => onPlayTrack(track)} className="w-9 h-9 rounded-xl bg-white/[.03] border border-white/[.04] flex items-center justify-center flex-shrink-0 opacity-40 group-hover:opacity-100 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/15 transition-all">
                    <IcPlay className="w-3 h-3 text-white/60 group-hover:text-indigo-300" />
                  </button>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white/75 truncate group-hover:text-white/90 transition-colors">{track.title}</div>
                    <div className="text-[11px] text-white/15 truncate">{track.artist}</div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <span className={`text-[10px] px-2 py-[3px] rounded-md font-semibold border ${sourceStyles[track.source] || sourceStyles.url}`}>
                    {track.source}
                  </span>
                </div>
                <span className="hidden sm:block text-[12px] text-white/20 mono text-right">{formatDuration(track.duration)}</span>
                <div className="flex items-center gap-0.5 justify-end">
                  <button onClick={() => onAddToQueue(track)} className="p-2 text-white/10 hover:text-indigo-400/70 transition-colors rounded-lg hover:bg-white/[.02]" title="Add to queue">
                    <IcPlus className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onDelete(track.id)} className="p-2 text-white/10 hover:text-rose-400/70 transition-colors rounded-lg hover:bg-white/[.02]" title="Delete">
                    <IcTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
