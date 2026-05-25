import type { SolarData } from '../../types';
import { DetailRow } from './DetailRow';

interface SolarSectionProps {
  data: SolarData;
}

export function SolarSection({ data }: SolarSectionProps) {
  const badgeColor = data.klasse >= 4 ? 'bg-accent/15 text-accent border-accent/30'
    : data.klasse >= 3 ? 'bg-accent2/15 text-accent2 border-accent2/30'
    : data.klasse >= 2 ? 'bg-yellow/15 text-yellow border-yellow/30'
    : 'bg-surface2 text-muted border-border';

  return (
    <div className="p-4 border-b border-border">
      <div className="font-mono text-[10px] text-muted tracking-[1.5px] uppercase mb-3">
        SOLARPOTENZIAL — sonnendach.ch
      </div>
      <DetailRow
        label="Eignung"
        value={
          <span className={`inline-block px-2 py-0.5 text-[11px] border rounded-sm ${badgeColor}`}>
            {data.klasseText}
          </span>
        }
      />
      <DetailRow
        label="Stromertrag"
        value={data.stromertrag ? `${Math.round(data.stromertrag).toLocaleString('de-CH')} kWh/Jahr` : '\u2014'}
      />
      <DetailRow label="Dachfläche" value={data.flaeche ? `${data.flaeche} m²` : '\u2014'} />
      <DetailRow
        label="Einstrahlung"
        value={data.mstrahlung ? `${data.mstrahlung} kWh/m²` : '\u2014'}
      />
      <DetailRow
        label="Finanzertrag"
        value={data.finanzertrag ? `CHF ${Math.round(data.finanzertrag).toLocaleString('de-CH')}/Jahr` : '\u2014'}
      />
      <DetailRow label="Neigung" value={data.neigung ? `${data.neigung}°` : '\u2014'} />
    </div>
  );
}
