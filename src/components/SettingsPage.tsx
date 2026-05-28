import { useState } from 'react';
import { IcKey, IcEye, IcEyeOff, IcShield, IcCheck, IcServer } from './Icons';
import { BotConfig, maskToken } from '../store';

interface Props {
  config: BotConfig;
  onSave: (config: BotConfig) => void;
}

export default function SettingsPage({ config, onSave }: Props) {
  const [local, setLocal] = useState({ ...config });
  const [showToken, setShowToken] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (key: keyof BotConfig, value: string | number | boolean) => {
    setLocal(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-white/20 mt-2">Bot configuration & credentials</p>
      </div>

      {/* Security */}
      <div className="flex items-start gap-4 px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-500/[.04] to-amber-500/[.01] border border-amber-500/8">
        <IcShield className="w-5 h-5 text-amber-400/50 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-amber-300/70 mb-1">Security</div>
          <p className="text-xs text-amber-300/30 leading-relaxed">
            All credentials are stored locally in your browser only.
            Never share your token. If compromised — reset immediately in Discord Developer Portal.
          </p>
        </div>
      </div>

      {/* Credentials */}
      <div className="glass-md rounded-2xl overflow-hidden">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
        <div className="p-7 space-y-6">
          <div className="flex items-center gap-2.5">
            <IcKey className="w-4 h-4 text-indigo-400/60" />
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-[.15em]">Credentials</h2>
          </div>

          <div>
            <label className="text-[11px] text-white/25 font-semibold block mb-2">Bot Token</label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={local.token}
                onChange={(e) => update('token', e.target.value)}
                placeholder="Paste your bot token"
                className="input-field pr-12 mono text-xs"
              />
              <button onClick={() => setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/15 hover:text-white/40 transition-colors rounded-lg hover:bg-white/[.03]">
                {showToken ? <IcEyeOff className="w-4 h-4" /> : <IcEye className="w-4 h-4" />}
              </button>
            </div>
            {local.token && !showToken && (
              <div className="text-[10px] text-white/10 mt-2 mono">{maskToken(local.token)}</div>
            )}
          </div>

          <div>
            <label className="text-[11px] text-white/25 font-semibold block mb-2">Application ID (Client ID)</label>
            <input type="text" value={local.clientId} onChange={(e) => update('clientId', e.target.value)} placeholder="Application ID from Developer Portal" className="input-field mono text-xs" />
          </div>

          <div>
            <label className="text-[11px] text-white/25 font-semibold block mb-2">Guild ID (Server ID)</label>
            <input type="text" value={local.guildId} onChange={(e) => update('guildId', e.target.value)} placeholder="Right-click server → Copy Server ID" className="input-field mono text-xs" />
          </div>
        </div>
      </div>

      {/* Config */}
      <div className="glass-md rounded-2xl overflow-hidden">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="p-7 space-y-6">
          <div className="flex items-center gap-2.5">
            <IcServer className="w-4 h-4 text-purple-400/60" />
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-[.15em]">Bot Config</h2>
          </div>

          <div>
            <label className="text-[11px] text-white/25 font-semibold block mb-3">Default Volume: <span className="text-indigo-300/60">{local.volume}%</span></label>
            <div className="relative w-full h-[3px] rounded-full bg-white/[.04] cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                update('volume', Math.round(Math.max(1, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))));
              }}
            >
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500/60 to-purple-500/60 relative" style={{ width: `${local.volume}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/80 shadow-lg transition-opacity opacity-60 group-hover:opacity-100" />
              </div>
            </div>
          </div>

          <Toggle label="Leave on empty channel" checked={local.leaveOnEmpty} onChange={(v) => update('leaveOnEmpty', v)} />
          <Toggle label="Autoplay similar tracks" checked={local.autoplay} onChange={(v) => update('autoplay', v)} />

          <div>
            <label className="text-[11px] text-white/25 font-semibold block mb-2">Leave timeout (seconds)</label>
            <input type="number" value={local.leaveTimeout} onChange={(e) => update('leaveTimeout', Number(e.target.value))} className="input-field w-32 mono text-xs" min={0} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button onClick={handleSave} className="btn-primary">
          <IcCheck className="w-4 h-4" />
          Save Settings
        </button>
        {saved && (
          <span className="text-xs text-emerald-400/60 flex items-center gap-1.5 animate-fade font-medium">
            <IcCheck className="w-3.5 h-3.5" /> Settings saved
          </span>
        )}
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/30">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-all relative ${
          checked
            ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-indigo-500/20'
            : 'bg-white/[.04] border border-white/[.06]'
        }`}
      >
        <div className={`absolute top-[3px] w-[18px] h-[18px] rounded-full transition-all shadow-sm ${
          checked ? 'left-[22px] bg-indigo-400' : 'left-[3px] bg-white/25'
        }`} />
      </button>
    </div>
  );
}
