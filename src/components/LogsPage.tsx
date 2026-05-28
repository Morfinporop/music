import { IcTerminal, IcTrash } from './Icons';
import { LogEntry, formatTime } from '../store';

interface Props { logs: LogEntry[]; onClear: () => void; }

const levelStyle: Record<string, { text: string; bg: string; dot: string }> = {
  info: { text: 'text-sky-600', bg: 'bg-sky-50', dot: 'bg-sky-400' },
  warn: { text: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' },
  error: { text: 'text-rose-600', bg: 'bg-rose-50', dot: 'bg-rose-400' },
  success: { text: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-400' },
};

export default function LogsPage({ logs, onClear }: Props) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between">
        <div><h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Логи</h1><p className="text-sm text-slate-400 mt-2">{logs.length} записей</p></div>
        {logs.length > 0 && <button onClick={onClear} className="btn-ghost text-xs"><IcTrash className="w-3.5 h-3.5" />Очистить</button>}
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-20"><div className="w-16 h-16 rounded-2xl glass mx-auto mb-5 flex items-center justify-center"><IcTerminal className="w-7 h-7 text-slate-300" /></div><p className="text-sm text-slate-400 font-medium">Логов пока нет</p></div>
      ) : (
        <div className="glass-md rounded-3xl overflow-hidden">
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
            {[...logs].reverse().map(log => {
              const s = levelStyle[log.level] || levelStyle.info;
              return (
                <div key={log.id} className="flex items-start gap-4 px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50">
                  <span className="text-[10px] text-slate-300 mono mt-[3px] w-[65px]">{formatTime(log.timestamp)}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0 mt-[2px]">
                    <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    <span className={`text-[9px] uppercase font-bold tracking-wider ${s.text} ${s.bg} px-2 py-0.5 rounded-md`}>{log.level === 'info' ? 'ИНФО' : log.level === 'warn' ? 'ВНИМАНИЕ' : log.level === 'error' ? 'ОШИБКА' : 'УСПЕХ'}</span>
                  </div>
                  <span className="text-[12px] text-slate-500 mono">{log.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
