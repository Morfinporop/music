import { IcTerminal, IcTrash } from './Icons';
import { LogEntry, formatTime } from '../store';

interface Props {
  logs: LogEntry[];
  onClear: () => void;
}

const levelStyle: Record<string, { text: string; bg: string; dot: string }> = {
  info: { text: 'text-sky-300/60', bg: 'bg-sky-400/6', dot: 'bg-sky-400/40' },
  warn: { text: 'text-amber-300/60', bg: 'bg-amber-400/6', dot: 'bg-amber-400/40' },
  error: { text: 'text-rose-300/60', bg: 'bg-rose-400/6', dot: 'bg-rose-400/40' },
  success: { text: 'text-emerald-300/60', bg: 'bg-emerald-400/6', dot: 'bg-emerald-400/40' },
};

export default function LogsPage({ logs, onClear }: Props) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Logs</h1>
          <p className="text-sm text-white/20 mt-2">{logs.length} entries</p>
        </div>
        {logs.length > 0 && (
          <button onClick={onClear} className="btn-ghost text-xs">
            <IcTrash className="w-3.5 h-3.5" />Clear
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl glass mx-auto mb-5 flex items-center justify-center">
            <IcTerminal className="w-7 h-7 text-white/6" />
          </div>
          <p className="text-sm text-white/15 font-medium">No log entries yet</p>
          <p className="text-xs text-white/8 mt-2">Actions will be logged here</p>
        </div>
      ) : (
        <div className="glass-md rounded-2xl overflow-hidden">
          <div className="max-h-[calc(100vh-260px)] overflow-y-auto">
            {[...logs].reverse().map((log, idx) => {
              const s = levelStyle[log.level] || levelStyle.info;
              return (
                <div key={log.id} className="flex items-start gap-3.5 px-6 py-3.5 border-b border-white/[.02] last:border-b-0 hover:bg-white/[.008] transition-colors" style={{ animationDelay: `${idx * 15}ms` }}>
                  <span className="text-[10px] text-white/10 mono mt-[3px] w-[60px] flex-shrink-0">{formatTime(log.timestamp)}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0 mt-[2px]">
                    <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    <span className={`text-[9px] uppercase font-bold tracking-wider ${s.text} ${s.bg} px-1.5 py-0.5 rounded`}>
                      {log.level}
                    </span>
                  </div>
                  <span className="text-[12px] text-white/30 mono leading-relaxed break-all">{log.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
