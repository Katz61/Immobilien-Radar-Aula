import { useState, useRef, useEffect, useCallback } from 'react';
import { searchAddress, type SearchResult } from '../../services/geo-admin';

interface SearchBoxProps {
  onSelect?: (lat: number, lon: number) => void;
}

export function SearchBox({ onSelect }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const boxRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    try {
      const res = await searchAddress(q);
      setResults(res);
      setOpen(res.length > 0);
    } catch {
      setOpen(false);
    }
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(value), 300);
  };

  const handleSelect = (r: SearchResult) => {
    setQuery(r.label);
    setOpen(false);
    onSelect?.(r.lat, r.lon);
    window.dispatchEvent(
      new CustomEvent('map:flyto', { detail: { lat: r.lat, lon: r.lon, zoom: 18 } }),
    );
    window.dispatchEvent(
      new CustomEvent('map:identify', { detail: { lat: r.lat, lon: r.lon } }),
    );
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div ref={boxRef} className="p-4 border-b border-border bg-surface">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && doSearch(query)}
          placeholder="Adresse oder Parzelle suchen..."
          className="flex-1 bg-bg border border-border text-text px-3.5 py-2.5 font-sans text-[13px] rounded-sm outline-none transition-colors focus:border-accent placeholder:text-muted"
        />
        <button
          onClick={() => doSearch(query)}
          className="px-4 py-2.5 font-mono text-[11px] tracking-[1px] bg-accent text-bg font-medium rounded-sm cursor-pointer hover:bg-accent/90 transition-colors"
        >
          SUCHE
        </button>
      </div>

      {open && results.length > 0 && (
        <div className="max-h-[200px] overflow-y-auto bg-bg border border-border border-t-0 rounded-b-sm">
          {results.map((r, i) => (
            <div
              key={i}
              onClick={() => handleSelect(r)}
              className="px-3.5 py-2 cursor-pointer text-[12px] text-text2 border-b border-border last:border-0 hover:bg-surface2 hover:text-text transition-colors"
            >
              {r.label}{' '}
              <span className="text-muted text-[10px]">{r.origin}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
