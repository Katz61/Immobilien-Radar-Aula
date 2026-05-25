import { create } from 'zustand';
import type { Lead, IdentifiedFeature, LeadStatus, LeadFilters, SortOption } from '../types';
import { LEAD_STATUSES } from '../data/marktdaten';

type TabName = 'details' | 'leads' | 'scan';

interface AppState {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;

  leads: Lead[];
  addLead: (lead: Lead) => boolean;
  addLeads: (leads: Lead[]) => number;
  updateLeadStatus: (id: number, status: LeadStatus) => void;
  updateLeadNote: (id: number, note: string) => void;
  clearLeads: () => void;

  currentFeature: IdentifiedFeature | null;
  setCurrentFeature: (feature: IdentifiedFeature | null) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  scanRunning: boolean;
  setScanRunning: (running: boolean) => void;
  scanAbort: boolean;
  setScanAbort: (abort: boolean) => void;
  scanProgress: { done: number; total: number; found: number; gemeinde: string };
  setScanProgress: (progress: Partial<AppState['scanProgress']>) => void;
  scanResults: Lead[];
  setScanResults: (results: Lead[]) => void;

  lastScanTimestamp: string | null;
  setLastScanTimestamp: (ts: string) => void;

  leadMarkersVisible: boolean;
  toggleLeadMarkers: () => void;

  filters: LeadFilters;
  setFilter: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;

  getFilteredLeads: () => Lead[];
}

function loadLeads(): Lead[] {
  try {
    const raw = localStorage.getItem('k_ag_leads');
    if (!raw) return [];
    const leads: Lead[] = JSON.parse(raw);
    leads.forEach((l) => {
      if (!l.status) l.status = 'neu';
      if (!l.notes) l.notes = '';
    });
    return leads;
  } catch {
    return [];
  }
}

function saveLeads(leads: Lead[]): void {
  localStorage.setItem('k_ag_leads', JSON.stringify(leads));
}

export const useStore = create<AppState>((set, get) => ({
  activeTab: 'details',
  setActiveTab: (tab) => set({ activeTab: tab }),

  leads: loadLeads(),
  addLead: (lead) => {
    const { leads } = get();
    const exists = leads.find(
      (l) =>
        (l.egrid === lead.egrid && lead.egrid !== '\u2014') ||
        (l.egid && lead.egid && l.egid === lead.egid),
    );
    if (exists) return false;
    const updated = [...leads, lead];
    saveLeads(updated);
    set({ leads: updated });
    return true;
  },
  addLeads: (newLeads) => {
    const { leads } = get();
    let added = 0;
    const updated = [...leads];
    for (const l of newLeads) {
      const exists = updated.find(
        (s) =>
          (s.egid && l.egid && s.egid === l.egid) ||
          (s.egrid === l.egrid && l.egrid !== '\u2014'),
      );
      if (!exists) {
        updated.push(l);
        added++;
      }
    }
    saveLeads(updated);
    set({ leads: updated });
    return added;
  },
  updateLeadStatus: (id, status) => {
    const { leads } = get();
    const updated = leads.map((l) => (l.id === id ? { ...l, status } : l));
    saveLeads(updated);
    set({ leads: updated });
  },
  updateLeadNote: (id, note) => {
    const { leads } = get();
    const updated = leads.map((l) => (l.id === id ? { ...l, notes: note } : l));
    saveLeads(updated);
    set({ leads: updated });
  },
  clearLeads: () => {
    localStorage.removeItem('k_ag_leads');
    set({ leads: [] });
  },

  currentFeature: null,
  setCurrentFeature: (feature) => set({ currentFeature: feature }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  scanRunning: false,
  setScanRunning: (running) => set({ scanRunning: running }),
  scanAbort: false,
  setScanAbort: (abort) => set({ scanAbort: abort }),
  scanProgress: { done: 0, total: 0, found: 0, gemeinde: '' },
  setScanProgress: (progress) =>
    set((s) => ({ scanProgress: { ...s.scanProgress, ...progress } })),
  scanResults: [],
  setScanResults: (results) => set({ scanResults: results }),

  lastScanTimestamp: localStorage.getItem('k_ag_last_scan'),
  setLastScanTimestamp: (ts) => {
    localStorage.setItem('k_ag_last_scan', ts);
    set({ lastScanTimestamp: ts });
  },

  leadMarkersVisible: false,
  toggleLeadMarkers: () => set((s) => ({ leadMarkersVisible: !s.leadMarkersVisible })),

  filters: {
    sortBy: 'score' as SortOption,
    ownerFilter: '',
    statusFilter: '',
    minScore: 0,
    hideDone: false,
  },
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),

  toastMessage: null,
  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => set({ toastMessage: null }), 3000);
  },

  getFilteredLeads: () => {
    const { leads, filters } = get();
    const statusOrder: Record<string, number> = {
      neu: 0, kontakt: 1, besichtigung: 2, angebot: 3, abgelehnt: 4, erledigt: 5,
    };
    void LEAD_STATUSES;

    const filtered = leads.filter((l) => {
      if (filters.ownerFilter && !(l.ownerType || '').includes(filters.ownerFilter)) return false;
      if (filters.statusFilter && l.status !== filters.statusFilter) return false;
      if (l.score < filters.minScore) return false;
      if (filters.hideDone && (l.status === 'erledigt' || l.status === 'abgelehnt')) return false;
      return true;
    });

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'az':
          return (b.azReserve ?? -999) - (a.azReserve ?? -999);
        case 'baujahr':
          return (a.baujahr ?? 9999) - (b.baujahr ?? 9999);
        case 'flaeche':
          return (b.flaeche ?? 0) - (a.flaeche ?? 0);
        case 'status':
          return (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
        default:
          return b.score - a.score;
      }
    });

    return filtered;
  },
}));
