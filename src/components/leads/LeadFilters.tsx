import { useStore } from '../../store/useStore';
import type { SortOption } from '../../types';

export function LeadFilters() {
  const filters = useStore((s) => s.filters);
  const setFilter = useStore((s) => s.setFilter);

  return (
    <div className="p-3 border-b border-border grid grid-cols-2 gap-2">
      <div>
        <label className="block font-mono text-[9px] text-muted mb-0.5">Sortierung</label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilter('sortBy', e.target.value as SortOption)}
          className="select-sm"
        >
          <option value="score">Score ↓</option>
          <option value="az">AZ-Reserve ↓</option>
          <option value="baujahr">Baujahr ↑</option>
          <option value="flaeche">Fläche ↓</option>
          <option value="status">Status</option>
        </select>
      </div>
      <div>
        <label className="block font-mono text-[9px] text-muted mb-0.5">Status</label>
        <select
          value={filters.statusFilter}
          onChange={(e) => setFilter('statusFilter', e.target.value)}
          className="select-sm"
        >
          <option value="">Alle</option>
          <option value="neu">Neu</option>
          <option value="kontakt">Kontaktiert</option>
          <option value="besichtigung">Besichtigung</option>
          <option value="angebot">Angebot</option>
          <option value="abgelehnt">Abgelehnt</option>
          <option value="erledigt">Erledigt</option>
        </select>
      </div>
      <div>
        <label className="block font-mono text-[9px] text-muted mb-0.5">Eigentümer</label>
        <select
          value={filters.ownerFilter}
          onChange={(e) => setFilter('ownerFilter', e.target.value)}
          className="select-sm"
        >
          <option value="">Alle</option>
          <option value="Privatperson">Privatperson</option>
          <option value="Erbengemeinschaft">Erbengemeinschaft</option>
          <option value="Firma">Firma</option>
          <option value="Immobilienfirma">Immobilienfirma</option>
        </select>
      </div>
      <div>
        <label className="block font-mono text-[9px] text-muted mb-0.5">Min. Score</label>
        <input
          type="number"
          value={filters.minScore}
          onChange={(e) => setFilter('minScore', parseInt(e.target.value) || 0)}
          min={0}
          max={100}
          className="input-sm"
        />
      </div>
      <div className="col-span-2">
        <label className="flex items-center gap-2 text-[11px] text-text2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hideDone}
            onChange={(e) => setFilter('hideDone', e.target.checked)}
            className="accent-accent"
          />
          Erledigte/Abgelehnte ausblenden
        </label>
      </div>
    </div>
  );
}
