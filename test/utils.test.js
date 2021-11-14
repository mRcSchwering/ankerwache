import { getCoordsFromVector, getDistanceFromLatLonInM } from "../src/util";

const getCoordsFromVectorCases = [
  [0.0, 1.0, 0.0, 0.0, 0.01, 0.0],
  [90.0, 1.0, 0.0, 0.0, 0.0, -0.01],
  [0.0, 100.0, 0.0, 0.0, 0.9, 0.0],
  [90.0, 100.0, 0.0, 0.0, 0.0, -0.9],
  [225, 1, 49.26, -123.14, 49.25, -123.13],
  [225, 100, 49.26, -123.14, 48.62, -122.18],
  [225, 1000, 49.26, -123.14, 42.55, -114.51],
];

describe("getCoordsFromVector", () => {
  test.each(getCoordsFromVectorCases)(
    "bear %p, dist %p, lat1 %p, lng1 %p => lat2 %p, lng2 %p",
    (bear, dist, lat1, lng1, lat2, lng2) => {
      const res = getCoordsFromVector(bear, dist, lat1, lng1);
      expect(res.lat).toBeCloseTo(lat2);
      expect(res.lng).toBeCloseTo(lng2);
    }
  );
});

const getDistanceFromLatLonInMCases = [
  [0, 0, 0, 0, 0.0],
  [0, 0, 0, 1, 111.194],
  [0, 0, 1, 1, 157.249],
  [49.26, -123.14, 49.25, -123.13, 1.328],
  [49.26, -123.14, 48.62, -122.18, 99.902],
  [49.26, -123.14, 42.55, -114.51, 1000],
];

describe("getDistanceFromLatLonInM", () => {
  test.each(getDistanceFromLatLonInMCases)(
    "lat1 %p, lng1 %p, lat2 %p, lng2 %p => dist %p",
    (lat1, lng1, lat2, lng2, dist) => {
      const res = getDistanceFromLatLonInM(lat1, lng1, lat2, lng2);
      expect(res / 1000).toBeCloseTo(dist);
    }
  );
});
