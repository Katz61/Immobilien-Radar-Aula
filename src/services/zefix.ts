import type { Company, OwnerInfo } from '../types';
import { decodeGkat, decodeGklas } from '../utils/decoders';
import type { BuildingProperties } from '../types';

export async function fetchCompaniesAtAddress(street: string, locality: string): Promise<Company[]> {
  if (!street || !locality) return [];
  try {
    const houseNumMatch = street.match(/\s+(\d+[a-zA-Z]?)\s*$/);
    const houseNum = houseNumMatch ? houseNumMatch[1] : '';
    const streetName = street.replace(/\s*\d+[a-zA-Z]?\.?\s*$/, '').replace(/\s+/g, ' ').trim();
    if (!streetName) return [];

    const streetFilterSparql = `FILTER(STRSTARTS(LCASE(?street), "${streetName.toLowerCase()} ") || LCASE(?street) = "${streetName.toLowerCase()}")`;

    const query = `
      PREFIX schema: <http://schema.org/>
      PREFIX admin: <https://schema.ld.admin.ch/>
      SELECT ?name ?type ?uid ?street WHERE {
        ?c a admin:ZefixOrganisation ;
           schema:name ?name ;
           schema:identifier ?uid ;
           schema:additionalType ?tid ;
           schema:address ?adr .
        ?tid schema:name ?type .
        FILTER(lang(?type)="de")
        ?adr schema:streetAddress ?street ;
             schema:addressLocality ?loc .
        FILTER(LCASE(?loc) = "${locality.toLowerCase()}")
        ${streetFilterSparql}
      } LIMIT 20
    `;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const resp = await fetch('https://ld.admin.ch/query', {
      method: 'POST',
      headers: {
        'Accept': 'application/sparql-results+json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'query=' + encodeURIComponent(query),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!resp.ok) return [];
    const data = await resp.json();

    let bindings: Array<{ name?: { value: string }; type?: { value: string }; uid?: { value: string }; street?: { value: string } }> =
      data.results?.bindings || [];

    if (houseNum && bindings.length > 0) {
      const exactMatches = bindings.filter((b) => {
        const regStreet = (b.street?.value || '').trim().toLowerCase();
        const inputAddr = street.trim().toLowerCase();
        if (regStreet === inputAddr) return true;
        const regNumMatch = regStreet.match(/\s+(\d+[a-z]?)\s*$/);
        const regNum = regNumMatch ? regNumMatch[1] : '';
        return regNum === houseNum.toLowerCase();
      });
      bindings = exactMatches;
    }

    const seen = new Set<string>();
    return bindings
      .filter((b) => {
        const name = b.name?.value || '';
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
      })
      .map((b) => {
        const rawUid = b.uid?.value || '';
        const cheMatch = rawUid.match(/CHE[\d.]+/);
        return {
          name: b.name?.value || '',
          type: b.type?.value || '',
          uid: cheMatch ? cheMatch[0] : '',
          street: b.street?.value || '',
        };
      });
  } catch (e) {
    console.warn('Zefix lookup failed:', e);
    return [];
  }
}

export function classifyOwnerType(companies: Company[], buildingData?: Partial<BuildingProperties>): OwnerInfo {
  const result: OwnerInfo = {
    type: 'Unbekannt',
    confidence: 'niedrig',
    companies: companies || [],
    hints: [],
  };

  if (companies && companies.length > 0) {
    const immoKeywords = ['immobilien', 'real estate', 'liegenschaft', 'holding', 'invest', 'property', 'verwaltung'];
    const hasImmoCompany = companies.some((c) =>
      immoKeywords.some((k) => c.name.toLowerCase().includes(k)),
    );
    if (hasImmoCompany) {
      result.type = 'Immobilienfirma';
      result.confidence = 'hoch';
      result.hints.push('Immobilien-/Verwaltungsfirma an Adresse registriert');
    } else {
      result.type = 'Firma';
      result.confidence = 'hoch';
      result.hints.push(`${companies.length} Firma(en) an Adresse registriert`);
    }
  }

  if (buildingData) {
    const bp = buildingData;
    const baujahr = bp.gbauj;
    const kat = (bp.gkat_text || decodeGkat(bp.gkat) || '').toLowerCase();
    const klasse = (bp.gklas_text || decodeGklas(bp.gklas) || '').toLowerCase();
    void klasse;

    if (baujahr && baujahr < 1970 && kat.includes('einfamilienhaus')) {
      result.hints.push('Einfamilienhaus vor 1970 \u2014 mögliche ältere Eigentümer');
      if (result.type === 'Unbekannt') {
        result.type = 'Privatperson (Potenzial)';
        result.confidence = 'mittel';
      }
    }

    if (baujahr && baujahr < 1950 && !companies?.length) {
      result.hints.push('Gebäude vor 1950 ohne Firmenregistrierung \u2014 wahrscheinlich Privatbesitz');
      if (result.type === 'Unbekannt' || result.type === 'Privatperson (Potenzial)') {
        result.type = 'Privatperson (Potenzial)';
        result.confidence = 'mittel';
      }
    }

    if (baujahr && baujahr < 1960 && (kat.includes('mehrfamilienhaus') || (bp.ganzwhg && bp.ganzwhg >= 2 && bp.ganzwhg <= 6))) {
      result.hints.push('Kleines MFH vor 1960 \u2014 typisch für Erbengemeinschaften');
      if (result.type === 'Unbekannt' || result.type === 'Privatperson (Potenzial)') {
        result.type = 'Erbengemeinschaft (Potenzial)';
        result.confidence = 'niedrig';
      }
    }
  }

  return result;
}
