import { useState } from 'react';
import { IcKey, IcEye, IcEyeOff, IcShield, IcCheck, IcServer } from './Icons';
import { BotConfig, maskToken } from '../store';

interface Props { config: BotConfig; onSave: (config: BotConfig) => void; }

export default function SettingsPage({ config, onSave }: Props) {
  const [local, setLocal] = useState({ ...config });
  const [showToken, setShowToken] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (key: keyof BotConfig, value: string | number | boolean) => setLocal(prev => ({ ...prev, [key]: value }));
  const handleSave = () => { onSave(local); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl">
      <div><h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Настройки</h1><p className="text-sm text-slate-400 mt-2">Конфигурация бота</p></div>

      <div className="flex items-start gap-4 px-6 py-5 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
        <IcShield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div><div className="text-sm font-bold text-amber-700 mb-1">Безопасность</div><p className="text-xs text-amber-600/70 leading-relaxed">Данные хранятся только в браузере. Никогда не показывай токен. Если скомпрометирован — сбрось в Discord Developer Portal.</p></div>
      </div>

      <div className="glass-md rounded-3xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-sky-500" />
        <div className="p-7 space-y-6">
          <div className="flex items-center gap-2.5"><IcKey className="w-4 h-4 text-cyan-500" /><h2 className="text-xs font-bold text-slate-500 uppercase tracking-[.15em]">Учётные данные</h2></div>
          <div><label className="text-[11px] text-slate-500 font-bold block mb-2">Токен бота</label><div className="relative"><input type={showToken ? 'text' : 'password'} value={local.token} onChange={(e) => update('token', e.target.value)} placeholder="Вставь токен бота" className="input-field pr-12 mono text-xs" /><button onClick={() => setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-slate-500">{showToken ? <IcEyeOff className="w-4 h-4" /> : <IcEye className="w-4 h-4" />}</button></div>{local.token && !showToken && <div className="text-[10px] text-slate-300 mt-2 mono">{maskToken(local.token)}</div>}</div>
          <div><label className="text-[11px] text-slate-500 font-bold block mb-2">Application ID</label><input type="text" value={local.clientId} onChange={(e) => update('clientId', e.target.value)} placeholder="ID приложения" className="input-field mono text-xs" /></div>
          <div><label className="text-[11px] text-slate-500 font-bold block mb-2">Guild ID (ID сервера)</label><input type="text" value={local.guildId} onChange={(e) => update('guildId', e.target.value)} placeholder="ПКМ по серверу → Copy Server ID" className="input-field mono text-xs" /></div>
        </div>
      </div>

      <div className="glass-md rounded-3xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-teal-400 to-emerald-400" />
        <div className="p-7 space-y-6">
          <div className="flex items-center gap-2.5"><IcServer className="w-4 h-4 text-teal-500" /><h2 className="text-xs font-bold text-slate-500 uppercase tracking-[.15em]">Настройки бота</h2></div>
          <div><label className="text-[11px] text-slate-500 font-bold block mb-3">Громкость: <span className="text-cyan-500">{local.volume}%</span></label><div className="w-full h-2 rounded-full bg-slate-100 cursor-pointer group" onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); update('volume', Math.round(Math.max(1, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)))); }}><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 relative" style={{ width: `${local.volume}%` }}><div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg border-2 border-cyan-400" /></div></div></div>
          <Toggle label="Выходить из пустого канала" checked={local.leaveOnEmpty} onChange={(v) => update('leaveOnEmpty', v)} />
          <Toggle label="Автовоспроизведение" checked={local.autoplay} onChange={(v) => update('autoplay', v)} />
          <div><label className="text-[11px] text-slate-500 font-bold block mb-2">Таймаут выхода (сек)</label><input type="number" value={local.leaveTimeout} onChange={(e) => update('leaveTimeout', Number(e.target.value))} className="input-field w-32 mono text-xs" min={0} /></div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button onClick={handleSave} className="btn-primary"><IcCheck className="w-4 h-4" />Сохранить</button>
        {saved && <span className="text-xs text-emerald-600 flex items-center gap-1.5 animate-slide-up font-bold"><IcCheck className="w-3.5 h-3.5" />Сохранено</span>}
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <div className="flex items-center justify-between"><span className="text-xs text-slate-500">{label}</span><button onClick={() => onChange(!checked)} className={`w-12 h-7 rounded-full transition-all relative ${checked ? 'bg-gradient-to-r from-cyan-400 to-sky-500' : 'bg-slate-200'}`}><div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? 'left-6' : 'left-1'}`} /></button></div>;
}
