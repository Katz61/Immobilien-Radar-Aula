import type { OwnerInfo } from '../../types';
import { DetailRow } from './DetailRow';

interface OwnerSectionProps {
  ownerInfo?: OwnerInfo;
}

export function OwnerSection({ ownerInfo }: OwnerSectionProps) {
  if (!ownerInfo) {
    return (
      <div className="p-4 border-b border-border">
        <div className="font-mono text-[10px] text-muted tracking-[1.5px] uppercase mb-3">
          EIGENTÜMER-TYP — Zefix &amp; Heuristik
        </div>
        <div className="flex items-center gap-2 text-[12px] text-text2">
          <span className="inline-block w-3 h-3 border-2 border-text2 border-t-accent rounded-full animate-spin" />
          Eigentümer-Daten werden geladen...
        </div>
      </div>
    );
  }

  const typeIcon = ownerInfo.type.includes('Erben') ? '👥'
    : ownerInfo.type.includes('Privat') ? '👤'
    : ownerInfo.type.includes('Immobilien') ? '🏢'
    : ownerInfo.type.includes('Firma') ? '🏢'
    : '❓';

  const typeColor = ownerInfo.type.includes('Erben') ? 'text-yellow'
    : ownerInfo.type.includes('Privat') ? 'text-accent'
    : ownerInfo.type.includes('Firma') || ownerInfo.type.includes('Immobilien') ? 'text-red'
    : 'text-text2';

  return (
    <div className="p-4 border-b border-border">
      <div className="font-mono text-[10px] text-muted tracking-[1.5px] uppercase mb-3">
        EIGENTÜMER-TYP — Zefix &amp; Heuristik
      </div>
      <DetailRow
        label="Typ"
        value={<span className={typeColor}>{typeIcon} {ownerInfo.type}</span>}
      />
      <DetailRow label="Konfidenz" value={ownerInfo.confidence} />

      {ownerInfo.companies.length > 0 && (
        <div className="mt-2">
          <div className="font-mono text-[10px] text-muted mb-1">Registrierte Firmen:</div>
          {ownerInfo.companies.map((c, i) => (
            <div key={i} className="text-[12px] text-text2 py-0.5">
              {c.name}
              {c.type && <span className="text-muted text-[10px] ml-1">({c.type})</span>}
              {c.uid && (
                <a
                  href={`https://www.zefix.admin.ch/de/search/entity/list?name=${encodeURIComponent(c.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent2 text-[10px] ml-1 hover:underline"
                >
                  {c.uid}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {ownerInfo.hints.length > 0 && (
        <div className="mt-2 space-y-1">
          {ownerInfo.hints.map((hint, i) => (
            <div key={i} className="text-[11px] text-text2 bg-surface2 rounded-sm px-2 py-1">
              {hint}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
