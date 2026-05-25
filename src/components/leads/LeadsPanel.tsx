import { useStore } from '../../store/useStore';
import { LeadItem } from './LeadItem';
import { LeadFilters } from './LeadFilters';
import { LEAD_STATUSES } from '../../data/marktdaten';

export function LeadsPanel() {
  const leads = useStore((s) => s.leads);
  const getFilteredLeads = useStore((s) => s.getFilteredLeads);
  const clearLeads = useStore((s) => s.clearLeads);
  const toggleLeadMarkers = useStore((s) => s.toggleLeadMarkers);
  const leadMarkersVisible = useStore((s) => s.leadMarkersVisible);
  const showToast = useStore((s) => s.showToast);

  const filteredLeads = getFilteredLeads();

  const handleExportCSV = () => {
    if (!leads.length) return;
    const headers = ['Score','Status','Adresse','PLZ','Ort','Gemeinde','EGRID','EGID','Parzelle','Baujahr','Fläche m²','Geschosse','Wohnungen','Kategorie','Heizung','Bezeichnung','Zonentyp','AZ Max','AZ Aktuell','AZ Reserve','Eigentümer-Typ','Firmen','Hinweise','Solar Eignung','Solar kWh/Jahr','Notizen','Lat','Lon','Gespeichert'];
    const rows = leads.map(l => [
      l.score, LEAD_STATUSES[l.status || 'neu']?.label || l.status || 'Neu',
      l.address, l.plz, l.ort, l.gemeinde, l.egrid, l.egid || '', l.parcelNr,
      l.baujahr || '', l.flaeche || '', l.geschosse || '', l.wohnungen || '',
      l.kategorie, l.heizung, l.bezeichnung,
      l.zonentyp || '', l.azMax ?? '', l.azActual ?? '', l.azReserve ?? '',
      l.ownerType || '', l.companies || '', l.ownerHints || '',
      l.solarKlasse || '', l.solarStrom || '',
      (l.notes || '').replace(/"/g, '""'),
      l.lat, l.lon, l.savedAt,
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';'))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `k-ag-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('CSV exportiert.');
  };

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center text-muted gap-3">
        <div className="text-[40px] opacity-30">📋</div>
        <div className="text-[13px] leading-relaxed">
          Noch keine Leads gespeichert.<br />
          Klicke auf ein Grundstück und speichere es als Lead.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-3 border-b border-border flex items-center justify-between gap-2 flex-wrap">
        <span className="font-mono text-[11px] text-text2">
          {leads.length} Leads gespeichert
        </span>
        <div className="flex gap-2">
          <button
            onClick={toggleLeadMarkers}
            className={leadMarkersVisible ? 'btn-primary' : 'btn-secondary'}
          >
            {leadMarkersVisible ? 'MARKER AUS' : 'MARKER AN'}
          </button>
          <button onClick={handleExportCSV} className="btn-secondary">CSV</button>
          <button
            onClick={() => { if (confirm('Alle Leads löschen?')) clearLeads(); }}
            className="btn-danger"
          >
            ALLE LÖSCHEN
          </button>
        </div>
      </div>

      <LeadFilters />

      <div className="text-[10px] text-muted px-4 py-1">
        {filteredLeads.length} von {leads.length} angezeigt
      </div>

      {filteredLeads.map((lead) => (
        <LeadItem key={lead.id} lead={lead} />
      ))}
    </div>
  );
}
