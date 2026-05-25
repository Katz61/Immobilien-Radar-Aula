import type { GemeindeInfo } from '../types';

export const GEMEINDEN: Record<string, GemeindeInfo> = {
  'Zug':         { lat: 47.1662, lon: 8.5159, bbox: [8.48, 47.13, 8.56, 47.20] },
  'Baar':        { lat: 47.1965, lon: 8.5287, bbox: [8.49, 47.17, 8.58, 47.23] },
  'Cham':        { lat: 47.1824, lon: 8.4614, bbox: [8.42, 47.16, 8.50, 47.22] },
  'Steinhausen': { lat: 47.1957, lon: 8.4901, bbox: [8.47, 47.18, 8.52, 47.21] },
  'Risch':       { lat: 47.1420, lon: 8.4351, bbox: [8.40, 47.12, 8.48, 47.18] },
  'Hünenberg':   { lat: 47.1766, lon: 8.4323, bbox: [8.40, 47.15, 8.47, 47.20] },
  'Menzingen':   { lat: 47.1784, lon: 8.5928, bbox: [8.55, 47.15, 8.64, 47.21] },
  'Neuheim':     { lat: 47.2040, lon: 8.5797, bbox: [8.55, 47.19, 8.61, 47.22] },
  'Oberägeri':   { lat: 47.1367, lon: 8.6199, bbox: [8.57, 47.10, 8.67, 47.17] },
  'Unterägeri':  { lat: 47.1383, lon: 8.5812, bbox: [8.54, 47.11, 8.62, 47.17] },
  'Walchwil':    { lat: 47.1016, lon: 8.5216, bbox: [8.49, 47.08, 8.56, 47.12] },
};
