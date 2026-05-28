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
  upload: 'bg-purple-50 text-purple-600 border-purple-200',
  soundcloud: 'bg-orange-50 text-orange-600 border-orange-200',
  spotify: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  url: 'bg-sky-50 text-sky-600 border-sky-200',
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
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Библиотека</h1>
          <p className="text-sm text-slate-400 mt-2 flex items-center gap-3">
            <span>{tracks.length} треков</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>{formatDuration(totalDuration)}</span>
            {totalSize > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>{formatBytes(totalSize)}</span>
              </>
            )}
          </p>
        </div>
        <button onClick={goUpload} className="btn-primary">
          <IcPlus className="w-4 h-4" />
          Добавить
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <IcSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input type="text" placeholder="Поиск треков..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-11" />
        </div>
        <div className="flex gap-1 p-1 bg-white/60 rounded-xl border border-slate-200/50">
          {(['date', 'title', 'duration'] as const).map(s => (
            <button key={s} onClick={() => setSortBy(s)} className={`px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${sortBy === s ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              {s === 'date' ? 'Новые' : s === 'title' ? 'А-Я' : 'Длина'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl glass mx-auto mb-5 flex items-center justify-center">
            <IcMusic className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-sm text-slate-400 font-medium mb-2">
            {tracks.length === 0 ? 'Библиотека пуста' : 'Ничего не найдено'}
          </p>
          {tracks.length === 0 && (
            <button onClick={goUpload} className="btn-ghost text-xs mt-3">Добавить первый трек</button>
          )}
        </div>
      ) : (
        <div className="glass-md rounded-3xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_100px_80px_70px] gap-4 px-6 py-4 text-[10px] text-slate-400 font-bold uppercase tracking-[.12em] border-b border-slate-100">
            <span>Название</span>
            <span>Источник</span>
            <span className="text-right">Длина</span>
            <span className="text-right">Действия</span>
          </div>
          <div>
            {filtered.map((track) => (
              <div key={track.id} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_100px_80px_70px] gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-all group border-b border-slate-100/50 last:border-b-0">
                <div className="flex items-center gap-4 min-w-0">
                  <button onClick={() => onPlayTrack(track)} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 opacity-60 group-hover:opacity-100 group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all">
                    <IcPlay className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-600" />
                  </button>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-700 truncate group-hover:text-slate-900">{track.title}</div>
                    <div className="text-[11px] text-slate-400 truncate">{track.artist}</div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border ${sourceStyles[track.source] || sourceStyles.url}`}>
                    {track.source}
                  </span>
                </div>
                <span className="hidden sm:block text-[12px] text-slate-400 mono text-right">{formatDuration(track.duration)}</span>
                <div className="flex items-center gap-0.5 justify-end">
                  <button onClick={() => onAddToQueue(track)} className="p-2 text-slate-300 hover:text-indigo-500 transition-colors rounded-lg hover:bg-indigo-50" title="В очередь">
                    <IcPlus className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onDelete(track.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50" title="Удалить">
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
