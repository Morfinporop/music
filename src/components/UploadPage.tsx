import { useState, useRef } from 'react';
import { IcUpload, IcPlus, IcCheck } from './Icons';
import { Track, createTrack } from '../store';

interface Props { onAdd: (track: Track) => void; }

export default function UploadPage({ onAdd }: Props) {
  const [mode, setMode] = useState<'upload' | 'manual'>('manual');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [url, setUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [source, setSource] = useState<'upload' | 'soundcloud' | 'spotify' | 'url'>('url');
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);
  const [added, setAdded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const arr = Array.from(fileList).filter(f => f.type.startsWith('audio/') || f.name.match(/\.(mp3|wav|ogg|flac|m4a)$/i));
    setFiles(prev => [...prev, ...arr.map(f => ({ name: f.name, size: f.size }))]);
    arr.forEach(f => {
      const name = f.name.replace(/\.[^.]+$/, '');
      const parts = name.includes(' - ') ? name.split(' - ') : [name];
      onAdd(createTrack({ title: parts.length > 1 ? parts[1].trim() : parts[0].trim(), artist: parts.length > 1 ? parts[0].trim() : 'Неизвестен', duration: Math.floor(120 + Math.random() * 240), source: 'upload', fileSize: f.size }));
    });
  };

  const handleManualAdd = () => {
    if (!title.trim()) return;
    const durParts = duration.split(':');
    let durSec = 0;
    if (durParts.length === 2) durSec = parseInt(durParts[0]) * 60 + parseInt(durParts[1]);
    else if (durParts.length === 1) durSec = parseInt(durParts[0]) || 0;
    onAdd(createTrack({ title: title.trim(), artist: artist.trim() || 'Неизвестен', duration: durSec || Math.floor(120 + Math.random() * 240), source, url: url.trim() || undefined }));
    setTitle(''); setArtist(''); setUrl(''); setDuration('');
    setAdded(true); setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div><h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Добавить трек</h1><p className="text-sm text-slate-400 mt-2">Добавь музыку в библиотеку</p></div>

      <div className="flex gap-1 p-1 bg-white/60 rounded-xl border border-slate-200/50 w-fit">
        <button onClick={() => setMode('manual')} className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${mode === 'manual' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400'}`}><IcPlus className="w-3.5 h-3.5" />Вручную</button>
        <button onClick={() => setMode('upload')} className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${mode === 'upload' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400'}`}><IcUpload className="w-3.5 h-3.5" />Файл</button>
      </div>

      {mode === 'manual' ? (
        <div className="glass-md rounded-3xl p-8 max-w-lg space-y-5">
          <Field label="Название *" value={title} onChange={setTitle} placeholder="Название трека" />
          <Field label="Исполнитель" value={artist} onChange={setArtist} placeholder="Имя исполнителя" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Длина (м:сс)" value={duration} onChange={setDuration} placeholder="3:45" />
            <div><label className="text-[11px] text-slate-500 font-bold block mb-2">Источник</label><select value={source} onChange={(e) => setSource(e.target.value as typeof source)} className="input-field"><option value="url">URL</option><option value="soundcloud">SoundCloud</option><option value="spotify">Spotify</option><option value="upload">Загрузка</option></select></div>
          </div>
          <Field label="URL (опционально)" value={url} onChange={setUrl} placeholder="https://..." />
          <div className="flex items-center gap-4 pt-3">
            <button onClick={handleManualAdd} disabled={!title.trim()} className="btn-primary"><IcPlus className="w-4 h-4" />Добавить</button>
            {added && (<span className="text-xs text-emerald-600 flex items-center gap-1.5 animate-slide-up font-bold"><IcCheck className="w-3.5 h-3.5" />Добавлено</span>)}
          </div>
        </div>
      ) : (
        <>
          <div className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all cursor-pointer ${dragOver ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }} onClick={() => fileRef.current?.click()}>
            <input ref={fileRef} type="file" accept="audio/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
            <div className="w-14 h-14 rounded-2xl glass mx-auto mb-5 flex items-center justify-center"><IcUpload className="w-6 h-6 text-slate-400" /></div>
            <p className="text-sm text-slate-500 font-medium mb-1">Перетащи файлы или нажми</p><p className="text-xs text-slate-300">MP3, WAV, OGG, FLAC, M4A</p>
          </div>
          {files.length > 0 && (
            <div className="glass-md rounded-3xl p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[.12em] mb-4">Загружено ({files.length})</h3>
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {files.map((f, i) => (<div key={i} className="flex items-center gap-3 py-2"><div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0"><IcCheck className="w-3.5 h-3.5 text-emerald-500" /></div><span className="text-sm text-slate-500 truncate flex-1">{f.name}</span><span className="text-[10px] text-slate-300 mono">{(f.size / 1048576).toFixed(1)} MB</span></div>))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return <div><label className="text-[11px] text-slate-500 font-bold block mb-2">{label}</label><input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input-field" /></div>;
}
