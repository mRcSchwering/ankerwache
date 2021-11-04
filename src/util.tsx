export function toDMS(coordinate: number): string {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const mins = (absolute - degrees) * 60;
  const minsFlrd = Math.floor(mins);
  const seconds = Math.floor((mins - minsFlrd) * 60);
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
  return `${new Date(ts).toISOString()}`;
}
