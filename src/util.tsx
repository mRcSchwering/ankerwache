export function toDMS(coordinate: number): string {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const mins = (absolute - degrees) * 60;
  const minsFlrd = Math.floor(mins);
  const seconds = Math.floor((mins - minsFlrd) * 6000) / 100;
  return degrees + "° " + minsFlrd + "' " + seconds + "''";
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

export function formatDistance(d: number | null, err: number | null): string {
  if (d === null) return "-";
  const e = err !== null ? ` (+/- ${Math.round(err)})` : "";
  return `${Math.round(d)}${e} m`;
}
