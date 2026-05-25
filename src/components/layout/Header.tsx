import { useStore } from '../../store/useStore';

export function Header() {
  const leads = useStore((s) => s.leads);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg z-[1000] shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-display text-[22px] tracking-[3px] text-accent">
          K AG
        </span>
        <span className="text-text2 text-[11px] font-mono tracking-[1px]">
          LEADMASCHINE
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] text-accent bg-accent/8 border border-accent/20 px-2.5 py-1 rounded-sm tracking-[1px]">
          KANTON ZUG
        </span>
        {leads.length > 0 && (
          <span className="font-mono text-[10px] text-accent2 bg-accent2/8 border border-accent2/20 px-2.5 py-1 rounded-sm tracking-[1px]">
            {leads.length} LEADS
          </span>
        )}
        <span className="font-mono text-[10px] text-accent2 bg-accent2/8 border border-accent2/20 px-2.5 py-1 rounded-sm tracking-[1px]">
          LIVE
        </span>
      </div>
    </header>
  );
}
