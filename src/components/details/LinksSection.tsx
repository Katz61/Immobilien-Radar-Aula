import type { IdentifiedFeature } from '../../types';
import { COMPARIS_PREISE, BODENPREISE } from '../../data/marktdaten';

interface LinksSectionProps {
  feature: IdentifiedFeature;
}

export function LinksSection({ feature }: LinksSectionProps) {
  const { parcel, buildings, lat, e, n } = feature;
  const p = parcel?.properties || {};
  const b0 = buildings[0]?.properties;
  const egrid = (p.egris_egrid as string) || b0?.egrid || '';
  const ortName = b0?.ggdename || '';

  if (!egrid && !lat) return null;

  const comparisGemUrl = COMPARIS_PREISE.urls[ortName] || COMPARIS_PREISE.urls['default'];
  const bodenUrl = BODENPREISE.urls[ortName] || BODENPREISE.urls['default'];

  const links = [
    { section: 'Marktdaten & Preisquellen', items: [
      { label: `Comparis «Was zahlt die Nachbarschaft»`, url: 'https://www.comparis.ch/immobilien/mashup/show' },
      { label: `Comparis Quadratmeterpreise ${ortName || 'Kanton Zug'}`, url: comparisGemUrl },
      { label: 'RealAdvisor Immobilienpreise Kanton Zug', url: 'https://realadvisor.ch/de/immobilienpreise-pro-m2/kanton-zug' },
      { label: `Bodenpreise ${ortName || 'Kanton Zug'} (immobilienindex.ch)`, url: bodenUrl },
    ]},
    { section: 'Amtliche Quellen', items: [
      ...(egrid ? [
        { label: 'ÖREB-Kataster (Eigentumsbeschränkungen)', url: `https://www.cadastre.ch/de/oereb.html?egrid=${egrid}` },
        { label: 'ZugMap — Detailansicht', url: `https://zugmap.ch/bmcl/?egrid=${egrid}` },
      ] : []),
      { label: 'Grundbuchauszug bestellen (Kanton Zug, ab CHF 45)', url: 'https://www.zg.ch/behoerden/volkswirtschaftsdirektion/grundbuchamt/grundbuchauszug' },
      { label: 'Eigentümerauskunft (Kanton Zug)', url: 'https://www.zg.ch/behoerden/volkswirtschaftsdirektion/grundbuchamt/eigentuemerauskunft' },
      { label: 'Zefix — Firmensuche (Eigentümer)', url: 'https://www.zefix.admin.ch/de/search/entity/list' },
      { label: 'map.geo.admin.ch', url: `https://map.geo.admin.ch/?topic=ech&bgLayer=ch.swisstopo.pixelkarte-farbe&E=${Math.round(e)}&N=${Math.round(n)}&zoom=12&layers=ch.bfs.gebaeude_wohnungs_register,ch.kantone.cadastralwebmap-farbe` },
      { label: 'sonnendach.ch — Solarpotenzial', url: 'https://www.sonnendach.ch/de' },
    ]},
  ];

  return (
    <div className="p-4 border-b border-border">
      <div className="font-mono text-[10px] text-muted tracking-[1.5px] uppercase mb-3">
        WEITERE INFORMATIONEN &amp; LINKS
      </div>
      <div className="flex flex-col gap-2">
        {links.map((group) => (
          <div key={group.section}>
            <div className="font-mono text-[9px] text-muted mb-1">{group.section}</div>
            {group.items.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[12px] text-accent2 border-b border-transparent hover:border-accent2/30 py-0.5 no-underline"
              >
                &rarr; {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
