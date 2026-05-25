import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { LEAD_STATUSES } from '../../data/marktdaten';
import type { Lead, LeadStatus } from '../../types';

interface LeadItemProps {
  lead: Lead;
}

export function LeadItem({ lead }: LeadItemProps) {
  const updateLeadStatus = useStore((s) => s.updateLeadStatus);
  const updateLeadNote = useStore((s) => s.updateLeadNote);
  const showToast = useStore((s) => s.showToast);
  const lastScanTimestamp = useStore((s) => s.lastScanTimestamp);

  const [showNotes, setShowNotes] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const st = LEAD_STATUSES[lead.status || 'neu'] || LEAD_STATUSES['neu'];
  const isDone = lead.status === 'erledigt' || lead.status === 'abgelehnt';
  const isNew = !!(lastScanTimestamp && lead.savedAt && lead.savedAt > lastScanTimestamp);
  const hasNote = !!(lead.notes && lead.notes.trim().length > 0);

  useEffect(() => {
    if (!showStatusDropdown) return;
    const handleClick = () => setShowStatusDropdown(false);
    setTimeout(() => document.addEventListener('click', handleClick), 10);
    return () => document.removeEventListener('click', handleClick);
  }, [showStatusDropdown]);

  const handleFlyTo = () => {
    window.dispatchEvent(
      new CustomEvent('map:flyto', { detail: { lat: lead.lat, lon: lead.lon, zoom: 18 } }),
    );
    window.dispatchEvent(
      new CustomEvent('map:identify', { detail: { lat: lead.lat, lon: lead.lon } }),
    );
  };

  const handleStatusChange = (status: LeadStatus) => {
    updateLeadStatus(lead.id, status);
    setShowStatusDropdown(false);
    showToast(`Status → ${LEAD_STATUSES[status].label}`);
  };

  const reserveColor = lead.azReserve != null
    ? lead.azReserve > 0.2 ? 'text-accent' : lead.azReserve > 0 ? 'text-yellow' : 'text-red'
    : '';

  const ownerIcon = lead.ownerType?.includes('Erben') ? '👥'
    : lead.ownerType?.includes('Privat') ? '👤'
    : lead.ownerType?.includes('Firma') || lead.ownerType?.includes('Immobilien') ? '🏢'
    : '';

  const ownerColor = lead.ownerType?.includes('Erben') ? 'text-yellow'
    : lead.ownerType?.includes('Privat') ? 'text-accent'
    : 'text-red';

  return (
    <div
      className={`border-b border-border p-3 cursor-pointer transition-colors hover:bg-surface2 ${isDone ? 'opacity-50' : ''} ${isNew ? 'border-l-2 border-l-accent' : ''}`}
      onClick={handleFlyTo}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px] font-medium text-text truncate flex-1 mr-2">
          {isNew && <span className="text-accent mr-1">NEU</span>}
          {lead.address}
        </span>
        <div className="flex gap-1.5 items-center shrink-0 relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowStatusDropdown(!showStatusDropdown); }}
            className={`font-mono text-[9px] px-2 py-0.5 rounded-sm border cursor-pointer
              ${lead.status === 'neu' ? 'border-blue/30 text-blue bg-blue/10' :
                lead.status === 'kontakt' ? 'border-yellow/30 text-yellow bg-yellow/10' :
                lead.status === 'besichtigung' ? 'border-accent/30 text-accent bg-accent/10' :
                lead.status === 'angebot' ? 'border-accent2/30 text-accent2 bg-accent2/10' :
                lead.status === 'abgelehnt' ? 'border-red/30 text-red bg-red/10' :
                'border-muted/30 text-muted bg-muted/10'}`}
          >
            {st.icon} {st.label}
          </button>
          {showStatusDropdown && (
            <div
              ref={dropdownRef}
              className="absolute top-full right-0 z-50 bg-surface border border-border rounded-sm shadow-lg min-w-[140px] mt-1"
              onClick={(e) => e.stopPropagation()}
            >
              {(Object.entries(LEAD_STATUSES) as [LeadStatus, typeof st][]).map(([key, val]) => (
                <div
                  key={key}
                  onClick={() => handleStatusChange(key)}
                  className="px-3 py-1.5 text-[11px] text-text2 cursor-pointer hover:bg-surface2 hover:text-text"
                >
                  {val.icon} {val.label}
                </div>
              ))}
            </div>
          )}
          <span className={`font-mono text-[11px] font-bold w-8 text-center
            ${lead.score >= 60 ? 'text-accent' : lead.score >= 35 ? 'text-yellow' : 'text-muted'}`}>
            {lead.score}
          </span>
        </div>
      </div>

      <div className="text-[12px] text-text2 mb-1">
        {lead.plz} {lead.ort} — {lead.bezeichnung}
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted">
        <span>Nr. {lead.parcelNr}</span>
        {lead.baujahr && <span>Bj. {lead.baujahr}</span>}
        {lead.flaeche && <span>{lead.flaeche} m²</span>}
        {lead.geschosse && <span>{lead.geschosse} Gesch.</span>}
        {lead.azReserve != null && (
          <span className={reserveColor}>
            AZ {lead.azReserve >= 0 ? '+' : ''}{lead.azReserve}
          </span>
        )}
        {lead.ownerType && lead.ownerType !== 'Unbekannt' && (
          <span className={ownerColor}>{ownerIcon} {lead.ownerType}</span>
        )}
        {lead.solarKlasse && <span>☀️ {lead.solarKlasse}</span>}
      </div>

      <div className="flex items-center gap-1.5 mt-1.5">
        <button
          onClick={(e) => { e.stopPropagation(); setShowNotes(!showNotes); }}
          className={`font-mono text-[9px] px-2 py-0.5 rounded-sm border cursor-pointer transition-colors
            ${hasNote ? 'border-accent/30 text-accent bg-accent/8' : 'border-border text-muted hover:text-text2'}`}
        >
          {hasNote ? 'NOTIZ' : 'NOTIZ+'}
        </button>
        {hasNote && !showNotes && (
          <span className="text-[11px] text-text2 truncate flex-1">
            {lead.notes.substring(0, 60)}{lead.notes.length > 60 ? '…' : ''}
          </span>
        )}
      </div>

      {showNotes && (
        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
          <textarea
            defaultValue={lead.notes || ''}
            placeholder="Notizen zu diesem Lead..."
            onBlur={(e) => updateLeadNote(lead.id, e.target.value)}
            className="w-full h-16 p-2 bg-bg border border-border rounded-sm text-[12px] text-text resize-none outline-none focus:border-accent"
          />
        </div>
      )}
    </div>
  );
}
