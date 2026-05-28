import { useState, useRef } from 'react';
import { IcUpload, IcPlus, IcCheck } from './Icons';
import { Track, createTrack } from '../store';

interface Props {
  onAdd: (track: Track) => void;
}

export default function UploadPage({ onAdd }: Props) {
  const [mode, setMode] = useState<'upload' | 'manual'>('upload');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [url, setUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [source, setSource] = useState<'upload' | 'soundcloud' | 'spotify' | 'url'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);
  const [added, setAdded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const arr = Array.from(fileList).filter(f => f.type.startsWith('audio/') || f.name.match(/\.(mp3|wav|ogg|flac|m4a|aac|opus|wma)$/i));
    const newFiles = arr.map(f => ({ name: f.name, size: f.size }));
    setFiles(prev => [...prev, ...newFiles]);
    arr.forEach(f => {
      const name = f.name.replace(/\.[^.]+$/, '');
      const parts = name.includes(' - ') ? name.split(' - ') : [name, 'Unknown'];
      onAdd(createTrack({
        title: parts.length > 1 ? parts[1].trim() : parts[0].trim(),
        artist: parts.length > 1 ? parts[0].trim() : 'Unknown Artist',
        duration: Math.floor(120 + Math.random() * 240),
        source: 'upload',
        fileSize: f.size,
      }));
    });
  };

  const handleManualAdd = () => {
    if (!title.trim()) return;
    const durParts = duration.split(':');
    let durSec = 0;
    if (durParts.length === 2) durSec = parseInt(durParts[0]) * 60 + parseInt(durParts[1]);
    else if (durParts.length === 1) durSec = parseInt(durParts[0]) || 0;
    onAdd(createTrack({
      title: title.trim(),
      artist: artist.trim() || 'Unknown Artist',
      duration: durSec || Math.floor(120 + Math.random() * 240),
      source,
      url: url.trim() || undefined,
    }));
    setTitle(''); setArtist(''); setUrl(''); setDuration('');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Upload</h1>
        <p className="text-sm text-white/20 mt-2">Add tracks to your library</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-white/[.02] border border-white/[.03] rounded-xl w-fit">
        <button onClick={() => setMode('upload')} className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${mode === 'upload' ? 'bg-white/[.06] text-white/75 shadow-sm' : 'text-white/25 hover:text-white/40'}`}>
          <IcUpload className="w-3.5 h-3.5" />File Upload
        </button>
        <button onClick={() => setMode('manual')} className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${mode === 'manual' ? 'bg-white/[.06] text-white/75 shadow-sm' : 'text-white/25 hover:text-white/40'}`}>
          <IcPlus className="w-3.5 h-3.5" />Manual Add
        </button>
      </div>

      {mode === 'upload' ? (
        <>
          <div
            className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all cursor-pointer ${
              dragOver ? 'border-indigo-400/30 bg-indigo-500/[.03]' : 'border-white/[.05] hover:border-white/[.08] hover:bg-white/[.01]'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept="audio/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
            <div className="w-14 h-14 rounded-2xl glass mx-auto mb-5 flex items-center justify-center">
              <IcUpload className="w-6 h-6 text-white/10" />
            </div>
            <p className="text-sm text-white/30 mb-1.5 font-medium">Drop audio files here or click to browse</p>
            <p className="text-xs text-white/12">MP3, WAV, OGG, FLAC, M4A, AAC, OPUS</p>
          </div>

          {files.length > 0 && (
            <div className="glass-md rounded-2xl p-5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-[.12em] mb-4">Uploaded ({files.length})</h3>
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 animate-fade" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/8 border border-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <IcCheck className="w-3.5 h-3.5 text-emerald-400/60" />
                    </div>
                    <span className="text-sm text-white/40 truncate flex-1">{f.name}</span>
                    <span className="text-[10px] text-white/12 mono">{(f.size / 1048576).toFixed(1)} MB</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="glass-md rounded-2xl p-7 max-w-lg space-y-5">
          <Field label="Title *" value={title} onChange={setTitle} placeholder="Track title" />
          <Field label="Artist" value={artist} onChange={setArtist} placeholder="Artist name" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Duration (m:ss)" value={duration} onChange={setDuration} placeholder="3:45" />
            <div>
              <label className="text-[11px] text-white/25 font-semibold block mb-2">Source</label>
              <select value={source} onChange={(e) => setSource(e.target.value as typeof source)} className="input-field">
                <option value="upload">Upload</option>
                <option value="soundcloud">SoundCloud</option>
                <option value="spotify">Spotify</option>
                <option value="url">URL</option>
              </select>
            </div>
          </div>
          <Field label="URL (optional)" value={url} onChange={setUrl} placeholder="https://..." />
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleManualAdd} disabled={!title.trim()} className="btn-primary">
              <IcPlus className="w-4 h-4" />Add to Library
            </button>
            {added && (
              <span className="text-xs text-emerald-400/70 flex items-center gap-1.5 animate-fade">
                <IcCheck className="w-3.5 h-3.5" /> Added
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="text-[11px] text-white/25 font-semibold block mb-2">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input-field" />
    </div>
  );
}
