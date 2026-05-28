import { IcDashboard, IcMusic, IcQueue, IcUpload, IcSettings, IcTerminal, IcBot, IcX } from './Icons';

type Page = 'dashboard' | 'library' | 'queue' | 'upload' | 'settings' | 'logs';

interface Props {
  page: Page;
  setPage: (p: Page) => void;
  botOnline: boolean;
  mobileOpen: boolean;
  closeMobile: () => void;
  queueCount: number;
}

const links: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Панель', icon: <IcDashboard className="w-[17px] h-[17px]" /> },
  { id: 'library', label: 'Библиотека', icon: <IcMusic className="w-[17px] h-[17px]" /> },
  { id: 'queue', label: 'Очередь', icon: <IcQueue className="w-[17px] h-[17px]" /> },
  { id: 'upload', label: 'Добавить', icon: <IcUpload className="w-[17px] h-[17px]" /> },
  { id: 'settings', label: 'Настройки', icon: <IcSettings className="w-[17px] h-[17px]" /> },
  { id: 'logs', label: 'Логи', icon: <IcTerminal className="w-[17px] h-[17px]" /> },
];

export default function Sidebar({ page, setPage, botOnline, mobileOpen, closeMobile, queueCount }: Props) {
  const inner = (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-7 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-sky-500 flex items-center justify-center shadow-lg shadow-cyan-200">
            <IcBot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-800 tracking-tight">SoundForge</div>
            <div className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Музыкальный бот</div>
          </div>
        </div>
        <button onClick={closeMobile} className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white/50 transition-all">
          <IcX className="w-5 h-5" />
        </button>
      </div>

      <div className="mx-4 mb-6">
        <div className={`px-4 py-3.5 rounded-2xl flex items-center gap-3 transition-all ${
          botOnline
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60'
            : 'glass'
        }`}>
          <div className={botOnline ? 'status-online' : 'status-offline'} />
          <span className={`text-xs font-bold ${botOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
            {botOnline ? 'Бот онлайн' : 'Бот оффлайн'}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map(l => (
          <button
            key={l.id}
            onClick={() => { setPage(l.id); closeMobile(); }}
            className={`sidebar-link w-full ${page === l.id ? 'active' : ''}`}
          >
            {l.icon}
            <span className="flex-1 text-left">{l.label}</span>
            {l.id === 'queue' && queueCount > 0 && (
              <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-cyan-100 text-cyan-600 text-[10px] font-bold">
                {queueCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-5 pb-6">
        <div className="divider mb-4" />
        <div className="text-[10px] text-slate-300 font-semibold mono">
          v1.0 — discord-player v7
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-[250px] h-screen sticky top-0 glass-solid">
        {inner}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={closeMobile} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] glass-solid animate-slide-up">
            {inner}
          </aside>
        </div>
      )}
    </>
  );
}
