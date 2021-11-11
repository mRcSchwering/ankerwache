export function toDMS(coordinate: number): string {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const mins = (absolute - degrees) * 60;
  const minsFlrd = Math.floor(mins);
  const seconds = Math.floor((mins - minsFlrd) * 6000) / 100;
  const s1 = degrees < 100 ? " " : "";
  const s2 = degrees < 10 ? " " : "";
  return s1 + s2 + degrees + "° " + minsFlrd + "' " + seconds + "''";
}

export function convertLatDMS(lng: number): string {
  const val = toDMS(lng);
  const card = lng >= 0 ? "N" : "S";
  return val + " " + card;
}

export function convertLngDMS(lng: number): string {
  const val = toDMS(lng);
  const card = lng >= 0 ? "E" : "W";
  return val + " " + card;
}

export function formatLocationAcc(acc: number | null): string {
  return acc ? `${Math.floor(acc)} m` : "unknown";
}

export function formatLocationTs(ts: number): string {
  return `${new Date(ts).toTimeString().slice(0, 12)}`;
}

export function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function rad2deg(rad: number): number {
  return rad * (180 / Math.PI);
}

export function getDistanceFromLatLonInM(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
  return 12742000 * Math.asin(Math.sqrt(a));
}

export function addErrs(e1: number, e2: number): number {
  return Math.sqrt(Math.pow(e1, 2) + Math.pow(e2, 2));
}

export function formatDistance(d: number | null, err: number | null): string {
  if (d === null) return " - ";
  const e = err !== null ? ` (+/- ${Math.round(err)})` : "";
  return `${Math.round(d)}${e} m`;
}

export function formatHeading(d?: number | null): string {
  if (d === undefined || d === null) return "-";
  if (d >= 100) return `${Math.round(d)}°`;
  if (d >= 10) return ` ${Math.round(d)}°`;
  return `  ${Math.round(d)}°`;
}

interface Coords {
  lat: number;
  lng: number;
}

const R_EARTH = 6371.01; // Earth's average radius in km
const EPS = 0.000001; // threshold for floating-point equality

/**
 *
 * Inspired by https://stackoverflow.com/questions/877524/calculating-coordinates-given-a-bearing-and-a-distance
 */
export function getCoordsFromVector(
  bear: number,
  dist: number,
  lat: number,
  lng: number
): Coords {
  const rlat = deg2rad(lat);
  const rlng = deg2rad(lng);
  const rbearing = deg2rad(bear);
  const rdist = dist / R_EARTH; // normalize linear distance to radian angle

  const rlat2 = Math.asin(
    Math.sin(rlat) * Math.cos(rdist) +
      Math.cos(rlat) * Math.sin(rdist) * Math.cos(rbearing)
  );

  let rlng2;
  if (Math.cos(rlat2) === 0 || Math.abs(Math.cos(rlat2)) < EPS) {
    // Endpoint a pole
    rlng2 = rlng;
  } else {
    rlng2 =
      ((rlng -
        Math.asin((Math.sin(rbearing) * Math.sin(rdist)) / Math.cos(rlat2)) +
        Math.PI) %
        (2 * Math.PI)) -
      Math.PI;
  }

  return { lat: rad2deg(rlat2), lng: rad2deg(rlng2) };
}
