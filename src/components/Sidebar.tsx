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
  { id: 'dashboard', label: 'Dashboard', icon: <IcDashboard className="w-[17px] h-[17px]" /> },
  { id: 'library', label: 'Library', icon: <IcMusic className="w-[17px] h-[17px]" /> },
  { id: 'queue', label: 'Queue', icon: <IcQueue className="w-[17px] h-[17px]" /> },
  { id: 'upload', label: 'Upload', icon: <IcUpload className="w-[17px] h-[17px]" /> },
  { id: 'settings', label: 'Settings', icon: <IcSettings className="w-[17px] h-[17px]" /> },
  { id: 'logs', label: 'Logs', icon: <IcTerminal className="w-[17px] h-[17px]" /> },
];

export default function Sidebar({ page, setPage, botOnline, mobileOpen, closeMobile, queueCount }: Props) {
  const inner = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-7 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <IcBot className="w-[19px] h-[19px] text-white" />
          </div>
          <div>
            <div className="text-[15px] font-bold text-white tracking-tight">SoundForge</div>
            <div className="text-[10px] text-white/20 font-medium tracking-wide uppercase">Bot Panel</div>
          </div>
        </div>
        <button onClick={closeMobile} className="lg:hidden p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/5 transition-all">
          <IcX className="w-5 h-5" />
        </button>
      </div>

      {/* Status pill */}
      <div className="mx-4 mb-6">
        <div className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
          botOnline
            ? 'bg-gradient-to-r from-emerald-500/[.06] to-emerald-500/[.02] border border-emerald-500/10'
            : 'glass'
        }`}>
          <div className={botOnline ? 'status-online' : 'status-offline'} />
          <div className="flex-1">
            <span className={`text-xs font-semibold ${botOnline ? 'text-emerald-300/80' : 'text-white/30'}`}>
              {botOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className={`w-1.5 h-1.5 rounded-full ${botOnline ? 'bg-emerald-400/40' : 'bg-white/5'}`} />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        <div className="px-3 pb-2 text-[9px] font-bold text-white/10 uppercase tracking-[.15em]">Navigation</div>
        {links.map(l => (
          <button
            key={l.id}
            onClick={() => { setPage(l.id); closeMobile(); }}
            className={`sidebar-link w-full ${page === l.id ? 'active' : ''}`}
          >
            {l.icon}
            <span className="flex-1 text-left">{l.label}</span>
            {l.id === 'queue' && queueCount > 0 && (
              <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                {queueCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-5 pb-6">
        <div className="divider mb-4" />
        <div className="flex items-center gap-2 text-[10px] text-white/10 mono">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/30" />
          v1.0 — discord-player v7
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-[232px] h-screen sticky top-0 border-r border-white/[.03] bg-[#07070c]/95">
        {inner}
      </aside>

      {/* Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeMobile} />
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-[#07070c] border-r border-white/[.04] animate-slide-in">
            {inner}
          </aside>
        </div>
      )}
    </>
  );
}
