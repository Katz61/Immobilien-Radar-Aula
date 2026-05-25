import { useStore } from '../../store/useStore';
import { SearchBox } from '../map/SearchBox';
import { DetailsPanel } from '../details/DetailsPanel';
import { LeadsPanel } from '../leads/LeadsPanel';
import { ScanPanel } from '../scan/ScanPanel';

const TABS = [
  { id: 'details' as const, label: 'DETAILS' },
  { id: 'leads' as const, label: 'LEADS' },
  { id: 'scan' as const, label: 'SCAN' },
];

export function Sidebar() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const leads = useStore((s) => s.leads);

  return (
    <div className="w-[420px] min-w-[380px] flex flex-col border-r border-border bg-surface overflow-hidden">
      <SearchBox />

      <div className="flex border-b border-border bg-surface">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 px-2 text-center font-mono text-[10px] tracking-[1px] uppercase cursor-pointer border-b-2 transition-all ${
              activeTab === tab.id
                ? 'text-accent border-accent'
                : 'text-muted border-transparent hover:text-text2'
            }`}
          >
            {tab.label}
            {tab.id === 'leads' && leads.length > 0 && (
              <span className="ml-1 text-accent2">({leads.length})</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'details' && <DetailsPanel />}
        {activeTab === 'leads' && <LeadsPanel />}
        {activeTab === 'scan' && <ScanPanel />}
      </div>
    </div>
  );
}
